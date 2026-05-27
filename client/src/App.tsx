import { useState, useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [started, setStarted] = useState(false);

  useEffect(() => {
    document.title = "Houzecheck Score App";
  }, []);

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />

      {!started ? (
        <div className="min-h-screen flex items-center justify-center bg-[#fffbed] px-4">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-lg p-6 md:p-10 text-center">

            {/* Logo */}
            <img
              src="/logo.webp"
              alt="Houzecheck Logo"
              className="w-28 md:w-36 mx-auto mb-6"
            />

            <h1 className="text-2xl md:text-3xl font-bold mb-4">
              Real-Time Rating & Score App
            </h1>

            <p className="text-gray-600 text-sm md:text-base mb-4">
              This app demonstrates real-time ratings using event-driven updates.
            </p>

            <div className="text-left text-gray-500 text-sm mb-6 space-y-1">
              <p>✔ Enter your name</p>
              <p>✔ Give rating (1–5)</p>
              <p>✔ See live updates instantly</p>
            </div>

            <button
              onClick={() => setStarted(true)}
              className="w-full md:w-auto bg-[#f7de8c] text-black px-6 py-2 rounded-lg font-semibold shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 ease-in-out"
            >
              Start App
            </button>
          </div>
        </div>
      ) : (
        <Dashboard />
      )}
    </>
  );
}

export default App;