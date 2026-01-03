window.currentStudent =
  JSON.parse(localStorage.getItem("currentStudent") || "null");

  window.currentTheme = localStorage.getItem("flashcard-theme") || null;
if (window.currentTheme) applyThemePreset(window.currentTheme);


(function cleanupNullQuizScores() {
  let scores = JSON.parse(localStorage.getItem("studentQuizScores") || "[]");
  scores = scores.filter(s => s.quizId != null);
  localStorage.setItem("studentQuizScores", JSON.stringify(scores));
})();

const TEACHER_DRAFT_KEY = "teacher_quiz_draft";

function shuffleArray(array) {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

function saveTeacherDraft(title, questions, timeLimit = 0) {
  localStorage.setItem(
    TEACHER_DRAFT_KEY,
    JSON.stringify({ title, questions, timeLimit })
  );
}

function loadTeacherDraft() {
  const raw = localStorage.getItem(TEACHER_DRAFT_KEY);
  return raw ? JSON.parse(raw) : { title: "", questions: [], timeLimit: 0 };
}


function clearTeacherDraft() {
  localStorage.removeItem(TEACHER_DRAFT_KEY);
}

function initTeacherView() {
  // 1️⃣ Restore draft
  const draft = loadTeacherDraft();
  if (draft) {
    teacherQuestions = draft.questions || teacherQuestions;
    window._teacherTitleDraft = draft.title || "";
  } else {
    window._teacherTitleDraft = "";
  }

  // 2️⃣ Setup back button AFTER render
  requestAnimationFrame(() => {
    const backBtn = document.getElementById("backBtnTeacherQuiz");
    if (!backBtn) return;

    backBtn.style.display = "block";

    backBtn.onclick = () => {
      currentView = "home";
      renderApp();
    };
  });
}

const AI_API_URL =
  "https://flashcards-ai-backend.onrender.com/api/generate-cards";

const defaultConfig = {
  app_title: "Flashcard Study",
  app_subtitle: "Create custom subjects and master your knowledge",
  background_color: "#f0f4f8",
  card_background: "#ffffff",
  primary_color: "#2563eb",
  text_color: "#1e293b",
  secondary_color: "#64748b"
};

const DEFAULT_SETTINGS = {
  theme: "light",
  colors: {
    primary: "#2563eb",
    background: "#f8fafc",
    card: "#ffffff",
    text: "#0f172a"
  },
  font: {
    family: "Open Sans",
    size: 16,
    lineHeight: 1.6
  },
  layout: {
    radius: 16,
    cardSize: "normal",
    animation: "flip"
  },
  layoutMode: "auto"
};

const THEME_PRESETS = {

  light: {
    colors: {
      primary: "#2563eb",
      background: "#f8fafc",
      card: "#ffffff",
      text: "#0f172a"
    },
    font: {
      family: "Google Sans"
    }
  },

  dark: {
    colors: {
      primary: "#60a5fa",
      background: "#020617",
      card: "#020617",
      text: "#e5e7eb"
    },
    font: {
      family: "Open Sans"
    }
  },

  cyber: {
    colors: {
      primary: "#22d3ee",
      background: "#020617",
      card: "#020617",
      text: "#67e8f9"
    },
    font: {
      family: "BBHBorgle"
    }
  },
 
futuristic: {
  colors: {
    primary: "#00ffea",       
    background: "#0a0a0a",   
    card: "#111111",          
    text: "#00ffe0"           
  },
  font: { family: "Orbitron" },  
  backgroundImage: "url('images/futuristic.svg')"
},

  paper: {
    colors: {
      primary: "#92400e",
      background: "#fef3c7",
      card: "#fffbeb",
      text: "#451a03"
    },
    font: {
      family: "Playfair Display"
    }
  },

  midnight: {
    colors: {
      primary: "#818cf8",
      background: "#0b1020",
      card: "#121a33",
      text: "#e0e7ff"
    },
    font: {
      family: "Google Sans"
    }
  },

  forest: {
    colors: {
      primary: "#16a34a",
      background: "#052e16",
      card: "#064e3b",
      text: "#ecfdf5"
    },
    font: {
      family: "Open Sans"
    }
  },

  sunset: {
    colors: {
      primary: "#f97316",
      background: "#fff7ed",
      card: "#ffedd5",
      text: "#7c2d12"
    }
  },

  rose: {
    colors: {
      primary: "#e11d48",
      background: "#fff1f2",
      card: "#ffe4e6",
      text: "#4c0519"
    }
  },

  graphite: {
    colors: {
      primary: "#38bdf8",
      background: "#0f172a",
      card: "#111827",
      text: "#cbd5f5"
    },
    font: {
      family: "Roboto"
    }
  },

  lavender: {
    colors: {
      primary: "#8b5cf6",
      background: "#f5f3ff",
      card: "#ede9fe",
      text: "#312e81"
    }
  },

  coffee: {
    colors: {
      primary: "#78350f",
      background: "#faf3e0",
      card: "#f3e5ab",
      text: "#3f1d0b"
    },
    font: {
      family: "Playfair Display"
    }
  },

  mint: {
    colors: {
      primary: "#14b8a6",
      background: "#ecfeff",
      card: "#cffafe",
      text: "#134e4a"
    }
  },

blackpink: {
  colors: {
    primary: "#E1CBD8",
    background: "#503A49",
    card: "#947284",
    text: "#1a1a1a"
  },
  font: { family: "Google Sans" },
  backgroundImage: "url('images/blackpink.svg')"
},

bts: {
  colors: { 
    primary: "#6a5acd", 
    background: "#f3f0ff", 
    card: "#e6e1ff", 
    text: "#111" 
  },
  font: { family: "Poppins" },
  backgroundImage: "url('images/bts.svg')"
},

twice: {
  colors: { 
    primary: "#ff6ec7", 
    background: "#fff5fa", 
    card: "#ffe0f2", 
    text: "#111" 
  },
  font: { family: "Open Sans" },
  backgroundImage: "url('images/twice.svg')"
},
seventeen: {
  colors: { 
    primary: "#9d8df1", 
    background: "#f6f3ff", 
    card: "#e8e0ff", 
    text: "#111" 
  },
  font: { family: "Poppins" },
  backgroundImage: "url('images/seventeen.svg')"
},
straykids: {
  colors: { 
    primary: "#bd2222", 
    background: "#fff5f5", 
    card: "#ffe0e0", 
    text: "#111" 
  },
  font: { family: "Poppins" },
  backgroundImage: "url('images/straykids.svg')"

},
exo: {
  colors: { 
    primary: "#111", 
    background: "#e5e7eb", 
    card: "#fff", 
    text: "#000" 
  },
  font: { family: "Poppins" },
  backgroundImage: "url('images/exo.svg')"
},
redvelvet: {
  colors: { 
    primary: "#e63946", 
    background: "#fff4f4", 
    card: "#ffe1e1", 
    text: "#111" 
  },
  font: { family: "Poppins" },
  backgroundImage: "url('images/redvelvet.svg')"
},
itzy: {
  colors: { 
    primary: "#FF1E56", 
    background: "#FFE600", 
    card: "#00D0FF", 
    text: "#111" 
  },
  font: { family: "Open Sans" },
  backgroundImage: "url('images/itzy.svg')"
},
newjeans: {
  colors: { 
    primary: "#97C9DE", 
    background: "#DCB69F",  
    card: "#24537D", 
    text: "#111" 
  },
  font: { family: "Open Sans" },
  backgroundImage: "url('images/newjeans.svg')"
},
  jungle: {
    colors: {
      primary: "#1e5128",      
      background: "#d4f4dd",   
      card: "#a8e6cf",         
      text: "#0b3d0b"          
    },
    font: { family: "Open Sans" },
    backgroundImage: "url('images/jungle.svg')"
  },

  safari: {
    colors: {
      primary: "#c19a6b",      
      background: "#fff8f0",   
      card: "#f5e0c3",         
      text: "#5a3e2b"          
    },
    font: { family: "Roboto" },
    backgroundImage: "url('images/safari.svg')"
  },

  ocean: {
    colors: {
      primary: "#0288d1",      
      background: "#e0f7fa",   
      card: "#b2ebf2",         
      text: "#014f86"          
    },
    font: { family: "Poppins" },
    backgroundImage: "url('images/ocean.svg')"
  },

lake: {
  colors: {
    primary: "#1fa2a6",      
    background: "#d0f0ea",   
    card: "#a0e3d8",         
    text: "#054d44"
  },
  font: { family: "Open Sans" },
  backgroundImage: "url('images/lake.svg')"
},

    animals_jungle: {
    colors: {
      primary: "#1e5128",
      background: "#d4f4dd",
      card: "#a8e6cf",
      text: "#0b3d0b"
    },
    font: { family: "Open Sans" },
    backgroundImage: "url('images/animals_jungle.svg')"
  },

  animals_safari: {
    colors: {
      primary: "#c19a6b",
      background: "#fff8f0",
      card: "#f5e0c3",
      text: "#5a3e2b"
    },
    font: { family: "Roboto" },
    backgroundImage: "url('images/animals_safari.svg')"
  },

  animals_ocean: {
    colors: {
      primary: "#0288d1",
      background: "#e0f7fa",
      card: "#b2ebf2",
      text: "#014f86"
    },
    font: { family: "Poppins" },
    backgroundImage: "url('images/animals_ocean.svg')"
  },

  animals_pets: {
    colors: {
      primary: "#ff6f61",
      background: "#fff0f0",
      card: "#ffe6e6",
      text: "#331a1a"
    },
    font: { family: "Open Sans" },
    backgroundImage: "url('images/pets.svg')"
  },

  animals_arctic: {
    colors: {
      primary: "#00bcd4",
      background: "#e0f7fa",
      card: "#b2ebf2",
      text: "#002f3d"
    },
    font: { family: "Roboto" },
    backgroundImage: "url('images/arctic.svg')"
  },

  animals_rainforest: {
    colors: {
      primary: "#2e7d32",
      background: "#dcedc8",
      card: "#aed581",
      text: "#1b5e20"
    },
    font: { family: "Open Sans" },
    backgroundImage: "url('images/rainforest.svg')"
  },

  animals_desert: {
    colors: {
      primary: "#ff9800",
      background: "#fff3e0",
      card: "#ffe0b2",
      text: "#5d4037"
    },
    font: { family: "Poppins" },
    backgroundImage: "url('images/desert.svg')"
  },

  animals_farm: {
    colors: {
      primary: "#f57f17",
      background: "#fff8e1",
      card: "#ffecb3",
      text: "#4e342e"
    },
    font: { family: "Open Sans" },
    backgroundImage: "url('images/farm.svg')"
  },

  animals_jungle_night: {
    colors: {
      primary: "#0d3b1e",
      background: "#081f0f",
      card: "#14391c",
      text: "#c8f5d9"
    },
    font: { family: "Roboto" },
    backgroundImage: "url('images/jungle_night.svg')"
  },

  animals_deep_sea: {
    colors: {
      primary: "#005f73",
      background: "#001219",
      card: "#0a9396",
      text: "#e0fbfc"
    },
    font: { family: "Poppins" },
    backgroundImage: "url('images/deep_sea.svg')"
  },

  animals_butterflies: {
    colors: {
      primary: "#f48fb1",
      background: "#fff0f6",
      card: "#ffd6e8",
      text: "#4a148c"
    },
    font: { family: "Open Sans" },
    backgroundImage: "url('images/butterflies.svg')"
  },

  animals_tropical_birds: {
    colors: {
      primary: "#ff5722",
      background: "#fff3e0",
      card: "#ffccbc",
      text: "#3e2723"
    },
    font: { family: "Roboto" },
    backgroundImage: "url('images/tropical_birds.svg')"
  }
};

const COLOR_PALETTES = {
  /* ───── Light / Clean ───── */
  pastel:      { primary:"#ff9ecb", background:"#fff5fb", card:"#ffe3f1", text:"#4a4a4a" },
  softMint:    { primary:"#97f2d7", background:"#eafff7", card:"#c8ffee", text:"#2d3a34" },
  airyBlue:    { primary:"#7dd3fc", background:"#e0f7ff", card:"#cdefff", text:"#0a2b3a" },
  creamLatte:  { primary:"#c69c6d", background:"#f9f0e5", card:"#f2ded0", text:"#3a2a20" },
  roseCloud:   { primary:"#ffb3c1", background:"#fff0f5", card:"#ffe1eb", text:"#432b3b" },
  lilacMist:   { primary:"#c7a0ff", background:"#f4e9ff", card:"#e8d5ff", text:"#392f52" },
  minimalGray: { primary:"#4b5563", background:"#f3f4f6", card:"#e5e7eb", text:"#1f2937" },

  /* ───── Dark Modes ───── */
  dark:        { primary:"#5aa2ff", background:"#0b111e", card:"#111a2d", text:"#e6ecff" },
  obsidian:    { primary:"#00eaff", background:"#020617", card:"#0f172a", text:"#d6faff" },
  midnight:    { primary:"#bfdbfe", background:"#0a1733", card:"#102347", text:"#eafbff" },
  cyberGray:   { primary:"#00ffa3", background:"#1b1b1b", card:"#262626", text:"#ffffff" },
  noirBrown:   { primary:"#d0a354", background:"#221c15", card:"#2d251c", text:"#f1e6d0" },
  neonNight:   { primary:"#39ff14", background:"#000000", card:"#0a0a0a", text:"#d3ffd1" },
  vaporDark:   { primary:"#ff87f2", background:"#1a0225", card:"#2a0438", text:"#ffd8fa" },

  /* ───── Nature / Earth ───── */
  forest:      { primary:"#16a34a", background:"#042f1a", card:"#064e3b", text:"#eafff7" },
  mossGreen:   { primary:"#6ee7b7", background:"#064e3b", card:"#0d6f52", text:"#eafff2" },
  sandDune:    { primary:"#d6a67a", background:"#2c241b", card:"#3a2f23", text:"#f7e9d8" },
  autumnLeaf:  { primary:"#e77f24", background:"#331806", card:"#52240c", text:"#f6d4b4" },
  ocean:       { primary:"#38bdf8", background:"#e0f7ff", card:"#b8ecff", text:"#0b2a36" },
  coralReef:   { primary:"#ff7a7a", background:"#ffecec", card:"#ffd6d6", text:"#3f1a1a" },
  natureWood:  { primary:"#b08968", background:"#f2e9dc", card:"#e6ccb2", text:"#3a2e28" },

  /* ───── Fun / Pop / Gaming ───── */
  neon:        { primary:"#00f0ff", background:"#00131a", card:"#002a33", text:"#00e7ff" },
  arcade:      { primary:"#ff00c8", background:"#000428", card:"#1a0340", text:"#ffd6fb" },
  synthwave:   { primary:"#ff00a0", background:"#140022", card:"#240042", text:"#ffdbfa" },
  gamerGreen:  { primary:"#26ff00", background:"#001100", card:"#002200", text:"#caffc6" },
  retroPixel:  { primary:"#ffcc00", background:"#2a1e05", card:"#3a2b07", text:"#fff7d1" },
  cosmicBlue:  { primary:"#00bfff", background:"#001733", card:"#01294a", text:"#c9eeff" },
  dragonFire:  { primary:"#ff462b", background:"#200000", card:"#340000", text:"#ffb1a6" },

  /* ───── Aesthetic / Cute / Soft ───── */
  sakura:      { primary:"#ff9bbf", background:"#ffeaf3", card:"#ffd4e7", text:"#402332" },
  skyCotton:   { primary:"#8ccaff", background:"#e9f5ff", card:"#d2ebff", text:"#172534" },
  matchaMilk:  { primary:"#9fc788", background:"#f3f9ef", card:"#e7f4e2", text:"#2e4027" },
  sunset:      { primary:"#ff7d45", background:"#fff0e6", card:"#ffe0d1", text:"#4a1e09" },
  lavenderMilk:{ primary:"#b98cff", background:"#f7f1ff", card:"#e6daff", text:"#2f2452" },
  bubbleGum:   { primary:"#ff77e9", background:"#ffe3fb", card:"#ffc6f5", text:"#45163b" },

  /* ───── Professional / UI Neutral ───── */
  officeBlue:  { primary:"#2563eb", background:"#f3f6fc", card:"#dbe7ff", text:"#1e293b" },
  slateMono:   { primary:"#64748b", background:"#f1f5f9", card:"#e2e8f0", text:"#1e293b" },
  steelGrey:   { primary:"#4b5563", background:"#1f2937", card:"#374151", text:"#e5e7eb" },
  businessTeal:{ primary:"#14b8a6", background:"#ecfdfa", card:"#cff8f3", text:"#083d37" }
};


const BUILT_IN_SETS = {
math: {
  subject: {
    name: "Math",
    icon: "➗"
  },
  set: {
    name: "Basic Math Expanded"
  },
  cards: [
    // Addition
    { question: "2 + 2", answer: "4" },
    { question: "7 + 5", answer: "12" },
    { question: "15 + 6", answer: "21" },
    { question: "100 + 250", answer: "350" },

    // Subtraction
    { question: "9 - 4", answer: "5" },
    { question: "25 - 10", answer: "15" },
    { question: "120 - 45", answer: "75" },

    // Multiplication
    { question: "5 × 3", answer: "15" },
    { question: "6 × 7", answer: "42" },
    { question: "12 × 12", answer: "144" },

    // Division
    { question: "10 ÷ 2", answer: "5" },
    { question: "36 ÷ 6", answer: "6" },
    { question: "81 ÷ 9", answer: "9" },

    // Fractions
    { question: "1/2 + 1/2", answer: "1" },
    { question: "3/4 - 1/4", answer: "1/2" },
    { question: "1/3 × 3", answer: "1" },

    // Algebra basics
    { question: "Solve: x + 5 = 12", answer: "x = 7" },
    { question: "Solve: 3x = 18", answer: "x = 6" },
    { question: "Solve: x - 8 = 10", answer: "x = 18" },

    // Geometry
    { question: "How many sides does a triangle have?", answer: "3" },
    { question: "Area of a square = ?", answer: "side × side" },
    { question: "A shape with 6 sides is called?", answer: "Hexagon" }
  ]
},

science: {
  subject: {
    name: "Science",
    icon: "🔬"
  },
  set: {
    name: "Basic Science"
  },
  cards: [
    { question: "Water formula", answer: "H2O" },
    { question: "Sun is a?", answer: "Star" },
    { question: "Earth revolves around?", answer: "Sun" },
    { question: "Gravity", answer: "Force that attracts objects toward each other" },
    { question: "Photosynthesis", answer: "Process plants make food using sunlight" },
    { question: "Atom", answer: "Smallest unit of matter" },
    { question: "Molecule", answer: "Two or more atoms bonded together" },
    { question: "Solid", answer: "State of matter with fixed shape" },
    { question: "Liquid", answer: "State of matter with no fixed shape" },
    { question: "Gas", answer: "State of matter that expands to fill space" },
    { question: "Evaporation", answer: "Liquid turning into gas" },
    { question: "Condensation", answer: "Gas turning into liquid" },
    { question: "Oxygen symbol", answer: "O" },
    { question: "Carbon symbol", answer: "C" },
    { question: "Nitrogen symbol", answer: "N" },
    { question: "Force", answer: "Push or pull on an object" },
    { question: "Energy", answer: "Ability to do work" },
    { question: "Magnet attracts?", answer: "Iron and steel" },
    { question: "Boiling point of water", answer: "100°C or 212°F" },
    { question: "Freezing point of water", answer: "0°C or 32°F" }
  ]
},

history: {
  subject: {
    name: "History",
    icon: "🏛️"
  },
  set: {
    name: "World History Basics"
  },
  cards: [
    { question: "First president of the Philippines", answer: "Emilio Aguinaldo"},
    { question: "Year World War II ended", answer: "1945" },
    { question: "Ancient civilization in Egypt", answer: "Egyptians" },
    { question: "Great Wall is in?", answer: "China" },
    { question: "Renaissance period", answer: "14th to 17th century Europe" },
    { question: "Columbus discovered America in?", answer: "1492" },
    { question: "Roman Empire capital", answer: "Rome" },
    { question: "Industrial Revolution started in", answer: "Britain" },
    { question: "Declaration of Independence year", answer: "1776" },
    { question: "Napoleon was from?", answer: "France" }
  ]
},

computer: {
  subject: {
    name: "Computer Science",
    icon: "💻"
  },
  set: {
    name: "Basic Concepts"
  },
  cards: [
    { question: "HTML stands for?", answer: "HyperText Markup Language" },
    { question: "CSS is for?", answer: "Styling web pages" },
    { question: "JS is short for?", answer: "JavaScript" },
    { question: "Function in JS", answer: "Reusable block of code" },
    { question: "Variable", answer: "Stores data values" },
    { question: "Array", answer: "Collection of values in order" },
    { question: "Object", answer: "Data structure with key-value pairs" },
    { question: "Loop", answer: "Executes code repeatedly" },
    { question: "Conditional", answer: "Runs code based on a condition" },
    { question: "Boolean", answer: "True or false value" }
  ]
},

filipino: {
  subject: {
    name: "Filipino",
    icon: "🇵🇭"
  },
  set: {
    name: "Basic Words"
  },
  cards: [
    { question: "Hello in Filipino", answer: "Kumusta" },
    { question: "Thank you", answer: "Salamat" },
    { question: "Good morning", answer: "Magandang umaga" },
    { question: "Good night", answer: "Magandang gabi" },
    { question: "Yes", answer: "Oo" },
    { question: "No", answer: "Hindi" },
    { question: "Please", answer: "Pakiusap" },
    { question: "Excuse me", answer: "Paumanhin" },
    { question: "Friend", answer: "Kaibigan" },
    { question: "Family", answer: "Pamilya" }
  ]
},

english: {
  subject: {
    name: "English",
    icon: "📘"
  },
  set: {
    name: "Basic Vocabulary"
  },
  cards: [
    { question: "Hello", answer: "A greeting" },
    { question: "Goodbye", answer: "A farewell" },
    { question: "Please", answer: "Used to make a polite request" },
    { question: "Thank you", answer: "Expression of gratitude" },
    { question: "Yes", answer: "Affirmative response" },
    { question: "No", answer: "Negative response" },
    { question: "Excuse me", answer: "Used to politely get attention" },
    { question: "Sorry", answer: "Expression of apology" },
    { question: "Friend", answer: "Someone you have a close relationship with" },
    { question: "Family", answer: "Group of related people" },
    { question: "Book", answer: "Collection of written or printed pages" },
    { question: "School", answer: "Place where people learn" },
    { question: "Food", answer: "What people eat" },
    { question: "Water", answer: "Liquid essential for life" },
    { question: "Happy", answer: "Feeling of joy or pleasure" },
    { question: "Sad", answer: "Feeling of unhappiness" }
  ]
},

  biology: {
    subject: { name: "Biology", icon: "🧬" },
    set: { name: "Basic Biology" },
    cards: [
      { question: "What is the powerhouse of the cell?", answer: "Mitochondria" },
      { question: "What is the largest organ in the human body?", answer: "Skin" },
      { question: "What carries genetic information?", answer: "DNA" },
      { question: "The basic unit of life?", answer: "Cell" },
      { question: "Process by which plants make food?", answer: "Photosynthesis" },
      { question: "Blood cells that fight infection?", answer: "White blood cells" },
      { question: "Blood cells that carry oxygen?", answer: "Red blood cells" },
      { question: "Liquid part of blood?", answer: "Plasma" },
      { question: "Where digestion begins?", answer: "Mouth" },
      { question: "Organ that pumps blood?", answer: "Heart" },
      { question: "Where gas exchange occurs?", answer: "Lungs" },
      { question: "Process of cell division?", answer: "Mitosis" },
      { question: "Organism made of many cells?", answer: "Multicellular organism" },
      { question: "Organism made of one cell?", answer: "Unicellular organism" },
      { question: "Organ that filters blood?", answer: "Kidney" },
      { question: "Tissue that connects muscles to bones?", answer: "Tendon" },
      { question: "Tissue that connects bones to bones?", answer: "Ligament" },
      { question: "Primary molecule in cell membranes?", answer: "Phospholipid" },
      { question: "Process of evolution?", answer: "Natural selection" },
      { question: "Study of living organisms?", answer: "Biology" }
    ]
  },

  geography: {
    subject: { name: "Geography", icon: "🌍" },
    set: { name: "Basic Geography" },
    cards: [
      { question: "Largest continent?", answer: "Asia" },
      { question: "Longest river in the world?", answer: "Nile" },
      { question: "Largest ocean?", answer: "Pacific" },
      { question: "Highest mountain?", answer: "Mount Everest" },
      { question: "Capital of France?", answer: "Paris" },
      { question: "Country with most population?", answer: "China" },
      { question: "Continent Australia is in?", answer: "Oceania" },
      { question: "Imaginary line dividing Earth into N and S?", answer: "Equator" },
      { question: "Largest desert?", answer: "Sahara" },
      { question: "What is tectonic plate movement called?", answer: "Plate tectonics" }
    ]
  },

  chemistry: {
    subject: { name: "Chemistry", icon: "⚗️" },
    set: { name: "Basic Chemistry" },
    cards: [
      { question: "Water formula?", answer: "H2O" },
      { question: "Atomic number?", answer: "Number of protons" },
      { question: "pH of pure water?", answer: "7" },
      { question: "Most abundant gas in air?", answer: "Nitrogen" },
      { question: "Chemical symbol for gold?", answer: "Au" },
      { question: "Process of solid to gas?", answer: "Sublimation" },
      { question: "Acidic solution has pH?", answer: "<7" },
      { question: "Base solution has pH?", answer: ">7" },
      { question: "Covalent bond?", answer: "Sharing of electrons" },
      { question: "Ionic bond?", answer: "Transfer of electrons" }
    ]
  },

  physics: {
    subject: { name: "Physics", icon: "🪐" },
    set: { name: "Basic Physics" },
    cards: [
      { question: "Force formula?", answer: "F = ma" },
      { question: "Speed formula?", answer: "Distance ÷ Time" },
      { question: "Acceleration formula?", answer: "Change in velocity ÷ Time" },
      { question: "Unit of energy?", answer: "Joule" },
      { question: "Unit of force?", answer: "Newton" },
      { question: "Unit of power?", answer: "Watt" },
      { question: "Gravity acceleration?", answer: "9.8 m/s²" },
      { question: "Light speed?", answer: "3 × 10⁸ m/s" },
      { question: "Newton's 1st law?", answer: "Inertia" },
      { question: "Newton's 2nd law?", answer: "F = ma" }
    ]
  },

  art: {
    subject: { name: "Art", icon: "🎨" },
    set: { name: "Basic Art" },
    cards: [
      { question: "Primary colors?", answer: "Red, Blue, Yellow" },
      { question: "Famous painter of Mona Lisa?", answer: "Leonardo da Vinci" },
      { question: "Art of making sculptures?", answer: "Sculpture" },
      { question: "Famous Dutch painter of Starry Night?", answer: "Vincent van Gogh" },
      { question: "Technique of shading?", answer: "Hatching" },
      { question: "Mixing colors?", answer: "Color theory" },
      { question: "Modern art style using geometric shapes?", answer: "Cubism" },
      { question: "Art of decorative writing?", answer: "Calligraphy" },
      { question: "Famous Mexican muralist?", answer: "Diego Rivera" },
      { question: "Art movement with surreal imagery?", answer: "Surrealism" }
    ]
  }
};

let config = { ...defaultConfig };
let allData = [];
let currentView = 'home';
let currentSubject = null;
let currentSet = null;
let currentCardIndex = 0;
let isFlipped = false;
let isLoading = false;
let quizIndex = 0;
let quizScore = 0;
let quizQuestions = [];
let deferredInstallPrompt = null;
let teacherQuestions = [];
let saveTimeout;
let teacherDraftSaveTimer;
let isQuizPreview = false;
let teacherQuizData = null;
let teacherQuizIndex = 0;
let teacherQuizScore = 0;
let isTeacherQuiz = false;
let currentQuizId = null;
let isStudentLocked = false;
let studentTab = "main";   
let teacherTab = "main";
let pendingQuizId = null;
let timerHidden = false;
let showTimerControls = true;
let activeBottomTab = "home"; 
let currentBrowseSetId = null;
let currentBrowseSetCards = [];
let currentBrowseCardIndex = 0;
let isBrowseCardFlipped = false;
let currentStudent = {
  name: "",
  id: ""
};
let studyTimer = {
  duration: 20 * 60,
  remaining: 20 * 60,
  interval: null,
  running: false,
  startTime: null
};



function renderBottomNav() {
  const primary = config.primary_color;
  const bg = config.card_background;
  const text = config.text_color;

  const tabStyle = (tab) => `
    flex:1;
    text-align:center;
    padding:10px 0;
    font-size:12px;
    color:${activeBottomTab === tab ? primary : text};
    font-weight:${activeBottomTab === tab ? "600" : "400"};
  `;

  return `
    <div
      style="
        position:fixed;
        margin-bottom:5px;
        bottom:0;
        left:0;
        right:0;
        height:50px;
        background:${bg};
        box-shadow:0 -6px 20px rgba(0,0,0,.12);
        display:flex;
        z-index:2000;
      "
    >
      <button style="${tabStyle("browse")}" onclick="goToBrowse()">
        📚<br/>Browse
      </button>

      <button style="${tabStyle("home")}" onclick="goToHome()">
        🏠<br/>Home
      </button>

      <button style="${tabStyle("themes")}" onclick="goToThemes()">
        🎨<br/>Themes
      </button>
    </div>
  `;
}

function goToHome() {
  activeBottomTab = "home";
  currentView = "home";
  renderApp();
}

function goToBrowse() {
  activeBottomTab = "browse";
  currentView = "browse"; 
  renderApp();
}

function goToThemes() {
  activeBottomTab = "themes";
  currentView = "themes"; 
  renderApp();
}

function renderBrowseView() {
const builtInSets = [
  { id: 'math', name: 'Math', icon: '➗', gradient: 'from-blue-400 to-blue-600', count: 22 },
  { id: 'science', name: 'Science', icon: '🔬', gradient: 'from-green-400 to-green-600', count: 20 },
  { id: 'english', name: 'English', icon: '📖', gradient: 'from-purple-400 to-purple-600', count: 16 },
  { id: 'biology', name: 'Biology', icon: '🧬', gradient: 'from-blue-600 to-green-600', count: 20 },
  { id: 'history', name: 'History', icon: '🏛️', gradient: 'from-yellow-400 to-yellow-600', count: 10 },
  { id: 'filipino', name: 'Filipino', icon: '🇵🇭', gradient: 'from-yellow-400 to-red-600', count: 10 },
  { id: 'computer', name: 'ComputerScience', icon: '💻', gradient: 'from-pink-400 to-pink-600', count: 10 },
  { id: 'geography', name: 'Geography', icon: '🌍', gradient: 'from-teal-400 to-teal-600', count: 10 },
  { id: 'chemistry', name: 'Chemistry', icon: '⚗️', gradient: 'from-indigo-400 to-indigo-600', count: 10 },
  { id: 'physics', name: 'Physics', icon: '🪐', gradient: 'from-gray-400 to-gray-600', count: 10 },
  { id: 'art', name: 'Art', icon: '🎨', gradient: 'from-red-400 to-red-600', count: 10 }
];


  const setsHTML = builtInSets.map(set => `
    <div 
      class="browse-card flex flex-col items-center justify-center p-5 rounded-2xl shadow-lg cursor-pointer text-white transition transform hover:scale-105 active:scale-95 bg-gradient-to-br ${set.gradient}" 
      onclick="openBrowseSet('${set.id}')"
    >
      <div class="text-3xl mb-2">${set.icon}</div>
      <h3 class="font-semibold text-lg">${set.name}</h3>
      <p class="text-sm opacity-80 mt-1">${set.count} card${set.count !== 1 ? 's' : ''}</p>
    </div>
  `).join('');

  return `
    <div class="p-5 fade-in max-w-md mx-auto">
      <h2 class="text-xl font-semibold mb-6 text-center" style="color: var(--text);">
        📚 Browse Flashcards
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        ${setsHTML}
      </div>
    </div>
  `;
}

function openBrowseSet(id) {
  currentBrowseSetId = id;
  currentView = "browse-cards";
  renderApp();
}

function renderBrowseCardsView() {
  if (!currentBrowseSetId) return renderBrowseView();

  const data = BUILT_IN_SETS[currentBrowseSetId];
  if (!data) return renderBrowseView();

  const cardsHTML = data.cards.map((card, i) => `
    <div class="card-preview p-4 rounded-xl mb-3"
         style="background:var(--card-bg); box-shadow:0 2px 8px rgba(0,0,0,.08);">
      <strong>Q${i + 1}:</strong> ${card.question}<br/>
      <span style="opacity:.7">${card.answer}</span>
    </div>
  `).join('');

  return `
    <div class="fade-in p-4 max-w-md mx-auto">
      <button
        class="mb-4 px-4 py-2 rounded-lg"
        style="background:var(--card-bg)"
        onclick="goBackToBrowse()"
      >
        ← Back
      </button>

      <h2 class="text-lg font-semibold mb-4">${data.set.name}</h2>

      <div class="flex gap-3 mb-4">
        <button
          class="flex-1 py-3 rounded-xl text-white"
          style="background:var(--primary)"
          onclick="startBrowseStudy('${currentBrowseSetId}')"
        >
          Study
        </button>
      </div>

      ${cardsHTML}
    </div>
  `;
}

function startBrowseStudy(setId) {
  const data = BUILT_IN_SETS[setId];
  if (!data) return;

  currentBrowseSetCards = data.cards;
  currentBrowseCardIndex = 0;
  isBrowseCardFlipped = false;
  currentView = "browse-study";
  renderApp();
}

// ---------- Render Browse Study as Flashcards ----------
function renderBrowseStudyView() {
  const card = currentBrowseSetCards[currentBrowseCardIndex];
  if (!card) {
    currentView = "browse-cards";
    return renderBrowseCardsView();
  }

  return `
    <div class="p-4 max-w-md mx-auto fade-in">
      <button class="mb-4 px-4 py-2 rounded-lg"
              style="background:var(--card-bg); cursor:pointer;" 
              onclick="backToBrowseCards()">
        ← Back
      </button>

      <div class="card-study p-6 rounded-xl text-center" 
           style="background:var(--card-bg); perspective:1000px;">

        <div class="card-inner ${isBrowseCardFlipped ? 'flipped' : ''}" 
     onclick="flipBrowseCard()" 
     style="
       transition: transform 0.6s cubic-bezier(.175,.885,.32,1.275), scale 0.3s ease;
       transform-style: preserve-3d;
       cursor: pointer;
       position: relative;
       width: 100%;
       min-height: 150px;
       border-radius: 1rem;
       box-shadow: 0 4px 12px rgba(0,0,0,0.1);
     ">

  <div class="card-front" style="
       backface-visibility: hidden;
       position: absolute; top: 0; left: 0;
       width: 100%; height: 100%;
       display: flex; justify-content: center; align-items: center;
       padding: 1rem;
       border-radius: 1rem;
       background: var(--card-bg);
     ">
    <h3 class="font-semibold text-lg mb-2">Q: ${card.question}</h3>
  </div>


          <div class="card-back" style="
               backface-visibility: hidden;
               transform: rotateY(180deg);
               position: absolute; top: 0; left: 0;
               width: 100%; height: 100%;
               display: flex; justify-content: center; align-items: center;
               padding: 1rem;
               border-radius: 1rem;
               background: var(--card-bg);
               box-shadow: 0 4px 12px rgba(0,0,0,0.1);
             ">
            <p class="opacity-80">A: ${card.answer}</p>
          </div>

        </div>
      </div>

      <div class="flex justify-between mt-4">
        <button onclick="prevBrowseCard()" 
                class="px-4 py-2 rounded-lg" 
                style="background:var(--card-bg); cursor:pointer;">← Prev</button>
        <button onclick="nextBrowseCard()" 
                class="px-4 py-2 rounded-lg" 
                style="background:var(--card-bg); cursor:pointer;">Next →</button>
      </div>
      <style>
  .card-inner {
    transform: rotateY(0deg);
  }

  .card-inner.flipped {
    transform: rotateY(180deg) scale(1.03); /* Slight pop when flipped */
    box-shadow: 0 10px 24px rgba(0,0,0,0.2);
  }

  /* Smooth fade for backside as it flips */
  .card-back {
    opacity: 0;
    transition: opacity 0.3s ease 0.25s;
  }

  .card-inner.flipped .card-back {
    opacity: 1;
  }
</style>

    </div>
  `;
}

// ---------- Flip Card ----------
function flipBrowseCard() {
  isBrowseCardFlipped = !isBrowseCardFlipped;
  renderApp();
}

// ---------- Navigation ----------
function prevBrowseCard() {
  if (currentBrowseCardIndex > 0) currentBrowseCardIndex--;
  isBrowseCardFlipped = false; // reset flip
  renderApp();
}

function nextBrowseCard() {
  if (currentBrowseCardIndex < currentBrowseSetCards.length - 1) currentBrowseCardIndex++;
  isBrowseCardFlipped = false; // reset flip
  renderApp();
}

function startBrowseQuiz(setId) {
  const data = BUILT_IN_SETS[setId];
  if (!data) return;

  currentBrowseQuizCards = data.cards;
  currentBrowseQuizIndex = 0;
  currentBrowseQuizScore = 0;
  currentView = "browse-quiz";
  renderApp();
}

function renderBrowseQuizView() {
  const card = currentBrowseQuizCards[currentBrowseQuizIndex];
  if (!card) {
    return `
      <div class="p-4 max-w-md mx-auto fade-in text-center">
        <h2 class="text-xl font-semibold mb-4">Quiz Complete!</h2>
        <p class="mb-4">Score: ${currentBrowseQuizScore} / ${currentBrowseQuizCards.length}</p>
        <button class="px-4 py-2 rounded-lg" style="background:var(--primary); color:white;" onclick="backToBrowseCards()">
          Back to Set
        </button>
      </div>
    `;
  }

  return `
    <div class="p-4 max-w-md mx-auto fade-in">
      <h3 class="font-semibold text-lg mb-2">Q${currentBrowseQuizIndex + 1}: ${card.question}</h3>

      <button class="w-full py-3 mt-3 rounded-xl text-white" style="background:var(--primary)" onclick="answerBrowseQuiz(true)">
        Show Answer
      </button>
    </div>
  `;
}

function answerBrowseQuiz(showAnswer) {
  if (showAnswer) currentBrowseQuizScore++;
  currentBrowseQuizIndex++;
  renderApp();
}

function backToBrowseCards() {
  currentView = "browse-cards";
  renderApp();
}

function goBackToBrowse() {
  currentBrowseSetId = null;
  currentView = "browse";
  renderApp();
}

function renderThemesView() {
  const categories = {
  "Nature": [ 
    "jungle", 
    "safari", 
    "ocean",
    "lake"],
  "Animals": [  
  "animals_jungle",
  "animals_safari",
  "animals_ocean",
  "animals_pets",
  "animals_arctic",
  "animals_rainforest",
  "animals_desert",
  "animals_farm",
  "animals_jungle_night",
  "animals_deep_sea",
  "animals_butterflies",
  "animals_tropical_birds"
],
  "K-pop": [
  "blackpink", 
  "bts", 
  "twice",
  "seventeen",
  "straykids",
  "exo",
  "redvelvet",
  "itzy",
  "newjeans"
],
"Vibes": [
    "forest", 
    "mint", 
    "lavender", 
    "coffee",
],
    "Dark Aesthetic": [
      "midnight", 
      "graphite", 
      "cyber",
    "futuristic"],

    "Light & Minimal": [
      "light", 
      "paper", 
      "sunset", 
      "rose"]
  };

  const themeSection = Object.keys(categories).map(category => `
    <div class="theme-section mb-5">
      <h3 class="text-lg font-semibold mb-2">${category}</h3>
      <div class="grid grid-cols-2 gap-2">
        ${categories[category].map(t => createThemeButton(t)).join("")}
      </div>
    </div>
  `).join("");

  return `
    <div class="p-5 fade-in max-w-md mx-auto">
      <h2 class="text-xl font-bold mb-4 text-center">🎨 Themes</h2>
      <p class="text-sm opacity-70 text-center mb-4">Choose a theme category below</p>
      ${themeSection}
    </div>
  `;
}

function formatName(name) {
  return name.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

function createThemeButton(themeName) {
  const preset = THEME_PRESETS[themeName];
  if (!preset) return "";

  const bgImage = preset.backgroundImage || null;
  const previewStyle = bgImage
    ? `background-image:${bgImage}; background-size:cover; background-position:center;`
    : `background:${preset.colors.background}; border:1px solid #ccc;`;

  return `
    <button 
      onclick="applyThemePreset('${themeName}')"
      style="
        padding:8px; 
        border-radius:10px;
        background:${preset.colors.card}; 
        color:${preset.colors.text};
        text-align:center;
        font-weight:600;
        transition:.2s;
        display:flex;
        flex-direction:column;
        gap:6px;
      "
      class="theme-btn hover:scale-[1.03]"
    >

      <!-- Preview Box -->
      <div style="
        width:100%; 
        height:60px; 
        border-radius:8px;
        ${previewStyle}
      "></div>

      <!-- Label -->
      <span style="font-size:13px">${formatName(themeName)}</span>
    </button>
  `;
}


function applyThemePreset(name) {
  const theme = THEME_PRESETS[name];
  if (!theme) return;

  window.currentTheme = name;
  localStorage.setItem("flashcard-theme", name);

  const r = document.documentElement.style;

  r.setProperty("--primary", theme.colors.primary);
  r.setProperty("--card-bg", theme.colors.card);
  r.setProperty("--text", theme.colors.text);
  r.setProperty("--background", theme.colors.background || "#ffffff");

  if (theme.backgroundImage) {
    r.setProperty("--background-image", theme.backgroundImage);
  } else {
    r.setProperty("--background-image", "none");
  }

  renderApp();
}



function renderHomeView() {
  return `
    <div class="w-full h-full flex items-center justify-center p-6">
      <div class="max-w-md w-full text-center fade-in">

        <h1
          style="
            font-size:calc(var(--font-size) * 2.2);
            color:var(--text);
            margin-bottom:12px;
          "
        >
          📚 Study Hub
        </h1>

        <p
          style="
            color:var(--secondary, #64748b);
            margin-bottom:32px;
          "
        >
          Choose a study mode to begin
        </p>

        <div class="flex flex-col gap-4">

          <!-- Flashcards -->
<button
  type="button"
  onclick="openFlashcards()"
  class="w-full py-4 rounded-xl font-semibold"
  style="
    background:var(--primary);
    color:white;
    box-shadow:0 10px 30px rgba(37,99,235,.35);
    font-size:calc(var(--font-size) * 1.1);
  "
>
  🃏 Flashcards
</button>

          <!-- Teacher Quiz -->
          <button
            onclick="openTeacherQuiz()"
            class="w-full py-4 rounded-xl font-semibold"
            style="
              background:var(--card-bg);
              color:var(--text);
              box-shadow:0 6px 18px rgba(0,0,0,.1);
            "
          >
            👩‍🏫 Create Quiz
          </button>

          <!-- Student Quiz -->
          <button
            onclick="openStudentQuiz()"
            class="w-full py-4 rounded-xl font-semibold"
            style="
              background:var(--card-bg);
              color:var(--text);
              box-shadow:0 6px 18px rgba(0,0,0,.1);
            "
          >
            👨‍🎓 Join Quiz
          </button>

        </div>

      </div>
    </div>
  `;
}

function openFlashcards() {
  activeBottomTab = "subjects"; // sync bottom nav
  currentView = "subjects";
  renderApp();
}

function openTeacherQuiz() {
  currentView = "teacher";
  initTeacherView();
  renderApp();
}

function openStudentQuiz() {
  currentView = "student";
  renderApp();
}

function renderStudentView() {
  return `
    <div class="flex flex-col items-center mt-6 space-y-6 w-full">
<div class="w-full flex justify-start mb-2">
  <button
    onclick="backStudentBtn()"
    style="color: var(--primary); background-color: var(--card-bg); border-radius: var(--radius);"
    class="px-4 py-3 font-semibold"
  >
    ← Back
  </button>
</div>

      <!-- Student Tabs -->
      <div class="flex gap-2">
        <button
          class="px-4 py-2 rounded-lg transition-colors duration-200"
          style="
            background-color: ${studentTab === 'main' ? 'var(--primary)' : 'var(--surface)'}; 
            color: ${studentTab === 'main' ? 'var(--on-primary)' : 'var(--on-surface)'};"
          onclick="studentTab='main'; renderApp()"
        >
          Quiz
        </button>

        <button
          class="px-4 py-2 rounded-lg transition-colors duration-200"
          style="
            background-color: ${studentTab === 'profile' ? 'var(--primary)' : 'var(--surface)'}; 
            color: ${studentTab === 'profile' ? 'var(--on-primary)' : 'var(--on-surface)'};"
          onclick="studentTab='profile'; renderApp()"
        >
          Profile
        </button>
      </div>

      <!-- Content -->
      <div class="w-full max-w-xl">
        ${studentTab === 'main'
          ? renderJoinQuiz()
          : renderStudentProfile()}
      </div>

    </div>
  `;
}

function renderStudentProfile() {
  const s = window.currentStudent || {};

  return `
    <div class="p-6 rounded-xl shadow space-y-4 mx-auto"
         style="background-color: var(--surface); color: var(--on-surface);">
      <h2 class="text-2xl font-bold text-center">Student Profile</h2>

      <div>
        <label class="block text-sm font-semibold">Name</label>
        <input id="student-name"
               class="w-full p-2 border rounded"
               style="border-color: var(--border); background: var(--input-bg); color: var(--on-surface);"
               value="${s.name || ''}">
      </div>

      <div>
        <label class="block text-sm font-semibold">Student ID</label>
        <input id="student-id"
               class="w-full p-2 border rounded"
               style="border-color: var(--border); background: var(--input-bg); color: var(--on-surface);"
               value="${s.id || ''}">
      </div>

      <div class="flex justify-center gap-4 pt-2">
        <button class="px-4 py-2 rounded transition-colors duration-200"
                style="background-color: var(--primary); color: var(--on-primary);"
                onclick="
                  saveStudentProfile(
                    document.getElementById('student-name').value.trim(),
                    document.getElementById('student-id').value.trim()
                  )
                ">
          Save
        </button>

        <button class="px-4 py-2 rounded transition-colors duration-200"
                style="background-color: var(--error); color: var(--on-error);"
                onclick="clearStudentInfo()">
          Reset
        </button>
      </div>
    </div>
  `;
}




function renderJoinQuiz() {
  const student = window.currentStudent || { name: "", id: "" };

  return `
    <div class="w-full min-h-screen flex items-center justify-center p-4"
         style="background-color: var(--background); font-family: var(--font-family); font-size: var(--font-size); line-height: var(--line-height);">
      <div class="w-full max-w-md p-6 fade-in space-y-6"
           style="background-color: var(--card-bg); border-radius: var(--radius);">

        <!-- Logged in info -->
        ${student.name && student.id ? `
        <div style="color: var(--primary); font-size: 0.875rem;">
          ✅ Logged in as: ${student.name} (${student.id})
        </div>` : ""}

        <!-- Student Info Modal -->
        <div id="student-info-modal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 hidden">
          <div style="background-color: var(--card-bg); border-radius: var(--radius);" class="p-6 w-full max-w-sm mx-2">
            <h3 style="color: var(--text);" class="text-lg font-semibold mb-4">👤 Student Information</h3>
            <input
              id="student-name-input"
              placeholder="Full Name"
              style="background-color: var(--card-bg); color: var(--text); border-radius: var(--radius); border: 1px solid var(--primary);"
              class="w-full mb-3 px-3 py-2"
            />
            <input
              id="student-id-input"
              placeholder="Student ID"
              style="background-color: var(--card-bg); color: var(--text); border-radius: var(--radius); border: 1px solid var(--primary);"
              class="w-full mb-4 px-3 py-2"
            />
            <div class="flex justify-end gap-2">
              <button onclick="closeStudentInfoModal()"
                      style="background-color: var(--card-bg); color: var(--text); border-radius: var(--radius); border: 1px solid var(--primary);"
                      class="px-4 py-2">
                Cancel
              </button>
              <button onclick="confirmStudentInfo()"
                      style="background-color: var(--primary); color: white; border-radius: var(--radius);"
                      class="px-4 py-2">
                Continue
              </button>
            </div>
          </div>
        </div>

        <!-- Quiz Join Section -->
        <h2 style="color: var(--text);" class="text-2xl font-semibold">🧠 Join Quiz</h2>
        <p style="color: var(--secondary-text);" class="text-sm mb-4">
          Enter the quiz ID provided
        </p>

        <input
          id="student-quiz-id"
          placeholder="Quiz ID"
          style="background-color: var(--card-bg); color: var(--text); border-radius: var(--radius); border: 1px solid var(--primary);"
          class="w-full mb-4 px-4 py-3"
        />

        <button
          onclick="loadStudentQuiz()"
          style="background-color: var(--primary); color: white; border-radius: var(--radius);"
          class="w-full py-3 mb-2 font-semibold"
        >
          Start Quiz
        </button>

        <button 
          onclick="currentView='student-score-history'; renderApp();"
          style="background-color: var(--primary); color: white; border-radius: var(--radius);"
          class="w-full py-3 mb-2 font-semibold"
        >
          📊 View Score History
        </button>

        <div id="student-error" style="color: red;" class="mt-4 text-center"></div>
      </div>
    </div>
  `;
}

function saveStudentProfile(name, id) {
  window.currentStudent = { name, id };
  localStorage.setItem("currentStudent", JSON.stringify(window.currentStudent));
  studentTab = "profile";
  renderApp();
}

function hasValidStudent() {
  return (
    window.currentStudent &&
    window.currentStudent.name &&
    window.currentStudent.id
  );
}


function clearStudentInfo() {
  if (!confirm("Clear student information?")) return;
  window.currentStudent = null;
  localStorage.removeItem("currentStudent");
  studentTab = "main";
  renderApp();
}

function openStudentInfoModal() {
  if (!window.currentStudent) return;

  document.getElementById("student-name-input").value = window.currentStudent.name || "";
  document.getElementById("student-id-input").value = window.currentStudent.id || "";

  document.getElementById("student-info-modal").classList.remove("hidden");
}

function closeStudentInfoModal() {
  document.getElementById("student-info-modal").classList.add("hidden");
}

function submitStudentInfo() {
  const name = document.getElementById("student-name").value.trim();
  const id = document.getElementById("student-id").value.trim();

  if (!name || !id) {
    alert("Please enter both name and ID");
    return;
  }

  window.currentStudent = { name, id };
  sessionStorage.setItem("currentStudent", JSON.stringify(window.currentStudent));

  closeStudentInfoModal();

  // If a quiz was pending, resume it
  if (pendingQuizId) {
    loadStudentQuiz(pendingQuizId);
    pendingQuizId = null;
  }
}




function confirmStudentInfo() {
  const name = document.getElementById("student-name-input").value.trim();
  const id = document.getElementById("student-id-input").value.trim();

  if (!name || !id) {
    alert("Please enter your name and student ID");
    return;
  }

  window.currentStudent = { name, id };
  localStorage.setItem("currentStudent", JSON.stringify(window.currentStudent));

  closeStudentInfoModal();

  if (pendingQuizId) {
    const quizId = pendingQuizId;
    pendingQuizId = null;
    loadStudentQuiz(); 
  }
}

function startStudentQuiz(quizId) {
  if (!quizId) {
    alert("Cannot start quiz: quizId missing!");
    return;
  }

  currentQuizId = quizId;
  quizIndex = 0;
  quizScore = 0;
  currentView = "teacher-quiz";
  renderApp();
}


function backStudentBtn() {
  currentView = 'home'; 
  renderApp();         
}

function renderTeacherView() {
  return `
   <div class="flex flex-col items-center mt-6 space-y-4 w-full" 
     style="background-image: var(--background-image); background-size: cover; background-position: center;">
  <div class="w-full flex justify-start px-4">
    <button
      id="backBtnTeacher"
      class="px-4 py-2 rounded-lg"
      style="background:var(--card-bg);"
    >
      ← Back
    </button>
  </div>
      <!-- Teacher Tabs -->
      <div class="flex gap-2">
        <button
          class="px-4 py-2 rounded-lg transition-colors duration-200"
          style="
            background-color: ${teacherTab === 'main' ? 'var(--primary)' : 'var(--surface)'}; 
            color: ${teacherTab === 'main' ? 'var(--on-primary)' : 'var(--on-surface)'};"
          onclick="teacherTab='main'; renderApp()"
        >
          Dashboard
        </button>

        <button
          class="px-4 py-2 rounded-lg transition-colors duration-200"
          style="
            background-color: ${teacherTab === 'profile' ? 'var(--primary)' : 'var(--surface)'}; 
            color: ${teacherTab === 'profile' ? 'var(--on-primary)' : 'var(--on-surface)'};"
          onclick="teacherTab='profile'; renderApp()"
        >
          Profile
        </button>
      </div>

      <!-- Content -->
      <div class="mt-4">
        ${teacherTab === 'main'
          ? renderTeacherQuizList()
          : renderTeacherProfile()}
      </div>

    </div>
  `;
}


function renderTeacherProfile() {
  const t = getTeacherProfile();

  return `
    <div class="p-4 rounded-xl bg-white shadow space-y-3" style="background-color: var(--surface); color: var(--on-surface);">
      <h2 class="text-xl font-bold">Teacher Profile</h2>

      <div>
        <label class="block text-sm font-semibold">Name</label>
        <input id="teacher-name"
          class="w-full p-2 border rounded"
          style="border-color: var(--border); background: var(--input-bg); color: var(--on-surface);"
          value="${t.name || ""}">
      </div>

      <div>
        <label class="block text-sm font-semibold">Subject</label>
        <input id="teacher-subject"
          class="w-full p-2 border rounded"
          style="border-color: var(--border); background: var(--input-bg); color: var(--on-surface);"
          value="${t.subject || ""}">
      </div>

      <div>
        <label class="block text-sm font-semibold">School</label>
        <input id="teacher-school"
          class="w-full p-2 border rounded"
           style="border-color: var(--border); background: var(--input-bg); color: var(--on-surface);"
          value="${t.school || ""}">
      </div>

      <button class="mt-2 px-4 py-2" style="background-color: var(--primary); color: white; border-radius: var(--radius);"
        onclick="
          saveTeacherProfile({
            name: document.getElementById('teacher-name').value.trim(),
            subject: document.getElementById('teacher-subject').value.trim(),
            school: document.getElementById('teacher-school').value.trim()
          })
        ">
        Save Profile
      </button>
    </div>
  `;
}


function getTeacherProfile() {
  return JSON.parse(localStorage.getItem("teacherProfile") || "{}");
}

function saveTeacherProfile(profile) {
  localStorage.setItem("teacherProfile", JSON.stringify(profile));
  teacherTab = "profile";
  renderApp();
}


function renderTeacherQuizList() {
  const teacherQuizzes = getTeacherQuizzes();

  const quizListHTML = teacherQuizzes.length
    ? teacherQuizzes.map(q => `
        <div class="p-4 rounded-xl flex justify-between items-center" style="background: var(--card-bg);">
          <div>
            <div style="font-weight:600; color: var(--text);">${q.title}</div>
            <code style="font-size:12px; opacity:.7; color: var(--secondary-text);">${q.quizId}</code>
          </div>
<div class="flex flex-wrap gap-2">
  <button 
    onclick="navigator.clipboard.writeText('${q.quizId}')" 
    class="px-3 py-1 rounded-full text-sm"
    style="background: var(--primary); color: white; flex-shrink: 1;"
  >
    Copy
  </button>

  <button 
    onclick="editTeacherQuiz('${q.quizId}')" 
    class="px-3 py-1 rounded-full text-sm"
    style="background: rgba(0,0,0,.08); flex-shrink: 1;"
  >
    Edit
  </button>

  <button 
    onclick="deleteTeacherQuiz('${q.quizId}')" 
    class="px-3 py-1 rounded-full text-sm"
    style="background: rgba(239,68,68,.15); color:#dc2626; flex-shrink: 1;"
  >
    Delete
  </button>
</div>

        </div>
      `).join("")
    : `<p style="color: var(--secondary-text);">No quizzes created yet.</p>`;

  const renderQuestionInputs = () => teacherQuestions.map((q, i) => `
    <div class="p-4 rounded-xl" style="background: var(--card-bg);">
      <input
        placeholder="Question"
        class="w-full mb-2 px-3 py-2 rounded-lg"
        style="background: var(--card-bg); color: var(--text); border: 1px solid var(--primary); border-radius: var(--radius);"
        value="${q.question}"
        oninput="updateTeacherQuestion(${i}, 'question', this.value)"
      />
      ${q.options.map((opt, j) => `
        <div class="flex items-center mb-2">
          <span style="width:20px; font-weight:600; color: var(--text);">${String.fromCharCode(65+j)}.</span>
          <input
            placeholder="Option ${j + 1}"
            class="w-full px-3 py-2 rounded-lg"
            style="background: var(--card-bg); color: var(--text); border: 1px solid var(--primary); border-radius: var(--radius);"
            value="${opt}"
            oninput="updateTeacherOption(${i}, ${j}, this.value)"
          />
        </div>
      `).join("")}
      <input
        placeholder="Correct answer (letter, e.g., A)"
        class="w-full px-3 py-2 rounded-lg"
        style="background: var(--card-bg); color: var(--text); border: 1px solid var(--primary); border-radius: var(--radius);"
        value="${q.correct}"
        oninput="updateTeacherQuestion(${i}, 'correct', this.value.toUpperCase())"
      />
    </div>
  `).join("");

  const renderPreview = () => teacherQuestions.length ? teacherQuestions.map((q, i) => `
    <div class="p-3 mb-3 rounded-lg" style="background: var(--card-bg);">
      <strong style="color: var(--text);">Q${i + 1}: ${q.question}</strong>
      <ul style="margin-top:4px; padding-left:18px; color: var(--text);">
        ${q.options.map((opt, j) => `<li>${String.fromCharCode(65 + j)}. ${opt}</li>`).join("")}
      </ul>
      <p style="color: var(--primary); font-size:0.9em;">Answer: ${q.correct}</p>
    </div>
  `).join("") : `<p style="color: var(--secondary-text);">No questions to preview.</p>`;

  return `
    <div class="w-full h-full overflow-auto p-6" style="background: var(--background); font-family: var(--font-family); font-size: var(--font-size); line-height: var(--line-height);">
      <div class="max-w-2xl mx-auto fade-in">


        <h3 style="font-size:calc(var(--font-size) * 1.2); margin-bottom:12px; color: var(--text);">📋 Your Quizzes</h3>
        ${quizListHTML}
        <hr style="margin:24px 0; opacity:.2;" />

        <button onclick="showTeacherScoresView()"
                class="w-full py-3 rounded-xl font-semibold"
                style="background: var(--primary); color: var(--text); box-shadow:0 6px 18px rgba(0,0,0,.1);">
          📊 View Student Scores
        </button>

        <h2 style="font-size:calc(var(--font-size) * 1.8); margin:8px; color: var(--text);">👩‍🏫 Create Quiz</h2>
        <p style="color: var(--secondary-text); margin-bottom:24px;">Build a quiz and share it</p>

        <input
          id="quiz-title"
          placeholder="Quiz title"
          value="${window._teacherTitleDraft || ""}"
          class="w-full mb-4 px-4 py-3 rounded-xl"
          style="background: var(--card-bg); color: var(--text); border-radius: var(--radius); border: 1px solid var(--primary);"
          oninput="updateTeacherTitle(this.value)"
        />

        <div class="flex flex-col gap-4 mb-4">${renderQuestionInputs()}</div>

        <button onclick="addTeacherQuestion()"
                class="w-full py-3 rounded-xl font-semibold"
                style="background: var(--card-bg); color: var(--text); border:1px solid var(--primary);">
          ➕ Add Question
        </button>
        <button onclick="submitTeacherQuiz()"
                class="w-full py-4 rounded-xl font-semibold mt-6"
                style="background: var(--primary); color:white; box-shadow:0 10px 30px rgba(37,99,235,.35);">
          🚀 Publish Quiz
        </button>

        <div id="teacher-result" class="mt-6 text-center"></div>

        <hr style="margin:32px 0; opacity:.2;" />

        <h2 style="font-size:calc(var(--font-size) * 1.8); margin-bottom:8px; color: var(--text);">📝 Preview Quiz</h2>
        <div id="preview-quiz">${renderPreview()}</div>

        <hr style="margin:32px 0; opacity:.2;" />

        <h2 style="font-size:calc(var(--font-size) * 1.8); margin-bottom:8px; color: var(--text);">🤖 AI Quiz Assistant</h2>
        <p style="color: var(--secondary-text); margin-bottom:12px;">Generate quiz questions automatically for a topic</p>
        <button onclick="openAIQuizModal()" class="w-full py-3 rounded-xl font-semibold"
                style="background: rgba(37,99,235,.15); color: var(--primary);">
          🤖 Generate AI Quiz
        </button>

        <!-- AI Quiz Modal -->
        <div id="ai-quiz-modal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 hidden">
          <div class="bg-card rounded-xl p-6 w-full max-w-sm mx-2"
               style="background: var(--card-bg); color: var(--text); border-radius: var(--radius);">
            <h3 class="text-lg font-semibold mb-4" style="color: var(--text);">🤖 Generate AI Quiz</h3>
            <input id="ai-quiz-topic-input" placeholder="Topic"
                   class="w-full mb-3 px-3 py-2 rounded-lg"
                   style="background: var(--card-bg); color: var(--text); border: 1px solid var(--primary); border-radius: var(--radius);" />
            <input id="ai-quiz-count-input" type="number" min="1" max="20" placeholder="Number of questions"
                   class="w-full mb-4 px-3 py-2 rounded-lg"
                   style="background: var(--card-bg); color: var(--text); border: 1px solid var(--primary); border-radius: var(--radius);" />
            <div class="flex justify-end gap-2">
              <button onclick="closeAIQuizModal()"
                      class="px-4 py-2 rounded-lg"
                      style="background: var(--card-bg); color: var(--text); border:1px solid var(--primary);">Cancel</button>
              <button onclick="generateAIQuiz()"
                      class="px-4 py-2 rounded-lg"
                      style="background: var(--primary); color:white;">Generate</button>
            </div>
          </div>
        </div>

        <div id="ai-quiz-result" class="mt-4"></div>
      </div>
    </div>
  `;
}

function openAIQuizModal() {
  document.getElementById("ai-quiz-modal").classList.remove("hidden");
}

function closeAIQuizModal() {
  document.getElementById("ai-quiz-modal").classList.add("hidden");
}

function updateTeacherQuestion(index, field, value) {
  teacherQuestions[index][field] = value;

  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    saveTeacherDraft(
      document.getElementById('quiz-title')?.value || '',
      teacherQuestions
    );
  }, 300);
}

function updateTeacherOption(qIndex, optIndex, value) {
  teacherQuestions[qIndex].options[optIndex] = value;

  clearTimeout(teacherDraftSaveTimer);
  teacherDraftSaveTimer = setTimeout(() => {
    saveTeacherDraft(
      document.getElementById('quiz-title')?.value || '',
      teacherQuestions
    );
  }, 300);
}


function updateTeacherTitle(title) {
  window._teacherTitleDraft = title;
  saveTeacherDraft(title, teacherQuestions);
}


async function generateAIQuiz() {
  const topicInput = document.getElementById("ai-quiz-topic-input");
  const countInput = document.getElementById("ai-quiz-count-input");

  const topic = topicInput?.value.trim();
  const count = Number(countInput?.value) || 5;

  if (!topic) return alert("Topic is required");

  try {
    const res = await fetch("https://flashcards-ai-backend.onrender.com/api/generate-quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, numQuestions: count })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "AI backend error");
    }

    const data = await res.json();

    teacherQuestions = data.questions.map(q => {
      let options = [...(q.options || [])];

      options = shuffleArray(options);

      const correctText = (q.correct || "").trim().toLowerCase();
      let correctIndex = options.findIndex(
        opt => opt.trim().toLowerCase() === correctText
      );

      if (correctIndex === -1) {
        correctIndex = Math.floor(Math.random() * options.length);
      }

      const correctLetter = String.fromCharCode(65 + correctIndex);

      return {
        question: q.question || "",
        options,
        correct: correctLetter
      };
    });

    window._teacherTitleDraft = `${topic} Quiz`;

    closeAIQuizModal();
    topicInput.value = "";
    countInput.value = "";

    alert(`✅ ${teacherQuestions.length} questions generated!`);

    currentView = "teacher";
    renderApp();
  } catch (err) {
    console.error("AI Quiz generation failed:", err);
    alert("❌ Failed to generate AI quiz: " + err.message);
  }
}






function previewTeacherQuiz() {
  const title = document.getElementById("quiz-title")?.value || "Preview Quiz";

  if (teacherQuestions.length === 0) {
    alert("Add at least one question to preview.");
    return;
  }


  isQuizPreview = true;

  quizQuestions = teacherQuestions.map(q => ({
    question: q.question,
    options: q.options,
    correct: q.correct
  }));

  quizIndex = 0;
  quizScore = 0;

  currentView = "teacher-quiz"; 
  renderApp();
}



async function editTeacherQuiz(quizId) {
  const res = await fetch(
    `https://quiz-backend.espaderario.workers.dev/api/quizzes/${quizId}`
  );

if (!res.ok) {
  const err = await res.json();
  alert(err.error || "Failed to update quiz");
  return;
}

  const data = await res.json();

  clearTeacherDraft();

  window._teacherEditingQuizId = quizId;
  window._teacherTitleDraft = data.quiz.title;
  teacherQuestions = data.questions;

  currentView = "teacher";
  renderApp();
}




async function deleteTeacherQuiz(quizId) {
  if (!confirm("Delete this quiz permanently?")) return;

  await fetch(
    `https://quiz-backend.espaderario.workers.dev/api/quizzes/${quizId}`,
    { method: "DELETE" }
  );

  const user = getUser();
  const key = `teacher_quizzes_${user.id}`;
  const quizzes = getTeacherQuizzes().filter(q => q.quizId !== quizId);

  localStorage.setItem(key, JSON.stringify(quizzes));
  renderApp();
}


function addTeacherQuestion() {
  teacherQuestions.push({
    question: "",
    options: ["", "", "", ""],
    correct: ""
  });

  saveTeacherDraft(
    document.getElementById("quiz-title")?.value || "",
    teacherQuestions
  );

  renderApp();
}

async function submitTeacherQuiz() {
  const title = document.getElementById("quiz-title").value.trim();

  if (!title || teacherQuestions.length === 0) {
    alert("Please add a title and at least one question.");
    return;
  }

  const isEditing = !!window._teacherEditingQuizId;

  const url = isEditing
    ? `https://quiz-backend.espaderario.workers.dev/api/quizzes/${window._teacherEditingQuizId}`
    : "https://quiz-backend.espaderario.workers.dev/api/quizzes";

  const method = isEditing ? "PUT" : "POST";

  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        questions: teacherQuestions,
      }),
    });

    const data = await res.json(); // read once

    if (!res.ok) {
      alert(data.error || "Failed to save quiz");
      return;
    }

    if (!isEditing) {
      saveTeacherQuiz({
        quizId: data.quizId,
        title,
      });
    }

    if (isQuizPreview) {
      alert("Preview finished! No results were saved.");
      isQuizPreview = false;
      return;
    }

    window._teacherEditingQuizId = null;
    clearTeacherDraft();
    teacherQuestions = [];
    window._teacherTitleDraft = "";

    document.getElementById("teacher-result").innerHTML = `
      <div class="p-4 rounded-xl" style="background:rgba(34,197,94,.1);">
        ✅ Quiz ${isEditing ? "updated" : "created"} successfully!
      </div>
    `;

    renderApp();
  } catch (err) {
    console.error("Error submitting quiz:", err);
    alert("An unexpected error occurred while saving the quiz.");
  }
}



function saveTeacherQuiz(quiz) {
  const user = getUser();
  if (!user) return;

  const key = `teacher_quizzes_${user.id}`;
  const quizzes = JSON.parse(localStorage.getItem(key) || "[]");

  quizzes.unshift({
    quizId: quiz.quizId,
    title: quiz.title,
    createdAt: Date.now()
  });

  localStorage.setItem(key, JSON.stringify(quizzes));
}



function getTeacherQuizzes() {
  const user = getUser();
  if (!user) return [];

  const key = `teacher_quizzes_${user.id}`;
  return JSON.parse(localStorage.getItem(key) || "[]");
}

function bindTeacherViewEvents() {
  const backBtn = document.getElementById("backBtnTeacher");
  if (backBtn) {
    backBtn.onclick = () => {
      currentView = "home";
      renderApp();
    };
  }
  const backTeacherBtn = document.getElementById("backBtnScoresTeacher");
  if (backTeacherBtn) {
    backTeacherBtn.onclick = () => {
      currentView = "teacher-quiz-list";
      renderApp();
    };
  }
}

async function loadStudentQuiz() {
  const quizId = document.getElementById("student-quiz-id").value.trim();

  if (!quizId) {
    document.getElementById("student-error").innerText = "Enter a quiz ID";
    return;
  }

  if (!window.currentStudent || !window.currentStudent.name || !window.currentStudent.id) {
    pendingQuizId = quizId;
    openStudentInfoModal();
    return;
  }

  try {
    const res = await fetch(
      `https://quiz-backend.espaderario.workers.dev/api/quizzes/${quizId}`
    );

    if (!res.ok) {
      document.getElementById("student-error").innerText = "Quiz not found";
      return;
    }

    const data = await res.json();

    quizQuestions = data.questions;
    quizIds = quizId;
    currentQuizId = quizId;
    quizIndex = 0;
    quizScore = 0;
    isQuizPreview = false;
    isStudentLocked = true;

    currentView = "teacher-quiz";
    renderApp();

  } catch (err) {
    document.getElementById("student-error").innerText = "Network error";
  }
}

async function loadStudentQuiz(quizIdParam) {
  const quizId = quizIdParam || document.getElementById("student-quiz-id").value.trim();

  if (!quizId) {
    document.getElementById("student-error").innerText = "Enter a quiz ID";
    return;
  }

  if (!window.currentStudent || !window.currentStudent.name || !window.currentStudent.id) {
    pendingQuizId = quizId;
    openStudentInfoModal();
    return;
  }

  try {
    const res = await fetch(`https://quiz-backend.espaderario.workers.dev/api/quizzes/${quizId}`);
    if (!res.ok) {
      document.getElementById("student-error").innerText = "Quiz not found";
      return;
    }

    const data = await res.json();

    quizQuestions = data.questions;
    currentQuizId = quizId;
    quizIndex = 0;
    quizScore = 0;
    isQuizPreview = false;
    isStudentLocked = true;

    currentView = "teacher-quiz";
    renderApp();

  } catch (err) {
    document.getElementById("student-error").innerText = "Network error";
  }
}


function renderTeacherQuizView() {
  if (!quizQuestions || quizQuestions.length === 0) {
    console.warn("Quiz view opened without questions");
    currentView = "home";
    return renderHomeView();
  }

  const q = quizQuestions[quizIndex];
  const letters = ["A", "B", "C", "D"];

  return `
    <div class="w-full h-full p-6">
      <div class="max-w-xl mx-auto fade-in">
        <div class="text-sm mb-2" style="color:var(--secondary);">
          👀 Teacher Quiz • Question ${quizIndex + 1} / ${quizQuestions.length}
        </div>
        <h2 class="mb-6" style="calc(var(--font-size) * 2); font-weight:600; color:var(--text);">
          Q${quizIndex + 1}: ${q.question}
        </h2>

        <div class="flex flex-col gap-3">
          ${q.options.map((opt, j) => `
            <button
              onclick="answerTeacherQuiz('${letters[j]}')"
              class="px-4 py-3 rounded-xl"
              style="background:var(--card-bg); text-align:left;"
            >
              <strong>${letters[j]}.</strong> ${opt}
            </button>
          `).join("")}
        </div>
      </div>
    </div>
  `;
}

function finishStudentQuiz() {
  if (!currentQuizId) {
    console.error("Cannot finish quiz: currentQuizId is missing");
    alert("Quiz ID is missing. Score will not be saved.");
    return;
  }

  if (!window.currentStudent || !window.currentStudent.id) {
    alert("Cannot save score: student info missing!");
    return;
  }

  saveStudentScore({
    studentName: window.currentStudent.name,
    studentId: window.currentStudent.id,
    quizId: currentQuizId,
    score: quizScore,
    total: quizQuestions.length,
    date: Date.now()
  });

  currentView = "student-score-history";
  renderApp();
  populateStudentScores();
}




function answerTeacherQuiz(selectedLetter) {
  const q = quizQuestions[quizIndex];
  if (!q || !q.correct) return; // safety

  const correct = q.correct;
  const correctIndex = correct.charCodeAt(0) - 65;
  const correctText = q.options[correctIndex] || "Unknown";

  let feedbackEl = document.createElement("div");
  feedbackEl.style.marginTop = "12px";
  feedbackEl.style.fontWeight = "600";
  feedbackEl.style.color = selectedLetter === correct ? "green" : "red";
  feedbackEl.innerText = selectedLetter === correct 
    ? `Correct ✅` 
    : `Incorrect ❌ • Correct: ${correct} (${correctText})`;

  document.querySelector(".max-w-xl").appendChild(feedbackEl);

  if (selectedLetter === correct) quizScore++;

  setTimeout(() => {
    quizIndex++;
    if (quizIndex >= quizQuestions.length) {
      finishStudentQuiz();
    } else {
      renderApp();
    }
  }, 1500);
}


function saveStudentScore(record) {
  const student = window.currentStudent || JSON.parse(localStorage.getItem("currentStudent") || "{}");
  if (!student.name || !student.id) {
    alert("Student information missing! Cannot save score.");
    return;
  }

  if (!record.quizId) {
    console.error("Cannot save score: quizId is missing", record);
    return;
  }

  const scores = JSON.parse(localStorage.getItem("studentQuizScores") || "[]");


  const cleanedScores = scores.filter(s => s.quizId != null);

  const scoreRecord = {
    id: crypto.randomUUID(),
    ...record,
    studentName: student.name,
    studentId: student.id
  };

  cleanedScores.push(scoreRecord);
  localStorage.setItem("studentQuizScores", JSON.stringify(cleanedScores));

  if (currentView === "student-score-history") populateStudentScores();
}




function showStudentScores() {
  currentView = "student-score-history";
  renderApp();          
  populateStudentScores(); 
}

function showStudentScoresByQuiz(quizId) {
  const student = window.currentStudent || JSON.parse(localStorage.getItem("currentStudent") || "{}");
  if (!student.id) {
    alert("Student information missing!");
    return;
  }

  const allScores = JSON.parse(localStorage.getItem("studentQuizScores") || "[]");
  const container = document.getElementById("student-score-container");
  if (!container) return;

  const scores = allScores.filter(
    s => s.studentId === student.id && s.quizId === quizId
  );

  if (!scores.length) {
    container.innerHTML = `<p style="color:var(--secondary);">No attempts for this quiz yet.</p>`;
    return;
  }

  container.innerHTML = `
    <h3 class="mb-4 text-lg font-semibold">📘 Quiz: ${quizId}</h3>
    <ul class="flex flex-col gap-3">
      ${scores.map(s => `
        <li class="p-4 rounded-xl flex justify-between items-start" style="background:var(--card-bg);">
          <div>
            <div><strong>Score:</strong> ${s.score} / ${s.total}</div>
            <div style="color:var(--secondary); font-size:.9rem;">
              ${new Date(s.date).toLocaleString()}
            </div>
          </div>
          <button onclick="hideStudentScoreForMe('${s.id}')" class="px-3 py-1 rounded-lg text-sm"
                  style="background:rgba(239,68,68,.15); color:#dc2626;">
            Delete
          </button>
        </li>
      `).join("")}
    </ul>
    <button onclick="populateStudentScores()" class="mb-4 px-4 py-2 rounded-lg" style="background:var(--card-bg); color:white;">
      ← Back to All Scores
    </button>
  `;
}

function showTeacherScoresView() {
  currentView = "teacher-view-scores";
  renderApp();                  
  populateTeacherStudentScores();
}

function populateStudentScores() {
  const student = window.currentStudent || JSON.parse(localStorage.getItem("currentStudent") || "{}");
  if (!student.id) {
    alert("Student information missing!");
    return;
  }

  const allScores = JSON.parse(localStorage.getItem("studentQuizScores") || "[]");
  const container = document.getElementById("student-score-container");
  if (!container) return;

  const hiddenScores = JSON.parse(localStorage.getItem(`hiddenScores_${student.id}`) || "[]");

  const studentScores = allScores.filter(
    s => s.studentId === student.id && !hiddenScores.includes(s.id) && s.quizId != null
  );

  if (!studentScores.length) {
    container.innerHTML = `<p style="color:var(--secondary);">You haven't taken any quizzes yet.</p>`;
    return;
  }

  const quizzes = {};
  studentScores.forEach(s => {
    if (!quizzes[s.quizId]) quizzes[s.quizId] = [];
    quizzes[s.quizId].push(s);
  });

  container.innerHTML = `
    <ul class="flex flex-col gap-4">
      ${Object.entries(quizzes).map(([quizId, attempts]) => `
        <li class="p-4 rounded-xl flex justify-between items-center" style="background:var(--card-bg);">
          <div>
            <div><strong>Quiz:</strong> ${quizId}</div>
            <div style="color:var(--secondary); font-size:.9rem;">
              Attempts: ${attempts.length}
            </div>
          </div>
          <button onclick="showStudentScoresByQuiz('${quizId}')" class="px-4 py-2 rounded-xl" style="background:var(--primary); color:white;">View</button>
        </li>
      `).join("")}
    </ul>
  `;
}


function populateTeacherStudentScores() {
  const scores = JSON.parse(localStorage.getItem("studentQuizScores") || "[]");
  const container = document.getElementById("student-score-container");
  if (!container) return;

  if (!scores.length) {
    container.innerHTML = `
      <div class="dashboard-card p-6 text-center" style="color:var(--secondary);">
        No students have taken any quizzes yet.
      </div>
    `;
    return;
  }

  const quizzes = {};
  scores.forEach(s => {
    if (!quizzes[s.quizId]) quizzes[s.quizId] = [];
    quizzes[s.quizId].push(s);
  });

  container.innerHTML = `
    <div class="dashboard-list">
      ${Object.entries(quizzes).map(([quizId, attempts]) => `
        <div class="dashboard-card overflow-hidden">
          <div class="dashboard-header"
               onclick="toggleQuizSection('${quizId}')">
            <div>
              <strong>📘 ${quizId}</strong>
              <div style="font-size:.85rem; color:var(--secondary);">
                ${attempts.length} student${attempts.length !== 1 ? "s" : ""}
              </div>
            </div>
            <span id="icon-${quizId}">▾</span>
          </div>

          <div id="quiz-${quizId}" class="dashboard-body hidden">
            <div class="dashboard-list">
              ${attempts.map(s => `
  <div class="dashboard-item">
    <div>
      <div class="font-medium">
        ${s.studentName}
        <span style="opacity:.6;">(${s.studentId})</span>
      </div>
      <div style="font-size:.8rem; color:var(--secondary);">
        ${new Date(s.date).toLocaleString()}
      </div>
    </div>

    <div class="flex items-center gap-3">
      <div class="${
        s.score / s.total >= 0.7 ? "score-good" : "score-bad"
      }">
        ${s.score} / ${s.total}
      </div>

      <button
        onclick="deleteStudentScoreById('${s.id}')"
        class="px-2 py-1 rounded-md text-xs"
        style="background:rgba(239,68,68,.15); color:#dc2626;">
        ✕
      </button>
    </div>
  </div>
`).join("")}

            </div>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

function toggleQuizSection(quizId) {
  const section = document.getElementById(`quiz-${quizId}`);
  const icon = document.getElementById(`icon-${quizId}`);
  if (!section) return;

  const hidden = section.classList.toggle("hidden");
  icon.textContent = hidden ? "▾" : "▴";
}

function hideStudentScoreForMe(scoreId) {
  // Ensure we have a valid student object
  const student = window.currentStudent || JSON.parse(localStorage.getItem("currentStudent") || "{}");
  if (!student || !student.id) {
    alert("Student information missing!");
    return;
  }

  const key = `hiddenScores_${student.id}`;
  const hiddenScores = JSON.parse(localStorage.getItem(key) || "[]");

  if (!hiddenScores.includes(scoreId)) hiddenScores.push(scoreId);
  localStorage.setItem(key, JSON.stringify(hiddenScores));

  // Ensure the UI refresh uses the latest student data
  populateStudentScores();
}



function deleteStudentScoreById(scoreId) {
  if (!confirm("Delete this score?")) return;

  const scores = JSON.parse(localStorage.getItem("studentQuizScores") || "[]");
  const updated = scores.filter(s => s.id !== scoreId);

  localStorage.setItem("studentQuizScores", JSON.stringify(updated));

  if (currentView === "student-score-history") populateStudentScores();
  if (currentView === "teacher-view-scores") populateTeacherStudentScores();
}


function deleteStudentScore(index) {
  const scores = JSON.parse(localStorage.getItem("studentQuizScores") || "[]");
  if (index < 0 || index >= scores.length) return;
  if (!confirm("Delete this score?")) return;

  scores.splice(index, 1);
  localStorage.setItem("studentQuizScores", JSON.stringify(scores));

  if (currentView === "student-score-history") populateStudentScores();
  else if (currentView === "teacher-view-scores") populateTeacherStudentScores();
}
function clearMyStudentScores() {
  const student = window.currentStudent || JSON.parse(localStorage.getItem("currentStudent") || "{}");
  if (!student || !student.id) {
    alert("Student information missing!");
    return;
  }

  if (!confirm("Delete all your quiz history?")) return;

  const scores = JSON.parse(localStorage.getItem("studentQuizScores") || "[]");
  const filtered = scores.filter(s => s.studentId !== student.id);

  localStorage.setItem("studentQuizScores", JSON.stringify(filtered));
  populateStudentScores();
}

function clearAllStudentScores() {
  if (!confirm("This will delete ALL student scores. Continue?")) return;

  localStorage.removeItem("studentQuizScores");
  populateTeacherStudentScores();
}



function showScoresView() {
  renderApp();

  if (currentView === "student-score-history") {
    populateStudentScores();
  }

  if (currentView === "teacher-view-scores") {
    populateTeacherStudentScores();
  }
}

function clearAllStudentScores() {
  if (!confirm("Are you sure you want to delete all your quiz history?")) return;

  localStorage.removeItem("studentQuizScores");
  populateStudentScores(); // refresh view
}

function renderStudentScores() {
  const scores = JSON.parse(localStorage.getItem("studentQuizScores") || "[]");
  const container = document.getElementById("student-score-container");
  if (!container) return;

  if (!scores.length) {
    container.innerHTML = "<p>No quizzes taken yet.</p>";
    return;
  }

  container.innerHTML = `
    <ul class="flex flex-col gap-2">
      ${scores.map(s => `
        <li style="background:var(--card-bg); padding:8px; border-radius:8px;">
          Quiz: ${s.quizId} • Score: ${s.score}/${s.total} • Date: ${new Date(s.date).toLocaleString()}
        </li>
      `).join("")}
    </ul>
  `;
}



function renderStudentScoreHistoryView() {
  return `
    <div class="w-full h-full p-6">
      <h2 style="font-size:1.5rem; margin-bottom:16px;">📊 Quiz Score History</h2>
      <div id="student-score-container"></div>
      <button onclick="clearMyStudentScores()" class="mt-4 px-4 py-2 rounded-xl" style="background:rgba(239,68,68,.15); color:#dc2626;">
      🗑 Clear My Quiz History
      </button>
      <button onclick="currentView='home'; renderApp();" class="mb-4 px-4 py-2 rounded-lg" style="background:var(--primary); color:white;">
        ← Back to Home
      </button>
    </div>
  `;
}




function renderTeacherQuizResultView() {
  if (!teacherQuizData || !teacherQuizData.questions) {
    console.warn("Teacher quiz result rendered without data");
    currentView = "home";
    return renderHomeView();
  }

  return `
    <div>Result here</div>
  `;
}

function renderTeacherViewScores() {
  return `
    <div class="w-full h-full p-6">
      <button onclick="currentView='teacher'; renderApp();" 
        class="mb-4 px-4 py-2 rounded-lg" 
        style="background:var(--primary); color:white;">
        ← Back
      </button>
      <h2 style="font-size:1.5rem; margin-bottom:16px;">📊 Student Quiz Scores</h2>
      <div id="student-score-container"></div>
      <button onclick="clearAllStudentScores()"
      class="mt-4 px-4 py-2 rounded-xl"
      style="background:rgba(239,68,68,.15); color:#dc2626;">
      🗑 Clear ALL Student Scores
      </button>
    </div>
  `;
}



function exitTeacherQuiz() {
  quizQuestions = [];
  quizIndex = 0;
  quizScore = 0;
  isQuizPreview = false;

  currentView = "home";
  renderApp();
}






const savedDuration = parseInt(localStorage.getItem("studyTimerDuration"), 10);
if (!isNaN(savedDuration) && savedDuration > 0) {
  studyTimer.duration = savedDuration;
  studyTimer.remaining = savedDuration;
}


function applyUserSettings() {
  const s = userSettings;
  const r = document.documentElement.style;

  // Colors
  r.setProperty("--primary", s.colors.primary);
  r.setProperty("--background", s.colors.background);
  r.setProperty("--card-bg", s.colors.card);
  r.setProperty("--text", s.colors.text);

  // Fonts
  r.setProperty("--font-family", s.font.family);
  r.setProperty("--font-size", `${s.font.size}px`);
  r.setProperty("--line-height", s.font.lineHeight);

  // UI Dimensions
  r.setProperty("--radius", `${s.layout.radius}px`);
  document.documentElement.dataset.cardSize = s.layout.cardSize;
  document.documentElement.dataset.anim = s.layout.animation;

  // Background logic (clean & correct)
  if (s.backgroundImage) {
    r.setProperty("--background-image", s.backgroundImage);
    document.body.style.backgroundImage = s.backgroundImage;
    document.body.style.backgroundColor = "transparent";
  } else {
    r.setProperty("--background-image", "none");
    document.body.style.backgroundImage = "none";
    document.body.style.backgroundColor = s.colors.background;
  }

  // Save settings
  localStorage.setItem("userSettings", JSON.stringify(s));
}

let userSettings = loadSettings();
applyUserSettings();

function saveAndApplySettings() {
  localStorage.setItem("userSettings", JSON.stringify(userSettings));
  applyUserSettings();
}


function loadSettings() {
  try {
    return {
      ...DEFAULT_SETTINGS,
      ...JSON.parse(localStorage.getItem("userSettings"))
    };
  } catch {
    return structuredClone(DEFAULT_SETTINGS);
  }
}


function renderCustomizationPanel() {
  return `
  <div id="settingsMenu" 
  style="
    position:relative;
    padding:20px;
  "
>
<button id="closeSettingsBtn" onclick="closeSettings()"
  style="
    position:absolute;
    top:10px;
    right:10px;
    background:none;
    border:none;
    font-size:22px;
    cursor:pointer;
    padding:4px 8px;
  "
>✕</button>

<div class="settings-header" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
  <h2 style="margin:0;font-size:1.2rem;font-weight:600;">🎨 Customize Interface</h2>
</div>


<div class="settings-group">
  <label class="setting-label">View Mode</label>
  <select onchange="setLayoutMode(this.value)">
    <option value="auto">Auto (Based on screen size)</option>
    <option value="mobile">Mobile View</option>
    <option value="desktop">Desktop View</option>
  </select>
</div>

    <!-- PRIMARY COLOR -->
<div class="settings-group">
  <label>
    <span>Primary Color</span>
    <input
      type="color"
      value="${userSettings.colors.primary}"
      onchange="updateSetting('colors.primary', this.value)"
    />
  </label>
</div>

<div class="settings-group">
  <label>
    <span>Background Color</span>
    <input
      type="color"
      value="${userSettings.colors.background}"
      onchange="updateSetting('colors.background', this.value)"
    />
  </label>
</div>

<div class="settings-group">
  <label>
    <span>Card Color</span>
    <input
      type="color"
      value="${userSettings.colors.card}"
      onchange="updateSetting('colors.card', this.value)"
    />
  </label>
</div>

<div class="settings-group">
  <label>
    <span>Text Color</span>
    <input
      type="color"
      value="${userSettings.colors.text}"
      onchange="updateSetting('colors.text', this.value)"
    />
  </label>
</div>

<div class="settings-group">
  <label>
    <span>Choose Palette</span>
<h3 class="mt-4 mb-2 font-semibold">Color Palettes</h3>
<div class="palette-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
  ${Object.keys(COLOR_PALETTES).map(p => `
    <div class="palette-item"
      onclick="applyPalette('${p}')"
      style="
        cursor:pointer;
        border-radius:8px;
        height:45px;
        border:2px solid #fff;
        display:flex;overflow:hidden;
      "
    >
      <div style="flex:1;background:${COLOR_PALETTES[p].primary}"></div>
      <div style="flex:1;background:${COLOR_PALETTES[p].background}"></div>
      <div style="flex:1;background:${COLOR_PALETTES[p].card}"></div>
    </div>
  `).join("")}
</div>
  </label>
</div>


    <!-- FONT FAMILY -->
    <div class="settings-group">
      <label>
        <span>Font</span>
        <select onchange="updateSetting('font.family', this.value)">
          ${[
      "BBHBartle", "BBHBorgle", "BBHHegarty",
      "Open Sans", "Open Sans Italic",
      "Google Sans", "Google Sans Italic",
      "Playfair Display", "Playfair Display Italic",
      "Roboto", "Roboto Italic", "Orbitron"
    ].map(f => `
            <option ${userSettings.font.family === f ? "selected" : ""}>
              ${f}
            </option>
          `).join("")}
        </select>
      </label>
    </div>

    <!-- FONT SIZE -->
    <div class="settings-group">
      <label>
        <span>Font Size</span>
        <input
          type="range"
          min="12"
          max="22"
          value="${userSettings.font.size}"
          onchange="updateSetting('font.size', this.value)"
        />
      </label>
    </div>

    <!-- CORNER RADIUS -->
    <div class="settings-group">
      <label>
        <span>Corner Radius</span>
        <input
          type="range"
          min="8"
          max="28"
          value="${userSettings.layout.radius}"
          onchange="updateSetting('layout.radius', this.value)"
        />
      </label>
    </div>
    <div class="settings-group">
<button onclick="resetSettings()" class="reset-btn">
  Reset to Default
</button>
    </div>
    </div>
  `;
}

function resetSettings() {
  userSettings = structuredClone(DEFAULT_SETTINGS);
  saveAndApplySettings();
}

function setLayoutMode(mode) {
  userSettings.layoutMode = mode;
  applyUserSettings();
  renderApp();
}

function applyPalette(key){
  const p = COLOR_PALETTES[key];
  if(!p) return;

  userSettings.colors.primary = p.primary;
  userSettings.colors.background = p.background;
  userSettings.colors.card = p.card;
  userSettings.colors.text = p.text;

  saveAndApplySettings();
}


document.addEventListener("click", e => {
  if (document.querySelector(".settings-overlay")) return;

  const btn = e.target.closest("#openSettingsBtn");
  if (!btn) return;

  const overlay = document.createElement("div");
  overlay.className = "settings-overlay";

  overlay.innerHTML = `
    <div class="settings-modal">
      ${renderCustomizationPanel()}
    </div>
  `;

  document.body.appendChild(overlay);

  // ✅ Trigger animation AFTER mount
  requestAnimationFrame(() => {
    overlay.classList.add("open");
  });

  overlay.addEventListener("click", ev => {
    if (ev.target === overlay) overlay.remove();
  });

  overlay.querySelector("#closeSettingsBtn")?.addEventListener("click", () => {
    overlay.remove();
  });
});





function updateSetting(path, value) {
  const keys = path.split(".");
  let obj = userSettings;

  while (keys.length > 1) {
    obj = obj[keys.shift()];
  }

  obj[keys[0]] = isNaN(value) ? value : Number(value);

  saveAndApplySettings();
}

function applyThemePreset(themeKey) {
  const theme = THEME_PRESETS[themeKey];
  if (!theme) return;

  userSettings.colors = theme.colors;
  userSettings.font = theme.font || userSettings.font;
  userSettings.backgroundImage = theme.backgroundImage || null;
  userSettings.theme = themeKey;

  // Save to localStorage
  localStorage.setItem("selectedTheme", themeKey);
  saveAndApplySettings(); // this should call applyUserSettings()
}

const savedTheme = localStorage.getItem("selectedTheme");

if (savedTheme) {
  applyThemePreset(savedTheme);    // Set settings first
} else {
  saveAndApplySettings();          // Default fallback settings
}


function deepMerge(target, source) {
  const output = structuredClone(target);

  for (const key in source) {
    if (typeof source[key] === "object" && !Array.isArray(source[key])) {
      output[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      output[key] = source[key];
    }
  }

  return output;
}

const emojiOptions = ['📚', '🧪', '🎨', '💻', '🌍', '📐', '🎵', '⚽', '🔬', '📖', '🎭', '🏛️', '💼', '🍎', '🚀', '🎯', '💡', '🔧', '🌟', '🎪'];

const dataHandler = {
  onDataChanged(data) {
    allData = data;
    renderApp();
  }
};

function getSubjects() {
  const subjectMap = new Map();
  allData.filter(item => item.type === 'subject').forEach(subject => {
    subjectMap.set(subject.subject_id, subject);
  });
  return Array.from(subjectMap.values());
}

function getSetsForSubject(subjectId) {
  const setMap = new Map();
  allData.filter(item => item.type === 'set' && item.subject_id === subjectId).forEach(set => {
    setMap.set(set.set_id, set);
  });
  return Array.from(setMap.values());
}

function getCardsForSet(setId) {
  return allData.filter(item => item.type === 'card' && item.set_id === setId);
}

function renderApp() {
  const app = document.getElementById("app");
  let content = "";

  if (currentView === "home") {
    content = renderHomeView();
  } else if (currentView === "browse") {
    content = renderBrowseView();
  } else if (currentView === "browse-study") {
    content = renderBrowseStudyView();
  } else if (currentView === "browse-quiz") {
    content = renderBrowseQuizView();
  } else if (currentView === "browse-cards") {
    content = renderBrowseCardsView();
  } else if (currentView === "themes") {
    content = renderThemesView();
  } else if (currentView === "teacher") {
    content = renderTeacherView();
  } else if (currentView === "student") {
    content = renderStudentView();
  } else if (currentView === "student-score-history") {
    content = renderStudentScoreHistoryView();
  } else if ( currentView === "teacher-quiz-list") {
    content = renderTeacherQuizListView();
  } else if (currentView === "teacher-quiz") {
    content = renderTeacherQuizView();
  } else if (currentView === "teacher-quiz-result") {
    content = renderTeacherQuizResultView();
  } else if (currentView === "teacher-view-scores") {
    content = renderTeacherViewScores();
    setTimeout(() => populateTeacherStudentScores(window._teacherSelectedQuizId), 0);
  } else if (currentView === "subjects") {
    content = renderSubjectsView();
  } else if (currentView === "sets") {
    content = renderSetsView();
  } else if (currentView === "cards") {
    content = renderCardsView();
  } else if (currentView === "study") {
    content = renderStudyView();
  } else if (currentView === "quiz") {
    content = renderQuizView();
  } else if (currentView === "quiz-result") {
    content = renderQuizResultView();
  } else if (currentView === "customize") {
    content = renderCustomizationPanel();
  }

  app.innerHTML = content;

  if (currentView === "teacher") bindTeacherViewEvents();

  attachEventListeners();

  if (currentView === "quiz") updateTimerUI();

  if (currentView === "student-score-history") {
    populateStudentScores();
  }

  if (currentView === "cards" || currentView === "browse-cards") {
    attachCardsViewListeners();
  }

  const showBottomNav = ["home", "browse", "themes"].includes(currentView);
  document.body.classList.toggle("bottom-nav-visible", showBottomNav);

  if (showBottomNav) {
    app.innerHTML += renderBottomNav();
  }
}


function renderSubjectsView() {
  const subjects = getSubjects();

  const subjectsHTML = subjects.map(subject => {
    const sets = getSetsForSubject(subject.subject_id);

    return `
      <div class="category-card relative p-4 rounded-2xl shadow-sm bg-white flex flex-col items-center text-center"
           data-subject-id="${subject.subject_id}">

        <button
          class="delete-subject-btn absolute top-2 right-2 text-gray-500 hover:text-red-500"
          data-subject-id="${subject.subject_id}"
          aria-label="Delete subject"
        >
          ×
        </button>

        <div class="category-icon mb-3 w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 text-2xl">
          ${subject.subject_icon}
        </div>

        <div class="category-meta">
          <h2 class="category-title text-lg font-semibold mb-1">${subject.subject_name}</h2>
          <p class="category-subtitle text-sm text-gray-500">
            ${sets.length} set${sets.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
    `;
  }).join("");

  return `
    <div class="subjects-view w-full h-full overflow-auto p-4">
      <div class="max-w-4xl mx-auto">

        <button id="backToHomeBtn" class="mb-4 px-4 py-2 rounded-lg"
                style="background: var(--card-bg); color: var(--text); font-size: var(--font-size);">
          ← Back
        </button>

        <div class="subjects-hero mb-6 text-center">
          <h1 class="subjects-title">${config.app_title || defaultConfig.app_title}</h1>
          <p class="subjects-subtitle text-gray-500 mt-1">${config.app_subtitle || defaultConfig.app_subtitle}</p>
        </div>

        <div class="subjects-actions mb-6 text-center">
          <button id="addSubjectBtn" class="px-4 py-2 rounded-xl shadow-md"
                  style="color: var(--primary); font-size: calc(var(--font-size) * 1.1); background: var(--card-bg); box-shadow: 0 4px 12px rgba(37,99,235,0.3);">
            + Add New Subject
          </button>
        </div>

        ${subjects.length === 0
          ? `<div class="subjects-empty text-center text-gray-500 py-12">
               No subjects yet. Create your first subject to get started!
             </div>`
          : `<div class="subjects-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
               ${subjectsHTML}
             </div>`
        }

      </div>
    </div>
  `;
}


function openSubject(subjectId) {
  currentSubjectId = subjectId;
  currentSubject = getSubjects().find(s => s.subject_id === subjectId);
  currentSet = null; 
  currentView = "sets";
  renderApp();
}


function renderSetsView() {
  if (!currentSubject || !currentSubject.subject_id) {
    currentView = 'subjects';
    renderApp();
    return '';
  }

  const sets = getSetsForSubject(currentSubject.subject_id);
  const subtitleColor = config.secondary_color || defaultConfig.secondary_color;

  const setsHTML = sets.map(set => {
    const cards = getCardsForSet(set.set_id);
    return `
      <div class="category-card p-6 rounded-2xl" data-set-id="${set.set_id}" 
           style="background: var(--card-bg); box-shadow: 0 4px 12px rgba(0,0,0,0.08); position: relative;">
        
        <button class="delete-set-btn" data-set-id="${set.set_id}" 
                style="position: absolute; top: 0.75rem; right: 0.75rem; color: ${subtitleColor}; font-size: calc(var(--font-size) * 1.2);
                       background: none; border: none; cursor: pointer; padding: 0.25rem; line-height: 1;">
          ×
        </button>

        <h3 style="font-size: calc(var(--font-size) * 1.3); font-weight: 500; color: var(--text); margin-bottom: 0.5rem;">
          ${set.set_name}
        </h3>
        <p style="font-size: calc(var(--font-size) * 0.875); color: ${subtitleColor};">
          ${cards.length} card${cards.length !== 1 ? 's' : ''}
        </p>

        ${cards.length > 0 ? `
          <button class="study-set-btn mt-4 px-4 py-2 rounded-lg" data-set-id="${set.set_id}" 
                  style="background: var(--primary); color: white; font-size: calc(var(--font-size) * 0.875);">
            Study Now
          </button>` : ''}
      </div>
    `;
  }).join('');

  return `
    <div class="w-full h-full overflow-auto">
      <div class="min-h-full flex flex-col p-6">
        <div class="max-w-4xl w-full mx-auto">

          <!-- Header -->
                <div class="mb-4">
        <button id="backToSubjectsBtn" class="px-4 py-2 rounded-lg"
                style="background: var(--card-bg); color: var(--text); font-size: var(--font-size);">
          ← Back
        </button>
      </div>

      <!-- Centered Title + Icon -->
      <div class="text-center mb-8 slide-in">
        <div style="font-size: calc(var(--font-size) * 2); margin-bottom: 0.25rem;">
          ${currentSubject.subject_icon}
        </div>
        <h2 style="font-size: calc(var(--font-size) * 1.8); font-weight: 500; color: var(--text);">
          ${currentSubject.subject_name}
        </h2>
      </div>

          <!-- Add Set Button -->
          <div class="mb-6">
            <button id="addSetBtn" class="w-full py-4 rounded-xl transition-all font-semibold"
                    style="background: var(--primary); color: white; font-size: calc(var(--font-size) * 1.1); box-shadow: 0 4px 12px rgba(37,99,235,0.3);">
              + Add New Set
            </button>
          </div>

          <!-- Sets Grid -->
          ${sets.length === 0 ? `
            <div class="text-center py-12" style="color: ${subtitleColor}; font-size: calc(var(--font-size) * 1.2);">
              No sets yet. Create your first set!
            </div>
          ` : `<div class="grid grid-cols-1 md:grid-cols-2 gap-6">${setsHTML}</div>`}
        </div>
      </div>
    </div>
  `;
}

function openSet(setId) {
  if (!currentSubject) return;
  const sets = getSetsForSubject(currentSubject.subject_id);
  currentSet = sets.find(s => s.set_id === setId);
  currentView = "cards";
  renderApp();
}

function renderCardsView() {
  // If no set is selected, go back to sets view
  if (!currentSet || !currentSet.set_id) {
    currentView = "sets";
    renderApp();
    return "";
  }

  const cards = getCardsForSet(currentSet.set_id);

  const cardsHTML = cards.map(card => `
    <div class="card-item p-4 rounded-xl shadow-sm relative" style="background: var(--card-bg);">

      <button
        class="card-delete-btn absolute top-2 right-2"
        data-id="${card.id}"
        aria-label="Delete card"
        style="background:none; border:none; cursor:pointer;"
      >
        <img src="icons/delete.svg" class="icon sm" />
      </button>

      <div class="card-section mt-2">
        <p class="card-label font-semibold">Question</p>
        <p class="card-text card-question">${card.question}</p>
      </div>

      <div class="card-section mt-2">
        <p class="card-label font-semibold">Answer</p>
        <p class="card-text card-answer">${card.answer}</p>
      </div>
    </div>
  `).join("");

  return `
    <div class="view-container w-full h-full overflow-auto">
      <div class="view-content max-w-4xl mx-auto p-6">
        <div class="view-inner">
              <div class="mb-4">
        <button id="backToSetsBtn"
                class="px-4 py-2 rounded-lg"
                style="background: var(--card-bg); color: var(--text); font-size: var(--font-size);">
          ← Back
        </button>
      </div>

      <!-- HEADER CENTERED -->
      <div class="text-center mb-6 slide-in">
        <h2 class="text-xl font-semibold">${currentSet.set_name}</h2>
        <p class="text-sm opacity-70">${cards.length} card${cards.length !== 1 ? "s" : ""}</p>
      </div>

          <!-- ACTIONS -->
          <div class="cards-actions">
          <div class="actions-inner">
            <button id="addCardBtn" class="action-btn">
              <img src="icons/add.svg" class="icon md" /> Add
            </button>

            <button id="aiGenerateBtn" class="action-btn">
              <img src="icons/ai.svg" class="icon md" /> AI
            </button>

            <button id="importCardsJsonBtn" class="action-btn">
              <img src="icons/import.svg" class="icon md" /> Import
            </button>

            ${cards.length > 0 ? `
              <button id="studyCardsBtn" class="action-btn">
                <img src="icons/flashcard.svg" class="icon md" /> Study
              </button>` : ""}

            ${cards.length > 1 ? `
              <button id="quizCardsBtn" class="action-btn">
                <img src="icons/quiz.svg" class="icon md" /> Quiz
              </button>` : ""}
              </div>
          </div>

          <!-- EMPTY STATE / LIST -->
          ${cards.length === 0 ? `
            <div class="cards-empty text-center py-12 text-gray-500">
              <p class="text-lg">No cards yet. Add your first flashcard!</p>
            </div>` : `
            <div class="cards-list grid grid-cols-1 md:grid-cols-2 gap-6">
              ${cardsHTML}
            </div>`}

        </div>
      </div>
    </div>
  `;
}

function attachCardsViewListeners() {
  const addCardBtn = document.getElementById('addCardBtn');
  if (addCardBtn) {
    addCardBtn.addEventListener('click', () => {
      showAddCardModal(); // Opens your modal to add a card
    });
  }

  const aiGenerateBtn = document.getElementById('aiGenerateBtn');
  if (aiGenerateBtn) {
    aiGenerateBtn.addEventListener('click', () => {
      showAIGenerateModal(); // Opens AI card generation modal
    });
  }

  const importCardsJsonBtn = document.getElementById('importCardsJsonBtn');
  if (importCardsJsonBtn) {
    importCardsJsonBtn.addEventListener('click', () => {
      importCardsFromJsonForCurrentSet(); // Handles JSON import
    });
  }

  const studyCardsBtn = document.getElementById('studyCardsBtn');
  if (studyCardsBtn) {
    studyCardsBtn.addEventListener('click', () => {
      currentCardIndex = 0;
      isFlipped = false;
      currentView = 'study';
      renderApp();
    });
  }

  const quizCardsBtn = document.getElementById('quizCardsBtn');
  if (quizCardsBtn) {
    quizCardsBtn.addEventListener('click', () => {
      const cards = getCardsForSet(currentSet.set_id);
      quizQuestions = generateQuizQuestions(cards);
      quizIndex = 0;
      quizScore = 0;
      resetStudyTimer(); // if applicable
      currentView = 'quiz';
      renderApp();
    });

      const deleteCardBtns = document.querySelectorAll('.card-delete-btn');
  deleteCardBtns.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation(); // Prevent parent clicks
      const cardId = btn.dataset.id;

      btn.disabled = true;
      btn.innerHTML = '<span class="spinner" style="width:16px;height:16px;border-width:2px;"></span>';

      // Delete the card (replace with your actual delete logic)
      await window.dataSdk.delete({ id: cardId });

      // Re-render the cards view
      renderApp();
    });
  });
  }

  // Back button to sets
  const backToSetsBtn = document.getElementById('backToSetsBtn');
  if (backToSetsBtn) {
    backToSetsBtn.addEventListener('click', () => {
      currentSet = null;
      currentView = 'sets';
      renderApp();
    });
  }
}

function startStudyTimer() {
  if (studyTimer.running) return;

  stopStudyTimer(); // ✅ safety clear

  studyTimer.running = true;
  studyTimer.startTime = Date.now();

  studyTimer.interval = setInterval(() => {
    studyTimer.remaining--;

    if (studyTimer.remaining <= 0) {
      studyTimer.remaining = 0;
      stopStudyTimer();
      currentView = "quiz-result";
      renderApp();
      return;
    }

    updateTimerUI();
  }, 1000);
}



function stopStudyTimer() {
  clearInterval(studyTimer.interval);
  studyTimer.interval = null;
  studyTimer.running = false;
}

function resetStudyTimer() {
  stopStudyTimer();
  studyTimer.remaining = studyTimer.duration;
  
  updateTimerUI();
}


function updateTimerUI() {
  const el = document.getElementById("study-timer");
  if (!el) return;

  el.textContent = formatTime(studyTimer.remaining);

  const clock = document.getElementById("floating-timer");

if (studyTimer.remaining <= 60) {
  clock.style.background = config.primary_color;
  clock.style.color = "#fff";
} else {
  clock.style.background = config.card_background;
  clock.style.color = config.primary_color;
}

}



function applyTimerSettings() {
  if (studyTimer.running) {
    stopStudyTimer();
  }

  const h = parseInt(document.getElementById("timer-hours")?.value) || 0;
  const m = parseInt(document.getElementById("timer-minutes")?.value) || 0;

  const total = h * 3600 + m * 60;
  if (total <= 0) return;

  studyTimer.duration = total;
  studyTimer.remaining = total;
  localStorage.setItem("studyTimerDuration", total);

  updateTimerUI();
}



function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function toggleFloatingTimer() {
  const el = document.getElementById("floating-timer");
  if (!el) return;

  el.style.display =
    currentView === "quiz" || currentView === "study"
      ? "flex"
      : "none";
}


function renderStudyView() {
  const cards = getCardsForSet(currentSet.set_id);
  if (cards.length === 0) {
    currentView = 'cards';
    renderApp();
    return;
  }

  const card = cards[currentCardIndex];
  const subtitleColor = config.secondary_color || defaultConfig.secondary_color;
  const progress = ((currentCardIndex + 1) / cards.length) * 100;

  return `
        <div class="w-full h-full overflow-auto">
          <div class="min-h-full flex flex-col p-6">
            <div class="max-w-3xl w-full mx-auto flex flex-col" style="height: 100%;">
                                      <button id="backToCardsBtn" class="mb-4 px-4 py-2 rounded-lg" style="width:80px; background: var(--card-bg); color: var(--text); font-size: var(--font-size);">
                  ← Back
                </button>
<div class="flex flex-col items-center mb-6 slide-in text-center">
  <h2 style="font-size: calc(var(--font-size) * 1.5); font-weight: 400; color: var(--text);">
    ${currentSet.set_name}
  </h2>
<p style="opacity:0.8;font-size: calc(var(--font-size)*0.95); margin-top:4px;">
  <span style="color:var(--primary); font-weight:600;">${currentCardIndex + 1}</span>
  <span style="color: var(--text);"> / ${cards.length}</span>
</p>

</div>

              
              <div class="w-full rounded-full mb-6" style="background: rgba(0,0,0,0.1); height: 5px;">
                <div class="progress-bar h-full rounded-full" style="width: ${progress}%; background: var(--primary);"></div>
              </div>
              
              <div class="flex-1 flex items-center justify-center mb-6">
                <div class="card-3d w-full" style="max-width: 600px; height: 400px;">
                  <div id="cardInner" class="card-inner">
                    <div class="card-front" style="background: var(--card-bg); box-shadow: 0 8px 24px rgba(0,0,0,0.12);">
                      <div class="text-center">
                        <p style="font-size: calc(var(--font-size) * 1);

 color: var(--primary); font-weight: 400; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 1rem;">Question</p>
                        <p style="font-size: calc(var(--font-size) * 1.75);

 color: var(--text); font-weight: 400; line-height: 1.6;">${card.question}</p>
                      </div>
                    </div>
                    <div class="card-back" style="background: var(--primary);">
                      <div class="text-center">
                        <p style="font-size: calc(var(--font-size) * 1);

 color: rgba(255,255,255,0.9); font-weight: 400; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 1rem;">Answer</p>
                        <p style="font-size: calc(var(--font-size) * 1.75);

 color: white; font-weight: 400; line-height: 1.6;">${card.answer}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="flex flex-col gap-4">
                <button id="flipBtn" class="w-full py-4 rounded-xl transition-all font-semibold" style="background: var(--primary); color: white; font-size: calc(var(--font-size) * 1.1);
 box-shadow: 0 4px 12px rgba(37,99,235,0.3);">
                  Flip Card
                </button>
                
                <div class="flex gap-4">
                  <button id="prevBtn" class="flex-1 py-3 rounded-xl transition-all" style="background: var(--card-bg); color: var(--text); font-size: var(--font-size);
 box-shadow: 0 2px 8px rgba(0,0,0,0.08); opacity: ${currentCardIndex === 0 ? '0.5' : '1'}; cursor: ${currentCardIndex === 0 ? 'not-allowed' : 'pointer'};" ${currentCardIndex === 0 ? 'disabled' : ''}>
                    ← Previous
                  </button>
                  <button id="nextBtn" class="flex-1 py-3 rounded-xl transition-all" style="background: var(--card-bg); color: var(--text); font-size: var(--font-size);
 box-shadow: 0 2px 8px rgba(0,0,0,0.08); opacity: ${currentCardIndex === cards.length - 1 ? '0.5' : '1'}; cursor: ${currentCardIndex === cards.length - 1 ? 'not-allowed' : 'pointer'};" ${currentCardIndex === cards.length - 1 ? 'disabled' : ''}>
                    Next →
                  </button>
                </div>
            </div>
          </div>
        </div>
      `;
}

function generateQuizQuestions(cards) {
  return cards.map(card => {
    const wrongAnswers = cards
      .filter(c => c.answer !== card.answer)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(c => c.answer);

    const options = [...wrongAnswers, card.answer]
      .sort(() => 0.5 - Math.random());

    return {
      question: card.question,
      correct: card.answer,
      options
    };
  });
}

function toggleTimerVisibility() {
  timerHidden = !timerHidden;
  renderApp();
}

function renderQuizView() {
  const q = quizQuestions[quizIndex];
  const progress = ((quizIndex + 1) / quizQuestions.length) * 100;

  const primary = config.primary_color;
  const bg = config.card_background;
  const text = config.text_color;
  const sub = config.secondary_color;

  return `
    <div class="w-full h-full overflow-auto">
      <div class="min-h-full flex flex-col p-5">
        <div class="max-w-3xl w-full mx-auto fade-in">

          <!-- Header -->
          <div class="flex items-center justify-between mb-4">
            <button id="exitQuizBtn"
              class="px-4 py-2 rounded-lg text-sm"
              style="background:${bg};color:${text}; box-shadow:0 2px 8px rgba(0,0,0,.08);">
              ← Exit
            </button>

            <!-- Timer Pill -->
            <div id="floating-timer"
              style="
                position:fixed;
                top:16px;
                right:16px;
                z-index:1000;
                width:80px;
                height:80px;
                border-radius:50%;
                background:${bg};
                box-shadow:0 10px 30px rgba(0,0,0,.2);
                display:${timerHidden ? "none" : "flex"};
                align-items:center;
                justify-content:center;
                flex-direction:column;
                font-weight:700;
                color:${primary};
              "
            >
              <div style="font-size:1.2rem;">⏱</div>
              <div id="study-timer" style="font-size:1.2rem; margin-top:4px; letter-spacing:1px;">
                ${formatTime(studyTimer.remaining)}
              </div>
            </div>

            <div class="text-right text-sm">
              <p style="color:${sub};">Q ${quizIndex + 1} / ${quizQuestions.length}</p>
              <p style="color:${primary}; font-weight:600;">⭐ ${quizScore}</p>
            </div>
          </div>

          <!-- Dropdown to show/hide timer controls -->
          <div class="mb-4 text-center">
            <label for="timerControlDropdown" style="margin-right:8px; font-weight:500;">Timer Controls:</label>
            <select id="timerControlDropdown" onchange="toggleTimerControls(this.value)" style="padding:6px 12px; border-radius:8px; border:1px solid #ccc;">
              <option value="show" ${showTimerControls ? "selected" : ""}>Show</option>
              <option value="hide" ${!showTimerControls ? "selected" : ""}>Hide</option>
            </select>
                        <button id="toggleTimerBtn" onclick="toggleTimerVisibility()" style="padding:10px 16px; border-radius:10px; background:${bg}; color:${text}; font-weight:500; box-shadow:0 2px 6px rgba(0,0,0,.05); transition:0.2s;">
              ${timerHidden ? "Show Timer" : "Hide Timer"}
            </button>
          </div>

          <!-- Timer Controls Card (Responsive) -->
          <div id="timerControlsContainer" style="display:${showTimerControls ? "flex" : "none"}; flex-wrap:wrap; gap:8px; align-items:center; justify-center; margin:0 auto 20px; padding:16px; border-radius:16px; background:${bg}; box-shadow:0 4px 14px rgba(0,0,0,.08); max-width:420px;">
            <!-- Timer Inputs -->
            <input type="number" id="timer-hours" min="0" placeholder="H" style="width:60px; padding:8px; border-radius:8px; border:1px solid #ccc; text-align:center;" />
            <input type="number" id="timer-minutes" min="0" max="59" placeholder="M" style="width:60px; padding:8px; border-radius:8px; border:1px solid #ccc; text-align:center;" />

            <!-- Action Buttons -->
            <button onclick="applyTimerSettings()" style="padding:10px 16px; border-radius:10px; background:${primary}; color:white; font-weight:500; box-shadow:0 2px 6px rgba(0,0,0,.1); transition:0.2s;">Set</button>
            <button onclick="startStudyTimer()" style="padding:10px 16px; border-radius:10px; background:rgba(0,0,0,.08); color:${text}; font-weight:500; box-shadow:0 2px 6px rgba(0,0,0,.05); transition:0.2s;">▶ Start</button>
            <button onclick="stopStudyTimer()" style="padding:10px 16px; border-radius:10px; background:rgba(0,0,0,.08); color:${text}; font-weight:500; box-shadow:0 2px 6px rgba(0,0,0,.05); transition:0.2s;">⏸ Pause</button>
          </div>

          <!-- Progress -->
          <div class="w-full h-2 rounded-full mb-6" style="background:rgba(0,0,0,.12);">
            <div class="h-full rounded-full" style="width:${progress}%; background:${primary}; transition:width .3s;"></div>
          </div>

          <!-- Question -->
          <div class="p-6 rounded-2xl mb-8" style="background:${bg}; box-shadow:0 10px 28px rgba(0,0,0,.12);">
            <h2 style="font-size:calc(var(--font-size) * 1.5); color:${text}; line-height:1.6;">
              ${q.question}
            </h2>
          </div>

          <!-- Options -->
          <div class="grid gap-4">
            ${q.options.map(opt => `
              <button type="button" class="quiz-option" data-answer="${opt}" style="
                padding:16px;
                border-radius:var(--radius);
                background:${bg};
                color:${text};
                font-size:var(--font-size);
                box-shadow:0 4px 12px rgba(0,0,0,.08);
                transition:transform .15s, box-shadow .15s;
              ">${opt}</button>
            `).join("")}
          </div>

        </div>
      </div>
    </div>
  `;
}

function toggleTimerControls(value) {
  showTimerControls = value === "show";
  const container = document.getElementById("timerControlsContainer");
  if (container) container.style.display = showTimerControls ? "flex" : "none";
  renderApp();
}


function renderQuizResultView() {
  const primary = config.primary_color;
  const bg = config.card_background;
  const text = config.text_color;

  return `
    <div class="w-full h-full flex items-center justify-center p-6 fade-in">
      <div class="max-w-md w-full p-8 rounded-2xl text-center"
           style="background:${bg};box-shadow:0 10px 30px rgba(0,0,0,.15);">

        <h2 style="font-size:calc(var(--font-size) * 2);

color:${text};margin-bottom:12px;">
          Quiz Complete 🎉
        </h2>

        <p style="font-size:calc(var(--font-size) * 1.2);
color:${text};margin-bottom:24px;">
          Your score
        </p>
        
        <div class="quiz-result-score"
        style="
        font-size:calc(var(--font-size) * 3);
        font-weight:700;
        color:${primary};
        margin-bottom:32px;
        ">
        ${quizScore} / ${quizQuestions.length}
        </div>

        <button id="exitQuizBtn"
          class="w-full py-4 rounded-xl font-semibold"
          style="background:${primary};color:white;">
          Back to Cards
        </button>
      </div>
    </div>
  `;
}


function exitQuizBtn() {
  stopStudyTimer();
  resetStudyTimer();
  currentView = "home";
  renderApp();
}


function showAddSubjectModal() {
  const subtitleColor = config.secondary_color || defaultConfig.secondary_color;
  const primaryColor = config.primary_color || defaultConfig.primary_color;

  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
        <div class="modal-content" style="background: var(--card-bg); padding: 2rem;">
          <h2 style="font-size:calc(var(--font-size) * 1.8);
 font-weight: 400; color: var(--text); margin-bottom: 1.5rem;">Add New Subject</h2>
          
          <form id="addSubjectForm">
            <div style="margin-bottom: 1.5rem;">
              <label style="display: block; font-size: calc(var(--font-size) * 0.875);
 font-weight: 400; color: var(--text); margin-bottom: 0.5rem;">Subject Name</label>
              <input type="text" id="subjectNameInput" required style="width: 100%; padding: 0.75rem; border: 2px solid #e2e8f0; border-radius: var(--radius); font-size: var(--font-size);
 color: var(--text);" placeholder="e.g., Biology, History...">
            </div>

            <div style="margin-bottom: 1.5rem;">
              <label style="display: block; font-size: calc(var(--font-size) * 0.875);
 font-weight: 400; color: var(--text); margin-bottom: 0.5rem;">Choose Icon</label>
              <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.5rem;">
                ${emojiOptions.map((emoji, idx) => `
                  <button type="button" class="emoji-btn" data-emoji="${emoji}" style="padding: 0.75rem; border: 2px solid ${idx === 0 ? primaryColor : '#e2e8f0'}; border-radius: var(--radius); font-size: calc(var(--font-size) * 1.5);
 cursor: pointer; background: var(--card-bg); transition: all 0.2s;">
                    ${emoji}
                  </button>
                `).join('')}
              </div>
              <input type="hidden" id="selectedEmoji" value="${emojiOptions[0]}">
            </div>

            <div style="display: flex; gap: 1rem;">
              <button type="button" id="cancelSubjectBtn" style="flex: 1; padding: 0.75rem; border-radius: var(--radius); font-size: var(--font-size);
 background: #e2e8f0; color: var(--text); border: none; cursor: pointer;">
                Cancel
              </button>
              <button type="submit" id="submitSubjectBtn" style="flex: 1; padding: 0.75rem; border-radius: var(--radius); font-size: var(--font-size);
 background: var(--primary); color: white; border: none; cursor: pointer; font-weight: 400;">
                <span id="submitSubjectText">Add Subject</span>
              </button>
            </div>
          </form>
        </div>
      `;

  document.body.appendChild(modal);

  const emojiButtons = modal.querySelectorAll('.emoji-btn');
  const selectedEmojiInput = modal.querySelector('#selectedEmoji');

  emojiButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      emojiButtons.forEach(b => b.style.borderColor = '#e2e8f0');
      btn.style.borderColor = primaryColor;
      selectedEmojiInput.value = btn.dataset.emoji;
    });
  });

  modal.querySelector('#cancelSubjectBtn').addEventListener('click', () => {
    modal.remove();
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });

  modal.querySelector('#addSubjectForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    if (allData.filter(d => d.type === 'subject').length >= 999) {
      showToast('Maximum limit of 999 subjects reached');
      return;
    }

    const submitBtn = modal.querySelector('#submitSubjectBtn');
    const submitText = modal.querySelector('#submitSubjectText');
    submitBtn.disabled = true;
    submitText.innerHTML = '<span class="spinner"></span>';

    const subjectName = modal.querySelector('#subjectNameInput').value;
    const subjectIcon = selectedEmojiInput.value;
    const subjectId = 'subj_' + Date.now();

    const result = await window.dataSdk.create({
      type: 'subject',
      subject_id: subjectId,
      subject_name: subjectName,
      subject_icon: subjectIcon,
      set_id: '',
      set_name: '',
      question: '',
      answer: '',
      created_at: new Date().toISOString()
    });

    if (result.isOk) {
      modal.remove();
      renderApp();
    }
    else {
      submitBtn.disabled = false;
      submitText.textContent = 'Add Subject';
      showToast('Failed to add subject. Please try again.');
    }
  });
}

function importCardsFromJsonForCurrentSet() {
  if (!currentSet?.set_id) {
    showToast('No set selected');
    return;
  }

  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json';

  input.addEventListener('change', async () => {
    const file = input.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const json = JSON.parse(text);

      if (!Array.isArray(json.cards)) {
        throw new Error('Invalid format');
      }

      for (const card of json.cards) {
        if (!card.question || !card.answer) continue;

        await window.dataSdk.create({
          type: 'card',
          subject_id: '',
          subject_name: '',
          subject_icon: '',
          set_id: currentSet.set_id,
          set_name: '',
          question: card.question,
          answer: card.answer,
          created_at: new Date().toISOString()
        });
      }

      showToast(`Imported ${json.cards.length} cards`);
    } catch (err) {
      console.error(err);
      showToast('Invalid JSON file');
    }
  });

  input.click();
}

function showAddSetModal() {


  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
        <div class="modal-content" style="background: var(--card-bg); padding: 2rem;">
          <h2 style="font-size:calc(var(--font-size) * 1.8);
 font-weight: 400; color: var(--text); margin-bottom: 1.5rem;">Add New Set</h2>
          
          <form id="addSetForm">
            <div style="margin-bottom: 1.5rem;">
              <label for="setNameInput" style="display: block; font-size: calc(var(--font-size) * 0.875);
 font-weight: 400; color: var(--text); margin-bottom: 0.5rem;">Set Name</label>
              <input type="text" id="setNameInput" required style="width: 100%; padding: 0.75rem; border: 2px solid #e2e8f0; border-radius: var(--radius); font-size: var(--font-size);
 color: var(--text);" placeholder="e.g., Chapter 1, Vocabulary...">
            </div>

            <div style="display: flex; gap: 1rem;">
              <button type="button" id="cancelSetBtn" style="flex: 1; padding: 0.75rem; border-radius: var(--radius); font-size: var(--font-size);
 background: #e2e8f0; color: var(--text); border: none; cursor: pointer;">
                Cancel
              </button>
              <button type="submit" id="submitSetBtn" style="flex: 1; padding: 0.75rem; border-radius: var(--radius); font-size: var(--font-size);
 background: var(--primary); color: white; border: none; cursor: pointer; font-weight: 400;">
                <span id="submitSetText">Add Set</span>
              </button>
            </div>
          </form>
        </div>
      `;

  document.body.appendChild(modal);

  modal.querySelector('#cancelSetBtn').addEventListener('click', () => {
    modal.remove();
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });

  modal.querySelector('#addSetForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    if (allData.filter(d => d.type === 'set').length >= 999) {
      showToast('Maximum limit of 999 sets reached');
      return;
    }

    const submitBtn = modal.querySelector('#submitSetBtn');
    const submitText = modal.querySelector('#submitSetText');
    submitBtn.disabled = true;
    submitText.innerHTML = '<span class="spinner"></span>';

    const setName = modal.querySelector('#setNameInput').value;
    const setId = 'set_' + Date.now();

    const result = await window.dataSdk.create({
      type: 'set',
      subject_id: currentSubject.subject_id,
      subject_name: '',
      subject_icon: '',
      set_id: setId,
      set_name: setName,
      question: '',
      answer: '',
      created_at: new Date().toISOString()
    });

    if (result.isOk) {
      modal.remove();
    } else {
      submitBtn.disabled = false;
      submitText.textContent = 'Add Set';
      showToast('Failed to add set. Please try again.');
    }
  });
}

function showAddCardModal() {

  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
        <div class="modal-content" style="background: var(--card-bg); padding: 2rem;">
          <h2 style="font-size:calc(var(--font-size) * 1.8);
 font-weight: 400; color: var(--text); margin-bottom: 1.5rem;">Add New Card</h2>
          
          <form id="addCardForm">
            <div style="margin-bottom: 1.5rem;">
              <label for="questionInput" style="display: block; font-size: calc(var(--font-size) * 0.875);
 font-weight: 400; color: var(--text); margin-bottom: 0.5rem;">Question</label>
              <textarea id="questionInput" required rows="3" style="width: 100%; padding: 0.75rem; border: 2px solid #e2e8f0; border-radius: var(--radius); font-size: var(--font-size);
 color: var(--text); resize: vertical;" placeholder="Enter the question..."></textarea>
            </div>

            <div style="margin-bottom: 1.5rem;">
              <label for="answerInput" style="display: block; font-size: calc(var(--font-size) * 0.875);
 font-weight: 400; color: var(--text); margin-bottom: 0.5rem;">Answer</label>
              <textarea id="answerInput" required rows="3" style="width: 100%; padding: 0.75rem; border: 2px solid #e2e8f0; border-radius: var(--radius); font-size: var(--font-size);
 color: var(--text); resize: vertical;" placeholder="Enter the answer..."></textarea>
            </div>

            <div style="display: flex; gap: 1rem;">
              <button type="button" id="cancelCardBtn" style="flex: 1; padding: 0.75rem; border-radius: var(--radius); font-size: var(--font-size);
 background: #e2e8f0; color: var(--text); border: none; cursor: pointer;">
                Cancel
              </button>
              <button type="submit" id="submitCardBtn" style="flex: 1; padding: 0.75rem; border-radius: var(--radius); font-size: var(--font-size);
 background: var(--primary); color: white; border: none; cursor: pointer; font-weight: 400;">
                <span id="submitCardText">Add Card</span>
              </button>
            </div>
          </form>
        </div>
      `;

  document.body.appendChild(modal);

  modal.querySelector('#cancelCardBtn').addEventListener('click', () => {
    modal.remove();
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });

  modal.querySelector('#addCardForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    if (allData.filter(d => d.type === 'card').length >= 999) {
      showToast('Maximum limit of 999 cards reached');
      return;
    }

    const submitBtn = modal.querySelector('#submitCardBtn');
    const submitText = modal.querySelector('#submitCardText');
    submitBtn.disabled = true;
    submitText.innerHTML = '<span class="spinner"></span>';

    const question = modal.querySelector('#questionInput').value;
    const answer = modal.querySelector('#answerInput').value;

    const result = await window.dataSdk.create({
      type: 'card',
      subject_id: currentSubject.subject_id,
      subject_name: currentSubject.subject_name,
      subject_icon: currentSubject.subject_icon,
      set_id: currentSet.set_id,
      set_name: currentSet.set_name,
      question: question,
      answer: answer,
      created_at: new Date().toISOString()
    });


    if (result.isOk) {
      modal.remove();
    } else {
      submitBtn.disabled = false;
      submitText.textContent = 'Add Card';
      showToast('Failed to add card. Please try again.');
    }
  });
}

async function generateCardsWithAI(topic, count) {
  if (!navigator.onLine) {
    showToast("AI generation requires internet");
    return;
  }

  if (!currentSet?.set_id) {
    showToast("No set selected");
    return false;
  }

  showAILoading();

  try {
    const res = await fetch(AI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, count })
    });

    if (!res.ok) {
      throw new Error(`API request failed with status ${res.status}`);
    }

    const json = await res.json();

    if (!Array.isArray(json.cards)) {
      throw new Error("Invalid AI response");
    }

    // Create all cards sequentially
    for (const card of json.cards) {
      const result = await window.dataSdk.create({
        type: "card",
        subject_id: currentSubject?.subject_id || "",
        subject_name: currentSubject?.subject_name || "",
        subject_icon: currentSubject?.subject_icon || "",
        set_id: currentSet.set_id,
        set_name: currentSet.set_name || "",
        question: card.question,
        answer: card.answer,
        created_at: new Date().toISOString()
      });

      if (result.isError) {
        throw new Error("Failed to create card");
      }
    }

    // UI update happens in onDataChanged when data changes are detected
    hideAILoading();
    showToast(`Successfully generated ${json.cards.length} cards`);
    return true;

  } catch (error) {
    hideAILoading();
    showToast("Failed to generate cards. Please try again.");
    console.error("AI generation error:", error);
    return false;
  }
}

function showAIGenerateModal() {
  if (document.querySelector(".modal-overlay")) return;

  const modal = document.createElement("div");
  modal.className = "modal-overlay";

  modal.innerHTML = `
    <div class="modal">
      <h2>Generate Cards with AI</h2>

      <label>
        Topic
        <input id="aiTopicInput" type="text" placeholder="e.g. Photosynthesis" />
      </label>

      <label>
        Number of cards
        <input id="aiCountInput" type="number" min="1" max="50" value="10" />
      </label>

      <div class="modal-actions">
        <button class="btn btn-secondary" id="cancelAIModal">Cancel</button>
        <button class="btn btn-primary" id="confirmAIModal">
          Generate
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  modal.querySelector("#aiTopicInput").focus();

  modal.querySelector("#cancelAIModal").onclick = () => modal.remove();

  modal.addEventListener("click", e => {
    if (e.target === modal) modal.remove();
  });

  modal.querySelector("#confirmAIModal").onclick = async () => {
    const btn = modal.querySelector("#confirmAIModal");
    btn.disabled = true;
    btn.textContent = "Generating...";

    const topic = modal.querySelector("#aiTopicInput").value.trim();
    const count = Math.min(
      50,
      Math.max(1, parseInt(modal.querySelector("#aiCountInput").value, 10))
    );

    if (!topic) {
      showToast("Please enter a topic");
      btn.disabled = false;
      btn.textContent = "Generate";
      return;
    }

    modal.remove();
    await generateCardsWithAI(topic, count);
  };
}




async function loadAllData() {
  allData = window.dataSdk.getAll();
}

let aiLoadingEl = null;

function showAILoading() {
  document.getElementById("aiLoading")?.classList.add("show");
}

function hideAILoading() {
  document.getElementById("aiLoading")?.classList.remove("show");
}




function showToast(message) {

  // Try to reuse existing toast
  let toast = document.getElementById('toast');

  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }

  toast.textContent = message;

  toast.style.cssText = `
    position: fixed;
    top: 2rem;
    right: 2rem;
    background: #1e293b;
    color: white;
    padding: 1rem 1.5rem;
    border-radius: var(--radius);
    font-size: var(--font-size);

    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 2000;
    opacity: 0;
  `;

  // Show animation
  toast.classList.remove('show');
  void toast.offsetWidth; // force reflow
  toast.classList.add('show');

  // Auto-hide
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

function attachEventListeners() {
  // ---- BACK BUTTONS ----
  const backToHomeBtn = document.getElementById("backToHomeBtn");
  if (backToHomeBtn) {
    backToHomeBtn.onclick = () => {
      currentSet = null;
      currentCardIndex = 0;
      studyQueue = [];
      currentView = "home";
      renderApp();
    };
  }

  const backBtnTeacherQuiz = document.getElementById("backBtnTeacherQuiz");
  if (backBtnTeacherQuiz) {
    backBtnTeacherQuiz.onclick = () => {
      currentView = "home";
      renderApp();
    };
  }

  const backToSubjectsBtn = document.getElementById("backToSubjectsBtn");
  if (backToSubjectsBtn) {
    backToSubjectsBtn.onclick = () => {
      currentSubject = null;
      currentView = "subjects";
      renderApp();
    };
  }

  const backToSetsBtn = document.getElementById("backToSetsBtn");
  if (backToSetsBtn) {
    backToSetsBtn.onclick = () => {
      currentSet = null;
      currentView = "sets";
      renderApp();
    };
  }

  const backToCardsBtn = document.getElementById("backToCardsBtn");
  if (backToCardsBtn) {
    backToCardsBtn.onclick = () => {
      currentCardIndex = 0;
      isFlipped = false;
      currentView = "cards";
      renderApp();
    };
  }

  // ---- SUBJECT, SET, CARD ACTIONS ----
  const addSubjectBtn = document.getElementById("addSubjectBtn");
  if (addSubjectBtn) addSubjectBtn.onclick = showAddSubjectModal;

  const addSetBtn = document.getElementById("addSetBtn");
  if (addSetBtn) addSetBtn.onclick = showAddSetModal;

  const addCardBtn = document.getElementById("addCardBtn");
  if (addCardBtn) addCardBtn.onclick = showAddCardModal;

  const importCardsJsonBtn = document.getElementById("importCardsJsonBtn");
  if (importCardsJsonBtn) importCardsJsonBtn.onclick = importCardsFromJsonForCurrentSet;

  // Subject and Set cards
  document.querySelectorAll(".category-card").forEach(card => {
    card.onclick = e => {
      if (card.dataset.subjectId && !e.target.classList.contains("delete-subject-btn")) {
        const subjectId = card.dataset.subjectId;
        currentSubject = getSubjects().find(s => s.subject_id === subjectId);
        currentView = "sets";
        renderApp();
      }
      if (card.dataset.setId && !e.target.classList.contains("delete-set-btn") && !e.target.classList.contains("study-set-btn")) {
        const setId = card.dataset.setId;
        currentSet = getSetsForSubject(currentSubject.subject_id).find(s => s.set_id === setId);
        currentView = "cards";
        renderApp();
      }
    };
  });

  // Delete buttons
  document.querySelectorAll(".delete-subject-btn").forEach(btn => {
    btn.onclick = async e => {
      e.stopPropagation();
      const subjectId = btn.dataset.subjectId;
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner" style="width:16px;height:16px;border-width:2px;"></span>';
      const itemsToDelete = allData.filter(d =>
        (d.type === "subject" && d.subject_id === subjectId) ||
        (d.type === "set" && d.subject_id === subjectId) ||
        (d.type === "card" && allData.some(s => s.type === "set" && s.set_id === d.set_id && s.subject_id === subjectId))
      );
      for (const item of itemsToDelete) await window.dataSdk.delete({ id: item.id }, true);
      window.dataSdk.init(dataHandler);
      if (currentSubject?.subject_id === subjectId) {
        currentSubject = null;
        currentView = "subjects";
      }
    };
  });

  document.querySelectorAll(".delete-set-btn").forEach(btn => {
    btn.onclick = async e => {
      e.stopPropagation();
      const setId = btn.dataset.setId;
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner" style="width:16px;height:16px;border-width:2px;"></span>';
      const itemsToDelete = allData.filter(d => (d.type === "set" && d.set_id === setId) || (d.type === "card" && d.set_id === setId));
      for (const item of itemsToDelete) await window.dataSdk.delete({ id: item.id });
      renderApp();
    };
  });

  document.querySelectorAll(".delete-card-btn").forEach(btn => {
    btn.onclick = async e => {
      e.stopPropagation();
      const id = btn.dataset.id;
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner" style="width:16px;height:16px;border-width:2px;"></span>';
      await window.dataSdk.delete({ id });
      renderApp();
    };
  });

  // Study Set buttons
  document.querySelectorAll(".study-set-btn").forEach(btn => {
    btn.onclick = e => {
      e.stopPropagation();
      const setId = btn.dataset.setId;
      currentSet = getSetsForSubject(currentSubject.subject_id).find(s => s.set_id === setId);
      currentCardIndex = 0;
      isFlipped = false;
      currentView = "study";
      renderApp();
    };
  });

  // Study / Quiz buttons
  const studyCardsBtn = document.getElementById("studyCardsBtn");
  if (studyCardsBtn) studyCardsBtn.onclick = () => {
    currentCardIndex = 0;
    isFlipped = false;
    currentView = "study";
    renderApp();
  };

  const quizCardsBtn = document.getElementById("quizCardsBtn");
  if (quizCardsBtn) quizCardsBtn.onclick = () => {
    const cards = getCardsForSet(currentSet.set_id);
    quizQuestions = generateQuizQuestions(cards);
    quizIndex = 0;
    quizScore = 0;
    resetStudyTimer();
    currentView = "quiz";
    renderApp();
  };

  // Flip / Next / Prev card buttons
  const flipBtn = document.getElementById("flipBtn");
  if (flipBtn) flipBtn.onclick = () => {
    const cardInner = document.getElementById("cardInner");
    isFlipped = !isFlipped;
    cardInner?.classList.toggle("flipped", isFlipped);
  };

  const prevBtn = document.getElementById("prevBtn");
  if (prevBtn) prevBtn.onclick = () => {
    if (currentCardIndex > 0) {
      currentCardIndex--;
      isFlipped = false;
      renderApp();
    }
  };

  const nextBtn = document.getElementById("nextBtn");
  if (nextBtn) nextBtn.onclick = () => {
    const cards = getCardsForSet(currentSet?.set_id || []);
    if (currentCardIndex < cards.length - 1) {
      currentCardIndex++;
      isFlipped = false;
      renderApp();
    }
  };

  // AI Generate
  const aiGenerateBtn = document.getElementById("aiGenerateBtn");
  if (aiGenerateBtn) aiGenerateBtn.onclick = showAIGenerateModal;

  // Exit Quiz
  const exitQuizBtn = document.getElementById("exitQuizBtn");
  if (exitQuizBtn) exitQuizBtn.onclick = () => {
    stopStudyTimer();
    resetStudyTimer();
    currentView = "cards";
    renderApp();
  };

  // Quiz option buttons
  if (currentView === "quiz") {
    document.querySelectorAll(".quiz-option").forEach(btn => {
      btn.onclick = e => {
        e.preventDefault();
        if (btn.classList.contains("disabled")) return;

        const selected = btn.dataset.answer;
        const correct = quizQuestions[quizIndex].correct;

        document.querySelectorAll(".quiz-option").forEach(b => {
          b.classList.add("disabled");
          b.style.pointerEvents = "none";
        });

        btn.style.transform = "scale(1.05)";
        setTimeout(() => (btn.style.transform = "scale(1)"), 200);

        if (selected === correct) {
          btn.classList.add("correct");
          quizScore++;
        } else {
          btn.classList.add("wrong");
          document.querySelectorAll(".quiz-option").forEach(b => {
            if (b.dataset.answer === correct) b.classList.add("correct");
          });
        }

        setTimeout(() => {
          quizIndex++;
          if (quizIndex >= quizQuestions.length) currentView = "quiz-result";
          renderApp();
        }, 800);
      };
    });
  }
}


function adjustColor(color, amount) {
  const num = parseInt(color.slice(1), 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + amount));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
  const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
  return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}

async function onConfigChange(newConfig) {
  Object.assign(config, newConfig);
  renderApp();
}

function mapToCapabilities(cfg) {
  return {
    recolorables: [
      {
        get: () => cfg.background_color || defaultConfig.background_color,
        set: (value) => {
          cfg.background_color = value;
          window.elementSdk.setConfig({ background_color: value });
        }
      },
      {
        get: () => cfg.card_background || defaultConfig.card_background,
        set: (value) => {
          cfg.card_background = value;
          window.elementSdk.setConfig({ card_background: value });
        }
      },
      {
        get: () => cfg.text_color || defaultConfig.text_color,
        set: (value) => {
          cfg.text_color = value;
          window.elementSdk.setConfig({ text_color: value });
        }
      },
      {
        get: () => cfg.primary_color || defaultConfig.primary_color,
        set: (value) => {
          cfg.primary_color = value;
          window.elementSdk.setConfig({ primary_color: value });
        }
      },
      {
        get: () => cfg.secondary_color || defaultConfig.secondary_color,
        set: (value) => {
          cfg.secondary_color = value;
          window.elementSdk.setConfig({ secondary_color: value });
        }
      }
    ],
    borderables: [],
    fontEditable: {
      get: () => cfg.font_family || 'system-ui',
      set: (value) => {
        cfg.font_family = value;
        window.elementSdk.setConfig({ font_family: value });
      }
    },
    fontSizeable: {
      get: () => cfg.font_size || 16,
      set: (value) => {
        cfg.font_size = value;
        window.elementSdk.setConfig({ font_size: value });
      }
    }
  };
}

function mapToEditPanelValues(cfg) {
  return new Map([
    ["app_title", cfg.app_title || defaultConfig.app_title],
    ["app_subtitle", cfg.app_subtitle || defaultConfig.app_subtitle]
  ]);
}

(async () => {
  if (window.elementSdk) {
    window.elementSdk.init({
      defaultConfig,
      onConfigChange,
      mapToCapabilities,
      mapToEditPanelValues
    });
  }

  if (window.dataSdk) {
    const initResult = await window.dataSdk.init(dataHandler);
    if (!initResult.isOk) {
      console.error('Failed to initialize data SDK');
    }
  }
})();

window.addEventListener("beforeinstallprompt", e => {
  console.log("✅ beforeinstallprompt fired");

  e.preventDefault(); // REQUIRED
  deferredInstallPrompt = e;

  const installBtn = document.getElementById("installAppBtn");
  if (installBtn) installBtn.style.display = "block";
});

document.getElementById("installAppBtn")?.addEventListener("click", async () => {
  if (!deferredInstallPrompt) return;

  deferredInstallPrompt.prompt();
  const choice = await deferredInstallPrompt.userChoice;

  deferredInstallPrompt = null;

  document.getElementById("installAppBtn").style.display = "none";

  if (choice.outcome === "accepted") {
    showToast("App installed 🎉");
  }
});

window.addEventListener("appinstalled", () => {
  console.log("🎉 App installed");
});


if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./service-worker.js")
      .then(() => console.log("Service Worker registered"))
      .catch(err => console.error("SW registration failed", err));
  });
}


