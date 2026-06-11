# 🔐 PassGuard — Password Strength Analyzer

A client-side password strength analyzer built as a mini internship project. Evaluates passwords for length, complexity, entropy, and uniqueness — and suggests stronger alternatives.

**🔒 Privacy-first:** Everything runs 100% in your browser. No passwords or data are ever sent to a server.

---

## ✨ Features

- **Strength scoring** (0–100) with visual bar and grade
- **8 criteria checks** — length, uppercase, lowercase, numbers, symbols, not common, no repeating
- **Entropy & crack time** estimation (based on charset size)
- **Stronger password suggestions** — passphrases + enhanced variants
- **Password history** stored locally via `localStorage` (SHA-256 hashed — never raw)
- **Reuse detection** — warns if you've used the password before
- **Security tips** section covering best practices

---

## 📁 Project Structure

```
password-strength-analyzer/
├── index.html   # Main UI
├── style.css    # All styles (dark theme, responsive)
├── script.js    # All logic (analysis, suggestions, history)
└── README.md    # This file
```

---

## 🚀 Deploy to GitHub Pages (Step-by-Step)

### Prerequisites
- A [GitHub account](https://github.com)
- [Git](https://git-scm.com/downloads) installed on your computer
- A terminal / command prompt

---

### Step 1 — Create a GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Name it: `password-strength-analyzer`
3. Set it to **Public**
4. ✅ Check **"Add a README file"**
5. Click **"Create repository"**

---

### Step 2 — Clone the Repo to Your Computer

Open your terminal and run:

```bash
git clone https://github.com/YOUR_USERNAME/password-strength-analyzer.git
cd password-strength-analyzer
```

> Replace `YOUR_USERNAME` with your actual GitHub username.

---

### Step 3 — Add the Project Files

Copy `index.html`, `style.css`, and `script.js` into the cloned folder.

Your folder should look like:
```
password-strength-analyzer/
├── index.html
├── style.css
├── script.js
└── README.md
```

---

### Step 4 — Commit and Push to GitHub

```bash
git add .
git commit -m "Add PassGuard password strength analyzer"
git push origin main
```

---

### Step 5 — Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (top navigation bar)
3. Scroll down to **"Pages"** in the left sidebar
4. Under **"Source"**, select:
   - Branch: `main`
   - Folder: `/ (root)`
5. Click **Save**

---

### Step 6 — Visit Your Live Site 🎉

After ~60 seconds, your site will be live at:

```
https://YOUR_USERNAME.github.io/password-strength-analyzer/
```

> GitHub will show the link in the Pages settings after deployment.

---

## 🧪 How to Run Locally (No Server Needed)

Just open `index.html` in any modern browser:

```bash
# On Mac
open index.html

# On Windows
start index.html

# Or drag-drop index.html into Chrome/Firefox/Edge
```

No npm, no build step, no dependencies required.

---

## 🧠 Concepts Covered (for Internship Report)

| Concept | How it's used |
|---|---|
| Password entropy | `length × log₂(charset_size)` in bits |
| SHA-256 hashing | Web Crypto API — hashing before local storage |
| Crack time estimation | Brute-force model at 10 billion guesses/sec |
| Passphrase generation | Random word combinations (Diceware-style) |
| Leet substitution | Character mapping for enhanced passwords |
| localStorage | Persisting hashed password history |
| Common password list | Block the top 50 most-breached passwords |

---

## 🛠 Tech Stack

- **HTML5** — Semantic structure
- **CSS3** — Custom properties, grid, flexbox, animations
- **Vanilla JavaScript** — Web Crypto API, localStorage, DOM manipulation
- **Google Fonts** — JetBrains Mono + Inter

---

## 📄 License

MIT — Free to use, modify, and present for academic/internship purposes.
