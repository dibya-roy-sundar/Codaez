import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import './PieCharts.scss'

ChartJS.register(...registerables);

const PieChart = ({ data, platform }) => {
    const pieData = {
        labels: Object.keys(data),
        datasets: [
            {
                label: `${platform === 'cf' ? 'CodeForces' : 'Leetcode'} Question`,
                data: Object.values(data),
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40',
                ],
                hoverBackgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40',
                ],
                hoverOffset: 4,
            }
        ],
    };

    const options = {
        normalized: true,
        responsive: true,
        animation: {
            animateScale: true,
            animateRotate: true
        },
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                align: 'center',
                labels: {
                    // This more specific font property overrides the global property
                    font: {
                        family: "Urbanist",
                        weight: 'bold'
                    }
                }
            },

            title: {
                display: true,
                text: `${platform === 'cf' ? 'CodeForces' : 'LeetCode'} Problemwise Distribution`,
                font: {
                    family: 'Urbanist',
                }
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.label || '';
                        const value = context.raw;
                        return `${label}: ${value}`;
                    }
                },
                bodyFont: {
                    family: 'Urbanist',
                },
                titleFont: {
                    family: 'Urbanist',
                },
            }
        }
    };

    return (
        <div className='chart'>
            <Pie data={pieData} options={options} />
        </div>
    );
};

export default PieChart;
