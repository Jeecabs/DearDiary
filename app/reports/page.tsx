'use client'

import { NextPage } from 'next';
import ConfidenceDistributionChart from './../../components/ui/charts/ConfidenceDistributionChart';
import WordFrequencyChart from './../../components/ui/charts/WordFrequencyChart';
import ConfidenceOverTimeChart from './../../components/ui/charts/ConfidenceOverTimeChart';
import {dummyDeepgramResponse3} from './../types/data'
import { useEffect } from 'react';

function collectSentimentScores(entries) {
    return entries
      .filter(entry => entry.sentiment && entry.sentiment.segments) // Ensure sentiment and segments exist
      .map(entry => entry.sentiment.segments.map(segment => segment.sentiment_score)) // Map each segment's sentiment_score
      .flat(); // Flatten the nested arrays into a single array
  }
  

const Page: NextPage = () => {

    // const {words} = dummyDeepgramResponse.alternatives[0];
    // const {words} = dummyDeepgramResponse2.entries[1].sentiment
    // useEffect(() => {
    //     const storedWords = localStorage.getItem('deepgramWords');
    //     if (storedWords) {
    //         setWords(JSON.parse(storedWords));
    //     }
    // }, []);

    const sentimentScores = collectSentimentScores(dummyDeepgramResponse3.entries);

    console.log(sentimentScores);



    return (
        <div style={{ padding: '10px' }}>
            {/* <h1>Reports</h1>
            <div style={{ marginBottom: '20px' }}>
                <ConfidenceDistributionChart words={words} />
            </div>
            <div style={{ marginBottom: '20px' }}>
                <WordFrequencyChart words={words} />
            </div>
            <div style={{ marginBottom: '20px' }}>
                <ConfidenceOverTimeChart words={words} />
            </div> */}
        </div>
    );
};

export default Page;