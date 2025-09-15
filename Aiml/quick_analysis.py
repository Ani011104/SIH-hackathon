# quick_analysis.py

from comprehensive_analysis_engine import analyze_json_files, print_analysis_summary

def main():
    """Quick analysis of JSON files"""
    
    # Your JSON files
    json_files = [
        "json_outputs/mobile_complete_long_jump_1757872408.json",
        "json_outputs/mobile_complete_pushups_1757869729.json", 
        "json_outputs/mobile_complete_situps_1757869249.json",
        "json_outputs/mobile_complete_squats_1757872267.json",
        "json_outputs/mobile_complete_vertical_jump_1757869853.json"
    ]
    
    print("🚀 Starting Comprehensive Analysis...")
    
    # Run analysis
    results = analyze_json_files(json_files, save_results=True)
    
    # Print formatted summary
    print_analysis_summary(results)
    
    # Additional insights
    if 'error' not in results:
        print("\n🎯 KEY INSIGHTS:")
        
        # User behavior
        user_insights = results['user_insights']
        print(f"  • Favorite Exercise: {list(user_insights['usage_patterns']['favorite_exercises'].keys())[0]}")
        print(f"  • Total Exercise Time: {user_insights['usage_patterns']['total_exercise_time']:.1f} seconds")
        print(f"  • System Efficiency: {user_insights['engagement_metrics']['system_efficiency']}%")
        
        # Security insights
        security = results['security_analysis']
        risk_dist = security['risk_assessment']['risk_score_distribution']
        print(f"  • High Risk Sessions: {risk_dist['high'] + risk_dist['critical']}")
        print(f"  • Face Verification Issues: {security['face_verification_analysis']['failed_verifications']}")
        
        print(f"\n📄 Detailed analysis saved to: {results.get('saved_analysis', 'analysis_results.json')}")

if __name__ == "__main__":
    main()
