import React from 'react'
import { Doughnut,Line } from 'react-chartjs-2';
import { 
Chart as ChartJS,
Tooltip,
Filler,
CategoryScale,
LinearScale,
PointElement,
LineElement,
ArcElement,
Legend, 
} from 'chart.js';
import { orange, orangeLight, purple, purpleLight } from '../constants/color';
import { getLast7Days } from '../lib/features';

ChartJS.register(
    Tooltip,
    Filler,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Legend 
);

const labels = getLast7Days();

const lineChartOptions = {
    responsive: true,
    Plugins: {
        Legend: {
            display: false,
        },
        title: {
            display: false,
        },
    },

    scales: {
        x: {
            grid: {
                display: false,
            }
        },
        y: {
            beginAtZero: true,
            grid: {
                display: false,
            }
        },
    },
};

const LineChart = ({value=[]}) => {
    const data = {
        labels,
        datasets: [{
            data: value,
            label: "Messages",
            fill: true,
            backgroundColor: purpleLight,
            borderColor: purple,
        }],
    };

    return <Line data={data} options={lineChartOptions} />
}

const doughnutChartOptions = {
    responsive: true,
    Plugins: {
        Legend: {
            display: false,
        },
    },
    cutout: 120,
}

const DoughnutChart = ({value = [],labels = []}) => {
    const data ={
        labels,
        datasets: [
            {
                data: value,
                label: "Total Charts Vs Group Chats",
                backgroundColor : [purpleLight, orangeLight],
                hoverBackgroundColor: [purple,orange],
                borderColor: [purple,orange],
                offset:20,
            }
        ]
    };
    return <Doughnut style={{zIndex: 10}} data={data} options={doughnutChartOptions} />
}

export {LineChart, DoughnutChart}