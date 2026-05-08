# Nazeem Massoom Dickey Portfolio

Public portfolio for Nazeem Massoom Dickey — SkillsUSA Florida Internetworking Gold Medal Champion, focused on junior network administrator, SOC analyst, NOC, MSP, IT support, and cybersecurity internship opportunities.

Live site: https://masternazz.com

## What This Shows

- SkillsUSA Florida Internetworking Gold Medal Champion (April 2026) — qualifying for NLSC Nationals in Atlanta, GA.
- Enterprise-style homelab architecture using Proxmox, OPNsense, Cisco switching, Synology storage, Cloudflare, Authentik, Wazuh, and NPMplus.
- Public-safe project writeups for firewalling, virtualization, secure remote access, identity, and SIEM workflows.
- Resume and certification material aimed at helping employers verify hands-on infrastructure work.

## Site Stack

- Vanilla HTML, CSS, JavaScript — no frameworks
- GitHub Pages with custom domain via `masternazz.com`
- Playwright for PDF and image generation

## Project Layout

- `index.html` - homepage and main entry point.
- `pages/` - secondary site pages and resume HTML sources.
- `assets/css/` - shared stylesheet.
- `assets/js/` - shared JavaScript.
- `assets/images/` - rack photos and certification logos.
- `assets/diagrams/` - architecture diagrams and OG social card.
- `assets/resumes/` - generated PDF resumes.
- `tools/` - local Playwright maintenance scripts.
- `screenshots/` - generated visual-check output, ignored by git.

## Maintenance Tools

Install local tooling once:

```powershell
npm install
```

Useful commands:

```powershell
npm run visual:check
npm run resume:measure
npm run resume:export
node tools/export-og-card.js
node tools/check-mobile.js
```

- `visual:check` captures local page screenshots into `screenshots/`.
- `resume:measure` checks resume page height and PDF page count.
- `resume:export` regenerates PDFs in `assets/resumes/`.
- `export-og-card` regenerates the OG social preview card at `assets/diagrams/network-diagram.png`.
- `check-mobile` takes a mobile-viewport screenshot for quick visual QA.

## AI Assistance Credit

Claude Code (Anthropic) assisted with implementation, tooling, and documentation. The project direction, infrastructure decisions, lab ownership, competition results, and final technical judgment are Nazeem's.

## AI Starter Repos

This portfolio is maintained alongside a small set of official AI CLI repos for workflow research and implementation reference.

- `anthropics/claude-code`
- `anthropics/claude-code-sdk`
- `google-gemini/gemini-cli`
- `openai/codex`

## Public-Safe Boundary

This site intentionally avoids publishing private configuration exports, secrets, exact firewall rule details, credential material, MAC addresses, and full internal addressing.
