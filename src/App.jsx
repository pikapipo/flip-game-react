import { useEffect, useState } from "react";
import "./App.css";

const images = [
  "/cards/pikachu.png",
  "/cards/squirtle.png",
  "/cards/chippy.png",
  "/cards/gengar.png",
  "/cards/charmander.png",
  "/cards/bul.png",
  "/cards/eevee.png",
  "/cards/snorlax.png",
];

function App() {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const remainingSeconds = (seconds % 60).toString().padStart(2, "0");

    return `${minutes}:${remainingSeconds}`;
  };

  const shuffleCards = () => {
    const duplicated = [...images, ...images];

    const shuffled = duplicated
      .sort(() => Math.random() - 0.5)
      .map((image, index) => ({
        id: index,
        image,
      }));

    setCards(shuffled);
    setFlippedCards([]);
    setMatchedCards([]);
    setElapsedTime(0);
    setTimerRunning(false);
  };

  useEffect(() => {
    shuffleCards();
  }, []);

  useEffect(() => {
    if (!timerRunning) {
      return;
    }

    const timer = window.setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [timerRunning]);

  const handleFlip = (card) => {
    if (
      disabled ||
      flippedCards.length === 2 ||
      flippedCards.includes(card.id) ||
      matchedCards.includes(card.image)
    ) {
      return;
    }

    if (!timerRunning) {
      setTimerRunning(true);
    }

    const updated = [...flippedCards, card.id];
    setFlippedCards(updated);

    if (updated.length === 2) {
      setDisabled(true);

      const firstCard = cards.find((c) => c.id === updated[0]);
      const secondCard = cards.find((c) => c.id === updated[1]);

      if (firstCard.image === secondCard.image) {
        setMatchedCards((prev) => {
          const nextMatchedCards = [...prev, firstCard.image];

          if (nextMatchedCards.length === images.length) {
            setTimerRunning(false);
          }

          return nextMatchedCards;
        });

        setTimeout(() => {
          setFlippedCards([]);
          setDisabled(false);
        }, 500);
      } else {
        setTimeout(() => {
          setFlippedCards([]);
          setDisabled(false);
        }, 900);
      }
    }
  };

  const isFlipped = (card) => {
    return flippedCards.includes(card.id) || matchedCards.includes(card.image);
  };

  const win = matchedCards.length === images.length;

  return (
    <div className="container">
      <h1>POKÉ MEMORY</h1>

      <button onClick={shuffleCards} className="restart-btn">
        RESTART
      </button>

      <div className="status-bar">
        <div className="timer">TIME: {formatTime(elapsedTime)}</div>
        {win && (
          <div className="win-text">YOU WIN! {formatTime(elapsedTime)}</div>
        )}
      </div>

      <div className="grid">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`card
              ${isFlipped(card) ? "flipped" : ""}
              ${matchedCards.includes(card.image) ? "matched" : ""}
            `}
            onClick={() => handleFlip(card)}
          >
            <div className="inner">
              <div className="front">
                <img src="/cards/pokemon.png" alt="" />
              </div>

              <div className="back">
                <img src={card.image} alt="" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
