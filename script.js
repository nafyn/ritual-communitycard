const pseudoInput = document.getElementById("pseudo");
const roleSelect = document.getElementById("role");
const avatarInput = document.getElementById("avatarInput");

const pseudoDisplay = document.getElementById("pseudoDisplay");
const roleDisplay = document.getElementById("roleDisplay");
const descDisplay = document.getElementById("descDisplay");
const avatarPreview = document.getElementById("avatarPreview");
const rarityPill = document.getElementById("rarityPill"); // ✅ on récupère le pill

const descs = [
  "this user lives in the Infernet",
  "this user was born to bring AI computation",
  "this user believes in the end of opaque algorithms",
  "this user wondered how AI can natively live onchain",
  "this user knows what TEEs mean",
  "this user will follow you through your API calls"
];

// -------------------- DISPLAY UPDATE --------------------
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

  // ✅ c’est ICI qu’on met à jour le pill
  rarityPill.textContent = grade;
}

pseudoInput.addEventListener("input", update);
roleSelect.addEventListener("change", update);

avatarInput.addEventListener("change", () => {
  const file = avatarInput.files[0];
  if (!file) return;
  avatarPreview.src = URL.createObjectURL(file);
});

// -------------------- DOWNLOAD --------------------
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
