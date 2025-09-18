#!/usr/bin/env python3
"""
Simple script to test mobile engine imports and initialization.
Run this to isolate import problems from Flask integration issues.
"""

import sys
import traceback

def test_imports():
    print("=== TESTING MOBILE ENGINE IMPORTS ===")
    print(f"Python executable: {sys.executable}")
    print(f"Python version: {sys.version}")
    print()
    
    # Test 1: Import mobile_cheat_detection_engine
    print("1. Testing mobile_cheat_detection_engine import...")
    try:
        from mobile_cheat_detection_engine import MobileCheatDetectionEngine
        print("   ✅ Import successful")
        print(f"   Class: {MobileCheatDetectionEngine}")
    except ImportError as e:
        print(f"   ❌ Import failed: {e}")
        return False
    except Exception as e:
        print(f"   ❌ Unexpected error: {e}")
        traceback.print_exc()
        return False
    
    # Test 2: Import mobile_sports_assessment_engine  
    print("\n2. Testing mobile_sports_assessment_engine import...")
    try:
        from mobile_sports_assessment_engine import MobileSportsAssessmentEngine
        print("   ✅ Import successful")
        print(f"   Class: {MobileSportsAssessmentEngine}")
    except ImportError as e:
        print(f"   ❌ Import failed: {e}")
        return False
    except Exception as e:
        print(f"   ❌ Unexpected error: {e}")
        traceback.print_exc()
        return False
    
    # Test 3: Initialize MobileCheatDetectionEngine
    print("\n3. Testing MobileCheatDetectionEngine initialization...")
    try:
        cheat_detector = MobileCheatDetectionEngine(reference_images_folder=None)
        print("   ✅ Initialization successful")
        print(f"   Object: {cheat_detector}")
        print(f"   Has reference_images_folder attr: {hasattr(cheat_detector, 'reference_images_folder')}")
    except Exception as e:
        print(f"   ❌ Initialization failed: {e}")
        traceback.print_exc()
        return False
    
    # Test 4: Initialize MobileSportsAssessmentEngine
    print("\n4. Testing MobileSportsAssessmentEngine initialization...")
    try:
        sports_analyzer = MobileSportsAssessmentEngine()
        print("   ✅ Initialization successful")
        print(f"   Object: {sports_analyzer}")
    except Exception as e:
        print(f"   ❌ Initialization failed: {e}")
        traceback.print_exc()
        return False
    
    # Test 5: Test setting reference_images_folder attribute
    print("\n5. Testing reference_images_folder attribute setting...")
    try:
        cheat_detector.reference_images_folder = "test_folder"
        print("   ✅ Attribute setting successful")
        print(f"   Value: {cheat_detector.reference_images_folder}")
    except Exception as e:
        print(f"   ❌ Attribute setting failed: {e}")
        traceback.print_exc()
        return False
    
    print("\n=== ALL TESTS PASSED ===")
    return True

if __name__ == "__main__":
    success = test_imports()
    if success:
        print("\n🎉 Mobile engines are working correctly!")
        print("The problem is likely in Flask integration, not the engines themselves.")
    else:
        print("\n💥 Mobile engines have issues that need to be fixed first.")
    
    sys.exit(0 if success else 1)