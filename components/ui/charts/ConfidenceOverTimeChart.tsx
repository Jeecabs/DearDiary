import { useEffect } from "react";
import Chart from "chart.js/auto";
import { WordSchema } from "../../../app/_schemas/deepgram";
import { z } from "zod";

const ConfidenceOverTimeChart = ({
  words,
}: {
  words: z.infer<typeof WordSchema>[];
}) => {
  useEffect(() => {
    const confidenceScores = words.map((word) => word.confidence);
    const timestamps = words.map((word) => word.start);
    const ctx = document.getElementById(
      "confidenceOverTime"
    ) as HTMLCanvasElement;
    new Chart(ctx, {
      type: "line",
      data: {
        labels: timestamps,
        datasets: [
          {
            label: "Confidence Over Time",
            data: confidenceScores,
            backgroundColor: "rgba(255, 159, 64, 0.2)",
            borderColor: "rgba(255, 159, 64, 1)",
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

  return <canvas id="confidenceOverTime" width="400" height="200"></canvas>;
};

export default ConfidenceOverTimeChart;
