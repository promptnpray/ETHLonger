export interface Position {
  id: string;
  marketId: string;
  symbol: string;
  side: 'long';
  size: number;
  entryPrice: number;
  leverage: number;
  openedAt: number;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function calculatePnL(
  entryPrice: number,
  currentPrice: number,
  size: number,
  leverage: number
): number {
  const priceChange = (currentPrice - entryPrice) / entryPrice;
  return size * priceChange * leverage;
}

export function calculatePnLPercent(
  entryPrice: number,
  currentPrice: number,
  leverage: number
): number {
  const priceChange = ((currentPrice - entryPrice) / entryPrice) * 100;
  return priceChange * leverage;
}

export function calculateLiquidationPrice(
  entryPrice: number,
  leverage: number,
  side: 'long'
): number {
  const liquidationPercent = 1 / leverage;
  if (side === 'long') {
    return entryPrice * (1 - liquidationPercent);
  }
  return entryPrice * (1 + liquidationPercent);
}

export function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(2)}K`;
  }
  if (value >= 1) {
    return `$${value.toFixed(2)}`;
  }
  return `$${value.toFixed(6)}`;
}

export function formatPrice(price: number): string {
  if (price >= 1000) {
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  if (price >= 1) {
    return `$${price.toFixed(2)}`;
  }
  return `$${price.toFixed(6)}`;
}

export function formatPercent(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}
