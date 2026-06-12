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
├── index.html   
├── style.css    
├── script.js    
└── README.md
```

---
