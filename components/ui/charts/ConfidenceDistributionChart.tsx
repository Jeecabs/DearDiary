"use client";

import { useEffect } from "react";
import Chart from "chart.js/auto";
import { z } from "zod";
import { WordSchema } from "../../../app/_schemas/deepgram";

const ConfidenceDistributionChart = ({
  words,
}: {
  words: z.infer<typeof WordSchema>[];
}) => {
  useEffect(() => {
    const confidenceScores = words.map((word) => word.confidence);
    const ctx = document.getElementById(
      "confidenceDistribution"
    ) as HTMLCanvasElement;
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: confidenceScores,
        datasets: [
          {
            label: "Confidence Distribution",
            data: confidenceScores,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }, [words]);

  return <canvas id="confidenceDistribution" width="400" height="200"></canvas>;
};

export default ConfidenceDistributionChart;
