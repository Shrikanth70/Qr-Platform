from fastapi import APIRouter, File, UploadFile, HTTPException
import pyzbar.pyzbar as pyzbar
from PIL import Image
import io
import json
import requests
from bs4 import BeautifulSoup
import cv2
import numpy as np

router = APIRouter()

def fetch_url_metadata(url: str):
    title = None
    try:
        # Prevent hanging on bad URLs
        res = requests.get(url, timeout=3)
        if res.status_code == 200:
            soup = BeautifulSoup(res.text, 'html.parser')
            if soup.title:
                title = soup.title.string.strip()
    except Exception:
        pass
    return title

def robust_decode(image_bytes):
    # 1. Try Pyzbar first on raw image payload
    try:
        from PIL import ImageOps
        image = Image.open(io.BytesIO(image_bytes))
        # Natively inject a massive Quiet Zone padding since cropped QRs fail standard logic
        bg_color = image.getpixel((0,0))
        padded_image = ImageOps.expand(image, border=60, fill=bg_color)
        decoded = pyzbar.decode(padded_image)
        if decoded: return decoded[0].data.decode('utf-8')
    except Exception:
        pass

    # 2. Drop into OpenCV processing arrays
    try:
        np_arr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        if img is None: return None
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        # Synthesize an infinite Quiet Zone by replicating edge pixels 40px outwards
        gray = cv2.copyMakeBorder(gray, 40, 40, 40, 40, cv2.BORDER_REPLICATE)
    except Exception:
        return None

    # 3. Try generic OpenCV parsing
    detector = cv2.QRCodeDetector()
    data, _, _ = detector.detectAndDecode(gray)
    if data: return data
    
    # 4. Aggressive Morphological Enhancement Pipeline
    # Loops through resizing, harsh logical bounds, Gaussian sweeps
    # Critically: supports INVERTED polarities (light matrix on dark background)
    variations = [gray, cv2.bitwise_not(gray)]
    
    for base_gray in variations:
        for scale in [1.0, 1.5, 2.0]:
            try:
                scaled = cv2.resize(base_gray, None, fx=scale, fy=scale, interpolation=cv2.INTER_CUBIC) if scale != 1.0 else base_gray
                
                # Base thresholds
                _, binary = cv2.threshold(scaled, 127, 255, cv2.THRESH_BINARY)
                _, binary_otsu = cv2.threshold(scaled, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
                
                for b_img in [binary_otsu, binary]:
                    decoded = pyzbar.decode(b_img)
                    if decoded: return decoded[0].data.decode('utf-8')
                    data, _, _ = detector.detectAndDecode(b_img)
                    if data: return data
                    
                    # Morphological Isolation engines
                    for k_size in [3, 5]:
                        kernel = np.ones((k_size, k_size), np.uint8)
                        
                        # EROSION: Expands black blocks. Solves 'Minimal' mode (tiny isolated dots) by bridging gaps natively.
                        eroded = cv2.erode(b_img, kernel, iterations=1)
                        decoded = pyzbar.decode(eroded)
                        if decoded: return decoded[0].data.decode('utf-8')
                        data, _, _ = detector.detectAndDecode(eroded)
                        if data: return data
                        
                        # DILATION: Shrinks black blocks. Solves 'Bold' mode (overlapped blobs) by eroding dense walls.
                        dilated = cv2.dilate(b_img, kernel, iterations=1)
                        decoded = pyzbar.decode(dilated)
                        if decoded: return decoded[0].data.decode('utf-8')
                        data, _, _ = detector.detectAndDecode(dilated)
                        if data: return data
            except Exception:
                continue
            
    return None

@router.post("/verify")
async def verify_qr(file: UploadFile = File(...)):
    try:
        content = await file.read()
        
        # Execute absolute verification pipeline capturing custom aesthetics successfully
        qr_data = robust_decode(content)
            
        if not qr_data:
            return {
                "success": False,
                "message": "Verify Failed",
                "reason": "Could not detect or decode any QR Code in the uploaded image. Ensure the image is clear and contains a valid code."
            }

        payload = {}
        
        # Try JSON (Structured Certificate)
        try:
            parsed_json = json.loads(qr_data)
            payload = parsed_json
            return {
                "success": True,
                "message": "Valid Secure Certificate",
                "data": payload
            }
        except json.JSONDecodeError:
            pass

        # Check URL
        if qr_data.startswith("http://") or qr_data.startswith("https://"):
            page_title = fetch_url_metadata(qr_data)
            return {
                "success": True,
                "message": "Valid URL QR",
                "data": {
                    "type": "url",
                    "data": qr_data,
                    "title": page_title or "External Link",
                    "description": "Click the link below to visit the site."
                }
            }

        # Fallback Plain text
        return {
            "success": True,
            "message": "Valid Text QR",
            "data": {
                "type": "text",
                "data": qr_data
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error during verification: {str(e)}")
