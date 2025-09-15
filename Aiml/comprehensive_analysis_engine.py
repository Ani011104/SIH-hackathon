# comprehensive_analysis_engine.py

import json
import os
import pandas as pd
import numpy as np
from datetime import datetime
from collections import defaultdict, Counter
import statistics
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class ComprehensiveAnalysisEngine:
    """
    Comprehensive analysis engine for mobile sports assessment results
    """
    
    def __init__(self):
        logger.info("Initializing Comprehensive Analysis Engine...")
        self.assessments = []
        self.analysis_data = {}
        
    def load_json_files(self, json_folder_or_files):
        """Load JSON files from folder or file list"""
        json_files = []
        
        if isinstance(json_folder_or_files, str):
            # It's a folder path
            if os.path.isdir(json_folder_or_files):
                json_files = [f for f in os.listdir(json_folder_or_files) if f.endswith('.json')]
                json_files = [os.path.join(json_folder_or_files, f) for f in json_files]
            else:
                # It's a single file
                json_files = [json_folder_or_files]
        else:
            # It's a list of files
            json_files = json_folder_or_files
        
        logger.info(f"Loading {len(json_files)} JSON files...")
        
        for json_file in json_files:
            try:
                with open(json_file, 'r') as f:
                    data = json.load(f)
                    data['source_file'] = os.path.basename(json_file)
                    self.assessments.append(data)
                    logger.info(f"✅ Loaded: {os.path.basename(json_file)}")
            except Exception as e:
                logger.error(f"❌ Failed to load {json_file}: {e}")
        
        logger.info(f"Successfully loaded {len(self.assessments)} assessments")
        return len(self.assessments)
    
    def analyze_comprehensive(self, save_results=True):
        """
        🔹 MAIN: Comprehensive analysis of all assessments
        """
        logger.info("🚀 Starting comprehensive analysis...")
        
        if not self.assessments:
            return {"error": "No assessments loaded"}
        
        # Run all analysis modules
        overall_summary = self._analyze_overall_summary()
        performance_insights = self._analyze_performance_patterns()
        security_analysis = self._analyze_security_patterns()
        user_insights = self._analyze_user_behavior()
        system_performance = self._analyze_system_performance()
        recommendations = self._generate_comprehensive_recommendations()
        
        # Compile comprehensive report
        comprehensive_report = {
            'analysis_metadata': {
                'total_assessments': len(self.assessments),
                'analysis_timestamp': datetime.now().isoformat(),
                'analysis_version': 'comprehensive_v1.0'
            },
            'overall_summary': overall_summary,
            'performance_insights': performance_insights,
            'security_analysis': security_analysis,
            'user_insights': user_insights,
            'system_performance': system_performance,
            'recommendations': recommendations,
            'detailed_assessment_breakdown': self._create_assessment_breakdown()
        }
        
        # Save results
        if save_results:
            output_file = f"comprehensive_analysis_{int(datetime.now().timestamp())}.json"
            with open(output_file, 'w') as f:
                json.dump(comprehensive_report, f, indent=2)
            comprehensive_report['saved_analysis'] = output_file
            logger.info(f"📄 Comprehensive analysis saved to: {output_file}")
        
        return comprehensive_report
    
    def _analyze_overall_summary(self):
        """Analyze overall patterns across all assessments"""
        
        validities = [a['mobile_summary']['final_validity'] for a in self.assessments]
        authenticity_scores = [a['mobile_summary']['authenticity_confidence'] for a in self.assessments]
        exercise_types = [a['performance_results']['exercise_type'] for a in self.assessments]
        
        validity_distribution = Counter(validities)
        
        return {
            'total_assessments': len(self.assessments),
            'validity_distribution': dict(validity_distribution),
            'validity_rates': {
                'valid_percentage': (validity_distribution.get('valid', 0) / len(self.assessments)) * 100,
                'invalid_percentage': (validity_distribution.get('invalid', 0) / len(self.assessments)) * 100,
                'questionable_percentage': (validity_distribution.get('questionable', 0) + validity_distribution.get('low_confidence', 0)) / len(self.assessments) * 100
            },
            'authenticity_stats': {
                'average_confidence': round(statistics.mean(authenticity_scores), 2),
                'min_confidence': round(min(authenticity_scores), 2),
                'max_confidence': round(max(authenticity_scores), 2),
                'median_confidence': round(statistics.median(authenticity_scores), 2)
            },
            'exercise_distribution': dict(Counter(exercise_types)),
            'overall_pass_rate': round((validity_distribution.get('valid', 0) / len(self.assessments)) * 100, 2)
        }
    
    def _analyze_performance_patterns(self):
        """Analyze exercise performance patterns"""
        
        exercise_performance = defaultdict(list)
        rep_counts = defaultdict(list)
        jump_metrics = defaultdict(list)
        form_scores = []
        
        for assessment in self.assessments:
            exercise_type = assessment['performance_results']['exercise_type']
            exercise_results = assessment['performance_results']['exercise_results']
            
            # Collect rep counts
            if 'rep_count' in exercise_results:
                rep_counts[exercise_type].append(exercise_results['rep_count'])
            
            # Collect jump metrics
            if exercise_type in ['vertical_jump', 'long_jump']:
                if 'individual_jumps' in exercise_results:
                    for jump in exercise_results['individual_jumps']:
                        if 'jump_height_cm' in jump:
                            jump_metrics[f"{exercise_type}_height"].append(jump['jump_height_cm'])
                        if 'horizontal_distance_cm' in jump:
                            jump_metrics[f"{exercise_type}_distance"].append(jump['horizontal_distance_cm'])
                
                if 'distance_cm' in exercise_results:
                    jump_metrics[f"{exercise_type}_distance"].append(exercise_results['distance_cm'])
            
            # Collect form scores
            if 'form_analysis' in exercise_results and 'form_score' in exercise_results['form_analysis']:
                form_scores.append(exercise_results['form_analysis']['form_score'])
        
        # Calculate performance statistics
        performance_stats = {}
        
        for exercise, reps in rep_counts.items():
            if reps:
                performance_stats[exercise] = {
                    'rep_statistics': {
                        'average_reps': round(statistics.mean(reps), 1),
                        'max_reps': max(reps),
                        'min_reps': min(reps),
                        'total_reps': sum(reps),
                        'sessions': len(reps)
                    }
                }
        
        for metric, values in jump_metrics.items():
            if values:
                performance_stats[metric] = {
                    'average': round(statistics.mean(values), 1),
                    'max': round(max(values), 1),
                    'min': round(min(values), 1),
                    'total_attempts': len(values)
                }
        
        return {
            'performance_statistics': performance_stats,
            'form_analysis': {
                'average_form_score': round(statistics.mean(form_scores), 1) if form_scores else 0,
                'form_score_range': [min(form_scores), max(form_scores)] if form_scores else [0, 0],
                'sessions_with_form_data': len(form_scores)
            },
            'exercise_completion_rates': self._calculate_completion_rates(),
            'performance_trends': self._identify_performance_trends()
        }
    
    def _analyze_security_patterns(self):
        """Analyze security and cheat detection patterns"""
        
        risk_scores = []
        face_verification_stats = []
        flag_analysis = defaultdict(int)
        authenticity_statuses = []
        
        for assessment in self.assessments:
            security_results = assessment['security_results']
            
            # Collect risk scores
            risk_scores.append(security_results['risk_score'])
            authenticity_statuses.append(security_results['authenticity_status'])
            
            # Face verification stats
            face_verification = security_results['face_verification']
            face_verification_stats.append({
                'verified': face_verification['verified'],
                'confidence': face_verification['confidence'],
                'verification_rate': face_verification.get('verification_rate', 0),
                'successful_verifications': face_verification.get('successful_verifications', 0),
                'total_verifications': face_verification.get('total_verifications', 0)
            })
            
            # Flag analysis
            for flag_type, count in security_results['flag_analysis']['flag_categories'].items():
                flag_analysis[flag_type] += count
        
        # Calculate security statistics
        verified_count = sum(1 for fv in face_verification_stats if fv['verified'])
        face_confidences = [fv['confidence'] for fv in face_verification_stats]
        
        return {
            'risk_assessment': {
                'average_risk_score': round(statistics.mean(risk_scores), 2),
                'high_risk_sessions': len([r for r in risk_scores if r >= 70]),
                'low_risk_sessions': len([r for r in risk_scores if r < 30]),
                'risk_score_distribution': {
                    'critical': len([r for r in risk_scores if r >= 80]),
                    'high': len([r for r in risk_scores if 60 <= r < 80]),
                    'medium': len([r for r in risk_scores if 40 <= r < 60]),
                    'low': len([r for r in risk_scores if r < 40])
                }
            },
            'face_verification_analysis': {
                'overall_verification_rate': round((verified_count / len(face_verification_stats)) * 100, 2),
                'average_face_confidence': round(statistics.mean(face_confidences), 2),
                'verification_reliability': self._assess_verification_reliability(face_verification_stats),
                'failed_verifications': len(face_verification_stats) - verified_count
            },
            'threat_analysis': {
                'authenticity_status_distribution': dict(Counter(authenticity_statuses)),
                'common_flags': dict(sorted(flag_analysis.items(), key=lambda x: x[1], reverse=True)),
                'security_incidents': len([a for a in authenticity_statuses if a in ['highly_suspicious', 'suspicious']])
            },
            'security_recommendations': self._generate_security_recommendations(risk_scores, face_verification_stats)
        }
    
    def _analyze_user_behavior(self):
        """Analyze user behavior patterns"""
        
        processing_times = []
        exercise_preferences = Counter()
        session_durations = []
        mobile_performance = []
        
        for assessment in self.assessments:
            # Processing times
            processing_times.append(assessment['total_processing_time'])
            
            # Exercise preferences
            exercise_preferences[assessment['performance_results']['exercise_type']] += 1
            
            # Session durations
            video_props = assessment['performance_results']['video_properties']
            session_durations.append(video_props['duration'])
            
            # Mobile performance
            mobile_perf = assessment['performance_results'].get('mobile_performance', {})
            mobile_performance.append(mobile_perf)
        
        return {
            'usage_patterns': {
                'favorite_exercises': dict(exercise_preferences.most_common()),
                'average_session_duration': round(statistics.mean(session_durations), 2),
                'session_duration_range': [min(session_durations), max(session_durations)],
                'total_exercise_time': round(sum(session_durations), 2)
            },
            'engagement_metrics': {
                'total_sessions': len(self.assessments),
                'average_processing_time': round(statistics.mean(processing_times), 2),
                'system_efficiency': self._calculate_system_efficiency(),
                'user_consistency': self._assess_user_consistency()
            },
            'behavioral_insights': self._generate_behavioral_insights()
        }
    
    def _analyze_system_performance(self):
        """Analyze system performance across all assessments"""
        
        processing_times = []
        cheat_detection_times = []
        sports_analysis_times = []
        frame_processing_ratios = []
        
        for assessment in self.assessments:
            mobile_tech = assessment['mobile_technical']
            
            processing_times.append(assessment['total_processing_time'])
            cheat_detection_times.append(mobile_tech['cheat_detection_time'])
            sports_analysis_times.append(mobile_tech['sports_analysis_time'])
            
            mobile_perf = assessment['performance_results'].get('mobile_performance', {})
            if 'frame_processing_ratio' in mobile_perf:
                frame_processing_ratios.append(mobile_perf['frame_processing_ratio'])
        
        return {
            'performance_metrics': {
                'average_total_processing_time': round(statistics.mean(processing_times), 2),
                'average_cheat_detection_time': round(statistics.mean(cheat_detection_times), 2),
                'average_sports_analysis_time': round(statistics.mean(sports_analysis_times), 2),
                'processing_time_consistency': round(statistics.stdev(processing_times), 2),
                'fastest_analysis': round(min(processing_times), 2),
                'slowest_analysis': round(max(processing_times), 2)
            },
            'efficiency_analysis': {
                'average_frame_processing_ratio': round(statistics.mean(frame_processing_ratios), 3) if frame_processing_ratios else 0,
                'system_optimization_level': 'mobile_optimized',
                'models_performance': self._analyze_model_performance(),
                'bottleneck_analysis': self._identify_performance_bottlenecks(cheat_detection_times, sports_analysis_times)
            },
            'reliability_metrics': self._calculate_system_reliability()
        }
    
    def _generate_comprehensive_recommendations(self):
        """Generate comprehensive recommendations based on all analysis"""
        
        recommendations = {
            'security_recommendations': [],
            'performance_recommendations': [],
            'system_recommendations': [],
            'user_recommendations': []
        }
        
        # Analyze patterns for recommendations
        invalid_count = len([a for a in self.assessments if a['mobile_summary']['final_validity'] == 'invalid'])
        valid_count = len([a for a in self.assessments if a['mobile_summary']['final_validity'] == 'valid'])
        
        # Security recommendations
        if invalid_count > len(self.assessments) * 0.5:
            recommendations['security_recommendations'].append("🚨 HIGH ALERT: Over 50% of assessments flagged as invalid - Review reference images and verification thresholds")
        elif invalid_count > len(self.assessments) * 0.3:
            recommendations['security_recommendations'].append("⚠️ MODERATE CONCERN: 30%+ assessments flagged - Consider adjusting face verification sensitivity")
        else:
            recommendations['security_recommendations'].append("✅ SECURITY STATUS: Good security detection rate")
        
        # Performance recommendations
        rep_counts = []
        for assessment in self.assessments:
            if 'rep_count' in assessment['performance_results']['exercise_results']:
                rep_counts.append(assessment['performance_results']['exercise_results']['rep_count'])
        
        if rep_counts:
            avg_reps = statistics.mean(rep_counts)
            if avg_reps < 5:
                recommendations['performance_recommendations'].append("📈 IMPROVEMENT: Average rep count is low - Consider longer workout sessions")
            elif avg_reps > 20:
                recommendations['performance_recommendations'].append("💪 EXCELLENT: High performance detected - Keep up the great work!")
            else:
                recommendations['performance_recommendations'].append("✅ GOOD: Consistent exercise performance")
        
        # System recommendations
        processing_times = [a['total_processing_time'] for a in self.assessments]
        avg_processing = statistics.mean(processing_times)
        
        if avg_processing > 120:
            recommendations['system_recommendations'].append("⚡ OPTIMIZATION: Consider reducing video resolution or frame rate for faster processing")
        elif avg_processing < 30:
            recommendations['system_recommendations'].append("🚀 PERFORMANCE: System running efficiently")
        
        # User recommendations
        exercise_types = [a['performance_results']['exercise_type'] for a in self.assessments]
        exercise_variety = len(set(exercise_types))
        
        if exercise_variety == 1:
            recommendations['user_recommendations'].append("🎯 VARIETY: Try different exercise types for well-rounded fitness")
        elif exercise_variety >= 3:
            recommendations['user_recommendations'].append("🌟 EXCELLENT: Great exercise variety!")
        
        return recommendations
    
    def _calculate_completion_rates(self):
        """Calculate exercise completion rates"""
        completion_rates = {}
        
        for assessment in self.assessments:
            exercise_type = assessment['performance_results']['exercise_type']
            exercise_results = assessment['performance_results']['exercise_results']
            
            completed = exercise_results.get('exercise_completed', False)
            if exercise_type not in completion_rates:
                completion_rates[exercise_type] = {'completed': 0, 'total': 0}
            
            completion_rates[exercise_type]['total'] += 1
            if completed:
                completion_rates[exercise_type]['completed'] += 1
        
        # Calculate percentages
        for ex_type in completion_rates:
            total = completion_rates[ex_type]['total']
            completed = completion_rates[ex_type]['completed']
            completion_rates[ex_type]['completion_percentage'] = round((completed / total) * 100, 1)
        
        return completion_rates
    
    def _identify_performance_trends(self):
        """Identify performance trends over time"""
        # Sort assessments by timestamp
        sorted_assessments = sorted(self.assessments, 
                                   key=lambda x: x['mobile_technical']['analysis_timestamp'])
        
        trends = {}
        
        # Track rep count trends
        rep_trends = defaultdict(list)
        for assessment in sorted_assessments:
            exercise_type = assessment['performance_results']['exercise_type']
            exercise_results = assessment['performance_results']['exercise_results']
            
            if 'rep_count' in exercise_results:
                rep_trends[exercise_type].append(exercise_results['rep_count'])
        
        for exercise, reps in rep_trends.items():
            if len(reps) >= 2:
                if reps[-1] > reps[0]:
                    trends[exercise] = 'improving'
                elif reps[-1] < reps[0]:
                    trends[exercise] = 'declining'
                else:
                    trends[exercise] = 'stable'
        
        return trends
    
    def _assess_verification_reliability(self, face_verification_stats):
        """Assess face verification reliability"""
        if not face_verification_stats:
            return 'no_data'
        
        # Calculate consistency in verification decisions
        confidence_scores = [fv['confidence'] for fv in face_verification_stats]
        confidence_std = statistics.stdev(confidence_scores) if len(confidence_scores) > 1 else 0
        
        if confidence_std < 10:
            return 'highly_consistent'
        elif confidence_std < 20:
            return 'moderately_consistent'
        else:
            return 'inconsistent'
    
    def _generate_security_recommendations(self, risk_scores, face_verification_stats):
        """Generate specific security recommendations"""
        recommendations = []
        
        high_risk_count = len([r for r in risk_scores if r >= 70])
        total_assessments = len(risk_scores)
        
        if high_risk_count > total_assessments * 0.5:
            recommendations.append("CRITICAL: Majority of sessions flagged as high risk - Review system settings")
        
        failed_verifications = len([fv for fv in face_verification_stats if not fv['verified']])
        if failed_verifications > total_assessments * 0.3:
            recommendations.append("WARNING: High face verification failure rate - Check reference image quality")
        
        return recommendations
    
    def _calculate_system_efficiency(self):
        """Calculate overall system efficiency"""
        total_assessments = len(self.assessments)
        successful_assessments = len([a for a in self.assessments 
                                    if a['mobile_summary']['final_validity'] in ['valid', 'likely_authentic']])
        
        return round((successful_assessments / total_assessments) * 100, 2)
    
    def _assess_user_consistency(self):
        """Assess user consistency across sessions"""
        authenticity_scores = [a['mobile_summary']['authenticity_confidence'] for a in self.assessments]
        
        if len(authenticity_scores) < 2:
            return 'insufficient_data'
        
        consistency_score = 100 - statistics.stdev(authenticity_scores)
        
        if consistency_score >= 85:
            return 'highly_consistent'
        elif consistency_score >= 70:
            return 'moderately_consistent'
        else:
            return 'inconsistent'
    
    def _generate_behavioral_insights(self):
        """Generate behavioral insights"""
        insights = []
        
        # Exercise preferences
        exercise_counts = Counter([a['performance_results']['exercise_type'] for a in self.assessments])
        most_common = exercise_counts.most_common(1)[0]
        insights.append(f"Most performed exercise: {most_common[0]} ({most_common[1]} sessions)")
        
        # Session timing patterns
        session_durations = [a['performance_results']['video_properties']['duration'] for a in self.assessments]
        avg_duration = statistics.mean(session_durations)
        
        if avg_duration < 10:
            insights.append("Prefers short, quick workout sessions")
        elif avg_duration > 30:
            insights.append("Engages in longer, comprehensive workout sessions")
        else:
            insights.append("Maintains moderate workout session lengths")
        
        return insights
    
    def _analyze_model_performance(self):
        """Analyze AI model performance"""
        face_verification_failures = 0
        pose_detection_issues = 0
        
        for assessment in self.assessments:
            if not assessment['security_results']['face_verification']['verified']:
                face_verification_failures += 1
            
            # Check for pose detection issues
            flags = assessment['security_results']['flag_analysis']['flag_categories']
            if 'low_confidence' in flags:
                pose_detection_issues += flags['low_confidence']
        
        return {
            'face_verification_accuracy': round((1 - face_verification_failures / len(self.assessments)) * 100, 2),
            'pose_detection_reliability': 'high' if pose_detection_issues < 10 else 'needs_improvement',
            'overall_model_performance': 'satisfactory'
        }
    
    def _identify_performance_bottlenecks(self, cheat_detection_times, sports_analysis_times):
        """Identify system performance bottlenecks"""
        avg_cheat_time = statistics.mean(cheat_detection_times)
        avg_sports_time = statistics.mean(sports_analysis_times)
        
        bottlenecks = []
        
        if avg_cheat_time > avg_sports_time * 1.5:
            bottlenecks.append("cheat_detection")
        elif avg_sports_time > avg_cheat_time * 1.5:
            bottlenecks.append("sports_analysis")
        
        return bottlenecks if bottlenecks else ["none_detected"]
    
    def _calculate_system_reliability(self):
        """Calculate system reliability metrics"""
        successful_analyses = len([a for a in self.assessments if 'error' not in a])
        
        return {
            'success_rate': round((successful_analyses / len(self.assessments)) * 100, 2),
            'error_rate': round(((len(self.assessments) - successful_analyses) / len(self.assessments)) * 100, 2),
            'reliability_status': 'high' if successful_analyses == len(self.assessments) else 'moderate'
        }
    
    def _create_assessment_breakdown(self):
        """Create detailed breakdown of each assessment"""
        breakdown = []
        
        for i, assessment in enumerate(self.assessments, 1):
            breakdown.append({
                'assessment_number': i,
                'source_file': assessment.get('source_file', f'assessment_{i}'),
                'exercise_type': assessment['performance_results']['exercise_type'],
                'final_validity': assessment['mobile_summary']['final_validity'],
                'authenticity_confidence': assessment['mobile_summary']['authenticity_confidence'],
                'performance_detected': assessment['mobile_summary']['performance_detected'],
                'risk_score': assessment['security_results']['risk_score'],
                'face_verified': assessment['security_results']['face_verification']['verified'],
                'processing_time': assessment['total_processing_time'],
                'key_recommendations': assessment['security_results']['recommendations'][:2]  # Top 2
            })
        
        return breakdown

# Usage functions
def analyze_json_files(json_files_or_folder, save_results=True):
    """
    🔹 MAIN FUNCTION: Analyze JSON assessment files
    """
    engine = ComprehensiveAnalysisEngine()
    
    # Load JSON files
    loaded_count = engine.load_json_files(json_files_or_folder)
    
    if loaded_count == 0:
        return {"error": "No JSON files could be loaded"}
    
    # Run comprehensive analysis
    results = engine.analyze_comprehensive(save_results)
    
    return results

def print_analysis_summary(results):
    """Print a formatted summary of the analysis"""
    if 'error' in results:
        print(f"❌ Error: {results['error']}")
        return
    
    print("🔍 COMPREHENSIVE ANALYSIS SUMMARY")
    print("=" * 50)
    
    # Overall summary
    overall = results['overall_summary']
    print(f"📊 Total Assessments: {overall['total_assessments']}")
    print(f"✅ Valid Rate: {overall['validity_rates']['valid_percentage']:.1f}%")
    print(f"❌ Invalid Rate: {overall['validity_rates']['invalid_percentage']:.1f}%")
    print(f"🎯 Average Confidence: {overall['authenticity_stats']['average_confidence']}%")
    
    # Performance insights
    performance = results['performance_insights']
    print(f"\n🏃 PERFORMANCE INSIGHTS:")
    for exercise, stats in performance['performance_statistics'].items():
        if 'rep_statistics' in stats:
            print(f"  {exercise}: Avg {stats['rep_statistics']['average_reps']} reps, Max {stats['rep_statistics']['max_reps']}")
    
    # Security analysis
    security = results['security_analysis']
    print(f"\n🔒 SECURITY ANALYSIS:")
    print(f"  Average Risk Score: {security['risk_assessment']['average_risk_score']}")
    print(f"  Face Verification Rate: {security['face_verification_analysis']['overall_verification_rate']}%")
    print(f"  Security Incidents: {security['threat_analysis']['security_incidents']}")
    
    # Top recommendations
    print(f"\n💡 TOP RECOMMENDATIONS:")
    for category, recs in results['recommendations'].items():
        for rec in recs[:1]:  # Show top recommendation per category
            print(f"  {rec}")

# Test script
if __name__ == "__main__":
    # Example usage
    json_files = [
        "mobile_complete_long_jump_1757872408.json",
        "mobile_complete_pushups_1757869729.json", 
        "mobile_complete_situps_1757869249.json",
        "mobile_complete_squats_1757872267.json",
        "mobile_complete_vertical_jump_1757869853.json"
    ]
    
    # Run analysis
    results = analyze_json_files(json_files)
    
    # Print summary
    print_analysis_summary(results)
    
    # Full results are saved to JSON file
    if 'saved_analysis' in results:
        print(f"\n📄 Full analysis saved to: {results['saved_analysis']}")
