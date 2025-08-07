import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime

# Load the data from the provided JSON
upload_data = [
    {"month": "Jan 2025", "videos_uploaded": 4, "avg_views_per_video": 32500, "subscriber_growth": 2500},
    {"month": "Dec 2024", "videos_uploaded": 6, "avg_views_per_video": 28000, "subscriber_growth": 3200},
    {"month": "Nov 2024", "videos_uploaded": 5, "avg_views_per_video": 35000, "subscriber_growth": 2800},
    {"month": "Oct 2024", "videos_uploaded": 7, "avg_views_per_video": 25000, "subscriber_growth": 4100},
    {"month": "Sep 2024", "videos_uploaded": 4, "avg_views_per_video": 30000, "subscriber_growth": 2200},
    {"month": "Aug 2024", "videos_uploaded": 5, "avg_views_per_video": 27000, "subscriber_growth": 2600}
]

df = pd.DataFrame(upload_data)

# Convert month to datetime for proper sorting
df['month_date'] = pd.to_datetime(df['month'], format='%b %Y')
df = df.sort_values('month_date').reset_index(drop=True)

# Create the dual-axis line chart
fig = go.Figure()

# Add videos uploaded line (left y-axis)
fig.add_trace(go.Scatter(
    x=df['month'],
    y=df['videos_uploaded'],
    mode='lines+markers',
    name='Videos Upload',
    line=dict(color='#1FB8CD', width=3),
    marker=dict(size=8, color='#1FB8CD'),
    cliponaxis=False,
    hovertemplate='<b>%{x}</b><br>' +
                  'Videos: %{y}<br>' +
                  '<extra></extra>',
    yaxis='y'
))

# Add subscriber growth line (right y-axis)
fig.add_trace(go.Scatter(
    x=df['month'],
    y=df['subscriber_growth'],
    mode='lines+markers',
    name='Sub Growth',
    line=dict(color='#DB4545', width=3),
    marker=dict(size=8, color='#DB4545'),
    cliponaxis=False,
    hovertemplate='<b>%{x}</b><br>' +
                  'Sub Growth: %{y:,}<br>' +
                  '<extra></extra>',
    yaxis='y2'
))

# Update layout with dual y-axes
fig.update_layout(
    title='Upload Frequency vs Subscriber Growth Analysis',
    xaxis_title='Month',
    yaxis=dict(
        title='Videos Upload',
        side='left'
    ),
    yaxis2=dict(
        title='Sub Growth',
        side='right',
        overlaying='y'
    ),
    showlegend=True,
    legend=dict(orientation='h', yanchor='bottom', y=1.05, xanchor='center', x=0.5)
)

# Format the right y-axis to show numbers with commas
fig.update_layout(
    yaxis2=dict(
        title='Sub Growth',
        side='right',
        overlaying='y',
        tickformat=','
    )
)

# Save the chart
fig.write_image("upload_subscriber_analysis.png")
fig.show()