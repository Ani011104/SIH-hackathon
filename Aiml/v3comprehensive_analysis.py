# v2comprehensive_analysis.py  (final fixed)
import json, statistics, datetime, os
from collections import Counter
from flask import Flask, request, jsonify

app = Flask(__name__)
PORT = 5001

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

# ---------- benchmark config ----------
BENCHMARKS = {
    "pushups":     {"target": 30, "unit": "reps", "max_points": 20},
    "situps":      {"target": 35, "unit": "reps", "max_points": 20},
    "squats":      {"target": 45, "unit": "reps", "max_points": 20},
    "vertical_jump": {"target": 25, "unit": "cm", "max_points": 20},
    "long_jump":   {"target": 150, "unit": "cm", "max_points": 20},
}

def calc_points(exercise, value):
    """Linear 0→target→max_points, clamped [0, max_points]"""
    if value <= 0:
        return 0
    cfg = BENCHMARKS[exercise]
    pts = (value / cfg["target"]) * cfg["max_points"]
    return min(cfg["max_points"], max(0, round(pts, 1)))

def benchmark_check(exercise, value):
    """Returns human-readable benchmark status"""
    if value >= BENCHMARKS[exercise]["target"]:
        return "✅ benchmark passed"
    return f"📈 needs improvement ({value} < {BENCHMARKS[exercise]['target']} {BENCHMARKS[exercise]['unit']})"

# ---------- core analyser ----------
def analyse_comprehensive(assessments):
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

# ---------- flask route ----------
@app.route("/comprehensiveAnalysis", methods=["POST"])
def comprehensive_analysis():
    if not request.files:
        return jsonify({"error": "Send exactly 5 JSON files as multipart/form-data"}), 400

    files = list(request.files.values())  # materialise
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
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=PORT, debug=False)