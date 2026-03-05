import { useState } from 'react';
import { useGameStore } from '../../context/GameContext';
import { formatCurrency } from '../../utils/calculations';
import './OrderPanel.css';

export function OrderPanel() {
  const [marginInput, setMarginInput] = useState<string>('1000');
  const [leverage, setLeverage] = useState<number>(10);
  
  const balance = useGameStore(state => state.balance);
  const ethPrice = useGameStore(state => state.ethPrice);
  const openPosition = useGameStore(state => state.openPosition);

  const margin = parseFloat(marginInput) || 0;
  const notional = margin * leverage;
  const maxMargin = balance;

  const handleLong = () => {
    if (margin <= 0 || margin > balance) return;
    openPosition(notional, leverage);
    setMarginInput('1000');
    setLeverage(10);
  };

  return (
    <div className="order-panel">
      <div className="order-panel-header">
        <h3>Open Position</h3>
      </div>

      <div className="order-inputs">
        <div className="input-group">
          <label>Margin (USD)</label>
          <input
            type="number"
            value={marginInput}
            onChange={(e) => setMarginInput(e.target.value)}
            placeholder="1000"
            min="0"
            max={maxMargin}
          />
          <span className="input-hint">
            Max: {formatCurrency(maxMargin)}
          </span>
        </div>

        <div className="leverage-group">
          <div className="leverage-header">
            <label>Leverage</label>
            <span className="leverage-value">{leverage}x</span>
          </div>
          <input
            type="range"
            min="1"
            max="50"
            value={leverage}
            onChange={(e) => setLeverage(parseInt(e.target.value))}
            className="leverage-slider"
          />
          <div className="leverage-marks">
            <span>1x</span>
            <span>25x</span>
            <span>50x</span>
          </div>
        </div>

        <div className="order-summary">
          <div className="summary-row">
            <span>Position Size</span>
            <span>{formatCurrency(notional)}</span>
          </div>
          <div className="summary-row">
            <span>Entry Price</span>
            <span>~{formatCurrency(ethPrice)}</span>
          </div>
          <div className="summary-row">
            <span>Liq. Price</span>
            <span className="liq-price">
              ~{formatCurrency(ethPrice * (1 - 1/leverage))}
            </span>
          </div>
        </div>
      </div>

      <div className="order-buttons">
        <button 
          className="long-btn"
          onClick={handleLong}
          disabled={margin <= 0 || margin > balance}
        >
          <span className="btn-icon">↗</span>
          LONG ETH
        </button>
        <button className="short-btn" disabled title="Shorts are for losers 💀">
          <span className="btn-icon">↘</span>
          SHORT
          <span className="disabled-badge">DISABLED</span>
        </button>
      </div>

      <div className="balance-info">
        <span>Available Balance:</span>
        <span className="balance-value">{formatCurrency(balance)}</span>
      </div>
    </div>
  );
}
