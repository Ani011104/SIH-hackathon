# sports_assessment_engine.py
import cv2
import numpy as np
import json
import hashlib
import time
from datetime import datetime
from ultralytics import YOLO, solutions
from collections import deque, defaultdict
import math
import statistics

class SportsAssessmentEngine:
    def __init__(self, model_path="yolo11n-pose.pt"):
        """
        Initialize YOLO11 pose estimation and assessment engine
        Downloads model automatically if not found
        """
        self.model = YOLO(model_path)
        self.gym = solutions.AIGym(
            model=model_path,
            show=False,
            kpts=[6, 8, 10]  # Default for pushups
        )
        
        # Initialize tracking variables
        self.frame_data = []
        self.keypoints_history = deque(maxlen=100)
        self.confidence_history = []
        self.frame_hashes = []
        self.cheat_flags = []
        
        # Exercise configurations
        self.exercise_configs = {
            'pushups': {'kpts': [6, 8, 10], 'up_angle': 160, 'down_angle': 90},
            'situps': {'kpts': [11, 13, 15], 'up_angle': 110, 'down_angle': 45},
            'squats': {'kpts': [11, 13, 15], 'up_angle': 160, 'down_angle': 90},
            'vertical_jump': {'kpts': [11, 15], 'track_keypoint': 11},  # Hip
            'long_jump': {'kpts': [11, 15], 'track_keypoint': 15},     # Ankle
        }

    def analyze_video(self, video_path, exercise_type, user_height_cm=170):
        """
        Main analysis function - processes entire video
        """
        print(f"Starting analysis of {video_path} for {exercise_type}")
        
        # Reset tracking variables
        self._reset_tracking()
        
        # Load video
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            return {"error": "Could not open video file"}
        
        # Get video properties
        fps = cap.get(cv2.CAP_PROP_FPS)
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        duration = total_frames / fps
        
        # Configure for specific exercise
        self._configure_exercise(exercise_type)
        
        # Process all frames
        frame_count = 0
        while cap.isOpened():
            success, frame = cap.read()
            if not success:
                break
            
            # Process frame
            self._process_frame(frame, frame_count, fps)
            frame_count += 1
        
        cap.release()
        
        # Analyze results
        results = self._analyze_results(exercise_type, fps, user_height_cm, duration)
        
        print(f"Analysis complete. Processed {frame_count} frames.")
        return results

    def _reset_tracking(self):
        """Reset all tracking variables"""
        self.frame_data = []
        self.keypoints_history.clear()
        self.confidence_history = []
        self.frame_hashes = []
        self.cheat_flags = []

    def _configure_exercise(self, exercise_type):
        """Configure YOLO11 for specific exercise"""
        if exercise_type in self.exercise_configs:
            config = self.exercise_configs[exercise_type]
            self.gym.kpts = config['kpts']
            if 'up_angle' in config:
                self.gym.up_angle = config['up_angle']
                self.gym.down_angle = config['down_angle']

    def _process_frame(self, frame, frame_count, fps):
        """Process individual frame"""
        timestamp = frame_count / fps
        
        # Get pose estimation
        results = self.gym(frame)
        
        # Extract keypoints and confidence
        if hasattr(results, 'keypoints') and results.keypoints is not None:
            keypoints = results.keypoints.data[0].cpu().numpy()
            confidence = results.keypoints.conf[0].cpu().numpy() if hasattr(results.keypoints, 'conf') else np.ones(17) * 0.5
        else:
            keypoints = np.zeros((17, 3))  # 17 keypoints, x,y,confidence
            confidence = np.zeros(17)
        
        # Calculate frame hash for duplicate detection
        frame_hash = hashlib.md5(cv2.resize(frame, (64, 64)).tobytes()).hexdigest()
        
        # Store frame data
        frame_data = {
            'frame_number': frame_count,
            'timestamp': timestamp,
            'keypoints': keypoints.tolist(),
            'confidence': confidence.tolist(),
            'frame_hash': frame_hash,
            'avg_confidence': np.mean(confidence)
        }
        
        self.frame_data.append(frame_data)
        self.keypoints_history.append(keypoints)
        self.confidence_history.append(np.mean(confidence))
        self.frame_hashes.append(frame_hash)
        
        # Run cheat detection on this frame
        self._detect_cheating_frame(frame_data, frame_count)

    def _detect_cheating_frame(self, frame_data, frame_count):
        """Detect cheating indicators for current frame"""
        flags = []
        
        # 1. Low confidence detection
        if frame_data['avg_confidence'] < 0.3:
            flags.append({
                'type': 'low_confidence',
                'frame': frame_count,
                'severity': 'medium',
                'details': f"Average confidence: {frame_data['avg_confidence']:.3f}"
            })
        
        # 2. Duplicate frame detection
        if frame_count > 0 and frame_data['frame_hash'] in self.frame_hashes[:-1]:
            duplicate_count = self.frame_hashes.count(frame_data['frame_hash'])
            flags.append({
                'type': 'duplicate_frame',
                'frame': frame_count,
                'severity': 'high' if duplicate_count > 3 else 'medium',
                'details': f"Frame appears {duplicate_count} times"
            })
        
        # 3. Impossible movement detection
        if len(self.keypoints_history) > 1:
            prev_keypoints = self.keypoints_history[-2]
            curr_keypoints = self.keypoints_history[-1]
            
            # Calculate movement distance for each keypoint
            movements = []
            for i in range(17):
                if prev_keypoints[i][2] > 0.3 and curr_keypoints[i][2] > 0.3:  # Both confident
                    dist = np.sqrt((curr_keypoints[i][0] - prev_keypoints[i][0])**2 + 
                                 (curr_keypoints[i][1] - prev_keypoints[i][1])**2)
                    movements.append(dist)
            
            if movements:
                max_movement = max(movements)
                # Flag if movement > 50 pixels per frame (adjust based on video resolution)
                if max_movement > 50:
                    flags.append({
                        'type': 'impossible_movement',
                        'frame': frame_count,
                        'severity': 'high',
                        'details': f"Max keypoint movement: {max_movement:.1f} pixels"
                    })
        
        # 4. Pose consistency check
        if len(self.keypoints_history) > 5:
            # Check if pose is too consistent (indicating static image)
            recent_poses = list(self.keypoints_history)[-5:]
            variance = np.var([pose[:, :2].flatten() for pose in recent_poses])
            if variance < 1.0:  # Very low variance indicates static pose
                flags.append({
                    'type': 'static_pose',
                    'frame': frame_count,
                    'severity': 'medium',
                    'details': f"Pose variance: {variance:.3f}"
                })
        
        self.cheat_flags.extend(flags)

    def _analyze_results(self, exercise_type, fps, user_height_cm, duration):
        """Analyze all processed frames and generate final results"""
        
        # Exercise-specific analysis
        if exercise_type in ['pushups', 'situps', 'squats']:
            exercise_results = self._analyze_rep_exercise(exercise_type, fps)
        elif exercise_type in ['vertical_jump', 'long_jump']:
            exercise_results = self._analyze_jump_exercise(exercise_type, fps, user_height_cm)
        else:
            exercise_results = {"error": "Unknown exercise type"}
        
        # Cheat detection summary
        cheat_summary = self._generate_cheat_summary()
        
        # Overall assessment
        overall_assessment = self._generate_overall_assessment(exercise_results, cheat_summary)
        
        return {
            'exercise_type': exercise_type,
            'duration': duration,
            'total_frames': len(self.frame_data),
            'fps': fps,
            'exercise_results': exercise_results,
            'cheat_detection': cheat_summary,
            'overall_assessment': overall_assessment,
            'timestamp': datetime.now().isoformat()
        }

    def _analyze_rep_exercise(self, exercise_type, fps):
        """Analyze repetition-based exercises (pushups, situps, squats)"""
        if not self.frame_data:
            return {"error": "No frame data available"}
        
        # Extract relevant keypoints for angle calculation
        config = self.exercise_configs[exercise_type]
        kpts = config['kpts']
        up_angle = config['up_angle']
        down_angle = config['down_angle']
        
        angles = []
        for frame in self.frame_data:
            keypoints = np.array(frame['keypoints'])
            
            # Calculate angle between three keypoints
            if len(kpts) == 3:
                p1, p2, p3 = keypoints[kpts[0]], keypoints[kpts[1]], keypoints[kpts[2]]
                
                # Check if all keypoints are confident
                if p1[2] > 0.3 and p2[2] > 0.3 and p3[2] > 0.3:
                    angle = self._calculate_angle(p1[:2], p2[:2], p3[:2])
                    angles.append(angle)
                else:
                    angles.append(None)
            else:
                angles.append(None)
        
        # Count reps based on angle thresholds
        reps = self._count_reps(angles, up_angle, down_angle)
        
        # Detect sets (periods of activity separated by rest)
        sets = self._detect_sets(angles, fps)
        
        # Form analysis
        form_analysis = self._analyze_form(angles, up_angle, down_angle)
        
        return {
            'rep_count': reps,
            'set_count': len(sets),
            'sets_details': sets,
            'form_analysis': form_analysis,
            'angle_data': [a for a in angles if a is not None]  # For debugging
        }

    def _analyze_jump_exercise(self, exercise_type, fps, user_height_cm):
        """Analyze jump exercises (vertical jump, long jump)"""
        config = self.exercise_configs[exercise_type]
        track_keypoint = config['track_keypoint']
        
        # Extract tracked keypoint positions over time
        positions = []
        for frame in self.frame_data:
            keypoints = np.array(frame['keypoints'])
            kp = keypoints[track_keypoint]
            
            if kp[2] > 0.3:  # Confident detection
                positions.append({
                    'timestamp': frame['timestamp'],
                    'x': kp[0],
                    'y': kp[1],
                    'confidence': kp[2]
                })
        
        if len(positions) < 10:
            return {"error": "Insufficient tracking data"}
        
        if exercise_type == 'vertical_jump':
            return self._analyze_vertical_jump(positions, fps, user_height_cm)
        elif exercise_type == 'long_jump':
            return self._analyze_long_jump(positions, fps, user_height_cm)

    def _analyze_vertical_jump(self, positions, fps, user_height_cm):
        """Analyze vertical jump for height calculation"""
        # Extract y-coordinates (invert because image coordinates have origin at top)
        y_coords = [-pos['y'] for pos in positions]
        timestamps = [pos['timestamp'] for pos in positions]
        
        # Smooth the data
        smoothed_y = self._smooth_data(y_coords, window=5)
        
        # Find takeoff and landing
        baseline = statistics.median(smoothed_y[:10])  # First 10 frames as baseline
        
        # Find takeoff (significant upward movement)
        takeoff_idx = None
        for i in range(1, len(smoothed_y)):
            if smoothed_y[i] > baseline + 20:  # 20 pixels above baseline
                takeoff_idx = i
                break
        
        # Find peak (maximum height)
        if takeoff_idx:
            peak_idx = takeoff_idx + np.argmax(smoothed_y[takeoff_idx:])
            peak_height = smoothed_y[peak_idx]
        else:
            return {"error": "Could not detect takeoff"}
        
        # Find landing (return to baseline after peak)
        landing_idx = None
        for i in range(peak_idx, len(smoothed_y)):
            if smoothed_y[i] <= baseline + 10:
                landing_idx = i
                break
        
        if not landing_idx:
            return {"error": "Could not detect landing"}
        
        # Calculate flight time
        flight_time = timestamps[landing_idx] - timestamps[takeoff_idx]
        
        # Calculate jump height using physics: h = g*t²/8
        jump_height_pixels = peak_height - baseline
        
        # Convert to real-world units (rough estimation)
        # Assume person fills ~60% of frame height when standing
        pixels_per_cm = (smoothed_y[0] - smoothed_y[-1]) / (user_height_cm * 0.6) if len(smoothed_y) > 1 else 1
        jump_height_cm = jump_height_pixels / pixels_per_cm if pixels_per_cm > 0 else 0
        
        # Physics-based height calculation as verification
        physics_height_cm = (9.81 * flight_time**2 / 8) * 100  # Convert m to cm
        
        return {
            'jump_height_cm': max(jump_height_cm, physics_height_cm),  # Use maximum of both methods
            'flight_time_seconds': flight_time,
            'takeoff_frame': takeoff_idx,
            'landing_frame': landing_idx,
            'peak_frame': peak_idx,
            'calculation_method': 'hybrid_pixel_physics'
        }

    def _analyze_long_jump(self, positions, fps, user_height_cm):
        """Analyze long jump for distance calculation"""
        # Extract x-coordinates for horizontal distance
        x_coords = [pos['x'] for pos in positions]
        y_coords = [pos['y'] for pos in positions]
        
        # Find takeoff and landing based on y-coordinate changes
        takeoff_idx = 0
        landing_idx = len(positions) - 1
        
        # Find actual takeoff (when y starts increasing significantly)
        baseline_y = statistics.median(y_coords[:10])
        for i in range(10, len(y_coords)):
            if y_coords[i] < baseline_y - 20:  # Going up in image (decreasing y)
                takeoff_idx = i
                break
        
        # Find landing (return to baseline level)
        for i in range(takeoff_idx + 10, len(y_coords)):
            if abs(y_coords[i] - baseline_y) < 15:
                landing_idx = i
                break
        
        # Calculate horizontal distance
        distance_pixels = abs(x_coords[landing_idx] - x_coords[takeoff_idx])
        
        # Convert to real-world distance (rough estimation)
        # Assume frame width represents ~3 meters when person is at jumping position
        pixels_per_cm = len(x_coords) / 300 if len(x_coords) > 0 else 1  # 3m = 300cm
        distance_cm = distance_pixels / pixels_per_cm
        
        return {
            'distance_cm': distance_cm,
            'takeoff_frame': takeoff_idx,
            'landing_frame': landing_idx,
            'horizontal_displacement': distance_pixels
        }

    def _calculate_angle(self, p1, p2, p3):
        """Calculate angle between three points"""
        v1 = p1 - p2
        v2 = p3 - p2
        
        cos_angle = np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2) + 1e-6)
        cos_angle = np.clip(cos_angle, -1, 1)
        angle = np.degrees(np.arccos(cos_angle))
        
        return angle

    def _count_reps(self, angles, up_angle, down_angle):
        """Count repetitions based on angle thresholds"""
        if not angles or len([a for a in angles if a is not None]) < 5:
            return 0
        
        # Filter out None values
        valid_angles = [a for a in angles if a is not None]
        
        reps = 0
        in_down_position = False
        
        for angle in valid_angles:
            if angle <= down_angle and not in_down_position:
                in_down_position = True
            elif angle >= up_angle and in_down_position:
                reps += 1
                in_down_position = False
        
        return reps

    def _detect_sets(self, angles, fps):
        """Detect sets based on activity periods"""
        if not angles:
            return []
        
        # Find periods of activity (where angles are changing)
        activity_threshold = 5.0  # degrees per second
        window_size = int(fps * 2)  # 2-second window
        
        sets = []
        current_set_start = None
        current_set_reps = 0
        
        for i in range(len(angles) - window_size):
            window_angles = [a for a in angles[i:i+window_size] if a is not None]
            
            if len(window_angles) > window_size // 2:
                angle_variance = np.var(window_angles)
                
                if angle_variance > activity_threshold and current_set_start is None:
                    current_set_start = i
                elif angle_variance <= activity_threshold and current_set_start is not None:
                    # End of set
                    set_angles = angles[current_set_start:i]
                    set_reps = self._count_reps(set_angles, 160, 90)  # Use default thresholds
                    
                    sets.append({
                        'start_frame': current_set_start,
                        'end_frame': i,
                        'reps': set_reps,
                        'duration': (i - current_set_start) / fps
                    })
                    
                    current_set_start = None
        
        return sets if sets else [{'start_frame': 0, 'end_frame': len(angles), 'reps': self._count_reps(angles, 160, 90), 'duration': len(angles) / fps}]

    def _analyze_form(self, angles, up_angle, down_angle):
        """Analyze exercise form quality"""
        valid_angles = [a for a in angles if a is not None]
        
        if not valid_angles:
            return {"error": "No valid angle data"}
        
        # Calculate form metrics
        angle_range = max(valid_angles) - min(valid_angles)
        angle_consistency = np.std(valid_angles)
        
        # Form quality assessment
        form_score = 100
        issues = []
        
        # Check range of motion
        expected_range = up_angle - down_angle
        if angle_range < expected_range * 0.7:
            form_score -= 20
            issues.append("Limited range of motion")
        
        # Check consistency
        if angle_consistency > 15:
            form_score -= 15
            issues.append("Inconsistent form")
        
        # Check if angles reach proper thresholds
        max_angle = max(valid_angles)
        min_angle = min(valid_angles)
        
        if max_angle < up_angle * 0.9:
            form_score -= 10
            issues.append("Not reaching full extension")
        
        if min_angle > down_angle * 1.1:
            form_score -= 10
            issues.append("Not reaching full contraction")
        
        return {
            'form_score': max(0, form_score),
            'angle_range': angle_range,
            'consistency': angle_consistency,
            'issues': issues,
            'max_angle': max_angle,
            'min_angle': min_angle
        }

    def _smooth_data(self, data, window=5):
        """Apply moving average smoothing"""
        if len(data) < window:
            return data
        
        smoothed = []
        for i in range(len(data)):
            start = max(0, i - window // 2)
            end = min(len(data), i + window // 2 + 1)
            smoothed.append(sum(data[start:end]) / (end - start))
        
        return smoothed

    def _generate_cheat_summary(self):
        """Generate comprehensive cheat detection summary"""
        if not self.cheat_flags:
            return {
                'overall_risk': 'low',
                'total_flags': 0,
                'flag_categories': {},
                'recommendations': ['Video appears authentic']
            }
        
        # Categorize flags by type and severity
        flag_categories = defaultdict(list)
        severity_counts = defaultdict(int)
        
        for flag in self.cheat_flags:
            flag_categories[flag['type']].append(flag)
            severity_counts[flag['severity']] += 1
        
        # Determine overall risk
        if severity_counts['high'] > 3:
            overall_risk = 'high'
        elif severity_counts['high'] > 0 or severity_counts['medium'] > 5:
            overall_risk = 'medium'
        else:
            overall_risk = 'low'
        
        # Generate recommendations
        recommendations = []
        if 'duplicate_frame' in flag_categories:
            recommendations.append("Video may contain duplicate or frozen frames")
        if 'impossible_movement' in flag_categories:
            recommendations.append("Detected unnatural or impossible movements")
        if 'low_confidence' in flag_categories:
            recommendations.append("Poor video quality or pose detection accuracy")
        if 'static_pose' in flag_categories:
            recommendations.append("Person appears too static, may indicate image manipulation")
        
        if not recommendations:
            recommendations.append("Video passed basic authenticity checks")
        
        return {
            'overall_risk': overall_risk,
            'total_flags': len(self.cheat_flags),
            'severity_breakdown': dict(severity_counts),
            'flag_categories': {k: len(v) for k, v in flag_categories.items()},
            'detailed_flags': self.cheat_flags,
            'recommendations': recommendations
        }

    def _generate_overall_assessment(self, exercise_results, cheat_summary):
        """Generate overall assessment and recommendations"""
        assessment = {
            'validity': 'valid',
            'confidence': 'high',
            'recommendations': []
        }
        
        # Check cheat detection results
        if cheat_summary['overall_risk'] == 'high':
            assessment['validity'] = 'invalid'
            assessment['confidence'] = 'low'
            assessment['recommendations'].append("Video failed authenticity checks - results may not be reliable")
        elif cheat_summary['overall_risk'] == 'medium':
            assessment['confidence'] = 'medium'
            assessment['recommendations'].append("Some authenticity concerns detected - interpret results with caution")
        
        # Check exercise-specific issues
        if 'error' in exercise_results:
            assessment['validity'] = 'invalid'
            assessment['recommendations'].append(f"Analysis error: {exercise_results['error']}")
        
        # Add performance recommendations
        if assessment['validity'] == 'valid':
            if 'form_analysis' in exercise_results:
                form_score = exercise_results['form_analysis'].get('form_score', 100)
                if form_score < 70:
                    assessment['recommendations'].append("Focus on improving exercise form and range of motion")
                elif form_score < 85:
                    assessment['recommendations'].append("Good form with room for minor improvements")
                else:
                    assessment['recommendations'].append("Excellent exercise form demonstrated")
        
        return assessment


# Flask API wrapper
from flask import Flask, request, jsonify
import os

app = Flask(__name__)
assessment_engine = SportsAssessmentEngine()

@app.route('/analyze', methods=['POST'])
def analyze_video():
    """
    API endpoint for video analysis
    Expects: multipart/form-data with video file and parameters
    """
    try:
        # Get uploaded video file
        if 'video' not in request.files:
            return jsonify({'error': 'No video file provided'}), 400
        
        video_file = request.files['video']
        if video_file.filename == '':
            return jsonify({'error': 'No video file selected'}), 400
        
        # Get parameters
        exercise_type = request.form.get('exercise_type', 'pushups')
        user_height = int(request.form.get('user_height', 170))
        
        # Save uploaded file temporarily
        temp_path = f"temp_{int(time.time())}_{video_file.filename}"
        video_file.save(temp_path)
        
        # Analyze video
        results = assessment_engine.analyze_video(temp_path, exercise_type, user_height)
        
        # Clean up temp file
        os.remove(temp_path)
        
        return jsonify(results)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'model_loaded': True})

if __name__ == '__main__':
    print("Starting Sports Assessment API...")
    print("Available exercises: pushups, situps, squats, vertical_jump, long_jump")
    app.run(host='0.0.0.0', port=5000, debug=True)
