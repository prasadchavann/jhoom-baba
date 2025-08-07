import pandas as pd
import numpy as np
from datetime import datetime, timedelta

# Create synthetic data based on channel analysis for visualizations
# Data for "Jhoom Baba Gyaan" channel analysis

# Channel overview data
channel_data = {
    'metric': ['Total Subscribers', 'Total Videos', 'Total Views', 'Channel Age (months)', 'Average Views per Video'],
    'value': [60800, 75, 1938039, 17, 25840],  # Based on channel data: 60.8K subs, 75 videos, ~1.9M total views
    'benchmark': [50000, 100, 2000000, 12, 20000],  # Industry benchmarks for career guidance channels
    'performance': ['Above Average', 'Below Average', 'Slightly Below', 'Above Average', 'Above Average']
}

channel_df = pd.DataFrame(channel_data)

# Video performance data based on recent uploads
video_data = {
    'title': [
        'HDFC Bank Scholarship',
        'Google Summer Internship', 
        'Microsoft Paid Internship',
        'McKinsey Internship',
        'Flipkart Internship',
        'TATA Online Internships',
        'Deloitte Internship',
        'Infosys Online Internship',
        'EY Summer Internship',
        'Commerce Career Options'
    ],
    'views': [52000, 10000, 7000, 8700, 15000, 47000, 60000, 20000, 72000, 68000],
    'upload_days_ago': [12, 21, 28, 30, 30, 30, 60, 60, 90, 60],
    'video_length_minutes': [8, 6, 5, 7, 9, 10, 12, 8, 11, 15],
    'engagement_rate': [4.2, 3.8, 3.5, 4.1, 3.9, 4.5, 5.2, 4.0, 5.8, 6.1]  # Estimated based on typical performance
}

video_df = pd.DataFrame(video_data)

# Upload frequency analysis
upload_frequency = {
    'month': ['Jan 2025', 'Dec 2024', 'Nov 2024', 'Oct 2024', 'Sep 2024', 'Aug 2024'],
    'videos_uploaded': [4, 6, 5, 7, 4, 5],
    'avg_views_per_video': [32500, 28000, 35000, 25000, 30000, 27000],
    'subscriber_growth': [2500, 3200, 2800, 4100, 2200, 2600]
}

frequency_df = pd.DataFrame(upload_frequency)

# Content category performance
content_categories = {
    'category': ['Paid Internships', 'Company-specific Internships', 'Government Internships', 'Scholarships', 'Career Guidance', 'Skills/Courses'],
    'video_count': [25, 20, 12, 8, 6, 4],
    'avg_views': [35000, 28000, 32000, 45000, 22000, 18000],
    'engagement_rate': [4.8, 4.2, 4.5, 5.2, 3.8, 3.5],
    'subscriber_conversion': [3.2, 2.8, 3.0, 3.8, 2.5, 2.1]
}

category_df = pd.DataFrame(content_categories)

# Save data for chart creation
channel_df.to_csv('channel_performance.csv', index=False)
video_df.to_csv('video_performance.csv', index=False)
frequency_df.to_csv('upload_frequency.csv', index=False)
category_df.to_csv('content_categories.csv', index=False)

print("Channel Performance Analysis:")
print(channel_df)
print("\nTop Video Performance:")
print(video_df.sort_values('views', ascending=False).head())
print("\nContent Category Performance:")
print(category_df.sort_values('avg_views', ascending=False))