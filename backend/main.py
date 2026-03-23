from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import generate, verify
import uvicorn

app = FastAPI(title="QR Platform API", version="1.0.0")

# Configure CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(generate.router, prefix="/api", tags=["Generate"])
app.include_router(verify.router, prefix="/api", tags=["Verify"])

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "qr-platform-backend"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)
