'use client'

import { NextPage } from 'next';
import {dummyDeepgramResponse3} from './../types/data'

const user = {
    name: 'Helen Ramirez',
    age: 43, 
    startingWeight: 85

}


function collectSentimentScores(entries) {
    return entries
      .filter(entry => entry.sentiment && entry.sentiment.segments) // Ensure sentiment and segments exist
      .map(entry => entry.sentiment.segments.map(segment => segment.sentiment_score)) // Map each segment's sentiment_score
      .flat(); // Flatten the nested arrays into a single array
  }
  



const Page: NextPage = () => {

    const sentimentScores = collectSentimentScores(dummyDeepgramResponse3.entries);

    console.log(sentimentScores);



    return (
        <div style={{ padding: '10px' }}>
        </div>
    );
};

export default Page;