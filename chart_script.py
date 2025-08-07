import plotly.graph_objects as go
import json
import pandas as pd

# Load the data from the provided JSON
data_json = {
    "channel_data": [
        {"metric": "Total Subscribers", "value": 60800, "benchmark": 50000, "performance": "Above Average"},
        {"metric": "Total Videos", "value": 75, "benchmark": 100, "performance": "Below Average"},
        {"metric": "Total Views", "value": 1938039, "benchmark": 2000000, "performance": "Slightly Below"},
        {"metric": "Channel Age (months)", "value": 17, "benchmark": 12, "performance": "Above Average"},
        {"metric": "Average Views per Video", "value": 25840, "benchmark": 20000, "performance": "Above Average"}
    ]
}

# Convert to DataFrame
df = pd.DataFrame(data_json['channel_data'])

# Create abbreviated metric names (15 char limit)
abbreviated_metrics = [
    "Subscribers",
    "Videos", 
    "Views",
    "Age (months)",
    "Avg Views/Video"
]

# Normalize values to percentage of benchmark for better visualization
actual_normalized = []
benchmark_normalized = []

for _, row in df.iterrows():
    # Calculate as percentage of benchmark, but cap at 150% for better visualization
    actual_pct = min((row['value'] / row['benchmark']) * 100, 150)
    benchmark_pct = 100  # Benchmark is always 100%
    
    actual_normalized.append(actual_pct)
    benchmark_normalized.append(benchmark_pct)

# Create the radar chart
fig = go.Figure()

# Add actual performance trace
fig.add_trace(go.Scatterpolar(
    r=actual_normalized,
    theta=abbreviated_metrics,
    fill='toself',
    name='Actual',
    line_color='#1FB8CD',
    fillcolor='rgba(31, 184, 205, 0.3)'
))

# Add benchmark trace
fig.add_trace(go.Scatterpolar(
    r=benchmark_normalized,
    theta=abbreviated_metrics,
    fill='toself',
    name='Benchmark',
    line_color='#DB4545',
    fillcolor='rgba(219, 69, 69, 0.1)'
))

# Update layout
fig.update_layout(
    polar=dict(
        radialaxis=dict(
            visible=True,
            range=[0, 150],
            ticksuffix='%'
        )
    ),
    title="Channel Performance vs Industry Benchmarks",
    legend=dict(
        orientation='h', 
        yanchor='bottom', 
        y=1.05, 
        xanchor='center', 
        x=0.5
    )
)

# Save the chart
fig.write_image("channel_performance_radar.png")