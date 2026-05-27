import { useState, useEffect, useCallback, useRef } from "react";

const STORAGE_KEY = "italian-tracker-v3";

const DATES = ["May 27","May 28","May 29","May 30","May 31","Jun 1","Jun 2","Jun 3","Jun 4","Jun 5","Jun 6","Jun 7","Jun 8","Jun 9","Jun 10","Jun 11","Jun 12","Jun 13","Jun 14","Jun 15","Jun 16","Jun 17","Jun 18","Jun 19","Jun 20","Jun 21","Jun 22","Jun 23","Jun 24","Jun 25","Jun 26","Jun 27","Jun 28","Jun 29","Jun 30","Jul 1","Jul 2","Jul 3","Jul 4","Jul 5","Jul 6","Jul 7","Jul 8","Jul 9","Jul 10","Jul 11","Jul 12","Jul 13","Jul 14","Jul 15","Jul 16","Jul 17","Jul 18","Jul 19","Jul 20","Jul 21","Jul 22","Jul 23","Jul 24","Jul 25","Jul 26","Jul 27","Jul 28","Jul 29","Jul 30","Jul 31","Aug 1","Aug 2","Aug 3","Aug 4","Aug 5","Aug 6","Aug 7","Aug 8","Aug 9","Aug 10","Aug 11","Aug 12","Aug 13","Aug 14","Aug 15","Aug 16","Aug 17","Aug 18"];

const weekData = [
  { phase:1, label:"Week 1", focus:"Foundation", dateRange:"May 27 – Jun 2", days:[
    { short:"Articles", detail:"Babbel lesson 1 · Anki 20 words · CBT Ep.1", target:90 },
    { short:"Gender & plural", detail:"CBT Ep.2 · Anki review · Write 5 sentences", target:75 },
    { short:"essere present", detail:"Babbel + workbook Ch.1 · Anki 20 words", target:90 },
    { short:"lo / gli / le", detail:"CBT Ep.3 · Anki review · Write 5 sentences", target:75 },
    { short:"Articles review", detail:"Babbel lesson 2 · Anki 20 words · CBT Ep.4", target:90 },
    { short:"TEST 1", detail:"Self-test: articles, gender, essere/avere. Write 20 sentences from scratch. Grade yourself.", target:60, type:"test" },
    { short:"Rest + Anki", detail:"Anki review only · Light CBT · no grammar", target:20, type:"rest" },
  ]},
  { phase:1, label:"Week 2", focus:"Foundation", dateRange:"Jun 3 – Jun 9", days:[
    { short:"avere present", detail:"Babbel · Anki 20 words · Workbook Ch.3", target:90 },
    { short:"-are verbs", detail:"CBT Ep.5 · Anki · Write sentences", target:75 },
    { short:"-ere verbs", detail:"Babbel + workbook · Anki 20 words", target:90 },
    { short:"-ire verbs", detail:"CBT Ep.6 · Anki · Write sentences", target:75 },
    { short:"Adj. agreement", detail:"Babbel + workbook Ch.4 · Anki 20 words", target:90 },
    { short:"TEST 2", detail:"Self-test: all regular verbs present tense + adj. agreement. Conjugate 15 verbs cold, write 10 adj. sentences.", target:60, type:"test" },
    { short:"Rest + Anki", detail:"Anki review only · Light CBT", target:20, type:"rest" },
  ]},
  { phase:2, label:"Week 3", focus:"Build", dateRange:"Jun 10 – Jun 16", days:[
    { short:"Prepositions", detail:"Babbel · Anki 20 words · Workbook Ch.5", target:90 },
    { short:"del / della", detail:"CBT Ep.7 · Anki · Write sentences", target:75 },
    { short:"Numbers + time", detail:"Babbel + workbook · Anki 20 words", target:90 },
    { short:"da / in / con / su", detail:"CBT Ep.8 · Anki · Write sentences", target:75 },
    { short:"Prep. review", detail:"Babbel + workbook Ch.6 · Anki 20 words", target:90 },
    { short:"TEST 3", detail:"Self-test: prepositions + contractions. Fill 25 blanks, translate 10 sentences using correct prep.", target:60, type:"test" },
    { short:"Rest + Anki", detail:"Anki review only", target:20, type:"rest" },
  ]},
  { phase:2, label:"Week 4", focus:"Build", dateRange:"Jun 17 – Jun 23", days:[
    { short:"potere/volere/dovere", detail:"Babbel · Anki 20 words · Workbook Ch.7", target:90 },
    { short:"Reflexive verbs", detail:"CBT Ep.9 · Anki · Write sentences", target:75 },
    { short:"mi / ti / lo / la", detail:"Babbel + workbook · Anki 20 words", target:90 },
    { short:"Direct obj. pronouns", detail:"CBT Ep.10 · Anki · Write sentences", target:75 },
    { short:"Modal + pronoun", detail:"Babbel + workbook Ch.8 · Anki 20 words", target:90 },
    { short:"TEST 4", detail:"Self-test: modals + direct object pronouns. 20 translation sentences combining both.", target:60, type:"test" },
    { short:"Rest + Anki", detail:"Anki review only", target:20, type:"rest" },
  ]},
  { phase:2, label:"Week 5", focus:"Build", dateRange:"Jun 24 – Jun 30", days:[
    { short:"Passato prossimo", detail:"Babbel · Anki 20 words · Workbook Ch.9", target:90 },
    { short:"avere auxiliary", detail:"CBT Ep.11 · Anki · Write sentences", target:75 },
    { short:"essere auxiliary", detail:"Babbel + workbook · Anki 20 words", target:90 },
    { short:"Irregular past", detail:"CBT Ep.12 · Anki · Write sentences", target:75 },
    { short:"Past tense review", detail:"Babbel + workbook Ch.10 · Anki 20 words", target:90 },
    { short:"TEST 5 + iTalki", detail:"Self-test: 20 passato prossimo sentences (essere vs avere). Then 1hr iTalki session.", target:90, type:"test" },
    { short:"Rest + Anki", detail:"Anki review only", target:20, type:"rest" },
  ]},
  { phase:3, label:"Week 6", focus:"Intermediate", dateRange:"Jul 1 – Jul 7", days:[
    { short:"Imperfetto form.", detail:"Babbel · Anki 20 words · Workbook Ch.11", target:90 },
    { short:"Imperfetto use", detail:"CBT Ep.13 · Anki · Write sentences", target:75 },
    { short:"PP vs Imperfetto", detail:"Babbel + workbook · Anki 20 words", target:90 },
    { short:"Contrast drills", detail:"CBT Ep.14 · Anki · Write sentences", target:75 },
    { short:"Past contrast", detail:"Babbel + workbook Ch.12 · Anki 20 words", target:90 },
    { short:"TEST 6 + iTalki", detail:"Self-test: 15 sentences choosing between PP and imperfetto. Then 1hr iTalki session.", target:90, type:"test" },
    { short:"Rest + Anki", detail:"Anki review only", target:20, type:"rest" },
  ]},
  { phase:3, label:"Week 7", focus:"Intermediate", dateRange:"Jul 8 – Jul 14", days:[
    { short:"Futuro semplice", detail:"Babbel · Anki 20 words · Workbook Ch.13", target:90 },
    { short:"Indirect pronouns", detail:"CBT Ep.15 · Anki · Write sentences", target:75 },
    { short:"Combined pronouns", detail:"Babbel + workbook · Anki 20 words", target:90 },
    { short:"glielo drills", detail:"CBT Ep.16 · Anki · Write sentences", target:75 },
    { short:"Future + pronouns", detail:"Babbel + workbook Ch.14 · Anki 20 words", target:90 },
    { short:"TEST 7 + iTalki", detail:"Self-test: futuro + all pronoun types. 20 sentences. Then 1hr iTalki session.", target:90, type:"test" },
    { short:"Rest + Anki", detail:"Anki review only", target:20, type:"rest" },
  ]},
  { phase:3, label:"Week 8", focus:"Intermediate", dateRange:"Jul 15 – Jul 21", days:[
    { short:"Condizionale", detail:"Babbel · Anki 20 words · Workbook Ch.15", target:90 },
    { short:"Imperativo", detail:"CBT Ep.17 · Anki · Write sentences", target:75 },
    { short:"Comparatives", detail:"Babbel + workbook · Anki 20 words", target:90 },
    { short:"Superlatives", detail:"CBT Ep.18 · Anki · Write sentences", target:75 },
    { short:"Cond. / imp. review", detail:"Babbel + workbook Ch.16 · Anki 20 words", target:90 },
    { short:"TEST 8 + iTalki", detail:"Self-test: condizionale + imperativo + comparatives. 25 mixed sentences. Then 1hr iTalki.", target:90, type:"test" },
    { short:"Rest + Anki", detail:"Anki review only", target:20, type:"rest" },
  ]},
  { phase:4, label:"Week 9", focus:"Exam Prep", dateRange:"Jul 22 – Jul 28", days:[
    { short:"Full review", detail:"Workbook all review sections · Anki all decks", target:90 },
    { short:"MOCK EXAM 1", detail:"60 MC timed 60min · Simulate real conditions · Score yourself", target:60, type:"mock" },
    { short:"Mock 1 review", detail:"Go through every wrong answer · Targeted drills", target:90 },
    { short:"MOCK EXAM 2", detail:"60 MC timed 60min · Note score vs mock 1", target:60, type:"mock" },
    { short:"Mock 2 review", detail:"Weak spots only · Anki focus", target:75 },
    { short:"iTalki session 5", detail:"Final timed speaking session · Push yourself", target:60 },
    { short:"Rest + Anki", detail:"Anki only · No heavy grammar", target:20, type:"rest" },
  ]},
  { phase:4, label:"Week 10", focus:"Exam Prep", dateRange:"Jul 29 – Aug 4", days:[
    { short:"Reading comp.", detail:"Italian passages · Timed comprehension Qs", target:90 },
    { short:"MOCK EXAM 3", detail:"60 MC timed 60min · Aim for consistent score", target:60, type:"mock" },
    { short:"Mock 3 review", detail:"Weak spots only · Workbook targeted drills", target:75 },
    { short:"MOCK EXAM 4", detail:"60 MC timed 60min · Final benchmark", target:60, type:"mock" },
    { short:"Vocab top-up", detail:"Anki · Focus on words you keep missing", target:45 },
    { short:"iTalki session 6", detail:"Final speaking polish · Free conversation", target:60 },
    { short:"Rest + Anki", detail:"Anki only · Keep loose", target:20, type:"rest" },
  ]},
  { phase:4, label:"Week 11", focus:"Final Polish", dateRange:"Aug 5 – Aug 11", days:[
    { short:"MOCK EXAM 5", detail:"60 MC timed · Last full practice run", target:60, type:"mock" },
    { short:"Weak spots", detail:"Final targeted drills on lowest scoring areas", target:75 },
    { short:"Light grammar", detail:"Skim key grammar tables only · Anki", target:45 },
    { short:"Rest day", detail:"No studying · Let it consolidate", target:0, type:"rest" },
    { short:"Quick review", detail:"30 min max · Key verb tables only", target:30 },
    { short:"Rest day", detail:"No studying · Sleep well", target:0, type:"rest" },
    { short:"Rest / light Anki", detail:"Anki review only if you want · No cramming", target:15, type:"rest" },
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

function MinuteInput({ value, onChange, target }) {
  const [editing, setEditing] = useState(false);
  const [tmp, setTmp] = useState(value || "");
  if (editing) return (
    <input type="number" min="0" max="999" value={tmp}
      style={{ width:"100%", background:"#ffffff14", border:"1px solid #ffffff30", borderRadius:4, color:"#e8e8e8", fontFamily:"inherit", fontSize:13, padding:"3px 6px", textAlign:"center" }}
      onChange={e => setTmp(e.target.value)}
      onBlur={() => { onChange(parseInt(tmp)||0); setEditing(false); }}
      onKeyDown={e => { if(e.key==="Enter"){ onChange(parseInt(tmp)||0); setEditing(false); } if(e.key==="Escape") setEditing(false); }}
      autoFocus
    />
  );
  const mins = value || 0;
  const over = target > 0 && mins >= target;
  return (
    <div onClick={() => { setTmp(value||""); setEditing(true); }}
      style={{ cursor:"pointer", fontSize:12, color: over?"#4caf50": mins>0?"#f5a623":"#e8e8e828", textAlign:"center", paddingTop:4 }}>
      {mins > 0 ? `${mins}min` : target > 0 ? "log time" : ""}
      {target > 0 && <span style={{ color:"#e8e8e820", fontSize:11 }}>/{target}</span>}
    </div>
  );
}

export default function App() {
  const [data, setData] = useState({ done:{}, mins:{} });
  const [loaded, setLoaded] = useState(false);
  const [activeWeek, setActiveWeek] = useState(0);
  const [saving, setSaving] = useState(false);
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

  const setMins = useCallback((wk, di, val) => {
    const key = `${wk}-${di}`;
    const next = { ...data, mins: { ...data.mins, [key]: val } };
    setData(next); persist(next);
  }, [data, persist]);

  const totalDays = weekData.slice(0,11).reduce((a,w) => a + w.days.length, 0);
  const daysChecked = Object.values(data.done||{}).filter(Boolean).length;
  const totalLogged = Object.values(data.mins||{}).reduce((a,v) => a+(v||0), 0);
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
        .day-card { border-radius: 10px; padding: 14px 12px; cursor: default; transition: border-color 0.15s; }
        .day-card-title { cursor: pointer; user-select: none; }
        .day-card-title:hover { opacity: 0.8; }
      `}</style>

      <div style={{ padding: "28px 28px 40px" }}>

        {/* header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom: 6 }}>
            <span style={{ fontSize:11, letterSpacing:3, color:"#e8e8e830", textTransform:"uppercase" }}>italiano · nyu placement prep</span>
            <span style={{ fontSize:11, color: saving?"#f5a623":"#e8e8e825", transition:"color 0.3s" }}>{saving ? "saving..." : "saved"}</span>
          </div>
          <h1 style={{ fontSize:36, fontWeight:500, letterSpacing:-1, marginBottom:6, color:"#e8e8e8" }}>11-week plan</h1>
          <div style={{ fontSize:13, color:"#e8e8e848", marginBottom:20 }}>May 27 – Aug 18 · exam window Aug 12–16</div>

          {/* stat cards */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:16 }}>
            {[
              { label:"days done", val:`${daysChecked}/${totalDays}`, sub:`${pct}% complete` },
              { label:"mins logged", val:`${totalLogged}`, sub:"across all sessions" },
              { label:"checkpoints", val:"8 tests", sub:"+ 5 mock exams" },
            ].map(({ label, val, sub }) => (
              <div key={label} style={{ background:"#ffffff07", border:"1px solid #ffffff0f", borderRadius:10, padding:"14px 18px" }}>
                <div style={{ fontSize:10, color:"#e8e8e830", letterSpacing:2, textTransform:"uppercase", marginBottom:6 }}>{label}</div>
                <div style={{ fontSize:22, fontWeight:500, marginBottom:3 }}>{val}</div>
                <div style={{ fontSize:11, color:"#e8e8e840" }}>{sub}</div>
              </div>
            ))}
          </div>

          {/* progress bar */}
          <div style={{ height:3, background:"#ffffff0a", borderRadius:2 }}>
            <div style={{ height:"100%", borderRadius:2, background:"#4caf50", width:`${pct}%`, transition:"width 0.4s" }}/>
          </div>
        </div>

        {/* legend */}
        <div style={{ display:"flex", gap:20, marginBottom:16, flexWrap:"wrap", alignItems:"center" }}>
          {[["#4caf50","checked done"],["#f5a623","weekly test"],["#a8e063","mock exam"],["#c084fc","exam window"]].map(([c,l]) => (
            <div key={l} style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"#e8e8e855" }}>
              <div style={{ width:9, height:9, borderRadius:2, background:c, opacity:0.8 }}/>
              {l}
            </div>
          ))}
          <span style={{ fontSize:11, color:"#e8e8e830", marginLeft:"auto" }}>click title to check · click time to log</span>
        </div>

        {/* week tabs */}
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

        {/* week panel */}
        <div style={{ background:"#ffffff05", border:"1px solid #ffffff0e", borderRadius:14, padding:"20px 20px", marginBottom:16 }}>
          {/* week header */}
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:18, flexWrap:"wrap" }}>
            <span style={{ fontSize:11, letterSpacing:2, padding:"4px 12px", border:`1px solid ${ac}30`, color:ac, borderRadius:20, textTransform:"uppercase" }}>{week.focus}</span>
            <span style={{ fontSize:18, fontWeight:500 }}>{week.label}</span>
            <span style={{ fontSize:13, color:"#e8e8e840" }}>{week.dateRange}</span>
            <span style={{ marginLeft:"auto", fontSize:13, color:"#e8e8e835" }}>
              {week.days.filter((_,di) => data.done[`${activeWeek}-${di}`]).length}/{week.days.length} done
            </span>
          </div>

          {/* day column labels */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:10, marginBottom:8 }}>
            {DAYS.map((d,i) => {
              const gi = activeWeek*7+i;
              return (
                <div key={d} style={{ textAlign:"center" }}>
                  <div style={{ fontSize:11, color:"#e8e8e830", letterSpacing:1, marginBottom:3 }}>{d}</div>
                  <div style={{ fontSize:12, color: gi===todayIdx ? "#f5a623" : "#e8e8e828" }}>{DATES[gi]||""}</div>
                </div>
              );
            })}
          </div>

          {/* day cards */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:10 }}>
            {week.days.map((day,di) => {
              const key = `${activeWeek}-${di}`;
              const isDone = !!data.done[key];
              const minsVal = data.mins[key] || 0;
              const gi = activeWeek*7+di;
              const isToday = gi === todayIdx;
              const ts = typeStyles[day.type||"normal"] || {};
              const borderCol = isDone ? "#4caf5055" : isToday ? "#f5a62340" : ts.border||"#ffffff14";
              const bgCol = isDone ? "#1c3a1c" : ts.bg||"#ffffff07";

              return (
                <div key={di} className="day-card" style={{ background:bgCol, border:`1px solid ${borderCol}` }}>
                  {/* type badge or date */}
                  {day.type && day.type !== "normal"
                    ? <div style={{ fontSize:10, fontWeight:500, letterSpacing:1.5, color: isDone?"#4caf5055":ts.labelColor, marginBottom:6, textTransform:"uppercase" }}>{ts.label}</div>
                    : <div style={{ fontSize:11, color: isDone?"#4caf5050": isToday?"#f5a623":"#e8e8e825", marginBottom:6 }}>{isDone ? "✓ done" : isToday ? "today" : DATES[gi]||""}</div>
                  }

                  {/* title — click to check */}
                  <div
                    className="day-card-title"
                    onClick={() => toggleDone(activeWeek, di)}
                    style={{
                      fontSize:14, fontWeight:500, lineHeight:1.3, marginBottom:8,
                      color: isDone ? "#4caf50bb"
                           : day.type==="exam-window" ? "#c084fc"
                           : day.type==="mock" ? "#a8e063"
                           : day.type==="test" ? "#f5a623"
                           : "#e8e8e8"
                    }}
                  >
                    {day.short}
                  </div>

                  {/* detail */}
                  <div style={{ fontSize:12, color: isDone?"#4caf5045":"#e8e8e848", lineHeight:1.55, marginBottom: day.target>0 ? 8 : 0 }}>
                    {day.detail}
                  </div>

                  {/* minute logger */}
                  {day.target > 0 && (
                    <MinuteInput value={minsVal} target={day.target} onChange={v => setMins(activeWeek, di, v)} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* bottom info */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:20 }}>
          {[
            { label:"daily target", val:"90 min" },
            { label:"core tools", val:"Babbel · CBT · Anki" },
            { label:"speaking wk 5+", val:"iTalki 2x/wk" },
          ].map(({ label, val }) => (
            <div key={label} style={{ background:"#ffffff05", border:"1px solid #ffffff0e", borderRadius:10, padding:"12px 16px" }}>
              <div style={{ fontSize:10, color:"#e8e8e828", letterSpacing:2, textTransform:"uppercase", marginBottom:5 }}>{label}</div>
              <div style={{ fontSize:14, color:"#e8e8e8aa" }}>{val}</div>
            </div>
          ))}
        </div>

        <div style={{ fontSize:11, color:"#e8e8e820" }}>
          saves to localStorage · never resets · click day title to check off · click time to log minutes
        </div>
      </div>
    </div>
  );
}
