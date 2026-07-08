"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
type Settings = {
  id?: string; full_name: string; display_name: string; email: string; role: string;
  currency: string; date_format: string; timezone: string; report_language: string;
  dark_mode: boolean; compact_sidebar: boolean; show_mascot: boolean;
  notif_telegram: boolean; notif_whatsapp: boolean; notif_email: boolean; notif_inapp: boolean;
  telegram_bot_token: string; telegram_chat_id: string;
  alert_immediate: boolean; alert_daily: boolean; alert_quiet_hours: boolean;
  alert_rules: { cpa_threshold: number; ctr_drop: number; spend_spike: number; impression_drop: number; };
};
const D: Settings = {
  full_name:"Adilah Darus",display_name:"Dila",email:"dila@synapsysdigital.com",role:"Admin",
  currency:"MYR",date_format:"DD/MM/YYYY",timezone:"Asia/Kuala_Lumpur",report_language:"English",
  dark_mode:false,compact_sidebar:false,show_mascot:true,
  notif_telegram:true,notif_whatsapp:false,notif_email:true,notif_inapp:false,
  telegram_bot_token:"",telegram_chat_id:"",
  alert_immediate:true,alert_daily:false,alert_quiet_hours:false,
  alert_rules:{cpa_threshold:100,ctr_drop:20,spend_spike:30,impression_drop:25},
};
type Section="general"|"notifications"|"connected"|"workspaces"|"platforms"|"alerts"|"billing";
const LABELS:Record<Section,string>={general:"General",notifications:"Notifications",connected:"Connected Accounts",workspaces:"Brand Workspaces",platforms:"Platform Defaults",alerts:"Alert Rules",billing:"Billing & Plan"};
const SUBS:Record<Section,string>={general:"Your account details and display preferences",notifications:"Where and when ASHI sends alerts",connected:"Ad platforms and social accounts",workspaces:"Manage your client brand workspaces",platforms:"Default character limits per ad platform",alerts:"Performance thresholds that trigger notifications",billing:"Your current plan and usage"};
const cls="w-full rounded-lg border border-border bg-surface px-3 py-2 text-[13px] text-text outline-none focus:border-orange";
export function SettingsPage(){
  const [sec,setSec]=useState<Section>("general");
  const [s,setS]=useState<Settings>(D);
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);
  const [toast,setToast]=useState("");
  const sb=createClient();
  useEffect(()=>{
    sb.from("user_settings").select("*").limit(1).single().then(({data,error})=>{
      if(data&&!error)setS({...D,...data});
      setLoading(false);
    });
  },[]);
  function showToast(m:string){setToast(m);setTimeout(()=>setToast(""),2500);}
  function upd(p:Partial<Settings>){setS(prev=>({...prev,...p}));}
  function updRule(k:keyof Settings["alert_rules"],v:number){setS(prev=>({...prev,alert_rules:{...prev.alert_rules,[k]:v}}));}
  async function save(){
    setSaving(true);
    try{
      const{id,...f}=s;
      if(id){const{error}=await sb.from("user_settings").update({...f,updated_at:new Date().toISOString()}).eq("id",id);if(error)throw error;}
      else{const{error}=await sb.from("user_settings").insert([f]);if(error)throw error;}
      showToast("✓ Settings saved");
    }catch(e){showToast(e instanceof Error?e.message:"Failed to save");}
    finally{setSaving(false);}
  }
  if(loading)return<div className="flex h-40 items-center justify-center text-[13px] text-text-3">Loading settings…</div>;
  return(
    <div className="flex gap-0 -m-6">
      <nav className="w-[200px] shrink-0 border-r border-border bg-surface px-2 py-4 min-h-screen">
        <NS l="Account"/>
        <NI a={sec==="general"} o={()=>setSec("general")} l="General" i={<svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"><circle cx="10" cy="7" r="3"/><path d="M4 18c0-3.3 2.7-6 6-6s6 2.7 6 6"/></svg>}/>
        <NI a={sec==="notifications"} o={()=>setSec("notifications")} l="Notifications" i={<svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"><path d="M10 2s-4 1.5-4 6v5l-2 2h12l-2-2V8c0-4.5-4-6-4-6"/><path d="M8.5 16a1.5 1.5 0 003 0"/></svg>}/>
        <NS l="Connections"/>
        <NI a={sec==="connected"} o={()=>setSec("connected")} l="Connected Accounts" i={<svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"><path d="M7 10.5H4.5C3 10.5 2 9.5 2 8s1-2.5 2.5-2.5H7"/><path d="M13 5.5h2.5C17 5.5 18 6.5 18 8s-1 2.5-2.5 2.5H13"/><line x1="7" y1="8" x2="13" y2="8"/></svg>}/>
        <NI a={sec==="workspaces"} o={()=>setSec("workspaces")} l="Brand Workspaces" i={<svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"><rect x="2" y="7" width="16" height="11" rx="1.5"/><path d="M6 7V5a4 4 0 018 0v2"/></svg>}/>
        <NS l="ASHI"/>
        <NI a={sec==="platforms"} o={()=>setSec("platforms")} l="Platform Defaults" i={<svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"><rect x="3" y="3" width="6" height="6" rx="1"/><rect x="11" y="3" width="6" height="6" rx="1"/><rect x="3" y="11" width="6" height="6" rx="1"/><rect x="11" y="11" width="6" height="6" rx="1"/></svg>}/>
        <NI a={sec==="alerts"} o={()=>setSec("alerts")} l="Alert Rules" i={<svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M10 2l8 14H2L10 2z"/><line x1="10" y1="8" x2="10" y2="12"/><circle cx="10" cy="15" r="0.5" fill="currentColor"/></svg>}/>
        <NS l="Plan"/>
        <NI a={sec==="billing"} o={()=>setSec("billing")} l="Billing & Plan" i={<svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"><rect x="2" y="5" width="16" height="12" rx="1.5"/><path d="M2 9h16"/><path d="M6 13h2"/></svg>}/>
      </nav>
      <div className="flex-1 p-6">
        <div className="mb-5 flex items-center justify-between">
          <div><h2 className="text-[18px] font-bold text-text">{LABELS[sec]}</h2><p className="text-[13px] text-text-3">{SUBS[sec]}</p></div>
          {(sec==="general"||sec==="notifications"||sec==="alerts")&&<button type="button" onClick={save} disabled={saving} className="rounded-lg bg-orange px-4 py-2 text-[13px] font-semibold text-white hover:opacity-90 disabled:opacity-50">{saving?"Saving…":"Save Changes"}</button>}
        </div>
        {sec==="general"&&<div className="space-y-4">
          <SC t="Profile">
            <div className="mb-5 flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-orange text-[22px] font-bold text-white">{s.display_name?.[0]?.toUpperCase()??"D"}</div>
              <div className="flex flex-col gap-1.5"><button type="button" onClick={()=>showToast("File picker coming soon")} className="w-fit rounded-lg border border-border px-3 py-1.5 text-[12px] font-medium text-text-2 hover:bg-surface-2">Upload Photo</button><span className="text-[11px] text-text-3">JPG or PNG, max 2MB</span></div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <F l="Full Name"><input type="text" value={s.full_name} onChange={e=>upd({full_name:e.target.value})} className={cls}/></F>
              <F l="Display Name"><input type="text" value={s.display_name} onChange={e=>upd({display_name:e.target.value})} className={cls}/></F>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <F l="Email"><input type="email" value={s.email} onChange={e=>upd({email:e.target.value})} className={cls}/></F>
              <F l="Role"><select value={s.role} onChange={e=>upd({role:e.target.value})} className={cls}><option>Admin</option><option>Manager</option><option>Viewer</option></select></F>
            </div>
          </SC>
          <SC t="Preferences">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <F l="Default Currency"><select value={s.currency} onChange={e=>upd({currency:e.target.value})} className={cls}><option value="MYR">MYR — Malaysian Ringgit</option><option value="SGD">SGD — Singapore Dollar</option><option value="USD">USD — US Dollar</option><option value="GBP">GBP — British Pound</option></select></F>
              <F l="Date Format"><select value={s.date_format} onChange={e=>upd({date_format:e.target.value})} className={cls}><option>DD/MM/YYYY</option><option>MM/DD/YYYY</option><option>YYYY-MM-DD</option></select></F>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <F l="Timezone"><select value={s.timezone} onChange={e=>upd({timezone:e.target.value})} className={cls}><option value="Asia/Kuala_Lumpur">Asia/Kuala_Lumpur (GMT+8)</option><option value="Asia/Singapore">Asia/Singapore (GMT+8)</option><option value="UTC">UTC</option></select></F>
              <F l="Default Report Language"><select value={s.report_language} onChange={e=>upd({report_language:e.target.value})} className={cls}><option>English</option><option>Bahasa Malaysia</option></select></F>
            </div>
          </SC>
          <SC t="Appearance">
            <TG l="Dark Mode" d="Switch between light and dark interface" v={s.dark_mode} c={v=>upd({dark_mode:v})}/>
            <TG l="Compact sidebar" d="Show icons only in the sidebar navigation" v={s.compact_sidebar} c={v=>upd({compact_sidebar:v})}/>
            <TG l="Show ASHI mascot" d="Display ASHI giraffe in chat and alert bubbles" v={s.show_mascot} c={v=>upd({show_mascot:v})}/>
          </SC>
        </div>}
        {sec==="notifications"&&<div className="space-y-4">
          <SC t="Channels">
            <TG l="Telegram" d={s.notif_telegram?"Connected — @ashi_alerts_bot":"Not connected"} v={s.notif_telegram} c={v=>upd({notif_telegram:v})}/>
            <TG l="WhatsApp" d="Send alerts via WhatsApp Business API" v={s.notif_whatsapp} c={v=>upd({notif_whatsapp:v})}/>
            <TG l="Email digest" d="Weekly summary email every Monday 8am" v={s.notif_email} c={v=>upd({notif_email:v})}/>
            <TG l="In-app only" d="Show alerts inside ASHI, no external notifications" v={s.notif_inapp} c={v=>upd({notif_inapp:v})}/>
          </SC>
          <SC t="Telegram Setup">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <F l="Bot Token" h="Get from @BotFather on Telegram"><input type="text" value={s.telegram_bot_token} onChange={e=>upd({telegram_bot_token:e.target.value})} placeholder="Bot token" className={cls}/></F>
              <F l="Chat ID" h="Your personal or group chat ID"><input type="text" value={s.telegram_chat_id} onChange={e=>upd({telegram_chat_id:e.target.value})} placeholder="Chat ID" className={cls}/></F>
            </div>
            <button type="button" onClick={()=>showToast("✓ Test message sent to Telegram")} className="rounded-lg border border-border px-3 py-1.5 text-[12px] font-medium text-text-2 hover:bg-surface-2">Send Test Message</button>
          </SC>
          <SC t="Alert Frequency">
            <TG l="Immediate alerts" d="Send as soon as a red flag triggers" v={s.alert_immediate} c={v=>upd({alert_immediate:v})}/>
            <TG l="Daily summary" d="One digest of all alerts at 9am daily" v={s.alert_daily} c={v=>upd({alert_daily:v})}/>
            <TG l="Quiet hours" d="Pause alerts between 10pm – 7am" v={s.alert_quiet_hours} c={v=>upd({alert_quiet_hours:v})}/>
          </SC>
        </div>}
        {sec==="connected"&&<div className="space-y-4">
          <SC t="Ad Platforms">
            <AR p="Google Ads" d="ads.google.com · Last synced 2 hours ago" s="connected" a={()=>showToast("Google Ads reconnect coming soon")} al="Reconnect"/>
            <AR p="Meta Ads" d="facebook.com/ads · Not connected" s="disconnected" a={()=>showToast("Meta Ads OAuth coming soon")} al="Connect"/>
            <AR p="TikTok Ads" d="ads.tiktok.com · Not connected" s="disconnected" a={()=>showToast("TikTok Ads OAuth coming soon")} al="Connect"/>
          </SC>
          <SC t="Social Platforms">
            <AR p="Instagram" d="graph.instagram.com · Token expired" s="error" a={()=>showToast("Instagram reconnect coming soon")} al="Reconnect"/>
            <AR p="LinkedIn" d="api.linkedin.com · Not connected" s="disconnected" a={()=>showToast("LinkedIn OAuth coming soon")} al="Connect"/>
          </SC>
        </div>}
        {sec==="workspaces"&&<div className="grid grid-cols-2 gap-4">
          <BC n="AM Interpretiv" i="Translation & Interpretation" c={3} u={12} col="#E07000"/>
          <BC n="Think English MY" i="Language Education" c={2} u={8} col="#2563EB"/>
          <BC n="Bangsar Dental" i="Healthcare / Dental" c={1} u={4} col="#16A34A"/>
          <button type="button" onClick={()=>showToast("Add brand workspace coming soon")} className="flex min-h-[120px] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border hover:border-orange hover:bg-orange-pale">
            <span className="text-[24px] text-text-3">+</span><span className="text-[13px] font-semibold text-text-3">Add Brand Workspace</span>
          </button>
        </div>}
        {sec==="platforms"&&<div className="space-y-4">
          <SC t="Google Ads — Character Limits"><div className="grid grid-cols-3 gap-3"><CL l="Headline" dv={30}/><CL l="Description" dv={90}/><CL l="Path" dv={15}/></div></SC>
          <SC t="Meta Ads — Character Limits"><div className="grid grid-cols-3 gap-3"><CL l="Primary Text" dv={125}/><CL l="Headline" dv={40}/><CL l="Description" dv={30}/></div></SC>
          <SC t="LinkedIn Ads — Character Limits"><div className="grid grid-cols-3 gap-3"><CL l="Headline" dv={70}/><CL l="Intro Text" dv={150}/><CL l="Description" dv={70}/></div></SC>
          <p className="text-[12px] text-text-3">Platform defaults are used in Ad Copy Studio to flag over-limit copy.</p>
        </div>}
        {sec==="alerts"&&<div className="space-y-4">
          <SC t="Performance Thresholds">
            <ALR l="CPA spike" d="Alert when CPA exceeds threshold" v={s.alert_rules.cpa_threshold} u="MYR" c={v=>updRule("cpa_threshold",v)}/>
            <ALR l="CTR drop" d="Alert when CTR drops by this percentage" v={s.alert_rules.ctr_drop} u="%" c={v=>updRule("ctr_drop",v)}/>
            <ALR l="Spend spike" d="Alert when daily spend exceeds budget by this %" v={s.alert_rules.spend_spike} u="%" c={v=>updRule("spend_spike",v)}/>
            <ALR l="Impression drop" d="Alert when impressions drop by this percentage" v={s.alert_rules.impression_drop} u="%" c={v=>updRule("impression_drop",v)}/>
          </SC>
        </div>}
        {sec==="billing"&&<div className="space-y-4">
          <div className="rounded-xl bg-text p-5 text-white">
            <span className="mb-3 inline-flex items-center gap-1.5 rounded bg-orange px-2.5 py-1 text-[11px] font-bold text-white">✦ Solo Plan</span>
            <p className="text-[22px] font-bold">Free during beta</p>
            <p className="mt-1 text-[13px] text-white/50">All features included while ASHI is in development</p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-[12px] text-white/70">
              {["Unlimited ad copy","Google Ads integration","Organic performance","Ask ASHI AI","UTM builder","Client profiles"].map(f=>(
                <span key={f} className="flex items-center gap-1.5 before:text-green-400 before:content-['✓']">{f}</span>
              ))}
            </div>
            <div className="mt-4 rounded-lg bg-white/8 p-3">
              <UR l="API calls this month" us={42} t={500}/>
              <UR l="Saved ad copy" us={28} t={200}/>
              <UR l="UTM links" us={15} t={100}/>
            </div>
          </div>
          <div className="rounded-xl border border-red p-5">
            <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-red">Danger Zone</p>
            <p className="mb-4 text-[13px] leading-relaxed text-text-3">Permanently delete your ASHI account and all associated data. This cannot be undone.</p>
            <button type="button" onClick={()=>showToast("Account deletion requires email confirmation")} className="rounded-lg border border-red px-3 py-1.5 text-[12px] font-semibold text-red hover:bg-red-pale">Delete Account</button>
          </div>
        </div>}
      </div>
      {toast&&<div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-text px-5 py-2.5 text-[13px] font-semibold text-surface shadow-md">{toast}</div>}
    </div>
  );
}
function NS({l}:{l:string}){return<p className="px-2 pb-1 pt-4 text-[10px] font-bold uppercase tracking-wide text-text-3 first:pt-0">{l}</p>;}
function NI({a,o,l,i}:{a:boolean;o:()=>void;l:string;i:React.ReactNode}){return<button type="button" onClick={o} className={`mb-0.5 flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[13px] font-medium transition-colors ${a?"bg-orange-pale font-semibold text-orange":"text-text-3 hover:bg-surface-2 hover:text-text"}`}><span className="shrink-0">{i}</span>{l}</button>;}
function SC({t,children}:{t:string;children:React.ReactNode}){return<div className="overflow-hidden rounded-xl border border-border bg-surface"><div className="border-b border-border px-5 py-3"><p className="text-[11px] font-bold uppercase tracking-wide text-text-3">{t}</p></div><div className="p-5">{children}</div></div>;}
function F({l,h,children}:{l:string;h?:string;children:React.ReactNode}){return<div className="flex flex-col gap-1.5"><label className="text-[12px] font-semibold text-text-2">{l}</label>{children}{h&&<span className="text-[11px] text-text-3">{h}</span>}</div>;}
function TG({l,d,v,c}:{l:string;d:string;v:boolean;c:(v:boolean)=>void}){return<div className="flex items-center justify-between border-b border-border py-3 last:border-b-0"><div><p className="text-[13px] font-semibold text-text">{l}</p><p className="text-[11px] text-text-3">{d}</p></div><button type="button" onClick={()=>c(!v)} className={`relative h-[22px] w-10 shrink-0 rounded-full transition-colors ${v?"bg-orange":"bg-border"}`}><span className={`absolute top-[3px] h-4 w-4 rounded-full bg-white shadow transition-transform ${v?"translate-x-[18px]":"translate-x-[3px]"}`}/></button></div>;}
function AR({p,d,s,a,al}:{p:string;d:string;s:"connected"|"disconnected"|"error";a:()=>void;al:string}){const ss={connected:"bg-green-pale text-green border border-green",disconnected:"bg-surface-2 text-text-3 border border-border",error:"bg-red-pale text-red border border-red"};const sl={connected:"Connected",disconnected:"Not connected",error:"Token expired"};return<div className="flex items-center gap-3 border-b border-border py-3 last:border-b-0"><div className="flex-1"><p className="text-[13px] font-semibold text-text">{p}</p><p className="text-[11px] font-mono text-text-3">{d}</p></div><span className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-bold ${ss[s]}`}>{sl[s]}</span><button type="button" onClick={a} className="shrink-0 rounded-lg border border-border px-3 py-1 text-[12px] font-medium text-text-2 hover:bg-surface-2">{al}</button></div>;}
function BC({n,i,c,u,col}:{n:string;i:string;c:number;u:number;col:string}){return<div className="rounded-xl border border-border bg-surface p-4 hover:shadow-md"><div className="mb-3 flex items-center gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[14px] font-bold text-white" style={{background:col}}>{n[0]}</div><div><p className="text-[13px] font-bold text-text">{n}</p><p className="text-[11px] text-text-3">{i}</p></div></div><div className="mb-3 flex gap-4 text-[11px] text-text-3"><span><strong className="text-text">{c}</strong> campaigns</span><span><strong className="text-text">{u}</strong> UTM links</span></div><div className="flex gap-2 border-t border-border pt-3"><button type="button" className="flex-1 rounded-lg border border-border py-1.5 text-[11px] font-medium text-text-2 hover:bg-surface-2">Edit</button><button type="button" className="flex-1 rounded-lg border border-border py-1.5 text-[11px] font-medium text-text-2 hover:bg-surface-2">Archive</button></div></div>;}
function CL({l,dv}:{l:string;dv:number}){const[v,setV]=useState(dv);return<div className="rounded-lg border border-border bg-surface-2 p-3"><p className="mb-2 text-[11px] font-semibold text-text-3">{l}</p><input type="number" value={v} onChange={e=>setV(Number(e.target.value))} className="w-full rounded border border-border bg-surface px-2 py-1.5 text-center font-mono text-[14px] font-bold text-text outline-none focus:border-orange"/><p className="mt-1 text-center text-[10px] text-text-3">chars</p></div>;}
function ALR({l,d,v,u,c}:{l:string;d:string;v:number;u:string;c:(v:number)=>void}){return<div className="flex items-center gap-3 border-b border-border py-3 last:border-b-0"><div className="flex-1"><p className="text-[13px] font-semibold text-text">{l}</p><p className="text-[11px] text-text-3">{d}</p></div><input type="number" value={v} onChange={e=>c(Number(e.target.value))} className="w-24 rounded-lg border border-border bg-surface px-3 py-1.5 text-right font-mono text-[13px] font-bold text-text outline-none focus:border-orange"/><span className="w-8 shrink-0 text-[12px] text-text-3">{u}</span></div>;}
function UR({l,us,t}:{l:string;us:number;t:number}){const p=Math.round((us/t)*100);return<div className="mb-2 flex items-center gap-3 last:mb-0"><span className="w-36 shrink-0 text-[11px] text-white/50">{l}</span><div className="flex-1 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-orange" style={{width:`${p}%`}}/></div><span className="w-16 shrink-0 text-right font-mono text-[11px] text-white/60">{us} / {t}</span></div>;}
