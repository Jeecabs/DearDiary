'use client'

import { NextPage } from 'next';
import ConfidenceDistributionChart from './../../components/ui/charts/ConfidenceDistributionChart';
import WordFrequencyChart from './../../components/ui/charts/WordFrequencyChart';
import ConfidenceOverTimeChart from './../../components/ui/charts/ConfidenceOverTimeChart';
import {dummyDeepgramResponse} from './../types/data'

const Page: NextPage = () => {

    const {words} = dummyDeepgramResponse.alternatives[0];

    return (
        <div style={{ padding: '10px' }}>
            <h1>Reports</h1>
            <div style={{ marginBottom: '20px' }}>
                <ConfidenceDistributionChart words={words} />
            </div>
            <div style={{ marginBottom: '20px' }}>
                <WordFrequencyChart words={words} />
            </div>
            <div style={{ marginBottom: '20px' }}>
                <ConfidenceOverTimeChart words={words} />
            </div>
        </div>
    );
};

export default Page;