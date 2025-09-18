# mobile_integration_system.py  (unified server)
import json, statistics, os, time, shutil
from collections import Counter
from flask import Flask, request, jsonify
import logging
from datetime import datetime, timezone

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ---------- mobile engines ----------
try:
    from mobile_cheat_detection_engine import MobileCheatDetectionEngine
    from mobile_sports_assessment_engine import MobileSportsAssessmentEngine
except ImportError as e:
    logger.warning(f"Mobile engines not found: {e} — stubbing for now")
    MobileCheatDetectionEngine = None
    MobileSportsAssessmentEngine = None

# ---------- helpers ----------
def safe_get(data, path, default=0):
    for key in path:
        if isinstance(data, dict):
            data = data.get(key, default)
        elif isinstance(data, list) and isinstance(key, int):
            data = data[key] if key < len(data) else default
        else:
            return default
    return data if data is not None else default

# ---------- benchmark ----------
BENCHMARKS = {
    "pushups":     {"target": 30, "unit": "reps", "max_points": 20},
    "situps":      {"target": 35, "unit": "reps", "max_points": 20},
    "squats":      {"target": 45, "unit": "reps", "max_points": 20},
    "vertical_jump": {"target": 25, "unit": "cm", "max_points": 20},
    "long_jump":   {"target": 150, "unit": "cm", "max_points": 20},
}

def calc_points(exercise, value):
    if value <= 0:
        return 0
    cfg = BENCHMARKS[exercise]
    pts = (value / cfg["target"]) * cfg["max_points"]
    return min(cfg["max_points"], max(0, round(pts, 1)))

def benchmark_check(exercise, value):
    return "✅ benchmark passed" if value >= BENCHMARKS[exercise]["target"] else \
           f"📈 needs improvement ({value} < {BENCHMARKS[exercise]['target']} {BENCHMARKS[exercise]['unit']})"

# ---------- mobile integration class ----------
class MobileIntegrationSystem:
    def __init__(self, reference_images_folder=None):
        logger.info("🚀 Initializing Mobile Integration System...")
        self.cheat_detector = MobileCheatDetectionEngine(reference_images_folder=reference_images_folder) \
            if MobileCheatDetectionEngine else None
        self.sports_analyzer = MobileSportsAssessmentEngine() \
            if MobileSportsAssessmentEngine else None
        logger.info("✅ Mobile Integration System ready!")

    # original mobile-complete analyser (unchanged)
    def analyze_video_mobile_complete(self, video_path, exercise_type, user_id, user_base_dir, ref_dir=None,
                                    generate_video=True, save_json=True):
        logger.info(f"📱 Starting mobile analysis: {video_path}")
        start = time.time()
        try:
            if ref_dir:
                self.cheat_detector.reference_images_folder = ref_dir
                self.cheat_detector.reference_images = self.cheat_detector._load_reference_images()

            cheat_start = time.time()
            cheat_results = self.cheat_detector.analyze_video_mobile(video_path, exercise_type)
            cheat_time = time.time() - cheat_start

            sports_start = time.time()
            sports_results = self.sports_analyzer.analyze_video_mobile(
                video_path, exercise_type, user_height_cm=170, generate_video=generate_video, save_json=False)
            sports_time = time.time() - sports_start

            final_results = self._create_mobile_results(cheat_results, sports_results, cheat_time, sports_time)
            final_results['total_processing_time'] = float(time.time() - start)

            if save_json:
                json_dir = os.path.join(user_base_dir, "json_result")
                os.makedirs(json_dir, exist_ok=True)
                json_filename = f"mobile_complete_{exercise_type}_{int(time.time())}.json"
                json_path = os.path.join(json_dir, json_filename)
                with open(json_path, 'w') as f:
                    json.dump(final_results, f, indent=2)
                final_results['saved_json'] = json_filename  # relative path
                logger.info(f"📄 Mobile results saved: {json_path}")

            # Handle generated video
            if generate_video and 'output_video' in sports_results:
                gen_video_dir = os.path.join(user_base_dir, "generated_video")
                os.makedirs(gen_video_dir, exist_ok=True)
                orig_video_path = sports_results['output_video']
                gen_filename = f"analyzed_{exercise_type}_{int(time.time())}.mp4"
                gen_path = os.path.join(gen_video_dir, gen_filename)
                shutil.move(orig_video_path, gen_path)
                final_results['generated_video'] = gen_filename  # relative
                logger.info(f"🎥 Generated video saved: {gen_path}")

            return final_results
        except Exception as e:
            logger.error(f"❌ Mobile analysis failed: {e}")
            return {'error': str(e), 'timestamp': datetime.now(timezone.utc).isoformat(), 'mobile_optimized': True}

    def _create_mobile_results(self, cheat_results, sports_results, cheat_time, sports_time):
        # (same as your previous code — unchanged)
        cheat_detection = cheat_results.get('cheat_detection_results', {})
        authenticity_status = cheat_detection.get('authenticity_status', 'unknown')
        overall_risk_score = cheat_detection.get('overall_risk_score', 0)
        face_verified = cheat_results.get('face_verification', {}).get('verified', False)

        if authenticity_status in ['highly_suspicious'] or overall_risk_score >= 75:
            final_validity = 'invalid'
            recommendation = "❌ Video rejected - Cheating detected"
        elif authenticity_status == 'suspicious' or overall_risk_score >= 55:
            final_validity = 'questionable'
            recommendation = "⚠️ Manual review needed"
        elif not face_verified:
            final_validity = 'identity_unverified'
            recommendation = "🔍 Face verification failed"
        elif overall_risk_score >= 35:
            final_validity = 'low_confidence'
            recommendation = "⚠️ Minor concerns detected"
        else:
            final_validity = 'valid'
            recommendation = "✅ Analysis complete - Video verified"

        exercise_results = sports_results.get('exercise_results', {})
        rep_count = exercise_results.get('rep_count', 0)
        jump_detected = exercise_results.get('jump_detected', False)
        jump_count = exercise_results.get('jump_count', 0)

        return {
            'mobile_summary': {
                'final_validity': final_validity,
                'authenticity_confidence': round(100 - overall_risk_score, 2),
                'performance_detected': bool(rep_count > 0 or jump_detected),
                'recommendation': recommendation,
                'processing_speed': 'mobile_optimized',
                'real_time_counting': True
            },
            'performance_results': {
                'exercise_type': sports_results.get('exercise_type', 'unknown'),
                'rep_count': rep_count,
                'jump_count': jump_count,
                'exercise_results': exercise_results,
                'output_video': sports_results.get('output_video'),
                'video_properties': sports_results.get('video_properties', {}),
                'mobile_performance': sports_results.get('mobile_performance', {})
            },
            'security_results': {
                'authenticity_status': authenticity_status,
                'risk_level': cheat_detection.get('overall_risk_level', 'unknown'),
                'risk_score': overall_risk_score,
                'confidence_score': cheat_detection.get('confidence_score', 0),
                'face_verification': cheat_results.get('face_verification', {}),
                'flag_analysis': cheat_results.get('flag_analysis', {}),
                'recommendations': cheat_results.get('recommendations', [])
            },
            'mobile_technical': {
                'cheat_detection_time': float(cheat_time),
                'sports_analysis_time': float(sports_time),
                'optimization_level': 'smartphone',
                'models_used': ['YOLO11n-nano', 'DeepFace-mobile', 'Mobile-Cheat-Detection'],
                'mobile_features': [
                    'real_time_counting',
                    'frame_skipping',
                    'resolution_optimization',
                    'memory_efficient',
                    'fast_inference'
                ],
                'analysis_timestamp': datetime.now(timezone.utc).isoformat(),
                'version': 'mobile_v1.0'
            }
        }

# ---------- NEW unified comprehensive analyser ----------
def analyse_comprehensive(assessments):
    """Identical logic to former v3comprehensive_analysis.py"""
    confidences = [a["mobile_summary"]["authenticity_confidence"] for a in assessments]
    exercise_distribution = Counter(a["performance_results"]["exercise_type"] for a in assessments)

    authenticity_stats = {
        "average_confidence": round(statistics.mean(confidences), 2),
        "min_confidence": round(min(confidences), 2),
        "max_confidence": round(max(confidences), 2),
        "median_confidence": round(statistics.median(confidences), 2)
    }

    perf_stats = {}
    benchmark_breakdown = {}
    for a in assessments:
        ex_type = a["performance_results"]["exercise_type"]
        res = a["performance_results"]["exercise_results"]

        if ex_type in ("pushups", "situps", "squats"):
            reps = safe_get(res, ["rep_count"])
            pts = calc_points(ex_type, reps)
            benchmark_breakdown[ex_type] = pts
            perf_stats[ex_type] = {
                "rep_statistics": {
                    "average_reps": reps,
                    "max_reps": reps,
                    "min_reps": reps,
                    "total_reps": reps,
                    "sessions": 1,
                    "benchmark": benchmark_check(ex_type, reps),
                    "benchmark_points": pts
                }
            }
        elif ex_type == "vertical_jump":
            jumps = safe_get(res, ["individual_jumps"], [])
            heights = [j["jump_height_cm"] for j in jumps if "jump_height_cm" in j]
            if heights:
                avg_h = statistics.mean(heights)
                pts = calc_points("vertical_jump", avg_h)
                benchmark_breakdown["vertical_jump"] = pts
                perf_stats["vertical_jump_height"] = {
                    "average": round(avg_h, 1),
                    "max": max(heights),
                    "min": min(heights),
                    "total_attempts": len(heights),
                    "benchmark": benchmark_check("vertical_jump", avg_h),
                    "benchmark_points": pts
                }
            distances = [j["horizontal_distance_cm"] for j in jumps if "horizontal_distance_cm" in j]
            if distances:
                perf_stats["vertical_jump_distance"] = {
                    "average": round(statistics.mean(distances), 1),
                    "max": max(distances),
                    "min": min(distances),
                    "total_attempts": len(distances)
                }
        elif ex_type == "long_jump":
            dist_cm = safe_get(res, ["distance_cm"])
            if dist_cm:
                pts = calc_points("long_jump", dist_cm)
                benchmark_breakdown["long_jump"] = pts
                perf_stats["long_jump_distance"] = {
                    "distance_cm": dist_cm,
                    "benchmark": benchmark_check("long_jump", dist_cm),
                    "benchmark_points": pts
                }

    total_benchmark_score = round(sum(benchmark_breakdown.values()), 1)

    fv_stats = [a["security_results"]["face_verification"] for a in assessments]
    verified_cnt = sum(1 for fv in fv_stats if fv.get("verified"))
    face_confidences = [fv.get("confidence", 0) for fv in fv_stats]
    face_verification_analysis = {
        "overall_verification_rate": round((verified_cnt / len(fv_stats)) * 100, 1),
        "average_face_confidence": round(statistics.mean(face_confidences), 1),
        "verification_reliability": "inconsistent" if statistics.stdev(face_confidences) > 20 else "consistent",
        "failed_verifications": len(fv_stats) - verified_cnt
    }

    security_recommendations = []
    if face_verification_analysis["failed_verifications"] >= 3:
        security_recommendations.append("WARNING: High face verification failure rate - Check reference image quality")

    durations = [a["performance_results"]["video_properties"]["duration"] for a in assessments]
    usage_patterns = {
        "average_session_duration": round(statistics.mean(durations), 2),
        "session_duration_range": [round(min(durations), 3), round(max(durations), 3)],
        "total_exercise_time": round(sum(durations), 2)
    }

    return {
        "analysis_metadata": {
            "total_assessments": len(assessments),
            "analysis_timestamp": datetime.datetime.utcnow().isoformat(),
            "analysis_version": "comprehensive_v1.0"
        },
        "authenticity_stats": authenticity_stats,
        "exercise_distribution": dict(exercise_distribution),
        "performance_insights": {"performance_statistics": perf_stats},
        "face_verification_analysis": face_verification_analysis,
        "security_recommendations": security_recommendations,
        "usage_patterns": usage_patterns,
        "benchmark_breakdown": benchmark_breakdown,
        "total_benchmark_score": total_benchmark_score
    }

# ---------- flask routes ----------
app = Flask(__name__)

try:
    mobile_system = MobileIntegrationSystem(reference_images_folder=None)
    logger.info("✅ Mobile Integration System API ready!")
except Exception as e:
    logger.error(f"❌ Failed to initialize mobile system: {e}")
    mobile_system = None

# original mobile video-analysis route
@app.route('/analyze_mobile', methods=['POST'])
def analyze_mobile():
    if mobile_system is None:
        return jsonify({'error': 'Mobile system not initialized'}), 500
    try:
        user_id = request.form.get('user_id')
        if not user_id:
            return jsonify({'error': 'user_id is required'}), 400

        base_dir = f"user_data/{user_id}"
        os.makedirs(base_dir, exist_ok=True)

        if 'video' not in request.files:
            return jsonify({'error': 'No video file provided'}), 400
        video_file = request.files['video']
        if video_file.filename == '':
            return jsonify({'error': 'No video file selected'}), 400

        exercise_type = request.form.get('exercise_type', 'pushups')
        user_height = int(request.form.get('user_height', 170))
        generate_video = request.form.get('generate_video', 'true').lower() == 'true'
        save_json = request.form.get('save_json', 'true').lower() == 'true'

        valid_exercises = ['pushups', 'situps', 'squats', 'vertical_jump', 'long_jump']
        if exercise_type not in valid_exercises:
            return jsonify({'error': f'Invalid exercise type. Supported: {valid_exercises}'}), 400

        # Reference images
        ref_dir = os.path.join(base_dir, "reference_faces")
        os.makedirs(ref_dir, exist_ok=True)
        if 'reference_images' in request.files:
            for ref_file in request.files.getlist('reference_images'):
                if ref_file.filename:
                    ref_path = os.path.join(ref_dir, ref_file.filename)
                    ref_file.save(ref_path)

        # Video
        videos_dir = os.path.join(base_dir, "videos")
        os.makedirs(videos_dir, exist_ok=True)
        video_filename = video_file.filename
        temp_path = os.path.join(videos_dir, video_filename)
        video_file.save(temp_path)

        results = mobile_system.analyze_video_mobile_complete(
            temp_path, exercise_type, user_id, base_dir, ref_dir, generate_video, save_json
        )

        return jsonify(results)
    except Exception as e:
        logger.error(f"❌ Mobile API error: {e}")
        return jsonify({'error': f'Mobile analysis failed: {str(e)}'}), 500

# health-check route
@app.route('/mobile_health', methods=['GET'])
def mobile_health():
    return jsonify({
        'status': 'healthy' if mobile_system else 'error',
        'system_loaded': mobile_system is not None,
        'version': 'mobile_v1.0',
        'optimization': 'smartphone',
        'features': [
            '📱 Mobile-optimized processing',
            '⚡ Real-time rep counting in video',
            '🔍 Fast cheat detection',
            '👤 Face verification',
            '🎯 Keypoint visualization',
            '📄 JSON file output',
            '🚀 3x faster than desktop version'
        ],
        'supported_exercises': ['pushups', 'situps', 'squats', 'vertical_jump', 'long_jump'],
        'mobile_improvements': [
            '✅ Frame skipping for speed',
            '✅ Resolution optimization', 
            '✅ Memory efficient buffers',
            '✅ Real-time counting display',
            '✅ Mobile-friendly video encoding',
            '✅ Simplified UI overlays'
        ]
    })

# NEW comprehensive route (replaces v3comprehensive_analysis.py)
@app.route('/comprehensiveAnalysis', methods=['POST'])
def comprehensive_analysis():
    """Analyse exactly 5 JSON assessments and return benchmark report."""
    user_id = request.form.get('user_id')
    if user_id:
        # Load from user folder
        json_dir = f"user_data/{user_id}/json_result"
        if not os.path.exists(json_dir):
            return jsonify({"error": f"User folder {json_dir} not found"}), 400
        json_files = [f for f in os.listdir(json_dir) if f.endswith('.json')]
        if len(json_files) != 5:
            return jsonify({"error": f"Exactly 5 JSON files required in {json_dir}, found {len(json_files)}"}), 400
        assessments = []
        for jf in json_files:
            try:
                with open(os.path.join(json_dir, jf), 'r') as f:
                    assessments.append(json.load(f))
            except Exception as e:
                return jsonify({"error": f"Invalid JSON in {jf}: {e}"}), 400
    else:
        # Fallback to files
        if not request.files:
            return jsonify({"error": "Send exactly 5 JSON files as multipart/form-data or provide user_id"}), 400
        files = list(request.files.values())  # ignore field names
        if len(files) != 5:
            return jsonify({"error": "Exactly 5 JSON files required"}), 400
        assessments = []
        for f in files:
            try:
                assessments.append(json.load(f))
            except Exception as e:
                return jsonify({"error": f"Invalid JSON in {f.filename}: {e}"}), 400

    try:
        report = analyse_comprehensive(assessments)
        return jsonify(report), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---------- runner ----------
if __name__ == '__main__':
    logger.info("📱 Starting Unified Mobile Integration System API...")
    logger.info("🎯 Optimized for: Smartphones, Real-time counting, Fast processing")
    logger.info("🆕 Added /comprehensiveAnalysis endpoint (benchmark scoring)")
    app.run(host='0.0.0.0', port=5000, debug=False, threaded=True)