# ETH Longer - Project Specification

## 1. Project Overview

**Project Name:** ETH Longer (or "Machi's Gambit")

**Type:** Web-based trading simulation game

**Core Functionality:** A parody perpetual trading platform where players can only LONG ETH (mimicking Machi Big Brother's legendary conviction), with a professional UI that looks like a real DeFi trading platform.

**Target Users:** Crypto enthusiasts, traders, fans of crypto Twitter drama

---

## 2. UI/UX Specification

### Layout Structure

**Header (64px height)**
- Logo: "HYPERLONG" or similar (parody name)
- Navigation: Trade, Portfolio, Leaderboard
- Wallet balance display (top right)
- Connection status indicator (fake "Connected")

**Main Content (3-column layout)**
- Left sidebar (280px): Market list with all perp pairs
- Center (flex): Price chart + order panel
- Right sidebar (320px): Open positions + order book

**Responsive Breakpoints**
- Desktop: 1200px+ (full 3-column)
- Tablet: 768px-1199px (collapsible sidebars)
- Mobile: <768px (stacked layout)

### Visual Design

**Color Palette**
- Background: `#0a0e17` (deep navy black)
- Surface: `#131a2a` (card backgrounds)
- Surface Elevated: `#1a2235` (hover states)
- Primary Green (Long): `#00dc82` (like Hyperliquid)
- Accent Red: `#ff4757` (disabled states, warnings)
- Text Primary: `#e8eaed`
- Text Secondary: `#6b7280`
- Border: `#2a3548`
- Chart Green: `#00dc82`
- Chart Red: `#ff4757`

**Typography**
- Font Family: `"JetBrains Mono", "Fira Code", monospace` (numbers)
- Font Family: `"Inter", system-ui, sans-serif` (UI text)
- Headings: 24px (h1), 18px (h2), 14px (h3)
- Body: 14px
- Small/Labels: 12px

**Spacing System**
- Base unit: 4px
- Padding small: 8px
- Padding medium: 16px
- Padding large: 24px
- Gap: 12px
- Border radius: 8px (cards), 4px (buttons)

**Visual Effects**
- Subtle glow on green elements: `box-shadow: 0 0 20px rgba(0, 220, 130, 0.2)`
- Card shadows: `0 4px 24px rgba(0, 0, 0, 0.4)`
- Smooth transitions: 200ms ease
- Price flash animations on updates

### Components

**Market List Item**
- Pair name (e.g., "ETH-PERP")
- 24h change percentage (green/red)
- Current price
- 24h volume
- Hover: highlight + show "LONG ONLY" badge on non-ETH

**Price Chart**
- TradingView-style candlestick chart (simplified)
- Timeframe selector: 1m, 5m, 15m, 1h, 4h, 1D
- Price scale on right
- Volume bars at bottom

**Order Panel**
- Leverage slider: 1x to 50x
- Order type: Market (Limit later if time permits)
- Size input (USD)
- Available balance display
- "LONG ETH" button (big, green, prominent)
- "SHORT" button (greyed out, disabled, tooltip: " shorts are for losers 💀")

**Positions Panel**
- Open positions list
- Entry price, current PnL, leverage, size
- "Close Position" button
- Liquidation warning indicator

**Toast Notifications**
- "Position opened: 10x LONG ETH @ $2,450"
- "Liquidation! Say goodbye to your money 💀"
- "Machi would be proud"

---

## 3. Functionality Specification

### Core Features

**1. Wallet System**
- Start with $100,000 fake USD
- Track balance in real-time
- Show available margin

**2. Price Simulation**
- Simulated ETH price that moves randomly with trends
- Price updates every 500ms
- Realistic price movements (walks, spikes, dumps)
- Starting price: ~$2,000

**3. Long Positions**
- Open long positions with leverage 1x-50x
- Calculate position size: `leverage * margin`
- PnL calculation: `(currentPrice - entryPrice) / entryPrice * leverage`
- Auto-liquidate when `PnL < -90%` (or -100%/leverage)

**4. Market Interaction**
- Click on ETH-PERP: Opens order panel for ETH
- Click on other pairs (BTC, SOL, etc.): Shows funny modal

**5. Funny Interactions (Non-ETH Coins)**

| Coin | Message |
|------|---------|
| BTC | "BTC? That's for boomers. LONG ETH only." |
| SOL | "Solana goes up? It also goes down. LONG ETH." |
| PEPE | "Meme coin? Have you learned nothing from Machi? LONG ETH." |
| AI16Z | "AI tokens are a scam. Just LONG ETH like a real degen." |
| Others | "Why would you trade that? Just LONG ETH." |

**6. Win/Lose Conditions**
- No explicit win condition (endless mode)
- Game over when balance < $100
- Track total profit/lifetime

### User Interactions & Flows

1. **Open Position Flow:**
   - Select leverage → Enter size → Click "LONG ETH" → Position appears in list → Price updates PnL in real-time

2. **Close Position Flow:**
   - Click position → Click "Close" → Confirm modal → Position closed → Balance updated

3. **Liquidation Flow:**
   - Price moves against position → Red warning flash → Auto-close → "LIQUIDATED" animation → Toast: "Machi would be proud... not."

### Edge Cases
- Prevent opening position with 0 or negative size
- Prevent leverage < 1x or > 50x
- Handle insufficient balance
- Handle trying to short (show disabled state)

---

## 4. Technical Implementation

**Tech Stack:**
- React + Vite (fast dev, small bundle)
- TypeScript
- CSS Modules or styled-components
- Recharts or lightweight chart lib
- State management: React Context or Zustand

**Project Structure:**
```
src/
├── components/
│   ├── Header/
│   ├── MarketList/
│   ├── Chart/
│   ├── OrderPanel/
│   ├── Positions/
│   └── common/
├── hooks/
│   ├── usePriceSimulation.ts
│   └── useTrading.ts
├── context/
│   └── GameContext.tsx
├── utils/
│   └── calculations.ts
├── data/
│   └── markets.ts
├── App.tsx
├── App.css
└── main.tsx
```

---

## 5. Suggested Names

1. **ETH Longer** (your suggestion)
2. **Machi's Gambit**
3. **Degenerate Long**
4. **The Eternal Long**
5. **HYPERLONG** (looks like exchange name)
6. **Liquidation Simulator**

**Recommendation:** "HYPERLONG" or "Machi's Gambit" -前者 sounds like a real exchange, latter is funnier.

---

## 6. Game Script / Flavor Text

**Opening:** "Welcome to HYPERLONG. Here, we only long ETH. Welcome to the degen zone."

**Liquidation Messages (random):**
- "Machi: 'This time is different.' It was not different."
- "Your position has been... liquidated. Like Machi's portfolio."
- "Diamond hands? More like diamond losses."
- "ETH will go up... eventually. Just not today."

**Other Coin Clicks:**
- Quick dismissible toast (2s) with funny message

---

## 7. Milestones

### Phase 1 - MVP
- [ ] Basic layout (header, 3 columns)
- [ ] Market list with ETH + 5 other pairs
- [ ] Simulated price chart (simple line/candles)
- [ ] Open long position (1x-50x leverage)
- [ ] Position list with PnL
- [ ] Basic liquidation mechanic
- [ ] Non-ETH funny messages

### Phase 2 - Polish
- [ ] Better chart visualization
- [ ] Sound effects (optional)
- [ ] More flavor text
- [ ] Leaderboard (local storage)
- [ ] Animations

### Phase 3 - Bonus
- [ ] Mobile responsive
- [ ] Limit orders
- [ ] More coins with unique messages
- [ ] Achievement system
