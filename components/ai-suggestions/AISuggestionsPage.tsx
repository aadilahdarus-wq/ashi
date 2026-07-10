"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";

type Severity = "must" | "should" | "watch";

type Practice = {
  id: string;
  platform: string;
  topic: string;
  rule: string;
  why: string | null;
  severity: Severity;
  updated_at: string;
};

const TOPICS = ["PMax", "Bidding", "Keywords", "Copy", "Budget"];

const SEV_STYLES: Record<Severity, { dot: string; badge: string; label: string }> = {
  must: { dot: "bg-red", badge: "bg-red-pale text-red border border-red", label: "Must Follow" },
  should: { dot: "bg-orange", badge: "bg-orange-pale text-orange border border-orange-border", label: "Recommended" },
  watch: { dot: "bg-yellow", badge: "bg-yellow-pale text-yellow border border-yellow-border", label: "Watch Out" },
};

const inputCls = "w-full rounded-lg border border-border bg-surface px-3 py-2 text-[13px] text-text outline-none focus:border-orange";

export function AISuggestionsPage() {
  const [practices, setPractices] = useState<Practice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");
  const supabase = createClient();

  async function fetchPractices() {
    const { data, error } = await supabase
      .from("practices")
      .select("*")
      .eq("platform", "google")
      .order("topic")
      .order("severity");
    if (data && !error) setPractices(data);
    setLoading(false);
  }

  useEffect(() => { fetchPractices(); }, []);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }

  const filtered = useMemo(() =>
    search.trim()
      ? practices.filter(p =>
          p.rule.toLowerCase().includes(search.toLowerCase()) ||
          p.why?.toLowerCase().includes(search.toLowerCase()) ||
          p.topic.toLowerCase().includes(search.toLowerCase())
        )
      : practices,
    [practices, search]
  );

  const must = practices.filter(p => p.severity === "must").length;
  const should = practices.filter(p => p.severity === "should").length;
  const watch = practices.filter(p => p.severity === "watch").length;

  if (loading) {
    return <div className="flex h-40 items-center justify-center text-[13px] text-text-3">Loading methodology…</div>;
  }

  return (
    <div className="space-y-5">
      <div className="flex gap-4 rounded-xl border border-orange bg-orange-pale p-5">
        <span className="text-[22px]">🦒</span>
        <div>
          <p className="mb-0.5 text-[11px] font-bold uppercase tracking-wide text-orange">How ASHI uses these practices</p>
          <p className="text-[13px] leading-relaxed text-text-2">
            ASHI reads all <strong>{practices.length} practices</strong> in this library before generating suggestions, auditing accounts, or creating ad copy.
            Practices marked <strong>Must Follow</strong> trigger a flag if violated.{" "}
            <strong>Recommended</strong> practices appear as proactive suggestions.{" "}
            <strong>Watch Out</strong> practices surface as contextual tips.
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          <span className="h-2.5 w-2.5 rounded-full bg-[#4285F4]" />
          <div>
            <h2 className="text-[15px] font-bold text-text">Google Ads</h2>
            <p className="text-[12px] text-text-3">Your rules for Google Ads — ASHI reads these before every suggestion, audit, and copy generation.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 px-5 py-4">
          <StatChip value={practices.length} label="Total Practices" color="text-text" />
          <StatChip value={must} label="Must Follow" color="text-red" />
          <StatChip value={should} label="Recommended" color="text-orange" />
          <StatChip value={watch} label="Watch Out" color="text-yellow" />
        </div>
      </div>

      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-text-3" width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
          <circle cx="9" cy="9" r="6"/><path d="M15 15l3 3"/>
        </svg>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search practices…"
          className="w-full rounded-xl border border-border bg-surface py-2.5 pl-9 pr-4 text-[13px] text-text outline-none focus:border-orange"
        />
        {search && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-text-3">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {TOPICS.map(topic => {
        const topicPractices = filtered.filter(p => p.topic === topic);
        if (search && topicPractices.length === 0) return null;
        return (
          <TopicSection
            key={topic}
            topic={topic}
            practices={topicPractices}
            onAdd={async (rule, why, severity) => {
              const { error } = await supabase.from("practices").insert([{
                platform: "google", topic, rule, why: why || null, severity,
              }]);
              if (!error) { fetchPractices(); showToast("✓ Practice added"); }
              else showToast("Failed to save");
            }}
            onUpdate={async (id, rule, why, severity) => {
              const { error } = await supabase.from("practices").update({
                rule, why: why || null, severity, updated_at: new Date().toISOString(),
              }).eq("id", id);
              if (!error) { fetchPractices(); showToast("✓ Practice updated"); }
              else showToast("Failed to update");
            }}
            onDelete={async (id) => {
              const { error } = await supabase.from("practices").delete().eq("id", id);
              if (!error) { fetchPractices(); showToast("Practice removed"); }
            }}
          />
        );
      })}

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-text px-5 py-2.5 text-[13px] font-semibold text-surface shadow-md">
          {toast}
        </div>
      )}
    </div>
  );
}

function TopicSection({ topic, practices, onAdd, onUpdate, onDelete }: {
  topic: string;
  practices: Practice[];
  onAdd: (rule: string, why: string, severity: Severity) => Promise<void>;
  onUpdate: (id: string, rule: string, why: string, severity: Severity) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-2">
          <h3 className="text-[14px] font-bold text-text">{topic}</h3>
          <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] font-semibold text-text-3">{practices.length}</span>
        </div>
        <button type="button" onClick={() => setShowAdd(true)}
          className="rounded-lg border border-border px-3 py-1 text-[12px] font-medium text-text-2 hover:bg-surface-2">
          + Add practice
        </button>
      </div>

      {practices.length === 0 && !showAdd && (
        <div className="px-5 py-8 text-center">
          <p className="text-[13px] text-text-3">No practices yet for {topic}</p>
          <button type="button" onClick={() => setShowAdd(true)}
            className="mt-2 text-[12px] font-medium text-orange hover:underline">
            + Add your first rule
          </button>
        </div>
      )}

      {practices.map(p => (
        <PracticeCard key={p.id} practice={p} onUpdate={onUpdate} onDelete={onDelete} />
      ))}

      {showAdd && (
        <AddPracticeForm
          topic={topic}
          onSave={async (rule, why, severity) => {
            await onAdd(rule, why, severity);
            setShowAdd(false);
          }}
          onCancel={() => setShowAdd(false)}
        />
      )}
    </div>
  );
}

function PracticeCard({ practice, onUpdate, onDelete }: {
  practice: Practice;
  onUpdate: (id: string, rule: string, why: string, severity: Severity) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [rule, setRule] = useState(practice.rule);
  const [why, setWhy] = useState(practice.why ?? "");
  const [severity, setSeverity] = useState<Severity>(practice.severity);
  const [saving, setSaving] = useState(false);

  const sev = SEV_STYLES[practice.severity];
  const date = new Date(practice.updated_at).toLocaleDateString("en-US", { month: "short", year: "numeric" });

  return (
    <div className="border-b border-border last:border-b-0">
      {!editing ? (
        <div className="group px-5 py-4">
          <div className="flex items-start gap-3">
            <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${sev.dot}`} />
            <p className="flex-1 text-[13px] leading-relaxed text-text">{practice.rule}</p>
            <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <button type="button" onClick={() => setEditing(true)}
                className="rounded p-1.5 text-text-3 hover:bg-surface-2 hover:text-text">
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 2L14 5L5 14L1 15L2 11Z"/><line x1="9" y1="4" x2="12" y2="7"/>
                </svg>
              </button>
              <button type="button" onClick={() => onDelete(practice.id)}
                className="rounded p-1.5 text-text-3 hover:bg-red-pale hover:text-red">
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="2 4 14 4"/><path d="M12 4v9a1 1 0 01-1 1H5a1 1 0 01-1-1V4"/><path d="M6 4V2h4v2"/>
                </svg>
              </button>
            </div>
          </div>
          {practice.why && (
            <p className="ml-5 mt-1.5 text-[12px] leading-relaxed text-text-3">{practice.why}</p>
          )}
          <div className="ml-5 mt-3 flex items-center gap-2">
            <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${sev.badge}`}>{sev.label}</span>
            <span className="rounded border border-border bg-surface-2 px-2 py-0.5 text-[10px] text-text-3">{practice.topic}</span>
            <span className="text-[11px] text-text-3">Updated {date}</span>
          </div>
        </div>
      ) : (
        <div className="px-5 py-4 bg-surface-2">
          <div className="space-y-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wide text-text-3">Practice Rule</label>
              <textarea value={rule} onChange={e => setRule(e.target.value)} rows={2} className={`${inputCls} resize-none`} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wide text-text-3">Why it matters <span className="font-normal normal-case text-text-3">(optional)</span></label>
              <textarea value={why} onChange={e => setWhy(e.target.value)} rows={2} placeholder="Explain the reasoning — helps ASHI apply it in context" className={`${inputCls} resize-none`} />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wide text-text-3">Severity</label>
              <select value={severity} onChange={e => setSeverity(e.target.value as Severity)} className={`mt-1.5 ${inputCls}`}>
                <option value="must">Must Follow — ASHI flags violations</option>
                <option value="should">Recommended — ASHI suggests applying this</option>
                <option value="watch">Watch Out — ASHI shows as a tip</option>
              </select>
            </div>
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={() => { setEditing(false); setRule(practice.rule); setWhy(practice.why ?? ""); setSeverity(practice.severity); }}
                className="rounded-lg border border-border px-3 py-1.5 text-[12px] font-medium text-text-2 hover:bg-surface">
                Cancel
              </button>
              <button type="button" disabled={saving || !rule.trim()}
                onClick={async () => { setSaving(true); await onUpdate(practice.id, rule, why, severity); setSaving(false); setEditing(false); }}
                className="rounded-lg bg-orange px-3 py-1.5 text-[12px] font-semibold text-white hover:opacity-90 disabled:opacity-50">
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AddPracticeForm({ topic, onSave, onCancel }: {
  topic: string;
  onSave: (rule: string, why: string, severity: Severity) => Promise<void>;
  onCancel: () => void;
}) {
  const [rule, setRule] = useState("");
  const [why, setWhy] = useState("");
  const [severity, setSeverity] = useState<Severity>("should");
  const [saving, setSaving] = useState(false);

  return (
    <div className="border-t border-border bg-surface-2 px-5 py-4">
      <p className="mb-3 text-[11px] font-bold uppercase tracking-wide text-text-3">New practice — {topic}</p>
      <div className="space-y-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-text-2">Practice Rule <span className="text-red">*</span></label>
          <textarea value={rule} onChange={e => setRule(e.target.value)} rows={2}
            placeholder="Write your rule clearly — ASHI will follow this exactly…"
            className={`${inputCls} resize-none`} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-text-2">Why it matters <span className="font-normal text-text-3">(optional)</span></label>
          <textarea value={why} onChange={e => setWhy(e.target.value)} rows={2}
            placeholder="Explain the reasoning behind this rule…"
            className={`${inputCls} resize-none`} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-text-2">Severity</label>
          <select value={severity} onChange={e => setSeverity(e.target.value as Severity)} className={inputCls}>
            <option value="must">Must Follow — ASHI flags violations</option>
            <option value="should">Recommended — ASHI suggests applying this</option>
            <option value="watch">Watch Out — ASHI shows as a tip</option>
          </select>
        </div>
        <div className="flex gap-2 pt-1">
          <button type="button" onClick={onCancel}
            className="rounded-lg border border-border px-3 py-1.5 text-[12px] font-medium text-text-2 hover:bg-surface">
            Cancel
          </button>
          <button type="button" disabled={saving || !rule.trim()}
            onClick={async () => { setSaving(true); await onSave(rule, why, severity); setSaving(false); }}
            className="rounded-lg bg-orange px-3 py-1.5 text-[12px] font-semibold text-white hover:opacity-90 disabled:opacity-50">
            {saving ? "Adding…" : "Add Practice"}
          </button>
        </div>
      </div>
    </div>
  );
}

function StatChip({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 py-2">
      <span className={`text-[22px] font-bold ${color}`}>{value}</span>
      <span className="text-[11px] text-text-3">{label}</span>
    </div>
  );
}
