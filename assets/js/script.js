const email = "NazeemDickey@gmail.com";

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

function setupSearch() {
  // Detect depth: pages/ subdir has root at ../
  const isSubpage = location.pathname.includes("/pages/");
  const root = isSubpage ? "../" : "";

  const INDEX = [
    { title: "Home", url: root + "index.html", icon: "🏠", desc: "Portfolio landing page", keywords: "home portfolio nazeem network admin soc noc msp skills projects contact hero" },
    { title: "Certifications", url: root + "pages/certifications.html", icon: "🏅", desc: "All 29 certifications", keywords: "certifications certs comptia cysa security+ network+ a+ microsoft azure az-900 sc-900 ai-900 dp-900 pl-900 cisco ccst credly its pearson quickbooks skillsusa csap csis cios" },
    { title: "Resume", url: root + "pages/resume.html", icon: "📄", desc: "Resume overview page", keywords: "resume cv styled ats pdf download work experience education skills" },
    { title: "Resume (Styled)", url: root + "pages/resume-styled.html", icon: "📄", desc: "Visual styled resume", keywords: "resume styled pdf print download" },
    { title: "Resume (ATS)", url: root + "pages/resume-ats.html", icon: "📄", desc: "ATS plain-text resume", keywords: "resume ats plain text applicant tracking system" },
    { title: "Enterprise Homelab", url: root + "pages/homelab.html", icon: "🖥️", desc: "Full network architecture and hardware", keywords: "homelab proxmox cisco synology dell server esxi network topology infrastructure switches vlan vlans rack enterprise" },
    { title: "Proxmox", url: root + "pages/proxmox.html", icon: "⚙️", desc: "Proxmox VE cluster setup", keywords: "proxmox ve cluster virtual machines vm lxc containers hypervisor pve node" },
    { title: "OPNsense Firewall", url: root + "pages/opnsense.html", icon: "🛡️", desc: "OPNsense firewall config", keywords: "opnsense firewall pfsense rules nat wan lan vlan ids ips suricata dns dhcp" },
    { title: "Switching & VLANs", url: root + "pages/switching.html", icon: "🔀", desc: "Cisco switch configuration and VLANs", keywords: "switching vlans cisco catalyst trunk access port stp spanning tree inter-vlan routing layer 3" },
    { title: "Remote Access", url: root + "pages/remote-access.html", icon: "🔐", desc: "VPN and remote access setup", keywords: "remote access vpn wireguard tailscale cloudflare tunnel ssl tls ssh reverse proxy" },
    { title: "Identity & Directory", url: root + "pages/identity.html", icon: "👤", desc: "Active Directory and identity management", keywords: "active directory identity ldap ad domain controller users groups gpo samba" },
    { title: "Wazuh SIEM", url: root + "pages/wazuh.html", icon: "🔍", desc: "Wazuh SIEM and log monitoring", keywords: "wazuh siem log monitoring alerts security events ossec xdr edr threat detection soc" },
    { title: "Live Status", url: root + "pages/status.html", icon: "📡", desc: "Live homelab service status", keywords: "status live uptime services monitoring ping health check" },
    { title: "Writeups", url: root + "pages/writeups.html", icon: "✍️", desc: "Technical writeups and competition reports", keywords: "writeups ctf competition skillsusa cyberlaunch blog reports technical" },
    { title: "SkillsUSA", url: root + "pages/skillsusa.html", icon: "🥇", desc: "SkillsUSA 1st place — Internetworking", keywords: "skillsusa first place 1st internetworking florida competition networking trophy award" },
    { title: "CyberLaunch 2026 Writeup", url: root + "pages/writeup-cyberlaunch-2026.html", icon: "✍️", desc: "CyberLaunch 2026 competition writeup", keywords: "cyberlaunch 2026 competition writeup ctf cybersecurity" },
    { title: "My Journey", url: root + "pages/journey.html", icon: "🗺️", desc: "Timeline of certs and milestones", keywords: "journey timeline milestones certifications history story path career" },
  ];

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
      ? INDEX.map(item => ({ item, score: rank(item, trimmed) }))
          .filter(x => x.score > 0)
          .sort((a, b) => b.score - a.score)
          .map(x => x.item)
      : INDEX;

    if (!items.length) {
      results.innerHTML = `<div class="search-empty">No results for "<strong>${trimmed}</strong>"</div>`;
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
    input.value = "";
    render("");
    requestAnimationFrame(() => input.focus());
  }

  function close() {
    overlay.classList.remove("is-open");
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
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      overlay.classList.contains("is-open") ? close() : open();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupProjectFilters();
  setupCursorSpotlight();
  setupGlassPanels();
  setupSearch();
});
