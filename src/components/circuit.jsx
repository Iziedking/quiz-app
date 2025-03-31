import React, { useState } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs, updateDoc } from "firebase/firestore";

const Circuit = () => {
  const storedUserData = sessionStorage.getItem("userData");
  const userData = storedUserData ? JSON.parse(storedUserData) : null;

  const [recommendation, setRecommendation] = useState("");
  const [timeInCommunity, setTimeInCommunity] = useState("");
  const [earnings, setEarnings] = useState("");
  const [passionRating, setPassionRating] = useState(null);
  const [recommendRating, setRecommendRating] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userData) {
      setSuccessMessage("User data not found! Please complete the quiz first.");
      return;
    }

    try {
      const q = query(collection(db, "quizResponses"), where("email", "==", userData.email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];

        await updateDoc(userDoc.ref, {
          recommendation,
          timeInCommunity,
          earnings,
          passionRating,
          recommendRating,
        });

        setSuccessMessage("✅ Survey response submitted successfully!");
        setSubmitted(true);
        sessionStorage.removeItem("userData");

        // Show success message for 3 seconds, then show community section
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setSuccessMessage("⚠️ User quiz data not found! Please retake the quiz.");
      }
    } catch (error) {
      console.error("Error submitting survey:", error);
      setSuccessMessage("❌ Failed to submit survey. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-lg text-center">
        {!submitted ? (
          <>
            <h1 className="text-3xl font-bold mb-4 text-purple-700">
              Complete Circuit Community Survey
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                placeholder="How did you hear about Circuit Community and what's your motivation to Web3?"
                value={recommendation}
                onChange={(e) => setRecommendation(e.target.value)}
                className="p-2 w-full border rounded"
                required
              />
              <input
                type="text"
                placeholder="How long have you been in Circuit Community?"
                value={timeInCommunity}
                onChange={(e) => setTimeInCommunity(e.target.value)}
                className="p-2 w-full border rounded"
                required
              />
              <input
                type="text"
                placeholder="How much have you made from Circuit Community Updates?"
                value={earnings}
                onChange={(e) => setEarnings(e.target.value)}
                className="p-2 w-full border rounded"
                required
              />
              <label className="block text-gray-700">How would you rate your passion in Web3 (1-10)?</label>
              <div className="flex space-x-2 justify-center">
                {[...Array(10)].map((_, index) => (
                  <button
                    key={index + 1}
                    type="button"
                    onClick={() => setPassionRating(index + 1)}
                    className={`p-2 border rounded ${passionRating === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <label className="block text-gray-700">How would you recommend Circuit Community to a friend (1-10)?</label>
              <div className="flex space-x-2 justify-center">
                {[...Array(10)].map((_, index) => (
                  <button
                    key={index + 1}
                    type="button"
                    onClick={() => setRecommendRating(index + 1)}
                    className={`p-2 border rounded ${recommendRating === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <button type="submit" className="bg-blue-500 text-white p-2 w-full rounded cursor-pointer">
                Submit Survey
              </button>
            </form>
          </>
        ) : (
          <>
            {successMessage && (
              <div className="mt-4 p-3 bg-green-100 text-green-700 border border-green-400 rounded">
                {successMessage}
              </div>
            )}

            {/* Community Follow Section */}
            {!successMessage && (
              <>
                <h2 className="text-2xl font-bold mb-4 text-green-600">Thank You!</h2>
                <p className="text-gray-700 mb-4">
                  Follow Circuit channels for all your Web3 updates:
                </p>
                <ul className="text-blue-500 space-y-2">
                  <li>
                    <a href="https://x.com/Iziedking" target="_blank" rel="noopener noreferrer">Follow Iziedking (Circuit Founder)</a>
                  </li>
                  <li>
                    <a href="https://discord.gg/MqScgAqa" target="_blank" rel="noopener noreferrer">Join Circuit Discord</a>
                  </li>
                  <li>
                    <a href="https://t.me/crypto_circuitN" target="_blank" rel="noopener noreferrer">Join Circuit Telegram</a>
                  </li>
                  <li>
                    <a href="https://chat.whatsapp.com/J1mNirCGlxW7e04JYnM8e0" target="_blank" rel="noopener noreferrer">Join Circuit WhatsApp Community</a>
                  </li>
                </ul>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Circuit;
