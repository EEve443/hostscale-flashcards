import React, { useEffect, useMemo, useState } from "react";
import "./index.css";

const STORAGE_KEY = "memoboost_cards_v2";

// Exemples de cartes (tu pourras les modifier/compléter)
const SEED = [
  { front: "Capital de la France ?", back: "Paris" },
  { front: "ADR (hospitality) ?", back: "Average Daily Rate" },
  { front: "Check-in (anglais) ?", back: "Arrival / Check-in" },
  { front: "Dubaï — haute saison ?", back: "Nov–Mars ~ (Events/Expo)" },
  { front: "RevPAR = ?", back: "ADR × taux d’occupation" },
  { front: "Early check-in upsell ?", back: "25–40% du nightly rate" },
  { front: "Langage de React ?", back: "JavaScript" },
  { front: "2 + 2 =", back: "4" },
];

export default function App() {
  const [cards, setCards] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Array.isArray(saved) && saved.length ? saved : SEED;
    } catch {
      return SEED;
    }
  });
  const [query, setQuery] = useState("");
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);

  // Persistance
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  }, [cards]);

  // Filtrage
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cards;
    return cards.filter(
      (c) =>
        c.front.toLowerCase().includes(q) ||
        c.back.toLowerCase().includes(q)
    );
  }, [cards, query]);

  // Si la recherche réduit la liste, on revient au début
  useEffect(() => {
    setI(0);
    setFlipped(false);
  }, [query]);

  const cur = filtered.length ? filtered[i] : null;

  const next = () => {
    if (!filtered.length) return;
    setFlipped(false);
    setI((p) => (p + 1) % filtered.length);
  };
  const prev = () => {
    if (!filtered.length) return;
    setFlipped(false);
    setI((p) => (p - 1 + filtered.length) % filtered.length);
  };

  const quickAdd = (front, back) => {
    if (!front.trim() || !back.trim()) return;
    const updated = [{ front, back }, ...cards];
    setCards(updated);
    setQuery("");
    setI(0);
    setFlipped(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", padding: 16 }}>
      <h1 style={{ textAlign: "center", fontWeight: 700, fontSize: 24, marginBottom: 12 }}>
        🚀 MémoBoost — Fiches
      </h1>

      {/* Barre de recherche */}
      <div style={{ maxWidth: 520, margin: "0 auto 12px" }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher (mots clés, réponses)…"
          className="mb-input"
        />
      </div>

      {/* Carte */}
      <div
        onClick={() => cur && setFlipped((f) => !f)}
        className={`mb-card ${flipped ? "mb-rot" : ""}`}
      >
        {!cur ? (
          <div>Aucune carte</div>
        ) : (
          <div>{flipped ? cur.back : cur.front}</div>
        )}
      </div>

      {/* Contrôles */}
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 8 }}>
        <button className="mb-btn" onClick={prev}>Préc.</button>
        <button className="mb-btn" onClick={() => setFlipped((f) => !f)}>
          {flipped ? "Voir recto" : "Voir verso"}
        </button>
        <button className="mb-btn" onClick={next}>Suiv.</button>
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
        onClick={() => {
          onAdd(f, b);
          setF(""); setB("");
        }}
      >
        Ajouter
      </button>
    </div>
  );
}
