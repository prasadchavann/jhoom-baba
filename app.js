// YouTube Analytics Dashboard - JavaScript

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    showLoading(document.body);
    fetch('channel_analysis_data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Initialize all components
            setupThemeToggle();
            setupNavigation();
            populateAllData(data); // Master function for populating content
            setupSmoothScrolling();
            setupLazyLoading();

            // Set initial theme
            const savedTheme = localStorage.getItem('theme') || 'light';
            setTheme(savedTheme);
        })
        .catch(error => {
            console.error('Error loading dashboard data:', error);
            const mainContent = document.querySelector('.main .container');
            if (mainContent) {
                mainContent.innerHTML = `
                    <div style="text-align: center; padding: 40px; color: var(--color-error);">
                        <h2>Failed to Load Dashboard Data</h2>
                        <p>There was an error fetching the required data. Please try refreshing the page.</p>
                        <p><em>${error.message}</em></p>
                    </div>
                `;
            }
        })
        .finally(() => {
            hideLoading(document.body);
        });
}

// Theme Toggle Functionality
function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-color-scheme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            setTheme(newTheme);
        });
    }
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-color-scheme', theme);
    localStorage.setItem('theme', theme);
    
    const themeIcon = document.getElementById('themeIcon');
    if (themeIcon) {
        themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
    }
}

function populateAllData(data) {
    // Destructure data for easier access
    const { channel_overview, performance_metrics, content_analysis, competitor_benchmark } = data;

    // Populate Overview and Performance
    populateOverview(channel_overview, performance_metrics, competitor_benchmark);
    populatePerformanceBreakdown(performance_metrics.engagement_breakdown);

    // Populate Content Categories
    populateContentCategories(content_analysis.top_categories);

    // Populate Competitor Benchmarking
    populateCompetitorTable(competitor_benchmark.channels, channel_overview.name);
    setupMarketPositionChart(competitor_benchmark, channel_overview.name);

    // Populate SEO Insights
    populateSeoInsights(data.seo_analysis);

    // Populate Growth and Engagement
    populateGrowthRecommendations(data.growth_recommendations);
    populateEngagementInsights(data.engagement_insights);

    // Call animation setups that depend on dynamic content
    setupCircularProgress(channel_overview.health_score);
    setupProgressBars();
}

function populateGrowthRecommendations(recoData) {
    const container = document.getElementById('growth-recommendations-container');
    container.innerHTML = '';

    const recoOrder = ['immediate_actions', 'short_term_strategies', 'long_term_goals'];
    const titles = {
        immediate_actions: '🚨 Immediate Actions',
        short_term_strategies: '📈 Short-term Strategies (1-3 months)',
        long_term_goals: '🎯 Long-term Goals (6+ months)'
    };

    for (const key of recoOrder) {
        const recommendations = recoData[key];
        const category = document.createElement('div');
        category.className = 'recommendation-category';

        let itemsHtml = '';
        recommendations.forEach(recText => {
            // Data does not contain priority, so we create a simplified item
            const [title, desc] = recText.split('(');
            itemsHtml += `
                <div class="recommendation-item">
                    <div class="recommendation-content">
                        <h4>${title.trim()}</h4>
                        ${desc ? `<p>(${desc}</p>` : ''}
                    </div>
                </div>`;
        });

        category.innerHTML = `
            <h3>${titles[key]}</h3>
            <div class="recommendation-list">
                ${itemsHtml}
            </div>`;
        container.appendChild(category);
    }
}

function populateEngagementInsights(engagementData) {
    // Peak Engagement Times
    document.getElementById('peak-times-badge').textContent = engagementData.peak_engagement_times.match(/\(.*?\)|\S+/g)[0];
    document.getElementById('peak-times-desc').textContent = 'Best time to post for maximum engagement';

    // Top Engaging Content
    document.getElementById('top-content-badge').textContent = engagementData.top_engaging_content;
    document.getElementById('top-content-desc').textContent = 'Generate highest audience interaction';

    // Audience Retention
    const retentionText = engagementData.audience_retention_patterns;
    const retentionMatch = retentionText.match(/\((.*?)\)/);
    document.getElementById('retention-badge').textContent = retentionMatch ? retentionMatch[1] : 'N/A';
    document.getElementById('retention-desc').textContent = retentionText.replace(retentionMatch ? retentionMatch[0] : '', '').trim();

    // Comment Sentiment
    const sentimentText = engagementData.comment_sentiment;
    const sentimentMatch = sentimentText.match(/\((.*?)\)/);
    document.getElementById('sentiment-badge').textContent = sentimentMatch ? sentimentMatch[1] : 'N/A';
    document.getElementById('sentiment-desc').textContent = sentimentText.replace(sentimentMatch ? sentimentMatch[0] : '', '').trim();
}

function populateSeoInsights(seoData) {
    const container = document.getElementById('seo-grid-container');
    container.innerHTML = '';

    const seoOrder = ['title_optimization', 'thumbnail_analysis', 'description_optimization'];
    const titles = {
        title_optimization: 'Title Optimization',
        thumbnail_analysis: 'Thumbnail Analysis',
        description_optimization: 'Description Optimization'
    };

    for (const key of seoOrder) {
        const item = seoData[key];
        const title = titles[key];
        let scoreClass = 'average';
        if (item.score >= 75) scoreClass = 'good';
        if (item.score < 50) scoreClass = 'warning';

        const card = document.createElement('div');
        card.className = 'seo-card';
        card.innerHTML = `
            <h3>${title}</h3>
            <div class="seo-score">
                <div class="score-circle ${scoreClass}">${item.score}</div>
                <div class="score-details">
                    <h4>Strengths:</h4>
                    <ul>
                        ${item.strengths.map(s => `<li>${s}</li>`).join('')}
                    </ul>
                    <h4>Improvements:</h4>
                    <ul>
                        ${item.improvements.map(i => `<li>${i}</li>`).join('')}
                    </ul>
                </div>
            </div>`;
        container.appendChild(card);
    }
}

function populateOverview(overview, performance, competitor) {
    const mainChannelData = competitor.channels.find(c => c.name === overview.name);

    // Health Score
    document.getElementById('health-score-value').textContent = overview.health_score.toFixed(1);
    const healthScoreLabel = document.getElementById('health-score-label');
    if (overview.health_score >= 75) healthScoreLabel.textContent = 'Excellent';
    else if (overview.health_score >= 60) healthScoreLabel.textContent = 'Good';
    else healthScoreLabel.textContent = 'Average';
    document.getElementById('health-score-description').textContent = `Performance in the ${overview.niche} niche`;

    // Key Metrics
    document.getElementById('subscribers-value').textContent = formatNumber(overview.subscribers);
    document.getElementById('subscribers-change').textContent = `+${performance.monthly_growth_rate}% monthly`;
    document.getElementById('subscribers-change').classList.toggle('positive', performance.monthly_growth_rate > 0);

    document.getElementById('views-value').textContent = formatNumber(overview.total_views);
    if(mainChannelData) document.getElementById('views-change').textContent = `${formatNumber(mainChannelData.avg_views)} avg/video`;

    document.getElementById('videos-value').textContent = overview.total_videos;
    if(mainChannelData) document.getElementById('videos-change').textContent = `${mainChannelData.upload_frequency} uploads/month`;

    if(mainChannelData) {
        document.getElementById('engagement-rate-value').textContent = `${mainChannelData.engagement_rate}%`;
        document.getElementById('engagement-rate-change').textContent = 'Above industry avg';
        document.getElementById('engagement-rate-change').classList.add('positive');
    }
}

function populatePerformanceBreakdown(breakdownData) {
    const container = document.getElementById('performance-breakdown-container');
    container.innerHTML = '';
    const breakdownOrder = ['subscriber_growth', 'engagement_rate', 'view_consistency', 'upload_consistency', 'content_quality'];
    const titles = {
        subscriber_growth: 'Subscriber Growth',
        engagement_rate: 'Engagement Rate',
        view_consistency: 'View Consistency',
        upload_consistency: 'Upload Consistency',
        content_quality: 'Content Quality'
    };

    for (const key of breakdownOrder) {
        const value = breakdownData[key];
        let scoreClass = 'average';
        if (value >= 85) scoreClass = 'excellent';
        else if (value >= 60) scoreClass = 'good';

        const item = document.createElement('div');
        item.className = 'breakdown-item';
        item.innerHTML = `
            <div class="breakdown-item__header">
                <h4>${titles[key]}</h4>
                <span class="breakdown-item__score ${scoreClass}">${Math.round(value)}%</span>
            </div>
            <div class="progress-bar">
                <div class="progress-bar__fill" data-width="${value}"></div>
            </div>`;
        container.appendChild(item);
    }
}

function populateContentCategories(categories) {
    const container = document.getElementById('content-categories-grid');
    container.innerHTML = '';
    categories.forEach(category => {
        const card = document.createElement('div');
        const performanceClass = category.performance.toLowerCase();
        card.className = `category-card ${performanceClass}`;
        card.innerHTML = `
            <h4>${category.name}</h4>
            <div class="category-stats">
                <span class="stat">${formatNumber(category.avg_views)} avg views</span>
                <span class="performance-badge ${performanceClass}">${category.performance}</span>
            </div>`;
        container.appendChild(card);
    });
}

function populateCompetitorTable(channels, mainChannelName) {
    const container = document.getElementById('competitor-table-body');
    container.innerHTML = '';
    channels.forEach(channel => {
        const row = document.createElement('tr');
        const isMain = channel.name === mainChannelName;
        if (isMain) row.className = 'current-channel';

        let scoreClass = 'average';
        if (channel.health_score >= 75) scoreClass = 'excellent';
        else if (channel.health_score >= 65) scoreClass = 'good';

        row.innerHTML = `
            <td><strong>${channel.name}</strong></td>
            <td>${formatNumber(channel.subscribers)}</td>
            <td>${formatNumber(channel.avg_views)}</td>
            <td>${channel.engagement_rate}%</td>
            <td>${channel.upload_frequency}/month</td>
            <td><span class="health-score ${scoreClass}">${channel.health_score.toFixed(1)}</span></td>
        `;
        container.appendChild(row);
    });
}

// Navigation Setup
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav__link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Scroll to section
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Update active nav on scroll
    setupScrollSpy();
}

function setupScrollSpy() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav__link');
    
    const observerOptions = {
        root: null,
        rootMargin: '-120px 0px -60% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetId = entry.target.id;
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${targetId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Progress Bars Animation
function setupProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar__fill');
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.getAttribute('data-width');
                
                setTimeout(() => {
                    progressBar.style.width = width + '%';
                }, 300);
                
                observer.unobserve(progressBar);
            }
        });
    }, { threshold: 0.5 });
    
    progressBars.forEach(bar => {
        observer.observe(bar);
    });
}

// Circular Progress Setup
function setupCircularProgress(score) {
    const circularProgress = document.getElementById('health-score-progress');
    
    if (circularProgress) {
        // Animate the circular progress
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCircularProgress(entry.target, score);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(circularProgress);
    }
}

function animateCircularProgress(element, targetScore) {
    let currentScore = 0;
    const increment = targetScore / 60; // 60 frames for smooth animation
    const scoreElement = element.querySelector('.circular-progress__score');
    
    const animation = setInterval(() => {
        currentScore += increment;
        
        if (currentScore >= targetScore) {
            currentScore = targetScore;
            clearInterval(animation);
        }
        
        element.style.setProperty('--score', currentScore);
        scoreElement.textContent = currentScore.toFixed(1);
    }, 16); // ~60fps
}

// Market Position Chart
function setupMarketPositionChart(competitor_benchmark, main_channel_name) {
    const canvas = document.getElementById('marketPositionChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    const processedData = competitor_benchmark.channels.map(channel => ({
        name: channel.name,
        subscribers: channel.subscribers / 1000, // Convert to K
        avgViews: channel.avg_views / 1000, // Convert to K
        engagementRate: channel.engagement_rate,
        current: channel.name === main_channel_name
    }));

    const chartData = {
        datasets: [{
            label: 'Current Channel',
            data: processedData.filter(d => d.current).map(d => ({
                x: d.subscribers,
                y: d.engagementRate,
                r: Math.sqrt(d.avgViews) * 2 // Adjust bubble size scaling
            })),
            backgroundColor: 'rgba(50, 184, 198, 0.8)',
            borderColor: 'rgba(50, 184, 198, 1)',
            borderWidth: 2
        }, {
            label: 'Competitors',
            data: processedData.filter(d => !d.current).map(d => ({
                x: d.subscribers,
                y: d.engagementRate,
                r: Math.sqrt(d.avgViews) * 2 // Adjust bubble size scaling
            })),
            backgroundColor: 'rgba(119, 124, 124, 0.6)',
            borderColor: 'rgba(119, 124, 124, 1)',
            borderWidth: 1
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: 'Subscribers vs Engagement Rate (Bubble size = Avg Views)',
                font: { size: 16, weight: 'bold' },
                color: getComputedStyle(document.documentElement).getPropertyValue('--color-text').trim()
            },
            legend: {
                position: 'top',
                labels: {
                    color: getComputedStyle(document.documentElement).getPropertyValue('--color-text').trim(),
                    usePointStyle: true,
                    padding: 20
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const dataPoint = processedData[context.dataIndex];
                        return [
                            `${dataPoint.name}`,
                            `Subscribers: ${dataPoint.subscribers.toFixed(1)}K`,
                            `Engagement: ${dataPoint.engagementRate}%`,
                            `Avg Views: ${dataPoint.avgViews.toFixed(1)}K`
                        ];
                    }
                }
            }
        },
        scales: {
                    x: {
                        type: 'logarithmic',
                        title: {
                            display: true,
                            text: 'Subscribers (K)',
                            color: getComputedStyle(document.documentElement).getPropertyValue('--color-text').trim()
                        },
                        ticks: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--color-text-secondary').trim(),
                            callback: function(value) {
                                return value + 'K';
                            }
                        },
                        grid: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--color-border').trim()
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Engagement Rate (%)',
                            color: getComputedStyle(document.documentElement).getPropertyValue('--color-text').trim()
                        },
                        ticks: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--color-text-secondary').trim(),
                            callback: function(value) {
                                return value + '%';
                            }
                        },
                        grid: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--color-border').trim()
                        }
                    }
                }
    };

    new Chart(ctx, {
        type: 'scatter',
        data: chartData,
        options: chartOptions
    });
}

// Smooth Scrolling Setup
function setupSmoothScrolling() {
    // Add smooth scrolling behavior to the document
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Handle any internal links
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach(link => {
        if (!link.classList.contains('nav__link')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        }
    });
}

// Utility Functions
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle window resize
window.addEventListener('resize', debounce(() => {
    // Refresh charts if needed
    const charts = Chart.instances;
    charts.forEach(chart => {
        if (chart) {
            chart.resize();
        }
    });
}, 250));

// Handle theme changes for charts
function updateChartColors() {
    const charts = Chart.instances;
    charts.forEach(chart => {
        if (chart && chart.options) {
            // Update chart colors based on current theme
            const textColor = getComputedStyle(document.documentElement).getPropertyValue('--color-text').trim();
            const secondaryTextColor = getComputedStyle(document.documentElement).getPropertyValue('--color-text-secondary').trim();
            const borderColor = getComputedStyle(document.documentElement).getPropertyValue('--color-border').trim();
            
            if (chart.options.plugins && chart.options.plugins.title) {
                chart.options.plugins.title.color = textColor;
            }
            
            if (chart.options.plugins && chart.options.plugins.legend && chart.options.plugins.legend.labels) {
                chart.options.plugins.legend.labels.color = textColor;
            }
            
            if (chart.options.scales) {
                Object.keys(chart.options.scales).forEach(scaleKey => {
                    const scale = chart.options.scales[scaleKey];
                    if (scale.title) scale.title.color = textColor;
                    if (scale.ticks) scale.ticks.color = secondaryTextColor;
                    if (scale.grid) scale.grid.color = borderColor;
                });
            }
            
            chart.update();
        }
    });
}

// Listen for theme changes
const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-color-scheme') {
            setTimeout(updateChartColors, 100);
        }
    });
});

observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-color-scheme']
});

// Export functions for potential external use
window.YouTubeAnalytics = {
    setTheme,
    formatNumber,
    updateChartColors
};

// Add loading states
function showLoading(element) {
    if (element) {
        element.style.opacity = '0.6';
        element.style.pointerEvents = 'none';
    }
}

function hideLoading(element) {
    if (element) {
        element.style.opacity = '1';
        element.style.pointerEvents = 'auto';
    }
}

// Performance optimization: Lazy load images
function setupLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.style.opacity = '0';
                    img.style.transition = 'opacity 0.3s ease-in-out';
                    
                    img.onload = () => {
                        img.style.opacity = '1';
                    };
                    
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('.chart-image').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Lazy loading is now initialized within initializeApp after data is fetched.