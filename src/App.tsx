import { Header } from './components/Header/Header';
import { MarketList } from './components/MarketList/MarketList';
import { Chart } from './components/Chart/Chart';
import { OrderPanel } from './components/OrderPanel/OrderPanel';
import { Positions } from './components/Positions/Positions';
import { Toast } from './components/common/Toast';
import { usePriceSimulation } from './hooks/usePriceSimulation';
import { useGameStore } from './context/GameContext';
import './App.css';

function App() {
  usePriceSimulation();
  const gameOver = useGameStore(state => state.gameOver);

  return (
    <div className="app">
      <Header />
      <div className="main-content">
        <MarketList />
        <div className="center-panel">
          <div className="chart-wrapper">
            <Chart />
          </div>
          <div className="positions-wrapper">
            <Positions />
          </div>
        </div>
        <OrderPanel />
      </div>
      <Toast />
      {gameOver && (
        <div className="game-over-overlay">
          <div className="game-over-modal">
            <h2>GAME OVER</h2>
            <p>You lost all your money long ETH 💀</p>
            <p>Machi would be proud... not.</p>
            <button onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
