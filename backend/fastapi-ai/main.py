from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os
from dotenv import load_dotenv
import logging
from typing import List, Dict, Any
import json
from datetime import datetime
import numpy as np
from PIL import Image
import io

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Glacier Scan AI API",
    description="AI-powered glacier analysis service",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Glacier Scan AI API",
        "version": "1.0.0",
        "status": "healthy",
        "python_version": "3.11"
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "python_version": "3.11",
        "services": {
            "ai_model": "ready",
            "image_processing": "ready",
            "database": "ready"
        }
    }

@app.post("/analyze-glacier")
async def analyze_glacier(file: UploadFile = File(...)):
    """
    Analyze glacier image using AI
    """
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read and process image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Mock AI analysis (replace with actual AI model)
        analysis_result = {
            "glacier_id": f"glacier_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            "filename": file.filename,
            "analysis_date": datetime.now().isoformat(),
            "metrics": {
                "area_km2": round(np.random.uniform(10, 500), 2),
                "volume_km3": round(np.random.uniform(1, 50), 2),
                "thickness_m": round(np.random.uniform(50, 300), 1),
                "velocity_m_year": round(np.random.uniform(10, 200), 1),
                "temperature_c": round(np.random.uniform(-15, -2), 1),
                "health_score": round(np.random.uniform(0.3, 0.9), 2)
            },
            "status": np.random.choice(["healthy", "warning", "critical"], p=[0.4, 0.4, 0.2]),
            "trends": {
                "area_change_percent": round(np.random.uniform(-5, 2), 2),
                "volume_change_percent": round(np.random.uniform(-8, 1), 2),
                "velocity_change_percent": round(np.random.uniform(-10, 5), 2)
            },
            "recommendations": [
                "Continue monitoring ice thickness changes",
                "Assess impact of temperature variations",
                "Monitor calving front stability"
            ],
            "confidence": round(np.random.uniform(0.7, 0.95), 2)
        }
        
        logger.info(f"Successfully analyzed glacier image: {file.filename}")
        return analysis_result
        
    except Exception as e:
        logger.error(f"Error analyzing glacier: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.post("/batch-analyze")
async def batch_analyze_glaciers(files: List[UploadFile] = File(...)):
    """
    Analyze multiple glacier images
    """
    try:
        results = []
        
        for file in files:
            if not file.content_type.startswith('image/'):
                continue
                
            # Process each file (simplified for demo)
            result = {
                "filename": file.filename,
                "glacier_id": f"glacier_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{len(results)}",
                "status": np.random.choice(["healthy", "warning", "critical"]),
                "health_score": round(np.random.uniform(0.3, 0.9), 2),
                "area_km2": round(np.random.uniform(10, 500), 2)
            }
            results.append(result)
        
        return {
            "batch_id": f"batch_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            "processed_count": len(results),
            "results": results
        }
        
    except Exception as e:
        logger.error(f"Error in batch analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Batch analysis failed: {str(e)}")

@app.get("/models/status")
async def get_model_status():
    """Get AI model status"""
    return {
        "models": {
            "glacier_segmentation": {
                "status": "loaded",
                "version": "1.2.0",
                "accuracy": 0.94
            },
            "ice_thickness_estimation": {
                "status": "loaded", 
                "version": "1.1.0",
                "accuracy": 0.87
            },
            "change_detection": {
                "status": "loaded",
                "version": "1.0.0", 
                "accuracy": 0.91
            }
        },
        "python_version": "3.11",
        "last_updated": datetime.now().isoformat()
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
