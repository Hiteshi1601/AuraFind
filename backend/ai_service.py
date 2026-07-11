import os
import uvicorn
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import shutil
import io

app = FastAPI(title="AuraFind AI Microservice", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Optional lazy-loading of ML frameworks to prevent crash if not installed
YOLO_AVAILABLE = False
CLIP_AVAILABLE = False

try:
    from ultralytics import YOLO
    yolo_model = YOLO("yolov8n.pt")
    YOLO_AVAILABLE = True
    print("YOLOv8 Object Detection loaded successfully.")
except Exception as e:
    print(f"YOLOv8 not loaded (run 'pip install ultralytics'): {e}")

try:
    import torch
    from transformers import CLIPProcessor, CLIPModel
    clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
    clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
    CLIP_AVAILABLE = True
    print("CLIP Multi-Modal Embeddings model loaded successfully.")
except Exception as e:
    print(f"CLIP not loaded (run 'pip install transformers torch'): {e}")

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "yolo_loaded": YOLO_AVAILABLE,
        "clip_loaded": CLIP_AVAILABLE
    }

@app.post("/detect")
async def detect_objects(image: UploadFile = File(...)):
    """
    Runs YOLOv8 object detection on the uploaded image and returns bounding box details.
    """
    temp_path = f"temp_{image.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    try:
        if not YOLO_AVAILABLE:
            # Fallback simulator responses
            return {
                "detected": True,
                "engine": "simulator",
                "boxes": [
                    {"label": "backpack", "confidence": 0.945, "box": [45, 120, 280, 390]},
                    {"label": "laptop", "confidence": 0.882, "box": [290, 150, 480, 360]}
                ]
            }

        # Real YOLOv8 inference
        results = yolo_model(temp_path)
        boxes = []
        for box in results[0].boxes:
            class_id = int(box.cls[0])
            label = yolo_model.names[class_id]
            confidence = float(box.conf[0])
            x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
            boxes.append({
                "label": label,
                "confidence": confidence,
                "box": [x1, y1, x2, y2]
            })

        return {
            "detected": len(boxes) > 0,
            "engine": "YOLOv8-live",
            "boxes": boxes
        }
    except Exception as e:
        return {"error": str(e)}
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.post("/embed")
async def generate_embeddings(text: str = Form(None), image: UploadFile = File(None)):
    """
    Generates 512-dimensional vector embeddings using CLIP.
    """
    if not CLIP_AVAILABLE:
        # Fallback simulator: Create a pseudo-random normalized 512 vector
        import random
        random.seed(len(text or "") + (image.filename if image else "").__hash__())
        mock_vec = [random.uniform(-0.1, 0.1) for _ in range(512)]
        # Normalize
        norm = sum(x**2 for x in mock_vec)**0.5
        mock_vec = [x / norm for x in mock_vec]
        return {"engine": "simulator", "embedding": mock_vec}

    try:
        features = None
        if text:
            inputs = clip_processor(text=[text], return_tensors="pt")
            with torch.no_grad():
                features = clip_model.get_text_features(**inputs)
        elif image:
            # Load image from upload
            from PIL import Image
            img_data = await image.read()
            img = Image.open(io.BytesIO(img_data))
            inputs = clip_processor(images=img, return_tensors="pt")
            with torch.no_grad():
                features = clip_model.get_image_features(**inputs)

        if features is not None:
            # Normalize vector
            features = features / features.norm(p=2, dim=-1, keepdim=True)
            return {"engine": "CLIP-live", "embedding": features[0].tolist()}
        return {"error": "Provide either text or image parameters."}
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    print("Starting AuraFind AI Microservice on http://localhost:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)
