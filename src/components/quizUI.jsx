import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const QuizUI = () => {
  const [email, setEmail] = useState(sessionStorage.getItem("email") || "");
  const [twitter, setTwitter] = useState(sessionStorage.getItem("twitter") || "");
  const [whatsapp, setWhatsapp] = useState(sessionStorage.getItem("whatsapp") || "");
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timer, setTimer] = useState(45);
  const [responses, setResponses] = useState(JSON.parse(sessionStorage.getItem("responses")) || []);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const questions = [
    { question: "What is a decentralized exchange (DEX)?", options: ["Uniswap", "Coinbase", "Binance", "Robinhood"], answer: "Uniswap" },
    { question: "What does DeFi stand for?", options: ["Decentralized Finance", "Digital Federation", "Dynamic Fees", "DeFi Network"], answer: "Decentralized Finance" },
    { question: "Which blockchain is most associated with DeFi?", options: ["Bitcoin", "Ethereum", "Solana", "Ripple"], answer: "Ethereum" },
    { question: "What is the purpose of a smart contract?", options: ["Automate transactions", "Store private keys", "Manage hardware", "Issue tokens"], answer: "Automate transactions" },
    { question: "What is yield farming?", options: ["Growing crops on-chain", "Earning rewards by staking liquidity", "Mining new coins", "Trading futures"], answer: "Earning rewards by staking liquidity" },
    { question: "What is a DAO?", options: ["Digital Asset Operation", "Decentralized Autonomous Organization", "Direct Access Overlay", "Data Allocation Office"], answer: "Decentralized Autonomous Organization" },
    { question: "What is the native token of Ethereum?", options: ["BTC", "ETH", "SOL", "BNB"], answer: "ETH" },
    { question: "Which of these is a stablecoin?", options: ["USDT", "ETH", "DOGE", "MATIC"], answer: "USDT" },
    { question: "What does 'staking' mean in crypto?", options: ["Holding tokens to support network security", "Mining new Bitcoin", "Swapping tokens", "Creating NFTs"], answer: "Holding tokens to support network security" },
    { question: "Which protocol enables borrowing and lending in DeFi?", options: ["Aave", "Coinbase", "OpenSea", "Binance"], answer: "Aave" },
  ];

  useEffect(() => {
    if (quizStarted && timer > 0) {
      const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(countdown);
    } else if (quizStarted && timer === 0) {
      handleSubmit();
    }
  }, [timer, quizStarted]);

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const startQuiz = () => {
    if (!email || !twitter || !whatsapp) {
      setError("Please fill in all fields.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Use a valid email.");
      return;
    }
    setError("");

    // Store user data in session storage
    sessionStorage.setItem("email", email);
    sessionStorage.setItem("twitter", twitter);
    sessionStorage.setItem("whatsapp", whatsapp);

    setQuizStarted(true);
  };

  const handleOptionSelect = (option) => {
    const updatedResponses = [...responses];
    updatedResponses[currentQuestion] = option;
    setResponses(updatedResponses);

    // Store responses in session storage
    sessionStorage.setItem("responses", JSON.stringify(updatedResponses));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    const filteredResponses = responses.filter((r) => r !== undefined);
    
    let score = 0;
    filteredResponses.forEach((response, index) => {
        if (response === questions[index].answer) {
            score += 1;
        }
    });
    
    const userData = {
      email,
      twitter,
      whatsapp,
      responses: filteredResponses,
      score,
      timestamp: new Date(),
    };

    try {
      await addDoc(collection(db, "quizResponses"), userData);
      sessionStorage.setItem("userData", JSON.stringify(userData)); // Store entire user data in sessionStorage

      setTimeout(() => navigate("/circuit"), 500);
    } catch (err) {
      console.error("Error submitting quiz:", err);
      setError("Submission failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-cover bg-center bg-[url('/src/assets/circuit-logo.png')] p-4">
      {!quizStarted ? (
        <div className="bg-white bg-opacity-80 p-8 rounded shadow-md w-full max-w-lg text-center">
          <h1 className="text-3xl font-bold mb-4 text-purple-700">Welcome to Circuit and Vibes Crypto Community Giveaway Quiz</h1>
          <p className="text-gray-700 mb-4">Complete the quiz for a chance to be selected for a giveaway.</p>
          <p className="text-blue-500 font-semibold mb-6">Good luck!</p>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="mb-2 p-2 w-full border rounded" />
          <input type="text" placeholder="Twitter Username" value={twitter} onChange={(e) => setTwitter(e.target.value)} className="mb-2 p-2 w-full border rounded" />
          <input type="text" placeholder="WhatsApp Username" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="mb-4 p-2 w-full border rounded" />
          <button onClick={startQuiz} className="bg-blue-500 text-white p-2 w-full rounded cursor-pointer">Start Quiz</button>
        </div>
      ) : (
        <div className="bg-white bg-opacity-90 p-8 rounded shadow-md w-full max-w-md text-center">
          <h2 className="text-2xl mb-4">{questions[currentQuestion].question}</h2>
          <div className="space-y-2">
            {questions[currentQuestion].options.map((option, index) => (
              <button key={index} onClick={() => handleOptionSelect(option)} className={`block w-full p-2 rounded ${responses[currentQuestion] === option ? "bg-blue-500 text-white" : "bg-gray-300"}`}>{option}</button>
            ))}
          </div>
          <p className="mt-4">Time left: {timer}s</p>
          <div className="flex justify-between mt-4">
            <button onClick={prevQuestion} className="bg-gray-400 text-white p-2 rounded cursor-pointer">Prev</button>
            {currentQuestion === questions.length - 1 ? (
              <button onClick={handleSubmit} className="bg-green-500 text-white p-2 rounded cursor-pointer">Submit</button>
            ) : (
              <button onClick={nextQuestion} className="bg-blue-500 text-white p-2 rounded cursor-pointer">Next</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizUI;
