import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid3X3, Trophy, Play, RotateCcw, User, Bot } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { playClickSound, playSuccessSound } from '../utils/soundUtils';
import Confetti from 'react-confetti';

interface TicTacToeStats {
  wins: number;
  losses: number;
  draws: number;
  gamesPlayed: number;
}

type Player = 'X' | 'O' | null;
type Board = Player[];

interface TicTacToeGameProps {
  isEmbedded?: boolean;
}

const TicTacToeGame: React.FC<TicTacToeGameProps> = ({ isEmbedded = false }) => {
  const [gameStats, setGameStats] = useLocalStorage<TicTacToeStats>('ticTacToeStats', {
    wins: 0,
    losses: 0,
    draws: 0,
    gamesPlayed: 0
  });

  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);
  const [winningLine, setWinningLine] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];

  useEffect(() => {
    if (isPlaying && !isPlayerTurn && !winner) {
      const timer = setTimeout(() => {
        makeComputerMove();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, isPlaying, winner]);

  const checkWinner = (currentBoard: Board): { winner: Player | 'draw' | null, line: number[] } => {
    // Check for winning combinations
    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return { winner: currentBoard[a], line: combination };
      }
    }

    // Check for draw
    if (currentBoard.every(cell => cell !== null)) {
      return { winner: 'draw', line: [] };
    }

    return { winner: null, line: [] };
  };

  const startGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setWinner(null);
    setWinningLine([]);
    setIsPlaying(true);
    playClickSound();
  };

  const handleCellClick = (index: number) => {
    if (!isPlaying || board[index] || !isPlayerTurn || winner) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    playClickSound();

    const result = checkWinner(newBoard);
    if (result.winner) {
      endGame(result.winner, result.line);
    } else {
      setIsPlayerTurn(false);
    }
  };

  const makeComputerMove = () => {
    if (!isPlaying || winner) return;

    const availableMoves = board.map((cell, index) => cell === null ? index : null).filter(val => val !== null) as number[];
    
    if (availableMoves.length === 0) return;

    // Simple AI: Check if computer can win
    let bestMove = -1;
    
    // Check if computer can win
    for (const move of availableMoves) {
      const testBoard = [...board];
      testBoard[move] = 'O';
      const result = checkWinner(testBoard);
      if (result.winner === 'O') {
        bestMove = move;
        break;
      }
    }

    // Check if computer needs to block player
    if (bestMove === -1) {
      for (const move of availableMoves) {
        const testBoard = [...board];
        testBoard[move] = 'X';
        const result = checkWinner(testBoard);
        if (result.winner === 'X') {
          bestMove = move;
          break;
        }
      }
    }

    // Random move if no strategic move found
    if (bestMove === -1) {
      bestMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }

    const newBoard = [...board];
    newBoard[bestMove] = 'O';
    setBoard(newBoard);

    const result = checkWinner(newBoard);
    if (result.winner) {
      endGame(result.winner, result.line);
    } else {
      setIsPlayerTurn(true);
    }
  };

  const endGame = (gameWinner: Player | 'draw', line: number[]) => {
    setWinner(gameWinner);
    setWinningLine(line);
    setIsPlaying(false);

    const newStats = { ...gameStats, gamesPlayed: gameStats.gamesPlayed + 1 };

    if (gameWinner === 'X') {
      newStats.wins++;
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      playSuccessSound();
    } else if (gameWinner === 'O') {
      newStats.losses++;
      playClickSound();
    } else {
      newStats.draws++;
      playClickSound();
    }

    setGameStats(newStats);
  };

  const resetGame = () => {
    startGame();
  };

  const getCellContent = (index: number) => {
    const cell = board[index];
    if (cell === 'X') return '✕';
    if (cell === 'O') return '○';
    return '';
  };

  const getCellStyle = (index: number) => {
    const isWinningCell = winningLine.includes(index);
    const cell = board[index];
    
    let baseClasses = "w-20 h-20 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-4xl font-bold transition-all duration-200 ";
    
    if (cell === 'X') {
      baseClasses += isWinningCell ? "bg-green-200 dark:bg-green-800 text-green-600 dark:text-green-400" : "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400";
    } else if (cell === 'O') {
      baseClasses += isWinningCell ? "bg-green-200 dark:bg-green-800 text-green-600 dark:text-green-400" : "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400";
    } else {
      baseClasses += "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer";
    }

    return baseClasses;
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
      <div className="grid grid-cols-4 gap-3 text-center">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <div className="text-xl font-bold text-green-600 dark:text-green-400">
            {gameStats.wins}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 font-cairo">فوز</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <div className="text-xl font-bold text-red-600 dark:text-red-400">
            {gameStats.losses}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 font-cairo">هزيمة</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <div className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
            {gameStats.draws}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 font-cairo">تعادل</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
            {gameStats.gamesPlayed}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 font-cairo">ألعاب</div>
        </div>
      </div>

      {/* Current Turn */}
      {isPlaying && (
        <div className="text-center">
          <div className={`inline-flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-xl ${
            isPlayerTurn ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
          }`}>
            {isPlayerTurn ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            <span className="font-semibold font-cairo">
              {isPlayerTurn ? 'دورك (✕)' : 'دور الكمبيوتر (○)'}
            </span>
          </div>
        </div>
      )}

      {/* Game Board */}
      <div className="flex justify-center">
        <div className="grid grid-cols-3 gap-2 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
          {board.map((cell, index) => (
            <motion.button
              key={index}
              onClick={() => handleCellClick(index)}
              className={getCellStyle(index)}
              whileHover={!cell && isPlaying && isPlayerTurn ? { scale: 1.05 } : {}}
              whileTap={!cell && isPlaying && isPlayerTurn ? { scale: 0.95 } : {}}
              disabled={!isPlaying || !!cell || !isPlayerTurn}
            >
              {getCellContent(index)}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Game Result */}
      <AnimatePresence>
        {winner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`text-center p-4 rounded-xl font-semibold ${
              winner === 'X' 
                ? 'bg-success-100 dark:bg-success-900 text-success-700 dark:text-success-300'
                : winner === 'O'
                ? 'bg-error-100 dark:bg-error-900 text-error-700 dark:text-error-300'
                : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
            }`}
          >
            {winner === 'X' && '🎉 مبروك! فزت!'}
            {winner === 'O' && '😔 خسرت! حاول مرة أخرى'}
            {winner === 'draw' && '🤝 تعادل! لعبة جيدة'}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <div className="flex justify-center space-x-4 space-x-reverse">
        <button
          onClick={startGame}
          className="flex items-center space-x-2 space-x-reverse px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 font-cairo"
        >
          <Play className="w-5 h-5" />
          <span>{isPlaying ? 'لعبة جديدة' : 'ابدأ اللعب'}</span>
        </button>
        
        {isPlaying && (
          <button
            onClick={resetGame}
            className="flex items-center space-x-2 space-x-reverse px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 font-cairo"
          >
            <RotateCcw className="w-5 h-5" />
            <span>إعادة تشغيل</span>
          </button>
        )}
      </div>

      {/* Instructions */}
      {!isPlaying && (
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg p-4 font-cairo">
          العب ضد الكمبيوتر! أنت ✕ والكمبيوتر ○<br/>
          احصل على ثلاث علامات متتالية لتفوز
        </div>
      )}
    </div>
  );
};

export default TicTacToeGame;