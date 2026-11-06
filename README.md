# Platoon Aviation — Pixel-Perfect Website Recreation

A high-fidelity, pixel-perfect recreation of [Platoon Aviation](https://www.flyplatoon.com/). Built with React 18, TypeScript, React Router DOM v5, Vite, and SCSS with `sass-mq` mixins and fluid typography.

## 🛫 Features & Recreated Routes

- **Home (`/`)**: Video hero, brand mission, interactive mechanical flipboard, magazine editorial stories, quote masks, and technical facts.
- **The Jets (`/jets`)**: Pilatus PC-24 fleet presentation, baggage calculator with interactive SVG suitcases, strip landing graphics, and reach map.
- **Experience (`/experience`)**: Cabin ambiance, bespoke aviation services, and full-bleed parallax visual storytelling.
- **Our Story (`/our-story`)**: Cloudscape video background, editorial typography, brand chronicle.
- **Sponsoring (`/sponsoring`)**: 4K video reel, partnership presentations, fullsize photo showcases.
- **Career (`/career`)**: Live Personio job feed XML integration, interactive job disclosure accordions, direct application triggers.
- **Imprint (`/imprint`)**: Hamburg corporate registry, executive leadership, and legal data.
- **Privacy Policy (`/privacy-policy`)**: GDPR disclosures, data controller specifications, cookie policies.

## 🛠️ Technology Stack

- **Framework**: React 18
- **Routing**: `react-router-dom` v5
- **Styling**: SCSS (Sass with `sass-mq`, fluid typography, and design tokens)
- **Tooling**: Vite 8 & TypeScript
- **Fonts**: Neuzeit Grotesk, Vanitas-Regular, Simplon Mono
- **Gestures**: HammerJS touch and pointer support
- **Testing**: Playwright browser automation suite

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
```

### 4. Preview Production Build
```bash
npm run preview
```

### 5. Run Automated Playwright Validation Suite
```bash
npm test
# or: node scripts/validate_playwright.js
```

## 📸 Automated Visual Validation

The repository includes a comprehensive Playwright automation suite:
- `scripts/inspect_playwright.js`: Systematically navigates the live reference website and captures full-page and above-the-fold viewport screenshots.
- `scripts/validate_playwright.js`: Validates the local recreation across Desktop (1440×900), Laptop (1366×768), Tablet (768×1024), and Mobile (390×844) viewports.
- `screenshots/original/`: Screenshots of the reference site.
- `screenshots/replica/`: Screenshots of the recreated site.

