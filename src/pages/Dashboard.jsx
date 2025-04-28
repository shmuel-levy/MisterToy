import { useEffect, useState } from 'react'
import { Chart } from '../cmps/Chart.jsx'
import { toyService } from '../services/toy.service-remote.js'
import React from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

export function Dashboard() {
    const [toys, setToys] = useState([])
    const [labelStats, setLabelStats] = useState([])
    const [priceStats, setPriceStats] = useState([])
    const [inventoryStats, setInventoryStats] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadToys()
        loadStats()
    }, [])

    function loadToys() {
        toyService.query()
            .then(response => {
                setToys(response.toys || [])
            })
            .catch(err => {
                console.error('Error loading toys:', err)
            })
    }

    function loadStats() {
        setIsLoading(true)
        
        // Load label stats
        toyService.getLabelStats()
            .then(setLabelStats)
            .catch(err => {
                console.error('Error loading label stats:', err)
            })
        
        // Load price stats
        toyService.getPriceStats()
            .then(setPriceStats)
            .catch(err => {
                console.error('Error loading price stats:', err)
            })
        
        // Load inventory stats
        toyService.getInventoryStats()
            .then(setInventoryStats)
            .catch(err => {
                console.error('Error loading inventory stats:', err)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    // Prepare pie chart data
    const labelData = {
        labels: labelStats.map(s => s.title),
        datasets: [
            {
                label: 'Label Distribution',
                data: labelStats.map(s => s.value),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(199, 199, 199, 0.2)',
                    'rgba(83, 102, 255, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(199, 199, 199, 1)',
                    'rgba(83, 102, 255, 1)',
                ],
                borderWidth: 1,
            },
        ],
    }

    const inventoryData = {
        labels: inventoryStats.map(s => s.title),
        datasets: [
            {
                label: 'In Stock Percentage',
                data: inventoryStats.map(s => s.value),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(199, 199, 199, 0.2)',
                    'rgba(83, 102, 255, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(199, 199, 199, 1)',
                    'rgba(83, 102, 255, 1)',
                ],
                borderWidth: 1,
            },
        ],
    }

    return (
        <section className="dashboard">
            <h1>Dashboard</h1>
            <h2>Statistics for {toys.length} Toys</h2>

            {isLoading ? (
                <div className="loading">Loading stats...</div>
            ) : (
                <div className="dashboard-content">
                    <div className="chart-container">
                        <h3>Label Distribution</h3>
                        <Pie data={labelData} />
                    </div>

                    <div className="chart-container">
                        <h3>Inventory by Label</h3>
                        <Pie data={inventoryData} />
                    </div>

                    <div className="chart-container">
                        <h3>Price by Label</h3>
                        <Chart data={priceStats} />
                    </div>

                    <div className="chart-container">
                        <h3>Label Popularity</h3>
                        <Chart data={labelStats} />
                    </div>
                </div>
            )}
        </section>
    )
}