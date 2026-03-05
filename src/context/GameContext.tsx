import { create } from 'zustand';
import { generateId } from '../utils/calculations';
import { DEFAULT_BALANCE } from '../data/markets';

interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface Tick {
  time: number;
  price: number;
}

interface Position {
  id: string;
  marketId: string;
  symbol: string;
  side: 'long';
  size: number;
  entryPrice: number;
  leverage: number;
  openedAt: number;
}

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

type Timeframe = '1s' | '5s' | '15s' | '1m';

interface GameState {
  balance: number;
  positions: Position[];
  selectedMarketId: string;
  ethPrice: number;
  tickHistory: Tick[];
  candles: Candle[];
  currentCandle: Candle | null;
  timeframe: Timeframe;
  notifications: Notification[];
  gameOver: boolean;
  
  selectMarket: (marketId: string) => void;
  setTimeframe: (tf: Timeframe) => void;
  openPosition: (size: number, leverage: number) => boolean;
  closePosition: (positionId: string) => void;
  updatePrice: (newPrice: number) => void;
  addNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  removeNotification: (id: string) => void;
  resetGame: () => void;
}

const liquidationMessages = [
  "Machi: 'This time is different.' It was not different.",
  "Your position has been... liquidated. Like Machi's portfolio.",
  "Diamond hands? More like diamond losses.",
  "ETH will go up not today.",
  "Say goodbye to... eventually. Just your money 💀",
  "Machi would be proud... not.",
  "Another one bites the dust. LONG ETH!",
];

const TIMEFRAME_MS: Record<Timeframe, number> = {
  '1s': 1000,
  '5s': 5000,
  '15s': 15000,
  '1m': 60000,
};

const MAX_TICKS = 3000;

function calculatePnL(entryPrice: number, currentPrice: number, margin: number, leverage: number): number {
  const priceChange = (currentPrice - entryPrice) / entryPrice;
  return margin * priceChange * leverage;
}

function buildCandlesFromTicks(ticks: Tick[], interval: number, existingCandles?: Candle[]): Candle[] {
  if (ticks.length === 0) return [];
  
  const candles: Candle[] = existingCandles ? [...existingCandles] : [];
  let lastClose = candles.length > 0 ? candles[candles.length - 1].close : ticks[0].price;
  
  for (const tick of ticks) {
    const candleTime = tick.time - (tick.time % interval);
    
    const lastCandle = candles.length > 0 ? candles[candles.length - 1] : null;
    
    if (!lastCandle || lastCandle.time !== candleTime) {
      candles.push({
        time: candleTime,
        open: lastClose,
        high: tick.price,
        low: tick.price,
        close: tick.price,
      });
    } else {
      lastCandle.high = Math.max(lastCandle.high, tick.price);
      lastCandle.low = Math.min(lastCandle.low, tick.price);
      lastCandle.close = tick.price;
    }
    lastClose = tick.price;
  }
  
  return candles.slice(-50);
}

export const useGameStore = create<GameState>((set, get) => ({
  balance: DEFAULT_BALANCE,
  positions: [],
  selectedMarketId: 'eth-perp',
  ethPrice: 2450,
  tickHistory: [],
  candles: [],
  currentCandle: null,
  timeframe: '1s',
  notifications: [],
  gameOver: false,

  selectMarket: (marketId: string) => {
    set({ selectedMarketId: marketId });
  },

  setTimeframe: (tf: Timeframe) => {
    const state = get();
    const interval = TIMEFRAME_MS[tf];
    const candles = buildCandlesFromTicks(state.tickHistory, interval);
    
    const lastCandle = candles.length > 0 ? candles[candles.length - 1] : null;
    const currentCandle = lastCandle && (Date.now() - lastCandle.time < interval) 
      ? lastCandle 
      : null;
    
    set({ 
      timeframe: tf, 
      candles: currentCandle ? candles.slice(0, -1) : candles,
      currentCandle 
    });
  },

  openPosition: (size: number, leverage: number) => {
    const state = get();
    const requiredMargin = size / leverage;
    
    if (requiredMargin > state.balance) {
      state.addNotification('Insufficient balance!', 'error');
      return false;
    }

    const newPosition: Position = {
      id: generateId(),
      marketId: 'eth-perp',
      symbol: 'ETH-PERP',
      side: 'long',
      size,
      entryPrice: state.ethPrice,
      leverage,
      openedAt: Date.now(),
    };

    set({
      balance: state.balance - requiredMargin,
      positions: [...state.positions, newPosition],
    });

    state.addNotification(
      `Position opened: ${leverage}x LONG ETH @ $${state.ethPrice.toLocaleString()}`,
      'success'
    );
    return true;
  },

  closePosition: (positionId: string) => {
    const state = get();
    const position = state.positions.find(p => p.id === positionId);
    if (!position) return;

    const margin = position.size / position.leverage;
    const pnl = calculatePnL(position.entryPrice, state.ethPrice, margin, position.leverage);
    const proceeds = Math.max(0, margin + pnl);

    set({
      balance: state.balance + proceeds,
      positions: state.positions.filter(p => p.id !== positionId),
    });

    state.addNotification(
      `Position closed: PnL ${pnl >= 0 ? '+' : ''}$${pnl.toFixed(2)}`,
      pnl >= 0 ? 'success' : 'error'
    );
  },

  updatePrice: (newPrice: number) => {
    const state = get();
    const now = Date.now();
    const interval = TIMEFRAME_MS[state.timeframe];
    
    const tickHistory = [...state.tickHistory, { time: now, price: newPrice }].slice(-MAX_TICKS);
    
    let currentCandle = state.currentCandle;
    let candles = state.candles;

    if (!currentCandle || now - currentCandle.time >= interval) {
      if (currentCandle) {
        candles = [...candles, currentCandle].slice(-50);
      }
      const lastClose = candles.length > 0 ? candles[candles.length - 1].close : newPrice;
      currentCandle = {
        time: now - (now % interval),
        open: lastClose,
        high: newPrice,
        low: newPrice,
        close: newPrice,
      };
    } else {
      currentCandle = {
        ...currentCandle,
        high: Math.max(currentCandle.high, newPrice),
        low: Math.min(currentCandle.low, newPrice),
        close: newPrice,
      };
    }
    
    let newBalance = state.balance;
    const updatedPositions = state.positions.filter(position => {
      const margin = position.size / position.leverage;
      const pnl = calculatePnL(position.entryPrice, newPrice, margin, position.leverage);
      const pnlPercent = (pnl / margin) * 100;
      
      if (pnlPercent <= -100) {
        newBalance += 0;
        const msg = liquidationMessages[Math.floor(Math.random() * liquidationMessages.length)];
        state.addNotification(`LIQUIDATED! ${msg}`, 'error');
        return false;
      }
      return true;
    });

    set({
      ethPrice: newPrice,
      tickHistory,
      candles,
      currentCandle,
      positions: updatedPositions,
      balance: newBalance,
      gameOver: newBalance < 100 && updatedPositions.length === 0,
    });
  },

  addNotification: (message: string, type: 'success' | 'error' | 'info') => {
    const id = generateId();
    set(state => ({
      notifications: [...state.notifications, { id, message, type }]
    }));
    setTimeout(() => {
      get().removeNotification(id);
    }, 3000);
  },

  removeNotification: (id: string) => {
    set(state => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }));
  },

  resetGame: () => {
    set({
      balance: DEFAULT_BALANCE,
      positions: [],
      selectedMarketId: 'eth-perp',
      ethPrice: 2450,
      tickHistory: [],
      candles: [],
      currentCandle: null,
      timeframe: '1s',
      notifications: [],
      gameOver: false,
    });
  },
}));
