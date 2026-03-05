import { useMemo } from 'react';
import { useGameStore } from '../../context/GameContext';
import { formatPrice } from '../../utils/calculations';
import './Chart.css';

type Timeframe = '1s' | '5s' | '15s' | '1m';

const TIMEFRAMES: Timeframe[] = ['1s', '5s', '15s', '1m'];
const MAX_CANDLES = 30;

export function Chart() {
  const ethPrice = useGameStore(state => state.ethPrice);
  const candles = useGameStore(state => state.candles);
  const currentCandle = useGameStore(state => state.currentCandle);
  const timeframe = useGameStore(state => state.timeframe);
  const setTimeframe = useGameStore(state => state.setTimeframe);

  const { chartData, priceDomain, priceChange, yTicks } = useMemo(() => {
    const allCandles = currentCandle ? [...candles, currentCandle] : candles;
    const data = allCandles.slice(-MAX_CANDLES).map((candle, i) => {
      const isGreen = candle.close >= candle.open;
      return {
        index: i,
        open: candle.open,
        close: candle.close,
        high: candle.high,
        low: candle.low,
        isGreen,
      };
    });

    let domain: [number, number];
    let ticks: number[] = [];
    
    if (data.length === 0) {
      domain = [ethPrice * 0.995, ethPrice * 1.005];
      ticks = [domain[0], ethPrice * 1.0025, domain[1]];
    } else {
      const lows = data.map(c => c.low);
      const highs = data.map(c => c.high);
      const min = Math.min(...lows);
      const max = Math.max(...highs);
      
      // Minimum price range to prevent zooming in too much
      const minRange = ethPrice * 0.01; // 1% minimum range
      const actualRange = Math.max(max - min, minRange);
      const padding = actualRange * 0.1;
      
      domain = [min - padding, max + padding];
      
      const range = domain[1] - domain[0];
      const step = range / 4;
      for (let i = 0; i <= 4; i++) {
        ticks.push(domain[0] + step * i);
      }
    }

    const change = data.length > 1 
      ? ((ethPrice - data[0].open) / data[0].open) * 100 
      : 0;

    return { chartData: data, priceDomain: domain, priceChange: change, yTicks: ticks };
  }, [candles, currentCandle, ethPrice]);

  const chartHeight = 180;
  const chartWidth = 200;
  const barWidth = 3;
  const barGap = 1;
  
  const [minPrice, maxPrice] = priceDomain;
  
  const scaleY = (price: number) => {
    const pct = (price - minPrice) / (maxPrice - minPrice);
    return chartHeight - pct * chartHeight;
  };

  return (
    <div className="chart-container">
      <div className="chart-header">
        <div className="chart-symbol">
          <span className="symbol-name">ETH-PERP</span>
        </div>
        <div className="chart-price">
          <span className="current-price">{formatPrice(ethPrice)}</span>
          <span className={`price-change ${priceChange >= 0 ? 'positive' : 'negative'}`}>
            {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
          </span>
        </div>
        <div className="timeframes">
          {TIMEFRAMES.map(tf => (
            <button 
              key={tf} 
              className={`timeframe-btn ${timeframe === tf ? 'active' : ''}`}
              onClick={() => setTimeframe(tf)}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>
      <div className="chart-area">
        {chartData.length > 0 ? (
          <div className="candle-chart">
            <div className="y-axis">
              {yTicks.map((tick, i) => (
                <div 
                  key={i} 
                  className="y-tick"
                  style={{ top: `${scaleY(tick)}px` }}
                >
                  ${Math.round(tick).toLocaleString()}
                </div>
              ))}
            </div>
            <svg viewBox={`0 0 ${chartWidth + 40} ${chartHeight}`} className="candle-svg">
              <defs>
                <clipPath id="chartClip">
                  <rect x="0" y="0" width={chartWidth + 40} height={chartHeight} />
                </clipPath>
              </defs>
              <g clipPath="url(#chartClip)">
                {chartData.map((candle, i) => {
                  const x = i * (barWidth + barGap) + barGap + barWidth / 2 + 30;
                  
                  // Clamp values to prevent them from going outside chart
                  const yTop = Math.max(0, Math.min(chartHeight, scaleY(candle.high)));
                  const yBottom = Math.max(0, Math.min(chartHeight, scaleY(candle.low)));
                  const yOpen = Math.max(0, Math.min(chartHeight, scaleY(candle.open)));
                  const yClose = Math.max(0, Math.min(chartHeight, scaleY(candle.close)));
                  const bodyTop = Math.min(yOpen, yClose);
                  const bodyBottom = Math.max(yOpen, yClose);
                  const bodyHeight = Math.max(1, bodyBottom - bodyTop);
                  
                  return (
                    <g key={i}>
                      <line
                        x1={x}
                        y1={yTop}
                        x2={x}
                        y2={yBottom}
                        stroke={candle.isGreen ? '#39ff14' : '#ff0040'}
                        strokeWidth={1}
                      />
                      <rect
                        x={x - barWidth / 2}
                        y={bodyTop}
                        width={barWidth}
                        height={bodyHeight}
                        fill={candle.isGreen ? '#39ff14' : '#ff0040'}
                      />
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>
        ) : (
          <div className="chart-empty">
            <span>WAITING...</span>
          </div>
        )}
      </div>
    </div>
  );
}
