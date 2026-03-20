import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { toPng } from "html-to-image";
import CATEGORIES_DEFAULT from "../../data/categories";
import ShareButton from "../ui/ShareButton";

function getRankedNominees(categoryResults) {
    if (!categoryResults) return [];
    return Object.entries(categoryResults)
        .map(([id, count]) => ({ id, count }))
        .sort((a, b) => b.count - a.count);
}

function findNominee(category, id) {
    return category.nominees.find((n) => n.id === id);
}

const rankLabel = ["🥇", "🥈", "🥉"];

function CategoryResult({ category, results, index }) {
    const cardRef = useRef(null);
    const [downloading, setDownloading] = useState(false);
    const ranked = getRankedNominees(results);
    const total = ranked.reduce((s, r) => s + r.count, 0);

    const winner = ranked[0] ? findNominee(category, ranked[0].id) : null;

    const downloadImage = async () => {
        if (!cardRef.current) return;
        setDownloading(true);
        try {
            const options = {
                cacheBust: true,
                backgroundColor: "#0a0a0a",
                filter: (node) => {
                    const inclusionClasses = ["no-export"];
                    return !inclusionClasses.some(cls => node.classList?.contains(cls));
                }
            };

            let dataUrl;
            try {
                dataUrl = await toPng(cardRef.current, options);
            } catch (err) {
                console.warn("Standard capture failed, trying without fonts:", err);
                // Fallback: skip font embedding if it causes security errors
                dataUrl = await toPng(cardRef.current, { ...options, fontEmbedCSS: "" });
            }

            const link = document.createElement("a");
            link.download = `winner-${category.id}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error("Download error:", err);
        } finally {
            setDownloading(false);
        }
    };

    return (
        <motion.div
            className="card"
            ref={cardRef}
            style={{ padding: 24, marginBottom: 16, border: "1px solid var(--border)" }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04, duration: 0.4 }}
        >
            {/* Category header */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 24 }}>
                <span style={{ fontSize: 32, background: "rgba(255,255,255,0.05)", width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 12 }}>
                    {category.emoji}
                </span>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "var(--font-display)", letterSpacing: "-0.02em", color: "white" }}>
                        {category.title}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)" }}></span>
                        {total} total vote{total !== 1 ? "s" : ""}
                    </div>
                </div>
                {winner && (
                    <div className="no-export" style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                        <div style={{ display: "flex", gap: 8 }}>
                            <button
                                className="btn btn-secondary"
                                onClick={downloadImage}
                                disabled={downloading}
                                style={{ padding: "8px 12px", fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                                {downloading ? "Saving..." : "Save Image"}
                            </button>
                            <ShareButton
                                title={`Winner: ${winner.name}`}
                                text={`🏆 ${winner.name} won ${category.title} at AwardVault 2026!`}
                                url={window.location.origin}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Winner Banner if exists */}
            {winner && (
                <div style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 12,
                    padding: "16px 20px",
                    marginBottom: 24,
                    display: "flex",
                    alignItems: "center",
                    gap: 16
                }}>
                    <div
                        className="nominee-avatar"
                        style={{
                            width: 52, height: 52, fontSize: 18,
                            background: `linear-gradient(135deg, ${winner.color}cc, ${winner.color}66)`,
                            boxShadow: `0 0 20px ${winner.color}33`
                        }}
                    >
                        {winner.initials}
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 2 }}>Winner</div>
                        <div style={{ fontSize: 20, fontWeight: 900, color: "white", fontFamily: "var(--font-display)" }}>{winner.name}</div>
                    </div>
                    <div style={{ fontSize: 24 }}>🏆</div>
                </div>
            )}

            {/* Ranked List */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {ranked.slice(0, 5).map((r, i) => {
                    const nom = findNominee(category, r.id);
                    if (!nom) return null;
                    const pct = total > 0 ? Math.round((r.count / total) * 100) : 0;
                    const isWinner = i === 0;
                    return (
                        <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <span style={{ fontSize: 16, width: 28, textAlign: "center", opacity: isWinner ? 1 : 0.5 }}>
                                {i < 3 ? rankLabel[i] : (i + 1)}
                            </span>
                            <div
                                className="nominee-avatar"
                                style={{
                                    width: 32, height: 32, fontSize: 11,
                                    background: `linear-gradient(135deg, ${nom.color}cc, ${nom.color}66)`,
                                    opacity: isWinner ? 1 : 0.7
                                }}
                            >
                                {nom.initials}
                            </div>
                            <span style={{ fontSize: 14, fontWeight: isWinner ? 700 : 500, color: isWinner ? "white" : "var(--text-muted)", flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {nom.name}
                            </span>
                            <div className="vote-bar-bg" style={{ flex: 2, height: 6 }}>
                                <motion.div
                                    className="vote-bar-fill"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${pct}%` }}
                                    style={{ height: "100%", background: isWinner ? "var(--accent)" : "rgba(255,255,255,0.2)" }}
                                    transition={{ delay: index * 0.04 + 0.4 + i * 0.1, duration: 1, ease: "easeOut" }}
                                />
                            </div>
                            <span className="vote-pct" style={{ minWidth: 40, textAlign: "right", fontSize: 13, fontWeight: 700, color: isWinner ? "var(--accent)" : "var(--text-dim)" }}>
                                {pct}%
                            </span>
                        </div>
                    );
                })}
                {ranked.length === 0 && (
                    <p style={{ fontSize: 13, color: "var(--text-dim)", textAlign: "center", padding: "12px 0" }}>
                        No votes recorded yet.
                    </p>
                )}
            </div>

            <div style={{ marginTop: 24, fontSize: 10, color: "var(--text-dim)", textAlign: "center", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                awardvault.app
            </div>
        </motion.div>
    );
}

export default function ResultsDisplay({ results, categories: propCategories }) {
    const categories = propCategories || CATEGORIES_DEFAULT;
    return (
        <div>
            {categories.map((cat, i) => (
                <CategoryResult
                    key={cat.id}
                    category={cat}
                    results={results[cat.id]}
                    index={i}
                />
            ))}
        </div>
    );
}
