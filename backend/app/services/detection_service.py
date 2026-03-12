from datetime import datetime
from pathlib import Path
import json

import numpy as np
import torch

from app.models.deepfake_model import DeepfakeInferenceModel
from app.utils.video_processing import (
    create_gradcam_like_overlay,
    decode_base64_frame,
    detect_face,
    encode_image,
    gen_report_id,
    preprocess_for_model,
    sample_video_frames,
)


class DetectionService:
    def __init__(self):
        self.model = DeepfakeInferenceModel()
        self.reports_dir = Path('reports')
        self.reports_dir.mkdir(parents=True, exist_ok=True)

    def _predict_from_frame(self, frame):
        face = detect_face(frame)
        tensor = torch.tensor(preprocess_for_model(face), dtype=torch.float32)
        fake_probability = self.model.predict(tensor)
        label = 'FAKE' if fake_probability >= 0.5 else 'REAL'
        confidence = fake_probability if label == 'FAKE' else 1 - fake_probability
        heatmap = create_gradcam_like_overlay(face, fake_probability)
        return {
            'label': label,
            'confidence': confidence,
            'fake_probability': fake_probability,
            'heatmap_image': encode_image(heatmap),
            'original_frame': encode_image(face),
        }

    def analyze_video(self, video_path):
        frames = sample_video_frames(video_path)
        if not frames:
            raise ValueError('No frames found in uploaded video')

        frame_predictions = [self._predict_from_frame(frame) for frame in frames]
        fake_probs = np.array([p['fake_probability'] for p in frame_predictions], dtype=float)
        avg_fake = float(fake_probs.mean())
        label = 'FAKE' if avg_fake >= 0.5 else 'REAL'
        confidence = avg_fake if label == 'FAKE' else 1 - avg_fake

        final = frame_predictions[-1]
        payload = {
            'label': label,
            'confidence': confidence,
            'trust_score': 1 - avg_fake,
            'heatmap_image': final['heatmap_image'],
            'original_frame': final['original_frame'],
            'timeline': [
                {'frame_index': idx, 'fake_probability': item['fake_probability']}
                for idx, item in enumerate(frame_predictions)
            ],
        }
        payload['report_id'] = self._write_report(payload)
        return payload

    def analyze_webcam_frame(self, frame_base64):
        frame = decode_base64_frame(frame_base64)
        result = self._predict_from_frame(frame)
        result['trust_score'] = 1 - result['fake_probability']
        result['frame_prediction'] = {
            'timestamp': datetime.utcnow().isoformat(),
            'fake_probability': result['fake_probability'],
        }
        result['report_id'] = self._write_report(result)
        return result

    def _write_report(self, payload):
        report_id = gen_report_id()
        report_path = self.reports_dir / f'{report_id}.json'
        report_path.write_text(json.dumps(payload, indent=2), encoding='utf-8')
        return report_id
