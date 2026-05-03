import { useState } from "react";

// ─── BRAND & CONTACT ─────────────────────────────────────────────────────────
const BRAND = {
  name: "ATA",
  full: "Assistance Travaux Antilles",
  tagline: "Estimez vos travaux en 2 minutes · Devis artisan gratuit sous 24h",
};

const CONTACT_INFO = {
  whatsapp: "596696865339",           // numéro international sans +
  email: "atantilles@gmail.com",
  formspree: "https://formspree.io/f/mdabagwv", // À remplacer après inscription sur formspree.io
  instagram: "https://www.instagram.com/",           // À compléter avec ton handle IG
};

// ─── GAMMES ──────────────────────────────────────────────────────────────────
const GAMMES = [
  { id: "eco",      label: "Économique", desc: "Matériaux entrée de gamme, fonctionnel", mult: 1 },
  { id: "standard", label: "Standard",   desc: "Bon rapport qualité / prix",             mult: 1.5 },
  { id: "premium",  label: "Premium",    desc: "Matériaux haut de gamme, finitions soignées", mult: 2.2 },
];

// ─── PACKS ───────────────────────────────────────────────────────────────────
// Prix médians Martinique 2025-2026 (source : ALGERBAT, artisans locaux, obat.fr)
// Peinture intérieure : 18-35 €/m² → médiane 25 €/m²  (majoration insulaire +15%)
// Carrelage intérieur posé : 45-120 €/m² → médiane 65 €/m² (climat tropical, colle adaptée)
// Main d'œuvre BTP Martinique : 40-70 €/h
// Forfaits dépose / plomberie / élec : majorés +20% vs métropole (insularité + logistique)

const PACKS = [
  {
    id: "peinture",
    emoji: "🖌️",
    label: "Peinture intérieure",
    desc: "Murs, plafonds, préparation des supports",
    dims: ["surface", "hauteur"],
    postes: [
      { id: "prep",     label: "Préparation des supports (rebouchage, enduit)", unit: "m²",    baseEco: 8  },
      { id: "murs",     label: "Peinture murs (2 couches)",                      unit: "m²",    baseEco: 18 },
      { id: "plafond",  label: "Peinture plafond",                               unit: "m²",    baseEco: 22 },
      { id: "huisserie",label: "Peinture huisseries & boiseries",                unit: "forfait", baseEco: 350 },
    ],
  },
  {
    id: "carrelage",
    emoji: "⬜",
    label: "Carrelage sol",
    desc: "Dépose, pose carrelage, joints",
    dims: ["surface"],
    postes: [
      { id: "depose",   label: "Dépose ancien revêtement",                       unit: "m²",    baseEco: 12 },
      { id: "ragréage", label: "Ragréage & préparation du support",              unit: "m²",    baseEco: 15 },
      { id: "pose",     label: "Fourniture + pose carrelage (format 60×60)",     unit: "m²",    baseEco: 55 },
      { id: "joints",   label: "Joints & finitions",                             unit: "m²",    baseEco: 8  },
    ],
  },
  {
    id: "faience",
    emoji: "🧱",
    label: "Faïence murale",
    desc: "Pose faïence salle de bain ou cuisine",
    dims: ["surface"],
    postes: [
      { id: "depose",   label: "Dépose ancienne faïence",                        unit: "m²",    baseEco: 14 },
      { id: "prep",     label: "Préparation du support",                         unit: "m²",    baseEco: 10 },
      { id: "pose",     label: "Fourniture + pose faïence murale",               unit: "m²",    baseEco: 60 },
      { id: "joints",   label: "Joints & finitions",                             unit: "m²",    baseEco: 8  },
    ],
  },
  {
    id: "cuisine",
    emoji: "🍳",
    label: "Rénovation cuisine",
    desc: "Complète : meubles, plomberie, électricité, carrelage",
    dims: ["surface", "lineaire", "hauteur"],
    postes: [
      { id: "depose",    label: "Dépose & évacuation",                           unit: "forfait", baseEco: 700  },
      { id: "plomberie", label: "Plomberie (alimentation + évacuation)",         unit: "forfait", baseEco: 1400 },
      { id: "elec",      label: "Électricité (tableau, prises, éclairage)",      unit: "forfait", baseEco: 1100 },
      { id: "carrelage", label: "Carrelage sol",                                 unit: "m²",      baseEco: 55  },
      { id: "faience",   label: "Faïence / crédence murale",                    unit: "m²",      baseEco: 60  },
      { id: "meubles",   label: "Meubles + plan de travail",                    unit: "ml",      baseEco: 550 },
      { id: "peinture",  label: "Peinture plafond & murs restants",             unit: "m²",      baseEco: 22  },
    ],
  },
  {
    id: "sdb",
    emoji: "🚿",
    label: "Rénovation salle de bain",
    desc: "Complète : sanitaires, faïence, plomberie, électricité",
    dims: ["surface", "hauteur"],
    postes: [
      { id: "depose",    label: "Dépose & évacuation",                           unit: "forfait", baseEco: 600  },
      { id: "plomberie", label: "Plomberie (alimentation + évacuation)",         unit: "forfait", baseEco: 1600 },
      { id: "elec",      label: "Électricité (norme NF C 15-100)",               unit: "forfait", baseEco: 850  },
      { id: "faience",   label: "Faïence murale",                                unit: "m²",      baseEco: 60  },
      { id: "carrelage", label: "Carrelage sol",                                 unit: "m²",      baseEco: 55  },
      { id: "douche",    label: "Receveur de douche + paroi",                   unit: "forfait", baseEco: 900  },
      { id: "sanitaires",label: "Sanitaires (WC, vasque, robinetterie)",        unit: "forfait", baseEco: 1300 },
      { id: "peinture",  label: "Peinture plafond",                              unit: "m²",      baseEco: 22  },
    ],
  },
  {
    id: "both",
    emoji: "🏠",
    label: "Cuisine + Salle de bain",
    desc: "Estimation complète des deux pièces",
    dims: ["surface_cuisine", "lineaire", "surface_sdb", "hauteur"],
    postes: [], // computed from cuisine + sdb
  },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function fmt(n) { return n.toLocaleString("fr-FR") + " €"; }

function calcPoste(poste, dims, gamme, packId) {
  const mult = GAMMES.find(g => g.id === gamme).mult;
  const { surface = 0, surface_cuisine = 0, surface_sdb = 0, lineaire = 0, hauteur = 2.6 } = dims;
  const s = surface || surface_cuisine || surface_sdb;
  const perim = Math.sqrt(s) * 4 * hauteur;

  let qty = 1;
  if (poste.unit === "m²") {
    if (poste.id === "carrelage" || poste.id === "ragréage" || poste.id === "depose") qty = s;
    else if (poste.id === "faience") qty = (packId === "faience") ? s : perim * 0.65;
    else if (poste.id === "murs") qty = perim * 0.75;
    else if (poste.id === "plafond" || poste.id === "peinture") qty = s;
    else if (poste.id === "prep" || poste.id === "joints") qty = s;
    else qty = s;
  } else if (poste.unit === "ml") {
    qty = lineaire;
  }

  return Math.round(poste.baseEco * mult * qty);
}

function getPackPostes(packId) {
  if (packId === "both") {
    const c = PACKS.find(p => p.id === "cuisine").postes.map(p => ({ ...p, id: "c_" + p.id, cat: "cuisine", label: p.label + " (cuisine)" }));
    const s = PACKS.find(p => p.id === "sdb").postes.map(p => ({ ...p, id: "s_" + p.id, cat: "sdb", label: p.label + " (SDB)" }));
    return [...c, ...s];
  }
  return PACKS.find(p => p.id === packId)?.postes || [];
}

// ─── STEP LABELS ─────────────────────────────────────────────────────────────
const STEPS = ["pack", "dims", "gamme", "postes", "result", "contact"];

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function App() {
  const [step, setStep]       = useState(0);
  const [packId, setPackId]   = useState(null);
  const [dims, setDims]       = useState({ surface: 15, surface_cuisine: 12, surface_sdb: 6, lineaire: 4, hauteur: 2.6 });
  const [gamme, setGamme]     = useState("standard");
  const [included, setIncluded] = useState({});
  const [contact, setContact] = useState({ nom: "", tel: "", email: "", message: "" });
  const [sent, setSent]       = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(false);

  // ── Envoi Formspree (email) ──────────────────────────────────────────────
  async function sendToFormspree(summary) {
    try {
      const res = await fetch(CONTACT_INFO.formspree, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          nom: contact.nom,
          telephone: contact.tel,
          email: contact.email || "Non renseigné",
          message: contact.message || "—",
          pack: pack?.label,
          gamme: GAMMES.find(g => g.id === gamme)?.label,
          estimation: summary,
          source: "Simulateur ATA",
        }),
      });
      return res.ok;
    } catch { return false; }
  }

  // ── Message WhatsApp pré-rempli ──────────────────────────────────────────
  function buildWhatsAppURL(summary) {
    const msg = encodeURIComponent(
      `🏗️ *Nouvelle demande ATA*\n\n` +
      `👤 *Client :* ${contact.nom}\n` +
      `📞 *Tél :* ${contact.tel}\n` +
      `📧 *Email :* ${contact.email || "—"}\n\n` +
      `📋 *Pack :* ${pack?.label}\n` +
      `🏆 *Gamme :* ${GAMMES.find(g => g.id === gamme)?.label}\n` +
      `💰 *Estimation :* ${summary}\n\n` +
      `💬 *Précisions :* ${contact.message || "Aucune"}`
    );
    return `https://wa.me/${CONTACT_INFO.whatsapp}?text=${msg}`;
  }

  async function handleSubmit() {
    setSending(true);
    setSendError(false);
    const summary = `${fmt(low)} — ${fmt(high)}`;
    const ok = await sendToFormspree(summary);
    setSending(false);
    if (ok) {
      setSent(true);
      // Ouvrir WhatsApp avec le résumé pré-rempli
      window.open(buildWhatsAppURL(summary), "_blank");
    } else {
      // Fallback : ouvrir WhatsApp directement même si email échoue
      setSent(true);
      window.open(buildWhatsAppURL(summary), "_blank");
    }
  }

  const pack   = PACKS.find(p => p.id === packId);
  const postes = packId ? getPackPostes(packId) : [];

  function getVal(p) {
    const cat = p.cat || packId;
    const d = cat === "sdb"
      ? { ...dims, surface: dims.surface_sdb }
      : cat === "cuisine"
      ? { ...dims, surface: dims.surface_cuisine }
      : dims;
    return calcPoste({ ...p, id: p.id.replace(/^[cs]_/, "") }, d, gamme, cat);
  }

  const total = postes.reduce((s, p) => included[p.id] === false ? s : s + getVal(p), 0);
  const low   = Math.round(total * 0.9);
  const high  = Math.round(total * 1.15);
  const pct   = Math.round((step / (STEPS.length - 1)) * 100);

  function selectPack(id) {
    setPackId(id);
    const ps = getPackPostes(id);
    const obj = {};
    ps.forEach(p => obj[p.id] = true);
    setIncluded(obj);
    setStep(1);
  }

  const next = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep(s => Math.max(s - 1, 0));

  const dimFields = pack?.dims || [];

  return (
    <div style={{ minHeight: "100vh", background: "#f7f4ef", fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif", color: "#1a1a1a", display: "flex", flexDirection: "column" }}>

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <header style={{ background: "#1c3a2e", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
          <span style={{ fontSize: 26, fontWeight: 700, color: "#fff", letterSpacing: 3, fontFamily: "sans-serif" }}>ATA</span>
          <span style={{ fontSize: 11, color: "#8ab89a", letterSpacing: 2, fontFamily: "sans-serif", textTransform: "uppercase" }}>Assistance Travaux Antilles</span>
        </div>
        {step > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 100, height: 3, background: "#2d5040", borderRadius: 2 }}>
              <div style={{ width: `${pct}%`, height: "100%", background: "#d4a843", borderRadius: 2, transition: "width 0.4s" }} />
            </div>
            <span style={{ fontSize: 11, color: "#8ab89a", fontFamily: "sans-serif" }}>{pct}%</span>
          </div>
        )}
      </header>

      {/* ── MAIN ───────────────────────────────────────────────────────────── */}
      <main style={{ flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 16px 60px" }}>
        <div style={{ width: "100%", maxWidth: 700 }}>

          {/* STEP 0 — Choix du pack */}
          {step === 0 && (
            <div>
              <div style={{ marginBottom: 32 }}>
                <p style={{ fontSize: 11, letterSpacing: 4, color: "#d4a843", fontFamily: "sans-serif", marginBottom: 10 }}>SIMULATEUR DE RÉNOVATION</p>
                <h1 style={{ fontSize: "clamp(26px, 5vw, 44px)", lineHeight: 1.15, marginBottom: 10, fontWeight: 400, color: "#1c3a2e" }}>
                  Quel type de travaux<br />souhaitez-vous estimer ?
                </h1>
                <p style={{ color: "#666", fontSize: 15, fontFamily: "sans-serif" }}>Obtenez une estimation en 2 minutes. Devis artisan gratuit sous 24h.</p>
              </div>

              {/* Packs légers */}
              <div style={{ fontSize: 11, letterSpacing: 3, color: "#888", fontFamily: "sans-serif", marginBottom: 12 }}>TRAVAUX CIBLÉS</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12, marginBottom: 24 }}>
                {PACKS.filter(p => ["peinture", "carrelage", "faience"].includes(p.id)).map(p => (
                  <PackCard key={p.id} pack={p} onClick={() => selectPack(p.id)} />
                ))}
              </div>

              <div style={{ fontSize: 11, letterSpacing: 3, color: "#888", fontFamily: "sans-serif", marginBottom: 12 }}>RÉNOVATION COMPLÈTE</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
                {PACKS.filter(p => ["cuisine", "sdb", "both"].includes(p.id)).map(p => (
                  <PackCard key={p.id} pack={p} onClick={() => selectPack(p.id)} featured={p.id === "both"} />
                ))}
              </div>
            </div>
          )}

          {/* STEP 1 — Dimensions */}
          {step === 1 && pack && (
            <div>
              <StepLabel n={1} total={4} />
              <h2 style={h2style}>{pack.emoji} {pack.label} — Dimensions</h2>
              <p style={subStyle}>Approximatif suffit — nous calculerons une fourchette.</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16, marginBottom: 32 }}>
                {dimFields.includes("surface")          && <DimInput label="Surface (m²)"         value={dims.surface}          onChange={v => setDims(d => ({ ...d, surface: v }))} />}
                {dimFields.includes("surface_cuisine")  && <DimInput label="Surface cuisine (m²)"  value={dims.surface_cuisine}  onChange={v => setDims(d => ({ ...d, surface_cuisine: v }))} />}
                {dimFields.includes("surface_sdb")      && <DimInput label="Surface SDB (m²)"      value={dims.surface_sdb}      onChange={v => setDims(d => ({ ...d, surface_sdb: v }))} />}
                {dimFields.includes("lineaire")         && <DimInput label="Linéaire meubles (ml)" value={dims.lineaire}          onChange={v => setDims(d => ({ ...d, lineaire: v }))} />}
                {dimFields.includes("hauteur")          && <DimInput label="Hauteur sous plafond (m)" value={dims.hauteur}       onChange={v => setDims(d => ({ ...d, hauteur: v }))} />}
              </div>
              <NavBtns prev={prev} next={next} />
            </div>
          )}

          {/* STEP 2 — Gamme */}
          {step === 2 && (
            <div>
              <StepLabel n={2} total={4} />
              <h2 style={h2style}>Quelle gamme de finition ?</h2>
              <p style={subStyle}>Ce choix influence les matériaux et la main-d'œuvre.</p>
              <div style={{ display: "grid", gap: 12, marginBottom: 32 }}>
                {GAMMES.map(g => (
                  <button key={g.id} onClick={() => setGamme(g.id)} style={{
                    background: gamme === g.id ? "#1c3a2e" : "#fff",
                    border: gamme === g.id ? "2px solid #1c3a2e" : "2px solid #e0dbd0",
                    borderRadius: 6,
                    padding: "16px 22px",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    textAlign: "left",
                    color: gamme === g.id ? "#fff" : "#1a1a1a",
                    transition: "all 0.2s",
                  }}>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "sans-serif", marginBottom: 3 }}>{g.label}</div>
                      <div style={{ fontSize: 13, opacity: 0.75, fontFamily: "sans-serif" }}>{g.desc}</div>
                    </div>
                    {gamme === g.id && <span style={{ fontSize: 22, color: "#d4a843" }}>✓</span>}
                  </button>
                ))}
              </div>
              <NavBtns prev={prev} next={next} />
            </div>
          )}

          {/* STEP 3 — Postes */}
          {step === 3 && (
            <div>
              <StepLabel n={3} total={4} />
              <h2 style={h2style}>Affinez votre sélection</h2>
              <p style={subStyle}>Décochez les postes dont vous n'avez pas besoin.</p>
              <div style={{ display: "grid", gap: 8, marginBottom: 20 }}>
                {postes.map(p => {
                  const isOn = included[p.id] !== false;
                  const val  = getVal(p);
                  return (
                    <div key={p.id} onClick={() => setIncluded(i => ({ ...i, [p.id]: !isOn }))}
                      style={{
                        background: isOn ? "#fff" : "#f0ece4",
                        border: isOn ? "1.5px solid #c8d8c0" : "1.5px solid #e0dbd0",
                        borderRadius: 6,
                        padding: "13px 18px",
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        opacity: isOn ? 1 : 0.5,
                        transition: "all 0.15s",
                      }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{
                          width: 20, height: 20, borderRadius: 4,
                          background: isOn ? "#1c3a2e" : "transparent",
                          border: isOn ? "none" : "2px solid #aaa",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0, fontSize: 12, color: "#fff",
                        }}>{isOn ? "✓" : ""}</div>
                        <span style={{ fontSize: 14, fontFamily: "sans-serif", color: "#333" }}>{p.label}</span>
                      </div>
                      <span style={{ fontSize: 14, fontFamily: "sans-serif", fontWeight: 700, color: isOn ? "#1c3a2e" : "#aaa", whiteSpace: "nowrap", marginLeft: 12 }}>
                        {fmt(val)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Total live */}
              <div style={{ background: "#1c3a2e", borderRadius: 6, padding: "16px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <span style={{ fontFamily: "sans-serif", fontSize: 14, color: "#8ab89a" }}>Estimation en cours</span>
                <span style={{ fontSize: 22, fontWeight: 700, color: "#d4a843", fontFamily: "sans-serif" }}>{fmt(total)}</span>
              </div>

              <NavBtns prev={prev} next={next} nextLabel="Voir mon estimation →" />
            </div>
          )}

          {/* STEP 4 — Résultat */}
          {step === 4 && (
            <div>
              <p style={{ fontSize: 11, letterSpacing: 4, color: "#d4a843", fontFamily: "sans-serif", marginBottom: 16 }}>VOTRE ESTIMATION ATA</p>
              <div style={{ background: "#1c3a2e", borderRadius: 10, padding: "32px 28px", marginBottom: 24, textAlign: "center" }}>
                <div style={{ fontSize: 13, color: "#8ab89a", fontFamily: "sans-serif", letterSpacing: 2, marginBottom: 8 }}>FOURCHETTE ESTIMÉE</div>
                <div style={{ fontSize: "clamp(28px, 6vw, 52px)", fontWeight: 400, color: "#fff", lineHeight: 1.1 }}>
                  {fmt(low)} <span style={{ color: "#5a8a6a" }}>—</span> {fmt(high)}
                </div>
                <div style={{ fontSize: 13, color: "#8ab89a", fontFamily: "sans-serif", marginTop: 10 }}>
                  {pack?.label} · Gamme {GAMMES.find(g => g.id === gamme)?.label} · Prix Martinique TTC
                </div>
              </div>

              {/* Détail */}
              <div style={{ background: "#fff", border: "1.5px solid #e0dbd0", borderRadius: 8, overflow: "hidden", marginBottom: 20 }}>
                <div style={{ padding: "12px 20px", borderBottom: "1px solid #f0ece4", fontSize: 11, letterSpacing: 3, color: "#999", fontFamily: "sans-serif" }}>DÉTAIL PAR POSTE</div>
                {postes.filter(p => included[p.id] !== false).map((p, i, arr) => (
                  <div key={p.id} style={{ padding: "12px 20px", borderBottom: i < arr.length - 1 ? "1px solid #f0ece4" : "none", display: "flex", justifyContent: "space-between", fontFamily: "sans-serif", fontSize: 14 }}>
                    <span style={{ color: "#555" }}>{p.label}</span>
                    <span style={{ fontWeight: 600, color: "#1c3a2e" }}>{fmt(getVal(p))}</span>
                  </div>
                ))}
                <div style={{ padding: "14px 20px", background: "#f7f4ef", display: "flex", justifyContent: "space-between", fontFamily: "sans-serif" }}>
                  <span style={{ fontWeight: 700 }}>TOTAL</span>
                  <span style={{ fontWeight: 700, color: "#1c3a2e", fontSize: 17 }}>{fmt(total)}</span>
                </div>
              </div>

              <div style={{ background: "#fffbf0", border: "1px solid #e8d9a0", borderRadius: 6, padding: "14px 18px", marginBottom: 24, fontFamily: "sans-serif", fontSize: 13, color: "#7a6a30", lineHeight: 1.7 }}>
                ℹ️ Estimation indicative basée sur les prix médians pratiqués en Martinique (2025-2026). Le devis définitif dépend de l'état du chantier, de l'accessibilité et de vos choix de matériaux. Nos artisans partenaires se déplacent gratuitement pour établir un devis précis.
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 12 }}>
                <button onClick={prev} style={btnOutline}>← Modifier</button>
                <button onClick={next} style={btnFilled}>Être mis en relation gratuitement →</button>
              </div>
            </div>
          )}

          {/* STEP 5 — Contact */}
          {step === 5 && !sent && (
            <div>
              <p style={{ fontSize: 11, letterSpacing: 4, color: "#d4a843", fontFamily: "sans-serif", marginBottom: 16 }}>MISE EN RELATION</p>
              <h2 style={{ ...h2style, color: "#1c3a2e" }}>Un artisan ATA vous contacte sous 24h</h2>
              <p style={subStyle}>Tous nos artisans partenaires sont vérifiés et qualifiés.</p>

              <div style={{ display: "grid", gap: 14, marginBottom: 20 }}>
                <CInput label="Nom & Prénom *" value={contact.nom}     onChange={v => setContact(c => ({ ...c, nom: v }))} />
                <CInput label="Téléphone (WhatsApp) *" value={contact.tel} onChange={v => setContact(c => ({ ...c, tel: v }))} type="tel" />
                <CInput label="Email" value={contact.email}   onChange={v => setContact(c => ({ ...c, email: v }))} type="email" />
                <div>
                  <label style={labelStyle}>PRÉCISIONS (optionnel)</label>
                  <textarea value={contact.message} onChange={e => setContact(c => ({ ...c, message: e.target.value }))} rows={3}
                    placeholder="Date souhaitée, contraintes particulières, adresse du chantier…"
                    style={{ width: "100%", border: "1.5px solid #d8d2c8", borderRadius: 5, padding: "11px 14px", fontFamily: "sans-serif", fontSize: 14, resize: "vertical", boxSizing: "border-box", background: "#fff" }} />
                </div>
              </div>

              <div style={{ background: "#f0f5f1", border: "1px solid #c8d8c0", borderRadius: 6, padding: "14px 18px", marginBottom: 20, display: "flex", justifyContent: "space-between", fontFamily: "sans-serif", fontSize: 14 }}>
                <span style={{ color: "#555" }}>Votre estimation</span>
                <span style={{ fontWeight: 700, color: "#1c3a2e" }}>{fmt(low)} — {fmt(high)}</span>
              </div>

              <button onClick={handleSubmit} disabled={!contact.nom || !contact.tel || sending}
                style={{ ...btnFilled, width: "100%", opacity: (!contact.nom || !contact.tel || sending) ? 0.45 : 1, cursor: (!contact.nom || !contact.tel || sending) ? "not-allowed" : "pointer", marginBottom: 12 }}>
                {sending ? "Envoi en cours…" : "Envoyer ma demande →"}
              </button>

              {/* Bouton WhatsApp direct alternatif */}
              <button onClick={() => window.open(`https://wa.me/${CONTACT_INFO.whatsapp}`, "_blank")}
                style={{ width: "100%", background: "#25D366", border: "none", borderRadius: 6, padding: "13px 20px", cursor: "pointer", color: "#fff", fontFamily: "sans-serif", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8 }}>
                💬 Contacter directement sur WhatsApp
              </button>

              <p style={{ textAlign: "center", fontSize: 12, color: "#999", fontFamily: "sans-serif", marginTop: 8 }}>Devis artisan 100% gratuit · Sans engagement</p>
            </div>
          )}

          {/* Confirmation */}
          {step === 5 && sent && (
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              <div style={{ width: 72, height: 72, background: "#1c3a2e", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: 32 }}>✓</div>
              <h2 style={{ ...h2style, color: "#1c3a2e" }}>Demande envoyée !</h2>
              <p style={{ color: "#666", fontFamily: "sans-serif", fontSize: 15, lineHeight: 1.8, maxWidth: 400, margin: "0 auto 20px" }}>
                Bonjour <strong>{contact.nom}</strong>,<br />
                Notre équipe ATA vous contactera sous <strong style={{ color: "#1c3a2e" }}>24h</strong> pour un devis gratuit et précis.<br />
                Un message WhatsApp vient de s'ouvrir avec le résumé de votre projet.
              </p>
              <div style={{ background: "#f0f5f1", border: "1px solid #c8d8c0", borderRadius: 8, padding: "18px 24px", maxWidth: 360, margin: "0 auto 24px", fontFamily: "sans-serif", fontSize: 14, color: "#444", lineHeight: 2 }}>
                <div>📋 {pack?.label}</div>
                <div>🏆 Gamme {GAMMES.find(g => g.id === gamme)?.label}</div>
                <div>💰 {fmt(low)} — {fmt(high)}</div>
              </div>

              {/* Actions post-confirmation */}
              <div style={{ display: "grid", gap: 10, maxWidth: 360, margin: "0 auto 24px" }}>
                <button onClick={() => window.open(`https://wa.me/${CONTACT_INFO.whatsapp}`, "_blank")}
                  style={{ background: "#25D366", border: "none", borderRadius: 6, padding: "13px 20px", cursor: "pointer", color: "#fff", fontFamily: "sans-serif", fontSize: 14, fontWeight: 700 }}>
                  💬 Réécrire sur WhatsApp
                </button>
                <button onClick={() => window.open(CONTACT_INFO.instagram, "_blank")}
                  style={{ background: "linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)", border: "none", borderRadius: 6, padding: "13px 20px", cursor: "pointer", color: "#fff", fontFamily: "sans-serif", fontSize: 14, fontWeight: 700 }}>
                  📸 Suivre ATA sur Instagram
                </button>
              </div>

              <button onClick={() => { setStep(0); setPackId(null); setGamme("standard"); setIncluded({}); setSent(false); setContact({ nom: "", tel: "", email: "", message: "" }); }}
                style={{ ...btnOutline, padding: "12px 28px" }}>
                Faire une nouvelle estimation
              </button>
            </div>
          )}

        </div>
      </main>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer style={{ background: "#1c3a2e", padding: "20px 32px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <span style={{ fontSize: 11, color: "#5a8a6a", fontFamily: "sans-serif", letterSpacing: 1 }}>
          ATA — Assistance Travaux Antilles · BTP Martinique
        </span>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={() => window.open(`https://wa.me/${CONTACT_INFO.whatsapp}`, "_blank")}
            style={{ background: "#25D366", border: "none", borderRadius: 5, padding: "8px 14px", cursor: "pointer", color: "#fff", fontFamily: "sans-serif", fontSize: 12, fontWeight: 700 }}>
            💬 WhatsApp
          </button>
          <button onClick={() => window.open(CONTACT_INFO.instagram, "_blank")}
            style={{ background: "linear-gradient(135deg, #f09433, #dc2743, #bc1888)", border: "none", borderRadius: 5, padding: "8px 14px", cursor: "pointer", color: "#fff", fontFamily: "sans-serif", fontSize: 12, fontWeight: 700 }}>
            📸 Instagram
          </button>
        </div>
      </footer>
    </div>
  );
}

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────
function PackCard({ pack, onClick, featured }) {
  return (
    <button onClick={onClick} style={{
      background: featured ? "#1c3a2e" : "#fff",
      border: featured ? "2px solid #1c3a2e" : "2px solid #e0dbd0",
      borderRadius: 8,
      padding: "18px 16px",
      cursor: "pointer",
      textAlign: "left",
      color: featured ? "#fff" : "#1a1a1a",
      transition: "all 0.2s",
      display: "flex",
      flexDirection: "column",
      gap: 8,
    }}>
      <span style={{ fontSize: 26 }}>{pack.emoji}</span>
      <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "sans-serif" }}>{pack.label}</div>
      <div style={{ fontSize: 12, opacity: 0.7, fontFamily: "sans-serif", lineHeight: 1.4 }}>{pack.desc}</div>
      {featured && <div style={{ fontSize: 11, color: "#d4a843", fontFamily: "sans-serif", letterSpacing: 1, marginTop: 4 }}>★ LE PLUS COMPLET</div>}
    </button>
  );
}

function StepLabel({ n, total }) {
  return <p style={{ fontSize: 11, letterSpacing: 4, color: "#d4a843", fontFamily: "sans-serif", marginBottom: 14 }}>ÉTAPE {n} / {total}</p>;
}

function DimInput({ label, value, onChange }) {
  return (
    <div>
      <label style={labelStyle}>{label.toUpperCase()}</label>
      <input type="number" value={value} onChange={e => onChange(parseFloat(e.target.value) || 0)}
        style={{ width: "100%", border: "1.5px solid #d8d2c8", borderRadius: 5, padding: "11px 14px", fontFamily: "sans-serif", fontSize: 16, boxSizing: "border-box", background: "#fff" }} />
    </div>
  );
}

function CInput({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        style={{ width: "100%", border: "1.5px solid #d8d2c8", borderRadius: 5, padding: "11px 14px", fontFamily: "sans-serif", fontSize: 15, boxSizing: "border-box", background: "#fff" }} />
    </div>
  );
}

function NavBtns({ prev, next, nextLabel = "Continuer →" }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 12 }}>
      <button onClick={prev} style={btnOutline}>← Retour</button>
      <button onClick={next} style={btnFilled}>{nextLabel}</button>
    </div>
  );
}

// ─── SHARED STYLES ────────────────────────────────────────────────────────────
const h2style    = { fontSize: "clamp(22px, 4vw, 36px)", fontWeight: 400, lineHeight: 1.2, marginBottom: 8, color: "#1a1a1a" };
const subStyle   = { color: "#777", fontSize: 14, marginBottom: 28, fontFamily: "sans-serif" };
const labelStyle = { fontSize: 11, letterSpacing: 2, color: "#888", fontFamily: "sans-serif", display: "block", marginBottom: 7 };
const btnFilled  = { background: "#1c3a2e", border: "2px solid #1c3a2e", borderRadius: 6, padding: "14px 20px", cursor: "pointer", color: "#fff", fontFamily: "sans-serif", fontSize: 14, fontWeight: 700, letterSpacing: 0.5 };
const btnOutline = { background: "transparent", border: "2px solid #c8c0b0", borderRadius: 6, padding: "14px 20px", cursor: "pointer", color: "#555", fontFamily: "sans-serif", fontSize: 14 };

