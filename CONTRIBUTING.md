# Contributing to Postly

Thank you for your interest in contributing! Postly is a community-friendly project and we welcome all kinds of contributions — bug reports, feature ideas, design improvements, and code.

---

## 🛠️ Local Development Setup

### 1. Fork and Clone

```bash
# Fork the repo on GitHub, then:
git clone https://github.com/YOUR_USERNAME/postly.git
cd postly
```

### 2. Install Dependencies

```bash
# Requires pnpm 9+ and Node.js 20+
pnpm install
```

### 3. Run the App

```bash
pnpm --filter @workspace/social-scheduler run dev
```

Scan the QR code with **Expo Go** on your device.

---

## 📁 Where to Make Changes

| Change type | Where to edit |
|---|---|
| New screen / tab | `artifacts/social-scheduler/app/(tabs)/` |
| New component | `artifacts/social-scheduler/components/` |
| Theme colors | `artifacts/social-scheduler/constants/colors.ts` |
| Type definitions | `artifacts/social-scheduler/types/index.ts` |
| Global state | `artifacts/social-scheduler/context/` |

---

## 🔀 Pull Request Guidelines

1. **Branch naming**: `feat/your-feature`, `fix/bug-description`, `docs/update-readme`
2. **One PR per feature** — keep changes focused
3. **Test on a real device** — use Expo Go, not just the web preview
4. **Follow existing code style** — no `console.log`, use Poppins fonts, respect the color tokens
5. **Update CHANGELOG.md** with your addition under `[Upcoming]`

---

## 🐛 Reporting Bugs

Use the [GitHub Issues](../../issues) page and include:

- What you did
- What you expected
- What actually happened
- Device + OS version (e.g. iPhone 15 / iOS 17.4)
- Screenshot if applicable

---

## 💡 Feature Requests

Open an issue with the `enhancement` label. Describe:

- The problem it solves
- Who benefits from it
- Any mockups or references you have

---

## 🎨 Design Principles

When contributing UI changes, please keep these in mind:

- **Non-coder first**: every screen needs a clear empty state and an obvious next action
- **Dark is default**: the electric yellow + hot pink funky aesthetic is the brand identity
- **Poppins only**: use `Poppins_900Black`, `Poppins_700Bold`, `Poppins_600SemiBold`, or `Poppins_400Regular`
- **Color tokens only**: never hardcode colors — use `useColors()` and reference tokens

---

## ⚖️ License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
