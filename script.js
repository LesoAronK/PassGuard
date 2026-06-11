// ============================================================
//  PassGuard – Password Strength Analyzer
//  All logic runs 100% client-side. No data leaves the browser.
// ============================================================

// ---- Common / weak passwords list (top 50 most breached) ----
const COMMON_PASSWORDS = new Set([
  "password","123456","123456789","12345678","12345","1234567","password1",
  "abc123","qwerty","letmein","monkey","master","dragon","1234","1111",
  "baseball","iloveyou","trustno1","sunshine","princess","welcome","shadow",
  "superman","michael","jessica","passw0rd","batman","admin","login","hello",
  "charlie","donald","password123","qwerty123","000000","iloveyou1","1q2w3e4r",
  "qwertyuiop","password2","test","pass","pass1","pass123","admin123",
  "root","toor","changeme","123qwe","111111","1234567890","abcdef"
]);

// ---- Word list for passphrase generator ----
const WORDS = [
  "apple","brave","cloud","dance","eagle","flame","ghost","hatch","ivory",
  "jolly","kneel","lemon","mango","noble","ocean","pilot","quest","river",
  "storm","tiger","ultra","vivid","witty","xenon","yacht","zebra","amber",
  "blaze","comet","dingo","ember","frost","globe","haven","igloo","jewel",
  "karma","lunar","maple","nexus","orbit","prism","quartz","raven","solar",
  "torch","umbra","viper","waltz","xeric","yield","zeal","acorn","bison"
];

// ---- State ----
let passwordHistory = JSON.parse(localStorage.getItem("passguard_history") || "[]");

// ---- DOM refs ----
const input        = document.getElementById("password-input");
const toggleBtn    = document.getElementById("toggle-visibility");
const eyeIcon      = document.getElementById("eye-icon");
const eyeOffIcon   = document.getElementById("eye-off-icon");
const strengthFill = document.getElementById("strength-fill");
const strengthLabel= document.getElementById("strength-label");
const scoreNum     = document.getElementById("score-num");
const scoreGrade   = document.getElementById("score-grade");
const entropyVal   = document.getElementById("entropy-val");
const crackTime    = document.getElementById("crack-time");
const charsetVal   = document.getElementById("charset-val");
const lengthVal    = document.getElementById("length-val");
const suggSection  = document.getElementById("suggestions-section");
const suggList     = document.getElementById("suggestions-list");
const regenBtn     = document.getElementById("regenerate-btn");
const historyList  = document.getElementById("history-list");
const historyEmpty = document.getElementById("history-empty");
const historyCount = document.getElementById("history-count");
const clearHistBtn = document.getElementById("clear-history-btn");
const saveBtn      = document.getElementById("save-password-btn");

// ---- Show/hide password ----
let isVisible = false;
toggleBtn.addEventListener("click", () => {
  isVisible = !isVisible;
  input.type = isVisible ? "text" : "password";
  eyeIcon.style.display    = isVisible ? "none"  : "block";
  eyeOffIcon.style.display = isVisible ? "block" : "none";
});

// ---- Main analysis ----
input.addEventListener("input", () => {
  const pwd = input.value;
  const result = analyzePassword(pwd);
  renderStrengthBar(result);
  renderCriteria(result);
  renderMeta(result, pwd);
  renderSuggestions(pwd, result);
  renderSaveButton(pwd);
  checkReuse(pwd);
});

// ---- Core analysis function ----
function analyzePassword(pwd) {
  const checks = {
    length8:     pwd.length >= 8,
    length12:    pwd.length >= 12,
    uppercase:   /[A-Z]/.test(pwd),
    lowercase:   /[a-z]/.test(pwd),
    numbers:     /[0-9]/.test(pwd),
    symbols:     /[^A-Za-z0-9]/.test(pwd),
    nocommon:    pwd.length > 0 && !COMMON_PASSWORDS.has(pwd.toLowerCase()),
    norepeating: pwd.length > 0 && !/(.)\1{2,}/.test(pwd)
  };

  // Score calculation
  let score = 0;
  if (checks.length8)     score += 10;
  if (checks.length12)    score += 15;
  if (pwd.length >= 16)   score += 10;
  if (checks.uppercase)   score += 12;
  if (checks.lowercase)   score += 10;
  if (checks.numbers)     score += 12;
  if (checks.symbols)     score += 18;
  if (checks.nocommon)    score += 8;
  if (checks.norepeating) score += 5;
  // Bonus for mixed
  const typesUsed = [checks.uppercase, checks.lowercase, checks.numbers, checks.symbols].filter(Boolean).length;
  if (typesUsed === 4) score = Math.min(score + 10, 100);
  score = Math.min(score, 100);

  // Charset size for entropy
  let charsetSize = 0;
  if (checks.lowercase)               charsetSize += 26;
  if (checks.uppercase)               charsetSize += 26;
  if (checks.numbers)                 charsetSize += 10;
  if (/[^A-Za-z0-9]/.test(pwd))      charsetSize += 32;
  if (charsetSize === 0 && pwd.length) charsetSize = 26;

  const entropy = pwd.length > 0 ? Math.floor(pwd.length * Math.log2(charsetSize || 1)) : 0;

  return { checks, score, entropy, charsetSize, length: pwd.length };
}

// ---- Render: strength bar ----
function renderStrengthBar({ score }) {
  const levels = [
    { min: 0,  max: 20,  label: "Very Weak",   cls: "s-weak",       color: "var(--red)"    },
    { min: 20, max: 40,  label: "Weak",         cls: "s-weak",       color: "var(--red)"    },
    { min: 40, max: 55,  label: "Fair",         cls: "s-fair",       color: "var(--orange)" },
    { min: 55, max: 70,  label: "Good",         cls: "s-good",       color: "var(--yellow)" },
    { min: 70, max: 85,  label: "Strong",       cls: "s-strong",     color: "var(--green)"  },
    { min: 85, max: 101, label: "Very Strong",  cls: "s-very-strong",color: "var(--accent)" },
  ];
  const lvl = levels.find(l => score >= l.min && score < l.max) || levels[0];

  strengthFill.style.width = score + "%";
  strengthFill.className = "strength-fill " + lvl.cls;
  strengthLabel.textContent = score > 0 ? lvl.label : "—";
  strengthLabel.style.color = score > 0 ? lvl.color : "var(--text-2)";

  scoreNum.textContent = score;
  scoreNum.style.color = score > 0 ? lvl.color : "var(--text)";
  scoreGrade.textContent = score > 0 ? lvl.label : "Enter a password";
}

// ---- Render: criteria ----
function renderCriteria({ checks }) {
  document.querySelectorAll(".crit-item").forEach(el => {
    const key = el.dataset.key;
    const pass = checks[key];
    el.className = "crit-item " + (pass ? "pass" : "fail");
    el.querySelector(".crit-icon").textContent = "";
  });
}

// ---- Render: meta stats ----
function renderMeta({ entropy, charsetSize, length }, pwd) {
  entropyVal.textContent  = length > 0 ? entropy + " bits" : "— bits";
  crackTime.textContent   = length > 0 ? estimateCrackTime(entropy) : "—";
  charsetVal.textContent  = length > 0 ? charsetSize + " chars" : "—";
  lengthVal.textContent   = length > 0 ? length + (length === 1 ? " char" : " chars") : "0 chars";
}

// ---- Crack time estimation (10 billion guesses/sec = modern GPU) ----
function estimateCrackTime(entropy) {
  if (entropy === 0) return "instant";
  const guessesPerSec = 1e10;
  const combinations  = Math.pow(2, entropy);
  const seconds       = combinations / (2 * guessesPerSec); // avg = half keyspace
  if (seconds < 1)          return "< 1 second";
  if (seconds < 60)         return Math.round(seconds) + " seconds";
  if (seconds < 3600)       return Math.round(seconds / 60) + " minutes";
  if (seconds < 86400)      return Math.round(seconds / 3600) + " hours";
  if (seconds < 2592000)    return Math.round(seconds / 86400) + " days";
  if (seconds < 31536000)   return Math.round(seconds / 2592000) + " months";
  if (seconds < 3.15e9)     return Math.round(seconds / 31536000) + " years";
  if (seconds < 3.15e12)    return Math.round(seconds / 3.15e9) + " thousand years";
  if (seconds < 3.15e15)    return Math.round(seconds / 3.15e12) + " million years";
  return "centuries";
}

// ---- Render: suggestions ----
let currentPwd = "";
function renderSuggestions(pwd, result) {
  currentPwd = pwd;
  if (!pwd || result.score >= 80) {
    suggSection.style.display = "none";
    return;
  }
  suggSection.style.display = "block";
  buildSuggestions(pwd);
}

function buildSuggestions(pwd) {
  const suggestions = generateSuggestions(pwd);
  suggList.innerHTML = "";
  suggestions.forEach(s => {
    const li = document.createElement("li");
    li.innerHTML = `<span class="sugg-text" style="font-family:var(--font-mono)">${s}</span><button class="copy-btn" data-val="${s}">Copy</button>`;
    li.querySelector(".copy-btn").addEventListener("click", function() {
      navigator.clipboard.writeText(this.dataset.val).then(() => {
        this.textContent = "Copied!";
        this.classList.add("copied");
        setTimeout(() => { this.textContent = "Copy"; this.classList.remove("copied"); }, 2000);
      });
    });
    suggList.appendChild(li);
  });
}

regenBtn.addEventListener("click", () => buildSuggestions(currentPwd));

function generateSuggestions(base) {
  const out = [];
  // 1. Passphrase (4 words + number)
  out.push(randomPassphrase(4));
  // 2. Passphrase (3 words + symbol + number)
  out.push(randomPassphrase(3, true));
  // 3. Enhanced version of original (if long enough)
  if (base.length >= 4) {
    out.push(enhancePassword(base));
  } else {
    out.push(randomPassphrase(4));
  }
  return out;
}

function randomPassphrase(wordCount, fancy = false) {
  const picked = [];
  for (let i = 0; i < wordCount; i++) {
    picked.push(WORDS[Math.floor(Math.random() * WORDS.length)]);
  }
  const num = Math.floor(Math.random() * 90) + 10;
  const syms = ["!", "@", "#", "$", "%", "&", "*"];
  const sym  = syms[Math.floor(Math.random() * syms.length)];
  if (fancy) {
    return picked.join("-") + sym + num;
  }
  return picked.join("-") + "-" + num;
}

function enhancePassword(base) {
  const syms = ["!", "@", "#", "$", "?", "&"];
  const sym  = syms[Math.floor(Math.random() * syms.length)];
  const num  = Math.floor(Math.random() * 900) + 100;
  // Capitalize first char, append symbol + number
  let enhanced = base.charAt(0).toUpperCase() + base.slice(1);
  // Replace some letters with leet
  const leet = { a:"@", e:"3", i:"1", o:"0", s:"$" };
  enhanced = enhanced.split("").map((c, idx) => idx > 0 && leet[c.toLowerCase()] ? leet[c.toLowerCase()] : c).join("");
  return enhanced + sym + num;
}

// ---- SHA-256 hash (for local history storage — never sent anywhere) ----
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

// ---- Check reuse ----
let reuseBanner = null;
async function checkReuse(pwd) {
  if (!pwd) { if (reuseBanner) reuseBanner.classList.remove("visible"); return; }
  const hash = await sha256(pwd);
  const exists = passwordHistory.some(h => h.hash === hash);
  if (!reuseBanner) {
    reuseBanner = document.createElement("div");
    reuseBanner.className = "reuse-banner";
    reuseBanner.textContent = "⚠ This password matches one in your history — avoid reusing passwords!";
    document.querySelector(".analyzer-card").appendChild(reuseBanner);
  }
  reuseBanner.classList.toggle("visible", exists);
}

// ---- Save button ----
function renderSaveButton(pwd) {
  saveBtn.style.display = pwd ? "inline-block" : "none";
}

saveBtn.addEventListener("click", async () => {
  const pwd = input.value;
  if (!pwd) return;
  const hash = await sha256(pwd);
  const result = analyzePassword(pwd);
  const already = passwordHistory.some(h => h.hash === hash);
  if (!already) {
    passwordHistory.unshift({ hash, score: result.score, date: new Date().toLocaleDateString() });
    if (passwordHistory.length > 20) passwordHistory = passwordHistory.slice(0, 20);
    localStorage.setItem("passguard_history", JSON.stringify(passwordHistory));
    renderHistory();
  }
  checkReuse(pwd);
});

// ---- Render history ----
function renderHistory() {
  historyCount.textContent = passwordHistory.length;
  if (passwordHistory.length === 0) {
    historyEmpty.style.display = "block";
    historyList.innerHTML = "";
    return;
  }
  historyEmpty.style.display = "none";
  historyList.innerHTML = "";
  passwordHistory.forEach(item => {
    const li = document.createElement("li");
    li.className = "history-item";
    const color = item.score >= 70 ? "var(--green)" : item.score >= 55 ? "var(--yellow)" : "var(--red)";
    li.innerHTML = `
      <span class="h-hash" title="SHA-256 hash">${item.hash.slice(0, 32)}…</span>
      <span class="h-meta">
        <span class="h-score" style="color:${color}">${item.score}/100</span>
        <span class="h-date">${item.date}</span>
      </span>`;
    historyList.appendChild(li);
  });
}

clearHistBtn.addEventListener("click", () => {
  passwordHistory = [];
  localStorage.removeItem("passguard_history");
  renderHistory();
  if (reuseBanner) reuseBanner.classList.remove("visible");
});

// ---- Init ----
renderHistory();
