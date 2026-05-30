document.addEventListener("DOMContentLoaded", async () => {
  const pathParts = window.location.pathname.split("/");
  const noteId = pathParts[pathParts.length - 1];

  const loadingEl = document.getElementById("loading");
  const errorEl = document.getElementById("error");
  const envelopeScene = document.getElementById("envelope-scene");
  const envelope = document.getElementById("envelope");
  const revealEl = document.getElementById("envelope-reveal");
  const container = document.getElementById("sketches-container");
  const messageDisplay = document.getElementById("message-display");

  let noteData = null;

  try {
    const res = await fetch(`/api/notes/${noteId}`);
    if (!res.ok) {
      throw new Error("Note not found or expired.");
    }
    
    noteData = await res.json();
    loadingEl.style.display = "none";

    // Show the envelope ready to be opened
    envelopeScene.style.display = "block";

  } catch (err) {
    loadingEl.style.display = "none";
    errorEl.innerText = err.message;
    errorEl.style.display = "block";
    return;
  }

  // ── Sparkle burst effect ──
  function spawnSparkles(x, y) {
    const emojis = ["✨", "⭐", "💖", "🌸", "✦"];
    for (let i = 0; i < 12; i++) {
      const sparkle = document.createElement("span");
      sparkle.className = "sparkle";
      sparkle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      
      const angle = (Math.PI * 2 * i) / 12;
      const dist = 60 + Math.random() * 80;
      sparkle.style.left = x + "px";
      sparkle.style.top = y + "px";
      sparkle.style.setProperty("--sx", Math.cos(angle) * dist + "px");
      sparkle.style.setProperty("--sy", Math.sin(angle) * dist + "px");
      sparkle.style.animationDuration = (0.6 + Math.random() * 0.6) + "s";
      
      document.body.appendChild(sparkle);
      sparkle.addEventListener("animationend", () => sparkle.remove());
    }
  }

  // ── Render content (called after envelope opens) ──
  function renderNote() {
    const sketches = noteData.sketches || [];
    sketches.forEach((grid, index) => {
      const wrapper = document.createElement("div");
      wrapper.className = "sketch-card";
      
      if (index === 2) {
        wrapper.style.gridColumn = "span 2";
        wrapper.style.margin = "0 auto";
        wrapper.style.maxWidth = "60%";
        wrapper.style.width = "100%";
      } else {
        wrapper.style.width = "100%";
      }

      const miniGrid = document.createElement("div");
      miniGrid.className = "mini-grid";
      
      const gridSize = grid.length || 32;
      for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
          const cell = document.createElement("div");
          cell.className = "mini-cell";
          const raw = grid[r] && grid[r][c];
          const color = (typeof raw === "string" && /^#[0-9a-fA-F]{3,8}$/.test(raw)) ? raw : null;
          cell.style.backgroundColor = color || "#ffffff";
          miniGrid.appendChild(cell);
        }
      }
      
      // Update grid-template-columns for the actual grid size
      miniGrid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
      
      wrapper.appendChild(miniGrid);
      container.appendChild(wrapper);

      // Stagger the reveal of each sketch card
      setTimeout(() => wrapper.classList.add("show"), 100 + index * 200);
    });

    // Render Message
    messageDisplay.innerText = noteData.message || "No message attached, just pixels.";
  }

  // ── Envelope click handler ──
  let opened = false;
  envelope.addEventListener("click", (e) => {
    if (opened) return;
    opened = true;

    // Sparkle burst from the seal
    const rect = envelope.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.bottom;
    spawnSparkles(cx, cy);

    // Start opening animation
    envelope.classList.add("opening");

    // After flap opens and letter slides, transition to content
    setTimeout(() => {
      envelopeScene.classList.add("hide");

      setTimeout(() => {
        envelopeScene.style.display = "none";

        // Render the note content
        renderNote();

        // Show the reveal container
        revealEl.style.display = "flex";
        revealEl.classList.add("show");

        // Trigger message reveal
        const msgCard = revealEl.querySelector(".message-reveal");
        if (msgCard) msgCard.classList.add("show");

      }, 400);
    }, 1200);
  });
});
