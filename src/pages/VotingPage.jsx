import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import fpPromise from "@fingerprintjs/fingerprintjs";
import { getDynamicCategories } from "../data/categories";
import { loadVotesLocally, hasSubmitted, markSubmitted } from "../lib/storage";
import { getOrCreateSession, getNominees, getUserVotes } from "../lib/appwrite";
import VotingFlow from "../components/voting/VotingFlow";
import Header from "../components/layout/Header";
import GlobalSearch from "../components/ui/GlobalSearch";

export default function VotingPage() {
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [searchOpen, setSearchOpen] = useState(false);
    const [jumpIndex, setJumpIndex] = useState(null);
    const [remoteNominees, setRemoteNominees] = useState([]);
    const [genderFilter, setGenderFilter] = useState("Male");

    useEffect(() => {
        if (hasSubmitted()) {
            navigate("/thank-you", { replace: true });
            return;
        }

        const init = async () => {
            try {
                // Ensure Appwrite anonymous session exists for DB perm
                await getOrCreateSession();

                // Initialize FingerprintJS
                const fp = await fpPromise.load();
                const result = await fp.get();
                const visitorId = result.visitorId;

                // Check if this device has already voted
                const previousVotes = await getUserVotes(visitorId);
                if (Object.keys(previousVotes).length > 0) {
                    markSubmitted(); // Sync local storage
                    navigate("/thank-you", { replace: true });
                    return;
                }

                setUserId(visitorId);

                const nominees = await getNominees();
                if (nominees && nominees.length > 0) {
                    setRemoteNominees(nominees);
                }
            } catch (err) {
                console.error("Initialization error:", err);
            } finally {
                setLoading(false);
            }
        };

        init();
    }, [navigate]);

    // Compute categories dynamically based on fetched nominees
    const dynamicCategories = useMemo(() => {
        return getDynamicCategories(remoteNominees);
    }, [remoteNominees]);

    // Keyboard shortcut: Ctrl+K / Cmd+K to open search
    useEffect(() => {
        const handler = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                e.preventDefault();
                setSearchOpen(true);
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    const handleJumpToCategory = useCallback((index) => {
        setJumpIndex(index);
    }, []);

    const [selectNominee, setSelectNominee] = useState(null);

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner" />
                <p className="loading-text">Initializing nominees...</p>
            </div>
        );
    }

    return (
        <div className="page">
            <Header
                currentIndex={currentIndex}
                totalCategories={dynamicCategories.length}
                showProgress={true}
                onSearchOpen={() => setSearchOpen(true)}
            />
            <VotingFlow
                userId={userId}
                categories={dynamicCategories}
                onCategoryChange={setCurrentIndex}
                jumpToIndex={jumpIndex}
                onJumpHandled={() => setJumpIndex(null)}
                onSearchOpen={() => setSearchOpen(true)}
                onRegisterSelect={setSelectNominee}
                onGenderFilterChange={setGenderFilter}
            />

            <AnimatePresence>
                {searchOpen && (
                    <GlobalSearch
                        nominees={(() => {
                            let curr = dynamicCategories[currentIndex];
                            let list = curr?.nominees || [];
                            if (curr?.splitGender && genderFilter) {
                                return list.filter(n => n.gender === genderFilter);
                            }
                            return list;
                        })()}
                        onJumpToCategory={handleJumpToCategory}
                        onClose={() => setSearchOpen(false)}
                        onSelectNominee={(id) => {
                            if (selectNominee) selectNominee(id);
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
