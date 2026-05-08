const email = "NazeemDickey@gmail.com";

(() => {
  try {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  } catch (error) {
    // Storage can be unavailable in a few embedded/browser privacy contexts.
  }
})();

async function copyEmail() {
  const text = document.getElementById("emailText");

  try {
    await navigator.clipboard.writeText(email);
    if (text) {
      text.textContent = "Email: " + email + " - copied";
      setTimeout(() => {
        text.textContent = "Email: " + email + " | Boynton Beach, FL";
      }, 2000);
    }
  } catch (error) {
    if (text) {
      text.textContent = "Email: " + email + " - copy manually";
    }
  }
}

function setupProjectFilters() {
  const buttons = document.querySelectorAll("[data-filter]");
  const cards = document.querySelectorAll("[data-tags]");

  if (!buttons.length || !cards.length) {
    return;
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      buttons.forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");

      cards.forEach((card) => {
        const tags = card.dataset.tags.split(" ");
        const show = filter === "all" || tags.includes(filter);
        card.classList.toggle("is-hidden", !show);
      });
    });
  });
}

// Cursor spotlight — fixed overlay so we use clientX/clientY (viewport coords)
function allowsMotionEffects() {
  if (!window.matchMedia) {
    return true;
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  return finePointer && !reducedMotion;
}

function setupCursorSpotlight() {
  if (!allowsMotionEffects()) {
    return;
  }

  let tx = window.innerWidth / 2;
  let ty = window.innerHeight / 2;
  let cx = tx;
  let cy = ty;
  let frameId = null;

  function lerp(a, b, t) { return a + (b - a) * t; }

  function setSpotlightPosition(x, y) {
    const width = window.innerWidth || 1;
    const height = window.innerHeight || 1;
    const xPct = (x / width * 100).toFixed(2) + "%";
    const yPct = (y / height * 100).toFixed(2) + "%";
    document.documentElement.style.setProperty("--cx", xPct);
    document.documentElement.style.setProperty("--cy", yPct);
  }

  function scheduleTick() {
    if (frameId === null && !document.hidden) {
      frameId = requestAnimationFrame(tick);
    }
  }

  function tick() {
    frameId = null;

    if (document.hidden) {
      return;
    }

    const dx = tx - cx;
    const dy = ty - cy;

    if (Math.abs(dx) < 0.3 && Math.abs(dy) < 0.3) {
      cx = tx;
      cy = ty;
      setSpotlightPosition(cx, cy);
      return;
    }

    cx = lerp(cx, tx, 0.14);
    cy = lerp(cy, ty, 0.14);
    setSpotlightPosition(cx, cy);
    scheduleTick();
  }

  document.addEventListener("mousemove", (e) => {
    tx = e.clientX;
    ty = e.clientY;
    scheduleTick();
  }, { passive: true });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && frameId !== null) {
      cancelAnimationFrame(frameId);
      frameId = null;
    }
  });
}

// Apple-style liquid glass — tracks cursor position + angle within each panel
function setupGlassPanels() {
  if (!allowsMotionEffects()) {
    return;
  }

  const panels = document.querySelectorAll(".glass-panel");

  panels.forEach((panel) => {
    panel.addEventListener("mousemove", (e) => {
      const rect = panel.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      // Position as % for the radial gradient
      const xPct = (mx / rect.width  * 100).toFixed(1) + "%";
      const yPct = (my / rect.height * 100).toFixed(1) + "%";

      // Angle from card center to cursor — drives the conic rim highlight
      const dx = mx - rect.width  / 2;
      const dy = my - rect.height / 2;
      const deg = (Math.atan2(dy, dx) * 180 / Math.PI).toFixed(1) + "deg";

      panel.style.setProperty("--mx",    xPct);
      panel.style.setProperty("--my",    yPct);
      panel.style.setProperty("--angle", deg);
    }, { passive: true });
  });
}

const INDEX = [
  {
    "title": "Home",
    "url": "index.html",
    "icon": "🏠",
    "desc": "Portfolio landing page",
    "keywords": "home portfolio nazeem network admin soc noc msp skills projects contact hero"
  },
  {
    "title": "Certifications",
    "url": "pages/certifications.html",
    "icon": "🏅",
    "desc": "Professional certifications and credentials for Nazeem Massoom Dickey.",
    "keywords": "certifications certifications professional certifications and credentials for nazeem massoom dickey"
  },
  {
    "title": "Enterprise Homelab Architecture",
    "url": "pages/homelab.html",
    "icon": "🖥️",
    "desc": "Public-safe overview of Nazeem Massoom Dickey's enterprise-style homelab architecture.",
    "keywords": "homelab enterprise homelab architecture publicsafe overview of nazeem massoom dickeys enterprisestyle homelab architecture"
  },
  {
    "title": "Authentik Identity Lab",
    "url": "pages/identity.html",
    "icon": "👤",
    "desc": "Public-safe Authentik identity and SSO project by Nazeem Massoom Dickey.",
    "keywords": "identity authentik identity lab publicsafe authentik identity and sso project by nazeem massoom dickey"
  },
  {
    "title": "Journey &amp; Timeline",
    "url": "pages/journey.html",
    "icon": "🗺️",
    "desc": "How Nazeem Massoom Dickey went from zero IT background to enterprise homelab, CompTIA trifecta, and SkillsUSA Florida 1st Place in under two years.",
    "keywords": "journey journey amp timeline how nazeem massoom dickey went from zero it background to enterprise homelab comptia trifecta and skillsusa florida 1st place in under two years"
  },
  {
    "title": "OPNsense Edge Firewall Project",
    "url": "pages/opnsense.html",
    "icon": "🛡️",
    "desc": "Public-safe OPNsense firewall project by Nazeem Massoom Dickey.",
    "keywords": "opnsense opnsense edge firewall project publicsafe opnsense firewall project by nazeem massoom dickey"
  },
  {
    "title": "Proxmox Infrastructure Project",
    "url": "pages/proxmox.html",
    "icon": "⚙️",
    "desc": "Public-safe Proxmox infrastructure project by Nazeem Massoom Dickey.",
    "keywords": "proxmox proxmox infrastructure project publicsafe proxmox infrastructure project by nazeem massoom dickey"
  },
  {
    "title": "Secure Remote Access Project",
    "url": "pages/remote-access.html",
    "icon": "🔐",
    "desc": "Public-safe secure remote access project by Nazeem Massoom Dickey.",
    "keywords": "remoteaccess secure remote access project publicsafe secure remote access project by nazeem massoom dickey"
  },
  {
    "title": "Nazeem Massoom Dickey — Resume (ATS)",
    "url": "pages/Massoom_Dickey_Nazeem_Resume_ATS.html",
    "icon": "📄",
    "desc": "ATS-friendly resume for Nazeem Massoom Dickey, IT and cybersecurity candidate.",
    "keywords": "resumeats nazeem massoom dickey  resume ats atsfriendly resume for nazeem massoom dickey it and cybersecurity candidate"
  },
  {
    "title": "Nazeem Massoom Dickey — Resume",
    "url": "pages/Massoom_Dickey_Nazeem_Resume_Styled.html",
    "icon": "📄",
    "desc": "Styled resume for Nazeem Massoom Dickey, IT and cybersecurity candidate.",
    "keywords": "resumestyled nazeem massoom dickey  resume styled resume for nazeem massoom dickey it and cybersecurity candidate"
  },
  {
    "title": "Resume",
    "url": "pages/resume.html",
    "icon": "📄",
    "desc": "Resume page for Nazeem Massoom Dickey, IT and cybersecurity candidate.",
    "keywords": "resume resume resume page for nazeem massoom dickey it and cybersecurity candidate"
  },
  {
    "title": "SkillsUSA Internetworking",
    "url": "pages/skillsusa.html",
    "icon": "🥇",
    "desc": "SkillsUSA Florida Internetworking 1st Place — Nazeem Massoom Dickey competing at state and national level.",
    "keywords": "skillsusa skillsusa internetworking skillsusa florida internetworking 1st place  nazeem massoom dickey competing at state and national level"
  },
  {
    "title": "Live Service Status",
    "url": "pages/status.html",
    "icon": "📡",
    "desc": "Real-time uptime monitoring for masternazz.com services, powered by a self-hosted Uptime Kuma instance running on Proxmox.",
    "keywords": "status live service status realtime uptime monitoring for masternazzcom services powered by a selfhosted uptime kuma instance running on proxmox"
  },
  {
    "title": "Cisco Switching &amp; DMZ VLAN",
    "url": "pages/switching.html",
    "icon": "🔀",
    "desc": "Cisco Catalyst 3750 V2 switching deployment with VLAN 50 DMZ isolation for Cloudflare Tunnel public ingress.",
    "keywords": "switching cisco switching amp dmz vlan cisco catalyst 3750 v2 switching deployment with vlan 50 dmz isolation for cloudflare tunnel public ingress"
  },
  {
    "title": "Wazuh SIEM/XDR Lab",
    "url": "pages/wazuh.html",
    "icon": "🔍",
    "desc": "Self-hosted Wazuh SIEM/XDR deployment and SOC-style investigation workflow by Nazeem Massoom Dickey.",
    "keywords": "wazuh wazuh siemxdr lab selfhosted wazuh siemxdr deployment and socstyle investigation workflow by nazeem massoom dickey"
  },
  {
    "title": "CyberLaunch USF 2026 — CTF Writeup",
    "url": "pages/writeup-cyberlaunch-2026.html",
    "icon": "📄",
    "desc": "CyberLaunch USF 2026 State Championship CTF recap — Kali Linux, Nmap, Metasploit, Hashcat, SMB exploitation, and OSINT geolocation.",
    "keywords": "writeupcyberlaunch2026 cyberlaunch usf 2026  ctf writeup cyberlaunch usf 2026 state championship ctf recap  kali linux nmap metasploit hashcat smb exploitation and osint geolocation"
  },
  {
    "title": "Writeups",
    "url": "pages/writeups.html",
    "icon": "✍️",
    "desc": "Technical writeups and competition recaps by Nazeem Massoom Dickey — CTF writeups, competition notes, and field reports.",
    "keywords": "writeups writeups technical writeups and competition recaps by nazeem massoom dickey  ctf writeups competition notes and field reports"
  },
  {
    "title": "Cisco Trunking & VLAN 50 Fix",
    "url": "pages/writeup-vlan50.html",
    "icon": "🔀",
    "desc": "Troubleshooting and fixing a VLAN 50 trunking mismatch on Cisco 3750V2 switches to restore Cloudflare Tunnel DMZ connectivity.",
    "keywords": "vlan50 cisco trunking vlan 50 fix troubleshooting switchport trunk allowed vlan opnsense dmz cloudflare tunnel 3750 catalyst networking"
  },
  {
    "title": "AI Automation & Agent Research",
    "url": "pages/ai-automation.html",
    "icon": "🤖",
    "desc": "Research into agentic AI tools — Claude Code, Gemini CLI, OpenAI Codex — and how they apply to IT operations, SOC workflows, and infrastructure automation.",
    "keywords": "ai automation claude code gemini cli openai codex ab-900 agentic workflows microsoft copilot agent administration it operations soc automation homelab"
  }
];

function setupSearch() {
  // Detect depth: pages/ subdir has root at ../
  const isSubpage = location.pathname.includes("/pages/");
  const root = isSubpage ? "../" : "";

  // The INDEX is generated with "pages/filename.html" paths.
  const processedIndex = INDEX.map(item => {
    let url = item.url;
    if (url === "index.html") {
      url = root + "index.html";
    } else {
      if (isSubpage) {
        url = url.replace("pages/", "");
      } else {
        url = root + url;
      }
    }
    return { ...item, url };
  });

  // Inject overlay HTML once
  const overlay = document.createElement("div");
  overlay.className = "search-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "Search pages");
  overlay.innerHTML = `
    <div class="search-modal">
      <div class="search-input-wrap">
        <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input class="search-input" type="text" placeholder="Search pages…" autocomplete="off" spellcheck="false" />
      </div>
      <div class="search-results" role="listbox"></div>
      <div class="search-footer">↑↓ navigate &nbsp;·&nbsp; Enter open &nbsp;·&nbsp; Esc close</div>
    </div>`;
  document.body.appendChild(overlay);

  const input = overlay.querySelector(".search-input");
  const results = overlay.querySelector(".search-results");
  let activeIdx = -1;

  function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#39;"
    }[char]));
  }

  function highlight(text, query) {
    if (!query) return text;
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return text.replace(new RegExp("(" + escaped + ")", "gi"), "<mark>$1</mark>");
  }

  function rank(item, q) {
    const ql = q.toLowerCase();
    const title = item.title.toLowerCase();
    const desc = item.desc.toLowerCase();
    const kw = item.keywords.toLowerCase();
    if (title === ql) return 100;
    if (title.startsWith(ql)) return 80;
    if (title.includes(ql)) return 60;
    if (desc.includes(ql)) return 40;
    if (kw.includes(ql)) return 20;
    return 0;
  }

  function render(q) {
    activeIdx = -1;
    const trimmed = q.trim();
    const items = trimmed
      ? processedIndex.map(item => ({ item, score: rank(item, trimmed) }))
          .filter(x => x.score > 0)
          .sort((a, b) => b.score - a.score)
          .map(x => x.item)
      : processedIndex;

    if (!items.length) {
      results.innerHTML = `<div class="search-empty">No results for "<strong>${escapeHtml(trimmed)}</strong>"</div>`;
      return;
    }

    results.innerHTML = items.map((item, i) => `
      <a class="search-result" href="${item.url}" role="option" data-idx="${i}" tabindex="-1">
        <span class="search-result-icon">${item.icon}</span>
        <span class="search-result-body">
          <span class="search-result-title">${highlight(item.title, trimmed)}</span>
          <span class="search-result-desc">${highlight(item.desc, trimmed)}</span>
        </span>
      </a>`).join("");
  }

  function setActive(idx) {
    const items = results.querySelectorAll(".search-result");
    items.forEach(el => el.classList.remove("is-active"));
    if (idx >= 0 && idx < items.length) {
      items[idx].classList.add("is-active");
      items[idx].scrollIntoView({ block: "nearest" });
    }
    activeIdx = idx;
  }

  function open() {
    overlay.classList.add("is-open");
    document.body.classList.add("search-lock");
    input.value = "";
    render("");
    requestAnimationFrame(() => input.focus());
  }

  function close() {
    overlay.classList.remove("is-open");
    document.body.classList.remove("search-lock");
    activeIdx = -1;
  }

  overlay.addEventListener("click", e => { if (e.target === overlay) close(); });

  input.addEventListener("input", () => render(input.value));

  input.addEventListener("keydown", e => {
    const items = results.querySelectorAll(".search-result");
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive(Math.min(activeIdx + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive(Math.max(activeIdx - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const active = activeIdx >= 0 ? items[activeIdx] : items[0];
      if (active) active.click();
    } else if (e.key === "Escape") {
      close();
    }
  });

  // Wire trigger buttons
  document.querySelectorAll(".search-trigger").forEach(btn => {
    btn.addEventListener("click", open);
  });

  // Keyboard shortcut Ctrl+K / Cmd+K
  document.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      overlay.classList.contains("is-open") ? close() : open();
    }
  });
}

function diagramSrcForTheme(src, theme) {
  if (!/assets\/diagrams\/.+\.svg([?#].*)?$/.test(src)) {
    return src;
  }

  if (theme === "light") {
    return src.replace(/-light\.svg([?#].*)?$/, ".svg$1").replace(/\.svg([?#].*)?$/, "-light.svg$1");
  }

  return src.replace(/-light\.svg([?#].*)?$/, ".svg$1");
}

function updateThemeAwareDiagrams(theme = document.documentElement.getAttribute("data-theme") || "dark") {
  document.querySelectorAll(".diagram-card img").forEach((img) => {
    const currentSrc = img.getAttribute("src") || "";
    const darkSrc = img.dataset.themeSrcDark || diagramSrcForTheme(currentSrc, "dark");

    if (darkSrc === currentSrc && !/assets\/diagrams\/.+\.svg([?#].*)?$/.test(currentSrc)) {
      return;
    }

    img.dataset.themeSrcDark = darkSrc;
    img.dataset.themeSrcLight = img.dataset.themeSrcLight || diagramSrcForTheme(darkSrc, "light");

    const nextSrc = theme === "light" ? img.dataset.themeSrcLight : img.dataset.themeSrcDark;
    if (img.getAttribute("src") !== nextSrc) {
      img.setAttribute("src", nextSrc);
    }
  });
}

function setupThemeAwareDiagrams() {
  updateThemeAwareDiagrams();
}

function setupThemeToggle() {
  const navLinks = document.querySelector(".nav-links");
  if (!navLinks) return;

  const btn = document.createElement("button");
  btn.className = "theme-toggle";
  btn.setAttribute("aria-label", "Toggle dark/light mode");
  btn.innerHTML = `
    <svg class="sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
    <svg class="moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
  `;
  
  // Insert before search or contact
  const searchBtn = navLinks.querySelector(".search-trigger");
  if (searchBtn) {
    navLinks.insertBefore(btn, searchBtn);
  } else {
    navLinks.appendChild(btn);
  }

  function saveTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    btn.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
    updateThemeAwareDiagrams(theme);

    try {
      localStorage.setItem("theme", theme);
    } catch (error) {
      // Theme still changes even when localStorage is blocked.
    }
  }

  let savedTheme = "dark";
  try {
    savedTheme = localStorage.getItem("theme") || "dark";
  } catch (error) {
    savedTheme = document.documentElement.getAttribute("data-theme") || "dark";
  }
  saveTheme(savedTheme);

  btn.addEventListener("click", async (e) => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    const x = e.clientX;
    const y = e.clientY;

    document.documentElement.style.setProperty("--click-x", x + "px");
    document.documentElement.style.setProperty("--click-y", y + "px");

    if (!document.startViewTransition) {
      saveTheme(newTheme);
      return;
    }

    document.documentElement.classList.add("theme-wave-active");
    const transition = document.startViewTransition(() => {
      saveTheme(newTheme);
    });

    try {
      await transition.finished;
    } finally {
      document.documentElement.classList.remove("theme-wave-active");
    }
  });
}

function setupHeroNameCanvas() {
  const canvas = document.getElementById("heroNameCanvas");
  if (!canvas) return;

  const NAME = "Nazeem Massoom Dickey";
  const FONT_WEIGHT = "800";
  const FONT_FAMILY = '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif';

  const reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function getAccentColor() {
    const theme = document.documentElement.getAttribute("data-theme");
    return theme === "light" ? "#2563eb" : "#c084fc";
  }

  function getTextColor() {
    const theme = document.documentElement.getAttribute("data-theme");
    return theme === "light" ? "#102033" : "#f6f3ff";
  }

  function getFontSize() {
    const w = canvas.parentElement ? canvas.parentElement.offsetWidth : window.innerWidth;
    if (w < 480) return Math.floor(w * 0.085);
    if (w < 768) return Math.floor(w * 0.075);
    return Math.min(Math.floor(w * 0.065), 80);
  }

  const ALIAS = "masternazz";

  // Glitch sequence phases after idle:
  // "corrupt"  — rapid random char scramble, RGB shift
  // "alias"    — hold "masternazz" clearly for ~40 frames
  // "recover"  — scramble back to real name
  // "done"     — back to normal idle
  const PHASES = ["idle", "corrupt", "alias", "recover"];

  let fontSize = getFontSize();
  let charCount = 0;
  let cursorOn = true;
  let lastCursorFlip = 0;
  let lastCharTime = 0;
  let idleStart = 0;
  let phase = "typing";
  let phaseStart = 0;
  let displayText = "";
  let rafId = null;

  const GLITCH_CHARS = "!@#$%^&*<>?/\\|[]{}~`";
  function randGlitch() { return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]; }

  function scrambleBetween(from, to, progress) {
    const len = Math.round(from.length + (to.length - from.length) * progress);
    let out = "";
    for (let i = 0; i < len; i++) {
      const fChar = from[i] || "";
      const tChar = to[i] || "";
      if (fChar === tChar) { out += fChar; continue; }
      out += Math.random() < 0.45 ? randGlitch() : (Math.random() < 0.5 ? fChar : tChar);
    }
    return out;
  }

  function resize() {
    fontSize = getFontSize();
    const font = `${FONT_WEIGHT} ${fontSize}px ${FONT_FAMILY}`;
    const ctx = canvas.getContext("2d");
    ctx.font = font;
    const metrics = ctx.measureText(NAME);
    const w = Math.ceil(metrics.width) + fontSize;
    const h = Math.ceil(fontSize * 1.22);
    canvas.width = w * window.devicePixelRatio;
    canvas.height = h * window.devicePixelRatio;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  function drawFrame() {
    const ctx = canvas.getContext("2d");
    const font = `${FONT_WEIGHT} ${fontSize}px ${FONT_FAMILY}`;
    const w = canvas.width / window.devicePixelRatio;
    const h = canvas.height / window.devicePixelRatio;
    const accent = getAccentColor();
    const textColor = getTextColor();
    const baseline = Math.floor(h * 0.82);
    const isGlitchPhase = phase === "corrupt" || phase === "recover";

    ctx.clearRect(0, 0, w, h);

    if (isGlitchPhase) {
      // RGB chromatic aberration
      const offsets = [
        { dx: -4, color: "rgba(255,0,80,0.5)" },
        { dx:  4, color: "rgba(0,200,255,0.5)" },
      ];
      offsets.forEach(({ dx, color }) => {
        ctx.save();
        ctx.globalCompositeOperation = "screen";
        ctx.font = font;
        ctx.fillStyle = color;
        ctx.fillText(displayText, dx, baseline);
        ctx.restore();
      });

      // Scanlines
      const barCount = 2 + Math.floor(Math.random() * 4);
      for (let i = 0; i < barCount; i++) {
        const y = Math.random() * h;
        ctx.fillStyle = `rgba(${Math.random() > 0.5 ? "192,132,252" : "34,211,238"},0.18)`;
        ctx.fillRect(0, y, w, 1 + Math.random() * 3);
      }
    }

    // Main text
    ctx.font = font;
    ctx.fillStyle = phase === "alias" ? accent : textColor;
    ctx.fillText(displayText, 0, baseline);

    // Cursor — show during typing and idle, hide during glitch sequence
    const showCursor = (phase === "typing" || phase === "idle") && cursorOn;
    if (showCursor) {
      ctx.font = font;
      const cx = ctx.measureText(displayText).width + 4;
      const ch = fontSize * 0.78;
      const cy = baseline - fontSize * 0.74;
      ctx.fillStyle = accent;
      ctx.fillRect(cx, cy, Math.max(3, fontSize * 0.055), ch);
    }
  }

  function tick(now) {
    rafId = null;

    // Cursor blink — 530ms interval regardless of fps
    if (now - lastCursorFlip > 530) {
      cursorOn = !cursorOn;
      lastCursorFlip = now;
    }

    if (phase === "typing") {
      // One char every 55ms
      if (now - lastCharTime > 55 && charCount < NAME.length) {
        charCount++;
        lastCharTime = now;
      }
      displayText = NAME.slice(0, charCount);
      if (charCount >= NAME.length) {
        phase = "idle";
        idleStart = now;
      }
      drawFrame();
      rafId = requestAnimationFrame(tick);
      return;
    }

    if (phase === "idle") {
      displayText = NAME;
      // Trigger glitch every 8 seconds of idle
      if (now - idleStart > 8000) {
        phase = "corrupt";
        phaseStart = now;
      }
      drawFrame();
      rafId = requestAnimationFrame(tick);
      return;
    }

    if (phase === "corrupt") {
      // Scramble over 400ms
      const progress = Math.min((now - phaseStart) / 400, 1);
      displayText = scrambleBetween(NAME, ALIAS, progress);
      if (progress >= 1) { phase = "alias"; phaseStart = now; }
      drawFrame();
      rafId = requestAnimationFrame(tick);
      return;
    }

    if (phase === "alias") {
      // Hold "masternazz" for 900ms
      displayText = ALIAS;
      if (now - phaseStart > 900) { phase = "recover"; phaseStart = now; }
      drawFrame();
      rafId = requestAnimationFrame(tick);
      return;
    }

    if (phase === "recover") {
      // Scramble back over 400ms
      const progress = Math.min((now - phaseStart) / 400, 1);
      displayText = scrambleBetween(ALIAS, NAME, progress);
      if (progress >= 1) {
        phase = "idle";
        displayText = NAME;
        cursorOn = true;
        idleStart = now;
      }
      drawFrame();
      rafId = requestAnimationFrame(tick);
      return;
    }
  }

  resize();
  displayText = "";
  drawFrame();

  if (!reducedMotion) {
    rafId = requestAnimationFrame((now) => {
      lastCharTime = now;
      lastCursorFlip = now;
      idleStart = now;
      tick(now);
    });
  } else {
    phase = "idle";
    charCount = NAME.length;
    displayText = NAME;
    cursorOn = false;
    drawFrame();
  }

  window.addEventListener("resize", () => {
    resize();
    drawFrame();
  }, { passive: true });

  // Re-draw on theme change so colors update
  const observer = new MutationObserver(() => { drawFrame(); });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
}

function setupScrollProgress() {
  const bar = document.getElementById("scrollProgress");
  if (!bar) return;

  function update() {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = total > 0 ? (scrolled / total * 100).toFixed(2) + "%" : "0%";
  }

  window.addEventListener("scroll", update, { passive: true });
  update();
}

function setupRoleRotator() {
  const el = document.getElementById("roleRotator");
  if (!el) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    el.textContent = "Junior Network Admin";
    el.style.borderRight = "none";
    return;
  }

  const roles = [
    "Junior Network Admin",
    "SOC Analyst",
    "NOC Technician",
    "MSP Technician",
    "IT Support Specialist",
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let lastTick = 0;
  const TYPE_SPEED = 68;
  const DELETE_SPEED = 34;
  const HOLD_MS = 2200;
  let holdUntil = 0;

  function tick(now) {
    requestAnimationFrame(tick);
    if (holdUntil && now < holdUntil) return;
    if (now - lastTick < (deleting ? DELETE_SPEED : TYPE_SPEED)) return;
    lastTick = now;
    const current = roles[roleIdx];
    if (!deleting) {
      charIdx++;
      el.textContent = current.slice(0, charIdx);
      if (charIdx >= current.length) { deleting = true; holdUntil = now + HOLD_MS; }
    } else {
      charIdx--;
      el.textContent = current.slice(0, charIdx);
      if (charIdx === 0) { deleting = false; roleIdx = (roleIdx + 1) % roles.length; holdUntil = now + 300; }
    }
  }

  requestAnimationFrame(tick);
}

function setupCertCounter() {
  const el = document.getElementById("certCounter");
  if (!el) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    el.textContent = el.dataset.target;
    return;
  }

  const target = parseInt(el.dataset.target, 10);
  let started = false;

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !started) {
      started = true;
      observer.disconnect();
      const duration = 1400;
      const startTime = performance.now();
      function tick(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      }
      requestAnimationFrame(tick);
    }
  }, { threshold: 0.4 });

  observer.observe(el);
}

function setupActiveNav() {
  const sections = ["#projects", "#skills", "#timeline", "#contact"]
    .map(id => document.querySelector(id))
    .filter(Boolean);

  const navLinks = document.querySelectorAll(".nav-links a");
  if (!navLinks.length || !sections.length) return;

  function getLinkForSection(section) {
    const id = "#" + section.id;
    return [...navLinks].find(a => a.getAttribute("href") === id || a.getAttribute("href") === "index.html" + id);
  }

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const link = getLinkForSection(entry.target);
      if (!link) continue;
      if (entry.isIntersecting) {
        navLinks.forEach(a => a.classList.remove("is-active"));
        link.classList.add("is-active");
      }
    }
  }, { rootMargin: "-30% 0px -60% 0px" });

  sections.forEach(s => observer.observe(s));
}

document.addEventListener("DOMContentLoaded", () => {
  setupProjectFilters();
  setupCursorSpotlight();
  setupGlassPanels();
  setupSearch();
  setupThemeAwareDiagrams();
  setupThemeToggle();
  setupHeroNameCanvas();
  setupScrollProgress();
  setupRoleRotator();
  setupCertCounter();
  setupActiveNav();
});
