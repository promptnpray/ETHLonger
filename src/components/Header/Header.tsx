import { useGameStore } from '../../context/GameContext';
import { formatCurrency } from '../../utils/calculations';
import { useBackgroundMusic } from '../../hooks/useBackgroundMusic';
import './Header.css';

export function Header() {
  const balance = useGameStore(state => state.balance);
  const gameOver = useGameStore(state => state.gameOver);
  const resetGame = useGameStore(state => state.resetGame);
  
  const { isPlaying, isMuted, toggleMusic } = useBackgroundMusic();

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">
          <span className="logo-icon">◈</span>
          <span className="logo-text">HYPERLONG</span>
        </div>
        <nav className="nav">
          <a href="#" className="nav-link active">Trade</a>
        </nav>
      </div>
      <div className="header-right">
        <button 
          className={`music-btn ${isPlaying ? 'playing' : ''}`}
          onClick={toggleMusic}
          title={isMuted ? 'Unmute music' : 'Mute music'}
        >
          {isMuted ? '🔇' : '🎵'}
        </button>
        <div className="wallet-info">
          <span className="wallet-label">Balance</span>
          <span className="wallet-balance">{formatCurrency(balance)}</span>
        </div>
        <div className="connection-status connected">
          <span className="status-dot"></span>
          Connected
        </div>
        {gameOver && (
          <button className="reset-btn" onClick={resetGame}>
            New Game
          </button>
        )}
      </div>
    </header>
  );
}
