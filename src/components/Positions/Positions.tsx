import { useGameStore } from '../../context/GameContext';
import { calculatePnL, calculatePnLPercent, formatCurrency, formatPrice } from '../../utils/calculations';
import './Positions.css';

export function Positions() {
  const positions = useGameStore(state => state.positions);
  const ethPrice = useGameStore(state => state.ethPrice);
  const closePosition = useGameStore(state => state.closePosition);

  if (positions.length === 0) {
    return (
      <div className="positions">
        <div className="positions-header">
          <h3>Positions</h3>
        </div>
        <div className="positions-empty">
          <p>No open positions</p>
          <span>Open a LONG position to start trading</span>
        </div>
      </div>
    );
  }

  return (
    <div className="positions">
      <div className="positions-header">
        <h3>Positions</h3>
        <span className="positions-count">{positions.length} open</span>
      </div>
      <div className="positions-list">
        {positions.map(position => {
          const pnl = calculatePnL(position.entryPrice, ethPrice, position.size, position.leverage);
          const pnlPercent = calculatePnLPercent(position.entryPrice, ethPrice, position.leverage);
          const isProfit = pnl >= 0;
          const isDanger = pnlPercent <= -50;

          return (
            <div key={position.id} className={`position-item ${isDanger ? 'danger' : ''}`}>
              <div className="position-header">
                <span className="position-symbol">ETH-PERP</span>
                <span className="position-side long">LONG</span>
              </div>
              <div className="position-details">
                <div className="detail-row">
                  <span>Size</span>
                  <span>{formatCurrency(position.size)}</span>
                </div>
                <div className="detail-row">
                  <span>Entry</span>
                  <span>{formatPrice(position.entryPrice)}</span>
                </div>
                <div className="detail-row">
                  <span>Leverage</span>
                  <span>{position.leverage}x</span>
                </div>
                <div className="detail-row">
                  <span>Current</span>
                  <span>{formatPrice(ethPrice)}</span>
                </div>
              </div>
              <div className={`position-pnl ${isProfit ? 'profit' : 'loss'}`}>
                <span className="pnl-value">{pnl >= 0 ? '+' : ''}{formatCurrency(pnl)}</span>
                <span className="pnl-percent">{pnlPercent >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%</span>
              </div>
              <button 
                className="close-btn"
                onClick={() => closePosition(position.id)}
              >
                Close Position
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
