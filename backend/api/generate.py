from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import qrcode

router = APIRouter()

class GenerateRequest(BaseModel):
    text: str
    title: Optional[str] = None
    description: Optional[str] = None
    type: Optional[str] = "link"
    pattern: Optional[str] = "Classic"
    size: Optional[int] = 512
    color: Optional[str] = "#000000"
    bgColor: Optional[str] = "#ffffff"
    expiresIn: Optional[int] = 60
    quietZone: Optional[int] = 2

@router.post("/generate")
def generate_qr(req: GenerateRequest):
    try:
        # Calculate box_size based on requested pixel dimension (assume approx 33 modules for standard layout)
        calculated_box_size = max(1, req.size // 33) if req.size else 10

        # Ensure the backend QR logical border reflects the exact user request instead of hardcoding 4
        border_size = req.quietZone if req.quietZone is not None else 2
        
        qr = qrcode.QRCode(
            version=None,
            error_correction=qrcode.constants.ERROR_CORRECT_H,
            box_size=calculated_box_size,
            border=border_size,
        )
        qr.add_data(req.text)
        qr.make(fit=True)

        # Get the core boolean array representation of the QR data
        matrix = qr.get_matrix()
        
        return {
            "success": True,
            "message": "QR Matrix generated successfully",
            "qrCode": matrix, # Return the raw boolean 2D array
            "pattern": req.pattern,
            "format": "vector"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
