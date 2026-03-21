import { motion } from "framer-motion";

const SearchIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
);

export default function BottomNav({ onPrev, onNext, onSearchOpen, isFirst, isLast, votedCount, totalCategories }) {
    return (
        <div className="bottom-nav-container">
            <motion.div
                className="bottom-nav"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            >
                {/* Back Button */}
                <button
                    className="bottom-nav-btn nav-prev"
                    onClick={onPrev}
                    disabled={isFirst}
                    aria-label="Previous category"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                    <span style={{ fontWeight: 600, fontSize: 13 }}>Back</span>
                </button>

                

                {/* Next/Submit Button */}
                <button
                    className={`bottom-nav-btn nav-next ${isLast ? 'submit-active' : ''}`}
                    onClick={onNext}
                    disabled={isLast && votedCount < totalCategories}
                    style={isLast ? { background: 'white', color: 'black', width: 'auto', padding: '0 20px' } : {}}
                >
                    {isLast ? (
                        <span style={{ fontWeight: 700, fontSize: 13 }}>Submit</span>
                    ) : (
                        <>
                            <span style={{ fontWeight: 600, fontSize: 13 }}>Next</span>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m9 18 6-6-6-6" />
                            </svg>
                        </>
                    )}
                </button>
            </motion.div>
        </div>
    );
}
