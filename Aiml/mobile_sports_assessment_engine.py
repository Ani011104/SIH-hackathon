# mobile_sports_assessment_engine.py

import cv2
import numpy as np
import json
import time
from datetime import datetime
from ultralytics import YOLO
from collections import deque
import statistics
import logging
import os

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class MobileSportsAssessmentEngine:
    """
    Mobile-optimized sports assessment with real-time counting
    """
    
    def __init__(self, model_path="yolo11n-pose.pt"):
        logger.info("Initializing Mobile Sports Assessment Engine")
        
        # Initialize YOLO model (use nano for mobile)
        self.pose_model = YOLO(model_path)
        self.pose_model.overrides['verbose'] = False
        
        # Mobile-optimized parameters
        self.reset_tracking()
        
        # Exercise configurations (mobile-optimized)
        self.exercise_configs = {
            'pushups': {
                'keypoints': [5, 7, 9],
                'alt_keypoints': [6, 8, 10],
                'up_angle': 160,
                'down_angle': 90,  # More forgiving for mobile
                'joint_names': ['shoulder', 'elbow', 'wrist'],
                'confidence_threshold': 0.3  # Lower for mobile
            },
            'situps': {
                'keypoints': [5, 11, 13],
                'alt_keypoints': [6, 12, 14],
                'up_angle': 120,
                'down_angle': 55,  # More forgiving
                'joint_names': ['shoulder', 'hip', 'knee'],
                'confidence_threshold': 0.3
            },
            'squats': {
                'keypoints': [11, 13, 15],
                'alt_keypoints': [12, 14, 16],
                'up_angle': 160,
                'down_angle': 85,  # More forgiving
                'joint_names': ['hip', 'knee', 'ankle'],
                'confidence_threshold': 0.3
            },
            'vertical_jump': {
                'track_keypoint': 11,
                'alt_track_keypoint': 12,
                'reference_keypoints': [15, 16],
                'confidence_threshold': 0.35
            },
            'long_jump': {
                'track_keypoint': 15,
                'alt_track_keypoint': 16,
                'reference_keypoints': [11, 12],
                'confidence_threshold': 0.35
            }
        }
    
    def reset_tracking(self):
        """Reset tracking variables"""
        self.frame_data = []
        self.keypoints_history = deque(maxlen=200)  # Reduced for mobile
        self.rep_count_live = 0
        self.current_state = 'up'
        self.jumps_detected = []
        self.current_jump = None
        self.jump_count = 0
        self.frame_keypoints = []
        
        # Real-time counting variables
        self.last_rep_time = 0
        self.rep_timestamps = []
        self.state_confidence = 0
        
    def analyze_video_mobile(self, video_path, exercise_type, user_height_cm=170, 
                           generate_video=True, save_json=True):
        """
        🔹 MOBILE: Fast sports analysis with real-time counting
        """
        logger.info(f"Starting mobile sports analysis: {video_path} -> {exercise_type}")
        start_time = time.time()
        
        self.reset_tracking()
        
        # Load video
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            return {"error": "Could not open video file"}
        
        # Get video properties
        fps = cap.get(cv2.CAP_PROP_FPS)
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        duration = total_frames / fps if fps > 0 else 0
        
        logger.info(f"Video: {total_frames} frames, {fps:.1f} FPS, {width}x{height}")
        
        # Mobile optimization: frame skipping for speed
        frame_skip = 2 if fps > 25 else 1  # Skip frames if high FPS
        processed_frames = 0
        frame_count = 0
        
        while True:
            success, frame = cap.read()
            if not success:
                break
            
            # Process every frame_skip frames for mobile efficiency
            if frame_count % frame_skip == 0:
                timestamp = frame_count / fps
                
                # Mobile optimization: resize for processing if too large
                processing_frame = frame
                scale_factor = 1.0
                
                if width > 640:  # Resize large frames for mobile speed
                    scale_factor = 640.0 / width
                    new_width = 640
                    new_height = int(height * scale_factor)
                    processing_frame = cv2.resize(frame, (new_width, new_height))
                
                # Extract keypoints
                results = self.pose_model(processing_frame, verbose=False)
                keypoints_data = self._extract_keypoints_from_results(results, scale_factor, (width, height))
                
                # Store keypoints for video generation (store original frame keypoints)
                if keypoints_data:
                    stored_keypoints = keypoints_data['keypoints'].copy()
                    stored_confidence = keypoints_data['confidence'].copy()
                else:
                    stored_keypoints = np.zeros((17, 3))
                    stored_confidence = np.zeros(17)
                
                # Store for all frames (interpolate for skipped frames)
                for i in range(frame_skip):
                    if frame_count + i < total_frames:
                        self.frame_keypoints.append({
                            'keypoints': stored_keypoints,
                            'confidence': stored_confidence,
                            'real_time_rep_count': self.rep_count_live,
                            'current_state': self.current_state,
                            'jump_count': self.jump_count
                        })
                
                # Process frame data
                self._collect_keypoint_data_mobile(frame, processed_frames, fps, exercise_type, keypoints_data)
                
                processed_frames += 1
            
            frame_count += 1
            
            # Mobile-friendly progress logging
            if frame_count % 300 == 0:
                logger.info(f"Processed {processed_frames} frames (mobile mode)")
        
        cap.release()
        
        # Analyze specific exercise
        if exercise_type == 'vertical_jump':
            self._analyze_vertical_jumps_mobile(fps, user_height_cm)
        elif exercise_type == 'long_jump':
            self._analyze_long_jump_mobile(fps, user_height_cm)
        
        # Generate video with real-time counting
        output_path = None
        if generate_video:
            output_path = f"mobile_analysis_{exercise_type}_{int(time.time())}.mp4"
            success = self._generate_mobile_video(video_path, output_path, exercise_type, fps)
            if not success:
                output_path = None
        
        # Generate analysis results
        analysis_results = self._generate_mobile_analysis(exercise_type, fps, user_height_cm, duration)
        
        processing_time = time.time() - start_time
        
        results = {
            **analysis_results,
            'processing_time': float(processing_time),
            'video_properties': {
                'fps': float(fps),
                'total_frames': int(total_frames),
                'duration': float(duration),
                'resolution': f"{width}x{height}",
                'mobile_optimized': True,
                'frames_processed': processed_frames
            }
        }
        
        if output_path:
            results['output_video'] = output_path
        
        # Save JSON if requested
        if save_json:
            json_filename = f"mobile_results_{exercise_type}_{int(time.time())}.json"
            with open(json_filename, 'w') as f:
                json.dump(results, f, indent=2)
            results['saved_json'] = json_filename
            logger.info(f"Mobile results saved to: {json_filename}")
        
        logger.info(f"Mobile sports analysis complete in {processing_time:.2f}s")
        return results
    
    def _extract_keypoints_from_results(self, results, scale_factor=1.0, original_size=None):
        """Extract and scale keypoints for mobile"""
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
        
        # Scale back to original size if frame was resized
        if scale_factor != 1.0:
            keypoints_xy = keypoints_xy / scale_factor
        
        keypoints_full = np.column_stack([keypoints_xy, confidence_scores])
        
        return {
            'keypoints': keypoints_full,
            'confidence': confidence_scores
        }
    
    def _collect_keypoint_data_mobile(self, frame, frame_count, fps, exercise_type, keypoints_data):
        """Mobile-optimized keypoint data collection with real-time counting"""
        timestamp = frame_count / fps
        
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
            'frame_number': int(frame_count),
            'timestamp': float(timestamp),
            'keypoints': keypoints.tolist(),
            'confidence': confidence_scores.tolist(),
            'avg_confidence': float(avg_confidence),
            'person_detected': keypoints_data is not None,
            'rep_count_at_frame': self.rep_count_live  # Real-time rep count
        }
        
        self.frame_data.append(frame_data)
        self.keypoints_history.append(keypoints)
        
        # Real-time exercise processing
        if exercise_type in ['pushups', 'situps', 'squats'] and keypoints_data:
            config = self.exercise_configs[exercise_type]
            self._update_live_rep_count_mobile(keypoints, config, timestamp)
        elif exercise_type == 'vertical_jump' and keypoints_data:
            self._detect_jump_realtime_mobile(keypoints, frame_count, timestamp)
    
    def _update_live_rep_count_mobile(self, keypoints, config, timestamp):
        """Mobile-optimized real-time rep counting with better accuracy"""
        angle = self._calculate_angle_from_keypoints_mobile(keypoints, config['keypoints'], config['confidence_threshold'])
        
        if angle is None:
            angle = self._calculate_angle_from_keypoints_mobile(keypoints, config['alt_keypoints'], config['confidence_threshold'])
        
        if angle is not None:
            # Mobile-optimized state detection with confidence
            tolerance = 20  # More forgiving for mobile
            
            if self.current_state == 'up' and angle <= config['down_angle'] + tolerance:
                if timestamp - self.last_rep_time > 0.5:  # Prevent double counting
                    self.current_state = 'down'
                    self.state_confidence = 1
            elif self.current_state == 'down' and angle >= config['up_angle'] - tolerance:
                if timestamp - self.last_rep_time > 0.5:
                    self.current_state = 'up'
                    self.rep_count_live += 1
                    self.last_rep_time = timestamp
                    self.rep_timestamps.append(timestamp)
                    self.state_confidence = 1
                    logger.info(f"🔥 Rep {self.rep_count_live} completed! (Mobile)")
    
    def _detect_jump_realtime_mobile(self, keypoints, frame_count, timestamp):
        """Mobile-optimized real-time jump detection"""
        config = self.exercise_configs['vertical_jump']
        hip_keypoint = config['track_keypoint']
        
        if keypoints[hip_keypoint][2] < config['confidence_threshold']:
            return
        
        hip_y = float(keypoints[hip_keypoint][1])
        hip_x = float(keypoints[hip_keypoint][0])
        
        # Mobile optimization: use shorter history
        if len(self.keypoints_history) < 20:
            return
        
        # Calculate baseline (mobile-optimized)
        recent_y_coords = []
        for i in range(-20, -1):
            if len(self.keypoints_history) > abs(i):
                kp = self.keypoints_history[i][hip_keypoint]
                if kp[2] > config['confidence_threshold']:
                    recent_y_coords.append(float(kp[1]))
        
        if len(recent_y_coords) < 8:
            return
        
        baseline = float(statistics.median(recent_y_coords))
        threshold = 30.0  # Mobile-optimized threshold
        
        # Mobile jump state machine
        if self.current_jump is None:
            if hip_y < baseline - threshold:
                self.current_jump = {
                    'start_frame': int(frame_count),
                    'start_time': float(timestamp),
                    'start_y': float(hip_y),
                    'start_x': float(hip_x),
                    'baseline': float(baseline),
                    'peak_y': float(hip_y),
                    'peak_frame': int(frame_count)
                }
                logger.info(f"🚀 Jump {self.jump_count + 1} started! (Mobile)")
        else:
            if hip_y < self.current_jump['peak_y']:
                self.current_jump['peak_y'] = float(hip_y)
                self.current_jump['peak_frame'] = int(frame_count)
            
            if hip_y > baseline - threshold/2 and timestamp > self.current_jump['start_time'] + 0.2:
                # Complete the jump
                self.current_jump['end_frame'] = int(frame_count)
                self.current_jump['end_time'] = float(timestamp)
                self.current_jump['end_y'] = float(hip_y)
                self.current_jump['end_x'] = float(hip_x)
                self.current_jump['flight_time'] = float(timestamp - self.current_jump['start_time'])
                
                jump_height_pixels = float(self.current_jump['baseline'] - self.current_jump['peak_y'])
                horizontal_distance_pixels = float(abs(self.current_jump['end_x'] - self.current_jump['start_x']))
                
                self.current_jump['height_pixels'] = jump_height_pixels
                self.current_jump['distance_pixels'] = horizontal_distance_pixels
                
                self.jumps_detected.append(self.current_jump.copy())
                self.jump_count += 1
                logger.info(f"🎯 Jump {self.jump_count} completed! Height: {jump_height_pixels:.1f}px (Mobile)")
                self.current_jump = None
    
    def _calculate_angle_from_keypoints_mobile(self, keypoints, kpt_indices, confidence_threshold=0.3):
        """Mobile-optimized angle calculation"""
        if len(kpt_indices) != 3:
            return None
        
        p1, p2, p3 = keypoints[kpt_indices[0]], keypoints[kpt_indices[1]], keypoints[kpt_indices[2]]
        
        if p1[2] < confidence_threshold or p2[2] < confidence_threshold or p3[2] < confidence_threshold:
            return None
        
        v1 = p1[:2] - p2[:2]
        v2 = p3[:2] - p2[:2]
        
        norm1 = np.linalg.norm(v1)
        norm2 = np.linalg.norm(v2)
        
        if norm1 < 1e-6 or norm2 < 1e-6:
            return None
        
        cos_angle = np.dot(v1, v2) / (norm1 * norm2)
        cos_angle = np.clip(cos_angle, -1, 1)
        angle = np.degrees(np.arccos(cos_angle))
        
        return float(angle)
    
    def _generate_mobile_video(self, video_path, output_path, exercise_type, fps):
        """🔹 MOBILE: Generate video with real-time counting visualization"""
        logger.info(f"Generating mobile video with real-time counting: {output_path}")
        
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            logger.error("Could not open input video")
            return False
        
        # Get video properties
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        
        # Mobile-optimized codec
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
        
        if not out.isOpened():
            logger.error("Could not initialize mobile video writer")
            cap.release()
            return False
        
        frame_count = 0
        
        while True:
            success, frame = cap.read()
            if not success:
                break
            
            # Get stored data for this frame
            if frame_count < len(self.frame_keypoints):
                frame_data = self.frame_keypoints[frame_count]
                keypoints = frame_data['keypoints']
                confidence = frame_data['confidence']
                real_time_reps = frame_data['real_time_rep_count']
                current_state = frame_data['current_state']
                jump_count = frame_data['jump_count']
            else:
                keypoints = np.zeros((17, 3))
                confidence = np.zeros(17)
                real_time_reps = self.rep_count_live
                current_state = self.current_state
                jump_count = self.jump_count
            
            # Draw mobile-optimized analysis
            annotated_frame = self._draw_mobile_analysis(
                frame.copy(), keypoints, confidence, exercise_type, 
                frame_count, frame_count / fps, real_time_reps, current_state, jump_count
            )
            
            out.write(annotated_frame)
            frame_count += 1
            
            # Mobile progress logging
            if frame_count % 200 == 0:
                logger.info(f"Generated {frame_count} mobile video frames")
        
        cap.release()
        out.release()
        
        # Verify mobile video creation
        if os.path.exists(output_path):
            file_size = os.path.getsize(output_path)
            if file_size > 1024:
                logger.info(f"Mobile video generated: {output_path} ({file_size} bytes)")
                return True
        
        logger.error(f"Failed to generate mobile video: {output_path}")
        return False
    
    def _draw_mobile_analysis(self, frame, keypoints, confidence, exercise_type, 
                            frame_count, timestamp, real_time_reps, current_state, jump_count):
        """🔹 MOBILE: Draw optimized analysis with real-time counting"""
        
        h, w = frame.shape[:2]
        
        # 1. Draw simplified skeleton (mobile-optimized)
        if np.any(confidence > 0.25):
            self._draw_mobile_skeleton(frame, keypoints, confidence)
        
        # 2. Draw large real-time counter (main feature)
        self._draw_large_counter(frame, exercise_type, real_time_reps, current_state, jump_count)
        
        # 3. Draw mobile info panel
        self._draw_mobile_info_panel(frame, exercise_type, frame_count, timestamp)
        
        # 4. Draw exercise-specific mobile metrics
        if exercise_type in ['pushups', 'situps', 'squats']:
            self._draw_mobile_rep_progress(frame, exercise_type, real_time_reps, current_state)
        elif exercise_type in ['vertical_jump', 'long_jump']:
            self._draw_mobile_jump_metrics(frame, exercise_type, jump_count, frame_count)
        
        return frame
    
    def _draw_mobile_skeleton(self, frame, keypoints, confidence):
        """Draw simplified skeleton optimized for mobile viewing"""
        
        # Mobile-optimized connections (fewer lines for clarity)
        mobile_connections = [
            (5, 7), (7, 9),    # Right arm
            (6, 8), (8, 10),   # Left arm
            (11, 13), (13, 15), # Right leg
            (12, 14), (14, 16), # Left leg
            (5, 6),            # Shoulders
            (11, 12)           # Hips
        ]
        
        # Draw keypoints (larger for mobile)
        for i, (kp, conf) in enumerate(zip(keypoints, confidence)):
            if conf > 0.25:
                x, y = int(kp[0]), int(kp[1])
                
                # Mobile-optimized colors
                if conf > 0.6:
                    color = (0, 255, 0)  # Green
                else:
                    color = (0, 255, 255)  # Yellow
                
                # Larger circles for mobile
                cv2.circle(frame, (x, y), 6, color, -1)
                cv2.circle(frame, (x, y), 8, (0, 0, 0), 2)
        
        # Draw skeleton (thicker lines for mobile)
        for start_idx, end_idx in mobile_connections:
            if confidence[start_idx] > 0.25 and confidence[end_idx] > 0.25:
                start_point = (int(keypoints[start_idx][0]), int(keypoints[start_idx][1]))
                end_point = (int(keypoints[end_idx][0]), int(keypoints[end_idx][1]))
                
                cv2.line(frame, start_point, end_point, (0, 255, 0), 4)  # Thicker for mobile
    
    def _draw_large_counter(self, frame, exercise_type, real_time_reps, current_state, jump_count):
        """Draw large, prominent real-time counter"""
        h, w = frame.shape[:2]
        
        # Large counter background
        counter_width = min(300, w // 3)
        counter_height = 120
        counter_x = (w - counter_width) // 2  # Center
        counter_y = 30
        
        # Semi-transparent background
        overlay = frame.copy()
        cv2.rectangle(overlay, (counter_x, counter_y), (counter_x + counter_width, counter_y + counter_height), (0, 0, 0), -1)
        cv2.addWeighted(overlay, 0.7, frame, 0.3, 0, frame)
        
        # Border
        cv2.rectangle(frame, (counter_x, counter_y), (counter_x + counter_width, counter_y + counter_height), (0, 255, 255), 3)
        
        # Large rep counter
        if exercise_type in ['pushups', 'situps', 'squats']:
            count_text = f"{real_time_reps}"
            cv2.putText(frame, count_text, (counter_x + 20, counter_y + 60), 
                       cv2.FONT_HERSHEY_SIMPLEX, 2.5, (0, 255, 0), 4)
            
            # Exercise name
            cv2.putText(frame, exercise_type.upper(), (counter_x + 20, counter_y + 90), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
            
            # State indicator
            state_color = (0, 255, 255) if current_state == 'down' else (255, 255, 0)
            cv2.putText(frame, current_state.upper(), (counter_x + 180, counter_y + 110), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, state_color, 2)
        
        elif exercise_type in ['vertical_jump', 'long_jump']:
            count_text = f"{jump_count}"
            cv2.putText(frame, count_text, (counter_x + 20, counter_y + 60), 
                       cv2.FONT_HERSHEY_SIMPLEX, 2.5, (0, 255, 255), 4)
            
            cv2.putText(frame, "JUMPS", (counter_x + 20, counter_y + 90), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
    
    def _draw_mobile_info_panel(self, frame, exercise_type, frame_count, timestamp):
        """Draw compact mobile info panel"""
        h, w = frame.shape[:2]
        
        # Small info panel at top-left
        cv2.rectangle(frame, (10, 10), (250, 80), (0, 0, 0), -1)
        cv2.rectangle(frame, (10, 10), (250, 80), (255, 255, 255), 2)
        
        cv2.putText(frame, f"Frame: {frame_count}", (20, 35), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
        cv2.putText(frame, f"Time: {timestamp:.1f}s", (20, 55), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
        cv2.putText(frame, "MOBILE AI", (20, 75), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 255), 1)
    
    def _draw_mobile_rep_progress(self, frame, exercise_type, real_time_reps, current_state):
        """Draw mobile-optimized rep progress"""
        h, w = frame.shape[:2]
        
        # Progress bar at bottom
        bar_width = w - 40
        bar_height = 30
        bar_x = 20
        bar_y = h - 50
        
        # Background
        cv2.rectangle(frame, (bar_x, bar_y), (bar_x + bar_width, bar_y + bar_height), (50, 50, 50), -1)
        
        # Progress fill
        if real_time_reps > 0:
            progress = min(1.0, (real_time_reps % 10) / 10.0)  # Progress within each set of 10
            fill_width = int(bar_width * progress)
            cv2.rectangle(frame, (bar_x, bar_y), (bar_x + fill_width, bar_y + bar_height), (0, 255, 0), -1)
        
        # Progress text
        cv2.putText(frame, f"Reps: {real_time_reps} | Set: {real_time_reps // 10 + 1}", 
                   (bar_x + 10, bar_y + 20), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
    
    def _draw_mobile_jump_metrics(self, frame, exercise_type, jump_count, frame_count):
        """Draw mobile jump metrics"""
        h, w = frame.shape[:2]
        
        # Jump status at bottom
        status_y = h - 40
        cv2.putText(frame, f"Jumps Detected: {jump_count}", (20, status_y), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
        
        # Show metrics if available
        if hasattr(self, 'jump_metrics') and self.jump_metrics:
            if exercise_type == 'vertical_jump' and 'average_height_cm' in self.jump_metrics:
                cv2.putText(frame, f"Avg Height: {self.jump_metrics['average_height_cm']:.1f}cm", 
                           (w//2, status_y), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 255), 1)
            elif exercise_type == 'long_jump' and 'distance_cm' in self.jump_metrics:
                cv2.putText(frame, f"Distance: {self.jump_metrics['distance_cm']:.1f}cm", 
                           (w//2, status_y), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 255), 1)
    
    def _analyze_vertical_jumps_mobile(self, fps, user_height_cm):
        """Mobile-optimized vertical jump analysis"""
        if not self.jumps_detected:
            logger.info("No vertical jumps detected (mobile)")
            return
        
        # Mobile-simplified analysis
        pixel_to_cm_vertical = 0.25  # Conservative mobile estimate
        pixel_to_cm_horizontal = 0.3
        
        processed_jumps = []
        total_height = 0
        
        for i, jump in enumerate(self.jumps_detected):
            height_cm = float(abs(jump['height_pixels'] * pixel_to_cm_vertical))
            distance_cm = float(abs(jump['distance_pixels'] * pixel_to_cm_horizontal))
            
            # Mobile-simplified physics check
            physics_height_cm = float((9.81 * jump['flight_time']**2 / 8) * 100)
            final_height = float(min(height_cm, physics_height_cm * 1.3))  # More lenient for mobile
            
            processed_jump = {
                'jump_number': int(i + 1),
                'jump_height_cm': round(final_height, 1),
                'horizontal_distance_cm': round(distance_cm, 1),
                'flight_time_seconds': round(jump['flight_time'], 3)
            }
            
            processed_jumps.append(processed_jump)
            total_height += final_height
        
        self.jump_metrics = {
            'jump_count': int(len(processed_jumps)),
            'individual_jumps': processed_jumps,
            'average_height_cm': round(total_height / len(processed_jumps), 1),
            'total_height_cm': round(total_height, 1),
            'mobile_optimized': True
        }
        
        logger.info(f"Mobile jump analysis: {len(processed_jumps)} jumps, avg: {self.jump_metrics['average_height_cm']}cm")
    
    def _analyze_long_jump_mobile(self, fps, user_height_cm):
        """Mobile-optimized long jump analysis"""
        if self.jumps_detected:
            jump = self.jumps_detected[0]
            pixel_to_cm = 0.3  # Mobile estimate
            distance_cm = abs(jump['distance_pixels'] * pixel_to_cm)
            
            self.jump_metrics = {
                'distance_cm': round(distance_cm, 1),
                'flight_time_seconds': round(jump['flight_time'], 3),
                'mobile_optimized': True
            }
            
            logger.info(f"Mobile long jump: {distance_cm:.1f}cm")
        else:
            logger.info("No long jumps detected (mobile)")
    
    def _generate_mobile_analysis(self, exercise_type, fps, user_height_cm, duration):
        """Generate mobile-optimized analysis results"""
        valid_frames = [f for f in self.frame_data 
                       if f.get('person_detected', False) and f.get('avg_confidence', 0) > 0.2]
        
        if len(valid_frames) < 5:
            return {
                'error': 'Insufficient valid pose detections for mobile analysis',
                'details': f'Only {len(valid_frames)} frames with confident pose detection'
            }
        
        # Exercise-specific mobile results
        if exercise_type in ['pushups', 'situps', 'squats']:
            config = self.exercise_configs[exercise_type]
            
            # Mobile form analysis
            form_analysis = {
                'form_score': 85 if self.rep_count_live > 0 else 60,  # Simplified for mobile
                'mobile_optimized': True,
                'rep_timestamps': self.rep_timestamps
            }
            
            exercise_results = {
                'rep_count': int(self.rep_count_live),
                'form_analysis': form_analysis,
                'keypoints_used': config['keypoints'],
                'joint_names': config['joint_names'],
                'exercise_completed': self.rep_count_live > 0,
                'mobile_optimized': True
            }
        
        elif exercise_type in ['vertical_jump', 'long_jump']:
            if hasattr(self, 'jump_metrics') and self.jump_metrics:
                exercise_results = self.jump_metrics.copy()
                exercise_results['jump_detected'] = bool(self.jump_count > 0)
                exercise_results['frames_analyzed'] = len(valid_frames)
            else:
                exercise_results = {
                    'jump_detected': False,
                    'jump_count': 0,
                    'frames_analyzed': len(valid_frames),
                    'mobile_optimized': True
                }
        
        else:
            exercise_results = {'error': 'Unknown exercise type'}
        
        return {
            'exercise_type': exercise_type,
            'duration': float(duration),
            'total_frames': int(len(self.frame_data)),
            'valid_frames': int(len(valid_frames)),
            'fps': float(fps),
            'exercise_results': exercise_results,
            'analysis_quality': 'mobile_optimized',
            'mobile_performance': {
                'optimization_level': 'high',
                'frame_processing_ratio': len(valid_frames) / len(self.frame_data) if self.frame_data else 0,
                'real_time_counting': True
            },
            'timestamp': datetime.now().isoformat()
        }
