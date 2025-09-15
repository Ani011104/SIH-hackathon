# mobile_integration_system.py

import json
import time
import logging
from datetime import datetime  # ✅ FIXED: Added missing import
from mobile_cheat_detection_engine import MobileCheatDetectionEngine
from mobile_sports_assessment_engine import MobileSportsAssessmentEngine

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class MobileIntegrationSystem:
    """
    Mobile-optimized integration system for smartphones
    """
    
    def __init__(self, reference_images_folder=None):
        logger.info("🚀 Initializing Mobile Integration System...")
        
        # Initialize mobile engines
        self.cheat_detector = MobileCheatDetectionEngine(
            reference_images_folder=reference_images_folder
        )
        self.sports_analyzer = MobileSportsAssessmentEngine()
        
        logger.info("✅ Mobile Integration System ready for smartphones!")
    
    def analyze_video_mobile_complete(self, video_path, exercise_type, user_height_cm=170, 
                                    reference_images_folder=None, generate_video=True, save_json=True):
        """
        🔹 MOBILE-COMPLETE: Full analysis optimized for smartphones
        """
        logger.info(f"📱 Starting mobile analysis: {video_path}")
        start_time = time.time()
        
        # Update reference folder if provided
        if reference_images_folder:
            self.cheat_detector.reference_images_folder = reference_images_folder
            self.cheat_detector.reference_images = self.cheat_detector._load_reference_images()
        
        try:
            # STEP 1: Mobile Cheat Detection (optimized)
            logger.info("🔍 STEP 1: Mobile cheat detection...")
            cheat_start = time.time()
            cheat_results = self.cheat_detector.analyze_video_mobile(video_path, exercise_type)
            cheat_time = time.time() - cheat_start
            
            # STEP 2: Mobile Sports Analysis (with real-time counting)
            logger.info("🏃 STEP 2: Mobile sports analysis with real-time counting...")
            sports_start = time.time()
            sports_results = self.sports_analyzer.analyze_video_mobile(
                video_path, exercise_type, user_height_cm, generate_video, save_json=False
            )
            sports_time = time.time() - sports_start
            
            # STEP 3: Mobile Results Integration
            logger.info("📊 STEP 3: Finalizing mobile results...")
            final_results = self._create_mobile_results(cheat_results, sports_results, cheat_time, sports_time)
            
            total_processing_time = time.time() - start_time
            final_results['total_processing_time'] = float(total_processing_time)
            
            # Save mobile-optimized JSON
            if save_json:
                json_filename = f"mobile_complete_{exercise_type}_{int(time.time())}.json"
                with open(json_filename, 'w') as f:
                    json.dump(final_results, f, indent=2)
                final_results['saved_json'] = json_filename
                logger.info(f"📄 Mobile results saved: {json_filename}")
            
            logger.info(f"✅ Mobile analysis complete in {total_processing_time:.2f}s")
            return final_results
        
        except Exception as e:
            logger.error(f"❌ Mobile analysis failed: {e}")
            return {
                'error': f'Mobile analysis failed: {str(e)}',
                'timestamp': datetime.now().isoformat(),  # ✅ FIXED: Using proper datetime
                'mobile_optimized': True
            }
    
    def _create_mobile_results(self, cheat_results, sports_results, cheat_time, sports_time):
        """Create mobile-optimized final results"""
        
        # Mobile-simplified authenticity assessment
        cheat_detection = cheat_results.get('cheat_detection_results', {})
        authenticity_status = cheat_detection.get('authenticity_status', 'unknown')
        overall_risk_score = cheat_detection.get('overall_risk_score', 0)
        
        # Mobile validity determination
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
        
        # Get performance metrics
        exercise_results = sports_results.get('exercise_results', {})
        rep_count = exercise_results.get('rep_count', 0)
        jump_detected = exercise_results.get('jump_detected', False)
        jump_count = exercise_results.get('jump_count', 0)
        
        return {
            # Mobile Summary
            'mobile_summary': {
                'final_validity': final_validity,
                'authenticity_confidence': round(100 - overall_risk_score, 2),
                'performance_detected': bool(rep_count > 0 or jump_detected),
                'recommendation': recommendation,
                'processing_speed': 'mobile_optimized',
                'real_time_counting': True
            },
            
            # Performance Results
            'performance_results': {
                'exercise_type': sports_results.get('exercise_type', 'unknown'),
                'rep_count': rep_count,
                'jump_count': jump_count,
                'exercise_results': exercise_results,
                'output_video': sports_results.get('output_video'),
                'video_properties': sports_results.get('video_properties', {}),
                'mobile_performance': sports_results.get('mobile_performance', {})
            },
            
            # Security Results
            'security_results': {
                'authenticity_status': authenticity_status,
                'risk_level': cheat_detection.get('overall_risk_level', 'unknown'),
                'risk_score': overall_risk_score,
                'confidence_score': cheat_detection.get('confidence_score', 0),
                'face_verification': cheat_results.get('face_verification', {}),
                'flag_analysis': cheat_results.get('flag_analysis', {}),
                'recommendations': cheat_results.get('recommendations', [])
            },
            
            # Mobile Technical Details
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
                'analysis_timestamp': datetime.now().isoformat(),  # ✅ FIXED: Using proper datetime
                'version': 'mobile_v1.0'
            }
        }

# Mobile Flask API
from flask import Flask, request, jsonify
import os

app = Flask(__name__)

try:
    mobile_system = MobileIntegrationSystem(reference_images_folder="reference_faces")
    logger.info("✅ Mobile Integration System API ready!")
except Exception as e:
    logger.error(f"❌ Failed to initialize mobile system: {e}")
    mobile_system = None

@app.route('/analyze_mobile', methods=['POST'])
def analyze_mobile():
    """🔹 MOBILE API: Smartphone-optimized analysis"""
    if mobile_system is None:
        return jsonify({'error': 'Mobile system not initialized'}), 500
    
    try:
        if 'video' not in request.files:
            return jsonify({'error': 'No video file provided'}), 400
        
        video_file = request.files['video']
        if video_file.filename == '':
            return jsonify({'error': 'No video file selected'}), 400
        
        # Mobile parameters
        exercise_type = request.form.get('exercise_type', 'pushups')
        user_height = int(request.form.get('user_height', 170))
        generate_video = request.form.get('generate_video', 'true').lower() == 'true'
        save_json = request.form.get('save_json', 'true').lower() == 'true'
        
        # Validate exercise type
        valid_exercises = ['pushups', 'situps', 'squats', 'vertical_jump', 'long_jump']
        if exercise_type not in valid_exercises:
            return jsonify({
                'error': f'Invalid exercise type. Supported: {valid_exercises}'
            }), 400
        
        # Handle reference images (mobile-limited)
        reference_folder = None
        if 'reference_images' in request.files:
            reference_folder = f"temp_mobile_refs_{int(time.time())}"
            os.makedirs(reference_folder, exist_ok=True)
            
            reference_files = request.files.getlist('reference_images')[:2]  # Limit for mobile
            for ref_file in reference_files:
                if ref_file.filename:
                    ref_path = os.path.join(reference_folder, ref_file.filename)
                    ref_file.save(ref_path)
        
        # Save video temporarily
        temp_path = f"temp_mobile_{int(time.time())}_{video_file.filename}"
        video_file.save(temp_path)
        
        logger.info(f"📱 Processing mobile: {temp_path} for {exercise_type}")
        
        # 🚀 RUN MOBILE ANALYSIS
        results = mobile_system.analyze_video_mobile_complete(
            temp_path, exercise_type, user_height, reference_folder, generate_video, save_json
        )
        
        # Mobile cleanup
        try:
            os.remove(temp_path)
            if reference_folder and os.path.exists(reference_folder):
                import shutil
                shutil.rmtree(reference_folder)
        except:
            pass
        
        return jsonify(results)
        
    except Exception as e:
        logger.error(f"❌ Mobile API error: {e}")
        return jsonify({'error': f'Mobile analysis failed: {str(e)}'}), 500

@app.route('/mobile_health', methods=['GET'])
def mobile_health():
    """Mobile health check"""
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

if __name__ == '__main__':
    logger.info("📱 Starting Mobile Integration System API...")
    logger.info("🎯 Optimized for: Smartphones, Real-time counting, Fast processing")
    app.run(host='0.0.0.0', port=5000, debug=False, threaded=True)
