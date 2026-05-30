import { useState, useEffect, useCallback, useRef } from "react";

const STORAGE_KEY = "italian-tracker-v5";
const CHAT_KEY = "italian-tracker-chat-v5";
const SCHEDULE_KEY = "italian-tracker-schedule-v5";

const START_DATE = new Date('2025-05-29');

const DATES = ["May 29","May 30","May 31","Jun 1","Jun 2","Jun 3","Jun 4","Jun 5","Jun 6","Jun 7","Jun 8","Jun 9","Jun 10","Jun 11","Jun 12","Jun 13","Jun 14","Jun 15","Jun 16","Jun 17","Jun 18","Jun 19","Jun 20","Jun 21","Jun 22","Jun 23","Jun 24","Jun 25","Jun 26","Jun 27","Jun 28","Jun 29","Jun 30","Jul 1","Jul 2","Jul 3","Jul 4","Jul 5","Jul 6","Jul 7","Jul 8","Jul 9","Jul 10","Jul 11","Jul 12","Jul 13","Jul 14","Jul 15","Jul 16","Jul 17","Jul 18","Jul 19","Jul 20","Jul 21","Jul 22","Jul 23","Jul 24","Jul 25","Jul 26","Jul 27","Jul 28","Jul 29","Jul 30","Jul 31","Aug 1","Aug 2","Aug 3","Aug 4","Aug 5","Aug 6","Aug 7","Aug 8","Aug 9","Aug 10","Aug 11","Aug 12","Aug 13","Aug 14","Aug 15","Aug 16","Aug 17","Aug 18","Aug 19","Aug 20"];

// Day offset from start: May 29 = 0. Week 1 starts Friday so shorter first week.
// We use flat day index 0-83, grouped into display weeks of 7
const DEFAULT_DAYS = [
  // Week 1: May 29–Jun 4 (starts Friday)
  { short:"Articles + essere", detail:"Babbel lesson 1 · CBT Ep.1 · OnlineItalianClub articles · Babbel vocab review", type:"normal" },
  { short:"Gender & plural", detail:"CBT Ep.2 · Write 5 sentences · OnlineItalianClub plurals", type:"normal" },
  { short:"essere review", detail:"Babbel + OnlineItalianClub essere/avere · Babbel vocab review", type:"normal" },
  { short:"lo / gli / le", detail:"CBT Ep.3 · Write 5 sentences · Babbel vocab review", type:"normal" },
  { short:"Articles review", detail:"Babbel lesson 2 · CBT Ep.4 · OnlineItalianClub drills", type:"normal" },
  { short:"TEST 1", detail:"Self-test: articles, gender, essere/avere. Write 20 sentences. Grade yourself.", type:"test" },
  { short:"Rest + review", detail:"Babbel vocab review · Light CBT", type:"rest" },
  // Week 2: Jun 5–11
  { short:"avere present", detail:"Babbel · OnlineItalianClub verbs · Babbel vocab review", type:"normal" },
  { short:"-are verbs", detail:"CBT Ep.5 · Write sentences · OnlineItalianClub -are drills", type:"normal" },
  { short:"-ere/-ire verbs", detail:"Babbel + OnlineItalianClub · Babbel vocab review", type:"normal" },
  { short:"Irregular verbs", detail:"CBT Ep.6 · Write sentences · OnlineItalianClub irregular", type:"normal" },
  { short:"Adj. agreement", detail:"Babbel + OnlineItalianClub adj exercises · Babbel vocab review", type:"normal" },
  { short:"TEST 2", detail:"Self-test: all regular verbs present tense + adj. agreement. Conjugate 15 verbs cold.", type:"test" },
  { short:"Rest + review", detail:"Babbel vocab review · Light CBT", type:"rest" },
  // Week 3: Jun 12–18
  { short:"Prepositions", detail:"Babbel · OnlineItalianClub prepositions · Babbel vocab review", type:"normal" },
  { short:"del / della", detail:"CBT Ep.7 · Write sentences · OnlineItalianClub contractions", type:"normal" },
  { short:"Numbers + time", detail:"Babbel + OnlineItalianClub · Babbel vocab review", type:"normal" },
  { short:"da / in / con / su", detail:"CBT Ep.8 · Write sentences · OnlineItalianClub drills", type:"normal" },
  { short:"Prep. review", detail:"Babbel + OnlineItalianClub · Babbel vocab review", type:"normal" },
  { short:"TEST 3", detail:"Self-test: prepositions + contractions. Fill 25 blanks, translate 10 sentences.", type:"test" },
  { short:"Rest + review", detail:"Babbel vocab review", type:"rest" },
  // Week 4: Jun 19–25
  { short:"potere/volere/dovere", detail:"Babbel · OnlineItalianClub modals · Babbel vocab review", type:"normal" },
  { short:"Reflexive verbs", detail:"CBT Ep.9 · OnlineItalianClub reflexive exercises · Babbel vocab review", type:"normal" },
  { short:"mi / ti / lo / la", detail:"Babbel + OnlineItalianClub pronouns · Babbel vocab review", type:"normal" },
  { short:"Direct obj. pronouns", detail:"CBT Ep.10 · Write sentences · Babbel vocab review", type:"normal" },
  { short:"Modal + pronoun combo", detail:"Babbel + OnlineItalianClub combo drills · Babbel vocab review", type:"normal" },
  { short:"TEST 4", detail:"Self-test: modals + direct object pronouns. 20 translation sentences.", type:"test" },
  { short:"Rest + review", detail:"Babbel vocab review", type:"rest" },
  // Week 5: Jun 26–Jul 2
  { short:"Passato prossimo", detail:"Babbel · OnlineItalianClub passato exercises · Babbel vocab review", type:"normal" },
  { short:"avere auxiliary", detail:"CBT Ep.11 · OnlineItalianClub avere drills · Babbel vocab review", type:"normal" },
  { short:"essere auxiliary", detail:"Babbel + OnlineItalianClub essere drills · Babbel vocab review", type:"normal" },
  { short:"Irregular past", detail:"CBT Ep.12 · Write sentences · OnlineItalianClub irregular past", type:"normal" },
  { short:"Past tense review", detail:"Babbel + OnlineItalianClub · Babbel vocab review", type:"normal" },
  { short:"TEST 5", detail:"Self-test: 20 passato prossimo sentences (essere vs avere). Write and self-correct.", type:"test" },
  { short:"Rest + review", detail:"Babbel vocab review", type:"rest" },
  // Week 6: Jul 3–9
  { short:"Imperfetto form.", detail:"Babbel · OnlineItalianClub imperfetto · Babbel vocab review", type:"normal" },
  { short:"Imperfetto use", detail:"CBT Ep.13 · OnlineItalianClub imperfetto use · Babbel vocab review", type:"normal" },
  { short:"PP vs Imperfetto", detail:"Babbel + OnlineItalianClub contrast · Babbel vocab review", type:"normal" },
  { short:"Contrast drills", detail:"CBT Ep.14 · Write 10 contrast sentences · Babbel vocab review", type:"normal" },
  { short:"Past contrast review", detail:"Babbel + OnlineItalianClub · Babbel vocab review", type:"normal" },
  { short:"TEST 6", detail:"Self-test: 15 sentences choosing between PP and imperfetto. Self-correct.", type:"test" },
  { short:"Rest + review", detail:"Babbel vocab review", type:"rest" },
  // Week 7: Jul 10–16
  { short:"Futuro semplice", detail:"Babbel · OnlineItalianClub futuro · Babbel vocab review", type:"normal" },
  { short:"Indirect pronouns", detail:"CBT Ep.15 · OnlineItalianClub indirect pronouns · Babbel vocab review", type:"normal" },
  { short:"Combined pronouns", detail:"Babbel + OnlineItalianClub combo · Babbel vocab review", type:"normal" },
  { short:"glielo drills", detail:"CBT Ep.16 · Write sentences · Babbel vocab review", type:"normal" },
  { short:"Future + pronouns", detail:"Babbel + OnlineItalianClub · Babbel vocab review", type:"normal" },
  { short:"TEST 7", detail:"Self-test: futuro + all pronoun types. 20 sentences. Self-correct.", type:"test" },
  { short:"Rest + review", detail:"Babbel vocab review", type:"rest" },
  // Week 8: Jul 17–23
  { short:"Condizionale", detail:"Babbel · OnlineItalianClub conditional · Babbel vocab review", type:"normal" },
  { short:"Imperativo", detail:"CBT Ep.17 · OnlineItalianClub imperative · Babbel vocab review", type:"normal" },
  { short:"Comparatives", detail:"Babbel + OnlineItalianClub comparatives · Babbel vocab review", type:"normal" },
  { short:"Superlatives", detail:"CBT Ep.18 · Write sentences · Babbel vocab review", type:"normal" },
  { short:"Cond. / imp. review", detail:"Babbel + OnlineItalianClub · Babbel vocab review", type:"normal" },
  { short:"TEST 8", detail:"Self-test: condizionale + imperativo + comparatives. 25 mixed sentences.", type:"test" },
  { short:"Rest + review", detail:"Babbel vocab review", type:"rest" },
  // Week 9: Jul 24–30
  { short:"Full tense review", detail:"OnlineItalianClub all sections · Babbel vocab review", type:"normal" },
  { short:"MOCK EXAM 1", detail:"60 MC timed 60min · Simulate real conditions · Score yourself", type:"mock" },
  { short:"Mock 1 review", detail:"Every wrong answer · OnlineItalianClub targeted drills", type:"normal" },
  { short:"MOCK EXAM 2", detail:"60 MC timed 60min · Note score vs mock 1", type:"mock" },
  { short:"Mock 2 review", detail:"Weak spots only · Babbel vocab review", type:"normal" },
  { short:"Writing practice", detail:"CBT 2 episodes + write 15 sentences from memory", type:"normal" },
  { short:"Rest + review", detail:"Babbel vocab review", type:"rest" },
  // Week 10: Jul 31–Aug 6
  { short:"Reading comp.", detail:"Italian passages · Timed comprehension Qs · OnlineItalianClub reading", type:"normal" },
  { short:"MOCK EXAM 3", detail:"60 MC timed 60min · Aim for consistent score", type:"mock" },
  { short:"Mock 3 review", detail:"Weak spots only · OnlineItalianClub targeted drills", type:"normal" },
  { short:"MOCK EXAM 4", detail:"60 MC timed 60min · Final benchmark", type:"mock" },
  { short:"Vocab top-up", detail:"Babbel vocab review · Focus on words you keep missing", type:"normal" },
  { short:"Writing practice", detail:"CBT + write a short paragraph in Italian", type:"normal" },
  { short:"Rest + review", detail:"Babbel vocab review", type:"rest" },
  // Week 11: Aug 7–13
  { short:"MOCK EXAM 5", detail:"60 MC timed · Last full practice run", type:"mock" },
  { short:"Weak spots", detail:"Final targeted drills · OnlineItalianClub weak areas", type:"normal" },
  { short:"Light grammar", detail:"Skim key grammar tables only · Babbel vocab review", type:"normal" },
  { short:"Rest day", detail:"No studying · Let it consolidate", type:"rest" },
  { short:"Quick review", detail:"30 min max · Key verb tables only", type:"normal" },
  { short:"Rest day", detail:"No studying · Sleep well", type:"rest" },
  { short:"Rest / light review", detail:"Babbel vocab review only if you want · No cramming", type:"rest" },
  // Week 12 exam window: Aug 14–20
  { short:"TAKE EXAM", detail:"cas.nyu.edu/flpexam · Email result to italian.dept@nyu.edu same day", type:"exam-window" },
  { short:"TAKE EXAM", detail:"cas.nyu.edu/flpexam · Email result to italian.dept@nyu.edu same day", type:"exam-window" },
  { short:"TAKE EXAM", detail:"cas.nyu.edu/flpexam · Email result to italian.dept@nyu.edu same day", type:"exam-window" },
  { short:"TAKE EXAM", detail:"cas.nyu.edu/flpexam · Email result to italian.dept@nyu.edu same day", type:"exam-window" },
  { short:"TAKE EXAM", detail:"cas.nyu.edu/flpexam · Email result to italian.dept@nyu.edu same day", type:"exam-window" },
  { short:"buffer", detail:"Retake window or registration follow-up if needed", type:"rest" },
  { short:"buffer", detail:"Retake window or registration follow-up if needed", type:"rest" },
];

const WEEK_LABELS = [
  "Week 1 · May 29",
  "Week 2 · Jun 5",
  "Week 3 · Jun 12",
  "Week 4 · Jun 19",
  "Week 5 · Jun 26",
  "Week 6 · Jul 3",
  "Week 7 · Jul 10",
  "Week 8 · Jul 17",
  "Week 9 · Jul 24",
  "Week 10 · Jul 31",
  "Week 11 · Aug 7",
  "Exam · Aug 14",
];

const DAYS_OF_WEEK = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

// May 29 is a Thursday (index 3 in Mon=0 grid)
const START_DOW = 3; // Thursday

const typeStyles = {
  test:   { border:"#f5a62344", bg:"#f5a6230a", label:"TEST",   labelColor:"#f5a623" },
  mock:   { border:"#a8e06344", bg:"#a8e0630a", label:"MOCK",   labelColor:"#a8e063" },
  rest:   { border:"#ffffff14", bg:"transparent", label:"REST", labelColor:"#e8e8e835" },
  "exam-window": { border:"#c084fc44", bg:"#c084fc0a", label:"EXAM", labelColor:"#c084fc" },
  normal: { border:"#ffffff14", bg:"#ffffff07", label:"",       labelColor:"" },
};

const SYSTEM_PROMPT = `You are an Italian study coach for a NYU student learning Italian from scratch, targeting intermediate placement (ITAL-UA 11) to skip 2 semesters. Exam window: Aug 14-20. Tools: Babbel (paid, grammar + spaced repetition vocab), Coffee Break Italian podcast (free), OnlineItalianClub.com (free grammar exercises).

The 84-day schedule has 12 weeks. Days are indexed 0-83 from May 29. Each day has a "short" title and "detail" task description.

When the student tells you what they did or didn't do, you can suggest schedule changes. If they ask you to rewrite upcoming days, respond with ONLY a JSON array of day objects to replace from a given index, like:
{"action":"rewrite","fromIndex":5,"days":[{"short":"...","detail":"...","type":"normal"},...]

Type must be one of: normal, test, mock, rest, exam-window.

For general questions or feedback with no schedule changes, just reply in plain text, 2-4 sentences max. Be direct, practical, no fluff.`;

async function callClaude(messages) {
  const res = await fetch("/api/claude", {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000, system:SYSTEM_PROMPT, messages }),
  });
  const data = await res.json();
  return data.content?.[0]?.text || "Error — check API key in Vercel env vars.";
}

async function analyzeDay(dayShort, dayDetail, userText, dayIndex) {
  const prompt = `Day index: ${dayIndex}. Planned: "${dayShort}" — ${dayDetail}
Student says: "${userText}"
Reply with JSON only: {"done":true/false,"feedback":"1-2 sentences"}`;
  const res = await fetch("/api/claude", {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:200, system:"Reply ONLY with valid JSON, no markdown.", messages:[{role:"user",content:prompt}] }),
  });
  const data = await res.json();
  const text = data.content?.[0]?.text || '{"done":false,"feedback":"Could not analyze."}';
  try { return JSON.parse(text.replace(/```json|```/g,"").trim()); }
  catch { return { done:false, feedback:"Saved." }; }
}

function DayCard({ dayIndex, day, isDone, note, onToggle, onNoteChange, isToday }) {
  const [localNote, setLocalNote] = useState(note || "");
  const [analyzing, setAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState("");
  const ts = typeStyles[day.type] || typeStyles.normal;
  const borderCol = isDone ? "#4caf5055" : isToday ? "#f5a62440" : ts.border;
  const bgCol = isDone ? "#1c3a1c" : ts.bg;

  const submit = async () => {
    if (!localNote.trim()) return;
    setAnalyzing(true); setFeedback("");
    try {
      const r = await analyzeDay(day.short, day.detail, localNote, dayIndex);
      setFeedback(r.feedback);
      onNoteChange(dayIndex, localNote, r.done);
    } catch { setFeedback("Saved."); onNoteChange(dayIndex, localNote, false); }
    setAnalyzing(false);
  };

  return (
    <div style={{ background:bgCol, border:`1px solid ${borderCol}`, borderRadius:10, padding:"11px 10px", display:"flex", flexDirection:"column", gap:5 }}>
      {day.type !== "normal"
        ? <div style={{ fontSize:10, fontWeight:500, letterSpacing:1.5, color:isDone?"#4caf5055":ts.labelColor, textTransform:"uppercase" }}>{ts.label}</div>
        : <div style={{ fontSize:11, color:isDone?"#4caf5050":isToday?"#f5a623":"#e8e8e840" }}>{isDone?"✓":isToday?"today":DATES[dayIndex]}</div>
      }
      <div onClick={() => onToggle(dayIndex)} style={{ fontSize:14, fontWeight:500, cursor:"pointer", lineHeight:1.3,
        color: isDone?"#4caf50bb": day.type==="exam-window"?"#c084fc": day.type==="mock"?"#a8e063": day.type==="test"?"#f5a623":"#e8e8e8" }}>
        {day.short}
      </div>
      <div style={{ fontSize:11, color:isDone?"#4caf5045":"#e8e8e888", lineHeight:1.5 }}>{day.detail}</div>
      {day.type !== "rest" && (
        <div style={{ marginTop:3 }}>
          <textarea value={localNote} onChange={e=>setLocalNote(e.target.value)}
            onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); submit(); }}}
            placeholder="what did you do? enter to log"
            rows={2}
            style={{ width:"100%", background:"#ffffff0d", border:"1px solid #ffffff18", borderRadius:6, color:"#e8e8e8", fontFamily:"'DM Mono',monospace", fontSize:11, padding:"6px 8px", resize:"none", outline:"none" }}
          />
          {analyzing && <div style={{ fontSize:10, color:"#f5a623", marginTop:2 }}>analyzing...</div>}
          {feedback && <div style={{ fontSize:10, color:"#a8e063", marginTop:2, lineHeight:1.4 }}>{feedback}</div>}
        </div>
      )}
    </div>
  );
}

function Chatbot({ days, onRewrite, onClose }) {
  const [messages, setMessages] = useState(() => {
    try { return JSON.parse(localStorage.getItem(CHAT_KEY)||"[]"); } catch { return []; }
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({behavior:"smooth"}); }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role:"user", content:input };
    const next = [...messages, userMsg];
    setMessages(next); setInput(""); setLoading(true);
    try {
      const reply = await callClaude(next.slice(-12));
      // check if AI wants to rewrite schedule
      try {
        const trimmed = reply.trim();
        if (trimmed.startsWith("{") && trimmed.includes('"action":"rewrite"')) {
          const parsed = JSON.parse(trimmed);
          onRewrite(parsed.fromIndex, parsed.days);
          const updated = [...next, { role:"assistant", content:`Done — I've rewritten ${parsed.days.length} days starting from day ${parsed.fromIndex + 1} (${DATES[parsed.fromIndex]}).` }];
          setMessages(updated);
          try { localStorage.setItem(CHAT_KEY, JSON.stringify(updated.slice(-30))); } catch {}
          setLoading(false); return;
        }
      } catch {}
      const updated = [...next, { role:"assistant", content:reply }];
      setMessages(updated);
      try { localStorage.setItem(CHAT_KEY, JSON.stringify(updated.slice(-30))); } catch {}
    } catch {
      setMessages([...next, { role:"assistant", content:"Error — check your Vercel ANTHROPIC_API_KEY env var." }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ position:"fixed", right:0, top:0, bottom:0, width:340, background:"#0f0f1a", borderLeft:"1px solid #ffffff14", display:"flex", flexDirection:"column", zIndex:100 }}>
      <div style={{ padding:"16px 18px", borderBottom:"1px solid #ffffff0e", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ fontSize:13, fontWeight:500 }}>Italian coach</div>
          <div style={{ fontSize:10, color:"#e8e8e855", marginTop:2 }}>tell me what you did · I'll adjust the plan</div>
        </div>
        <button onClick={onClose} style={{ background:"none", border:"none", color:"#e8e8e855", cursor:"pointer", fontSize:20 }}>×</button>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"14px 18px", display:"flex", flexDirection:"column", gap:10 }}>
        {messages.length === 0 && (
          <div style={{ fontSize:12, color:"#e8e8e848", lineHeight:1.7 }}>
            Hey. Tell me what you studied, what you skipped, or ask me to adjust the schedule. I can rewrite upcoming days based on where you're at.
          </div>
        )}
        {messages.map((m,i) => (
          <div key={i} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start" }}>
            <div style={{ maxWidth:"85%", padding:"9px 12px", borderRadius:10, fontSize:12, lineHeight:1.55,
              background:m.role==="user"?"#53c0f022":"#ffffff0a",
              border:m.role==="user"?"1px solid #53c0f035":"1px solid #ffffff12",
              color:m.role==="user"?"#c0e8f8":"#e8e8e8cc" }}>
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
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}
          placeholder="message..."
          style={{ flex:1, background:"#ffffff0d", border:"1px solid #ffffff18", borderRadius:8, color:"#e8e8e8", fontFamily:"'DM Mono',monospace", fontSize:12, padding:"8px 12px", outline:"none" }}
        />
        <button onClick={send} disabled={loading}
          style={{ background:"#53c0f018", border:"1px solid #53c0f035", borderRadius:8, color:"#53c0f0", padding:"8px 14px", cursor:"pointer", fontSize:12, fontFamily:"'DM Mono',monospace" }}>
          send
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [days, setDays] = useState(DEFAULT_DAYS);
  const [done, setDone] = useState({});
  const [notes, setNotes] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [activeWeek, setActiveWeek] = useState(0);
  const [saving, setSaving] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const saveTimer = useRef(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) { const d = JSON.parse(raw); setDone(d.done||{}); setNotes(d.notes||{}); }
      const sched = localStorage.getItem(SCHEDULE_KEY);
      if (sched) setDays(JSON.parse(sched));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const today = new Date();
    const diff = Math.floor((today - START_DATE) / 86400000);
    if (diff >= 0 && diff < 84) setActiveWeek(Math.floor(diff / 7));
  }, [loaded]);

  const persist = useCallback((newDone, newNotes, newDays) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSaving(true);
    saveTimer.current = setTimeout(() => {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ done:newDone, notes:newNotes })); } catch {}
      if (newDays) try { localStorage.setItem(SCHEDULE_KEY, JSON.stringify(newDays)); } catch {}
      setSaving(false);
    }, 400);
  }, []);

  const toggleDone = useCallback((dayIdx) => {
    const next = { ...done, [dayIdx]: !done[dayIdx] };
    setDone(next); persist(next, notes);
  }, [done, notes, persist]);

  const handleNoteChange = useCallback((dayIdx, note, aiDone) => {
    const newNotes = { ...notes, [dayIdx]: note };
    const newDone = aiDone ? { ...done, [dayIdx]: true } : done;
    setNotes(newNotes); setDone(newDone); persist(newDone, newNotes);
  }, [done, notes, persist]);

  const handleRewrite = useCallback((fromIndex, newDayList) => {
    const updated = [...days];
    newDayList.forEach((d, i) => { if (fromIndex+i < updated.length) updated[fromIndex+i] = d; });
    setDays(updated); persist(done, notes, updated);
  }, [days, done, notes, persist]);

  const todayIdx = Math.floor((new Date() - START_DATE) / 86400000);
  const totalStudyDays = 77;
  const daysChecked = Object.values(done).filter(Boolean).length;
  const pct = Math.round((daysChecked / totalStudyDays) * 100);

  // Build week display — week 1 starts on Thursday (START_DOW=3)
  const getWeekDays = (weekIdx) => {
    const result = [];
    for (let col = 0; col < 7; col++) {
      const dayOffset = weekIdx === 0
        ? col - START_DOW  // week 1: days before May 29 are empty
        : 7 - START_DOW + (weekIdx - 1) * 7 + col;
      result.push(dayOffset);
    }
    return result;
  };

  const week = activeWeek;

  if (!loaded) return (
    <div style={{ minHeight:"100vh", background:"#0a0a0f", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <span style={{ color:"#ffffff30", fontFamily:"monospace", fontSize:14, letterSpacing:3 }}>loading...</span>
    </div>
  );

  const weekDayIndices = getWeekDays(activeWeek);

  return (
    <div style={{ minHeight:"100vh", background:"#0a0a0f", fontFamily:"'DM Mono','Courier New',monospace", color:"#e8e8e8" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html,body,#root { width:100%; min-height:100vh; background:#0a0a0f; }
        .wtab { background:none; border:none; cursor:pointer; font-family:'DM Mono',monospace; font-size:12px; padding:5px 10px; border-radius:6px; transition:all 0.12s; color:#e8e8e848; white-space:nowrap; }
        .wtab:hover { color:#e8e8e8; background:#ffffff0e; }
        .wtab.on { color:#e8e8e8; background:#ffffff1a; font-weight:500; }
        textarea::placeholder, input::placeholder { color:#e8e8e830; }
        ::-webkit-scrollbar { width:3px; } ::-webkit-scrollbar-thumb { background:#ffffff18; border-radius:2px; }
      `}</style>

      <div style={{ padding:"28px 28px 40px", paddingRight:chatOpen?368:28, transition:"padding-right 0.2s" }}>

        {/* header */}
        <div style={{ marginBottom:28 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
            <span style={{ fontSize:11, letterSpacing:3, color:"#e8e8e855", textTransform:"uppercase" }}>italiano · nyu placement prep</span>
            <div style={{ display:"flex", alignItems:"center", gap:14 }}>
              <span style={{ fontSize:11, color:saving?"#f5a623":"#e8e8e825", transition:"color 0.3s" }}>{saving?"saving...":"saved"}</span>
              <button onClick={()=>setChatOpen(!chatOpen)}
                style={{ background:chatOpen?"#53c0f018":"#ffffff0a", border:`1px solid ${chatOpen?"#53c0f040":"#ffffff18"}`, borderRadius:8, color:chatOpen?"#53c0f0":"#e8e8e8aa", padding:"7px 14px", cursor:"pointer", fontSize:12, fontFamily:"'DM Mono',monospace" }}>
                {chatOpen?"close coach":"ai coach ↗"}
              </button>
            </div>
          </div>
          <h1 style={{ fontSize:36, fontWeight:500, letterSpacing:-1, marginBottom:6 }}>12-week plan</h1>
          <div style={{ fontSize:13, color:"#e8e8e855", marginBottom:20 }}>May 29 – Aug 20 · exam window Aug 14–18</div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:16 }}>
            {[
              { label:"days done", val:`${daysChecked}/${totalStudyDays}`, sub:`${pct}% complete` },
              { label:"current week", val:WEEK_LABELS[activeWeek], sub:"" },
              { label:"checkpoints", val:"8 tests", sub:"+ 5 mock exams" },
            ].map(({label,val,sub})=>(
              <div key={label} style={{ background:"#ffffff07", border:"1px solid #ffffff0f", borderRadius:10, padding:"14px 18px" }}>
                <div style={{ fontSize:10, color:"#e8e8e855", letterSpacing:2, textTransform:"uppercase", marginBottom:6 }}>{label}</div>
                <div style={{ fontSize:20, fontWeight:500, marginBottom:3 }}>{val}</div>
                {sub && <div style={{ fontSize:11, color:"#e8e8e855" }}>{sub}</div>}
              </div>
            ))}
          </div>
          <div style={{ height:3, background:"#ffffff0a", borderRadius:2 }}>
            <div style={{ height:"100%", borderRadius:2, background:"#4caf50", width:`${pct}%`, transition:"width 0.4s" }}/>
          </div>
        </div>

        {/* legend */}
        <div style={{ display:"flex", gap:16, marginBottom:16, flexWrap:"wrap", alignItems:"center" }}>
          {[["#4caf50","done"],["#f5a623","weekly test"],["#a8e063","mock exam"],["#c084fc","exam window"]].map(([c,l])=>(
            <div key={l} style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, color:"#e8e8e870" }}>
              <div style={{ width:8, height:8, borderRadius:2, background:c, opacity:0.8 }}/>{l}
            </div>
          ))}
          <span style={{ fontSize:11, color:"#e8e8e840", marginLeft:"auto" }}>click title to check · type + enter to log · coach rewrites plan</span>
        </div>

        {/* week tabs */}
        <div style={{ display:"flex", gap:3, flexWrap:"wrap", marginBottom:18 }}>
          {WEEK_LABELS.map((label,i)=>{
            const idxs = getWeekDays(i).filter(x=>x>=0&&x<84);
            const wd = idxs.filter(x=>done[x]).length;
            const isCur = idxs.includes(todayIdx);
            return (
              <button key={i} className={`wtab${activeWeek===i?" on":""}`} onClick={()=>setActiveWeek(i)}>
                {label}
                {isCur&&<span style={{color:"#f5a623",marginLeft:3}}>·</span>}
                {wd>0&&<span style={{color:"#4caf5075",marginLeft:3}}>{wd}/{idxs.length}</span>}
              </button>
            );
          })}
        </div>

        {/* week panel */}
        <div style={{ background:"#ffffff05", border:"1px solid #ffffff0e", borderRadius:14, padding:"20px", marginBottom:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:18, flexWrap:"wrap" }}>
            <span style={{ fontSize:16, fontWeight:500 }}>{WEEK_LABELS[activeWeek]}</span>
            <span style={{ marginLeft:"auto", fontSize:13, color:"#e8e8e845" }}>
              {weekDayIndices.filter(x=>x>=0&&x<84&&done[x]).length}/{weekDayIndices.filter(x=>x>=0&&x<84).length} done
            </span>
          </div>

          {/* day headers */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:8, marginBottom:8 }}>
            {DAYS_OF_WEEK.map((d,i)=>{
              const gi = weekDayIndices[i];
              return (
                <div key={d} style={{ textAlign:"center" }}>
                  <div style={{ fontSize:11, color:"#e8e8e845", letterSpacing:1, marginBottom:3 }}>{d}</div>
                  <div style={{ fontSize:12, color:gi===todayIdx?"#f5a623":"#e8e8e840" }}>{gi>=0&&gi<84?DATES[gi]:""}</div>
                </div>
              );
            })}
          </div>

          {/* day cards */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:8 }}>
            {weekDayIndices.map((gi,col)=>{
              if (gi < 0 || gi >= 84) return <div key={col} style={{ borderRadius:10, background:"#ffffff03", border:"1px solid #ffffff08", minHeight:80 }}/>;
              const day = days[gi] || { short:"", detail:"", type:"normal" };
              return (
                <DayCard key={gi} dayIndex={gi} day={day}
                  isDone={!!done[gi]} note={notes[gi]||""}
                  onToggle={toggleDone} onNoteChange={handleNoteChange}
                  isToday={gi===todayIdx}
                />
              );
            })}
          </div>
        </div>

        {/* bottom info */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:20 }}>
          {[
            { label:"daily target", val:"90 min" },
            { label:"core tools", val:"Babbel · CBT podcast" },
            { label:"grammar (free)", val:"onlineitalianclub.com" },
          ].map(({label,val})=>(
            <div key={label} style={{ background:"#ffffff05", border:"1px solid #ffffff0e", borderRadius:10, padding:"12px 16px" }}>
              <div style={{ fontSize:10, color:"#e8e8e845", letterSpacing:2, textTransform:"uppercase", marginBottom:5 }}>{label}</div>
              <div style={{ fontSize:13, color:"#e8e8e8cc" }}>{val}</div>
            </div>
          ))}
        </div>

        {/* links */}
        <div style={{ marginBottom:20 }}>
          <div style={{ fontSize:10, color:"#e8e8e855", letterSpacing:2, textTransform:"uppercase", marginBottom:12 }}>quick links</div>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            {[
              { label:"Babbel", url:"https://www.babbel.com", color:"#e94560" },
              { label:"Coffee Break Italian", url:"https://coffeebreaklanguages.com/coffeebreakitalian", color:"#53c0f0" },
              { label:"Grammar exercises", url:"https://onlineitalianclub.com/free-italian-exercises-and-resources/online-italian-course-beginner-level-a1/", color:"#a8e063" },
              { label:"Vocab drills", url:"https://lingua.com/italian/grammar/", color:"#c084fc" },
              { label:"NYU Placement Exam", url:"https://cas.nyu.edu/academic-programs/academic-success/placementexams.html", color:"#f472b6" },
            ].map(({label,url,color})=>(
              <a key={label} href={url} target="_blank" rel="noopener noreferrer"
                style={{ display:"inline-flex", alignItems:"center", padding:"8px 16px", borderRadius:8, border:`1px solid ${color}30`, background:`${color}0d`, color, fontSize:13, fontFamily:"'DM Mono',monospace", textDecoration:"none" }}
                onMouseEnter={e=>{e.currentTarget.style.background=`${color}22`;e.currentTarget.style.borderColor=`${color}55`;}}
                onMouseLeave={e=>{e.currentTarget.style.background=`${color}0d`;e.currentTarget.style.borderColor=`${color}30`;}}>
                {label} ↗
              </a>
            ))}
          </div>
        </div>

        <div style={{ fontSize:11, color:"#e8e8e845" }}>
          saves to localStorage · never resets · click title to toggle done · type what you did + enter to log · ai coach adjusts your plan
        </div>
      </div>

      {chatOpen && <Chatbot days={days} onRewrite={handleRewrite} onClose={()=>setChatOpen(false)} />}
    </div>
  );
}
