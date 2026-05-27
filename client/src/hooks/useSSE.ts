import { useEffect, useState } from "react";

export const useSSE = (userId: string) => {
  const [average, setAverage] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [feed, setFeed] = useState<string[]>([]);

  useEffect(() => {
    const eventSource = new EventSource(
      `${process.env.REACT_APP_API_URL}/events?userId=${userId}`
    );

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      setAverage(data.average);
      setTotalScore(data.totalScore);

      if (data.message) {
        setFeed((prev) => [data.message, ...prev].slice(0, 10));
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [userId]);

  return { average, totalScore, feed };
};