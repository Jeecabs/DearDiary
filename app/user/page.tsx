'use client'

import { NextPage } from 'next';
import {dummyDeepgramResponse3} from './../types/data'
import { useJournalStore } from '../_store/journalStore';
import UserComponent from '../_components/UserPage';

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
    // const entries = useJournalStore((state) => state.entries);
    // console.log('entries: ', entries);



    // const sentimentScores = collectSentimentScores(dummyDeepgramResponse3.entries);

    // console.log(sentimentScores);



    return (
        <UserComponent/>
    );
};

export default Page;