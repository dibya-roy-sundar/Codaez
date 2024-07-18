import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, elements, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(...registerables);

const LineGraph = ({ data, platform }) => {

    const chartData = {
        datasets: [
            {
                label: `${platform === 'cf' ? "CodeForces" : platform === 'lc' ? "LeetCode" : "CodeChef"} Rating`,
                borderColor: platform === 'cf' ? 'rgba(255, 99, 132, 1)' : platform === 'lc' ? 'rgba(54, 162, 235, 1)' : 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                // fill: true,
                fill: false,
                radius: 0,
                tension: 0.25,
                hitRadius: 16,
                data: data,
            }
        ],
    };

    const totalDuration = 300; // Total duration for the animation
    const easingFunction = (t) => t; // Ease in function

    const options = {
        interaction: {
            mode: 'index',
            axis: 'x',
            intersect: false,
        },
        hover: {
            mode: 'index',
            intersect: false
        },
        normalized: true,
        animation: {
            x: {
                type: 'number',
                easing: 'linear',
                duration: (ctx) => easingFunction(ctx.index / data.length) * totalDuration,
                from: NaN, // the point is initially skipped
                delay(ctx) {
                    if (ctx.type !== 'data' || ctx.xStarted) {
                        return 0;
                    }
                    ctx.xStarted = true;
                    return easingFunction(ctx.index / data.length) * totalDuration;
                }
            },
            y: {
                type: 'number',
                easing: 'linear',
                duration: (ctx) => easingFunction(ctx.index / data.length) * totalDuration,
                from: (ctx) => (ctx.index === 0 ? 0 : ctx.chart.getDatasetMeta(0).data[ctx.index - 1].y),
                delay(ctx) {
                    if (ctx.type !== 'data' || ctx.yStarted) {
                        return 0;
                    }
                    ctx.yStarted = true;
                    return easingFunction(ctx.index / data.length) * totalDuration;
                }
            },
        },
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'month',
                    tooltipFormat: 'MMM yy',
                    displayFormats: {
                        month: 'MMM yy'
                    },
                },
                title: {
                    display: window.innerWidth > 630,
                    text: 'Month',
                    font: {
                        family: 'Urbanist',
                        weight: 'bold'
                    }
                }
            },
            y: {
                // beginAtZero: true,
                title: {
                    display: window.innerWidth > 630,
                    text: 'Rating',
                    font: {
                        family: 'Urbanist',
                        weight: 'bold'
                    }
                }
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: `${platform === 'cf' ? "CodeForces" : platform === 'lc' ? "LeetCode" : "CodeChef"} Contest Rating Over Time`,
                font: {
                    family: 'Urbanist'
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(26, 26, 26, 0.8)', // Custom background color for tooltip
                callbacks: {
                    label: function (context) {
                        return [`Rating: ${context.raw.y}`, `Rank: ${context.raw.rank}`];
                    }
                },
                bodyFont: {
                    family: 'Urbanist',
                },
                titleFont: {
                    family: 'Urbanist',
                },
            },
        },
        font: {
            family: 'Urbanist'
        }
    };

    return (
        <div className="chart-container">
            <Line data={chartData} options={options} />
        </div>
    );
};

export default LineGraph;
