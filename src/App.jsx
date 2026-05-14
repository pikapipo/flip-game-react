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
  "/cards/f4.jpg",
  "/cards/duck.png",
];

function App() {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [disabled, setDisabled] = useState(false);

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
  };

  useEffect(() => {
    shuffleCards();
  }, []);

  const handleFlip = (card) => {
    if (
      disabled ||
      flippedCards.length === 2 ||
      flippedCards.includes(card.id) ||
      matchedCards.includes(card.image)
    ) {
      return;
    }

    const updated = [...flippedCards, card.id];
    setFlippedCards(updated);

    if (updated.length === 2) {
      setDisabled(true);

      const firstCard = cards.find((c) => c.id === updated[0]);
      const secondCard = cards.find((c) => c.id === updated[1]);

      if (firstCard.image === secondCard.image) {
        setMatchedCards((prev) => [...prev, firstCard.image]);

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

      {win && <div className="win-text">YOU WIN !</div>}

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
