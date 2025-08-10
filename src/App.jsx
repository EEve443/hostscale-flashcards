import React, { useEffect, useMemo, useRef, useState } from "react";
import "./index.css";

const STORAGE_KEY = "memoboost_cards_v2";
const SEED = [
  { front: "Capital de la France ?", back: "Paris" },
  { front: "ADR (hospitality) ?", back: "Average Daily Rate" },
  { front: "Check-in (anglais) ?", back: "Arrival / Check-in" },
  { front: "RevPAR = ?", back: "ADR × taux d’occupation" },
  { front: "Early check-in upsell ?", back: "25–40% du nightly rate" },
];

export default function App() {
  const [cards, setCards] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Array.isArray(saved) && saved.length ? saved : SEED;
    } catch { return SEED; }
  });
  const [query, setQuery] = useState("");
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const importRef = useRef(null);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(cards)); }, [cards]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cards;
    return cards.filter(c => c.front.toLowerCase().includes(q) || c.back.toLowerCase().includes(q));
  }, [cards, query]);

  useEffect(() => { setI(0); setFlipped(false); }, [query]);

  const cur = filtered.length ? filtered[i] : null;

  const next = () => { if (!filtered.length) return; setFlipped(false); setI(p => (p + 1) % filtered.length); };
  const prev = () => { if (!filtered.length) return; setFlipped(false); setI(p => (p - 1 + filtered.length) % filtered.length); };

  const quickAdd = (front, back) => {
    if (!front.trim() || !back.trim()) return;
    setCards(c => [{ front, back }, ...c]);
    setQuery(""); setI(0); setFlipped(false);
  };

  // Export / Import JSON
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(cards, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `memoboost_${new Date().toISOString().slice(0,10)}.json`; a.click();
    URL.revokeObjectURL(url);
  };
  const onPickImport = () => importRef.current?.click();
  const importJSON = (file) => {
    const r = new FileReader();
    r.onload = e => {
      try {
        const parsed = JSON.parse(e.target.result);
        const cleaned = (Array.isArray(parsed) ? parsed : []).filter(x => x?.front && x?.back);
        if (!cleaned.length) throw new Error("Aucune carte valide trouvée");
        setCards(cleaned); setQuery(""); setI(0); setFlipped(false);
        alert(`Import OK: ${cleaned.length} cartes`);
      } catch (err) { alert("Import impossible: " + err.message); }
    };
    r.readAsText(file);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", padding: 16 }}>
      <h1 style={{ textAlign: "center", fontWeight: 700, fontSize: 24, marginBottom: 12 }}>
        🚀 MémoBoost — Fiches
      </h1>

      {/* Recherche */}
      <div style={{ maxWidth: 520, margin: "0 auto 12px" }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher (mots clés, réponses)…"
          className="mb-input"
        />
      </div>

      {/* Carte recto/verso avec indicateur */}
      <div className={`mb-card ${flipped ? "mb-rot" : ""}`} onClick={() => cur && setFlipped(f => !f)}>
        <span className="mb-pill">{flipped ? "Verso" : "Recto"}</span>
        {!cur ? <div>Aucune carte</div> : <div>{flipped ? cur.back : cur.front}</div>}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 8, flexWrap: "wrap" }}>
        <button className="mb-btn" onClick={prev}>Préc.</button>
        <button className="mb-btn" onClick={() => setFlipped(f => !f)}>{flipped ? "Voir recto" : "Voir verso"}</button>
        <button className="mb-btn" onClick={next}>Suiv.</button>
        <button className="mb-btn" onClick={exportJSON}>Exporter JSON</button>
        <button className="mb-btn" onClick={onPickImport}>Importer JSON</button>
        <input
          ref={importRef}
          type="file"
          accept="application/json,.json"
          style={{ display: "none" }}
          onChange={(e) => e.target.files?.[0] && importJSON(e.target.files[0])}
        />
      </div>

      {/* Compteur */}
      <div style={{ textAlign: "center", color: "#555", marginTop: 6 }}>
        {filtered.length ? `${i + 1} / ${filtered.length}` : "0 / 0"}
      </div>

      {/* Ajout rapide */}
      <QuickAdd onAdd={quickAdd} />
    </div>
  );
}

function QuickAdd({ onAdd }) {
  const [f, setF] = useState("");
  const [b, setB] = useState("");
  return (
    <div className="mb-add">
      <div style={{ fontSize: 14, color: "#555", marginBottom: 6 }}>Ajouter une carte</div>
      <input
        value={f}
        onChange={(e) => setF(e.target.value)}
        placeholder="Recto (question / terme)"
        className="mb-input"
      />
      <textarea
        value={b}
        onChange={(e) => setB(e.target.value)}
        rows={3}
        placeholder="Verso (réponse / définition)"
        className="mb-textarea"
      />
      <button
        className="mb-btn primary"
        onClick={() => { onAdd(f, b); setF(""); setB(""); }}
      >
        Ajouter
      </button>
    </div>
  );
}
