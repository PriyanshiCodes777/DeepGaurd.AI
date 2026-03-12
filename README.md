# DeepGuard AI – Real-Time Deepfake Detection Web Suite

DeepGuard AI is a production-ready full-stack application for deepfake detection from uploaded videos and live webcam feeds.

## Tech Stack
- **Frontend:** React + Tailwind CSS + Framer Motion
- **Backend:** Flask API
- **Computer Vision:** OpenCV frame sampling and face extraction
- **Deep Learning:** PyTorch inference adapter (plug in your trained checkpoint)
- **Explainability:** Grad-CAM-style heatmap overlay visualization

## Project Structure
```
DeepGaurd.AI/
├── frontend/                 # React app (landing + dashboard UI)
│   ├── src/components/       # Reusable UI modules (cards, charts, trust meter)
│   ├── src/pages/            # Landing page + detection dashboard
│   └── src/lib/api.js        # API communication layer
├── backend/
│   ├── app/models/           # Deepfake model and inference adapter
│   ├── app/services/         # Detection orchestration service
│   ├── app/utils/            # OpenCV preprocessing and image helpers
│   ├── app/routes.py         # Flask endpoints
│   └── run.py                # Flask entrypoint
└── README.md
```

## Key Features
- Modern AI SaaS-style landing experience with animated feature cards.
- Detection dashboard with:
  - Drag-and-drop video upload
  - Webcam live detection stream
  - Trust score progress bar
  - Real/Fake label and confidence display
  - Prediction timeline chart
  - Explainability panel (heatmap/original toggle)
  - Downloadable report
- Backend pipeline:
  - Video frame extraction and sampling with OpenCV
  - Face detection with Haar cascade
  - Deepfake frame inference via PyTorch adapter
  - Frame aggregation into final trust score and prediction
  - Report generation endpoint

## Local Development
### 1) Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python run.py
```

### 2) Frontend
```bash
cd frontend
npm install
npm run dev
```

By default:
- Frontend runs on `http://localhost:5173`
- Backend runs on `http://localhost:5000`

Set `VITE_API_URL` if API is hosted elsewhere.

## Model Integration Notes
`backend/app/models/deepfake_model.py` contains a lightweight PyTorch network for demonstration and a clean adapter pattern (`DeepfakeInferenceModel`) for loading a trained checkpoint.

Replace with your trained model and normalization pipeline for production inference.
