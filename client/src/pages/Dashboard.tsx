import { useState, useRef, useEffect } from "react";
import { useSSE } from "../hooks/useSSE";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [name, setName] = useState("");
  const [joined, setJoined] = useState(false);
  const [rating, setRating] = useState<number | null>(null);

  // unique id for each tab or each user.
  const userId = useRef(Math.random().toString(36).substr(2, 9));

  const { average, totalScore, feed } = useSSE(userId.current);

  // Show the join notification to only other users
  useEffect(() => {
  if (!feed.length) return;

  const latest = feed[0];

  if (latest?.message?.includes("joined the group")) {
    toast.success(`${latest.message} ${latest.time ?? ""}`);
  }
}, [feed]);

  // Joining a new user to app dashboard updates
  const handleJoin = async () => {
    if (!name.trim()) return;

    setJoined(true);

    try {
      await fetch(`${process.env.REACT_APP_API_URL}/rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: name,
          userId: userId.current,
          isJoin: true,
        }),
      });
    } catch (error) {
      console.error("Join error:", error);
    }
  };

  // User adding a scrore between 1-5 [Like review system]
  const handleRating = async (value: number) => {
    setRating(value);

    try {
      await fetch(`${process.env.REACT_APP_API_URL}/rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: name,
          userId: userId.current,
          value,
        }),
      });
    } catch (error) {
      console.error("Rating error:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#fffbed]">

      <div className="w-full md:w-1/2 flex items-center justify-center border-b md:border-b-0 md:border-r p-4">

        <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm text-center">

          {!joined ? (
            <>
              <h2 className="text-xl font-bold mb-4">
                Enter Name
              </h2>

              <input
                className="border p-2 w-full mb-4 rounded focus:ring-2 focus:ring-yellow-300 focus:outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />

              <button
                onClick={handleJoin}
                className="w-full md:w-auto bg-[#f7de8c] text-black px-6 py-2 rounded-lg font-semibold shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 ease-in-out"

              >
                Join
              </button>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold mb-2">
                Hi {name}
              </h2>

              <p className="mb-3 text-gray-500">
                Give Score
              </p>

              <div className="flex gap-2 justify-center mb-4 flex-wrap">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => handleRating(n)}
                    className={`px-4 py-2 rounded ${
                      rating === n
                        ? "bg-[#f7de8c]"
                        : "bg-gray-200"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>

              {rating && (
                <p className="text-sm text-gray-600">
                  You gave score: <b>{rating}</b>
                </p>
              )}
            </>
          )}

        </div>
      </div>

      <div className="w-full md:w-1/2 p-4 md:p-6">

        <h1 className="text-xl md:text-2xl font-bold mb-4">
          Live Dashboard
        </h1>

        <div className="grid grid-cols-2 gap-4 mb-4">

          <div className="bg-white p-4 rounded-xl shadow text-center">
            <p className="text-gray-500 text-sm">Average</p>

            <p className="text-lg font-bold">
              {average.toFixed(2)}
            </p>

            <div className="w-full bg-gray-200 h-2 rounded mt-3 overflow-hidden">
              <div
                className={`h-full transition-all ${
                  average < 2
                    ? "bg-red-500"
                    : average < 4
                    ? "bg-yellow-400"
                    : "bg-green-500"
                }`}
                style={{ width: `${(average / 5) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow text-center">
            <p className="text-gray-500 text-sm">
              Total Score
            </p>

            <p className="text-lg font-bold">
              {totalScore}
            </p>
          </div>

        </div>

        {/* LIVE FEED */}
        <div className="bg-white p-4 rounded-xl shadow">

          <h2 className="font-bold mb-2">
            Live Feed
          </h2>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-2">

            {feed.map((item, i) => (
              <p
                key={i}
                className="text-sm border-b py-2 px-2 rounded-md bg-gray-50 hover:bg-gray-100 transition flex justify-between items-center"
              >
                <span className="font-medium text-gray-800 capitalize">
                  {item.message}
                </span>

                {item.time && (
                  <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                    • {item.time}
                  </span>
                )}
              </p>
            ))}

          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;