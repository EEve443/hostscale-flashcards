import React, { useState } from "react";
import "./index.css";

const cardsData = [
  { question: "Capital de la France ?", answer: "Paris" },
  { question: "2 + 2", answer: "4" },
  { question: "Langage utilisé pour React ?", answer: "JavaScript" },
];

export default function App() {
  const [currentCard, setCurrentCard] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  const nextCard = () => {
    setFlipped(false);
    setCurrentCard((prev) => (prev + 1) % cardsData.length);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">🚀 MémoBoost</h1>

      <div
        className={`w-80 h-48 bg-white shadow-lg rounded-lg flex items-center justify-center text-xl font-semibold cursor-pointer transition-transform duration-500 ${
          flipped ? "rotate-y-180" : ""
        }`}
        style={{
          transformStyle: "preserve-3d",
          perspective: "1000px",
        }}
        onClick={handleFlip}
      >
        {flipped ? cardsData[currentCard].answer : cardsData[currentCard].question}
      </div>

      <button
        onClick={nextCard}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Carte suivante
      </button>
    </div>
  );
}
