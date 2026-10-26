"use strict";

const SETS = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.<>?/~"
};
const AMBIGUOUS = /[O0lI1]/g;

const $ = (id) => document.getElementById(id);
const els = {
  password: $("password"), length: $("length"), lengthValue: $("lengthValue"),
  upper: $("upper"), lower: $("lower"), numbers: $("numbers"), symbols: $("symbols"),
  ambiguous: $("ambiguous"), generate: $("generateBtn"), copy: $("copyBtn"),
  fill: $("meterFill"), label: $("strengthLabel"), entropy: $("entropyText"), error: $("error")
};

// Unbiased random integer in [0, max) using rejection sampling.
function randomInt(max) {
  const limit = Math.floor(0x100000000 / max) * max;
  const buf = new Uint32Array(1);
  do { crypto.getRandomValues(buf); } while (buf[0] >= limit);
  return buf[0] % max;
}

function activePools() {
  const pools = [];
  for (const key of ["upper", "lower", "numbers", "symbols"]) {
    if (els[key].checked) {
      let chars = SETS[key];
      if (els.ambiguous.checked) chars = chars.replace(AMBIGUOUS, "");
      if (chars) pools.push(chars);
    }
  }
  return pools;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildPassword(length, pools) {
  const all = pools.join("");
  // Guarantee at least one character from every selected type.
  const chars = pools.map((p) => p[randomInt(p.length)]);
  while (chars.length < length) chars.push(all[randomInt(all.length)]);
  return shuffle(chars).join("");
}

function rate(bits) {
  if (bits < 40) return ["Weak", 25, "var(--weak)"];
  if (bits < 60) return ["Fair", 50, "var(--fair)"];
  if (bits < 80) return ["Good", 75, "var(--good)"];
  return ["Strong", 100, "var(--strong)"];
}

function generate() {
  const pools = activePools();
  els.lengthValue.textContent = els.length.value;
  if (pools.length === 0) {
    els.error.hidden = false;
    els.password.textContent = "\u00A0";
    els.fill.style.width = "0";
    els.label.textContent = "–";
    els.entropy.textContent = "";
    return;
  }
  els.error.hidden = true;
  const length = Math.max(Number(els.length.value), pools.length);
  els.password.textContent = buildPassword(length, pools);

  const poolSize = new Set(pools.join("")).size;
  const bits = length * Math.log2(poolSize);
  const [name, pct, color] = rate(bits);
  els.fill.style.width = pct + "%";
  els.fill.style.background = color;
  els.label.textContent = name;
  els.entropy.textContent = "(about " + Math.round(bits) + " bits of entropy)";
  els.copy.textContent = "Copy";
}

async function copy() {
  const text = els.password.textContent.trim();
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    els.copy.textContent = "Copied";
  } catch {
    const range = document.createRange();
    range.selectNodeContents(els.password);
    const sel = getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    els.copy.textContent = "Press Ctrl+C";
  }
  setTimeout(() => (els.copy.textContent = "Copy"), 1800);
}

els.generate.addEventListener("click", generate);
els.copy.addEventListener("click", copy);
els.length.addEventListener("input", generate);
["upper", "lower", "numbers", "symbols", "ambiguous"].forEach((k) =>
  els[k].addEventListener("change", generate)
);
generate();
