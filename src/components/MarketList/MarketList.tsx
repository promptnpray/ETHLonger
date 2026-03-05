import { markets, coinMessages } from '../../data/markets';
import { useGameStore } from '../../context/GameContext';
import { formatPrice, formatPercent } from '../../utils/calculations';
import './MarketList.css';

export function MarketList() {
  const selectedMarketId = useGameStore(state => state.selectedMarketId);
  const selectMarket = useGameStore(state => state.selectMarket);
  const ethPrice = useGameStore(state => state.ethPrice);
  const addNotification = useGameStore(state => state.addNotification);

  const handleSelectMarket = (market: typeof markets[0]) => {
    if (market.baseAsset !== 'ETH') {
      const message = coinMessages[market.baseAsset] || `Why would you trade ${market.baseAsset}? Just LONG ETH.`;
      addNotification(message, 'info');
      return;
    }
    selectMarket(market.id);
  };

  return (
    <div className="market-list">
      <div className="market-list-header">
        <span>Markets</span>
      </div>
      <div className="market-items">
        {markets.map(market => (
          <div
            key={market.id}
            className={`market-item ${market.baseAsset !== 'ETH' ? 'disabled' : ''} ${selectedMarketId === market.id ? 'selected' : ''}`}
            onClick={() => handleSelectMarket(market)}
          >
            <div className="market-info">
              <span className="market-symbol">{market.symbol}</span>
              <span className="market-name">{market.name}</span>
            </div>
            <div className="market-price-info">
              <span className="market-price">
                {market.baseAsset === 'ETH' 
                  ? formatPrice(ethPrice) 
                  : formatPrice(market.price)}
              </span>
              <span className={`market-change ${market.change24h >= 0 ? 'positive' : 'negative'}`}>
                {formatPercent(market.change24h)}
              </span>
            </div>
            {market.baseAsset !== 'ETH' && (
              <span className="long-only-badge">LONG ONLY</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
