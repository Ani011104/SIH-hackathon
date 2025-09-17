# mobile_cheat_detection_engine.py - UPDATED with BALANCED thresholds

import cv2
import numpy as np
import json
import hashlib
import time
import logging
from datetime import datetime
from collections import deque, defaultdict
import statistics
import os

# Face verification imports (optimized for mobile)
from deepface import DeepFace

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class MobileCheatDetectionEngine:
    """
    Mobile-optimized cheat detection engine with BALANCED face verification
    """
    
    def __init__(self, reference_images_folder=None):
        logger.info("Initializing Mobile Cheat Detection Engine...")
        
        # Mobile-optimized parameters
        self.sequence_length = 15  # Reduced for mobile
        self.reference_images_folder = reference_images_folder
        
        # Smaller buffers for mobile memory efficiency
        self.keypoint_buffer = deque(maxlen=self.sequence_length)
        self.confidence_buffer = deque(maxlen=self.sequence_length)
        self.frame_buffer = deque(maxlen=20)  # Much smaller for mobile
        self.frame_hash_buffer = deque(maxlen=30)
        
        # 🔒 BALANCED: More reasonable thresholds that work for real matches
        self.thresholds = {
            'velocity_outlier_threshold': 2.5,  # Less strict for mobile processing
            'confidence_drop_threshold': 0.2,
            'duplicate_frames_threshold': 3,
            'face_similarity_threshold': 45.0,  # 🔒 BALANCED: More reasonable
            
            # 🔒 BALANCED: Adjusted DeepFace thresholds
            'deepface_cosine_strict': 0.50,     # More lenient for real matches
            'deepface_euclidean_strict': 0.75,  # More lenient
            'minimum_face_confidence': 35.0,    # Lower threshold for real matches
            'consensus_threshold': 0.4,         # 40% of verifications must pass (more lenient)
            'required_matches': 1               # Just 1 successful verification needed
        }
        
        # Load reference images
        self.reference_images = self._load_reference_images()
        self.reset_detection()
        
    def reset_detection(self):
        """Reset detection state for new video"""
        self.keypoint_buffer.clear()
        self.confidence_buffer.clear()
        self.frame_buffer.clear()
        self.frame_hash_buffer.clear()
        self.detected_flags = []
        
    def _load_reference_images(self):
        """Load reference images (limit for mobile efficiency)"""
        if not self.reference_images_folder or not os.path.exists(self.reference_images_folder):
            logger.warning("No reference images folder provided")
            return []
        
        reference_images = []
        supported_formats = ('.jpg', '.jpeg', '.png')
        
        # 🔒 BALANCED: Validate reference images but be more forgiving
        count = 0
        for filename in os.listdir(self.reference_images_folder):
            if filename.lower().endswith(supported_formats) and count < 3:  # Allow more reference images
                img_path = os.path.join(self.reference_images_folder, filename)
                
                # 🔒 BALANCED: Try to validate but don't be too strict
                try:
                    # Test if DeepFace can process this image
                    test_embedding = DeepFace.represent(
                        img_path=img_path,
                        model_name='VGG-Face',
                        enforce_detection=False  # More lenient detection
                    )
                    
                    if test_embedding:
                        reference_images.append({
                            'path': img_path,
                            'name': filename,
                            'validated': True
                        })
                        logger.info(f"✅ Validated reference image: {filename}")
                        count += 1
                    else:
                        # Still add it even if validation fails
                        reference_images.append({
                            'path': img_path,
                            'name': filename,
                            'validated': False
                        })
                        logger.warning(f"⚠️ Added reference without validation: {filename}")
                        count += 1
                        
                except Exception as e:
                    # Still add it even if there's an error
                    reference_images.append({
                        'path': img_path,
                        'name': filename,
                        'validated': False
                    })
                    logger.warning(f"⚠️ Added reference with validation error {filename}: {e}")
                    count += 1
        
        logger.info(f"Loaded {len(reference_images)} reference images (balanced approach)")
        return reference_images
    
    def analyze_video_mobile(self, video_path, exercise_type='general'):
        """
        🔹 MOBILE-OPTIMIZED: Fast cheat detection for smartphones with BALANCED verification
        """
        logger.info(f"Starting BALANCED mobile cheat detection: {video_path}")
        start_time = time.time()
        
        if len(self.reference_images) == 0:
            return {
                "error": "No reference images available",
                "details": "Please provide reference images in the reference_faces folder"
            }
        
        self.reset_detection()
        
        # Load video
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            return {"error": "Could not open video file"}
        
        # Get video properties
        fps = cap.get(cv2.CAP_PROP_FPS)
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        
        logger.info(f"Video: {total_frames} frames, {fps:.1f} FPS")
        
        # Mobile optimization: process every 3rd frame for speed
        frame_skip = 3
        # 🔒 BALANCED: Check reasonable number of frames
        face_check_interval = max(10, total_frames // 8)  # Check every 8th interval
        
        # Load YOLO model
        from ultralytics import YOLO
        pose_model = YOLO("yolo11n-pose.pt")  # Use nano model for mobile
        pose_model.overrides['verbose'] = False
        
        frame_count = 0
        processed_count = 0
        
        while True:
            success, frame = cap.read()
            if not success:
                break
            
            # Mobile optimization: skip frames for speed
            if frame_count % frame_skip == 0:
                timestamp = frame_count / fps
                
                # Resize frame for faster processing (mobile optimization)
                original_shape = frame.shape
                if frame.shape[1] > 640:  # If width > 640, resize
                    scale = 640.0 / frame.shape[1]
                    new_width = 640
                    new_height = int(frame.shape[0] * scale)
                    frame_resized = cv2.resize(frame, (new_width, new_height))
                else:
                    frame_resized = frame
                    scale = 1.0
                
                # Extract keypoints from resized frame
                results = pose_model(frame_resized, verbose=False)
                keypoints_data = self._extract_keypoints_from_results(results, scale, original_shape)
                
                # Store data
                if keypoints_data:
                    self.keypoint_buffer.append(keypoints_data['keypoints'])
                    self.confidence_buffer.append(keypoints_data['confidence'])
                else:
                    self.keypoint_buffer.append(np.zeros((17, 3)))
                    self.confidence_buffer.append(np.zeros(17))
                
                # 🔒 BALANCED: Store frames for verification
                if frame_count % face_check_interval == 0 and len(self.frame_buffer) < 6:
                    # Store original frame for face verification
                    self.frame_buffer.append(frame.copy())
                    logger.info(f"📸 Stored frame {frame_count} for balanced verification")
                
                # Mobile-optimized frame hash (smaller hash for speed)
                frame_hash = hashlib.md5(cv2.resize(frame_resized, (16, 16)).tobytes()).hexdigest()[:8]
                self.frame_hash_buffer.append(frame_hash)
                
                # Quick mobile analysis
                if len(self.keypoint_buffer) >= 3:
                    frame_flags = self._mobile_frame_analysis(keypoints_data, timestamp)
                    self.detected_flags.extend(frame_flags)
                
                processed_count += 1
            
            frame_count += 1
            
            # Mobile progress logging (less frequent)
            if frame_count % 500 == 0:
                logger.info(f"Processed {processed_count} frames (mobile-optimized)")
        
        cap.release()
        
        # 🔒 BALANCED: Mobile face verification with reasonable logic
        face_results = self._balanced_face_verification()
        
        # Generate mobile report
        cheat_report = self._generate_mobile_report(face_results, fps, total_frames)
        
        processing_time = time.time() - start_time
        cheat_report['processing_time'] = float(processing_time)
        
        logger.info(f"Mobile cheat detection complete in {processing_time:.2f}s")
        return cheat_report
    
    def _extract_keypoints_from_results(self, results, scale=1.0, original_shape=None):
        """Extract and scale keypoints back to original frame size"""
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
        
        # Scale keypoints back to original size
        if scale != 1.0:
            keypoints_xy[:, 0] = keypoints_xy[:, 0] / scale
            keypoints_xy[:, 1] = keypoints_xy[:, 1] / scale
        
        keypoints_full = np.column_stack([keypoints_xy, confidence_scores])
        
        return {
            'keypoints': keypoints_full,
            'confidence': confidence_scores
        }
    
    def _mobile_frame_analysis(self, keypoints_data, timestamp):
        """Mobile-optimized quick frame analysis"""
        flags = []
        
        # 1. Quick confidence check
        if keypoints_data:
            confidence = keypoints_data['confidence']
            avg_confidence = np.mean(confidence[confidence > 0]) if np.any(confidence > 0) else 0
            
            if avg_confidence < self.thresholds['confidence_drop_threshold']:
                flags.append({
                    'type': 'low_confidence',
                    'severity': 'medium',
                    'confidence': float(avg_confidence),
                    'timestamp': float(timestamp)
                })
        
        # 2. Simple duplicate check
        if len(self.frame_hash_buffer) > 1:
            current_hash = self.frame_hash_buffer[-1]
            duplicate_count = list(self.frame_hash_buffer).count(current_hash)
            
            if duplicate_count > self.thresholds['duplicate_frames_threshold']:
                flags.append({
                    'type': 'duplicate_frames',
                    'severity': 'high',
                    'duplicate_count': int(duplicate_count),
                    'timestamp': float(timestamp)
                })
        
        # 3. Basic movement check (mobile-optimized)
        if len(self.keypoint_buffer) >= 2 and keypoints_data:
            movement_flags = self._mobile_movement_check(keypoints_data, timestamp)
            flags.extend(movement_flags)
        
        return flags
    
    def _mobile_movement_check(self, keypoints_data, timestamp):
        """Mobile-optimized movement analysis"""
        flags = []
        
        if len(self.keypoint_buffer) < 2:
            return flags
        
        current_kp = self.keypoint_buffer[-1]
        prev_kp = self.keypoint_buffer[-2]
        
        large_movements = 0
        max_velocity = 0
        
        # Check key points only (mobile optimization)
        key_points = [5, 6, 7, 8, 11, 12, 15, 16]  # Major joints only
        
        for i in key_points:
            if i < len(current_kp) and i < len(prev_kp):
                if current_kp[i][2] > 0.3 and prev_kp[i][2] > 0.3:
                    velocity = np.linalg.norm(current_kp[i][:2] - prev_kp[i][:2])
                    max_velocity = max(max_velocity, velocity)
                    
                    if velocity > 120:  # More forgiving threshold
                        large_movements += 1
        
        if large_movements > 3:  # More forgiving
            flags.append({
                'type': 'velocity_outlier',
                'severity': 'medium',
                'large_movements': int(large_movements),
                'max_velocity': float(max_velocity),
                'timestamp': float(timestamp)
            })
        
        return flags
    
    def _balanced_face_verification(self):
        """🔒 BALANCED: Mobile face verification with reasonable thresholds"""
        logger.info("🔒 Starting BALANCED mobile face verification...")
        
        if not self.reference_images or len(self.frame_buffer) == 0:
            return {
                'verified': False,
                'confidence': 0.0,
                'error': 'No reference images or frames available'
            }
        
        frames_to_check = list(self.frame_buffer)
        logger.info(f"🔍 Verifying {len(frames_to_check)} frames with BALANCED thresholds")
        
        all_verification_results = []
        successful_verifications = 0
        total_verifications = 0
        similarity_scores = []
        
        # 🔒 BALANCED: Use fewer models for speed but still accurate
        models_to_test = ['VGG-Face']  # Start with most reliable
        distance_metrics = ['cosine']  # Most stable metric
        
        for frame_idx, frame in enumerate(frames_to_check):
            logger.info(f"📸 Processing frame {frame_idx + 1}/{len(frames_to_check)} for verification")
            
            # Light image enhancement (don't over-process)
            enhanced_frame = self._light_enhance_frame(frame)
            
            # Reasonable resize
            if enhanced_frame.shape[1] > 800:
                scale = 800.0 / enhanced_frame.shape[1]
                new_width = 800
                new_height = int(enhanced_frame.shape[0] * scale)
                frame_resized = cv2.resize(enhanced_frame, (new_width, new_height))
            else:
                frame_resized = enhanced_frame
            
            # Save frame temporarily
            temp_frame_path = f"temp_balanced_frame_{frame_idx}.jpg"
            cv2.imwrite(temp_frame_path, frame_resized, [cv2.IMWRITE_JPEG_QUALITY, 95])
            
            # Test with each reference image
            for ref_img in self.reference_images:
                for model_name in models_to_test:
                    for metric in distance_metrics:
                        try:
                            result = DeepFace.verify(
                                img1_path=temp_frame_path,
                                img2_path=ref_img['path'],
                                model_name=model_name,
                                distance_metric=metric,
                                enforce_detection=False  # More forgiving
                            )
                            
                            distance = result['distance']
                            
                            # 🔒 BALANCED: Reasonable thresholds
                            if model_name == 'VGG-Face' and metric == 'cosine':
                                threshold = self.thresholds['deepface_cosine_strict']  # 0.5
                                similarity = max(0, (1 - distance) * 100)
                            else:
                                threshold = 0.6  # Fallback
                                similarity = max(0, (1 - distance) * 100)
                            
                            similarity = min(100, similarity)  # Cap at 100%
                            
                            # 🔒 BALANCED: More reasonable verification
                            verified = (
                                distance <= threshold and 
                                similarity >= self.thresholds['minimum_face_confidence']  # 35%
                            )
                            
                            verification_result = {
                                'frame': frame_idx + 1,
                                'reference': ref_img['name'],
                                'model': model_name,
                                'metric': metric,
                                'distance': round(float(distance), 4),
                                'threshold': threshold,
                                'similarity': round(float(similarity), 2),
                                'verified': bool(verified)
                            }
                            
                            all_verification_results.append(verification_result)
                            total_verifications += 1
                            
                            if verified:
                                successful_verifications += 1
                                similarity_scores.append(similarity)
                                logger.info(f"✅ {model_name} MATCH: {ref_img['name']} - {similarity:.2f}% (distance: {distance:.4f})")
                            else:
                                logger.info(f"❌ {model_name} NO MATCH: {ref_img['name']} - {similarity:.2f}% (distance: {distance:.4f}, threshold: {threshold})")
                        
                        except Exception as e:
                            logger.warning(f"⚠️ {model_name} failed: {e}")
                            continue
            
            # Clean up temp file
            try:
                os.remove(temp_frame_path)
            except:
                pass
        
        # 🔒 BALANCED: Reasonable verification decision
        if total_verifications == 0:
            logger.warning("❌ No verification attempts succeeded")
            return {
                'verified': False,
                'confidence': 0.0,
                'error': 'No faces could be processed'
            }
        
        # Calculate metrics
        verification_rate = successful_verifications / total_verifications
        avg_similarity = np.mean(similarity_scores) if similarity_scores else 0
        max_similarity = np.max(similarity_scores) if similarity_scores else 0
        
        # 🔒 BALANCED: More reasonable decision logic
        balanced_verified = (
            verification_rate >= self.thresholds['consensus_threshold'] or  # 40% OR
            successful_verifications >= self.thresholds['required_matches'] or  # 1 match OR
            max_similarity >= 60.0  # High similarity match
        )
        
        # 🔒 BALANCED: Reasonable confidence calculation
        if balanced_verified:
            base_confidence = max(avg_similarity, max_similarity * 0.8)
            confidence = min(95, base_confidence + verification_rate * 20)  # More generous
        else:
            confidence = max(5, avg_similarity * 0.5)  # Still low for failed verification
        
        result = {
            'verified': bool(balanced_verified),
            'confidence': round(float(confidence), 2),
            'verification_rate': round(float(verification_rate * 100), 1),
            'avg_similarity': round(float(avg_similarity), 2),
            'max_similarity': round(float(max_similarity), 2),
            'successful_verifications': int(successful_verifications),
            'total_verifications': int(total_verifications),
            'frames_processed': len(frames_to_check),
            'models_used': models_to_test,
            'balanced_verification': True,
            'detailed_results': all_verification_results
        }
        
        if balanced_verified:
            logger.info(f"✅ BALANCED verification PASSED: {confidence:.2f}% confidence")
            logger.info(f"📊 {successful_verifications}/{total_verifications} verifications successful ({verification_rate*100:.1f}%)")
        else:
            logger.warning(f"❌ BALANCED verification FAILED: {confidence:.2f}% confidence")
            logger.warning(f"📊 Only {successful_verifications}/{total_verifications} verifications successful ({verification_rate*100:.1f}%)")
        
        return result
    
    def _light_enhance_frame(self, frame):
        """Light image enhancement that won't distort faces"""
        # Just apply light contrast enhancement
        lab = cv2.cvtColor(frame, cv2.COLOR_BGR2LAB)
        l, a, b = cv2.split(lab)
        
        # Light CLAHE
        clahe = cv2.createCLAHE(clipLimit=1.5, tileGridSize=(8,8))
        l = clahe.apply(l)
        
        enhanced = cv2.merge([l, a, b])
        enhanced = cv2.cvtColor(enhanced, cv2.COLOR_LAB2BGR)
        
        return enhanced
    
    def _generate_mobile_report(self, face_results, fps, total_frames):
        """Generate mobile-optimized cheat detection report with balanced analysis"""
        
        # Mobile-simplified flag categorization
        flag_categories = defaultdict(int)
        total_flags = len(self.detected_flags)
        
        for flag in self.detected_flags:
            flag_categories[flag['type']] += 1
        
        # 🔒 BALANCED: More reasonable risk calculation
        face_confidence = face_results.get('confidence', 0)
        face_verified = face_results.get('verified', False)
        
        # Face verification is 70% of the risk assessment (more balanced)
        if not face_verified:
            face_risk = 75  # High risk but not extreme
        else:
            face_risk = max(0, 100 - face_confidence)
        
        flag_risk = min(35, total_flags * 5)  # Cap flag risk
        overall_risk_score = (face_risk * 0.7 + flag_risk * 0.3)  # Face is 70% of risk
        
        # 🔒 BALANCED: More reasonable authenticity determination
        if not face_verified and face_confidence < 20:
            authenticity = 'highly_suspicious'
            risk_level = 'critical'
        elif overall_risk_score >= 70:
            authenticity = 'suspicious'
            risk_level = 'high'
        elif overall_risk_score >= 50:
            authenticity = 'questionable'
            risk_level = 'medium'
        elif overall_risk_score >= 30:
            authenticity = 'likely_authentic'
            risk_level = 'low'
        else:
            authenticity = 'authentic'
            risk_level = 'very_low'
        
        # 🔒 BALANCED: Better recommendations
        recommendations = []
        if not face_verified:
            if face_confidence < 10:
                recommendations.append("🚨 CRITICAL: Face verification completely failed - likely different person")
                recommendations.append("❌ STRONG REJECT: No similarity to reference images")
            else:
                recommendations.append("⚠️ MODERATE RISK: Face verification failed but some similarity detected")
                recommendations.append("🔍 REVIEW: Manual verification recommended")
        elif face_confidence < 40:
            recommendations.append("⚠️ LOW CONFIDENCE: Weak face match detected")
            recommendations.append("📋 CAUTION: Consider additional verification")
        else:
            recommendations.append("✅ VERIFIED: Face verification passed")
            recommendations.append("🔒 LEGITIMATE: Person identity confirmed")
        
        # Add motion-based recommendations
        if flag_categories.get('velocity_outlier', 0) > 0:
            recommendations.append("⚠️ MOTION: Unusual movements detected")
        
        if flag_categories.get('duplicate_frames', 0) > 0:
            recommendations.append("⚠️ VIDEO: Duplicate frames detected")
        
        return {
            'cheat_detection_results': {
                'authenticity_status': authenticity,
                'overall_risk_level': risk_level,
                'overall_risk_score': round(float(overall_risk_score), 2),
                'confidence_score': round(100 - overall_risk_score, 2),
                'balanced_verification': True
            },
            'face_verification': face_results,
            'flag_analysis': {
                'total_flags': int(total_flags),
                'flag_categories': dict(flag_categories)
            },
            'recommendations': recommendations,
            'analysis_metadata': {
                'total_frames_analyzed': int(total_frames),
                'fps': float(fps),
                'optimization_level': 'mobile_balanced',
                'models_used': ['YOLO11n-pose', 'DeepFace-VGG-Face'],
                'verification_approach': 'balanced_consensus',
                'thresholds_used': {
                    'face_similarity_threshold': self.thresholds['face_similarity_threshold'],
                    'deepface_cosine_strict': self.thresholds['deepface_cosine_strict'],
                    'minimum_face_confidence': self.thresholds['minimum_face_confidence'],
                    'consensus_threshold': self.thresholds['consensus_threshold']
                }
            }
        }