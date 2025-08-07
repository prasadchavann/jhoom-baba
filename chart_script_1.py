import pandas as pd
import plotly.express as px
import plotly.graph_objects as go

# Create DataFrame from the provided data
video_data = [
    {"title": "HDFC Bank Scholarship", "views": 52000, "upload_days_ago": 12, "video_length_minutes": 8, "engagement_rate": 4.2},
    {"title": "Google Summer Internship", "views": 10000, "upload_days_ago": 21, "video_length_minutes": 6, "engagement_rate": 3.8},
    {"title": "Microsoft Paid Internship", "views": 7000, "upload_days_ago": 28, "video_length_minutes": 5, "engagement_rate": 3.5},
    {"title": "McKinsey Internship", "views": 8700, "upload_days_ago": 30, "video_length_minutes": 7, "engagement_rate": 4.1},
    {"title": "Flipkart Internship", "views": 15000, "upload_days_ago": 30, "video_length_minutes": 9, "engagement_rate": 3.9},
    {"title": "TATA Online Internships", "views": 47000, "upload_days_ago": 30, "video_length_minutes": 10, "engagement_rate": 4.5},
    {"title": "Deloitte Internship", "views": 60000, "upload_days_ago": 60, "video_length_minutes": 12, "engagement_rate": 5.2},
    {"title": "Infosys Online Internship", "views": 20000, "upload_days_ago": 60, "video_length_minutes": 8, "engagement_rate": 4.0},
    {"title": "EY Summer Internship", "views": 72000, "upload_days_ago": 90, "video_length_minutes": 11, "engagement_rate": 5.8},
    {"title": "Commerce Career Options", "views": 68000, "upload_days_ago": 60, "video_length_minutes": 15, "engagement_rate": 6.1}
]

df = pd.DataFrame(video_data)

# Sort by views in descending order and get top 10
df_sorted = df.sort_values('views', ascending=False).head(10)

# Create better abbreviated titles under 15 characters
title_mapping = {
    "EY Summer Internship": "EY Summer",
    "Commerce Career Options": "Commerce Career",
    "Deloitte Internship": "Deloitte",
    "HDFC Bank Scholarship": "HDFC Scholar",
    "TATA Online Internships": "TATA Online",
    "Infosys Online Internship": "Infosys Online",
    "Flipkart Internship": "Flipkart",
    "Google Summer Internship": "Google Summer",
    "McKinsey Internship": "McKinsey",
    "Microsoft Paid Internship": "Microsoft"
}

df_sorted['short_title'] = df_sorted['title'].map(title_mapping)

# Define more distinct colors from the brand palette
colors = ['#1FB8CD', '#DB4545', '#2E8B57', '#5D878F', '#D2BA4C', '#B4413C', '#964325', '#944454', '#13343B', '#1FB8CD']

# Create horizontal bar chart
fig = go.Figure()

# Add horizontal bars with hover data including engagement rate
fig.add_trace(go.Bar(
    y=df_sorted['short_title'],
    x=df_sorted['views'],
    orientation='h',
    marker=dict(color=colors[:len(df_sorted)]),
    text=[f"{views/1000:.0f}k" for views in df_sorted['views']],
    textposition='outside',
    cliponaxis=False,
    hovertemplate='<b>%{y}</b><br>Views: %{x:,.0f}<br>Engagement: %{customdata}%<extra></extra>',
    customdata=df_sorted['engagement_rate']
))

# Update layout with abbreviated title under 40 characters
fig.update_layout(
    title="Top 10 Video Perf: Views vs Engage",
    xaxis_title="Views",
    yaxis_title="Video Title",
    showlegend=False
)

# Save the chart
fig.write_image("video_performance_chart.png")