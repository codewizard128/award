// localStorage helpers for vote persistence
const STORAGE_KEY = "college_awards_votes";
const SESSION_KEY = "college_awards_submitted";

export function saveVotesLocally(votes) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(votes));
    } catch { }
}

export function loadVotesLocally() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

export function clearVotesLocally() {
    try { localStorage.removeItem(STORAGE_KEY); } catch { }
}

export function markSubmitted() {
    try { localStorage.setItem(SESSION_KEY, "true"); } catch { }
}

export function hasSubmitted() {
    try { return localStorage.getItem(SESSION_KEY) === "true"; } catch { return false; }
}
