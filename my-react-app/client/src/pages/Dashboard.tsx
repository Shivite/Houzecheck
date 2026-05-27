import { useState, useRef, useEffect } from "react";
import { useSSE } from "../hooks/useSSE";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [name, setName] = useState("");
  const [joined, setJoined] = useState(false);
  const [rating, setRating] = useState<number | null>(null);

  // unique id per tab
  const userId = useRef(Math.random().toString(36).substr(2, 9));

  const { average, totalScore, feed } = useSSE(userId.current);

  // SHOW TOAST ONLY FOR OTHER USERS
  useEffect(() => {
  if (!feed.length) return;

  const latest = feed[0];

  if (latest.includes("joined the group")) {
    toast.success(latest);
  }
}, [feed]);

  // JOIN
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

  // RATE
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

      {/* LEFT SIDE */}
      <div className="w-full md:w-1/2 flex items-center justify-center border-b md:border-b-0 md:border-r p-4">

        <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm text-center">

          {!joined ? (
            <>
              <h2 className="text-xl font-bold mb-4">
                Enter Name
              </h2>

              <input
                className="border p-2 w-full mb-4 rounded"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />

              <button
                onClick={handleJoin}
                className="bg-blue-500 hover:bg-blue-600 text-white w-full py-2 rounded"
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
                        ? "bg-green-500 text-white"
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

      {/* RIGHT SIDE */}
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

            {/* COLOR BAR */}
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

          <div className="space-y-2 max-h-64 overflow-y-auto">

            {feed.map((item, i) => (
              <p
                key={i}
                className="text-sm border-b py-1"
              >
                {item}
              </p>
            ))}

          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;