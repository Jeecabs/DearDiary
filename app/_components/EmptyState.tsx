import React from "react";
import { motion } from "framer-motion";

const JournalInterface = () => {
  return (
    <div className="min-h-screen ">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="h-screen flex flex-col items-center justify-center text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6,
              delay: 0.5,
              ease: "easeOut"
            }}
          >
            <h2 className="text-3xl text-gray-800">
              Hey Helen,
              <br />
              how are you feeling today?
            </h2>
          </motion.div>
          
          <motion.p
            className="text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6,
              delay: 0.7,
              ease: "easeOut"
            }}
          >
            Start your first journal entry
          </motion.p>
        </div>
      </div>
    </div>
  );
};

export default JournalInterface;