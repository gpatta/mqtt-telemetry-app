import React from 'react';
import '../styles/ChartView.css';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    // TimeScale
} from 'chart.js';
// import 'chartjs-adapter-date-fns';
// import zoomPlugin, { zoom } from 'chartjs-plugin-zoom';

// Register the components
ChartJS.register(
    CategoryScale, // X-axis scale
    LinearScale,   // Y-axis scale
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    // TimeScale,
    // zoomPlugin
);

const ChartView = ({ deviceData }) => {

    let limit = 120;

    // const chartRef = useRef(null);

    // useEffect(() => {
    //     const chart = chartRef.current;

    //     if (chart) {
    //         chart.options.plugins.zoom.zoom.mode = 'x';
    //         chart.update('none'); // Prevent re-render on zoom
    //     }
    // }, []);

    // const chartData = {
    //     labels: deviceData.map(record => new Date(record.receivedDt).toLocaleDateString()), // Dates as labels
    //     datasets: [
    //         {
    //             label: 'Record Data',
    //             data: deviceData.map(record => record.payload.bt.v), // Replace `value` with the actual field you want to plot
    //             fill: false,
    //             borderColor: 'rgba(75,192,192,1)',
    //             tension: 0.1,
    //         },
    //     ],
    // };

    const chartData = {
        // labels: ["January", "February", "March", "April", "May", "June", "July"],
        labels: deviceData.slice(0, limit).reverse().map(record => new Date(record.received_dt).toLocaleTimeString("it-IT", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            })),
        datasets: [
            {
                label: "Voltage",
                data: deviceData.slice(0, limit).reverse().map(record => record.payload.bt.v),
                fill: false,
                borderColor: '#ff6700',       // Line color
                backgroundColor: 'rgba(255, 103, 0, 0.2)', // Fill color with opacity
                tension: 0.1,
            },
            {
                label: "Current",
                data: deviceData.slice(0, limit).reverse().map(record => record.payload.bt.c),
                fill: false,
                borderColor: 'rgba(200, 0, 0, 1)',       // Line color
                backgroundColor: 'rgba(200, 0, 0, 0.2)', // Fill color with opacity
                tension: 0.1,
            },
            {
                label: "Temperature",
                data: deviceData.slice(0, limit).reverse().map(record => record.payload.bt.t),
                fill: false,
                borderColor: 'rgba(0, 162, 238, 1)',       // Line color
                backgroundColor: 'rgba(0, 162, 238, 0.2)', // Fill color with opacity
                tension: 0.1,
            },
            // {
            //     label: "Expenses",
            //     data: [40, 35, 55, 65, 80, 85, 95],
            //     fill: false,
            //     borderColor: 'rgba(255, 99, 132, 1)',
            //     backgroundColor: 'rgba(255, 99, 132, 0.4)',
            //     tension: 0.1,
            // }
        ]
    };

    const chartOptions = {
        responsive: true,
        devicePixelRatio: 2,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                enabled: true,
            },
            // zoom: {
            //     // pan: {
            //     //     enabled: true,
            //     //     mode: 'x',
            //     // },
            //     zoom: {
            //         wheel: {
            //             enabled: true,
            //         },
            //         pinch: {
            //             enabled: true,
            //         },
            //         mode: 'xy',
            //     },
            // },
        },
        scales: {
            x: {
                // type: 'time', // Use time scale
                title: {
                    display: true,
                    text: new Date(deviceData[0].received_dt).toLocaleDateString("it-IT", {})
                },
                // time: {
                //     unit: 'second', // Display seconds on x-axis
                //     displayFormats: {
                //         second: 'HH:mm:ss', // Format for seconds
                //     },
                // },
            },
            y: {
                title: {
                    display: false,
                    text: 'Values',
                },
                beginAtZero: true,
            }
        }
    };

    return (
        <div className="ChartView">
            {/* <Line ref={chartRef} data={chartData} options={chartOptions} /> */}
            <Line data={chartData} options={chartOptions} />
        </div>
    );
};

export default ChartView;