const PALETTE = ["#2d2a26", "#f2a7b3", "#f2c46d", "#8ccf9a", "#7dc9c1", "#7aa6f8", "#c4a0ff", "#f0b7d6"];
const STEPS = [
  { title: "First Sketch", desc: "Draw a tiny memory. Keep it simple and pixel-y." },
  { title: "Second Sketch", desc: "Add a second doodle to keep the story going." },
  { title: "Final Sketch", desc: "Finish with one last tiny sketch." },
  { title: "Add a Message", desc: "Write a short note to go with your sketches." }
];

let currentStep = 0;
let activeColor = PALETTE[0];
let isDrawing = false;
let sketches = [
  Array(16).fill(null).map(() => Array(16).fill(null)),
  Array(16).fill(null).map(() => Array(16).fill(null)),
  Array(16).fill(null).map(() => Array(16).fill(null))
];

// DOM Elements
const canvasContainer = document.getElementById("canvas-container");
const paletteContainer = document.getElementById("palette-container");
const wizardView = document.getElementById("wizard-view");
const successView = document.getElementById("success-view");

function initCanvas() {
  canvasContainer.innerHTML = '';
  const grid = document.createElement("div");
  grid.className = "canvas-grid";
  
  // Create 16x16 grid
  for (let r = 0; r < 16; r++) {
    for (let c = 0; c < 16; c++) {
      const cell = document.createElement("button");
      cell.className = "canvas-cell";
      cell.dataset.r = r;
      cell.dataset.c = c;
      
      const color = sketches[currentStep][r][c];
      if (color) cell.style.backgroundColor = color;
      
      cell.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        isDrawing = true;
        paint(cell, r, c);
      });
      cell.addEventListener("pointerenter", () => {
        if (isDrawing) paint(cell, r, c);
      });
      grid.appendChild(cell);
    }
  }

  // Touch support for drag drawing
  grid.addEventListener("touchmove", (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const touch = e.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    if (target && target.classList.contains("canvas-cell")) {
      paint(target, parseInt(target.dataset.r), parseInt(target.dataset.c));
    }
  }, { passive: false });

  canvasContainer.appendChild(grid);
}

function paint(cell, r, c) {
  cell.style.backgroundColor = activeColor || "white";
  sketches[currentStep][r][c] = activeColor;
}

window.addEventListener("pointerup", () => isDrawing = false);
window.addEventListener("pointercancel", () => isDrawing = false);
window.addEventListener("touchend", () => isDrawing = false);

function initPalette() {
  paletteContainer.innerHTML = '';
  const swatches = [...PALETTE, null];
  
  swatches.forEach(color => {
    const btn = document.createElement("button");
    btn.className = "swatch" + (color === activeColor ? " active" : "");
    btn.style.backgroundColor = color || "white";
    
    if (!color) {
      btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#71717a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/><path d="M22 21H7"/><path d="m5 11 9 9"/></svg>`;
    } else {
      btn.style.boxShadow = `inset 0 0 0 1px rgba(0,0,0,0.1)`;
    }

    btn.onclick = () => {
      activeColor = color;
      initPalette();
    };
    paletteContainer.appendChild(btn);
  });
}

function updateUI() {
  document.getElementById("step-badge").innerText = `Step ${currentStep + 1} of 4`;
  document.getElementById("step-title").innerText = STEPS[currentStep].title;
  document.getElementById("step-desc").innerText = STEPS[currentStep].desc;

  const steps = document.querySelectorAll(".progress-step");
  steps.forEach((el, i) => el.className = `progress-step ${i <= currentStep ? "active" : ""}`);

  document.getElementById("canvas-area").style.display = currentStep < 3 ? "flex" : "none";
  document.getElementById("message-area").style.display = currentStep === 3 ? "flex" : "none";
  
  const nextBtn = document.getElementById("next-btn");
  nextBtn.innerText = currentStep === 3 ? "Send Note" : "Next";
  nextBtn.className = currentStep === 3 ? "btn btn-accent" : "btn btn-primary";
  
  const backBtn = document.getElementById("back-btn");
  backBtn.innerText = currentStep === 0 ? "Home" : "Back";

  if (currentStep < 3) {
    initCanvas();
  }
}

document.getElementById("next-btn").addEventListener("click", async () => {
  if (currentStep < 3) {
    currentStep++;
    updateUI();
  } else {
    // Send
    const btn = document.getElementById("next-btn");
    btn.disabled = true;
    btn.innerText = "Sending...";
    document.getElementById("error-msg").style.display = "none";

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sketches,
          message: document.getElementById("message-input").value
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const url = `${window.location.origin}/v/${data.id}`;
      wizardView.style.display = "none";
      successView.style.display = "flex";
      document.getElementById("share-url").value = url;
      document.getElementById("preview-link").href = url;
    } catch (e) {
      document.getElementById("error-msg").innerText = e.message;
      document.getElementById("error-msg").style.display = "block";
      btn.disabled = false;
      btn.innerText = "Send Note";
    }
  }
});

document.getElementById("back-btn").addEventListener("click", () => {
  if (currentStep > 0) {
    currentStep--;
    updateUI();
  } else {
    window.location.href = "/";
  }
});

document.getElementById("clear-btn").addEventListener("click", () => {
  sketches[currentStep] = Array(16).fill(null).map(() => Array(16).fill(null));
  initCanvas();
});

const msgInput = document.getElementById("message-input");
msgInput.addEventListener("input", (e) => {
  document.getElementById("char-count").innerText = `${e.target.value.length}/280`;
});

document.getElementById("copy-btn").addEventListener("click", async () => {
  const btn = document.getElementById("copy-btn");
  await navigator.clipboard.writeText(document.getElementById("share-url").value);
  btn.innerText = "Copied!";
  setTimeout(() => btn.innerText = "Copy link", 1500);
});

// Init
initPalette();
updateUI();
