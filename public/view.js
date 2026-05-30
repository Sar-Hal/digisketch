document.addEventListener("DOMContentLoaded", async () => {
  const pathParts = window.location.pathname.split("/");
  const noteId = pathParts[pathParts.length - 1];

  const loadingEl = document.getElementById("loading");
  const errorEl = document.getElementById("error");
  const revealEl = document.getElementById("envelope-reveal");
  const container = document.getElementById("sketches-container");
  const messageDisplay = document.getElementById("message-display");

  try {
    const res = await fetch(`/api/notes/${noteId}`);
    if (!res.ok) {
      throw new Error("Note not found or expired.");
    }
    
    const note = await res.json();
    loadingEl.style.display = "none";
    
    // Render Grids
    const sketches = note.sketches || [];
    sketches.forEach((grid, index) => {
      const wrapper = document.createElement("div");
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
      
      for (let r = 0; r < 32; r++) {
        for (let c = 0; c < 32; c++) {
          const cell = document.createElement("div");
          cell.className = "mini-cell";
          const color = grid[r] && grid[r][c];
          cell.style.backgroundColor = color || "#ffffff";
          miniGrid.appendChild(cell);
        }
      }
      
      wrapper.appendChild(miniGrid);
      container.appendChild(wrapper);
    });

    // Render Message
    messageDisplay.innerText = note.message || "No message attached, just pixels.";

    // Show Reveal
    revealEl.style.display = "flex";

  } catch (err) {
    loadingEl.style.display = "none";
    errorEl.innerText = err.message;
    errorEl.style.display = "block";
  }
});
