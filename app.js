// YouTube Analytics Dashboard - JavaScript

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize all components
    setupThemeToggle();
    setupNavigation();
    setupProgressBars();
    setupCircularProgress();
    setupMarketPositionChart();
    setupSmoothScrolling();
    
    // Set initial theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
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
function setupCircularProgress() {
    const circularProgress = document.querySelector('.circular-progress');
    
    if (circularProgress) {
        const score = parseFloat(circularProgress.getAttribute('data-score'));
        circularProgress.style.setProperty('--score', score);
        
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
function setupMarketPositionChart() {
    const canvas = document.getElementById('marketPositionChart');
    
    if (canvas) {
        const ctx = canvas.getContext('2d');
        
        // Competitor data
        const competitorData = [
            { name: 'Jhoom Baba Gyaan', subscribers: 60.8, avgViews: 25.8, engagementRate: 4.5, current: true },
            { name: 'CareerVidz', subscribers: 5000, avgViews: 45.0, engagementRate: 3.2, current: false },
            { name: 'Career Protocol', subscribers: 18.0, avgViews: 12.0, engagementRate: 5.8, current: false },
            { name: 'Internshala', subscribers: 265.0, avgViews: 22.0, engagementRate: 3.8, current: false }
        ];
        
        new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Current Channel',
                    data: competitorData.filter(d => d.current).map(d => ({
                        x: d.subscribers,
                        y: d.engagementRate,
                        r: Math.sqrt(d.avgViews) / 2
                    })),
                    backgroundColor: '#1FB8CD',
                    borderColor: '#1FB8CD',
                    borderWidth: 2
                }, {
                    label: 'Competitors',
                    data: competitorData.filter(d => !d.current).map(d => ({
                        x: d.subscribers,
                        y: d.engagementRate,
                        r: Math.sqrt(d.avgViews) / 2
                    })),
                    backgroundColor: 'rgba(180, 131, 76, 0.6)',
                    borderColor: '#B4834C',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Subscribers vs Engagement Rate (Bubble size = Avg Views)',
                        font: {
                            size: 16,
                            weight: 'bold'
                        },
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
                                const dataIndex = context.dataIndex;
                                const dataset = context.datasetIndex;
                                const competitor = dataset === 0 ? 
                                    competitorData.filter(d => d.current)[dataIndex] : 
                                    competitorData.filter(d => !d.current)[dataIndex];
                                
                                return [
                                    `${competitor.name}`,
                                    `Subscribers: ${competitor.subscribers}K`,
                                    `Engagement: ${competitor.engagementRate}%`,
                                    `Avg Views: ${competitor.avgViews}K`
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
            }
        });
    }
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

// Initialize lazy loading
setTimeout(setupLazyLoading, 1000);