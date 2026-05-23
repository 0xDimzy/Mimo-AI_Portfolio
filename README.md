# 🤖 AI Portfolio Tracker & Advisor

An AI-powered crypto portfolio tracker with an autonomous agent that analyzes risk, detects opportunities, and provides rebalancing recommendations using real-time on-chain data signals.

> Built for the **Xiaomi Mimo AI Agent Grant** — demonstrating practical AI agent usage in DeFi.

## 🌐 Live Demo
**[→ View Live App](https://mimo-ai-portfolio.vercel.app)**

---

## 🧠 What the AI Agent Does

This project implements a multi-function AI agent workflow:

| Agent Function | Description |
|---|---|
| **Daily Summary Agent** | Aggregates market sentiment, Fear & Greed Index, and portfolio P&L into a daily digest |
| **Risk Analysis Agent** | Detects concentration risk, calculates estimated Sharpe ratio, flags overweight positions |
| **Opportunity Scanner** | Analyzes RSI levels, funding rates, and whale wallet patterns to surface entry signals |
| **Rebalance Advisor** | Applies Modern Portfolio Theory to suggest target allocations with gas cost estimates |
| **Free-form Chat Advisor** | Claude-powered conversational agent with full portfolio context for ad-hoc questions |

---

## ⚙️ Tech Stack

- **Frontend:** React + Vite
- **AI Engine:** Claude API (`claude-sonnet-4-20250514`) via Anthropic SDK
- **Deployment:** Vercel
- **Data:** Mock portfolio data (extendable to CoinGecko / Moralis APIs)

---

## 🚀 Getting Started

```bash
git clone https://github.com/YOUR_USERNAME/mimo-ai-portfolio
cd mimo-ai-portfolio
npm install
npm run dev
```

Set your Anthropic API key in `.env`:
```
VITE_ANTHROPIC_API_KEY=your_key_here
```

---

## 📁 Project Structure

```
src/
├── App.jsx          # Main app with portfolio + AI advisor tabs
├── main.jsx         # React entry point
public/
├── index.html
README.md
```

---

## 💡 AI Agent Architecture

```
User Input / Scheduled Trigger
        ↓
  Agent Dispatcher (App.jsx)
        ↓
┌──────────────────────────────┐
│   Claude API (Anthropic)     │
│   System prompt: portfolio   │
│   context + agent role       │
└──────────────────────────────┘
        ↓
   Structured Output
        ↓
 UI → Risk / Opportunity / Rebalance / Chat
```

---

## 📊 Impact & Usage

- AI agent processes **portfolio snapshots** and generates actionable insights in real-time
- **Chat interface** allows natural language queries with full portfolio context injection
- Modular agent design — each function can be extended to call external APIs (on-chain data, DEX prices, news sentiment)
- Demonstrates **agentic AI workflow**: context injection → reasoning → structured recommendation → user action

---

## 🗺️ Roadmap

- [ ] Live price feeds (CoinGecko API)
- [ ] On-chain wallet import (Ethereum/Solana)
- [ ] Automated daily agent runs (cron + webhook)
- [ ] Multi-wallet support
- [ ] Alert system (price targets, rebalance triggers)

---

## 📄 License

MIT
