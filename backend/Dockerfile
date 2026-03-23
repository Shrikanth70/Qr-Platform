FROM python:3.10-slim

# Install system dependencies required by opencv-python and pyzbar
RUN apt-get update && apt-get install -y \
    libzbar0 \
    libgl1-mesa-glx \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Render passes the port via the PORT environment variable
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-5000}
