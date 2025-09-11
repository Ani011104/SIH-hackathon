# enhanced_sports_assessment_v3.py
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
import logging
from pathlib import Path

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class BalancedSportsAssessmentEngine:
    def __init__(self, model_path="yolo11n-pose.pt"):
        """
        Initialize with balanced cheat detection and real-time video generation
        """
        logger.info(f"Initializing Balanced Sports Assessment Engine with model: {model_path}")
        
        # Initialize models
        self.pose_model = YOLO(model_path)
        self.pose_model.overrides['verbose'] = False
        
        # Tracking variables
        self.reset_tracking()
        
        # Exercise configurations
        self.exercise_configs = {
            'pushups': {
                'keypoints': [5, 7, 9],  # Right shoulder, elbow, wrist
                'alt_keypoints': [6, 8, 10],  # Left shoulder, elbow, wrist
                'up_angle': 160, 
                'down_angle': 95,
                'joint_names': ['shoulder', 'elbow', 'wrist'],
                'movement_tolerance': 1.5  # Multiplier for movement threshold
            },
            'situps': {
                'keypoints': [11, 13, 15],
                'alt_keypoints': [12, 14, 16],
                'up_angle': 110, 
                'down_angle': 45,
                'joint_names': ['hip', 'knee', 'ankle'],
                'movement_tolerance': 1.2
            },
            'squats': {
                'keypoints': [11, 13, 15],
                'alt_keypoints': [12, 14, 16],
                'up_angle': 160, 
                'down_angle': 90,
                'joint_names': ['hip', 'knee', 'ankle'],
                'movement_tolerance': 1.3
            },
            'vertical_jump': {
                'track_keypoint': 11,
                'alt_track_keypoint': 12,
                'reference_keypoints': [15, 16],
                'movement_tolerance': 2.0  # Jumps have more movement
            },
            'long_jump': {
                'track_keypoint': 15,
                'alt_track_keypoint': 16,
                'reference_keypoints': [11, 12],
                'movement_tolerance': 2.5
            }
        }

        # Dynamic thresholds (will be calculated per video)
        self.dynamic_thresholds = {
            'movement_base': 50,  # Base movement threshold in pixels
            'confidence_min': 0.3,
            'duplicate_tolerance': 3,
            'static_variance_threshold': 1.0
        }

    def reset_tracking(self):
        """Reset all tracking variables"""
        self.frame_data = []
        self.keypoints_history = deque(maxlen=200)
        self.confidence_history = []
        self.frame_hashes = []
        self.cheat_flags = []
        self.rep_count_live = 0
        self.current_state = 'up'
        self.video_stats = {}

    def analyze_video_with_output(self, video_path, exercise_type, user_height_cm=170, 
                                generate_video=True, output_path=None):
        """
        Main analysis with optional real-time video output generation
        """
        logger.info(f"Starting balanced analysis: {video_path} -> {exercise_type}")
        start_time = time.time()
        
        self.reset_tracking()
        
        # Load and validate video
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            return {"error": "Could not open video file"}
        
        # Get video properties
        fps = cap.get(cv2.CAP_PROP_FPS)
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        duration = total_frames / fps if fps > 0 else 0
        
        # Calculate dynamic thresholds based on video properties
        self._calculate_dynamic_thresholds(width, height, fps)
        
        logger.info(f"Video: {total_frames} frames, {fps:.1f} FPS, {width}x{height}")
        logger.info(f"Dynamic thresholds: movement={self.dynamic_thresholds['movement_threshold']:.1f}px")
        
        # Setup video writer if generating output
        out_writer = None
        if generate_video:
            if output_path is None:
                output_path = f"analyzed_{exercise_type}_{int(time.time())}.mp4"
            
            fourcc = cv2.VideoWriter_fourcc(*'mp4v')
            out_writer = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
            logger.info(f"Generating analysis video: {output_path}")
        
        # Process video with real-time analysis
        frame_count = 0
        config = self.exercise_configs[exercise_type]
        
        while cap.isOpened():
            success, frame = cap.read()
            if not success:
                break
            
            # Process frame and get analysis data
            analysis_frame = self._process_frame_with_realtime_analysis(
                frame.copy(), frame_count, fps, exercise_type, config
            )
            
            # Write analyzed frame
            if out_writer:
                out_writer.write(analysis_frame)
            
            frame_count += 1
            
            # Progress logging
            if frame_count % 200 == 0:
                logger.info(f"Processed {frame_count}/{total_frames} frames, Current reps: {self.rep_count_live}")
        
        cap.release()
        if out_writer:
            out_writer.release()
            logger.info(f"Analysis video saved: {output_path}")
        
        # Generate final analysis
        analysis_results = self._generate_balanced_analysis(exercise_type, fps, user_height_cm, duration)
        
        processing_time = time.time() - start_time
        logger.info(f"Analysis complete in {processing_time:.2f}s. Final reps: {self.rep_count_live}")
        
        results = {
            **analysis_results,
            'processing_time': processing_time,
            'video_properties': {
                'fps': fps,
                'total_frames': total_frames,
                'duration': duration,
                'resolution': f"{width}x{height}"
            }
        }
        
        if generate_video:
            results['output_video'] = output_path
        
        return results

    def _calculate_dynamic_thresholds(self, width, height, fps):
        """
        Calculate dynamic thresholds based on video properties
        """
        # Base movement threshold scales with resolution
        resolution_factor = min(width, height) / 640  # Normalized to 640p
        self.dynamic_thresholds['movement_threshold'] = (
            self.dynamic_thresholds['movement_base'] * resolution_factor
        )
        
        # FPS-based adjustments
        fps_factor = max(0.5, min(2.0, fps / 30))  # Normalize to 30fps
        self.dynamic_thresholds['movement_threshold'] *= fps_factor
        
        # Store video stats for further analysis
        self.video_stats = {
            'width': width,
            'height': height,
            'fps': fps,
            'resolution_factor': resolution_factor,
            'fps_factor': fps_factor
        }

    def _process_frame_with_realtime_analysis(self, frame, frame_count, fps, exercise_type, config):
        """
        Process frame with real-time analysis overlay
        """
        timestamp = frame_count / fps
        
        # Run pose estimation
        results = self.pose_model(frame, verbose=False)
        keypoints_data = self._extract_keypoints_from_results(results)
        
        if keypoints_data is None:
            keypoints = np.zeros((17, 3))
            confidence_scores = np.zeros(17)
            avg_confidence = 0.0
        else:
            keypoints = keypoints_data['keypoints']
            confidence_scores = keypoints_data['confidence']
            avg_confidence = np.mean(confidence_scores[confidence_scores > 0])
        
        # Store frame data
        frame_data = {
            'frame_number': frame_count,
            'timestamp': timestamp,
            'keypoints': keypoints.tolist(),
            'confidence': confidence_scores.tolist(),
            'avg_confidence': float(avg_confidence),
            'person_detected': keypoints_data is not None
        }
        
        # Update tracking
        self.frame_data.append(frame_data)
        self.keypoints_history.append(keypoints)
        self.confidence_history.append(avg_confidence)
        
        # Calculate frame hash for cheat detection
        frame_hash = hashlib.md5(cv2.resize(frame, (64, 64)).tobytes()).hexdigest()
        self.frame_hashes.append(frame_hash)
        
        # Real-time rep counting for repetition exercises
        if exercise_type in ['pushups', 'situps', 'squats'] and keypoints_data:
            self._update_live_rep_count(keypoints, config, frame_count)
        
        # Balanced cheat detection
        cheat_status = self._balanced_cheat_detection(frame_data, frame_count)
        
        # Generate analysis overlay
        analysis_frame = self._draw_realtime_analysis(
            frame, keypoints, confidence_scores, exercise_type, 
            cheat_status, frame_count, timestamp
        )
        
        return analysis_frame

    def _extract_keypoints_from_results(self, results):
        """Extract keypoints from YOLO results"""
        if not results or len(results) == 0:
            return None
            
        result = results[0]
        
        if not hasattr(result, 'keypoints') or result.keypoints is None:
            return None
        
        keypoints_tensor = result.keypoints.data
        
        if keypoints_tensor.size(0) == 0:
            return None
        
        person_keypoints = keypoints_tensor[0].cpu().numpy()
        keypoints_xy = person_keypoints[:, :2]
        confidence_scores = person_keypoints[:, 2]
        keypoints_full = np.column_stack([keypoints_xy, confidence_scores])
        
        return {
            'keypoints': keypoints_full,
            'confidence': confidence_scores,
            'xy_coordinates': keypoints_xy
        }

    def _update_live_rep_count(self, keypoints, config, frame_count):
        """
        Update live rep count during video processing
        """
        # Try primary keypoints first
        angle = self._calculate_angle_from_keypoints(keypoints, config['keypoints'])
        
        # If primary fails, try alternative
        if angle is None:
            angle = self._calculate_angle_from_keypoints(keypoints, config['alt_keypoints'])
        
        if angle is not None:
            # Rep counting logic with hysteresis
            if self.current_state == 'up' and angle <= config['down_angle'] + 10:
                self.current_state = 'down'
            elif self.current_state == 'down' and angle >= config['up_angle'] - 10:
                self.current_state = 'up'
                self.rep_count_live += 1

    def _calculate_angle_from_keypoints(self, keypoints, kpt_indices):
        """Calculate angle from three keypoints"""
        if len(kpt_indices) != 3:
            return None
        
        p1, p2, p3 = keypoints[kpt_indices[0]], keypoints[kpt_indices[1]], keypoints[kpt_indices[2]]
        
        # Check confidence
        if p1[2] < 0.4 or p2[2] < 0.4 or p3[2] < 0.4:
            return None
        
        # Calculate angle
        v1 = p1[:2] - p2[:2]
        v2 = p3[:2] - p2[:2]
        
        norm1 = np.linalg.norm(v1)
        norm2 = np.linalg.norm(v2)
        
        if norm1 < 1e-6 or norm2 < 1e-6:
            return None
        
        cos_angle = np.dot(v1, v2) / (norm1 * norm2)
        cos_angle = np.clip(cos_angle, -1, 1)
        angle = np.degrees(np.arccos(cos_angle))
        
        return angle

    def _balanced_cheat_detection(self, frame_data, frame_count):
        """
        Balanced cheat detection with context-aware thresholds
        """
        flags = []
        severity_weights = {'low': 1, 'medium': 3, 'high': 7, 'critical': 15}
        
        # 1. Confidence check (more lenient)
        if frame_data['avg_confidence'] < 0.15:
            flags.append({
                'type': 'very_low_confidence',
                'severity': 'medium',  # Reduced from high
                'weight': severity_weights['medium']
            })
        elif frame_data['avg_confidence'] < 0.25:
            flags.append({
                'type': 'low_confidence',
                'severity': 'low',  # Reduced from medium
                'weight': severity_weights['low']
            })
        
        # 2. Duplicate frame detection (unchanged - this is important)
        hash_count = self.frame_hashes.count(self.frame_hashes[-1]) if self.frame_hashes else 0
        if hash_count > self.dynamic_thresholds['duplicate_tolerance']:
            flags.append({
                'type': 'duplicate_frame',
                'severity': 'high' if hash_count > 6 else 'medium',
                'weight': severity_weights['high'] if hash_count > 6 else severity_weights['medium']
            })
        
        # 3. IMPROVED movement analysis with context
        if len(self.keypoints_history) > 2:
            movement_flags = self._analyze_movement_with_context(frame_count)
            flags.extend(movement_flags)
        
        # 4. Static pose check (more tolerant)
        if len(self.keypoints_history) > 10:
            recent_poses = list(self.keypoints_history)[-10:]
            if self._check_static_pose(recent_poses):
                flags.append({
                    'type': 'static_pose',
                    'severity': 'low',  # Reduced severity
                    'weight': severity_weights['low']
                })
        
        # Calculate frame risk score (cap at reasonable level)
        frame_risk = min(20, sum(flag['weight'] for flag in flags))
        
        return {
            'flags': flags,
            'frame_risk': frame_risk,
            'status': 'suspicious' if frame_risk > 10 else 'normal'
        }

    def _analyze_movement_with_context(self, frame_count):
        """
        Context-aware movement analysis with dynamic thresholds
        """
        flags = []
        
        if len(self.keypoints_history) < 3:
            return flags
        
        current = self.keypoints_history[-1]
        prev1 = self.keypoints_history[-2]
        
        # Calculate movements for confident keypoints only
        movements = []
        for i in range(17):
            if current[i][2] > 0.4 and prev1[i][2] > 0.4:
                movement = np.linalg.norm(current[i][:2] - prev1[i][:2])
                movements.append(movement)
        
        if not movements:
            return flags
        
        max_movement = max(movements)
        avg_movement = np.mean(movements)
        
        # Dynamic threshold based on video properties and exercise type
        current_exercise = getattr(self, '_current_exercise_type', 'pushups')
        movement_tolerance = self.exercise_configs.get(current_exercise, {}).get('movement_tolerance', 1.0)
        dynamic_threshold = self.dynamic_thresholds['movement_threshold'] * movement_tolerance
        
        # Context-aware flagging
        if max_movement > dynamic_threshold * 2:  # Very extreme movement
            flags.append({
                'type': 'extreme_movement',
                'severity': 'high',
                'weight': 7,
                'details': f'Movement: {max_movement:.1f}px (threshold: {dynamic_threshold:.1f}px)'
            })
        elif max_movement > dynamic_threshold * 1.5:  # Moderately high movement
            # Check if this is part of a pattern (multiple consecutive high movements)
            if len(self.keypoints_history) > 5:
                recent_movements = []
                for j in range(2, min(6, len(self.keypoints_history))):
                    curr_kp = self.keypoints_history[-1]
                    prev_kp = self.keypoints_history[-j]
                    recent_moves = []
                    for k in range(17):
                        if curr_kp[k][2] > 0.4 and prev_kp[k][2] > 0.4:
                            move = np.linalg.norm(curr_kp[k][:2] - prev_kp[k][:2])
                            recent_moves.append(move)
                    if recent_moves:
                        recent_movements.append(max(recent_moves))
                
                # Only flag if consistently high movement
                if len(recent_movements) > 2 and np.mean(recent_movements) > dynamic_threshold:
                    flags.append({
                        'type': 'sustained_high_movement',
                        'severity': 'medium',
                        'weight': 3,
                        'details': f'Sustained movement: {np.mean(recent_movements):.1f}px'
                    })
        
        return flags

    def _check_static_pose(self, poses):
        """Check if poses are too static (indicating possible image manipulation)"""
        if len(poses) < 5:
            return False
        
        # Calculate variance across poses
        all_coords = []
        for pose in poses:
            coords = []
            for kp in pose:
                if kp[2] > 0.3:  # Only confident keypoints
                    coords.extend(kp[:2])
            if coords:
                all_coords.append(coords)
        
        if len(all_coords) < 3:
            return False
        
        # Pad to same length for variance calculation
        min_len = min(len(coord) for coord in all_coords)
        if min_len < 4:  # Need at least 2 keypoints worth of data
            return False
        
        padded_coords = [coord[:min_len] for coord in all_coords]
        variance = np.var(padded_coords, axis=0).mean()
        
        return variance < self.dynamic_thresholds['static_variance_threshold']

    def _draw_realtime_analysis(self, frame, keypoints, confidence, exercise_type, 
                              cheat_status, frame_count, timestamp):
        """
        Draw comprehensive real-time analysis overlay
        """
        overlay = frame.copy()
        
        # Draw skeleton if person detected
        if keypoints is not None and np.any(confidence > 0.3):
            self._draw_skeleton(overlay, keypoints, confidence)
        
        # Exercise info panel
        self._draw_info_panel(overlay, exercise_type, frame_count, timestamp)
        
        # Rep counter for rep exercises
        if exercise_type in ['pushups', 'situps', 'squats']:
            self._draw_rep_counter(overlay, self.rep_count_live, self.current_state)
        
        # Cheat detection status
        self._draw_cheat_status(overlay, cheat_status)
        
        # Current angle display (if applicable)
        if exercise_type in ['pushups', 'situps', 'squats']:
            current_angle = self._get_current_angle(keypoints, exercise_type)
            if current_angle:
                self._draw_angle_info(overlay, current_angle, exercise_type)
        
        return overlay

    def _draw_skeleton(self, frame, keypoints, confidence):
        """Draw pose skeleton with confidence-based colors"""
        # COCO pose connections
        connections = [
            (5, 7), (7, 9),    # Right arm
            (6, 8), (8, 10),   # Left arm
            (11, 13), (13, 15), # Right leg  
            (12, 14), (14, 16), # Left leg
            (5, 6),            # Shoulders
            (11, 12),          # Hips
            (5, 11), (6, 12)   # Torso
        ]
        
        # Draw keypoints
        for i, (kp, conf) in enumerate(zip(keypoints, confidence)):
            if conf > 0.3:
                x, y = int(kp[0]), int(kp[1])
                # Color based on confidence
                if conf > 0.7:
                    color = (0, 255, 0)  # Green for high confidence
                elif conf > 0.5:
                    color = (0, 255, 255)  # Yellow for medium
                else:
                    color = (0, 165, 255)  # Orange for low
                
                cv2.circle(frame, (x, y), 6, color, -1)
                cv2.circle(frame, (x, y), 8, (0, 0, 0), 2)
        
        # Draw skeleton connections
        for start_idx, end_idx in connections:
            if confidence[start_idx] > 0.3 and confidence[end_idx] > 0.3:
                start_point = (int(keypoints[start_idx][0]), int(keypoints[start_idx][1]))
                end_point = (int(keypoints[end_idx][0]), int(keypoints[end_idx][1]))
                
                # Line color based on average confidence
                avg_conf = (confidence[start_idx] + confidence[end_idx]) / 2
                if avg_conf > 0.6:
                    color = (0, 255, 0)
                else:
                    color = (0, 255, 255)
                
                cv2.line(frame, start_point, end_point, color, 3)

    def _draw_info_panel(self, frame, exercise_type, frame_count, timestamp):
        """Draw exercise information panel"""
        h, w = frame.shape[:2]
        
        # Background panel
        cv2.rectangle(frame, (10, 10), (400, 120), (0, 0, 0), -1)
        cv2.rectangle(frame, (10, 10), (400, 120), (255, 255, 255), 2)
        
        # Exercise type
        cv2.putText(frame, f"Exercise: {exercise_type.upper()}", (20, 35), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
        
        # Frame info
        cv2.putText(frame, f"Frame: {frame_count}", (20, 60), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.5, (200, 200, 200), 1)
        
        # Time
        cv2.putText(frame, f"Time: {timestamp:.1f}s", (20, 80), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.5, (200, 200, 200), 1)
        
        # Analysis status
        cv2.putText(frame, "ANALYZING...", (20, 105), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 255), 1)

    def _draw_rep_counter(self, frame, rep_count, current_state):
        """Draw rep counter with current state"""
        h, w = frame.shape[:2]
        
        # Rep counter background
        cv2.rectangle(frame, (w-200, 10), (w-10, 100), (0, 0, 0), -1)
        cv2.rectangle(frame, (w-200, 10), (w-10, 100), (255, 255, 255), 2)
        
        # Rep count (large)
        cv2.putText(frame, f"REPS: {rep_count}", (w-190, 45), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
        
        # Current state
        state_color = (0, 255, 255) if current_state == 'down' else (255, 255, 0)
        cv2.putText(frame, f"State: {current_state.upper()}", (w-190, 75), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.5, state_color, 1)

    def _draw_cheat_status(self, frame, cheat_status):
        """Draw cheat detection status"""
        h, w = frame.shape[:2]
        
        # Status background
        status_color = (0, 0, 255) if cheat_status['status'] == 'suspicious' else (0, 255, 0)
        cv2.rectangle(frame, (10, h-80), (300, h-10), (0, 0, 0), -1)
        cv2.rectangle(frame, (10, h-80), (300, h-10), status_color, 2)
        
        # Status text
        status_text = "SUSPICIOUS" if cheat_status['status'] == 'suspicious' else "AUTHENTIC"
        cv2.putText(frame, f"Status: {status_text}", (20, h-55), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.6, status_color, 2)
        
        # Risk score
        cv2.putText(frame, f"Risk: {cheat_status['frame_risk']}/20", (20, h-25), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)

    def _get_current_angle(self, keypoints, exercise_type):
        """Get current joint angle for display"""
        if keypoints is None:
            return None
        
        config = self.exercise_configs[exercise_type]
        angle = self._calculate_angle_from_keypoints(keypoints, config['keypoints'])
        
        if angle is None:
            angle = self._calculate_angle_from_keypoints(keypoints, config['alt_keypoints'])
        
        return angle

    def _draw_angle_info(self, frame, angle, exercise_type):
        """Draw current angle information"""
        h, w = frame.shape[:2]
        config = self.exercise_configs[exercise_type]
        
        # Angle display
        cv2.rectangle(frame, (w-200, 120), (w-10, 200), (0, 0, 0), -1)
        cv2.rectangle(frame, (w-200, 120), (w-10, 200), (255, 255, 255), 2)
        
        cv2.putText(frame, f"Angle: {angle:.1f}°", (w-190, 145), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 1)
        
        # Target ranges
        cv2.putText(frame, f"Up: {config['up_angle']}°", (w-190, 170), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.4, (0, 255, 0), 1)
        cv2.putText(frame, f"Down: {config['down_angle']}°", (w-190, 190), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.4, (0, 0, 255), 1)

    def _generate_balanced_analysis(self, exercise_type, fps, user_height_cm, duration):
        """
        Generate balanced final analysis with improved risk assessment
        """
        # Store current exercise type for context
        self._current_exercise_type = exercise_type
        
        # Filter valid frames
        valid_frames = [f for f in self.frame_data if f.get('person_detected', False) and f.get('avg_confidence', 0) > 0.25]
        
        logger.info(f"Valid frames for analysis: {len(valid_frames)}/{len(self.frame_data)}")
        
        if len(valid_frames) < 10:
            return {
                'error': 'Insufficient valid pose detections for analysis',
                'details': f'Only {len(valid_frames)} frames with confident pose detection'
            }
        
        # Exercise-specific analysis
        exercise_results = self._analyze_exercise_balanced(exercise_type, fps, valid_frames, user_height_cm)
        
        # Balanced cheat detection summary
        cheat_summary = self._generate_balanced_cheat_summary()
        
        # Improved overall assessment
        overall_assessment = self._generate_improved_assessment(exercise_results, cheat_summary)
        
        return {
            'exercise_type': exercise_type,
            'duration': duration,
            'total_frames': len(self.frame_data),
            'valid_frames': len(valid_frames),
            'fps': fps,
            'exercise_results': exercise_results,
            'cheat_detection': cheat_summary,
            'overall_assessment': overall_assessment,
            'dynamic_thresholds': self.dynamic_thresholds,
            'video_stats': self.video_stats,
            'timestamp': datetime.now().isoformat()
        }

    def _analyze_exercise_balanced(self, exercise_type, fps, valid_frames, user_height_cm):
        """Balanced exercise analysis"""
        config = self.exercise_configs[exercise_type]
        
        if exercise_type in ['pushups', 'situps', 'squats']:
            # Use live rep count if available, otherwise calculate
            final_rep_count = max(self.rep_count_live, self._calculate_final_rep_count(valid_frames, config))
            
            # Form analysis
            angles = self._extract_angles_from_frames(valid_frames, config)
            form_analysis = self._analyze_form_quality(angles, config)
            
            return {
                'rep_count': final_rep_count,
                'live_rep_count': self.rep_count_live,
                'form_analysis': form_analysis,
                'keypoints_used': config['keypoints'],
                'joint_names': config['joint_names']
            }
        
        elif exercise_type in ['vertical_jump', 'long_jump']:
            return self._analyze_jump_balanced(exercise_type, valid_frames, fps, user_height_cm)
        
        else:
            return {"error": "Unknown exercise type"}

    def _calculate_final_rep_count(self, valid_frames, config):
        """Calculate final rep count from processed frames"""
        angles = self._extract_angles_from_frames(valid_frames, config)
        valid_angles = [a for a in angles if a is not None]
        
        if len(valid_angles) < 10:
            return 0
        
        # Smooth angles
        smoothed = self._smooth_angles(valid_angles)
        
        # Count reps
        reps = 0
        state = 'up'
        
        for angle in smoothed:
            if state == 'up' and angle <= config['down_angle'] + 10:
                state = 'down'
            elif state == 'down' and angle >= config['up_angle'] - 10:
                state = 'up'
                reps += 1
        
        return reps

    def _extract_angles_from_frames(self, frames, config):
        """Extract joint angles from frames"""
        angles = []
        
        for frame in frames:
            keypoints = np.array(frame['keypoints'])
            angle = self._calculate_angle_from_keypoints(keypoints, config['keypoints'])
            
            if angle is None:
                angle = self._calculate_angle_from_keypoints(keypoints, config['alt_keypoints'])
            
            angles.append(angle)
        
        return angles

    def _smooth_angles(self, angles, window=7):
        """Smooth angle data"""
        if len(angles) < window:
            return angles
        
        smoothed = []
        for i in range(len(angles)):
            start = max(0, i - window // 2)
            end = min(len(angles), i + window // 2 + 1)
            window_angles = angles[start:end]
            smoothed.append(statistics.median(window_angles))
        
        return smoothed

    def _analyze_form_quality(self, angles, config):
        """Analyze form quality"""
        valid_angles = [a for a in angles if a is not None]
        
        if not valid_angles:
            return {"error": "No valid angle data"}
        
        # Form metrics
        angle_range = max(valid_angles) - min(valid_angles)
        consistency = np.std(valid_angles)
        expected_range = config['up_angle'] - config['down_angle']
        
        # Scoring
        form_score = 100
        issues = []
        
        if angle_range < expected_range * 0.6:
            form_score -= 25
            issues.append("Limited range of motion")
        
        if consistency > 20:
            form_score -= 15
            issues.append("Inconsistent form")
        
        return {
            'form_score': max(0, form_score),
            'angle_range': angle_range,
            'consistency': consistency,
            'issues': issues
        }

    def _analyze_jump_balanced(self, exercise_type, valid_frames, fps, user_height_cm):
        """Balanced jump analysis"""
        # Simplified jump analysis - can be expanded
        return {
            'jump_detected': len(valid_frames) > 20,
            'frames_analyzed': len(valid_frames),
            'note': 'Jump analysis implementation can be expanded based on requirements'
        }

    def _generate_balanced_cheat_summary(self):
        """
        Generate balanced cheat detection summary with proper scoring
        """
        if not self.cheat_flags:
            return {
                'overall_risk': 'low',
                'confidence_score': 95,
                'total_flags': 0,
                'risk_score': 0,
                'flag_categories': {},
                'recommendations': ['Video appears authentic'],
                'detailed_analysis': 'No suspicious patterns detected'
            }
        
        # Collect and categorize flags
        flag_categories = defaultdict(int)
        total_weight = 0
        
        for flag in self.cheat_flags:
            flag_categories[flag['type']] += 1
            total_weight += flag.get('weight', 1)
        
        # Calculate balanced risk score (0-100 scale)
        max_possible_weight = len(self.frame_data) * 15  # Max weight per frame
        risk_score = min(100, (total_weight / max(max_possible_weight * 0.1, 1)) * 100)
        
        # Determine overall risk with more nuanced thresholds
        if risk_score > 80:
            overall_risk = 'critical'
            confidence = 15
        elif risk_score > 60:
            overall_risk = 'high'
            confidence = 35
        elif risk_score > 30:
            overall_risk = 'medium'
            confidence = 65
        elif risk_score > 10:
            overall_risk = 'low-medium'
            confidence = 80
        else:
            overall_risk = 'low'
            confidence = 90
        
        # Generate contextual recommendations
        recommendations = []
        
        if flag_categories.get('extreme_movement', 0) > len(self.frame_data) * 0.1:
            recommendations.append("High movement detected - may indicate fast execution or camera shake")
        
        if flag_categories.get('duplicate_frame', 0) > 0:
            recommendations.append("Duplicate frames detected - possible video manipulation")
        
        if flag_categories.get('very_low_confidence', 0) > len(self.frame_data) * 0.2:
            recommendations.append("Frequent pose detection issues - check video quality and lighting")
        
        if not recommendations:
            recommendations.append("Video passed authenticity verification")
        
        return {
            'overall_risk': overall_risk,
            'confidence_score': confidence,
            'total_flags': len(self.cheat_flags),
            'risk_score': round(risk_score, 1),
            'flag_categories': dict(flag_categories),
            'recommendations': recommendations,
            'detailed_analysis': f'Risk score: {risk_score:.1f}/100 based on {len(self.cheat_flags)} flags across {len(self.frame_data)} frames'
        }

    def _generate_improved_assessment(self, exercise_results, cheat_summary):
        """
        Generate improved overall assessment with balanced logic
        """
        assessment = {
            'validity': 'valid',
            'confidence': 'high',
            'reliability_score': 85,
            'recommendations': [],
            'performance_insights': []
        }
        
        # More nuanced validity assessment
        risk_level = cheat_summary['overall_risk']
        rep_count = exercise_results.get('rep_count', 0)
        
        # Consider both cheat detection AND exercise performance
        if risk_level == 'critical':
            assessment['validity'] = 'invalid'
            assessment['confidence'] = 'very_low'
            assessment['reliability_score'] = 15
        elif risk_level == 'high':
            # If we have good rep detection, be less punitive
            if rep_count > 0:
                assessment['validity'] = 'questionable'
                assessment['confidence'] = 'low'
                assessment['reliability_score'] = 40
                assessment['recommendations'].append("⚠️ Some authenticity concerns but exercise performance detected")
            else:
                assessment['validity'] = 'invalid'
                assessment['confidence'] = 'very_low'
                assessment['reliability_score'] = 25
        elif risk_level in ['medium', 'low-medium']:
            assessment['confidence'] = 'medium'
            assessment['reliability_score'] = 70
            assessment['recommendations'].append("✓ Minor concerns detected - results generally reliable")
        else:
            assessment['recommendations'].append("✅ Video passed authenticity verification")
        
        # Performance insights
        if rep_count > 0:
            assessment['performance_insights'].append(f"💪 Detected {rep_count} repetitions")
            
            if 'form_analysis' in exercise_results:
                form_score = exercise_results['form_analysis'].get('form_score', 0)
                if form_score >= 80:
                    assessment['performance_insights'].append("🏆 Good exercise form")
                elif form_score >= 60:
                    assessment['performance_insights'].append("👍 Moderate form - room for improvement")
                else:
                    assessment['performance_insights'].append("📈 Form needs attention")
        
        return assessment


# Flask API with video generation
from flask import Flask, request, jsonify, send_file
import os

app = Flask(__name__)

try:
    assessment_engine = BalancedSportsAssessmentEngine()
    logger.info("Balanced Sports Assessment Engine initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize engine: {e}")
    assessment_engine = None

@app.route('/analyze', methods=['POST'])
def analyze_video():
    """Enhanced API endpoint with video generation option"""
    if assessment_engine is None:
        return jsonify({'error': 'Assessment engine not initialized'}), 500
    
    try:
        if 'video' not in request.files:
            return jsonify({'error': 'No video file provided'}), 400
        
        video_file = request.files['video']
        if video_file.filename == '':
            return jsonify({'error': 'No video file selected'}), 400
        
        # Parameters
        exercise_type = request.form.get('exercise_type', 'pushups')
        user_height = int(request.form.get('user_height', 170))
        generate_video = request.form.get('generate_video', 'true').lower() == 'true'
        
        # Validate exercise type
        valid_exercises = ['pushups', 'situps', 'squats', 'vertical_jump', 'long_jump']
        if exercise_type not in valid_exercises:
            return jsonify({'error': f'Invalid exercise type. Must be one of: {valid_exercises}'}), 400
        
        # Save uploaded file
        temp_path = f"temp_{int(time.time())}_{video_file.filename}"
        video_file.save(temp_path)
        
        logger.info(f"Processing: {temp_path} for {exercise_type}, generate_video={generate_video}")
        
        # Analyze with optional video generation
        results = assessment_engine.analyze_video_with_output(
            temp_path, exercise_type, user_height, generate_video
        )
        
        # Cleanup
        try:
            os.remove(temp_path)
        except:
            pass
        
        return jsonify(results)
        
    except Exception as e:
        logger.error(f"Analysis error: {e}")
        return jsonify({'error': f'Analysis failed: {str(e)}'}), 500

@app.route('/download/<filename>')
def download_video(filename):
    """Download generated analysis video"""
    try:
        return send_file(filename, as_attachment=True)
    except FileNotFoundError:
        return jsonify({'error': 'File not found'}), 404

@app.route('/health', methods=['GET'])
def health_check():
    """Enhanced health check"""
    return jsonify({
        'status': 'healthy' if assessment_engine else 'error',
        'model_loaded': assessment_engine is not None,
        'version': '3.0 - Balanced',
        'features': ['real_time_analysis', 'balanced_cheat_detection', 'video_generation'],
        'supported_exercises': ['pushups', 'situps', 'squats', 'vertical_jump', 'long_jump']
    })

if __name__ == '__main__':
    logger.info("Starting Balanced Sports Assessment API v3.0...")
    logger.info("Features: Real-time analysis, Balanced cheat detection, Video generation")
    app.run(host='0.0.0.0', port=5000, debug=False, threaded=True)
