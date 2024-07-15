import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
import './Chart.scss'

ChartJS.register(...registerables);

const ContestRatingChart = ({ data, platform }) => {
    const chartData = {
        datasets: [
            {
                label: `${platform} Rating`,
                borderColor: platform === 'LeetCode' ? 'rgba(255, 99, 132, 1)' : platform === 'Codeforces' ? 'rgba(54, 162, 235, 1)' : 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false,
                radius: 0,
                data: data,
            }
        ],
    };

    const totalDuration = 2000; // Total duration for the animation
    const easingFunction = (t) => t * t; // Ease in function

    const options = {
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
            }
        },
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'month',
                    tooltipFormat: 'MMM yyyy',
                    displayFormats: {
                        month: 'MMM yyyy'
                    }
                },
                title: {
                    display: true,
                    text: 'Month'
                }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Rating'
                }
            },
        },
        plugins: {
            legend: {
                display: true,
            },
            title: {
                display: true,
                text: `${platform} Contest Rating Over Time`,
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `Rating: ${context.raw.y}`;
                    }
                }
            }
        },
    };

    return (
        <div className="chart-container">
            <h2>{platform} Chart</h2>
            <Line data={chartData} options={options} />
        </div>
    );
};

export default ContestRatingChart;
