import pandas as pd
import plotly.graph_objects as go
import plotly.io as pio

# Data from the provided JSON
data = {
    "category": ["Paid Internships", "Company-specific Internships", "Government Internships", 
                "Scholarships", "Career Guidance", "Skills/Courses"],
    "video_count": [25, 20, 12, 8, 6, 4],
    "avg_views": [35000, 28000, 32000, 45000, 22000, 18000],
    "engagement_rate": [4.8, 4.2, 4.5, 5.2, 3.8, 3.5],
    "subscriber_conversion": [3.2, 2.8, 3.0, 3.8, 2.5, 2.1]
}

df = pd.DataFrame(data)

# Abbreviated category names (under 15 chars)
category_labels = ["Paid Intern", "Company Intern", "Gov Intern", 
                  "Scholarships", "Career Guide", "Skills/Course"]

# Brand colors in order
colors = ['#1FB8CD', '#DB4545', '#2E8B57', '#5D878F', '#D2BA4C', '#B4413C']

# Create bubble chart
fig = go.Figure()

for i, (idx, row) in enumerate(df.iterrows()):
    fig.add_trace(go.Scatter(
        x=[row['avg_views']],
        y=[row['engagement_rate']],
        mode='markers+text',
        marker=dict(
            size=row['video_count'] * 2,  # Scale bubble size
            color=colors[i],
            line=dict(width=1, color='white'),
            sizemode='diameter'
        ),
        text=[category_labels[i]],
        textposition='middle center',
        textfont=dict(size=10, color='white'),
        name=category_labels[i],
        cliponaxis=False,
        hovertemplate=(
            f'<b>{category_labels[i]}</b><br>' +
            'Avg Views: %{x:,.0f}<br>' +
            'Engagement: %{y:.1f}%<br>' +
            f'Videos: {row["video_count"]}<br>' +
            '<extra></extra>'
        )
    ))

# Update layout
fig.update_layout(
    title="Content Category Performance Analysis",
    xaxis_title="Avg Views",
    yaxis_title="Engagement %",
    showlegend=True,
    legend=dict(orientation='h', yanchor='bottom', y=1.05, xanchor='center', x=0.5)
)

# Format x-axis to show abbreviated numbers
fig.update_xaxes(tickformat='.0s')
fig.update_yaxes()

# Save the chart
fig.write_image("content_category_bubble_chart.png")