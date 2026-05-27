import { useState, useEffect, useCallback, useRef } from "react";

const STORAGE_KEY = "italian-tracker-v4";
const CHAT_KEY = "italian-tracker-chat-v4";

const DATES = ["May 27","May 28","May 29","May 30","May 31","Jun 1","Jun 2","Jun 3","Jun 4","Jun 5","Jun 6","Jun 7","Jun 8","Jun 9","Jun 10","Jun 11","Jun 12","Jun 13","Jun 14","Jun 15","Jun 16","Jun 17","Jun 18","Jun 19","Jun 20","Jun 21","Jun 22","Jun 23","Jun 24","Jun 25","Jun 26","Jun 27","Jun 28","Jun 29","Jun 30","Jul 1","Jul 2","Jul 3","Jul 4","Jul 5","Jul 6","Jul 7","Jul 8","Jul 9","Jul 10","Jul 11","Jul 12","Jul 13","Jul 14","Jul 15","Jul 16","Jul 17","Jul 18","Jul 19","Jul 20","Jul 21","Jul 22","Jul 23","Jul 24","Jul 25","Jul 26","Jul 27","Jul 28","Jul 29","Jul 30","Jul 31","Aug 1","Aug 2","Aug 3","Aug 4","Aug 5","Aug 6","Aug 7","Aug 8","Aug 9","Aug 10","Aug 11","Aug 12","Aug 13","Aug 14","Aug 15","Aug 16","Aug 17","Aug 18"];

const weekData = [
 { phase:1, label:"Week 1", focus:"Foundation", dateRange:"May 27 – Jun 2", days:[
  { short:"Articles", detail:"Babbel lesson 1 · CBT Ep.1 · OnlineItalianClub articles exercises", target:90 },
  { short:"Gender & plural", detail:"CBT Ep.2 · Write 5 sentences · OnlineItalianClub plurals", target:75 },
  { short:"essere present", detail:"Babbel + OnlineItalianClub essere/avere", target:90 },
  { short:"lo / gli / le", detail:"CBT Ep.3 · Write 5 sentences", target:75 },
  { short:"Articles review", detail:"Babbel lesson 2 · CBT Ep.4 · OnlineItalianClub drills", target:90 },
  { short:"TEST 1", detail:"Self-test: articles, gender, essere/avere. Write 20 sentences from scratch. Grade yourself.", target:60, type:"test" },
  { short:"Rest + review", detail:"Babbel vocab review · Light CBT", target:20, type:"rest" },
 ]},
 { phase:1, label:"Week 2", focus:"Foundation", dateRange:"Jun 3 – Jun 9", days:[
  { short:"avere present", detail:"Babbel · OnlineItalianClub verbs", target:90 },
  { short:"-are verbs", detail:"CBT Ep.5 · Write sentences · OnlineItalianClub -are drills", target:75 },
  { short:"-ere/-ire verbs", detail:"Babbel + OnlineItalianClub", target:90 },
  { short:"Irregular verbs", detail:"CBT Ep.6 · Write sentences · OnlineItalianClub irregular", target:75 },
  { short:"Adj. agreement", detail:"Babbel + OnlineItalianClub adj exercises", target:90 },
  { short:"TEST 2", detail:"Self-test: all regular verbs present tense + adj. agreement. Conjugate 15 verbs cold.", target:60, type:"test" },
  { short:"Rest + review", detail:"Babbel vocab review · Light CBT", target:20, type:"rest" },
 ]},
 { phase:2, label:"Week 3", focus:"Build", dateRange:"Jun 10 – Jun 16", days:[
  { short:"Prepositions", detail:"Babbel · OnlineItalianClub prepositions", target:90 },
  { short:"del / della", detail:"CBT Ep.7 · Write sentences · OnlineItalianClub contractions", target:75 },
  { short:"Numbers + time", detail:"Babbel + OnlineItalianClub", target:90 },
  { short:"da / in / con / su", detail:"CBT Ep.8 · Write sentences · OnlineItalianClub drills", target:75 },
  { short:"Prep. review", detail:"Babbel + OnlineItalianClub", target:90 },
  { short:"TEST 3", detail:"Self-test: prepositions + contractions. Fill 25 blanks, translate 10 sentences.", target:60, type:"test" },
  { short:"Rest + review", detail:"Babbel vocab review", target:20, type:"rest" },
 ]},
 { phase:2, label:"Week 4", focus:"Build", dateRange:"Jun 17 – Jun 23", days:[
  { short:"potere/volere/dovere", detail:"Babbel · OnlineItalianClub modals", target:90 },
  { short:"Reflexive verbs", detail:"CBT Ep.9 · OnlineItalianClub reflexive exercises", target:75 },
  { short:"mi / ti / lo / la", detail:"Babbel + OnlineItalianClub pronouns", target:90 },
  { short:"Direct obj. pronouns", detail:"CBT Ep.10 · Write sentences", target:75 },
  { short:"Modal + pronoun", detail:"Babbel + OnlineItalianClub combo drills", target:90 },
  { short:"TEST 4", detail:"Self-test: modals + direct object pronouns. 20 translation sentences.", target:60, type:"test" },
  { short:"Rest + review", detail:"Babbel vocab review", target:20, type:"rest" },
 ]},
 { phase:2, label:"Week 5", focus:"Build", dateRange:"Jun 24 – Jun 30", days:[
  { short:"Passato prossimo", detail:"Babbel · OnlineItalianClub passato exercises", target:90 },
  { short:"avere auxiliary", detail:"CBT Ep.11 · OnlineItalianClub avere drills", target:75 },
  { short:"essere auxiliary", detail:"Babbel + OnlineItalianClub essere drills", target:90 },
  { short:"Irregular past", detail:"CBT Ep.12 · Write sentences · OnlineItalianClub irregular past", target:75 },
  { short:"Past tense review", detail:"Babbel + OnlineItalianClub", target:90 },
  { short:"TEST 5", detail:"Self-test: 20 passato prossimo sentences (essere vs avere). Write and self-correct.", target:90, type:"test" },
  { short:"Rest + review", detail:"Babbel vocab review", target:20, type:"rest" },
 ]},
 { phase:3, label:"Week 6", focus:"Intermediate", dateRange:"Jul 1 – Jul 7", days:[
  { short:"Imperfetto form.", detail:"Babbel · OnlineItalianClub imperfetto", target:90 },
  { short:"Imperfetto use", detail:"CBT Ep.13 · OnlineItalianClub imperfetto use", target:75 },
  { short:"PP vs Imperfetto", detail:"Babbel + OnlineItalianClub contrast", target:90 },
  { short:"Contrast drills", detail:"CBT Ep.14 · Write 10 contrast sentences", target:75 },
  { short:"Past contrast", detail:"Babbel + OnlineItalianClub", target:90 },
  { short:"TEST 6", detail:"Self-test: 15 sentences choosing between PP and imperfetto. Self-correct.", target:90, type:"test" },
  { short:"Rest + review", detail:"Babbel vocab review", target:20, type:"rest" },
 ]},
 { phase:3, label:"Week 7", focus:"Intermediate", dateRange:"Jul 8 – Jul 14", days:[
  { short:"Futuro semplice", detail:"Babbel · OnlineItalianClub futuro", target:90 },
  { short:"Indirect pronouns", detail:"CBT Ep.15 · OnlineItalianClub indirect pronouns", target:75 },
  { short:"Combined pronouns", detail:"Babbel + OnlineItalianClub combo", target:90 },
  { short:"glielo drills", detail:"CBT Ep.16 · Write sentences", target:75 },
  { short:"Future + pronouns", detail:"Babbel + OnlineItalianClub", target:90 },
  { short:"TEST 7", detail:"Self-test: futuro + all pronoun types. 20 sentences. Self-correct.", target:90, type:"test" },
  { short:"Rest + review", detail:"Babbel vocab review", target:20, type:"rest" },
 ]},
 { phase:3, label:"Week 8", focus:"Intermediate", dateRange:"Jul 15 – Jul 21", days:[
  { short:"Condizionale", detail:"Babbel · OnlineItalianClub conditional", target:90 },
  { short:"Imperativo", detail:"CBT Ep.17 · OnlineItalianClub imperative", target:75 },
  { short:"Comparatives", detail:"Babbel + OnlineItalianClub comparatives", target:90 },
  { short:"Superlatives", detail:"CBT Ep.18 · Write sentences", target:75 },
  { short:"Cond. / imp. review", detail:"Babbel + OnlineItalianClub", target:90 },
  { short:"TEST 8", detail:"Self-test: condizionale + imperativo + comparatives. 25 mixed sentences.", target:90, type:"test" },
  { short:"Rest + review", detail:"Babbel vocab review", target:20, type:"rest" },
 ]},
 { phase:4, label:"Week 9", focus:"Exam Prep", dateRange:"Jul 22 – Jul 28", days:[
  { short:"Full review", detail:"OnlineItalianClub all sections all decks", target:90 },
  { short:"MOCK EXAM 1", detail:"60 MC timed 60min · Simulate real conditions · Score yourself", target:60, type:"mock" },
  { short:"Mock 1 review", detail:"Every wrong answer · OnlineItalianClub targeted drills", target:90 },
  { short:"MOCK EXAM 2", detail:"60 MC timed 60min · Note score vs mock 1", target:60, type:"mock" },
  { short:"Mock 2 review", detail:"Weak spots only focus", target:75 },
  { short:"Writing practice", detail:"CBT 2 episodes + write 15 sentences from memory", target:60 },
  { short:"Rest + review", detail:"Babbel vocab review", target:20, type:"rest" },
 ]},
 { phase:4, label:"Week 10", focus:"Exam Prep", dateRange:"Jul 29 – Aug 4", days:[
  { short:"Reading comp.", detail:"Italian passages · Timed comprehension Qs · OnlineItalianClub reading", target:90 },
  { short:"MOCK EXAM 3", detail:"60 MC timed 60min · Aim for consistent score", target:60, type:"mock" },
  { short:"Mock 3 review", detail:"Weak spots only · OnlineItalianClub targeted drills", target:75 },
  { short:"MOCK EXAM 4", detail:"60 MC timed 60min · Final benchmark", target:60, type:"mock" },
  { short:"Vocab top-up", detail:"Focus on words you keep missing", target:45 },
  { short:"Writing practice", detail:"CBT + write a short paragraph in Italian", target:60 },
  { short:"Rest + review", detail:"Babbel vocab review", target:20, type:"rest" },
 ]},
 { phase:4, label:"Week 11", focus:"Final Polish", dateRange:"Aug 5 – Aug 11", days:[
  { short:"MOCK EXAM 5", detail:"60 MC timed · Last full practice run", target:60, type:"mock" },
  { short:"Weak spots", detail:"Final targeted drills · OnlineItalianClub weak areas", target:75 },
  { short:"Light grammar", detail:"Skim key grammar tables only", target:45 },
  { short:"Rest day", detail:"No studying · Let it consolidate", target:0, type:"rest" },
  { short:"Quick review", detail:"30 min max · Key verb tables only", target:30 },
  { short:"Rest day", detail:"No studying · Sleep well", target:0, type:"rest" },
  { short:"Rest / light Anki", detail:"Babbel vocab review if you want · No cramming", target:15, type:"rest" },
 ]},
 { phase:5, label:"Exam Window", focus:"Aug 12–16", dateRange:"Aug 12 – Aug 18", days:[
  { short:"TAKE EXAM", detail:"cas.nyu.edu/flpexam · Email result to italian.dept@nyu.edu same day", target:0, type:"exam-window" },
  { short:"TAKE EXAM", detail:"cas.nyu.edu/flpexam · Email result to italian.dept@nyu.edu same day", target:0, type:"exam-window" },
  { short:"TAKE EXAM", detail:"cas.nyu.edu/flpexam · Email result to italian.dept@nyu.edu same day", target:0, type:"exam-window" },
  { short:"TAKE EXAM", detail:"cas.nyu.edu/flpexam · Email result to italian.dept@nyu.edu same day", target:0, type:"exam-window" },
  { short:"TAKE EXAM", detail:"cas.nyu.edu/flpexam · Email result to italian.dept@nyu.edu same day", target:0, type:"exam-window" },
  { short:"buffer", detail:"Retake window or registration follow-up if needed", target:0, type:"rest" },
  { short:"buffer", detail:"Retake window or registration follow-up if needed", target:0, type:"rest" },
 ]},
];

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const phaseColors = { 1:{accent:"#e94560"}, 2:{accent:"#53c0f0"}, 3:{accent:"#f5a623"}, 4:{accent:"#a8e063"}, 5:{accent:"#c084fc"} };
const typeStyles = {
 test:{ border:"#f5a62344", bg:"#f5a6230a", label:"TEST", labelColor:"#f5a623" },
 mock:{ border:"#a8e06344", bg:"#a8e0630a", label:"MOCK", labelColor:"#a8e063" },
 rest:{ border:"#ffffff14", bg:"transparent", label:"REST", labelColor:"#e8e8e835" },
 "exam-window":{ border:"#c084fc44", bg:"#c084fc0a", label:"EXAM", labelColor:"#c084fc" },
};

const SYSTEM_PROMPT = `You are an Italian study coach embedded in a 11-week NYU placement exam prep tracker. The student is learning Italian from scratch and targeting intermediate placement (ITAL-UA 11) to skip 2 semesters. They use Babbel, Coffee Break Italian podcast, Anki vocab, and OnlineItalianClub for free grammar exercises. The exam is Aug 12-16 and is 60 multiple choice questions covering articles, verb conjugation, pronouns, prepositions, and reading comprehension.

When the student tells you what they did for a day, you should:
1. Acknowledge what they completed
2. If they did extra, note it positively and suggest how it helps
3. Suggest any adjustments to upcoming days based on their progress
4. Keep responses SHORT — 2-4 sentences max
5. Be direct and practical, not overly encouraging

You also answer general Italian learning questions, grammar questions, and study strategy questions.`;

async function callClaude(messages) {
 const res = await fetch("/api/claude", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
   model: "claude-sonnet-4-20250514",
   max_tokens: 1000,
   system: SYSTEM_PROMPT,
   messages,
  }),
 });
 const data = await res.json();
 return data.content?.[0]?.text || "Error — try again.";
}

async function analyzeEntry(dayShort, dayDetail, userText) {
 const prompt = `Today's planned task: "${dayShort}" — ${dayDetail}

What the student actually did: "${userText}"

Did they complete the task? Should the day be marked done? Reply with JSON only: {"done": true/false, "feedback": "1-2 sentence feedback"}`;

 const res = await fetch("/api/claude", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
   model: "claude-sonnet-4-20250514",
   max_tokens: 200,
   system: "You analyze Italian study logs. Reply ONLY with valid JSON, no markdown, no explanation.",
   messages: [{ role: "user", content: prompt }],
  }),
 });
 const data = await res.json();
 const text = data.content?.[0]?.text || '{"done":false,"feedback":"Could not analyze."}';
 try { return JSON.parse(text.replace(/```json|```/g, "").trim()); }
 catch { return { done: false, feedback: "Could not parse response." }; }
}

function DayCard({ day, di, weekIdx, isDone, noteText, onToggle, onNoteChange, todayIdx }) {
 const [localNote, setLocalNote] = useState(noteText || "");
 const [analyzing, setAnalyzing] = useState(false);
 const [feedback, setFeedback] = useState("");
 const gi = weekIdx * 7 + di;
 const isToday = gi === todayIdx;
 const ts = typeStyles[day.type || "normal"] || {};
 const borderCol = isDone ? "#4caf5055" : isToday ? "#f5a62440" : ts.border || "#ffffff14";
 const bgCol = isDone ? "#1c3a1c" : ts.bg || "#ffffff07";

 const handleNoteSubmit = async () => {
  if (!localNote.trim()) return;
  setAnalyzing(true);
  setFeedback("");
  try {
   const result = await analyzeEntry(day.short, day.detail, localNote);
   setFeedback(result.feedback);
   onNoteChange(weekIdx, di, localNote, result.done);
  } catch {
   setFeedback("Error analyzing — saved anyway.");
   onNoteChange(weekIdx, di, localNote, false);
  }
  setAnalyzing(false);
 };

 return (
  <div style={{ background: bgCol, border: `1px solid ${borderCol}`, borderRadius: 10, padding: "12px 10px", display:"flex", flexDirection:"column", gap:6 }}>
   {day.type && day.type !== "normal"
    ? <div style={{ fontSize:10, fontWeight:500, letterSpacing:1.5, color: isDone?"#4caf5055":ts.labelColor, textTransform:"uppercase" }}>{ts.label}</div>
    : <div style={{ fontSize:11, color: isDone?"#4caf5050": isToday?"#f5a623":"#e8e8e825" }}>{isDone ? "✓ done" : isToday ? "today" : DATES[gi]||""}</div>
   }
   <div onClick={() => onToggle(weekIdx, di)} style={{ fontSize:14, fontWeight:500, cursor:"pointer", lineHeight:1.3,
    color: isDone?"#4caf50bb": day.type==="exam-window"?"#c084fc": day.type==="mock"?"#a8e063": day.type==="test"?"#f5a623":"#e8e8e8" }}>
    {day.short}
   </div>
   <div style={{ fontSize:11, color: isDone?"#4caf5045":"#e8e8e888", lineHeight:1.5 }}>{day.detail}</div>
   {day.type !== "rest" && (
    <div style={{ marginTop:4 }}>
     <textarea
      value={localNote}
      onChange={e => setLocalNote(e.target.value)}
      onKeyDown={e => { if(e.key==="Enter" && !e.shiftKey){ e.preventDefault(); handleNoteSubmit(); }}}
      placeholder="what did you do? enter to save"
      rows={2}
      style={{ width:"100%", background:"#ffffff0d", border:"1px solid #ffffff18", borderRadius:6, color:"#e8e8e8", fontFamily:"'DM Mono',monospace", fontSize:11, padding:"6px 8px", resize:"none", outline:"none" }}
     />
     {analyzing && <div style={{ fontSize:10, color:"#f5a623", marginTop:3 }}>analyzing...</div>}
     {feedback && <div style={{ fontSize:10, color:"#a8e063", marginTop:3, lineHeight:1.4 }}>{feedback}</div>}
    </div>
   )}
  </div>
 );
}

function Chatbot({ onClose }) {
 const [messages, setMessages] = useState(() => {
  try { return JSON.parse(localStorage.getItem(CHAT_KEY) || "[]"); } catch { return []; }
 });
 const [input, setInput] = useState("");
 const [loading, setLoading] = useState(false);
 const bottomRef = useRef(null);

 useEffect(() => {
  bottomRef.current?.scrollIntoView({ behavior:"smooth" });
 }, [messages]);

 const send = async () => {
  if (!input.trim() || loading) return;
  const userMsg = { role:"user", content: input };
  const next = [...messages, userMsg];
  setMessages(next);
  setInput("");
  setLoading(true);
  try {
   const reply = await callClaude(next.slice(-10));
   const updated = [...next, { role:"assistant", content: reply }];
   setMessages(updated);
   try { localStorage.setItem(CHAT_KEY, JSON.stringify(updated.slice(-30))); } catch {}
  } catch {
   setMessages([...next, { role:"assistant", content:"Error — check your API key." }]);
  }
  setLoading(false);
 };

 return (
  <div style={{ position:"fixed", right:0, top:0, bottom:0, width:340, background:"#0f0f1a", borderLeft:"1px solid #ffffff14", display:"flex", flexDirection:"column", zIndex:100 }}>
   <div style={{ padding:"16px 18px", borderBottom:"1px solid #ffffff0e", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
    <div>
     <div style={{ fontSize:13, fontWeight:500, color:"#e8e8e8" }}>Italian coach</div>
     <div style={{ fontSize:10, color:"#e8e8e855", marginTop:2 }}>ask anything · log progress</div>
    </div>
    <button onClick={onClose} style={{ background:"none", border:"none", color:"#e8e8e855", cursor:"pointer", fontSize:18 }}>×</button>
   </div>
   <div style={{ flex:1, overflowY:"auto", padding:"14px 18px", display:"flex", flexDirection:"column", gap:10 }}>
    {messages.length === 0 && (
     <div style={{ fontSize:12, color:"#e8e8e840", lineHeight:1.6 }}>
      Hey — I'm your Italian study coach. Ask me grammar questions, tell me what you did today, or ask about the plan.
     </div>
    )}
    {messages.map((m, i) => (
     <div key={i} style={{ display:"flex", justifyContent: m.role==="user"?"flex-end":"flex-start" }}>
      <div style={{
       maxWidth:"85%", padding:"9px 12px", borderRadius:10, fontSize:12, lineHeight:1.55,
       background: m.role==="user" ? "#53c0f025" : "#ffffff0a",
       border: m.role==="user" ? "1px solid #53c0f035" : "1px solid #ffffff12",
       color: m.role==="user" ? "#c0e8f8" : "#e8e8e8cc",
      }}>
       {m.content}
      </div>
     </div>
    ))}
    {loading && (
     <div style={{ display:"flex", justifyContent:"flex-start" }}>
      <div style={{ padding:"9px 12px", borderRadius:10, fontSize:12, background:"#ffffff0a", border:"1px solid #ffffff12", color:"#e8e8e840" }}>...</div>
     </div>
    )}
    <div ref={bottomRef}/>
   </div>
   <div style={{ padding:"12px 18px", borderTop:"1px solid #ffffff0e", display:"flex", gap:8 }}>
    <input
     value={input}
     onChange={e => setInput(e.target.value)}
     onKeyDown={e => e.key==="Enter" && send()}
     placeholder="message..."
     style={{ flex:1, background:"#ffffff0d", border:"1px solid #ffffff18", borderRadius:8, color:"#e8e8e8", fontFamily:"'DM Mono',monospace", fontSize:12, padding:"8px 12px", outline:"none" }}
    />
    <button onClick={send} disabled={loading} style={{ background:"#53c0f018", border:"1px solid #53c0f035", borderRadius:8, color:"#53c0f0", padding:"8px 14px", cursor:"pointer", fontSize:12, fontFamily:"'DM Mono',monospace" }}>
     send
    </button>
   </div>
  </div>
 );
}

export default function App() {
 const [data, setData] = useState({ done:{}, notes:{} });
 const [loaded, setLoaded] = useState(false);
 const [activeWeek, setActiveWeek] = useState(0);
 const [saving, setSaving] = useState(false);
 const [chatOpen, setChatOpen] = useState(false);
 const saveTimer = useRef(null);

 useEffect(() => {
  try {
   const raw = localStorage.getItem(STORAGE_KEY);
   if (raw) setData(JSON.parse(raw));
  } catch(e) {}
  setLoaded(true);
 }, []);

 useEffect(() => {
  if (!loaded) return;
  const today = new Date();
  const start = new Date('2025-05-27');
  const diff = Math.floor((today - start) / 86400000);
  if (diff >= 0 && diff < 84) setActiveWeek(Math.floor(diff / 7));
 }, [loaded]);

 const persist = useCallback((next) => {
  if (saveTimer.current) clearTimeout(saveTimer.current);
  setSaving(true);
  saveTimer.current = setTimeout(() => {
   try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch(e){}
   setSaving(false);
  }, 400);
 }, []);

 const toggleDone = useCallback((wk, di) => {
  const key = `${wk}-${di}`;
  const next = { ...data, done: { ...data.done, [key]: !data.done[key] } };
  setData(next); persist(next);
 }, [data, persist]);

 const handleNoteChange = useCallback((wk, di, note, aiDone) => {
  const key = `${wk}-${di}`;
  const next = {
   ...data,
   notes: { ...data.notes, [key]: note },
   done: { ...data.done, [key]: aiDone || data.done[key] },
  };
  setData(next); persist(next);
 }, [data, persist]);

 const totalDays = weekData.slice(0,11).reduce((a,w) => a + w.days.length, 0);
 const daysChecked = Object.values(data.done||{}).filter(Boolean).length;
 const pct = Math.round((daysChecked / totalDays) * 100);

 const today = new Date();
 const start = new Date('2025-05-27');
 const todayIdx = Math.floor((today - start) / 86400000);

 const week = weekData[activeWeek];
 const ac = phaseColors[week.phase]?.accent || "#e8e8e8";

 if (!loaded) return (
  <div style={{ minHeight:"100vh", background:"#0a0a0f", display:"flex", alignItems:"center", justifyContent:"center" }}>
   <span style={{ color:"#ffffff30", fontFamily:"monospace", fontSize:14, letterSpacing:3 }}>loading...</span>
  </div>
 );

 return (
  <div style={{ minHeight:"100vh", background:"#0a0a0f", fontFamily:"'DM Mono','Courier New',monospace", color:"#e8e8e8" }}>
   <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body, #root { width: 100%; min-height: 100vh; background: #0a0a0f; }
    .wtab { background: none; border: none; cursor: pointer; font-family: 'DM Mono', monospace; font-size: 13px; padding: 6px 12px; border-radius: 6px; transition: all 0.12s; color: #e8e8e848; white-space: nowrap; }
    .wtab:hover { color: #e8e8e8; background: #ffffff0e; }
    .wtab.on { color: #e8e8e8; background: #ffffff1a; font-weight: 500; }
    textarea::placeholder, input::placeholder { color: #e8e8e830; }
    ::-webkit-scrollbar { width: 3px; } ::-webkit-scrollbar-thumb { background: #ffffff18; border-radius: 2px; }
   `}</style>

   <div style={{ padding:"28px 28px 40px", paddingRight: chatOpen ? 368 : 28, transition:"padding-right 0.2s" }}>

    <div style={{ marginBottom:28 }}>
     <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
      <span style={{ fontSize:11, letterSpacing:3, color:"#e8e8e855", textTransform:"uppercase" }}>italiano · nyu placement prep</span>
      <div style={{ display:"flex", alignItems:"center", gap:14 }}>
       <span style={{ fontSize:11, color: saving?"#f5a623":"#e8e8e825", transition:"color 0.3s" }}>{saving?"saving...":"saved"}</span>
       <button onClick={() => setChatOpen(!chatOpen)} style={{ background: chatOpen?"#53c0f020":"#ffffff0a", border:`1px solid ${chatOpen?"#53c0f040":"#ffffff18"}`, borderRadius:8, color: chatOpen?"#53c0f0":"#e8e8e8aa", padding:"7px 14px", cursor:"pointer", fontSize:12, fontFamily:"'DM Mono',monospace", transition:"all 0.15s" }}>
        {chatOpen ? "close coach" : "ai coach ↗"}
       </button>
      </div>
     </div>
     <h1 style={{ fontSize:36, fontWeight:500, letterSpacing:-1, marginBottom:6 }}>11-week plan</h1>
     <div style={{ fontSize:13, color:"#e8e8e855", marginBottom:20 }}>May 27 – Aug 18 · exam window Aug 12–16</div>

     <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:16 }}>
      {[
       { label:"days done", val:`${daysChecked}/${totalDays}`, sub:`${pct}% complete` },
       { label:"current week", val:week.label, sub:week.dateRange },
       { label:"checkpoints", val:"8 tests", sub:"+ 5 mock exams" },
      ].map(({ label, val, sub }) => (
       <div key={label} style={{ background:"#ffffff07", border:"1px solid #ffffff0f", borderRadius:10, padding:"14px 18px" }}>
        <div style={{ fontSize:10, color:"#e8e8e855", letterSpacing:2, textTransform:"uppercase", marginBottom:6 }}>{label}</div>
        <div style={{ fontSize:20, fontWeight:500, marginBottom:3 }}>{val}</div>
        <div style={{ fontSize:11, color:"#e8e8e855" }}>{sub}</div>
       </div>
      ))}
     </div>
     <div style={{ height:3, background:"#ffffff0a", borderRadius:2 }}>
      <div style={{ height:"100%", borderRadius:2, background:"#4caf50", width:`${pct}%`, transition:"width 0.4s" }}/>
     </div>
    </div>

    <div style={{ display:"flex", gap:12, marginBottom:16, flexWrap:"wrap", alignItems:"center" }}>
     {[["#4caf50","checked done"],["#f5a623","weekly test"],["#a8e063","mock exam"],["#c084fc","exam window"]].map(([c,l]) => (
      <div key={l} style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, color:"#e8e8e870" }}>
       <div style={{ width:8, height:8, borderRadius:2, background:c, opacity:0.8 }}/>
       {l}
      </div>
     ))}
     <span style={{ fontSize:11, color:"#e8e8e840", marginLeft:"auto" }}>type what you did · enter to log · click title to check</span>
    </div>

    <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginBottom:18 }}>
     {weekData.map((w,i) => {
      const wd = w.days.filter((_,di) => data.done[`${i}-${di}`]).length;
      const isCur = todayIdx >= i*7 && todayIdx < (i+1)*7;
      return (
       <button key={i} className={`wtab${activeWeek===i?" on":""}`} onClick={() => setActiveWeek(i)}>
        {w.label}
        {isCur && <span style={{ color:"#f5a623", marginLeft:3 }}>·</span>}
        {wd > 0 && <span style={{ color:"#4caf5075", marginLeft:3 }}>{wd}/{w.days.length}</span>}
       </button>
      );
     })}
    </div>

    <div style={{ background:"#ffffff05", border:"1px solid #ffffff0e", borderRadius:14, padding:"20px", marginBottom:16 }}>
     <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:18, flexWrap:"wrap" }}>
      <span style={{ fontSize:11, letterSpacing:2, padding:"4px 12px", border:`1px solid ${ac}30`, color:ac, borderRadius:20, textTransform:"uppercase" }}>{week.focus}</span>
      <span style={{ fontSize:18, fontWeight:500 }}>{week.label}</span>
      <span style={{ fontSize:13, color:"#e8e8e855" }}>{week.dateRange}</span>
      <span style={{ marginLeft:"auto", fontSize:13, color:"#e8e8e845" }}>
       {week.days.filter((_,di) => data.done[`${activeWeek}-${di}`]).length}/{week.days.length} done
      </span>
     </div>

     <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:8, marginBottom:8 }}>
      {DAYS.map((d,i) => {
       const gi = activeWeek*7+i;
       return (
        <div key={d} style={{ textAlign:"center" }}>
         <div style={{ fontSize:11, color:"#e8e8e845", letterSpacing:1, marginBottom:3 }}>{d}</div>
         <div style={{ fontSize:12, color: gi===todayIdx?"#f5a623":"#e8e8e840" }}>{DATES[gi]||""}</div>
        </div>
       );
      })}
     </div>

     <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:8 }}>
      {week.days.map((day, di) => (
       <DayCard
        key={di}
        day={day}
        di={di}
        weekIdx={activeWeek}
        isDone={!!data.done[`${activeWeek}-${di}`]}
        noteText={data.notes?.[`${activeWeek}-${di}`] || ""}
        onToggle={toggleDone}
        onNoteChange={handleNoteChange}
        todayIdx={todayIdx}
       />
      ))}
     </div>
    </div>

    <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:20 }}>
     {[
      { label:"daily target", val:"90 min" },
      { label:"core tools", val:"Babbel · CBT" },
      { label:"grammar (free)", val:"onlineitalianclub.com" },
     ].map(({ label, val }) => (
      <div key={label} style={{ background:"#ffffff05", border:"1px solid #ffffff0e", borderRadius:10, padding:"12px 16px" }}>
       <div style={{ fontSize:10, color:"#e8e8e845", letterSpacing:2, textTransform:"uppercase", marginBottom:5 }}>{label}</div>
       <div style={{ fontSize:13, color:"#e8e8e8cc" }}>{val}</div>
      </div>
     ))}
    </div>

    <div style={{ marginBottom:20 }}>
     <div style={{ fontSize:10, color:"#e8e8e855", letterSpacing:2, textTransform:"uppercase", marginBottom:12 }}>quick links</div>
     <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
      {[
       { label:"Babbel", url:"https://www.babbel.com", color:"#e94560" },
       { label:"Coffee Break Italian", url:"https://coffeebreaklanguages.com/coffeebreakitalian", color:"#53c0f0" },
       { label:"Grammar exercises (free)", url:"https://onlineitalianclub.com/free-italian-exercises-and-resources/online-italian-course-beginner-level-a1/", color:"#a8e063" },
       { label:"Vocab drills (free)", url:"https://lingua.com/italian/grammar/", color:"#c084fc" },
       { label:"NYU Placement Exam", url:"https://cas.nyu.edu/academic-programs/academic-success/placementexams.html", color:"#f472b6" },
      ].map(({ label, url, color }) => (
       <a key={label} href={url} target="_blank" rel="noopener noreferrer"
        style={{ display:"inline-flex", alignItems:"center", padding:"8px 16px", borderRadius:8, border:`1px solid ${color}30`, background:`${color}0d`, color, fontSize:13, fontFamily:"'DM Mono',monospace", textDecoration:"none" }}
        onMouseEnter={e => { e.currentTarget.style.background=`${color}22`; e.currentTarget.style.borderColor=`${color}55`; }}
        onMouseLeave={e => { e.currentTarget.style.background=`${color}0d`; e.currentTarget.style.borderColor=`${color}30`; }}>
        {label} ↗
       </a>
      ))}
     </div>
    </div>

    <div style={{ fontSize:11, color:"#e8e8e845" }}>
     saves to localStorage · never resets · click title to check · type what you did + enter to log · ai coach in sidebar
    </div>
   </div>

   {chatOpen && <Chatbot onClose={() => setChatOpen(false)} />}
  </div>
 );
}
