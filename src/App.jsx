import React, { useState } from "react";

// ─── CONCEPT DEMO v5 — CardLedger ────────────────────────────────────────────
// Pokémon trader reputation platform. Demo: second party + PSA checks SIMULATED;
// photo upload is SIMULATED (real storage comes with the real backend); nothing saved.
// v5 adds: multiple cards per side of a trade; simulated photo upload for raw/sealed.

const C = { bg:"#0f1419", panel:"#1a2129", panel2:"#222b35", line:"#2d3742",
  ink:"#e8edf2", sub:"#8a97a6", accent:"#3ba776", accentDim:"#2a6b4d",
  warn:"#d98c3a", danger:"#c4554d", blue:"#4a90d9" };

const CARDS = {
  "84839201": { card:"2016 XY Evolutions Charizard #11", grade:"PSA 9 MINT" },
  "62110473": { card:"1999 Base Set Blastoise #2", grade:"PSA 8 NM-MT" },
};
function checkCert(cert){ return new Promise(res=>setTimeout(()=>{
  const k=cert.trim();
  if(!/^\d{6,9}$/.test(k)) return res({valid:false,message:"Invalid cert number format"});
  res({ valid:true, ...(CARDS[k]||{card:"Pokemon graded card (PSA record found)",grade:"PSA graded"}) });
},650)); }

const STEPS=["Items","Terms","Exchange","Receipt","Review","Done"];

export default function App(){
  const [view,setView]=useState("home");
  const [consented,setConsented]=useState(false);
  return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.ink,fontFamily:"Georgia, serif"}}>
      <div style={{background:"#2a2016",color:C.warn,fontFamily:"sans-serif",fontSize:11.5,
        textAlign:"center",padding:"6px 12px",lineHeight:1.4}}>
        CONCEPT DEMO — other trader, PSA checks &amp; photo upload are simulated. Nothing saved.</div>
      <Header view={view} setView={setView}/>
      <div style={{maxWidth:460,margin:"0 auto",padding:"0 16px 50px"}}>
        {view==="home"&&<Home setView={setView}/>}
        {view==="trade"&&(consented?<TradeFlow/>:<Consent onAgree={()=>setConsented(true)}/>)}
        {view==="seller"&&<SellerPage/>}
        {view==="fakes"&&<FakeGuide setView={setView}/>}
      </div>
      <Foot/>
    </div>
  );
}

function Header({view,setView}){return(
  <div style={{borderBottom:`1px solid ${C.line}`,background:C.panel,position:"sticky",top:0,zIndex:10}}>
    <div style={{maxWidth:460,margin:"0 auto",padding:"13px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <div onClick={()=>setView("home")} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:8}}>
        <div style={{width:26,height:26,borderRadius:6,background:C.accent,display:"grid",placeItems:"center",fontFamily:"sans-serif",fontWeight:800,color:"#0f1419"}}>✓</div>
        <span style={{fontSize:17,fontWeight:600}}>CardLedger<span style={{color:C.sub,fontSize:11,fontFamily:"sans-serif",marginLeft:6}}>demo</span></span>
      </div>
      <div style={{display:"flex",gap:4}}>
        <HBtn active={view==="seller"} onClick={()=>setView("seller")}>Seller</HBtn>
        <HBtn active={view==="fakes"} onClick={()=>setView("fakes")}>Spot fakes</HBtn>
      </div>
    </div>
  </div>);}
function HBtn({children,active,onClick}){return <button onClick={onClick} style={{background:active?C.panel2:"transparent",color:active?C.ink:C.sub,border:`1px solid ${active?C.line:"transparent"}`,padding:"6px 9px",borderRadius:7,cursor:"pointer",fontFamily:"sans-serif",fontSize:12}}>{children}</button>;}

function Home({setView}){return(
  <div style={{paddingTop:26}}>
    <h1 style={{fontSize:27,lineHeight:1.25,margin:"0 0 13px",fontWeight:600}}>Trade cards with people you can actually check.</h1>
    <p style={{color:C.sub,fontSize:15,lineHeight:1.6,margin:"0 0 22px",fontFamily:"sans-serif"}}>
      Every review is tied to a real, two-sided trade — graded, raw or sealed, one card or a whole binder, shipped or in person. A track record that protects <em>everyone</em> in the deal.</p>
    <button onClick={()=>setView("trade")} style={pBtn}>Start a trade →</button>
    <button onClick={()=>setView("seller")} style={gBtn}>Look up a trader's record</button>
    <div style={{marginTop:30,display:"grid",gap:11}}>
      <Feat t="Reviews can't be bought" b="Unlocks only after both confirm a completed trade. You review the other party in the role they played — never yourself."/>
      <Feat t="Built on distinct partners over time" b="Standing comes from how many different reputable people you've dealt with, sustained over months — not raw count. Faking that means faking a whole economy."/>
      <Feat t="Scammers can't stay disposable" b="Accounts anchor to your real eBay / TikTok / Insta / YouTube / X history. A burner has no standing — so scammers either avoid CardLedger (a red flag) or get identified."/>
      <Feat t="Honest about what we can't see" b="We check graded certs against PSA, but can't authenticate raw cards or sealed boxes. There, photos + the trader's verified record are your protection — and we teach you to spot fakes."/>
    </div>
    <div onClick={()=>setView("fakes")} style={{marginTop:14,textAlign:"center",fontFamily:"sans-serif",fontSize:13,color:C.blue,cursor:"pointer"}}>How to spot fake cards &amp; sealed product →</div>
  </div>);}
function Feat({t,b}){return(
  <div style={{background:C.panel,border:`1px solid ${C.line}`,borderRadius:10,padding:"13px 15px"}}>
    <div style={{fontSize:14.5,fontWeight:600,marginBottom:4}}>{t}</div>
    <div style={{color:C.sub,fontSize:13,lineHeight:1.55,fontFamily:"sans-serif"}}>{b}</div></div>);}

function Consent({onAgree}){
  const [c1,setC1]=useState(false),[c2,setC2]=useState(false);
  return(<div style={{paddingTop:22}}><Panel>
    <div style={{fontSize:18,fontWeight:600,marginBottom:4}}>Before your first trade</div>
    <div style={{fontFamily:"sans-serif",fontSize:13,color:C.sub,lineHeight:1.6,marginBottom:15}}>Short and honest — what happens to your data.</div>
    <Bullet h="What we record" b="Trades you complete: items, agreed value, the counterparty, role each played, timestamps, outcome, disputes, and any photos you attach. Value is logged privately to weight standing — your public page shows totals/tiers, never individual prices."/>
    <Bullet h="What's public" b="Verified counts &amp; dispute rate as seller and buyer, earned status, linked accounts, and reviews from people you traded with. You pick your handle."/>
    <Bullet h="Your control" b="See everything we hold, correct mistakes, request removal. Genuine dispute records can't simply be deleted, but you can always respond, and disputes can be resolved between the parties."/>
    <Bullet h="Both sides consent" b="A record is only created when both traders join and agree. No one is logged without taking part."/>
    <label style={chk}><input type="checkbox" checked={c1} onChange={e=>setC1(e.target.checked)}/><span>I understand what's recorded and shown publicly.</span></label>
    <label style={chk}><input type="checkbox" checked={c2} onChange={e=>setC2(e.target.checked)}/><span>I agree to take part in trades being recorded as described.</span></label>
    <button onClick={onAgree} disabled={!c1||!c2} style={{...pBtn,marginTop:14,opacity:(!c1||!c2)?0.4:1}}>Agree &amp; continue</button>
  </Panel></div>);}
function Bullet({h,b}){return(
  <div style={{marginBottom:12,paddingLeft:12,borderLeft:`2px solid ${C.accentDim}`}}>
    <div style={{fontFamily:"sans-serif",fontSize:13.5,fontWeight:600,marginBottom:2}}>{h}</div>
    <div style={{fontFamily:"sans-serif",fontSize:12.5,color:C.sub,lineHeight:1.55}}>{b}</div></div>);}

// One graded item row (cert check)
function GradedItem({label,onVerified,onRemove}){
  const [cert,setCert]=useState(""),[cr,setCr]=useState(null),[checking,setChecking]=useState(false),[match,setMatch]=useState(false);
  const run=async()=>{setChecking(true);const r=await checkCert(cert);setCr(r);setChecking(false);};
  return(
    <div style={{marginBottom:12,padding:11,background:C.panel2,borderRadius:9,border:`1px solid ${C.line}`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
        <span style={{fontFamily:"sans-serif",fontSize:12,color:C.sub}}>{label}</span>
        {onRemove&&<span onClick={onRemove} style={{fontFamily:"sans-serif",fontSize:12,color:C.danger,cursor:"pointer"}}>Remove</span>}
      </div>
      <div style={{display:"flex",gap:8}}>
        <input value={cert} onChange={e=>{setCert(e.target.value);setCr(null);setMatch(false);onVerified(false);}} placeholder="PSA cert (try 84839201)" style={inp}/>
        <button onClick={run} disabled={!cert||checking} style={{...sBtn,opacity:(!cert||checking)?0.5:1}}>{checking?"…":"Check"}</button>
      </div>
      {cr&&cr.valid&&(<div style={{marginTop:9,fontSize:13}}>
        <span style={{color:C.accent,fontFamily:"sans-serif",fontSize:10,letterSpacing:1}}>PSA RECORD ✓ </span>
        <div style={{marginTop:3}}>{cr.card} <span style={{color:C.sub,fontSize:12}}>· {cr.grade}</span></div>
        <label style={{...chk,marginTop:8,marginBottom:0,fontSize:12.5}}><input type="checkbox" checked={match} onChange={e=>{setMatch(e.target.checked);onVerified(e.target.checked);}}/><span>Slab in hand matches this record &amp; PSA's photo.</span></label>
      </div>)}
      {cr&&!cr.valid&&<div style={{marginTop:8,color:C.danger,fontSize:12.5,fontFamily:"sans-serif"}}>⚠ {cr.message}</div>}
    </div>);}

// One raw/sealed item row (description + simulated photos)
function RawItem({label,sealed,onReady,onRemove}){
  const [desc,setDesc]=useState(""),[photos,setPhotos]=useState(0);
  return(
    <div style={{marginBottom:12,padding:11,background:C.panel2,borderRadius:9,border:`1px solid ${C.line}`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
        <span style={{fontFamily:"sans-serif",fontSize:12,color:C.sub}}>{label}</span>
        {onRemove&&<span onClick={onRemove} style={{fontFamily:"sans-serif",fontSize:12,color:C.danger,cursor:"pointer"}}>Remove</span>}
      </div>
      <input value={desc} onChange={e=>{setDesc(e.target.value);onReady(!!e.target.value);}} placeholder={sealed?"e.g. Prismatic Evolutions Booster Box":"e.g. Umbreon VMAX Alt Art, NM"} style={inp}/>
      <div onClick={()=>setPhotos(p=>Math.min(p+1,4))} style={{marginTop:9,padding:"9px 11px",border:`1px dashed ${C.line}`,borderRadius:8,textAlign:"center",cursor:"pointer",fontFamily:"sans-serif",fontSize:12.5,color:C.blue}}>
        📷 {photos===0?"Add photos of the actual item":`${photos} photo${photos>1?"s":""} added — tap to add more`}</div>
      {photos>0&&<div style={{display:"flex",gap:5,marginTop:7}}>{Array.from({length:photos}).map((_,i)=><div key={i} style={{width:38,height:38,background:C.line,borderRadius:5,display:"grid",placeItems:"center",fontSize:16}}>🖼️</div>)}</div>}
      <div style={{fontFamily:"sans-serif",fontSize:11,color:C.sub,marginTop:7,lineHeight:1.5}}>Photos of the real item become part of the record. The buyer confirms what arrives matches them. (Photos show it's the right item in the shown condition — not proof it's genuine.)</div>
    </div>);}

function TradeFlow(){
  const [step,setStep]=useState(0);
  const [form,setForm]=useState("graded");
  const [type,setType]=useState("sell");
  // multiple items per side
  const [give,setGive]=useState([{id:1,ready:false}]);
  const [recv,setRecv]=useState([{id:1,ready:false}]);
  const [value,setValue]=useState("");
  const [mode,setMode]=useState("");
  const [payment,setPayment]=useState("");
  const [joined,setJoined]=useState(false);
  const [exchanged,setExchanged]=useState(false);
  const [bMatch,setBMatch]=useState(false),[done,setDone]=useState(false);
  const [role,setRole]=useState("seller"),[tags,setTags]=useState([]);
  const toggleTag=(t)=>setTags(p=>p.includes(t)?p.filter(x=>x!==t):[...p,t]);

  const graded=form==="graded";
  const isSwap=type==="swap"||type==="swapcash";
  const needsValue=type==="sell"||type==="swapcash";
  const irreversible=["zelle","venmo","cashapp","cash"].includes(payment);

  const setReady=(side,id,val)=>{const upd=(arr)=>arr.map(x=>x.id===id?{...x,ready:val}:x);side==="give"?setGive(upd):setRecv(upd);};
  const addItem=(side)=>{const add=(arr)=>[...arr,{id:Math.max(...arr.map(x=>x.id))+1,ready:false}];side==="give"?setGive(add):setRecv(add);};
  const rmItem=(side,id)=>{const rm=(arr)=>arr.filter(x=>x.id!==id);side==="give"?setGive(rm):setRecv(rm);};

  const giveOk=give.every(x=>x.ready)&&give.length>0;
  const recvOk=isSwap?(recv.every(x=>x.ready)&&recv.length>0):true;
  const valueOk=needsValue?!!value:true;
  const itemsOk=giveOk&&recvOk&&valueOk;

  const ItemRow=(side,item,arr)=> graded
    ? <GradedItem key={item.id} label={`Card ${arr.indexOf(item)+1}`} onVerified={v=>setReady(side,item.id,v)} onRemove={arr.length>1?()=>rmItem(side,item.id):null}/>
    : <RawItem key={item.id} label={`Item ${arr.indexOf(item)+1}`} sealed={form==="sealed"} onReady={v=>setReady(side,item.id,v)} onRemove={arr.length>1?()=>rmItem(side,item.id):null}/>;

  return(
    <div style={{paddingTop:18}}>
      <Stepper step={step}/>

      {step===0&&(<Panel>
        <Lbl>What's being traded?</Lbl>
        <div style={{display:"flex",gap:7,marginBottom:12}}>
          <Toggle on={form==="graded"} onClick={()=>{setForm("graded");setGive([{id:1,ready:false}]);setRecv([{id:1,ready:false}]);}}>Graded slab</Toggle>
          <Toggle on={form==="raw"} onClick={()=>{setForm("raw");setGive([{id:1,ready:false}]);setRecv([{id:1,ready:false}]);}}>Raw single</Toggle>
          <Toggle on={form==="sealed"} onClick={()=>{setForm("sealed");setGive([{id:1,ready:false}]);setRecv([{id:1,ready:false}]);}}>Sealed</Toggle>
        </div>
        <Lbl>Trade type</Lbl>
        <div style={{display:"flex",gap:7,marginBottom:14}}>
          <Toggle on={type==="sell"} onClick={()=>setType("sell")}>Sell / Buy</Toggle>
          <Toggle on={type==="swap"} onClick={()=>setType("swap")}>Swap</Toggle>
          <Toggle on={type==="swapcash"} onClick={()=>setType("swapcash")}>Swap + cash</Toggle>
        </div>

        {!graded&&<div style={{marginBottom:12,background:"#221a22",border:`1px solid ${C.warn}`,borderRadius:8,padding:10,fontSize:12,color:C.warn,fontFamily:"sans-serif",lineHeight:1.5}}>
          ⚠ {form==="sealed"?"We can't verify a sealed box is authentic.":"Raw cards have no cert — we can't authenticate them."} Protection here is photos + the trader's record. See the Spot fakes guide before committing.</div>}

        <Lbl>{isSwap?"What you're giving":"Item(s)"}</Lbl>
        {give.map(it=>ItemRow("give",it,give))}
        <div onClick={()=>addItem("give")} style={addBtn}>+ Add another {graded?"card":"item"}</div>

        {isSwap&&(<><Lbl style={{marginTop:14}}>What you're receiving</Lbl>
          {recv.map(it=>ItemRow("recv",it,recv))}
          <div onClick={()=>addItem("recv")} style={addBtn}>+ Add another {graded?"card":"item"}</div></>)}

        {needsValue&&(<><Lbl style={{marginTop:14}}>{type==="swapcash"?"Cash on top (USD)":"Agreed total value (USD)"}</Lbl>
          <input value={value} onChange={e=>setValue(e.target.value)} placeholder={type==="swapcash"?"e.g. 50":"e.g. 480"} style={inp}/>
          <div style={{fontFamily:"sans-serif",fontSize:11,color:C.sub,marginTop:6,lineHeight:1.5}}>Logged privately to weight standing. Public page shows totals/tiers, not this.</div></>)}
        <Next disabled={!itemsOk} onClick={()=>setStep(1)}>Continue</Next>
      </Panel>)}

      {step===1&&(<Panel>
        <Lbl>How is this happening?</Lbl>
        <div style={{display:"flex",gap:8}}>
          <Toggle on={mode==="ship"} onClick={()=>{setMode("ship");setPayment("");}}>Shipped</Toggle>
          <Toggle on={mode==="person"} onClick={()=>{setMode("person");setPayment("");}}>In person / show</Toggle>
        </div>
        {mode&&type!=="swap"&&(<><Lbl style={{marginTop:16}}>Payment method</Lbl>
          <select value={payment} onChange={e=>setPayment(e.target.value)} style={inp}>
            <option value="">Select…</option>
            {mode==="ship"&&<option value="gs">PayPal Goods &amp; Services (protected)</option>}
            {mode==="person"&&<option value="cash">Cash (in person)</option>}
            <option value="venmo">Venmo</option><option value="zelle">Zelle</option><option value="cashapp">Cash App</option>
          </select></>)}
        {mode&&type==="swap"&&<div style={{marginTop:14,fontFamily:"sans-serif",fontSize:13,color:C.sub,lineHeight:1.5}}>Straight swap — no payment leg.</div>}
        {mode==="person"&&<div style={{marginTop:11,background:C.panel2,border:`1px solid ${C.line}`,borderRadius:8,padding:11,fontSize:12,color:C.sub,fontFamily:"sans-serif",lineHeight:1.5}}>Confirmed by <strong style={{color:C.ink}}>both phones, same place &amp; time</strong>. For raw/sealed in person, check the card yourself — that + the record is the protection.</div>}
        {irreversible&&<div style={{marginTop:11,background:"#2a1f16",border:`1px solid ${C.warn}`,borderRadius:8,padding:11,fontSize:12,color:C.warn,fontFamily:"sans-serif",lineHeight:1.5}}>⚠ Can't be reversed if it goes wrong. Most reported scams use exactly this plus an off-platform chat.</div>}
        {mode&&(type==="swap"||payment)&&(!joined?(
          <div style={{marginTop:16,background:C.panel2,border:`1px dashed ${C.line}`,borderRadius:9,padding:15,textAlign:"center"}}>
            <div style={{fontFamily:"sans-serif",fontSize:12,color:C.sub,marginBottom:9}}>{mode==="person"?"Have them scan this at the table:":"Share so they join from their own account:"}</div>
            <div style={{fontFamily:"monospace",fontSize:13,color:C.blue,background:C.bg,padding:"8px 10px",borderRadius:6}}>cardledger.app/t/9F2X-AQ71</div>
            <button onClick={()=>setJoined(true)} style={{...sBtn,marginTop:11,width:"100%"}}>Simulate: @kanto_grades joins</button>
          </div>
        ):<div style={{marginTop:14,color:C.accent,fontFamily:"sans-serif",fontSize:13.5}}>✓ @kanto_grades joined — verified eBay + YouTube history.</div>)}
        <Next disabled={!mode||(type!=="swap"&&!payment)||!joined} onClick={()=>setStep(2)}>Lock terms &amp; continue</Next>
      </Panel>)}

      {step===2&&(<Panel>
        {mode==="ship"?(<><div style={{fontFamily:"sans-serif",fontSize:13,color:C.sub,marginBottom:13,lineHeight:1.5}}>Each milestone is timestamped and frozen.</div>
          {!exchanged?<button onClick={()=>setExchanged(true)} style={pBtn}>Mark as shipped (+ tracking)</button>:<div style={mDone}>✓ Marked shipped — {ts()}</div>}</>
        ):(<><div style={{fontFamily:"sans-serif",fontSize:13,color:C.sub,marginBottom:13,lineHeight:1.5}}>Both tap below while you're together (second phone simulated).</div>
          {!exchanged?<button onClick={()=>setExchanged(true)} style={pBtn}>Confirm in-person exchange (both phones)</button>:<div style={mDone}>✓ Both phones confirmed, same place &amp; time — {ts()}</div>}</>)}
        <Next disabled={!exchanged} onClick={()=>setStep(3)}>Continue</Next>
      </Panel>)}

      {step===3&&(<Panel>
        <div style={{fontFamily:"sans-serif",fontSize:13,color:C.sub,marginBottom:13,lineHeight:1.5}}>
          Receiver's side (simulated). {graded?"Confirm what arrived matches the PSA record(s).":"Confirm what arrived matches the photos & description."}</div>
        {!done?(<>
          <label style={{...chk,marginBottom:14}}><input type="checkbox" checked={bMatch} onChange={e=>setBMatch(e.target.checked)}/>
            <span>{graded?"Everything matches the cert(s) & PSA's photos.":"What I received matches the photos & description."}</span></label>
          <button onClick={()=>setDone(true)} disabled={!bMatch} style={{...pBtn,opacity:bMatch?1:0.4}}>Confirm received &amp; matches</button>
          <button style={{...gBtn,color:C.danger,borderColor:C.danger}}>Something's wrong — open a dispute</button>
        </>):<div style={mDone}>✓ Received &amp; confirmed matching — {ts()}</div>}
        <Next disabled={!done} onClick={()=>setStep(4)}>Continue to reviews</Next>
      </Panel>)}

      {step===4&&(<Panel>
        <Badge>VERIFIED TRADE</Badge>
        <div style={{fontFamily:"sans-serif",fontSize:13,color:C.sub,margin:"10px 0 13px",lineHeight:1.5}}>
          Review @kanto_grades in the role they played. Tagged verified, counts toward standing <em>in that role</em>.</div>
        <Lbl>They acted as:</Lbl>
        <div style={{display:"flex",gap:7,marginBottom:13}}>
          <Toggle on={role==="seller"} onClick={()=>{setRole("seller");setTags([]);}}>Seller</Toggle>
          <Toggle on={role==="buyer"} onClick={()=>{setRole("buyer");setTags([]);}}>Buyer</Toggle>
          <Toggle on={role==="swapper"} onClick={()=>{setRole("swapper");setTags([]);}}>Swapper</Toggle>
        </div>
        <Lbl>What went well? (tap any)</Lbl>
        <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:13}}>
          {chipsFor(role,mode).map(tag=>{const on=tags.includes(tag);
            return <span key={tag} onClick={()=>toggleTag(tag)} style={{fontFamily:"sans-serif",fontSize:12,background:on?C.accentDim:C.panel2,border:`1px solid ${on?C.accent:C.line}`,padding:"6px 10px",borderRadius:16,color:on?"#bfe6d2":C.ink,cursor:"pointer",userSelect:"none"}}>{on?"✓ ":""}{tag}</span>;})}
        </div>
        <textarea placeholder="Anything to add?" style={{...inp,height:58,resize:"none",fontFamily:"sans-serif"}}/>
        <Next onClick={()=>setStep(5)}>Submit verified review</Next>
      </Panel>)}

      {step===5&&(<Panel><div style={{textAlign:"center",padding:"8px 0"}}>
        <div style={{fontSize:38,marginBottom:6}}>✓</div>
        <div style={{fontSize:18,marginBottom:8}}>Trade recorded.</div>
        <div style={{fontFamily:"sans-serif",fontSize:13,color:C.sub,lineHeight:1.6,maxWidth:330,margin:"0 auto"}}>
          Both now have one more verified trade — tagged by role, new distinct partner, logged value. That web of who-dealt-with-whom, over time, is the part no one can fake and no scammer can escape.</div>
      </div></Panel>)}
    </div>);}

function SellerPage(){return(
  <div style={{paddingTop:18}}>
    <Panel>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:50,height:50,borderRadius:12,background:C.panel2,display:"grid",placeItems:"center",fontSize:22}}>🦊</div>
        <div><div style={{fontSize:19,fontWeight:600}}>@kanto_grades</div><div style={{marginTop:4}}><Badge>ESTABLISHED · 2YR</Badge></div></div>
      </div>
      <div style={{fontFamily:"sans-serif",fontSize:11,color:C.sub,marginTop:8,lineHeight:1.5}}>Status earned from history, not awarded: 100+ distinct partners, 12+ months, under 2% disputes. Held by staying active — lost on a confirmed serious dispute.</div>
      <div style={{fontFamily:"sans-serif",fontSize:11,color:C.sub,marginTop:14,marginBottom:6,letterSpacing:1}}>AS A SELLER</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:1,background:C.line,borderRadius:10,overflow:"hidden"}}>
        <Stat n="121" l="sales"/><Stat n="104" l="distinct buyers" hi/><Stat n="0.8%" l="disputes"/>
      </div>
      <div style={{fontFamily:"sans-serif",fontSize:11,color:C.sub,marginTop:13,marginBottom:6,letterSpacing:1}}>AS A BUYER</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:1,background:C.line,borderRadius:10,overflow:"hidden"}}>
        <Stat n="22" l="purchases"/><Stat n="19" l="distinct sellers" hi/><Stat n="0%" l="disputes"/>
      </div>
      <div style={{fontFamily:"sans-serif",fontSize:11,color:C.sub,marginTop:10,textAlign:"center"}}>Distinct partners, volume &amp; time are the hard-to-fake numbers. $40k+ verified. No individual prices shown.</div>
      <div style={{marginTop:15,fontFamily:"sans-serif",fontSize:12,color:C.sub}}>Linked accounts:</div>
      <div style={{display:"flex",gap:7,marginTop:7,flexWrap:"wrap"}}>
        <Acct v>eBay · 99.8%</Acct><Acct v>YouTube · 41k</Acct><Acct v>Instagram</Acct><Acct>TikTok (claimed)</Acct>
      </div>
      <div style={{fontFamily:"sans-serif",fontSize:11,color:C.sub,marginTop:8,lineHeight:1.5}}>✓ = ownership verified. "Claimed" = stated but not yet proven, so weighted less.</div>
    </Panel>
    <div style={{marginTop:13,fontFamily:"sans-serif",fontSize:13,color:C.sub,marginBottom:8,paddingLeft:2}}>Recent reviews</div>
    <Rev v role="as seller" n="@charizard_uk" t="Raw Umbreon exactly as the photos showed, shipped fast." />
    <Rev v role="as swapper" n="@route1_cards" t="Met at a show, clean swap + cash, both confirmed on the spot." />
    <Rev v role="as buyer" n="@pallettown" t="Paid instantly, no chargeback games." />
    <div style={{background:C.panel,border:`1px solid ${C.warn}`,borderRadius:10,padding:12,marginBottom:8}}>
      <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontFamily:"sans-serif",fontSize:13}}>@buyer_x · dispute</span><span style={{fontFamily:"sans-serif",fontSize:10,color:C.accent}}>RESOLVED (0.5)</span></div>
      <div style={{fontFamily:"sans-serif",fontSize:13,marginTop:6,lineHeight:1.5}}>"Item not received." <span style={{color:C.sub}}>Seller reply: courier lost it, full refund sent — buyer confirmed resolved.</span></div>
    </div>
    <Rev n="@anon_buyer" t="Good deal but slow to reply." note="Unverified — not tied to a recorded trade, weighted lower."/>
    <div style={{textAlign:"center",marginTop:4}}><span style={{fontFamily:"sans-serif",fontSize:11.5,color:C.sub,textDecoration:"underline",cursor:"pointer"}}>Report a review or dispute this record</span></div>
  </div>);}
function Acct({children,v}){return <span style={{fontFamily:"sans-serif",fontSize:12,background:C.panel2,border:`1px solid ${v?C.accentDim:C.line}`,padding:"4px 9px",borderRadius:6,color:v?"#bfe6d2":C.sub}}>{v?"✓ ":""}{children}</span>;}

function FakeGuide({setView}){return(
  <div style={{paddingTop:18}}>
    <Panel>
      <div style={{fontSize:18,fontWeight:600,marginBottom:6}}>How to spot fakes</div>
      <div style={{fontFamily:"sans-serif",fontSize:12.5,color:C.warn,lineHeight:1.55,marginBottom:14,background:"#2a2016",border:`1px solid ${C.warn}`,borderRadius:8,padding:11}}>
        No single test is conclusive — good modern fakes beat any one check. Combine several, and for high value get professional authentication. When unsure, fall back on the trader's verified record.</div>
      <G h="Raw singles">
        <li><b>Light test:</b> real cards have an opaque black core layer — light shouldn't pass through. See-through = almost certainly fake.</li>
        <li><b>Texture &amp; finish:</b> genuine backs have a subtle linen pattern; fakes feel too smooth or too glossy.</li>
        <li><b>Font &amp; the accented é:</b> "Pokémon" should have the correct accent; check weight and spacing against a known-real card.</li>
        <li><b>Colour &amp; edges:</b> compare blue back-colour and cut quality to an authentic card from the same era.</li>
      </G>
      <G h="Sealed product">
        <li><b>Weight:</b> compare to a known-real box's listed weight — resealed/short-packed boxes are often off.</li>
        <li><b>Wrap &amp; seams:</b> factory shrink-wrap is tight with clean seams; reseals show loose wrap or seams in the wrong place.</li>
        <li><b>Print &amp; flaps:</b> blurry print, off colour, or glued (not heat-sealed) flaps are red flags.</li>
        <li><b>Buy sealed from verified records:</b> you can't see inside — the trader's track record does most of the work.</li>
      </G>
      <G h="Graded slabs">
        <li><b>Cert check:</b> verify the number on PSA and that it describes this exact card.</li>
        <li><b>Compare PSA's photo:</b> match the slab to PSA's archived image for that cert.</li>
        <li><b>Case &amp; label:</b> fake slabs exist — check font, label alignment, and case feel against a real one.</li>
      </G>
      <div style={{fontFamily:"sans-serif",fontSize:11.5,color:C.sub,marginTop:6,lineHeight:1.5,fontStyle:"italic"}}>This is guidance to help your own judgment — CardLedger doesn't authenticate cards.</div>
    </Panel>
    <button onClick={()=>setView("home")} style={{...gBtn,marginTop:14}}>← Back</button>
  </div>);}
function G({h,children}){return <div style={{marginBottom:14}}>
  <div style={{fontFamily:"sans-serif",fontSize:14,fontWeight:600,marginBottom:6}}>{h}</div>
  <ul style={{margin:0,paddingLeft:18,fontFamily:"sans-serif",fontSize:12.5,color:C.sub,lineHeight:1.6}}>{children}</ul></div>;}

function Stepper({step}){return(<div style={{display:"flex",gap:5,marginBottom:14,fontFamily:"sans-serif"}}>
  {STEPS.map((s,i)=><div key={s} style={{flex:1,textAlign:"center"}}>
    <div style={{height:3,borderRadius:2,background:i<=step?C.accent:C.line}}/>
    <div style={{fontSize:9.5,marginTop:4,color:i===step?C.ink:C.sub}}>{s}</div></div>)}</div>);}
function Toggle({on,onClick,children}){return(<button onClick={onClick} style={{flex:1,background:on?C.accentDim:C.panel2,color:on?"#bfe6d2":C.sub,border:`1px solid ${on?C.accent:C.line}`,borderRadius:9,padding:"10px 4px",fontSize:12,fontFamily:"sans-serif",cursor:"pointer"}}>{children}</button>);}
function Panel({children}){return <div style={{background:C.panel,border:`1px solid ${C.line}`,borderRadius:13,padding:16}}>{children}</div>;}
function Lbl({children,style}){return <div style={{fontFamily:"sans-serif",fontSize:12.5,color:C.sub,marginBottom:6,...style}}>{children}</div>;}
function Badge({children}){return <span style={{fontFamily:"sans-serif",fontSize:10.5,letterSpacing:1,background:C.accentDim,color:"#bfe6d2",padding:"3px 8px",borderRadius:5,fontWeight:700}}>{children}</span>;}
function Stat({n,l,hi}){return <div style={{background:hi?C.panel2:C.panel,padding:"12px 5px",textAlign:"center"}}><div style={{fontSize:19,color:hi?C.accent:C.ink}}>{n}</div><div style={{fontFamily:"sans-serif",fontSize:10,color:C.sub,marginTop:3}}>{l}</div></div>;}
function Rev({n,t,v,role,note}){return <div style={{background:C.panel,border:`1px solid ${C.line}`,borderRadius:10,padding:12,marginBottom:8}}>
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
    <span style={{fontFamily:"sans-serif",fontSize:13}}>{n} {role&&<span style={{color:C.sub,fontSize:11}}>· {role}</span>}</span>
    <span style={{fontFamily:"sans-serif",fontSize:10,color:v?C.accent:C.sub}}>{v?"✓ Verified":"Unverified"}</span></div>
  <div style={{fontFamily:"sans-serif",fontSize:13,marginTop:6,lineHeight:1.5}}>{t}</div>
  {note&&<div style={{fontFamily:"sans-serif",fontSize:11,color:C.sub,marginTop:7,fontStyle:"italic"}}>{note}</div>}</div>;}
function Next({children,onClick,disabled}){return <button onClick={onClick} disabled={disabled} style={{...pBtn,marginTop:16,opacity:disabled?0.4:1,cursor:disabled?"not-allowed":"pointer"}}>{children}</button>;}
function Foot(){return <div style={{maxWidth:460,margin:"0 auto",padding:"0 16px",fontFamily:"sans-serif",fontSize:11,color:"#55606d",textAlign:"center",lineHeight:1.6}}>Concept demo. Second trader, PSA checks &amp; photos simulated; nothing saved. "CardLedger" is a placeholder name.</div>;}
function ts(){return new Date().toLocaleString("en-US",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"});}
function chipsFor(role,mode){
  const ship=mode==="ship";
  if(role==="seller") return ship?["Item as described","Well packed","Shipped fast","Honest grading"]:["Item as described","Honest about condition","Fair price","Easy to deal with"];
  if(role==="buyer") return ship?["Paid promptly","No false claims","Easy comms","No chargeback games"]:["Paid on the spot","Fair on price","Easy comms","No games"];
  return ship?["Card as described","Fair swap","Well packed","Honest condition"]:["Card as described","Fair swap","Honest condition","Easy to deal with"];
}

const pBtn={width:"100%",background:C.accent,color:"#0c130f",border:"none",borderRadius:9,padding:13,fontSize:15,fontWeight:600,fontFamily:"Georgia, serif",cursor:"pointer"};
const gBtn={width:"100%",background:"transparent",color:C.sub,border:`1px solid ${C.line}`,borderRadius:9,padding:12,fontSize:14,fontFamily:"sans-serif",cursor:"pointer",marginTop:10};
const sBtn={background:C.panel2,color:C.ink,border:`1px solid ${C.line}`,borderRadius:8,padding:"0 16px",fontSize:14,fontFamily:"sans-serif",cursor:"pointer"};
const inp={width:"100%",background:C.bg,color:C.ink,border:`1px solid ${C.line}`,borderRadius:8,padding:"11px 12px",fontSize:15,fontFamily:"sans-serif",boxSizing:"border-box"};
const mDone={marginTop:14,background:C.panel2,border:`1px solid ${C.accentDim}`,borderRadius:8,padding:12,color:C.accent,fontFamily:"sans-serif",fontSize:13.5};
const chk={display:"flex",gap:9,alignItems:"flex-start",cursor:"pointer",fontFamily:"sans-serif",fontSize:13.5,marginBottom:10,lineHeight:1.4};
const addBtn={marginTop:2,padding:"9px",border:`1px dashed ${C.line}`,borderRadius:8,textAlign:"center",cursor:"pointer",fontFamily:"sans-serif",fontSize:13,color:C.blue};
