export interface Market {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  baseAsset: string;
}

export const markets: Market[] = [
  { id: 'eth-perp', symbol: 'ETH-PERP', name: 'Ethereum', price: 2450, change24h: 2.5, volume24h: 125000000, baseAsset: 'ETH' },
  { id: 'btc-perp', symbol: 'BTC-PERP', name: 'Bitcoin', price: 67500, change24h: 1.2, volume24h: 250000000, baseAsset: 'BTC' },
  { id: 'sol-perp', symbol: 'SOL-PERP', name: 'Solana', price: 185, change24h: -3.2, volume24h: 45000000, baseAsset: 'SOL' },
  { id: 'pepe-perp', symbol: 'PEPE-PERP', name: 'Pepe', price: 0.0000012, change24h: 5.8, volume24h: 8000000, baseAsset: 'PEPE' },
  { id: 'ai16z-perp', symbol: 'AI16Z-PERP', name: 'ai16z', price: 0.35, change24h: -8.5, volume24h: 15000000, baseAsset: 'AI16Z' },
  { id: 'wld-perp', symbol: 'WLD-PERP', name: 'Worldcoin', price: 2.45, change24h: 1.8, volume24h: 12000000, baseAsset: 'WLD' },
];

export const coinMessages: Record<string, string> = {
  BTC: "BTC? That's for boomers. LONG ETH only.",
  SOL: "Solana goes up? It also goes down. LONG ETH.",
  PEPE: "Meme coin? Have you learned nothing from Machi? LONG ETH.",
  AI16Z: "AI tokens are a scam. Just LONG ETH like a real degen.",
  WLD: "Worldcoin? More like worldcoin of your dreams. LONG ETH.",
};

export const DEFAULT_BALANCE = 100000;
