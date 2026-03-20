// Award Categories and Nominees Data
// 30 categories, EXACTLY 67 shared nominees total

const AVATAR_COLORS = [
    "#6366f1", "#8b5cf6", "#a855f7", "#ec4899", "#ef4444",
    "#f97316", "#eab308", "#22c55e", "#14b8a6", "#06b6d4",
    "#3b82f6", "#6d7b8a", "#d946ef", "#f43f5e", "#84cc16",
    "#10b981", "#0ea5e9", "#8b5e3c", "#c084fc", "#fb7185",
];

let colorIndex = 0;
function nextColor() {
    return AVATAR_COLORS[colorIndex++ % AVATAR_COLORS.length];
}

function n(name, tagline) {
    const firstName = name.split(" ")[0].toLowerCase();
    const isFemale = ["priya", "riya", "sneha", "ananya", "meera", "shreya", "nandini", "tanya", "lalitha", "preethi", "tanvi", "divya", "anjali", "keerthi", "swathi", "roshni", "ishita", "deepa", "neha", "simran", "leena", "kavya", "revathi", "shruti", "pooja", "mia", "zara", "trisha", "sunita", "anita", "shalini"].includes(firstName) || firstName.endsWith("a");
    const gender = isFemale ? "Female" : "Male";

    const initials = name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
    return {
        id: name.toLowerCase().replace(/\s+/g, "-"),
        name,
        tagline,
        initials,
        color: nextColor(),
        gender
    };
}

// THE SHARED 67 NOMINEES
export const GLOBAL_NOMINEES = [
    n("Arjun Mehta", "Melts hearts with every note"),
    n("Priya Sharma", "The voice of an angel"),
    n("Riya Thomas", "Born to perform"),
    n("Kabir Nair", "Mic drop moments only"),
    n("Sneha Patel", "Charts? She sets them"),
    n("Dev Kapoor", "From bathroom to stage"),
    n("Ananya Rao", "Can't stop, won't stop"),
    n("Rohan Verma", "Footwork that defies physics"),
    n("Meera Iyer", "Rhythm is her mother tongue"),
    n("Varun Singh", "The floor belongs to him"),
    n("Shreya Gupta", "Dance = breathing for her"),
    n("Kiran Joshi", "One move and the crowd loses it"),
    n("Nandini Das", "Paints the world in her colors"),
    n("Aditya Kumar", "Sketchbook always open"),
    n("Tanya Reddy", "Her art speaks louder than words"),
    n("Siddharth Rao", "Even his doodles are masterpieces"),
    n("Lalitha Menon", "Color palette? Her whole life"),
    n("Rahul Bose", "Portrait king of the class"),
    n("Aditya Sharma", "Debugs life issues too"),
    n("Preethi K", "Her code reads like poetry"),
    n("Nikhil Jain", "Stack Overflow? He wrote it"),
    n("Tanvi Shetty", "Turns caffeine into code"),
    n("Harsh Patel", "Has never seen a runtime error"),
    n("Divya Nair", "AI tells her for help"),
    n("Vishal Menon", "Makes even silence sound profound"),
    n("Anjali Singh", "Microphone activated confidence"),
    n("Rohit Pillai", "Debate champion, life champion"),
    n("Keerthi Rao", "Every word is a quote"),
    n("Amol Desai", "Convinces professors to extend deadlines"),
    n("Swathi Nair", "TED talk in every lecture"),
    n("Roshni Kumar", "Short stories but big dreams"),
    n("Aman Verma", "Journals are his diary and destiny"),
    n("Priya Pillai", "Writes 5000 words for a 500 word limit"),
    n("Kartik Nair", "Poetry at 3 AM, essays by morning"),
    n("Ishita Joshi", "Every caption could be a novel"),
    n("Vikas Sharma", "The campus blog legend"),
    n("Suresh Kumar", "Born on the field"),
    n("Deepa Nair", "Runs faster than deadlines"),
    n("Ramesh Iyer", "Trophy shelf? Needs a room"),
    n("Neha Reddy", "100m sprint? Easy"),
    n("Sanjay Pillai", "The human sports encyclopedia"),
    n("Divya Thomas", "Coach's favorite — always"),
    n("Akash Gupta", "Lens is his third eye"),
    n("Simran Kaur", "Instagram worthy by default"),
    n("Pranav Rao", "Catches light like magic"),
    n("Leena Joshi", "Even blurry shots look aesthetic"),
    n("Mihir Das", "Angles nobody else notices"),
    n("Kavya Shetty", "Shot on iPhone… but make it art"),
    n("Revathi Menon", "Hostel kitchen her kingdom"),
    n("Gaurav Patel", "Spice level: dangerous"),
    n("Shruti Nair", "Maggi? Now gourmet"),
    n("Aryan Singh", "Feeds the whole floor every Sunday"),
    n("Pooja Sharma", "Baked her way into everyone's heart"),
    n("Faizan Khan", "Secret recipe: love + ghee"),
    n("Mia Thomas", "Lives outside every box"),
    n("Vikram Nair", "Idea machine, 24/7"),
    n("Zara Kapoor", "Normal? Never heard of it"),
    n("Arun Joshi", "DIY everything from scratch"),
    n("Trisha Menon", "Pinterest dreams, reality executed"),
    n("Samir Reddy", "Innovative or chaotic? Both"),
    n("Sunita Iyer", "Has notes for classes she didn't attend"),
    n("Rajesh Kumar", "Carries a spare charger always"),
    n("Anita Sharma", "Your emergency contact in college"),
    n("Vinod Pillai", "Answers 2AM SOS messages"),
    n("Shalini Thomas", "Helped someone write their thesis"),
    n("Deepak Nair", "Wikipedia of project submissions"),
    n("Manan Patel", "Universal friend"),
];

export const CATEGORIES = [
    { id: "golden-voice", title: "Golden Voice", emoji: "🎤", type: "talent", nominees: GLOBAL_NOMINEES },
{ id: "dance-dynamo", title: "Dance Dynamo", emoji: "💃", type: "talent", nominees: GLOBAL_NOMINEES },
{ id: "creative-canvas", title: "Creative Canvas", emoji: "🎨", type: "talent", nominees: GLOBAL_NOMINEES },
{ id: "code-wizard", title: "Code Wizard", emoji: "💻", type: "talent", nominees: GLOBAL_NOMINEES },
{ id: "master-orator", title: "Master Orator", emoji: "🎙️", type: "talent", nominees: GLOBAL_NOMINEES },
{ id: "wordsmith", title: "Wordsmith", emoji: "✍️", type: "talent", nominees: GLOBAL_NOMINEES },
{ id: "energy-machine", title: "Energy Machine", emoji: "⚡", type: "talent", nominees: GLOBAL_NOMINEES },
{ id: "lens-legend", title: "Lens Legend", emoji: "📸", type: "talent", nominees: GLOBAL_NOMINEES },
{ id: "master-chef", title: "Master Chef", emoji: "👨‍🍳", type: "talent", nominees: GLOBAL_NOMINEES },
{ id: "design-sense", title: "Design Sense", emoji: "🖌️", type: "talent", nominees: GLOBAL_NOMINEES },
{ id: "stage-star", title: "Stage Star", emoji: "🎭", type: "talent", nominees: GLOBAL_NOMINEES },

{ id: "creative-mind", title: "Creative Mind", emoji: "🌟", type: "mind", nominees: GLOBAL_NOMINEES },
{ id: "innovation-guru", title: "Innovation Guru", emoji: "💡", type: "mind", nominees: GLOBAL_NOMINEES },
{ id: "idea-generator", title: "Idea Generator", emoji: "🧠", type: "mind", nominees: GLOBAL_NOMINEES },
{ id: "curious-thinker", title: "Curious Thinker", emoji: "🤔", type: "mind", nominees: GLOBAL_NOMINEES },
{ id: "problem-solver", title: "Problem Solver", emoji: "🧩", type: "mind", nominees: GLOBAL_NOMINEES },
{ id: "quick-learner", title: "Quick Learner", emoji: "📘", type: "mind", nominees: GLOBAL_NOMINEES },

{ id: "kind-heart", title: "Kind Heart", emoji: "💖", type: "personality", nominees: GLOBAL_NOMINEES },
{ id: "friendly-vibes", title: "Friendly Vibes", emoji: "😊", type: "personality", nominees: GLOBAL_NOMINEES },
{ id: "natural-leader", title: "Natural Leader", emoji: "👑", type: "personality", nominees: GLOBAL_NOMINEES },
{ id: "motivator", title: "The Motivator", emoji: "🔥", type: "personality", nominees: GLOBAL_NOMINEES },
{ id: "hardworking-star", title: "Hardworking Star", emoji: "💪", type: "personality", nominees: GLOBAL_NOMINEES },
{ id: "calm-composed", title: "Calm & Composed", emoji: "🧘", type: "personality", nominees: GLOBAL_NOMINEES },
{ id: "positive-aura", title: "Positive Aura", emoji: "✨", type: "personality", nominees: GLOBAL_NOMINEES },
{ id: "joy-bringer", title: "Joy Bringer", emoji: "😄", type: "personality", nominees: GLOBAL_NOMINEES },
{ id: "simple-genuine", title: "Simple & Genuine", emoji: "🌿", type: "personality", nominees: GLOBAL_NOMINEES },
{ id: "confident-aura", title: "Confident Aura", emoji: "😎", type: "personality", nominees: GLOBAL_NOMINEES },

{ id: "everyones-buddy", title: "Everyone’s Buddy", emoji: "🤝", type: "social", nominees: GLOBAL_NOMINEES },
{ id: "always-there", title: "Always There", emoji: "🫶", type: "social", nominees: GLOBAL_NOMINEES },
{ id: "team-player", title: "Team Player", emoji: "🏆", type: "social", nominees: GLOBAL_NOMINEES },
{ id: "bond-builder", title: "Bond Builder", emoji: "🔗", type: "social", nominees: GLOBAL_NOMINEES },
{ id: "go-to-person", title: "Go-To Person", emoji: "📞", type: "social", nominees: GLOBAL_NOMINEES },
{ id: "best-listener", title: "Best Listener", emoji: "👂", type: "social", nominees: GLOBAL_NOMINEES },
{ id: "most-approachable", title: "Most Approachable", emoji: "😊", type: "social", nominees: GLOBAL_NOMINEES },
{ id: "social-butterfly", title: "Social Butterfly", emoji: "🦋", type: "social", nominees: GLOBAL_NOMINEES },
{ id: "group-chat-ghost", title: "Group Chat Ghost", emoji: "👻", type: "social", nominees: GLOBAL_NOMINEES },

{ id: "meme-master", title: "Meme Master", emoji: "😂", type: "funny", nominees: GLOBAL_NOMINEES },
{ id: "snack-monster", title: "Snack Monster", emoji: "🍟", type: "funny", nominees: GLOBAL_NOMINEES },
{ id: "playlist-pro", title: "Playlist Pro", emoji: "🎧", type: "funny", nominees: GLOBAL_NOMINEES },
{ id: "reels-star", title: "Reels Star", emoji: "📱", type: "funny", nominees: GLOBAL_NOMINEES },
{ id: "screenshot-keeper", title: "Screenshot Keeper", emoji: "📸", type: "funny", nominees: GLOBAL_NOMINEES },
{ id: "sticker-champion", title: "Sticker Champion", emoji: "💬", type: "funny", nominees: GLOBAL_NOMINEES },
{ id: "reaction-star", title: "Reaction Star", emoji: "😲", type: "funny", nominees: GLOBAL_NOMINEES },
{ id: "breaking-news", title: "Breaking News Reporter", emoji: "📰", type: "funny", nominees: GLOBAL_NOMINEES },
{ id: "class-comedian", title: "Class Comedian", emoji: "😄", type: "funny", nominees: GLOBAL_NOMINEES },
{ id: "class-entertainer", title: "Class Entertainer", emoji: "🎭", type: "funny", nominees: GLOBAL_NOMINEES },
{ id: "drama-star", title: "Drama Star", emoji: "🎭", type: "funny", nominees: GLOBAL_NOMINEES },

{ id: "grand-entry", title: "Grand Entry Specialist", emoji: "⏰", type: "relatable", nominees: GLOBAL_NOMINEES },
{ id: "power-nap", title: "Power Nap Champion", emoji: "😴", type: "relatable", nominees: GLOBAL_NOMINEES },
{ id: "last-bench-legend", title: "Last Bench Legend", emoji: "😎", type: "relatable", nominees: GLOBAL_NOMINEES },
{ id: "proxy-pro", title: "Proxy Pro", emoji: "👻", type: "relatable", nominees: GLOBAL_NOMINEES },
{ id: "wifi-hunter", title: "WiFi Hunter", emoji: "📶", type: "relatable", nominees: GLOBAL_NOMINEES },
{ id: "last-minute-hero", title: "Last-Minute Hero", emoji: "⏰", type: "relatable", nominees: GLOBAL_NOMINEES },
{ id: "deadline-survivor", title: "Deadline Survivor", emoji: "📚", type: "relatable", nominees: GLOBAL_NOMINEES },
{ id: "its-fine", title: "“It’s Fine” Specialist", emoji: "😌", type: "relatable", nominees: GLOBAL_NOMINEES },
{ id: "no-tension", title: "No-Tension Mind", emoji: "🧘", type: "relatable", nominees: GLOBAL_NOMINEES },
{ id: "go-with-flow", title: "Go-With-The-Flow", emoji: "🌊", type: "relatable", nominees: GLOBAL_NOMINEES },
{ id: "low-key-legend", title: "Low-Key Legend", emoji: "😎", type: "relatable", nominees: GLOBAL_NOMINEES },

{ id: "introvert-energy", title: "Introvert Energy", emoji: "🌙", type: "unique", nominees: GLOBAL_NOMINEES },
{ id: "extrovert-energy", title: "Extrovert Energy", emoji: "🎤", type: "unique", nominees: GLOBAL_NOMINEES },
{ id: "positive-energy-source", title: "Positive Energy Source", emoji: "✨", type: "unique", nominees: GLOBAL_NOMINEES },
{ id: "comfort-person", title: "Comfort Person", emoji: "💛", type: "unique", nominees: GLOBAL_NOMINEES },
{ id: "silent-observer", title: "Silent Observer", emoji: "👀", type: "unique", nominees: GLOBAL_NOMINEES },
{ id: "main-character", title: "Main Character Energy", emoji: "🎥", type: "unique", nominees: GLOBAL_NOMINEES },
{ id: "background-mvp", title: "Background MVP", emoji: "🌟", type: "unique", nominees: GLOBAL_NOMINEES },
{ id: "unique-personality", title: "Unique Personality", emoji: "🧬", type: "unique", nominees: GLOBAL_NOMINEES },
{ id: "inspiring-presence", title: "Inspiring Presence", emoji: "🌈", type: "unique", nominees: GLOBAL_NOMINEES },
{ id: "rising-star", title: "Rising Star", emoji: "⭐", type: "unique", nominees: GLOBAL_NOMINEES },
{ id: "coordinator-star", title: "Coordinator Star", emoji: "📋", type: "unique", nominees: GLOBAL_NOMINEES },
];

export const CATEGORY_COUNT = CATEGORIES.length;

export function getCategoryById(id) {
    return CATEGORIES.find((c) => c.id === id);
}

export function getCategoryByIndex(index) {
    return CATEGORIES[index] || null;
}

export function formatNominee(doc) {
    const name = doc.name;
    const initials = name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
    return {
        id: doc.$id || name.toLowerCase().replace(/\s+/g, "-"),
        name,
        tagline: doc.tagline || "",
        initials,
        color: nextColor(),
        gender: doc.gender || "Male" // Fallback to avoid filtering bugs on split categories
    };
}

export function getDynamicCategories(remoteNominees = []) {
    const nominees = remoteNominees.length > 0
        ? remoteNominees.map(formatNominee)
        : GLOBAL_NOMINEES;

    return CATEGORIES.map(cat => ({
        ...cat,
        nominees: nominees
    }));
}

export default CATEGORIES;
