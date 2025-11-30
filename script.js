async function loadData() {
  let data;

  // Attempts to fetch USA data
  try {
    data = await d3.csv("./filtered_owid_data.csv", d3.autoType);
    console.log("Loaded CSV rows:", data.length);
  } catch (err) {
    console.warn("Could not load CSV, using fallback data.", err);
    data = [ // Backup USA data
      { country: "United States", year: 2023, co2: 4911.391, cumulative_co2: 416000 }
    ];
  }

  // Declaration of a bunch of labels/blocks
  const usa2023   = data.find(d => d.country === "United States" && +d.year === 2023);
  const summaryEl = document.getElementById("usa-summary");
  const blockEl   = document.getElementById("usa-block");
  const counterEl = document.getElementById("usa-counter");
  const ncBlockEl = document.getElementById("nc-block");
  const ncLabelEl = document.getElementById("nc-label");

  // Add shell block to main block
  const shellBlockEl = document.createElement("div");  
  shellBlockEl.id = "shell-block";
  shellBlockEl.className = "sub-block";
  blockEl.appendChild(shellBlockEl);

  // Add shell label to main block
  const shellLabelEl = document.createElement("div");
  shellLabelEl.id = "shell-label";
  shellLabelEl.textContent = "Shell's total CO₂ emissions from 1892-2019 (116,500,000,000 tonnes)⁹";
  shellBlockEl.appendChild(shellLabelEl);

  // Math for usa co2
  const co2_million_tonnes = usa2023.cumulative_co2;
  const co2_tonnes = co2_million_tonnes * 1_000_000;
  const pixels_needed = co2_tonnes / 5;

  // Summary for usa
  summaryEl.textContent = `Since 1800, the U.S. emitted ${co2_million_tonnes.toLocaleString()} million tonnes of CO₂ (~${pixels_needed.toExponential(2)} or ~86,400,000,000 pixels)⁶.`;

  // Display of usa pixels
  const widthVW = Math.log10(pixels_needed) * 1000; // Not fully scaled sadly, but will get the point across
  blockEl.style.width = widthVW + "vw";
  blockEl.style.height = "500px";
  blockEl.style.background = "black";
  blockEl.style.marginTop = "40px";
  blockEl.style.position = "relative";
  document.body.style.width = (widthVW + 200) + "vw";
  const usaSection = document.getElementById("usa");
  usaSection.style.width = blockEl.style.width;

  const totalCO2 = co2_tonnes;

  // NC block
  const ncTotalCO2_million = 7324.2; // 7,324.2 million tonnes
  const ncTotalCO2 = ncTotalCO2_million * 1_000_000; // convert to tonnes
  const ncWidth = Math.max((ncTotalCO2 / totalCO2) * widthVW, 10);

  ncBlockEl.style.width = `${ncWidth}vw`;
  ncBlockEl.style.height = "400px";
  ncBlockEl.style.background = "#4B9CD3";
  ncBlockEl.style.border = "2px solid black";
  ncBlockEl.style.position = "absolute";
  ncBlockEl.style.top = "10%";
  ncBlockEl.style.left = "40%";
  ncBlockEl.style.borderRadius = "0px";
  ncBlockEl.style.opacity = 1;
  ncBlockEl.style.transition = "opacity 1s ease";

  // Shell block
  const shellTotal = 116_500_000_000;
  shellBlockEl.style.width = `${(shellTotal / totalCO2) * widthVW}vw`;
  shellBlockEl.style.height = "400px";
  shellBlockEl.style.top = "50%";
  shellBlockEl.style.left = "60%";
  shellBlockEl.style.transform = "translate(-50%, -50%)";
  shellBlockEl.style.background = "#ffd600";
  shellBlockEl.style.border = "2px solid black";
  shellBlockEl.style.borderRadius = "0px";
  shellBlockEl.style.opacity = 0;
  shellBlockEl.style.position = "absolute";
  shellBlockEl.style.transition = "opacity 1s ease";

  // Function for the continious count under usa block
  function updateCounter() {
    const scrollX = window.scrollX;
    const viewportCenter = scrollX + window.innerWidth / 2;

    const usaSection = document.getElementById("usa");
    const usaLeft = usaSection.offsetLeft;
    const usaRight = usaLeft + usaSection.offsetWidth;

    const fadeInStart = usaLeft - window.innerWidth * 0.2;
    const fadeOutEnd = usaRight + window.innerWidth * 0.1;

    if (viewportCenter >= fadeInStart && viewportCenter <= fadeOutEnd) {
      counterEl.style.opacity = 1;

      let progress = (viewportCenter - usaLeft) / usaSection.offsetWidth;
      progress = Math.max(0, Math.min(1, progress));

      const currentCO2 = totalCO2 * progress;
      counterEl.textContent = `${currentCO2.toLocaleString(undefined, {
        maximumFractionDigits: 0,
      })} tonnes CO₂`;

      // Controls when the nc block is visible
      const ncVisible = (progress >= 0.25 && progress <= 0.7) ? 1 : 0;
      ncBlockEl.style.opacity = ncVisible;
      ncLabelEl.style.opacity = ncVisible;

      // Controls when the shell block is visible
      const shellVisible = (progress >= 0.4 && progress <= 0.95) ? 1 : 0;
      shellBlockEl.style.opacity = shellVisible;
      shellLabelEl.style.opacity = shellVisible;
    } else {
      counterEl.style.opacity = 0;
      ncBlockEl.style.opacity = 0;
      ncLabelEl.style.opacity = 0;
      shellBlockEl.style.opacity = 0;
      shellLabelEl.style.opacity = 0;
    }
  }

  updateCounter();
  window.addEventListener("scroll", updateCounter);
}

// All scrolling text is controlled here
window.addEventListener("scroll", () => {
  const scrollX = window.scrollX;
  const maxScroll = document.body.scrollWidth - window.innerWidth;
  const progress = scrollX / maxScroll;

  const overlay = document.getElementById("scroll-overlay");
  const usaTexts = [
    document.getElementById("text-1"),
    document.getElementById("text-2"),
    document.getElementById("text-3"),
    document.getElementById("text-4")
  ];
  const shellTexts = [
    document.getElementById("shell-text-1"),
    document.getElementById("shell-text-2"),
    document.getElementById("shell-text-3")
  ];
  const finalTexts = [
    document.getElementById("final-text-1"),
    document.getElementById("final-text-2"),
    document.getElementById("final-text-3"),
    document.getElementById("final-text-4")
  ];

  // Reset all text opacities
  [...usaTexts, ...shellTexts, ...finalTexts].forEach(t => (t.style.opacity = 0));
  overlay.style.opacity = 0;

  // USA Text Range 
  const usaStart = 0.12;
  const usaEnd = 0.37;

  // Shell Text Range 
  const shellStart = 0.52;
  const shellEnd = 0.70;

  // Final Text Range 
  const finalStart = 0.74;
  const finalEnd = 0.94;

  // USA Fade Logic 
  if (progress >= usaStart && progress <= usaEnd) {
    overlay.style.opacity = 1;
    const localProgress = (progress - usaStart) / (usaEnd - usaStart);
    if (localProgress < 0.25) usaTexts[0].style.opacity = 1;
    else if (localProgress < 0.5) usaTexts[1].style.opacity = 1;
    else if (localProgress < 0.75) usaTexts[2].style.opacity = 1;
    else usaTexts[3].style.opacity = 1;
  }

  // Shell Fade Logic
  if (progress >= shellStart && progress <= shellEnd) {
    overlay.style.opacity = 1;
    const localProgress = (progress - shellStart) / (shellEnd - shellStart);
    if (localProgress < 0.33) shellTexts[0].style.opacity = 1;
    else if (localProgress < 0.66) shellTexts[1].style.opacity = 1;
    else shellTexts[2].style.opacity = 1;
  }

  // Final Fade Logic
  if (progress >= finalStart && progress <= finalEnd) {
    overlay.style.opacity = 1;
    const localProgress = (progress - finalStart) / (finalEnd - finalStart);
    if (localProgress < 0.25) finalTexts[0].style.opacity = 1;
    else if (localProgress < 0.5) finalTexts[1].style.opacity = 1;
    else if (localProgress < 0.75) finalTexts[2].style.opacity = 1;
    else finalTexts[3].style.opacity = 1;
  }
});

// Runs everything
loadData();