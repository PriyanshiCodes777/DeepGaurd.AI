from pathlib import Path

from flask import Blueprint, jsonify, request, send_file

from app.services.detection_service import DetectionService

api = Blueprint('api', __name__)
service = DetectionService()


@api.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})


@api.route('/detect/upload', methods=['POST'])
def detect_upload():
    if 'video' not in request.files:
        return jsonify({'error': 'Missing video file'}), 400

    file = request.files['video']
    uploads = Path('uploads')
    uploads.mkdir(exist_ok=True)
    video_path = uploads / file.filename
    file.save(video_path)

    try:
        output = service.analyze_video(str(video_path))
    except ValueError as exc:
        return jsonify({'error': str(exc)}), 400
    finally:
        if video_path.exists():
            video_path.unlink()

    return jsonify(output)


@api.route('/detect/webcam', methods=['POST'])
def detect_webcam():
    payload = request.get_json(silent=True) or {}
    frame = payload.get('frame')
    if not frame:
        return jsonify({'error': 'Missing frame'}), 400
    output = service.analyze_webcam_frame(frame)
    return jsonify(output)


@api.route('/report/<report_id>', methods=['GET'])
def download_report(report_id):
    report_path = Path('reports') / f'{report_id}.json'
    if not report_path.exists():
        return jsonify({'error': 'Report not found'}), 404
    return send_file(report_path, as_attachment=True, download_name=f'deepguard-report-{report_id}.json')
