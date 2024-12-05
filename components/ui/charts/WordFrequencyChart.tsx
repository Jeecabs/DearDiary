import { useEffect } from 'react';
import Chart from 'chart.js/auto';

const WordFrequencyChart = ({ words }) => {
    useEffect(() => {
        const wordFrequency = words.reduce((acc, word) => {
            acc[word.word] = (acc[word.word] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        const ctx = document.getElementById('wordFrequency') as HTMLCanvasElement;
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(wordFrequency),
                datasets: [{
                    label: 'Word Frequency',
                    data: Object.values(wordFrequency),
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }, [words]);

    return <canvas id="wordFrequency" width="400" height="200"></canvas>;
};

export default WordFrequencyChart;