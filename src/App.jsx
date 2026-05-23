import { useState, useEffect, useRef } from "react";

const MOCK_PORTFOLIO = [
  { symbol: "BTC", name: "Bitcoin", amount: 0.42, price: 67420, change: 2.31, color: "#F7931A" },
  { symbol: "ETH", name: "Ethereum", amount: 3.15, price: 3512, change: -1.24, color: "#627EEA" },
  { symbol: "SOL", name: "Solana", amount: 28.5, price: 168, change: 4.87, color: "#9945FF" },
  { symbol: "BNB", name: "BNB", amount: 5.0, price: 571, change: 0.43, color: "#F0B90B" },
  { symbol: "AVAX", name: "Avalanche", amount: 12.3, price: 37.2, change: -3.11, color: "#E84142" },
];

const AI_RESPONSES = {
  risk: `📊 **Risk Analysis (AI Agent Report)**\n\nPortfolio concentration risk: HIGH\n- BTC dominance: 52.6% → Consider rebalancing if >60%\n- 3 assets showing negative 24h momentum\n\n**Recommendation:** Diversify 10-15% into stable assets (USDC/USDT) to hedge volatility. Current Sharpe ratio estimate: 1.34 — moderate risk-adjusted return.\n\n*Powered by on-chain data + sentiment model*`,
  opportunity: `🎯 **AI Opportunity Scan**\n\nSignals detected across your holdings:\n- SOL: RSI 42 → approaching oversold zone, historically bullish reversal at this level\n- ETH: Funding rate negative → potential long squeeze relief incoming\n- BNB: Low volatility consolidation 72h → breakout probability 68%\n\n**Action:** SOL accumulation zone $155-$165 based on historical support.\n\n*Data: DEX flows, funding rates, whale wallets*`,
  rebalance: `⚖️ **Rebalance Suggestion (AI)**\n\nTarget allocation vs current:\n| Asset | Current | Target | Action |\n|-------|---------|--------|--------|\n| BTC | 52.6% | 45% | Reduce 7.6% |\n| ETH | 20.5% | 25% | Add 4.5% |\n| SOL | 8.9% | 10% | Add 1.1% |\n| Stables | 0% | 10% | Add |\n\nEstimated rebalance cost: ~$24 in gas fees\n\n*Based on Modern Portfolio Theory + volatility-weighted allocation*`,
  summary: `🤖 **Daily AI Portfolio Summary**\n\nTotal value: $39,847.30 (+1.84% vs yesterday)\n\nTop mover: SOL +4.87% 🟢\nWorst performer: AVAX -3.11% 🔴\n\nMarket sentiment: NEUTRAL-BULLISH\n- Fear & Greed Index: 61 (Greed)\n- BTC dominance: 52.1% (stable)\n- Total crypto market cap: $2.41T\n\n**Today's AI Insight:** On-chain data shows accumulation pattern in large wallets. Hold positions, avoid panic selling on AVAX dip.\n\n*Next update: 24h*`,
};

function TypingText({ text, speed = 18 }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const t = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(t); setDone(true); }
    }, speed);
    return () => clearInterval(t);
  }, [text]);
  return (
    <span style={{ whiteSpace: "pre-line" }}>
      {displayed}
      {!done && <span className="cursor">▋</span>}
    </span>
  );
}

function formatUSD(n) {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function App() {
  const [activeQuery, setActiveQuery] = useState(null);
  const [aiText, setAiText] = useState("");
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("portfolio");
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [apiLoading, setApiLoading] = useState(false);
  const chatRef = useRef(null);

  const totalValue = MOCK_PORTFOLIO.reduce((s, a) => s + a.amount * a.price, 0);
  const totalChange = MOCK_PORTFOLIO.reduce((s, a) => s + a.amount * a.price * (a.change / 100), 0);

  function triggerAI(key) {
    setActiveQuery(key);
    setLoading(true);
    setAiText("");
    setTimeout(() => {
      setLoading(false);
      setAiText(AI_RESPONSES[key]);
    }, 900);
  }

  async function sendChat() {
    if (!chatInput.trim() || apiLoading) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    const newHistory = [...chatHistory, { role: "user", content: userMsg }];
    setChatHistory(newHistory);
    setApiLoading(true);

    const portfolioContext = MOCK_PORTFOLIO.map(
      a => `${a.symbol}: ${a.amount} units @ $${a.price} (${a.change > 0 ? "+" : ""}${a.change}% 24h)`
    ).join(", ");

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are an expert crypto portfolio AI advisor. The user's current portfolio: ${portfolioContext}. Total value: ${formatUSD(totalValue)}. Give concise, actionable advice. Use emojis sparingly. Keep responses under 200 words.`,
          messages: newHistory,
        }),
      });
      const data = await res.json();
      const reply = data.content?.map(b => b.text || "").join("") || "Sorry, I couldn't process that.";
      setChatHistory([...newHistory, { role: "assistant", content: reply }]);
    } catch {
      setChatHistory([...newHistory, { role: "assistant", content: "⚠️ Connection error. Please try again." }]);
    }
    setApiLoading(false);
    setTimeout(() => chatRef.current?.scrollTo({ top: 99999, behavior: "smooth" }), 100);
  }

  return (
    <div className="app">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:#0a0e1a;color:#e8eaf2;font-family:'DM Sans',sans-serif}
        .app{min-height:100vh;background:#0a0e1a}
        .header{padding:20px 24px 0;display:flex;align-items:center;justify-content:space-between}
        .logo{font-family:'Space Mono',monospace;font-size:15px;color:#7c85ff;letter-spacing:0.05em}
        .logo span{color:#e8eaf2}
        .badge{background:#1a2040;border:1px solid #2a3060;padding:4px 12px;border-radius:20px;font-size:11px;color:#7c85ff;font-family:'Space Mono',monospace}
        .tabs{display:flex;gap:4px;padding:16px 24px 0}
        .tab{padding:8px 18px;border-radius:8px;font-size:13px;font-weight:500;cursor:pointer;border:1px solid transparent;transition:all 0.2s}
        .tab.active{background:#1a2040;border-color:#2a3060;color:#7c85ff}
        .tab:not(.active){color:#5a6080;background:transparent}
        .tab:not(.active):hover{color:#8890b0}
        .main{padding:16px 24px 32px}
        .total-card{background:linear-gradient(135deg,#111827,#1a2040);border:1px solid #2a3060;border-radius:16px;padding:24px;margin-bottom:16px}
        .total-label{font-size:12px;color:#5a6080;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:6px}
        .total-value{font-family:'Space Mono',monospace;font-size:36px;font-weight:700;color:#e8eaf2;margin-bottom:4px}
        .total-change{font-size:13px}
        .green{color:#22d3a0}.red{color:#f87171}
        .asset-list{display:flex;flex-direction:column;gap:8px;margin-bottom:16px}
        .asset-row{background:#111827;border:1px solid #1e2540;border-radius:12px;padding:14px 16px;display:flex;align-items:center;gap:12px;transition:border-color 0.2s}
        .asset-row:hover{border-color:#2a3060}
        .dot{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;font-family:'Space Mono',monospace;flex-shrink:0}
        .asset-name{flex:1}
        .sym{font-weight:600;font-size:14px;color:#e8eaf2}
        .nm{font-size:12px;color:#5a6080;margin-top:1px}
        .asset-val{text-align:right}
        .val{font-family:'Space Mono',monospace;font-size:13px;color:#e8eaf2}
        .chg{font-size:11px;margin-top:2px}
        .ai-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px}
        .ai-btn{background:#111827;border:1px solid #1e2540;border-radius:10px;padding:12px;cursor:pointer;transition:all 0.2s;text-align:left}
        .ai-btn:hover{border-color:#7c85ff;background:#151d35}
        .ai-btn-icon{font-size:18px;margin-bottom:4px}
        .ai-btn-label{font-size:12px;color:#7c85ff;font-weight:600}
        .ai-btn-desc{font-size:11px;color:#5a6080;margin-top:2px}
        .ai-result{background:#0f1628;border:1px solid #2a3060;border-radius:12px;padding:16px;margin-bottom:16px;min-height:80px}
        .ai-result-header{font-size:11px;color:#7c85ff;font-family:'Space Mono',monospace;margin-bottom:10px;letter-spacing:0.05em}
        .ai-result-text{font-size:13px;line-height:1.7;color:#b8bcd8}
        .cursor{animation:blink 1s infinite;color:#7c85ff}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        .loading-dots{display:flex;gap:5px;padding:8px 0}
        .loading-dots span{width:6px;height:6px;border-radius:50%;background:#7c85ff;animation:pulse 1.2s ease-in-out infinite}
        .loading-dots span:nth-child(2){animation-delay:.2s}
        .loading-dots span:nth-child(3){animation-delay:.4s}
        @keyframes pulse{0%,80%,100%{transform:scale(0.8);opacity:0.5}40%{transform:scale(1);opacity:1}}
        .chat-container{display:flex;flex-direction:column;height:calc(100vh - 200px)}
        .chat-msgs{flex:1;overflow-y:auto;padding-bottom:16px;display:flex;flex-direction:column;gap:12px}
        .chat-msgs::-webkit-scrollbar{width:4px}
        .chat-msgs::-webkit-scrollbar-track{background:transparent}
        .chat-msgs::-webkit-scrollbar-thumb{background:#2a3060;border-radius:2px}
        .msg{max-width:85%;padding:11px 14px;border-radius:12px;font-size:13px;line-height:1.6;white-space:pre-wrap}
        .msg.user{background:#1a2040;border:1px solid #2a3060;color:#e8eaf2;align-self:flex-end;border-bottom-right-radius:4px}
        .msg.assistant{background:#111827;border:1px solid #1e2540;color:#b8bcd8;align-self:flex-start;border-bottom-left-radius:4px}
        .msg-label{font-size:10px;color:#5a6080;margin-bottom:4px;font-family:'Space Mono',monospace}
        .chat-input-row{display:flex;gap:8px;padding-top:12px;border-top:1px solid #1e2540}
        .chat-input{flex:1;background:#111827;border:1px solid #1e2540;border-radius:10px;padding:10px 14px;color:#e8eaf2;font-size:13px;font-family:'DM Sans',sans-serif;outline:none}
        .chat-input::placeholder{color:#3a4060}
        .chat-input:focus{border-color:#2a3060}
        .send-btn{background:#7c85ff;border:none;border-radius:10px;width:40px;height:40px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:18px;transition:opacity 0.2s}
        .send-btn:hover{opacity:0.85}
        .send-btn:disabled{opacity:0.4;cursor:not-allowed}
        .empty-chat{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;color:#3a4060;font-size:13px}
        .empty-chat-icon{font-size:32px;margin-bottom:4px}
        .pills{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px}
        .pill{background:#111827;border:1px solid #1e2540;border-radius:20px;padding:5px 12px;font-size:11px;color:#7c85ff;cursor:pointer;transition:all 0.2s}
        .pill:hover{border-color:#7c85ff;background:#151d35}
      `}</style>

      <div className="header">
        <div className="logo">AI<span>Portfolio</span></div>
        <div className="badge">● LIVE AGENT</div>
      </div>

      <div className="tabs">
        {["portfolio", "ai advisor", "ask ai"].map(t => (
          <button key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className="main">
        {tab === "portfolio" && (
          <>
            <div className="total-card">
              <div className="total-label">Total Portfolio Value</div>
              <div className="total-value">{formatUSD(totalValue)}</div>
              <div className={`total-change ${totalChange >= 0 ? "green" : "red"}`}>
                {totalChange >= 0 ? "▲" : "▼"} {formatUSD(Math.abs(totalChange))} (24h)
              </div>
            </div>
            <div className="asset-list">
              {MOCK_PORTFOLIO.map(a => (
                <div key={a.symbol} className="asset-row">
                  <div className="dot" style={{ background: a.color + "22", color: a.color }}>{a.symbol.slice(0,2)}</div>
                  <div className="asset-name">
                    <div className="sym">{a.symbol}</div>
                    <div className="nm">{a.amount} {a.symbol}</div>
                  </div>
                  <div className="asset-val">
                    <div className="val">{formatUSD(a.amount * a.price)}</div>
                    <div className={`chg ${a.change >= 0 ? "green" : "red"}`}>{a.change >= 0 ? "+" : ""}{a.change}%</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "ai advisor" && (
          <>
            <div className="ai-actions">
              {[
                { key: "summary", icon: "📈", label: "Daily Summary", desc: "AI market overview" },
                { key: "risk", icon: "⚠️", label: "Risk Analysis", desc: "Concentration check" },
                { key: "opportunity", icon: "🎯", label: "Opportunities", desc: "Entry signals" },
                { key: "rebalance", icon: "⚖️", label: "Rebalance", desc: "MPT allocation" },
              ].map(b => (
                <button key={b.key} className="ai-btn" onClick={() => triggerAI(b.key)}>
                  <div className="ai-btn-icon">{b.icon}</div>
                  <div className="ai-btn-label">{b.label}</div>
                  <div className="ai-btn-desc">{b.desc}</div>
                </button>
              ))}
            </div>

            <div className="ai-result">
              <div className="ai-result-header">▸ AI AGENT OUTPUT</div>
              {loading ? (
                <div className="loading-dots"><span/><span/><span/></div>
              ) : aiText ? (
                <div className="ai-result-text"><TypingText text={aiText} /></div>
              ) : (
                <div className="ai-result-text" style={{ color: "#3a4060" }}>Select an action above to run the AI agent...</div>
              )}
            </div>
          </>
        )}

        {tab === "ask ai" && (
          <div className="chat-container">
            <div className="pills">
              {["What's my biggest risk?", "Should I buy more BTC?", "Analyze my ETH position"].map(q => (
                <span key={q} className="pill" onClick={() => { setChatInput(q); }}>
                  {q}
                </span>
              ))}
            </div>
            <div className="chat-msgs" ref={chatRef}>
              {chatHistory.length === 0 && (
                <div className="empty-chat">
                  <div className="empty-chat-icon">🤖</div>
                  Ask me anything about your portfolio
                </div>
              )}
              {chatHistory.map((m, i) => (
                <div key={i}>
                  <div className="msg-label">{m.role === "user" ? "YOU" : "AI ADVISOR"}</div>
                  <div className={`msg ${m.role}`}>{m.content}</div>
                </div>
              ))}
              {apiLoading && (
                <div>
                  <div className="msg-label">AI ADVISOR</div>
                  <div className="msg assistant"><div className="loading-dots"><span/><span/><span/></div></div>
                </div>
              )}
            </div>
            <div className="chat-input-row">
              <input
                className="chat-input"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendChat()}
                placeholder="Ask about your portfolio..."
              />
              <button className="send-btn" onClick={sendChat} disabled={!chatInput.trim() || apiLoading}>→</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
