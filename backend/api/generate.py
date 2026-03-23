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

@router.post("/generate")
def generate_qr(req: GenerateRequest):
    try:
        # High error correction is critical to allow robust shape clipping and masks on the frontend
        qr = qrcode.QRCode(
            version=None,
            error_correction=qrcode.constants.ERROR_CORRECT_H,
            box_size=10,
            border=4,
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
