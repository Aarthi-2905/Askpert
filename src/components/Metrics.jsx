import React, { useState, useEffect } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement,ArcElement, Title, Tooltip, Legend, Filler,
    LineElement, PointElement
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Line } from 'react-chartjs-2';
import { Pie } from "react-chartjs-2";
import { Doughnut } from "react-chartjs-2";
import zoomPlugin from 'chartjs-plugin-zoom';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement,ArcElement, Filler, Title, Tooltip, Legend, zoomPlugin);

const options = {
    responsive: true,
    plugins: {
        legend: {
            labels: {
                color: "white", 
            },
        },
        title: {
            display: true,
            text: "Files Uploaded & Queries Responded",
            color: "white",
        },
        tooltip: {
            callbacks: {
                title: (tooltipItems) => {
                    const dateStr = tooltipItems[0].label;
                    return `Date: ${dateStr}`;
                },
                label: (tooltipItem) => {
                    let datasetLabel = tooltipItem.dataset.label || "";
                    let value = tooltipItem.raw;
                    
                    if (datasetLabel === "Filea Uploaded") {
                        return `${datasetLabel}: ${value} Files`;
                    } else if (datasetLabel === "Queries Responded") {
                        return `${datasetLabel}: ${value} Queries`;
                    }
                    return `${datasetLabel}: ${value}`;
                }
            },
        },
    },
    scales: {
        x: {
            grid: {
                color: "rgba(255, 255, 255, 0.2)", 
            },
            ticks: {
                color: "white",
                callback: function(value, index) {
                    const dateStr = this.getLabelForValue(index);
                    return dateStr.split('/')[0];
                } 
            },
            title: {
                position:"bottom",
                display: true,
                text: "Days",
            },
        },
        y: {
            grid: {
                color: "rgba(255, 255, 255, 0.2)",
            },
            ticks: {
                color: "white",
            },
            title: {
                position:"bottom",
                display: true,
                text: "Count",
            },
        },
    },
};

const options2 = {
    responsive: true,
    plugins: {
        legend: {
            labels: {
                color: "white", 
            },
        },
        title: {
            display: true,
            text: "Query Processing Time",
            color: "white",
        },
        tooltip: {
            callbacks: {
                title: (tooltipItems) => {
                    return `Date: ${tooltipItems[0].label}`; // Prefix "Date: "
                },
                label: (tooltipItem) => {
                    let datasetLabel = tooltipItem.dataset.label || "";
                    let value = tooltipItem.raw; // Get the raw value from dataset
                    return `${datasetLabel}: ${value} Hours`;
                },  
            },
        },
    },
    scales: {
        x: {
            grid: {
                color: "rgba(255, 255, 255, 0.2)", 
            },
            ticks: {
                color: "white",
                callback: function(value, index) {
                    const dateStr = this.getLabelForValue(index);
                    return dateStr.split('/')[0];
                } 
            },
            title: {
                position:"bottom",
                display: true,
                text: "Days",
            },
        },
        y: {
            grid: {
                color: "rgba(255, 255, 255, 0.2)",
            },
            ticks: {
                color: "white",
            },
            title: {
                position:"top",
                display: true,
                text: "Hours",
            },
        },
    },
};

const options3 = {
    responsive: true,
    plugins: {
        legend: {
            labels: {
                color: "white", 
            },
        },
        title: {
            display: true,
            text: "Files Uploading Time",
            color: "white",
        },
        tooltip: {
            callbacks: {
                title: (tooltipItems) => {
                    return `Date: ${tooltipItems[0].label}`; // Prefix "Date: "
                },
                label: (tooltipItem) => {
                    let datasetLabel = tooltipItem.dataset.label || "";
                    let value = tooltipItem.raw; // Get the raw value from dataset
                    return `${datasetLabel}: ${value} Hours`;
                },
            },
        },
    },
    scales: {
        x: {
            grid: {
                color: "rgba(255, 255, 255, 0.2)", 
            },
            ticks: {
                color: "white",
                callback: function(value, index) {
                    const dateStr = this.getLabelForValue(index);
                    return dateStr.split('/')[0];
                } 
            },
            title: {
                position:"bottom",
                display: true,
                text: "Days",
            },
        },
        y: {
            grid: {
                color: "rgba(255, 255, 255, 0.2)",
            },
            ticks: {
                color: "white",
            },
            title: {
                position:"top",
                display: true,
                text: "Hours",
            },
        },
    },
};

const options4 = {
    responsive: true,
    plugins: {
        legend: {
            // position:"left",
            labels: {
                color: "white", 
            },
        },
        title: {
            display: true,
            text: "User Session",
            color: "white",
        },
        tooltip: {
            callbacks: {
                title: (tooltipItems) => {
                 return `Date: ${tooltipItems[0].label}`; // Prefix "Date: "
                },
                label: (tooltipItem) => {
                    let datasetLabel = tooltipItem.dataset.label || "";
                    let value = tooltipItem.raw;
                    
                    if (datasetLabel === "No of Hours") {
                        return `${datasetLabel}: ${value} Hours`;
                    } else if (datasetLabel === "No of Users") {
                        return `${datasetLabel}: ${value} Users`;
                    }
                    return `${datasetLabel}: ${value}`;
                }               
            },
        },
      },
    scales: {
        x: {
            grid: {
                color: "rgba(255, 255, 255, 0.2)", 
            },
            ticks: {
                color: "white",
                callback: function(value, index) {
                    const dateStr = this.getLabelForValue(index);
                    return dateStr.split('/')[0];
                } 
            },
            title: {
                position:"bottom",
                display: true,
                text: "Days",
            },
        },
        y1: {
            grid: {
                color: "rgba(255, 255, 255, 0.2)",
            },
            ticks: {
                color: "white",
            },
            // position: "left",
            title: {
                position:"left",
                display: true,
                text: "No of Hours",
            },
            beginAtZero: true,
        },
        y2: {
            position: "right",
            title: {
                position:"right",
                display: true,
                text: "No of Users",
            },
            ticks: {
                color: "white",
            },
            beginAtZero: true,
        },
    },
};

const options5 = {
    responsive: true,
    indexAxis: 'y',
    plugins: {
        legend: {
            labels: {
                color: "white", 
            },
        },
        title: {
            display: true,
            text: "File Upload Components Time",
            color: "white",
        },
        tooltip: {
            enabled: true,
            callbacks: {
                title: function (tooltipItems) {
                    return `File name: ${tooltipItems[0].label}`; // Prefix with "File name: "
                },
                label: function (tooltipItem) {
                    const value = tooltipItem.raw; 
                    return `${tooltipItem.dataset.label}: ${value}s`; // Ensure suffix "seconds"
                },
            },
        },
        
    },
    scales: {
        x: {
            stacked: true,
            grid: {
                color: "rgba(255, 255, 255, 0.2)", 
            },
            ticks: {
                color: "white",
                // callback: function(value, index) {
                //     const dateStr = this.getLabelForValue(index);
                //     return dateStr.split('/')[0];
                // } 
            },
            title: {
                position:"bottom",
                display: true,
                text: "Seconds",
            },
        },
        y: {
            stacked: true,
            grid: {
                color: "rgba(255, 255, 255, 0.2)",
            },
            ticks: {
                color: "white",
                callback: function(value, index, values) {
                    const label = this.getLabelForValue(value); // Fetch label
                    return label.length > 7 ? label.substring(0, 7) + "..." : label;
                },
            },
            title: {
                position:"top",
                display: true,
                text: "File",
            },
        },
    },
};

const options6 = {
    plugins: {
        legend: {
            position: "right",
            labels: {
                color: "white", 
            },
        },
        title: {
            display: true,
            text: "File Upload Component Utilization",
            color: "white",
        },
        tooltip: {
            callbacks: {
                label: function (tooltipItem) {
                    let index = tooltipItem.dataIndex;
                    let dataset = tooltipItem.dataset.data;
                    let totalTime = dataset[index];
                    let percentage = ((totalTime / dataset.reduce((sum, val) => sum + val, 0)) * 100).toFixed(2);
                    return ` ${tooltipItem.label}: ${totalTime.toFixed(2)}s (${percentage}%)`;
                },
            },
        },
    },
    responsive: true,
    maintainAspectRatio: false,
};

const options7 = {
    responsive: true,
    indexAxis: 'y',
    plugins: {
        legend: {
            labels: {
                color: "white", 
            },
        },
        title: {
            display: true,
            text: "Query Components Time",
            color: "white",
        },
        tooltip: {
            enabled: true,
            callbacks: {
                title: function (tooltipItems) {
                    return `File name: ${tooltipItems[0].label}`; // Prefix with "File name: "
                },
                label: function (tooltipItem) {
                    const value = tooltipItem.raw; 
                    return `${tooltipItem.dataset.label}: ${value}s`; // Ensure suffix "seconds"
                },
            },
        },
        
    },
    scales: {
        x: {
            stacked: true,
            grid: {
                color: "rgba(255, 255, 255, 0.2)", 
            },
            ticks: {
                color: "white",
                // callback: function(value, index) {
                //     const dateStr = this.getLabelForValue(index);
                //     return dateStr.split('/')[0];
                // } 
            },
            title: {
                position:"bottom",
                display: true,
                text: "Seconds",
            },
        },
        y: {
            stacked: true,
            grid: {
                color: "rgba(255, 255, 255, 0.2)",
            },
            ticks: {
                color: "white",
                callback: function(value, index, values) {
                    const label = this.getLabelForValue(value); // Fetch label
                    return label.length > 7 ? "..." + label.slice(-7) : label;
                },
            },
            title: {
                position:"top",
                display: true,
                text: "Query",
            },
        },
    },
};

const options8 = {
    plugins: {
        legend: {
            position: "right",
            labels: {
                color: "white", 
            },
        },
        title: {
            display: true,
            text: "Query Component Utilization",
            color: "white",
        },
        tooltip: {
            callbacks: {
                label: function (tooltipItem) {
                    let index = tooltipItem.dataIndex;
                    let dataset = tooltipItem.dataset.data;
                    let totalTime = dataset[index];
                    let percentage = ((totalTime / dataset.reduce((sum, val) => sum + val, 0)) * 100).toFixed(2);
                    return ` ${tooltipItem.label}: ${totalTime.toFixed(2)}s (${percentage}%)`;
                },
            },
        },
    },
    responsive: true,
    maintainAspectRatio: false,
};

const options9 = {
    responsive: true,
    plugins: {
        legend: {
            // position:"left",
            labels: {
                color: "white", 
            },
        },
        title: {
            display: true,
            text: "Insertion Time & No of Chunks (VectorDB)",
            color: "white",
        },
        tooltip: {
            enabled: true,
            callbacks: {
                title: function (tooltipItems) {
                    return `File name: ${tooltipItems[0].label}`; // Prefix with "File name: "
                },
                label: function (tooltipItem) {
                    let datasetLabel = tooltipItem.dataset.label || '';
                    let value = tooltipItem.raw;

                    if (datasetLabel === "Insertion Time") {
                        return `${datasetLabel}: ${value}s`;
                    }
                    return `${datasetLabel}: ${value}`;
                }
            },
        },
        zoom: {
            pan: {
                enabled: true,
                mode: 'x'
            },
            zoom: {
                pinch: {
                    enabled: true     
                },
                wheel: {
                    enabled: true 
                },
                mode: 'x',
            }
        },
      },
    scales: {
        x: {
            grid: {
                color: "rgba(255, 255, 255, 0.2)", 
            },
            ticks: {
                color: "white",
                callback: function(value, index) {
                    const fileStr = this.getLabelForValue(index);
                    return fileStr.length > 5 ? fileStr.substring(0, 4) + "..." : fileStr;
                } 
            },
            title: {
                position:"bottom",
                display: true,
                text: "File Name",
            },
            gridLines: {
                display: false
            }
        },
        y1: {
            grid: {
                color: "rgba(255, 255, 255, 0.2)",
            },
            ticks: {
                color: "white",
                callback: function(value, index) {
                    const dateStr = this.getLabelForValue(index);
                    return dateStr.split('/')[0];
                } 
            },
            // position: "left",
            title: {
                position:"left",
                display: true,
                text: "Insertion_time",
            },
            beginAtZero: true,
        },
        y2: {
            position: "right",
            title: {
                position:"right",
                display: true,
                text: "Chunks",
            },
            beginAtZero: true,
        },
    },
};

const options10 = {
    responsive: true,
    plugins: {
        legend: {
            labels: {
                color: "white", 
            },
        },
        title: {
            display: true,
            text: "Vector search Retrieval time",
            color: "white",
        },
        tooltip: {
            callbacks: {
                title: (tooltipItems) => {
                    return `Date: ${tooltipItems[0].label}`; // Prefix "Date: "
                   },
                   label: (tooltipItem) => {
                       let datasetLabel = tooltipItem.dataset.label || "";
                       let value = tooltipItem.raw; // Get the raw value from dataset
                       return `${datasetLabel}: ${value} hr`;
                   },
            },
        },
    },
    scales: {
        x: {
            grid: {
                color: "rgba(255, 255, 255, 0.2)", 
            },
            ticks: {
                color: "white",
                callback: function(value, index) {
                    const dateStr = this.getLabelForValue(index);
                    return dateStr.split('/')[0];
                } 
            },
            title: {
                position:"bottom",
                display: true,
                text: "Days",
            },
        },
        y: {
            grid: {
                color: "rgba(255, 255, 255, 0.2)",
            },
            ticks: {
                color: "white",
                callback: function(value, index) {
                    const dateStr = this.getLabelForValue(index);
                    return dateStr.split('/')[0];
                } 
            },
            title: {
                position:"top",
                display: true,
                text: "Hours",
            },
        },
    },
};

const options11 = {
    plugins: {
        legend: {
            position: "right",
        },
        title: {
            display: true,
            text: "File format distribution",
            color: "white",
        },
        tooltip: {
            callbacks: {
                title: (tooltipItems) => {
                    return `File format: ${tooltipItems[0].label}`; // Prefix "Date: "
                },
                label: function (tooltipItem) {
                    let index = tooltipItem.dataIndex;
                    let dataset = tooltipItem.dataset.data;
                    let totalFiles = dataset[index]; 
                    let totalFilesSum = dataset.reduce((sum, val) => sum + val, 0);
                    let percentage = ((totalFiles / totalFilesSum) * 100).toFixed(2);
                    return `${tooltipItem.label}: ${totalFiles} files (${percentage}%)`;
                },
            },
        },
    },
    responsive: true,
    maintainAspectRatio: false,
};

const options12 = {
    responsive: true,
    plugins: {
        legend: {
            labels: {
                color: "white", 
            },
        },
        title: {
            display: true,
            text: "Image Insertion & Retrieval (Database)",
            color: "white",
        },
        tooltip: {
            callbacks: {
                title: (tooltipItems) => {
                    return `Date: ${tooltipItems[0].label}`; // Prefix "Date: "
                },
            },
        },
    },
    scales: {
        x: {
            grid: {
                color: "rgba(255, 255, 255, 0.2)", 
            },
            ticks: {
                color: "white",
                callback: function(value, index) {
                    const dateStr = this.getLabelForValue(index);
                    return dateStr.split('/')[0];
                } 
            },
            title: {
                position:"bottom",
                display: true,
                text: "Days",
            },
        },
        y: {
            grid: {
                color: "rgba(255, 255, 255, 0.2)",
            },
            ticks: {
                color: "white",
            },
            title: {
                position:"bottom",
                display: true,
                text: "No of images",
            },
        },
    },
};

const options13 = {
    responsive: true,
    plugins: {
        legend: {
            labels: {
                color: "white", 
            },
        },
        title: {
            display: true,
            text: "LLM Processing Cost",
            color: "white",
        },
        tooltip: {
            callbacks: {
                title: (tooltipItems) => {
                    return `Date: ${tooltipItems[0].label}`; // Prefix "Date: "
                },
                label: (tooltipItem) => {
                    let datasetLabel = tooltipItem.dataset.label || "";
                    let value = tooltipItem.raw; // Get the raw value from dataset
                    return `${datasetLabel}: ${value} $`;
                },   
            },
        },
    },
    scales: {
        x: {
            grid: {
                color: "rgba(255, 255, 255, 0.2)", 
            },
            ticks: {
                color: "white",
                callback: function(value, index) {
                    const dateStr = this.getLabelForValue(index);
                    return dateStr.split('/')[0];
                } 
            },
            title: {
                position:"bottom",
                display: true,
                text: "Days",
            },
        },
        y: {
            grid: {
                color: "rgba(255, 255, 255, 0.2)",
            },
            ticks: {
                color: "white",
            },
            title: {
                position:"bottom",
                display: true,
                text: "Cost $",
            },
        },
    },
};

const options14 = {
    responsive: true,
    plugins: {
        legend: {
            labels: {
                color: "white", 
            },
        },
        title: {
            display: true,
            text: "File Processing Tokens",
            color: "white",
        },
        tooltip: {
            callbacks: {
                title: (tooltipItems) => {
                    return `Date: ${tooltipItems[0].label}`; // Prefix "Date: "
                   },
                   label: (tooltipItem) => {
                       let datasetLabel = tooltipItem.dataset.label || "";
                       let value = tooltipItem.raw; // Get the raw value from dataset
                       return `${datasetLabel}: ${value} tokens`;
                   },
            },
        },
    },
    scales: {
        x: {
            grid: {
                color: "rgba(255, 255, 255, 0.2)", 
            },
            ticks: {
                color: "white",
                callback: function(value, index) {
                    const dateStr = this.getLabelForValue(index);
                    return dateStr.split('/')[0];
                } 
            },
            title: {
                position:"bottom",
                display: true,
                text: "Days",
            },
        },
        y: {
            grid: {
                color: "rgba(255, 255, 255, 0.2)",
            },
            ticks: {
                color: "white",
            },
            title: {
                position:"bottom",
                display: true,
                text: "Tokens",
            },
        },
    },
};

const options15 = {
    responsive: true,
    plugins: {
        legend: {
            labels: {
                color: "white", 
            },
        },
        title: {
            display: true,
            text: "Query Rephrasing Tokens",
            color: "white",
        },
        tooltip: {
            callbacks: {
                title: (tooltipItems) => {
                    return `Date: ${tooltipItems[0].label}`; // Prefix "Date: "
                   },
                   label: (tooltipItem) => {
                       let datasetLabel = tooltipItem.dataset.label || "";
                       let value = tooltipItem.raw; // Get the raw value from dataset
                       return `${datasetLabel}: ${value} tokens`;
                   },
            },
        },
    },
    scales: {
        x: {
            grid: {
                color: "rgba(255, 255, 255, 0.2)", 
            },
            ticks: {
                color: "white",
                callback: function(value, index) {
                    const dateStr = this.getLabelForValue(index);
                    return dateStr.split('/')[0];
                } 
            },
            title: {
                position:"bottom",
                display: true,
                text: "Tokens",
            },
        },
        y: {
            grid: {
                color: "rgba(255, 255, 255, 0.2)",
            },
            ticks: {
                color: "white",
            },
            title: {
                position:"bottom",
                display: true,
                text: "No of Tokens",
            },
        },
    },
};

const options16 = {
    responsive: true,
    plugins: {
        legend: {
            labels: {
                color: "white", 
            },
        },
        title: {
            display: true,
            text: "Response Generation Tokens",
            color: "white",
        },
        tooltip: {
            callbacks: {
                title: (tooltipItems) => {
                 return `Date: ${tooltipItems[0].label}`; // Prefix "Date: "
                },
                label: (tooltipItem) => {
                    let datasetLabel = tooltipItem.dataset.label || "";
                    let value = tooltipItem.raw; // Get the raw value from dataset
                    return `${datasetLabel}: ${value} tokens`;
                },
            },
        },
    },
    scales: {
        x: {
            grid: {
                color: "rgba(255, 255, 255, 0.2)", 
            },
            ticks: {
                color: "white",
                callback: function(value, index) {
                    const dateStr = this.getLabelForValue(index);
                    return dateStr.split('/')[0];
                } 
            },
            title: {
                position:"bottom",
                display: true,
                text: "Tokens",
            },
        },
        y: {
            grid: {
                color: "rgba(255, 255, 255, 0.2)",
            },
            ticks: {
                color: "white",
            },
            title: {
                position:"bottom",
                display: true,
                text: "No of Tokens",
            },
        },
    },
};

const getToken = () => localStorage.getItem('token');
const Metrics = () => {
    const [activeTab, setActiveTab] = useState("Cumulative");
    const [data1, setData1] = useState(null);
    const [data2, setData2] = useState(null);
    const [data3, setData3] = useState(null);
    const [data4, setData4] = useState(null);
    const [data5, setData5] = useState(null);
    const [data6, setData6] = useState(null);
    const [data7, setData7] = useState(null);
    const [data8, setData8] = useState(null);
    const [data9, setData9] = useState(null);
    const [data10, setData10] = useState(null);
    const [data11, setData11] = useState(null);
    const [data12, setData12] = useState(null);
    const [data13, setData13] = useState(null);
    const [data14, setData14] = useState(null);
    const [data15, setData15] = useState(null);
    const [data16, setData16] = useState(null);
    
    const [filters, setFilters] = useState({
        graph1: { month: new Date().toLocaleString('en-US', { month: '2-digit' }), year: new Date().getFullYear().toString() },
        graph2: { month: new Date().toLocaleString('en-US', { month: '2-digit' }), year: new Date().getFullYear().toString() },
        graph3: { month: new Date().toLocaleString('en-US', { month: '2-digit' }), year: new Date().getFullYear().toString() },
        graph4: { month: new Date().toLocaleString('en-US', { month: '2-digit' }), year: new Date().getFullYear().toString() },
        graph5: { month: new Date().toLocaleString('en-US', { month: '2-digit' }), year: new Date().getFullYear().toString() },
        graph6: { month: new Date().toLocaleString('en-US', { month: '2-digit' }), year: new Date().getFullYear().toString() },
        graph7: { month: new Date().toLocaleString('en-US', { month: '2-digit' }), year: new Date().getFullYear().toString() },
        graph8: { month: new Date().toLocaleString('en-US', { month: '2-digit' }), year: new Date().getFullYear().toString() },
        graph9: { month: new Date().toLocaleString('en-US', { month: '2-digit' }), year: new Date().getFullYear().toString() },
        graph10: { month: new Date().toLocaleString('en-US', { month: '2-digit' }), year: new Date().getFullYear().toString() },
        graph11: { month: new Date().toLocaleString('en-US', { month: '2-digit' }), year: new Date().getFullYear().toString() },
        graph12: { month: new Date().toLocaleString('en-US', { month: '2-digit' }), year: new Date().getFullYear().toString() },
        graph13: { month: new Date().toLocaleString('en-US', { month: '2-digit' }), year: new Date().getFullYear().toString() },
        graph14: { month: new Date().toLocaleString('en-US', { month: '2-digit' }), year: new Date().getFullYear().toString() },
        graph15: { month: new Date().toLocaleString('en-US', { month: '2-digit' }), year: new Date().getFullYear().toString() },
        graph16: { month: new Date().toLocaleString('en-US', { month: '2-digit' }), year: new Date().getFullYear().toString() }
    });

    const months = [
        { value: '01', label: 'January' },
        { value: '02', label: 'February' },
        { value: '03', label: 'March' },
        { value: '04', label: 'April' },
        { value: '05', label: 'May' },
        { value: '06', label: 'June' },
        { value: '07', label: 'July' },
        { value: '08', label: 'August' },
        { value: '09', label: 'September' },
        { value: '10', label: 'October' },
        { value: '11', label: 'November' },
        { value: '12', label: 'December' }
    ];

    const years = ['2024', '2025', '2026'];

    const handleFilterChange = (graphId, type, value) => {
        setFilters(prevFilters => {
            const newFilters = { ...prevFilters };
    
            if (type === 'year') {
                newFilters[graphId].year = value;
                // If the selected year is the current year and the month is in future,then adjust it to the current month
                if (value === currentYear && newFilters[graphId].month > currentMonth) {
                    newFilters[graphId].month = currentMonth;
                }
            }
            if (type === 'month') {
                newFilters[graphId].month = value;
            }
            return newFilters;
        });
    };
    
    const currentMonth = new Date().toLocaleString('en-US', { month: '2-digit' });
    const currentYear = new Date().getFullYear().toString();

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    // Fetch Data for Graph 1
    const fetchData1 = async (month, year) => {
        const token = getToken();
        try {
            const response = await fetch(`${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT}/graphs/queries_and_files_per_month/${year}/${month}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setData1({
                labels: data.date,
                datasets: [
                    {
                        type: "line",
                        label: "Files Uploaded",
                        data: data.total_files,
                        fill: false,
                        backgroundColor: "rgba(103, 115, 229, 1)",
                        borderColor: "rgba(103, 115, 229, 1)",
                        borderWidth: 1,
                    },
                    {
                        type: "line",
                        label: "Queries Responded",
                        data: data.total_queries,
                        fill: false,
                        backgroundColor: "rgba(233, 96, 79, 1)",
                        borderColor: "rgba(233, 96, 79, 1)",
                        borderWidth: 1,
                    },
                ],
            });
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

    // Fetch Data for Graph 2
     const fetchData2 = async (month, year) => {
        const token = getToken();
        try {
             const response = await fetch(`${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT}/graphs/queries_total_time_per_date/${year}/${month}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setData2({
                labels: data.date,
                datasets: [
                    {
                        label: "Queries Time",
                        data: data.query_total_time,
                        backgroundColor: "rgba(149, 81, 150, 1)",
                        // borderColor: "rgba(0, 200, 0, 1)",
                        borderWidth: 1,
                    },
                ],
            });
        } catch (error) {
            console.error("Error fetching data for Graph 2:", error);
        }
    };

    // Fetch Data for Graph 3
    const fetchData3 = async (month, year) => {
        const token = getToken();
        try {
            const response = await fetch(`${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT}/graphs/files_total_time_per_date/${year}/${month}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setData3({
                labels: data.date,
                datasets: [
                {
                    label: "Uploading Time",
                    data: data.file_total_time,
                    backgroundColor: "rgba(221, 81, 130, .8)",
                    // borderColor: "rgba(221, 81, 130, 1)",
                    borderWidth: 1,
                },
                ],
            });
        } catch (error) {
            console.error("Error fetching data for Graph 3:", error);
        }
    };

    // Fetch Data for Graph 4
    const fetchData4 = async (month, year) => {
        const token = getToken();
        try {
            const response = await fetch(`${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT}/graphs/user_sessions_per_month/${year}/${month}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setData4({
                labels: data.date,
                datasets: [
                    {
                        type: "line",
                        label: "No of Users",
                        data: data.number_of_users,
                        backgroundColor: "rgba(255, 166, 0, 1)",
                        fill:false,
                        borderColor: "rgba(255, 166, 0, 1)",
                        borderWidth: 1,
                        yAxisID: "y2",
                        tension: 0,
                        spanGaps: true,
                    },
                    {
                        type: "bar",
                        label: "No of Hours",
                        data: data.number_of_hours,
                        // backgroundColor: "rgba(0, 255, 0, 0.2)",
                        backgroundColor: "rgba(68, 78, 134, 1)",
                        // borderColor: "rgba(0, 255, 0, 1)",
                        borderWidth: 1,
                        yAxisID: "y1",
                    },                
                ],
            });
        } catch (error) {
            console.error("Error fetching data for Graph 4:", error);
        }
    };

    // Fetch Data for Graph 5
    const fetchData5 = async (month, year) => {
        const token = getToken();
        try {
            const response = await fetch(`${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT}/graphs/file_loading_metrics_per_month/${year}/${month}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setData5({
                labels: data.file_name,
                datasets: [
                    {
                        label: "Image extraction time",
                        data: data.image_extraction_time,
                        backgroundColor: "#003f5c",
                        borderWidth: 1,
                    },
                    {
                        label: "Table extraction time",
                        data: data.table_extraction_time,
                        backgroundColor: "#444e86",
                        borderWidth: 1,
                    },
                    {
                        label: "Vision description time",
                        data: data.vision_description_time,
                        backgroundColor: "#955196",
                        borderWidth: 1,
                    },
                    {
                        label: "Total chunk creation time",
                        data: data.total_chunk_creation_time,
                        backgroundColor: "#dd5182",
                        borderWidth: 1,
                    },
                    {
                        label: "Embedding model time",
                        data: data.embedding_model_time,
                        backgroundColor: "#ff6e54",
                        borderWidth: 1,
                    },
                    {
                        label: "Milvus chunk load time",
                        data: data.table_extraction_time,
                        backgroundColor: "#ffa600",
                        borderWidth: 1,
                    },
                ],
            });
        } catch (error) {
            console.error("Error fetching data for Graph 2:", error);
        }
    };
  
    // Fetch Data for Graph 6
    const fetchData6 = async (month, year) => {
        const token = getToken();
        try {
            const response = await fetch(`${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT}/graphs/file_loading_metrics_per_month/${year}/${month}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            // Convert keys to labels with spaces
            const categories = Object.keys(data).map(key => key.replace(/_/g, ' '));
            // Total time for each category
            const totalTimes = Object.keys(data).map(key => data[key].reduce((sum, val) => sum + val, 0));
            // grand total time
            const grandTotal = totalTimes.reduce((sum, val) => sum + val, 0);
            // percentage for each category
            const percentages = totalTimes.map(time => ((time / grandTotal) * 100).toFixed(2));
            // Update the chart dataset
            setData6({
                labels: categories, 
                datasets: [
                    {
                        label: "Loading Component Utilization",
                        data: totalTimes,  
                        backgroundColor: [
                            "rgba(0, 63, 92, 0.6)",
                            "rgba(68, 78, 134, 0.6)",
                            "rgba(149, 81, 150, 0.6)",
                            "rgba(221, 81, 130, 0.6)",
                            "rgba(255, 110, 84, 0.6)",
                            "rgba(255, 166, 0, 0.6)",  
                        ],
                        borderColor: [
                            "rgba(0, 63, 92, 1)",
                            "rgba(68, 78, 134, 1)",
                            "rgba(149, 81, 150, 1)",
                            "rgba(221, 81, 130, 1)",
                            "rgba(255, 110, 84, 1)",
                            "rgba(255, 166, 0, 1)",
                        ],
                        hoverBackgroundColor: [
                            "rgba(0, 63, 92, 1)",
                            "rgba(68, 78, 134, 1)",
                            "rgba(149, 81, 150, 1)",
                            "rgba(221, 81, 130, 1)",
                            "rgba(255, 110, 84, 1)",
                            "rgba(255, 166, 0, 1)",
                        ],
                        borderWidth: 1
                        

                    },
                ],
            });
        } catch (error) {
            console.error("Error fetching data for Graph 6:", error);
        }
    };
    
    // Fetch Data for Graph 7
    const fetchData7 = async (month, year) => {
        const token = getToken();
        try {
            const response = await fetch(`${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT}/graphs/query_generator_metrics_per_month/${year}/${month}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setData7({
                labels: data.query_name,
                datasets: [
                    {
                        label: "Query vector creation time",
                        data: data.query_vector_creation_time,
                        backgroundColor: "#003f5c",
                        borderWidth: 1,
                    },
                    {
                        label: "Query rephrase time",
                        data: data.query_rephrase_time,
                        backgroundColor: "#444e86",
                        borderWidth: 1,
                    },
                    {
                        label: "Relevant chunks retrieve time",
                        data: data.relevant_chunks_retrieve_time,
                        backgroundColor: "#955196",
                        borderWidth: 1,
                    },
                    {
                        label: "llm response generation time",
                        data: data.llm_response_generation_time,
                        backgroundColor: "#dd5182",
                        borderWidth: 1,
                    },
                ],
            });
        } catch (error) {
            console.error("Error fetching data for Graph 2:", error);
        }
    };

    // Fetch Data for Graph 8
    const fetchData8 = async (month, year) => {
        const token = getToken();
        try {
            const response = await fetch(`${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT}/graphs/query_generator_metrics_per_month/${year}/${month}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
             const data = await response.json();
            // Convert keys to labels with spaces
            const categories = Object.keys(data).map(key => key.replace(/_/g, ' '));
            // Total time for each category
            const totalTimes = Object.keys(data).map(key => data[key].reduce((sum, val) => sum + val, 0));
            // grand total time
            const grandTotal = totalTimes.reduce((sum, val) => sum + val, 0);
            // percentage for each category
            const percentages = totalTimes.map(time => ((time / grandTotal) * 100).toFixed(2));

            // Update the chart dataset
            setData8({
                labels: categories, 
                datasets: [
                    {
                        label: "Qurey Component Utilization",
                        data: totalTimes,  
                        backgroundColor: [
                            "rgba(0, 63, 92, 0.6)",
                            "rgba(68, 78, 134, 0.6)",
                            "rgba(149, 81, 150, 0.6)",
                            "rgba(221, 81, 130, 0.6)",
                        ],
                        borderColor: [
                            "rgba(0, 63, 92, 1)",
                            "rgba(68, 78, 134, 1)",
                            "rgba(149, 81, 150, 1)",
                            "rgba(221, 81, 130, 1)",
                        ],
                        hoverBackgroundColor: [
                            "rgba(0, 63, 92, 1)",
                            "rgba(68, 78, 134, 1)",
                            "rgba(149, 81, 150, 1)",
                            "rgba(221, 81, 130, 1)",
                        ],
                        borderWidth: 1
                        

                    },
                ],
            });
        } catch (error) {
            console.error("Error fetching data for Graph 6:", error);
        }
    };

    // Fetch Data for Graph 9
    const fetchData9 = async (month, year) => {
        const token = getToken();
        try {
            const response = await fetch(`${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT}/graphs/file_upload_metrics_per_month/${year}/${month}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setData9({
                labels: data.file_name,
                datasets: [
                    {
                        type: "line",
                        label: "Insertion Time",
                        data: data.insertion_time,
                        backgroundColor: "rgba(255, 224, 230, 1)",
                        borderColor: "rgba(255, 224, 230, 1)",
                        borderWidth: 1,
                        yAxisID: "y1",
                    },
                    {
                        type: "bar",
                        label: "No of Chunks",
                        data: data.chunks,
                        backgroundColor: "rgba(45, 115, 115, 1)",
                        fill:true,
                        // borderColor: "rgba(75, 192, 192, 1)",
                        borderWidth: 1,
                        yAxisID: "y2",
                        pointRadius: 0, 
                        tension: 0.6, 
                    },
                ],
            });
        } catch (error) {
            console.error("Error fetching data for Graph 4:", error);
        }
    };   

    // Fetch Data for Graph 10
    const fetchData10 = async (month, year) => {
        const token = getToken();
        try {
          const response = await fetch(`${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT}/graphs/vector_search_time_per_month/${year}/${month}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setData10({
                labels: data.date,
                datasets: [
                {
                    label: "Vector Search Retrieval Time",
                    data: data.vector_search_retrieval_time,
                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                    tension: 0.4,
                },
                ],
            });
        } catch (error) {
            console.error("Error fetching data for Graph:", error);
        }
    };
    
    // Fetch Data for Graph 11
    const fetchData11 = async (month, year) => {
        const token = getToken();
        try {
            const response = await fetch(`${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT}/graphs/file_type_count/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            const labels = Object.keys(data); // ["pdf", "docx", "xlsv", "pptx"]
            const values = Object.values(data); // [100, 70, 202, 96]
              
        setData11({
            labels:labels,
            // labels: response.format,
            datasets: [
                {
                    label: "File format distribution",
                    data: values,
                    backgroundColor: [
                        "rgba(255, 99, 132, 0.6)",
                        "rgba(45, 172, 162, 0.6)", 
                        "rgba(54, 162, 235, 0.6)", 
                        "rgba(255, 206, 86, 0.6)", 
                        "rgba(75, 192, 192, 0.6)",
                        "rgba(150, 182, 182, 0.6)",    
                    ],
                    borderColor: [
                        "rgba(255, 99, 132, 1)",
                        "rgba(45, 172, 162, 1)",
                        "rgba(54, 162, 235, 1)",
                        "rgba(255, 206, 86, 1)",
                        "rgba(75, 192, 192, 1)",
                        "rgba(150, 182, 182, 1)",   
                    ],
                    hoverBackgroundColor: [
                        "rgba(255, 99, 132, 1)",
                        "rgba(45, 172, 162, 1)",
                        "rgba(54, 162, 235, 1)",
                        "rgba(255, 206, 86, 1)",
                        "rgba(75, 192, 192, 1)",
                        "rgba(150, 182, 182, 1)",    
                    ],
                    borderWidth: 1,
                },
            ],
        });
        } catch (error) {
            console.error("Error fetching data for Graph 11:", error);
        }
    };

     // Fetch Data for Graph 12
     const fetchData12 = async (month, year) => {
        const token = getToken();
        try {
           const response = await fetch(`${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT}/graphs/images_metrics_per_month/${year}/${month}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setData12({
                labels: data.date,
                datasets: [
                    {
                        type: "line",
                        label: "no_of_images_inserted",
                        data: data.no_of_images_inserted,
                        backgroundColor: "rgba(255, 166, 0, 1)",
                        fill: false,
                        borderColor: "rgba(255, 166, 0, 1)",
                        borderWidth: 1,
                        tension: 0.4,
                    },
                    {
                        type: "line",
                        label: "no_of_images_retrieved",
                        data: data.no_of_images_retrieved,
                        backgroundColor: "rgba(68, 78, 134, 1)",
                        fill: false,
                        borderColor: "rgba(68, 78, 134, 1)",
                        borderWidth: 1,
                        tension: 0.4,
                    },
                ],
            });
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };   
    
    // Fetch Data for Graph 13
    const fetchData13 = async (month, year) => {
        const token = getToken();
        try {
           const response = await fetch(`${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT}/graphs/llm_cost_metrics_per_month/${year}/${month}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setData13({
                labels: data.date,
                datasets: [
                    {
                        type: "line",
                        label: "Query cost",
                        data: data.query_cost,
                        backgroundColor: "rgba(172, 23, 26, 1)",
                        fill: false,
                        borderColor: "rgba(172, 23, 26, 1)",
                        borderWidth: 1,
                        tension: 0.4,
                    },
                    {
                        type: "line",
                        label: "Loading cost",
                        data: data.loading_cost,
                        backgroundColor: "rgba(175, 220, 143, 1)",
                        fill: false,
                        borderColor: "rgba(175, 220, 143, 1)",
                        borderWidth: 1,
                        tension: 0.4,
                    },
                    {
                        type: "line",
                        label: "Total cost",
                        data: data.total_cost,
                        backgroundColor: "rgba(67, 148, 229, 1)",
                        fill: false,
                        borderColor: "rgba(67, 148, 229, 1)",
                        borderWidth: 1,
                        tension: 0.4,
                    },
                ],
            });
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

    // Fetch Data for Graph 14
    const fetchData14 = async (month, year) => {
        const token = getToken();
        try {
            const response = await fetch(`${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT}/graphs/llm_data_loading_metrics_per_month/${year}/${month}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setData14({
                labels: data.date,
                datasets: [
                    {
                        type: "line",
                        label: "Input tokens",
                        data: data.data_loading_input_tokens,
                        backgroundColor: "rgba(99, 189, 189, 1)",
                        fill: false,
                        borderColor: "rgba(99, 189, 189, 1)",
                        borderWidth: 1,
                        tension: 0.4,
                    },
                    {
                        type: "line",
                        label: "Output tokens",
                        data: data.data_loading_output_tokens,
                        backgroundColor: "rgba(175, 220, 143, 1)",
                        fill: false,
                        borderColor: "rgba(175, 220, 143, 1)",
                        borderWidth: 1,
                        tension: 0.4,
                    },
                    {
                        type: "line",
                        label: "Total tokens",
                        data: data.data_loading_total_tokens,
                        backgroundColor: "rgba(67, 148, 229, 1)",
                        fill: false,
                        borderColor: "rgba(67, 148, 229, 1)",
                        borderWidth: 1,
                        tension: 0.4,
                    },
                ],
            });
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

    // Fetch Data for Graph 15
    const fetchData15 = async (month, year) => {
        const token = getToken();
        try {
            const response = await fetch(`${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT}/graphs/llm_query_rephrasing_metrics_per_month/${year}/${month}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json()
            setData15({
                labels: data.date,
                datasets: [
                    {
                        type: "line",
                        label: "Input tokens",
                        data: data.rephrased_query_input_tokens,
                        backgroundColor: "rgba(99, 189, 189, 1)",
                        fill: false,
                        borderColor: "rgba(99, 189, 189, 1)",
                        borderWidth: 1,
                        tension: 0.4,
                    },
                    {
                        type: "line",
                        label: "Output tokens",
                        data: data.rephrased_query_output_tokens,
                        backgroundColor: "rgba(175, 220, 143, 1)",
                        fill: false,
                        borderColor: "rgba(175, 220, 143, 1)",
                        borderWidth: 1,
                        tension: 0.4,
                    },
                    {
                        type: "line",
                        label: "Total tokens",
                        data: data.rephrased_query_total_tokens,
                        backgroundColor: "rgba(67, 148, 229, 1)",
                        fill: false,
                        borderColor: "rgba(67, 148, 229, 1)",
                        borderWidth: 1,
                        tension: 0.4,
                    },
                ],
            });
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

    // Fetch Data for Graph 16
    const fetchData16 = async (month, year) => {
        const token = getToken();
        try {
           const response = await fetch(`${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT}/graphs/llm_query_generation_metrics_per_month/${year}/${month}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setData16({
                labels: data.date,
                datasets: [
                    {
                        type: "line",
                        label: "Input tokens",
                        data: data.llm_generation_input_tokens,
                        backgroundColor: "rgba(99, 189, 189, 1)",
                        fill: false,
                        borderColor: "rgba(99, 189, 189, 1)",
                        borderWidth: 1,
                        tension: 0.4,
                    },
                    {
                        type: "line",
                        label: "Output tokens",
                        data: data.llm_generation_output_tokens,
                        backgroundColor: "rgba(175, 220, 143, 1)",
                        fill: false,
                        borderColor: "rgba(175, 220, 143, 1)",
                        borderWidth: 1,
                        tension: 0.4,
                    },
                    {
                        type: "line",
                        label: "Total tokens",
                        data: data.llm_generation_total_tokens,
                        backgroundColor: "rgba(67, 148, 229, 1)",
                        fill: false,
                        borderColor: "rgba(67, 148, 229, 1)",
                        borderWidth: 1,
                        tension: 0.4,
                    },
                ],
            });
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };   

    useEffect(() => {
        fetchData1(filters.graph1.month, filters.graph1.year);
        fetchData2(filters.graph2.month, filters.graph2.year);
        fetchData3(filters.graph3.month, filters.graph3.year);
        fetchData4(filters.graph4.month, filters.graph4.year);
        fetchData5(filters.graph5.month, filters.graph5.year);
        fetchData6(filters.graph6.month, filters.graph6.year);
        fetchData7(filters.graph7.month, filters.graph7.year);
        fetchData8(filters.graph8.month, filters.graph8.year);
        fetchData9(filters.graph9.month, filters.graph9.year);
        fetchData10(filters.graph10.month, filters.graph10.year);
        fetchData11(filters.graph11.month, filters.graph11.year);
        fetchData12(filters.graph12.month, filters.graph12.year);
        fetchData13(filters.graph13.month, filters.graph13.year);
        fetchData14(filters.graph14.month, filters.graph14.year);
        fetchData15(filters.graph15.month, filters.graph15.year);
        fetchData16(filters.graph16.month, filters.graph16.year);
    }, [filters]);

    const FilterDropdowns = ({ graphId }) => (
        <div className="flex justify-end gap-1">
            <select
                className="bg-gray-700 text-white px-5 pb-0.5 pt-0.5 rounded text-xs"
                value={filters[graphId].month}
                onChange={(e) => handleFilterChange(graphId, 'month', e.target.value)}
            >
                {months.map(month => {
                    // Disable future months if the selected year is the current year
                    const isDisabled = filters[graphId].year === currentYear && month.value > currentMonth;
                    return (
                        <option key={month.value} value={month.value} disabled={isDisabled}>
                            {month.label}
                        </option>
                    );
                })}
            </select>
    
            <select
                className="bg-gray-700 text-white px-5 pb-0.5 pt-0.5 rounded text-xs"
                value={filters[graphId].year}
                onChange={(e) => handleFilterChange(graphId, 'year', e.target.value)}
            >
                {years
                    .filter(year => year <= currentYear) // Only show the current and past years
                    .map(year => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
            </select>
        </div>
    );
    
    
    return (
        <div className="w-[80%] m-2">
            <div className="flex justify-start space-x-0.5 border-gray-800">
                {["Cumulative", "Machine Learning", "Database", "LLM"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => handleTabClick(tab)}
                        className={`px-6 py-1 text-lg font-semibold ${
                            activeTab === tab
                                ? "border-b-4 border-blue-500 text-white bg-gray-700"
                                : "text-black bg-slate-300"
                        } hover:text-white transition-colors`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="mt-2 p-2 bg-black text-white rounded-lg shadow-md h-[100%] " >
                {activeTab === "Cumulative" && (
                    <div className="container flex flex-wrap gap-4 ">
                        <div className="metric w-[48%] h-[50%]">
                            <FilterDropdowns graphId="graph1" />
                            {data1 ? <Line data={data1} options={options} /> : <p>Loading...</p>}
                        </div>
                        <div className="metric w-[48%] h-[50%] ">
                            <FilterDropdowns graphId="graph2" />
                            {data2 ? <Bar data={data2} options={options2} /> : <p>Loading...</p>}
                        </div>
                        <div className="metric w-[48%] h-[50%] ">
                            <FilterDropdowns graphId="graph3" />
                            {data3 ? <Bar data={data3} options={options3} /> : <p>Loading...</p>}
                        </div>
                        <div className="metric w-[48%] h-[50%] ">
                            <FilterDropdowns graphId="graph4" />
                            {data4 ? <Bar data={data4} options={options4} /> : <p>Loading...</p>}
                        </div>
                    </div>
                )}

                {activeTab === "LLM" && (
                    <div className="container flex flex-wrap gap-4 ">
                        <div className="metric w-[48%] h-[50%]">
                            <FilterDropdowns graphId="graph13" />
                            {data13 ? <Line data={data13} options={options13} /> : <p>Loading...</p>}
                        </div>

                        <div className="metric w-[48%] h-[50%]">
                            <FilterDropdowns graphId="graph14" />
                            {data14 ? <Line data={data14} options={options14} /> : <p>Loading...</p>}
                        </div>

                        <div className="metric w-[48%] h-[50%]">
                            <FilterDropdowns graphId="graph15" />
                            {data15 ? <Line data={data15} options={options15} /> : <p>Loading...</p>}
                        </div>

                        <div className="metric w-[48%] h-[50%]">
                            <FilterDropdowns graphId="graph16" />
                            {data16 ? <Line data={data16} options={options16} /> : <p>Loading...</p>}
                        </div>

                    </div>
                )}

                {activeTab === "Machine Learning" && ( 
                    <div className="container flex flex-wrap gap-4">
                        
                        <div className="metric w-[48%] h-[50%] ">
                            <FilterDropdowns graphId="graph5" />
                            {data5 ? <Bar data={data5} options={options5} /> : <p>Loading...</p>}
                        </div>
                        
                        <div className="metric w-[420px] h-[235px]">
                            <FilterDropdowns graphId="graph6" />
                            {data6 ? <Pie data={data6} options={options6} /> : <p>Loading...</p>}
                        </div>

                        <div className="metric w-[48%] h-[50%] ">
                            <FilterDropdowns graphId="graph7" />
                            {data7 ? <Bar data={data7} options={options7} /> : <p>Loading...</p>}
                        </div>

                        <div className="metric w-[420px] h-[235px]">
                            <FilterDropdowns graphId="graph8" />
                            {data8 ? <Pie data={data8} options={options8} /> : <p>Loading...</p>}
                        </div>

                    </div> 
                )}

                {activeTab === "Database" && ( 
                    <div className="container flex flex-wrap gap-4">

                        <div className="metric w-[48%] h-[50%]">
                            <FilterDropdowns graphId="graph9" />
                            {data9 ? <Bar data={data9} options={options9} /> : <p>Loading...</p>}
                        </div>

                        <div className="metric w-[48%] h-[50%]">
                            <FilterDropdowns graphId="graph10" />
                            {data10 ? <Line data={data10} options={options10} /> : <p>Loading...</p>}
                        </div>

                        <div className="metric w-[48%] h-[250px]">
                            {/* <FilterDropdowns graphId="graph11" /> */}
                            {data11 ? <Doughnut data={data11} options={options11} /> : <p>Loading...</p>}
                        </div>

                        <div className="metric w-[48%] h-[50%] ">
                            <FilterDropdowns graphId="graph12" />
                            {data12 ? <Line data={data12} options={options12} /> : <p>Loading...</p>}
                        </div>

                    </div> 
                )}  
            </div>
        </div>
    );
};

export default Metrics;