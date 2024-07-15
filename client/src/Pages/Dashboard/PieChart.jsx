
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import './PieCharts.scss'

ChartJS.register(...registerables);

const PieChartWithAnimation = ({ data, options }) => {
    return <Pie data={data} options={options} />;
};

const Dashboard = () => {
    const codeforcesData = {
        labels: ['800', '900', '1000', '1100', '1200', '1300', '1400', '1500'],
        datasets: [
            {
                label: 'Codeforces Ratings',
                data: [5, 10, 15, 20, 25, 30, 35, 40],
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40',
                    '#FF6384',
                    '#36A2EB'
                ],
                hoverBackgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40',
                    '#FF6384',
                    '#36A2EB'
                ],
            }
        ],
    };

    const leetcodeData = {
        labels: ['Easy', 'Medium', 'Hard'],
        datasets: [
            {
                label: 'LeetCode Problems',
                data: [60, 30, 10],
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56'
                ],
                hoverBackgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56'
                ],
            }
        ],
    };

    const codechefData = {
        labels: ['Beginner', 'Intermediate', 'Advanced'],
        datasets: [
            {
                label: 'CodeChef Levels',
                data: [50, 30, 20],
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56'
                ],
                hoverBackgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56'
                ],
            }
        ],
    };

    const options = {
        responsive: true,
        animation: {
            animateScale: true,
            animateRotate: true
        },
        plugins: {
            legend: {
                display: true,
                position: 'bottom'
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.label || '';
                        const value = context.raw;
                        return `${label}: ${value}`;
                    }
                }
            }
        }
    };

    const chartStyle = {
        width: '100%',
        height: '100%',
        // margin: '20px auto'
    };

    return (
        <div className='piecharts'>

            <div className='chart'>
                <h3>Codeforces Ratings</h3>
                <div style={chartStyle}>
                    <PieChartWithAnimation data={codeforcesData} options={options} />
                </div>
            </div>
            <div className='chart'>
                <h3>LeetCode Problems</h3>
                <div style={chartStyle}>
                    <PieChartWithAnimation data={leetcodeData} options={options} />
                </div>
            </div>
            <div className='chart'>
                <h3>CodeChef Levels</h3>
                <div style={chartStyle}>
                    <PieChartWithAnimation data={codechefData} options={options} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
