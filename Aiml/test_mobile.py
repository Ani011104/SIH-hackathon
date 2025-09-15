# test_mobile.py

from mobile_integration_system import MobileIntegrationSystem

def test_mobile():
    """Test mobile system"""
    
    system = MobileIntegrationSystem(reference_images_folder="reference_faces")
    
    results = system.analyze_video_mobile_complete(
        video_path="video/long_jump.mp4",  # Your video path
        exercise_type="long_jump",
        user_height_cm=170,
        generate_video=True,
        save_json=True
    )
    
    print("📱 MOBILE ANALYSIS RESULTS:")
    print("=" * 40)
    
    # Handle error case
    if 'error' in results:
        print(f"❌ Error: {results['error']}")
        return
    
    mobile_summary = results.get('mobile_summary', {})
    performance = results.get('performance_results', {})
    security = results.get('security_results', {})
    
    print(f"✅ Validity: {mobile_summary.get('final_validity', 'unknown')}")
    print(f"🎯 Recommendation: {mobile_summary.get('recommendation', 'N/A')}")
    print(f"🏃 Exercise: {performance.get('exercise_type', 'unknown')}")
    print(f"🔢 Rep Count: {performance.get('rep_count', 0)}")
    print(f"🎬 Video: {performance.get('output_video', 'None')}")
    print(f"⚡ Processing Time: {results.get('total_processing_time', 0):.2f}s")
    print(f"📄 JSON File: {results.get('saved_json', 'None')}")
    
    # Face verification details
    face_verification = security.get('face_verification', {})
    print(f"🔒 Face Verified: {face_verification.get('verified', False)}")
    print(f"💯 Face Confidence: {face_verification.get('confidence', 0)}%")
    print(f"🎯 Risk Score: {security.get('risk_score', 0)}")
    
    print("\n📋 RECOMMENDATIONS:")
    for rec in security.get('recommendations', []):
        print(f"   {rec}")

if __name__ == "__main__":
    test_mobile()
