import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getResults, getNominees } from "../lib/appwrite";
import { getDynamicCategories } from "../data/categories";
import { toPng } from "html-to-image";
import ShareButton from "../components/ui/ShareButton";

function getRankedNominees(categoryResults) {
    if (!categoryResults) return [];
    return Object.entries(categoryResults)
        .map(([id, count]) => ({ id, count }))
        .sort((a, b) => b.count - a.count);
}

function findNominee(category, id) {
    if (!id || !category) return null;
    const cleanId = id.replace(/^(Male|Female|male|female)_/, "");
    return category.nominees.find((n) => n.id === cleanId || n.id === id);
}

export default function ResultsRevealPage() {
    const { categoryId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [revealState, setRevealState] = useState("revealing");
    const [shuffledNominee, setShuffledNominee] = useState(null);

    const [category, setCategory] = useState(null);
    const [results, setResults] = useState(null);

    const cardRef = useRef(null);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        async function load() {
            try {
                const [res, rawNominees] = await Promise.all([
                    getResults(),
                    getNominees()
                ]);
                const cats = getDynamicCategories(rawNominees || []);
                const currentCat = cats.find(c => c.id === categoryId);
                setCategory(currentCat);

                let categoryVotes = { male: {}, female: {}, base: {} };
                if (currentCat && currentCat.splitGender) {
                    categoryVotes.male = res[`${categoryId}-Male`] || {};
                    categoryVotes.female = res[`${categoryId}-Female`] || {};
                } else if (res && res[categoryId]) {
                    categoryVotes.base = res[categoryId];
                }
                setResults(categoryVotes);
            } catch (err) {
                console.error("Failed to load reveal data:", err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [categoryId]);

    useEffect(() => {
        let interval;
        let timeout;
        if (!loading && revealState === "revealing") {
            interval = setInterval(() => {
                if (category && category.nominees && category.nominees.length > 0) {
                    const randomNominee = category.nominees[Math.floor(Math.random() * category.nominees.length)];
                    setShuffledNominee(randomNominee);
                }
            }, 80);

            timeout = setTimeout(() => {
                setRevealState("revealed");
            }, 5000);
        }
        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [loading, revealState, category]);

    if (loading) {
        return (
            <div className="loading-screen" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div className="spinner" />
            </div>
        );
    }

    if (!category) {
        return (
            <div style={{ textAlign: "center", padding: "100px 20px" }}>
                <h2>Category Not Found</h2>
                <button className="btn btn-secondary" onClick={() => navigate("/results")} style={{ marginTop: 20 }}>Go Back</button>
            </div>
        );
    }

    const isSplit = category.splitGender;
    const rankedBase = getRankedNominees(results?.base);
    const rankedMale = getRankedNominees(results?.male);
    const rankedFemale = getRankedNominees(results?.female);

    const getWinners = (rankedArray) => {
        if (!rankedArray || rankedArray.length === 0) return [];
        const maxVotes = rankedArray[0].count;
        return rankedArray
            .filter(r => r.count === maxVotes)
            .map(r => findNominee(category, r.id))
            .filter(Boolean);
    };

    const winnersBase = getWinners(rankedBase);
    const winnersMale = getWinners(rankedMale);
    const winnersFemale = getWinners(rankedFemale);

    const allWinners = isSplit ? [...winnersMale, ...winnersFemale] : winnersBase;
    const winnerNames = allWinners.length > 0 ? allWinners.map(w => w.name).join(" & ") : "No Winners";

    const totalVotesBase = rankedBase.reduce((s, r) => s + r.count, 0);
    const totalVotesMale = rankedMale.reduce((s, r) => s + r.count, 0);
    const totalVotesFemale = rankedFemale.reduce((s, r) => s + r.count, 0);
    const totalVotes = isSplit ? (totalVotesMale + totalVotesFemale) : totalVotesBase;

    const downloadImage = async () => {
        if (!cardRef.current) return;
        setDownloading(true);
        try {
            const options = {
                cacheBust: true,
                backgroundColor: "#0a0a0a",
                filter: (node) => {
                    const inclusionClasses = ["no-export"];
                    return !inclusionClasses.some(cls => node.classList && cls && node.classList.contains && node.classList.contains(cls));
                }
            };
            let dataUrl;
            try {
                dataUrl = await toPng(cardRef.current, options);
            } catch (err) {
                console.warn("Standard capture failed, trying without fonts:", err);
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

    const RenderWinner = ({ winner, title, isTie }) => (
        winner ? (
            <div style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 16,
                padding: "24px",
                display: "flex",
                alignItems: "center",
                gap: 20,
                position: "relative",
                overflow: "hidden",
                flex: "1 1 300px"
            }}>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: `linear-gradient(45deg, transparent, ${winner.color}33, transparent)`, pointerEvents: 'none' }}
                />
                <div
                    className="nominee-avatar"
                    style={{
                        width: 72, height: 72, fontSize: 24,
                        background: `linear-gradient(135deg, ${winner.color}cc, ${winner.color}66)`,
                        boxShadow: `0 0 30px ${winner.color}44`,
                        position: "relative",
                        zIndex: 1
                    }}
                >
                    {winner.initials}
                </div>
                <div style={{ flex: 1, position: "relative", zIndex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 4 }}>
                        {isTie ? `Tie: ${title}` : title}
                    </div>
                    <div style={{ fontSize: window.innerWidth > 600 ? 24 : 20, fontWeight: 900, color: "white", fontFamily: "var(--font-display)", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                        {winner.name}
                    </div>
                </div>
                <div style={{ position: "relative", zIndex: 1 }}><img src="/logoaward.png" style={{ height: 48, width: "auto" }} alt="Logo" /></div>
            </div>
        ) : (
            <div style={{ textAlign: "center", padding: "24px", background: "rgba(255,255,255,0.02)", borderRadius: 16, flex: "1 1 300px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🤷‍♂️</div>
                <h4 style={{ margin: 0, color: "var(--text-dim)" }}>No {title ? title.toLowerCase() : "winner"} votes</h4>
            </div>
        )
    );

    const RenderWinnerGroup = ({ winners, title }) => {
        if (winners.length === 0) return <RenderWinner winner={null} title={title} />;
        const isTie = winners.length > 1;
        return (
            <>
                {winners.map((w, idx) => (
                    <RenderWinner key={`${w.id}-${idx}`} winner={w} title={title} isTie={isTie} />
                ))}
            </>
        );
    };

    return (
        <div style={{ minHeight: "100vh", padding: "40px 20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: -1, background: "radial-gradient(circle at center, rgba(20,20,30,1) 0%, rgba(5,5,10,1) 100%)" }} />

            <div style={{ maxWidth: isSplit ? 900 : 600, width: "100%" }}>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ textAlign: "center", marginBottom: 32 }}
                >
                    <span style={{ fontSize: 48, display: "block", marginBottom: 12 }}>{category.emoji}</span>
                    <h1 style={{ fontSize: 32, fontWeight: 900, fontFamily: "var(--font-display)", margin: 0 }}>
                        {category.title}
                    </h1>
                    <div style={{ fontSize: 13, color: "var(--text-dim)", marginTop: 8 }}>
                        {totalVotes} total vote{totalVotes !== 1 ? "s" : ""}
                    </div>
                </motion.div>

                <div className="card" ref={cardRef} style={{ padding: 32, border: "1px solid var(--border)", position: "relative", overflow: "hidden" }}>
                    {revealState === "revealing" && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400 }}
                        >
                            <motion.div
                                animate={{ scale: [1, 1.3, 1], rotate: [0, 5, -5, 0] }}
                                transition={{ duration: 0.5, repeat: Infinity }}
                                style={{ fontSize: 64, marginBottom: 32, filter: "drop-shadow(0 0 20px rgba(255,255,255,0.3))" }}
                            >
                                🥁
                            </motion.div>
                            <div style={{ fontSize: 13, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 24 }}>
                                Tallying Votes...
                            </div>
                            {shuffledNominee && (
                                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                    <div
                                        className="nominee-avatar"
                                        style={{
                                            width: 48, height: 48, fontSize: 16,
                                            background: `linear-gradient(135deg, ${shuffledNominee.color}cc, ${shuffledNominee.color}66)`,
                                            boxShadow: `0 0 20px ${shuffledNominee.color}44`
                                        }}
                                    >
                                        {shuffledNominee.initials}
                                    </div>
                                    <span style={{ fontSize: 28, fontWeight: 800, color: "white", fontFamily: "var(--font-display)" }}>
                                        {shuffledNominee.name}
                                    </span>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {revealState === "revealed" && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        >
                            <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginBottom: 32 }}>
                                {isSplit ? (
                                    <>
                                        <RenderWinnerGroup winners={winnersMale} title="Best Male" />
                                        <RenderWinnerGroup winners={winnersFemale} title="Best Female" />
                                    </>
                                ) : (
                                    <RenderWinnerGroup winners={winnersBase} title="The Winner Is" />
                                )}
                            </div>

                            {/* Rankings Removed As Requested */}

                            {allWinners.length > 0 && (
                                <div className="no-export" style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 40, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                                    <button
                                        className="btn btn-secondary"
                                        onClick={downloadImage}
                                        disabled={downloading}
                                        style={{ display: "flex", alignItems: "center", gap: 8 }}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                                        </svg>
                                        {downloading ? "Saving..." : "Save Image"}
                                    </button>
                                    <ShareButton
                                        title={`Winner: ${winnerNames}`}
                                        text={`Official ${winnerNames} won ${category.title} at Campus Crown 2026! 👑 Celebrating excellence and crowning the best on campus.`}
                                        url={window.location.origin + `/results/${category.id}`}
                                    />
                                </div>
                            )}
                        </motion.div>
                    )}
                </div>

                {revealState === "revealed" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        style={{ textAlign: "center", marginTop: 32 }}
                    >
                        <button className="btn btn-secondary" onClick={() => navigate("/results")} style={{ padding: "12px 24px" }}>
                            ← Back to All Results
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
