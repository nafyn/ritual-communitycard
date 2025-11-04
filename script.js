// --- Elements ---
const pseudoInput   = document.getElementById("pseudo");
const roleSelect    = document.getElementById("role");
const avatarInput   = document.getElementById("avatarInput");

const pseudoDisplay = document.getElementById("pseudoDisplay");
const roleDisplay   = document.getElementById("roleDisplay");
const descDisplay   = document.getElementById("descDisplay");
const avatarPreview = document.getElementById("avatarPreview");
const rarityPill    = document.getElementById("rarityPill");

// --- Descriptions pool ---
const descs = [
  "this user lives in the Infernet",
  "this user was born to bring AI computation",
  "this user believes in the end of opaque algorithms",
  "this user wondered how AI can natively live onchain",
  "this user knows what TEEs mean",
  "this user will follow you through your API calls"
];

// ✅ Pick description ONCE
descDisplay.textContent = descs[Math.floor(Math.random() * descs.length)];

// --- Role → Rarity ---
function getGrade(role) {
  if (["Initiate","Ritualist Ascendant"].includes(role)) return "Common";
  if (["Ritty Bitty","Ritty"].includes(role))           return "Rare";
  if (["Ritualist","Zealot"].includes(role))            return "Legendary";
  if (["Mods","Foundation Team"].includes(role))        return "Epic";
  return "Common";
}

// --- Update card preview ---
function update() {
  const pseudo = pseudoInput.value || "Unnamed Ritualist";
  const role = roleSelect.value || "Initiate";
  const grade  = getGrade(role);

  pseudoDisplay.textContent = pseudo;

  // Role + rarity rendered inline
  roleDisplay.innerHTML = `
    <span class="text-acc">${role}</span>
    <span class="opacity-40 mx-1">·</span>
    <span class="text-white/60">${grade}</span>
  `;

  rarityPill.textContent = grade;
}
pseudoInput.addEventListener("input", update);
roleSelect.addEventListener("change", update);

// --- Avatar preview ---
avatarInput.addEventListener("change", () => {
  const f = avatarInput.files?.[0];
  avatarPreview.src = f ? URL.createObjectURL(f) : "pepefront.png";
});

// --- Copy card to clipboard ---
async function copyCardToClipboard() {
  const card       = document.getElementById("card");
  const hint       = document.querySelector(".copy-hint");
  const feedback   = document.querySelector(".copy-feedback");
  const summon     = document.querySelector(".copy-summon");
  const cardContent = card.cloneNode(true);

  // Remove UI overlays
  hint.style.opacity = "0";
  summon.style.opacity = "0";
  feedback.style.opacity = "0";

  // Create clean export wrapper
  const temp = document.createElement("div");
  temp.style.position = "fixed";
  temp.style.left = "-9999px";
  temp.appendChild(cardContent);
  document.body.appendChild(temp);

  const blob = await htmlToImage.toBlob(cardContent, {
    pixelRatio: 2,
    backgroundColor: "#0d1512"
  });

  document.body.removeChild(temp);
  await navigator.clipboard.write([ new ClipboardItem({ "image/png": blob }) ]);

  // Summoning animation
  card.classList.add("summoning");
  summon.style.opacity = 1;

  setTimeout(() => {
    summon.style.opacity = 0;
    card.classList.remove("summoning");

    card.classList.add("copied");
    feedback.style.opacity = 1;

    setTimeout(() => {
      feedback.style.opacity = 0;
      card.classList.remove("copied");
      hint.style.opacity = "";
    }, 750);

  }, 2000);
}

document.getElementById("card").addEventListener("click", copyCardToClipboard);

// --- Tweet button ---
document.getElementById("pledgeBtn").addEventListener("click", () => {
  const tweetText = encodeURIComponent(
`i have taken the pledge. the ritual grows stronger 🕯️

take yours on https://nafyn.github.io/ritual-communitycard/`
  );
  window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, "_blank");
});

// --- Create the summoning label if missing ---
if (!document.querySelector(".copy-summon")) {
  const card = document.getElementById("card");
  const summonSpan = document.createElement("span");
  summonSpan.className = "copy-summon absolute bottom-[38px] right-[38px] text-[18px] text-[#8AF2B8] opacity-0 pointer-events-none";
  summonSpan.textContent = "[ summoning… ] ✧⟡";
  card.appendChild(summonSpan);
}

update();
