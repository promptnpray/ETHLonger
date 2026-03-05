import { useEffect, useRef } from 'react';
import { useGameStore } from '../context/GameContext';

const UPDATE_INTERVAL = 200;
const VOLATILITY = 0.002;
const TREND_PROBABILITY = 0.35;

export function usePriceSimulation() {
  const updatePrice = useGameStore(state => state.updatePrice);
  const ethPrice = useGameStore(state => state.ethPrice);
  const trendRef = useRef<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.05) {
        trendRef.current = Math.random() > 0.5 ? 1 : -1;
      }

      const trend = trendRef.current * VOLATILITY * 0.5;
      const randomWalk = (Math.random() - 0.5) * VOLATILITY * 2;
      const momentum = (Math.random() < TREND_PROBABILITY ? trend : 0);
      
      const change = (randomWalk + momentum) * ethPrice;
      const newPrice = Math.max(100, ethPrice + change);

      updatePrice(Math.round(newPrice * 100) / 100);
    }, UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, [ethPrice, updatePrice]);
}
