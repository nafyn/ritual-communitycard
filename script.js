const pseudoInput = document.getElementById("pseudo");
const roleSelect = document.getElementById("role");
const avatarInput = document.getElementById("avatarInput");

const pseudoDisplay = document.getElementById("pseudoDisplay");
const roleDisplay = document.getElementById("roleDisplay");
const descDisplay = document.getElementById("descDisplay");
const avatarPreview = document.getElementById("avatarPreview");

const descs = [
  "this user lives in the Infernet",
  "this user was born to bring AI computation",
  "this user believes in the end of opaque algorithms",
  "this user wondered how AI can natively live onchain",
  "this user knows what TEEs mean",
  "this user will follow you through your API calls"
];

// --- TILT (survol uniquement) : rAF + clamp + easing ---
const card = document.querySelector(".card");
if (card) {

  const PERSPECTIVE = 1200;   // profondeur
  const SCALE_HOVER = 1.04;   // zoom au survol
  const MAX_DEG     = 14;     // amplitude max (±)
  const SENS        = 18;     // sensibilité (plus petit = plus réactif)
  const EASE        = 0.18;   // lissage (0.1 souple • 0.25 nerveux)

  let curX = 0, curY = 0;     // angles affichés
  let tgtX = 0, tgtY = 0;     // angles visés
  let rafId = null;

  function lerpTilt() {
    curX += (tgtX - curX) * EASE;
    curY += (tgtY - curY) * EASE;

    card.style.transform =
      `perspective(${PERSPECTIVE}px) rotateX(${curY}deg) rotateY(${curX}deg) scale(${SCALE_HOVER})`;

    if (Math.abs(tgtX - curX) > 0.01 || Math.abs(tgtY - curY) > 0.01) {
      rafId = requestAnimationFrame(lerpTilt);
    } else {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width  / 2);
    const y = e.clientY - (r.top  + r.height / 2);

    // mapping lisse + clamp
    const toDegX = Math.max(-MAX_DEG, Math.min(MAX_DEG,  x / SENS)); // -> rotateY
    const toDegY = Math.max(-MAX_DEG, Math.min(MAX_DEG, -y / SENS)); // -> rotateX
    tgtX = toDegX;
    tgtY = toDegY;

    if (!rafId) rafId = requestAnimationFrame(lerpTilt);
  });

  card.addEventListener("mouseleave", () => {
    tgtX = 0; tgtY = 0;                      // retour neutre
    if (!rafId) rafId = requestAnimationFrame(lerpTilt);
  });
}

function getGrade(role) {
  if (["Initiate", "Ritualist Ascendant"].includes(role)) return "Common";
  if (["Ritty Bitty", "Ritty"].includes(role)) return "Rare";
  if (["Ritualist", "Zealot"].includes(role)) return "Legendary";
  if (["Mods", "Foundation Team"].includes(role)) return "Epic";
}

function update() {
  const pseudo = pseudoInput.value || "Unnamed Ritualist";
  const role = roleSelect.value;
  const grade = getGrade(role);
  const randomDesc = descs[Math.floor(Math.random()*descs.length)];

  pseudoDisplay.textContent = pseudo;
  roleDisplay.textContent = `${role} · ${grade}`;
  descDisplay.textContent = randomDesc;
}

pseudoInput.addEventListener("input", update);
roleSelect.addEventListener("change", update);

avatarInput.addEventListener("change", () => {
  const file = avatarInput.files[0];
  if (!file) return;
  avatarPreview.src = URL.createObjectURL(file);
});

document.getElementById("downloadBtn").addEventListener("click", () => {
  const card = document.getElementById("card");
  htmlToImage.toPng(card).then((dataUrl) => {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "ritual_card.png";
    a.click();
  });
});

update();
