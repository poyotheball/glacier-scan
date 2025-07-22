from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os
from dotenv import load_dotenv
import numpy as np
from PIL import Image
import io
import logging
from typing import Dict, Any, List
import json

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

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock AI analysis function
def analyze_glacier_image(image_data: bytes) -> Dict[str, Any]:
    """
    Mock glacier analysis function.
    In production, this would use actual AI models.
    """
    try:
        # Load image
        image = Image.open(io.BytesIO(image_data))
        width, height = image.size
        
        # Mock analysis results
        analysis_result = {
            "glacier_id": f"glacier_{hash(image_data) % 10000}",
            "health_score": np.random.randint(60, 95),
            "area_km2": round(np.random.uniform(10.5, 150.8), 2),
            "ice_thickness_m": round(np.random.uniform(50, 300), 1),
            "retreat_rate_m_year": round(np.random.uniform(5, 25), 2),
            "temperature_trend": round(np.random.uniform(0.5, 2.5), 2),
            "confidence": round(np.random.uniform(0.85, 0.98), 3),
            "image_dimensions": {
                "width": width,
                "height": height
            },
            "analysis_timestamp": "2024-01-15T10:30:00Z",
            "recommendations": [
                "Continue monitoring ice thickness changes",
                "Implement temperature sensors for real-time data",
                "Schedule follow-up analysis in 6 months"
            ],
            "risk_factors": [
                "Accelerated melting due to rising temperatures",
                "Potential calving events in the terminus region",
                "Seasonal variation in ice flow velocity"
            ],
            "metadata": {
                "model_version": "glacier-ai-v2.1",
                "processing_time_ms": np.random.randint(1500, 3000),
                "image_quality": "high"
            }
        }
        
        return analysis_result
        
    except Exception as e:
        logger.error(f"Error analyzing image: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

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
        "python_version": "3.11",
        "services": {
            "ai_model": "ready",
            "image_processing": "ready",
            "database": "ready"
        },
        "timestamp": "2024-01-15T10:30:00Z"
    }

@app.post("/analyze")
async def analyze_glacier(file: UploadFile = File(...)):
    """
    Analyze a glacier image and return AI-powered insights
    """
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read image data
        image_data = await file.read()
        
        # Validate file size (max 10MB)
        if len(image_data) > 10 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File size too large (max 10MB)")
        
        # Perform analysis
        analysis_result = analyze_glacier_image(image_data)
        
        logger.info(f"Successfully analyzed glacier image: {file.filename}")
        
        return JSONResponse(content={
            "success": True,
            "filename": file.filename,
            "analysis": analysis_result
        })
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/batch-analyze")
async def batch_analyze_glaciers(files: List[UploadFile] = File(...)):
    """
    Analyze multiple glacier images in batch
    """
    try:
        if len(files) > 10:
            raise HTTPException(status_code=400, detail="Maximum 10 files allowed per batch")
        
        results = []
        
        for file in files:
            if not file.content_type.startswith('image/'):
                results.append({
                    "filename": file.filename,
                    "success": False,
                    "error": "File must be an image"
                })
                continue
            
            try:
                image_data = await file.read()
                analysis_result = analyze_glacier_image(image_data)
                
                results.append({
                    "filename": file.filename,
                    "success": True,
                    "analysis": analysis_result
                })
                
            except Exception as e:
                results.append({
                    "filename": file.filename,
                    "success": False,
                    "error": str(e)
                })
        
        return JSONResponse(content={
            "success": True,
            "batch_size": len(files),
            "results": results
        })
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Batch analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail="Batch analysis failed")

@app.get("/models")
async def get_available_models():
    """
    Get information about available AI models
    """
    return {
        "models": [
            {
                "name": "glacier-ai-v2.1",
                "description": "Advanced glacier analysis model",
                "version": "2.1.0",
                "capabilities": [
                    "Ice thickness estimation",
                    "Health score calculation",
                    "Retreat rate analysis",
                    "Temperature trend detection"
                ],
                "accuracy": 0.94,
                "status": "active"
            },
            {
                "name": "glacier-classifier-v1.5",
                "description": "Glacier type classification model",
                "version": "1.5.0",
                "capabilities": [
                    "Glacier type identification",
                    "Ice formation analysis",
                    "Seasonal variation detection"
                ],
                "accuracy": 0.89,
                "status": "active"
            }
        ]
    }

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info"
    )
