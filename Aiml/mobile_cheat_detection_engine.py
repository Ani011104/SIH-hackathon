# mobile_cheat_detection_engine.py - FIXED and HIGHLY OPTIMIZED for speed

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
from scipy.spatial.distance import cosine  # For fast distance computation

# Face verification imports (optimized for mobile)
from deepface import DeepFace

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class MobileCheatDetectionEngine:
    """
    Mobile-optimized cheat detection engine with BALANCED face verification
    FIXED: Fallback embedding computation, robust error handling
    HIGHLY OPTIMIZED: Precompute embeddings, minimal face checks, aggressive frame skipping
    """
    
    def __init__(self, reference_images_folder=None):
        logger.info("Initializing FIXED HIGHLY OPTIMIZED Mobile Cheat Detection Engine...")
        
        # Mobile-optimized parameters
        self.sequence_length = 10  # Further reduced for speed
        self.reference_images_folder = reference_images_folder
        
        # Smaller buffers for mobile memory efficiency
        self.keypoint_buffer = deque(maxlen=self.sequence_length)
        self.confidence_buffer = deque(maxlen=self.sequence_length)
        self.frame_buffer = deque(maxlen=10)  # Reduced for speed
        self.frame_hash_buffer = deque(maxlen=20)  # Reduced for speed
        
        # 🔒 BALANCED: Reasonable thresholds
        self.thresholds = {
            'velocity_outlier_threshold': 2.5,  # Less strict
            'confidence_drop_threshold': 0.2,
            'duplicate_frames_threshold': 3,
            'face_similarity_threshold': 45.0,  # Reasonable
            'deepface_cosine_strict': 0.50,     # Lenient for real matches
            'minimum_face_confidence': 35.0,    # Lower threshold
            'consensus_threshold': 0.4,         # 40% of verifications must pass
            'required_matches': 1               # 1 match needed
        }
        
        # OPTIMIZED: Precompute reference embeddings
        self.reference_embeddings = self._preload_reference_embeddings()
        self.reference_images = self._load_reference_images()
        self.reset_detection()
        
    def reset_detection(self):
        """Reset detection state for new video"""
        self.keypoint_buffer.clear()
        self.confidence_buffer.clear()
        self.frame_buffer.clear()
        self.frame_hash_buffer.clear()
        self.detected_flags = []
        
    def _preload_reference_embeddings(self):
        """OPTIMIZED: Precompute embeddings for all reference images once"""
        if not self.reference_images_folder or not os.path.exists(self.reference_images_folder):
            logger.warning("No reference images folder for preloading")
            return {}
        
        embeddings = {}
        supported_formats = ('.jpg', '.jpeg', '.png')
        count = 0
        
        for filename in os.listdir(self.reference_images_folder):
            if filename.lower().endswith(supported_formats) and count < 3:
                img_path = os.path.join(self.reference_images_folder, filename)
                try:
                    # Precompute embedding
                    embedding_list = DeepFace.represent(
                        img_path=img_path,
                        model_name='VGG-Face',
                        enforce_detection=False
                    )
                    if embedding_list:
                        embedding = embedding_list[0]['embedding']
                        embeddings[filename] = np.array(embedding)
                        logger.info(f"✅ Preloaded embedding for: {filename}")
                        count += 1
                    else:
                        logger.warning(f"⚠️ No embedding generated for {filename} (no face detected?)")
                except Exception as e:
                    logger.warning(f"⚠️ Failed to preload embedding for {filename}: {e}")
        
        logger.info(f"Preloaded {len(embeddings)} reference embeddings")
        return embeddings
    
    def _compute_embeddings_fallback(self):
        """FIXED: Compute embeddings on the fly if preloading failed"""
        logger.info("🔄 Computing embeddings fallback (preloaded failed)")
        embeddings = {}
        for ref_img in self.reference_images:
            filename = ref_img['name']
            img_path = ref_img['path']
            try:
                embedding_list = DeepFace.represent(
                    img_path=img_path,
                    model_name='VGG-Face',
                    enforce_detection=False
                )
                if embedding_list:
                    embedding = embedding_list[0]['embedding']
                    embeddings[filename] = np.array(embedding)
                    logger.info(f"✅ Fallback embedding for: {filename}")
                else:
                    logger.warning(f"⚠️ Fallback failed for {filename} (no face)")
            except Exception as e:
                logger.warning(f"⚠️ Fallback embedding failed for {filename}: {e}")
        logger.info(f"Fallback computed {len(embeddings)} embeddings")
        return embeddings
    
    def _load_reference_images(self):
        """Load reference images (limit for mobile efficiency)"""
        if not self.reference_images_folder or not os.path.exists(self.reference_images_folder):
            logger.warning("No reference images folder provided")
            return []
        
        reference_images = []
        supported_formats = ('.jpg', '.jpeg', '.png')
        
        count = 0
        for filename in os.listdir(self.reference_images_folder):
            if filename.lower().endswith(supported_formats) and count < 3:
                img_path = os.path.join(self.reference_images_folder, filename)
                validated = filename in self.reference_embeddings
                reference_images.append({
                    'path': img_path,
                    'name': filename,
                    'validated': validated
                })
                logger.info(f"{'✅' if validated else '⚠️'} Reference image: {filename} {'validated' if validated else 'unvalidated'}")
                count += 1
        
        logger.info(f"Loaded {len(reference_images)} reference images (optimized)")
        return reference_images
    
    def analyze_video_mobile(self, video_path, exercise_type='general'):
        """
        🔹 HIGHLY OPTIMIZED: Fast cheat detection with minimal face verification
        FIXED: Fallback for embeddings, robust error handling
        """
        logger.info(f"Starting HIGHLY OPTIMIZED mobile cheat detection: {video_path}")
        start_time = time.time()
        
        # FIXED: Fallback if no preloaded embeddings
        if len(self.reference_embeddings) == 0 and len(self.reference_images) > 0:
            logger.warning("No preloaded embeddings - using fallback")
            self.reference_embeddings = self._compute_embeddings_fallback()
        
        if len(self.reference_images) == 0 or len(self.reference_embeddings) == 0:
            logger.error("No valid reference images or embeddings available - skipping cheat detection")
            # FIXED: Return default results instead of error to allow sports analysis to proceed
            default_face_results = {
                'verified': False,
                'confidence': 0.0,
                'error': 'No valid reference images/embeddings',
                'frames_processed': 0,
                'optimized_verification': True
            }
            default_report = self._generate_mobile_report(default_face_results, 0, 0)
            default_report['processing_time'] = 0.0
            default_report['skipped_due_to_refs'] = True
            return default_report
        
        self.reset_detection()
        
        # Load video
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            logger.error("Could not open video file")
            return {"error": "Could not open video file"}
        
        # Get video properties
        fps = cap.get(cv2.CAP_PROP_FPS)
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        logger.info(f"Video: {total_frames} frames, {fps:.1f} FPS")
        
        # OPTIMIZED: Aggressive frame skipping
        frame_skip = 10  # Process every 10th frame
        face_check_interval = max(20, total_frames // 4)  # Even fewer face checks
        max_face_frames = 2  # Max 2 frames for face verification
        
        # Load YOLO model
        try:
            from ultralytics import YOLO
            pose_model = YOLO("yolo11n-pose.pt")
            pose_model.overrides['verbose'] = False
            logger.info("YOLO model loaded successfully")
        except Exception as e:
            logger.error(f"Failed to load YOLO model: {e}")
            # FIXED: Return default if YOLO fails
            default_face_results = {
                'verified': False,
                'confidence': 0.0,
                'error': f'YOLO loading failed: {str(e)}',
                'frames_processed': 0,
                'optimized_verification': True
            }
            default_report = self._generate_mobile_report(default_face_results, fps, total_frames)
            default_report['processing_time'] = time.time() - start_time
            return default_report
        
        frame_count = 0
        processed_count = 0
        face_frames_stored = 0
        
        try:
            while True:
                success, frame = cap.read()
                if not success:
                    break
                
                if frame_count % frame_skip == 0:
                    timestamp = frame_count / fps
                    
                    # Resize frame for faster processing
                    original_shape = frame.shape
                    if frame.shape[1] > 480:  # Smaller resize for speed
                        scale = 480.0 / frame.shape[1]
                        new_width = 480
                        new_height = int(frame.shape[0] * scale)
                        frame_resized = cv2.resize(frame, (new_width, new_height))
                    else:
                        frame_resized = frame
                        scale = 1.0
                    
                    # Extract keypoints
                    try:
                        results = pose_model(frame_resized, verbose=False)
                        keypoints_data = self._extract_keypoints_from_results(results, scale, original_shape)
                    except Exception as e:
                        logger.warning(f"Keypoint extraction failed at frame {frame_count}: {e}")
                        keypoints_data = None
                    
                    # Store data
                    if keypoints_data:
                        self.keypoint_buffer.append(keypoints_data['keypoints'])
                        self.confidence_buffer.append(keypoints_data['confidence'])
                    else:
                        self.keypoint_buffer.append(np.zeros((17, 3)))
                        self.confidence_buffer.append(np.zeros(17))
                    
                    # Store frames for face verification
                    if frame_count % face_check_interval == 0 and face_frames_stored < max_face_frames:
                        self.frame_buffer.append(frame.copy())
                        logger.info(f"📸 Stored frame {frame_count} for optimized verification")
                        face_frames_stored += 1
                    
                    # Frame hash for duplicate detection
                    frame_hash = hashlib.md5(cv2.resize(frame_resized, (16, 16)).tobytes()).hexdigest()[:8]
                    self.frame_hash_buffer.append(frame_hash)
                    
                    # Quick analysis
                    if len(self.keypoint_buffer) >= 3:
                        frame_flags = self._mobile_frame_analysis(keypoints_data, timestamp)
                        self.detected_flags.extend(frame_flags)
                    
                    processed_count += 1
                
                frame_count += 1
                
                if frame_count % 500 == 0:
                    logger.info(f"Processed {processed_count} frames (optimized)")
            
            logger.info(f"Video processing complete: {processed_count} frames analyzed")
        except Exception as e:
            logger.error(f"Error during video processing loop: {e}")
        finally:
            cap.release()
        
        # Face verification
        try:
            face_results = self._optimized_face_verification()
            logger.info("Face verification completed")
        except Exception as e:
            logger.error(f"Face verification failed: {e}")
            face_results = {
                'verified': False,
                'confidence': 0.0,
                'error': f'Face verification failed: {str(e)}',
                'frames_processed': len(self.frame_buffer),
                'optimized_verification': True
            }
        
        # Generate report
        cheat_report = self._generate_mobile_report(face_results, fps, total_frames)
        
        processing_time = time.time() - start_time
        cheat_report['processing_time'] = float(processing_time)
        
        logger.info(f"HIGHLY OPTIMIZED mobile cheat detection complete in {processing_time:.2f}s")
        return cheat_report
    
    # ... (rest of the methods remain the same as in the previous optimized version)
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
        
        # Confidence check
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
        
        # Duplicate check
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
        
        # Movement check
        if len(self.keypoint_buffer) >= 2 and keypoints_data:
            movement_flags = self._mobile_movement_check(keypoints_data, timestamp)
            flags.extend(movement_flags)
        
        return flags
    
    def _mobile_movement_check(self, keypoints_data, timestamp):
        """Mobile-optimized movement analysis (simplified)"""
        flags = []
        
        if len(self.keypoint_buffer) < 2:
            return flags
        
        current_kp = self.keypoint_buffer[-1]
        prev_kp = self.keypoint_buffer[-2]
        
        large_movements = 0
        max_velocity = 0
        
        # OPTIMIZED: Check only critical keypoints
        key_points = [5, 6, 11, 12]  # Shoulders and hips only
        
        for i in key_points:
            if i < len(current_kp) and i < len(prev_kp):
                if current_kp[i][2] > 0.3 and prev_kp[i][2] > 0.3:
                    velocity = np.linalg.norm(current_kp[i][:2] - prev_kp[i][:2])
                    max_velocity = max(max_velocity, velocity)
                    if velocity > 120:
                        large_movements += 1
        
        if large_movements > 2:  # More forgiving
            flags.append({
                'type': 'velocity_outlier',
                'severity': 'medium',
                'large_movements': int(large_movements),
                'max_velocity': float(max_velocity),
                'timestamp': float(timestamp)
            })
        
        return flags
    
    def _optimized_face_verification(self):
        """🔒 HIGHLY OPTIMIZED: Minimal face checks with precomputed embeddings"""
        logger.info("🔒 Starting HIGHLY OPTIMIZED mobile face verification...")
        
        if not self.reference_images or len(self.frame_buffer) == 0 or len(self.reference_embeddings) == 0:
            logger.error("No reference images, frames, or embeddings for verification")
            return {
                'verified': False,
                'confidence': 0.0,
                'error': 'No reference images, frames, or embeddings available',
                'frames_processed': 0,
                'optimized_verification': True
            }
        
        frames_to_check = list(self.frame_buffer)[:2]  # Max 2 frames
        logger.info(f"🔍 Verifying {len(frames_to_check)} frames with HIGHLY OPTIMIZED thresholds")
        
        all_verification_results = []
        successful_verifications = 0
        total_verifications = 0
        similarity_scores = []
        
        model_name = 'VGG-Face'
        distance_metric = 'cosine'
        threshold = self.thresholds['deepface_cosine_strict']
        
        for frame_idx, frame in enumerate(frames_to_check):
            logger.info(f"📸 Processing frame {frame_idx + 1}/{len(frames_to_check)}")
            
            enhanced_frame = self._light_enhance_frame(frame)
            if enhanced_frame.shape[1] > 480:  # Smaller resize
                scale = 480.0 / enhanced_frame.shape[1]
                new_width = 480
                new_height = int(enhanced_frame.shape[0] * scale)
                frame_resized = cv2.resize(enhanced_frame, (new_width, new_height))
            else:
                frame_resized = enhanced_frame
            
            temp_frame_path = f"temp_optimized_frame_{frame_idx}.jpg"
            cv2.imwrite(temp_frame_path, frame_resized, [cv2.IMWRITE_JPEG_QUALITY, 90])
            
            try:
                frame_embedding_list = DeepFace.represent(
                    img_path=temp_frame_path,
                    model_name=model_name,
                    enforce_detection=False
                )
                if not frame_embedding_list:
                    logger.warning(f"No face detected in frame {frame_idx + 1}")
                    os.remove(temp_frame_path)
                    continue
                frame_embedding = np.array(frame_embedding_list[0]['embedding'])
            except Exception as e:
                logger.warning(f"Failed to extract frame embedding: {e}")
                os.remove(temp_frame_path)
                continue
            
            for ref_name, ref_embedding in self.reference_embeddings.items():
                try:
                    distance = cosine(frame_embedding, ref_embedding)
                    similarity = max(0, (1 - distance) * 100)
                    similarity = min(100, similarity)
                    
                    verified = (
                        distance <= threshold and 
                        similarity >= self.thresholds['minimum_face_confidence']
                    )
                    
                    verification_result = {
                        'frame': frame_idx + 1,
                        'reference': ref_name,
                        'model': model_name,
                        'metric': distance_metric,
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
                        logger.info(f"✅ MATCH: {ref_name} - {similarity:.2f}%")
                    else:
                        logger.info(f"❌ NO MATCH: {ref_name} - {similarity:.2f}%")
                except Exception as e:
                    logger.warning(f"Distance computation failed for {ref_name}: {e}")
                    continue
            
            os.remove(temp_frame_path)
        
        if total_verifications == 0:
            logger.warning("No verification attempts succeeded")
            return {
                'verified': False,
                'confidence': 0.0,
                'error': 'No faces could be processed',
                'frames_processed': len(frames_to_check),
                'optimized_verification': True
            }
        
        verification_rate = successful_verifications / total_verifications
        avg_similarity = np.mean(similarity_scores) if similarity_scores else 0
        max_similarity = np.max(similarity_scores) if similarity_scores else 0
        
        balanced_verified = (
            verification_rate >= self.thresholds['consensus_threshold'] or
            successful_verifications >= self.thresholds['required_matches'] or
            max_similarity >= 60.0
        )
        
        if balanced_verified:
            confidence = min(95, max(avg_similarity, max_similarity * 0.8) + verification_rate * 20)
        else:
            confidence = max(5, avg_similarity * 0.5)
        
        result = {
            'verified': bool(balanced_verified),
            'confidence': round(float(confidence), 2),
            'verification_rate': round(float(verification_rate * 100), 1),
            'avg_similarity': round(float(avg_similarity), 2),
            'max_similarity': round(float(max_similarity), 2),
            'successful_verifications': int(successful_verifications),
            'total_verifications': int(total_verifications),
            'frames_processed': len(frames_to_check),
            'models_used': [model_name],
            'optimized_verification': True,
            'detailed_results': all_verification_results
        }
        
        logger.info(f"{'✅' if balanced_verified else '❌'} Verification {'PASSED' if balanced_verified else 'FAILED'}: {confidence:.2f}% confidence")
        logger.info(f"📊 {successful_verifications}/{total_verifications} verifications ({verification_rate*100:.1f}%)")
        return result
    
    def _light_enhance_frame(self, frame):
        """Light image enhancement that won't distort faces"""
        lab = cv2.cvtColor(frame, cv2.COLOR_BGR2LAB)
        l, a, b = cv2.split(lab)
        clahe = cv2.createCLAHE(clipLimit=1.5, tileGridSize=(8,8))
        l = clahe.apply(l)
        enhanced = cv2.merge([l, a, b])
        return cv2.cvtColor(enhanced, cv2.COLOR_LAB2BGR)
    
    def _generate_mobile_report(self, face_results, fps, total_frames):
        """Generate mobile-optimized cheat detection report"""
        flag_categories = defaultdict(int)
        total_flags = len(self.detected_flags)
        
        for flag in self.detected_flags:
            flag_categories[flag['type']] += 1
        
        face_confidence = face_results.get('confidence', 0)
        face_verified = face_results.get('verified', False)
        
        if not face_verified:
            face_risk = 75
        else:
            face_risk = max(0, 100 - face_confidence)
        
        flag_risk = min(35, total_flags * 5)
        overall_risk_score = (face_risk * 0.7 + flag_risk * 0.3)
        
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
        
        recommendations = []
        if not face_verified:
            if face_confidence < 10:
                recommendations.append("🚨 CRITICAL: Face verification completely failed")
                recommendations.append("❌ STRONG REJECT: No similarity to reference images")
            else:
                recommendations.append("⚠️ MODERATE RISK: Face verification failed")
                recommendations.append("🔍 REVIEW: Manual verification recommended")
        elif face_confidence < 40:
            recommendations.append("⚠️ LOW CONFIDENCE: Weak face match")
            recommendations.append("📋 CAUTION: Consider additional verification")
        else:
            recommendations.append("✅ VERIFIED: Face verification passed")
            recommendations.append("🔒 LEGITIMATE: Person identity confirmed")
        
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
                'balanced_verification': True,
                'optimized': True
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
                'optimization_level': 'mobile_balanced_highly_optimized',
                'models_used': ['YOLO11n-pose', 'DeepFace-VGG-Face-Optimized'],
                'verification_approach': 'balanced_consensus_optimized',
                'thresholds_used': {
                    'face_similarity_threshold': self.thresholds['face_similarity_threshold'],
                    'deepface_cosine_strict': self.thresholds['deepface_cosine_strict'],
                    'minimum_face_confidence': self.thresholds['minimum_face_confidence'],
                    'consensus_threshold': self.thresholds['consensus_threshold']
                }
            }
        }