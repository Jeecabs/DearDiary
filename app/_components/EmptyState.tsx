import React from "react";
import { Lora } from "next/font/google";

const lora = Lora({ subsets: ["latin"] });

const JournalInterface = () => {
  return (
    <div className={`min-h-screen bg-gray-50 ${lora.className}`}>
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="h-[70vh] flex flex-col items-center justify-center text-center space-y-4">
          <h2 className="text-3xl text-gray-800">
            Hey Helen,
            <br />
            how are you feeling today?
          </h2>
          <p className="text-gray-600">Start your first journal entry</p>
        </div>
      </div>
    </div>
  );
};

export default JournalInterface;
