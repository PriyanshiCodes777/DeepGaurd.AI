import base64
import uuid
from io import BytesIO

import cv2
import numpy as np
from PIL import Image


FACE_CASCADE = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')


def decode_base64_frame(frame_data):
    _, encoded = frame_data.split(',', 1)
    img_bytes = base64.b64decode(encoded)
    arr = np.frombuffer(img_bytes, np.uint8)
    return cv2.imdecode(arr, cv2.IMREAD_COLOR)


def sample_video_frames(video_path, max_frames=24):
    capture = cv2.VideoCapture(video_path)
    total = int(capture.get(cv2.CAP_PROP_FRAME_COUNT))
    step = max(total // max_frames, 1)
    frames = []
    idx = 0

    while capture.isOpened():
        ret, frame = capture.read()
        if not ret:
            break
        if idx % step == 0:
            frames.append(frame)
        idx += 1
        if len(frames) >= max_frames:
            break

    capture.release()
    return frames


def detect_face(frame):
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = FACE_CASCADE.detectMultiScale(gray, 1.2, 5)
    if len(faces) == 0:
        return frame
    x, y, w, h = max(faces, key=lambda f: f[2] * f[3])
    return frame[y:y + h, x:x + w]


def preprocess_for_model(face):
    resized = cv2.resize(face, (128, 128))
    rgb = cv2.cvtColor(resized, cv2.COLOR_BGR2RGB)
    arr = rgb.astype(np.float32) / 255.0
    arr = np.transpose(arr, (2, 0, 1))[None, ...]
    return arr


def create_gradcam_like_overlay(frame, fake_probability):
    heat = cv2.GaussianBlur(frame, (0, 0), sigmaX=15)
    overlay = cv2.addWeighted(frame, 0.5, heat, 0.5, 0)
    overlay = cv2.applyColorMap(overlay, cv2.COLORMAP_JET)
    blended = cv2.addWeighted(frame, 0.65, overlay, min(max(fake_probability, 0.2), 0.8), 0)
    return blended


def encode_image(image):
    rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    pil_img = Image.fromarray(rgb)
    buffer = BytesIO()
    pil_img.save(buffer, format='JPEG', quality=90)
    return base64.b64encode(buffer.getvalue()).decode('utf-8')


def gen_report_id():
    return str(uuid.uuid4())
