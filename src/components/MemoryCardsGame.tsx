import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Trophy, Play, Clock } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { playClickSound, playSuccessSound } from '../utils/soundUtils';
import Confetti from 'react-confetti';

interface MemoryGameStats {
  bestTime: number;
  gamesPlayed: number;
  bestMoves: number;
}

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryCardsGameProps {
  isEmbedded?: boolean;
}

const MemoryCardsGame: React.FC<MemoryCardsGameProps> = ({ isEmbedded = false }) => {
  const [gameStats, setGameStats] = useLocalStorage<MemoryGameStats>('memoryCardsStats', {
    bestTime: 0,
    gamesPlayed: 0,
    bestMoves: 0
  });

  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const emojis = ['🎯', '🎮', '🎨', '🎭', '🎪', '🎸', '🎺', '🎻'];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !gameWon) {
      interval = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, gameWon]);

  const initializeGame = () => {
    const shuffledEmojis = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false
      }));
    
    setCards(shuffledEmojis);
    setFlippedCards([]);
    setMoves(0);
    setTime(0);
    setIsPlaying(true);
    setGameWon(false);
    playClickSound();
  };

  const handleCardClick = (cardId: number) => {
    if (flippedCards.length === 2 || cards[cardId].isFlipped || cards[cardId].isMatched) {
      return;
    }

    playClickSound();
    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    setCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, isFlipped: true } : card
    ));

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      setTimeout(() => {
        const [firstId, secondId] = newFlippedCards;
        const firstCard = cards[firstId];
        const secondCard = cards[secondId];

        if (firstCard.emoji === secondCard.emoji) {
          setCards(prev => prev.map(card => 
            card.id === firstId || card.id === secondId 
              ? { ...card, isMatched: true }
              : card
          ));
          playSuccessSound();
        } else {
          setCards(prev => prev.map(card => 
            card.id === firstId || card.id === secondId 
              ? { ...card, isFlipped: false }
              : card
          ));
        }
        setFlippedCards([]);
      }, 1000);
    }
  };

  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.isMatched)) {
      setGameWon(true);
      setIsPlaying(false);
      
      const newStats = {
        ...gameStats,
        gamesPlayed: gameStats.gamesPlayed + 1
      };

      if (gameStats.bestTime === 0 || time < gameStats.bestTime) {
        newStats.bestTime = time;
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }

      if (gameStats.bestMoves === 0 || moves < gameStats.bestMoves) {
        newStats.bestMoves = moves;
      }

      setGameStats(newStats);
    }
  }, [cards]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={150}
        />
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {moves}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 font-cairo">حركات</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">
            {formatTime(time)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 font-cairo">وقت</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {gameStats.bestTime ? formatTime(gameStats.bestTime) : '-'}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 font-cairo">أفضل وقت</div>
        </div>
      </div>

      {/* Game Grid */}
      <div className="grid grid-cols-4 gap-3">
        {cards.map((card) => (
          <motion.button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`aspect-square rounded-lg text-3xl font-bold transition-all duration-300 ${
              card.isFlipped || card.isMatched
                ? 'bg-gradient-to-br from-purple-400 to-pink-400 text-white'
                : 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!isPlaying}
          >
            {card.isFlipped || card.isMatched ? card.emoji : '?'}
          </motion.button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex justify-center">
        <button
          onClick={initializeGame}
          className="flex items-center space-x-2 space-x-reverse px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors duration-200 font-cairo"
        >
          <Play className="w-5 h-5" />
          <span>لعبة جديدة</span>
        </button>
      </div>

      {/* Win Message */}
      {gameWon && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex items-center justify-center space-x-2 space-x-reverse bg-success-100 dark:bg-success-900 text-success-700 dark:text-success-300 rounded-lg p-4"
        >
          <Trophy className="w-6 h-6" />
          <span className="font-semibold text-lg">
            مبروك! أكملت اللعبة في {moves} حركة و {formatTime(time)}! 🎉
          </span>
        </motion.div>
      )}

      {/* Instructions */}
      {!isPlaying && (
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg p-4 font-cairo">
          اقلب البطاقات واعثر على الأزواج المتطابقة!<br/>
          حاول إنهاء اللعبة في أقل عدد حركات ووقت
        </div>
      )}
    </div>
  );
};

export default MemoryCardsGame;