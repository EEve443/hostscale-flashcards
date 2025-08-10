import React, { useState } from 'react';

export default function App() {
  const [cards, setCards] = useState([
    { question: 'Qu’est-ce que HostScale ?', answer: 'Une plateforme d’optimisation Airbnb avec IA.' },
    { question: 'Outil utilisé pour le style ?', answer: 'Tailwind CSS' },
    { question: 'Framework front-end ?', answer: 'React + Vite' }
  ]);

  const [current, setCurrent] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const nextCard = () => {
    setShowAnswer(false);
    setCurrent((prev) => (prev + 1) % cards.length);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
        <h2 className="text-xl font-bold mb-4">
          {showAnswer ? cards[current].answer : cards[current].question}
        </h2>
        <button
          onClick={() => setShowAnswer(!showAnswer)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {showAnswer ? 'Voir question' : 'Voir réponse'}
        </button>
        <button
          onClick={nextCard}
          className="ml-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Suivant
        </button>
      </div>
    </div>
  );
}
