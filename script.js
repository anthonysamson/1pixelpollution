async function loadData() {
  let data;

  // Attempt to load in the data from the filtered csv
  try {
    data = await d3.csv("filtered_owid_data.csv", d3.autoType);
  } catch (err) {
    console.warn("Could not load CSV, using fallback data.", err);
    // Set the default data that should be in the csv
    data = [
      { country: "United States", year: 2023, co2: 4911.391, cumulative_co2: 416000 }
    ];
  }

  // Create some variables to be manipulated later for each different block
  const usa2023 = data.find(d => d.country === "United States" && +d.year === 2023);
  const summaryEl = document.getElementById("usa-summary");
  const blockEl = document.getElementById("usa-block");
  const counterEl = document.getElementById("usa-counter");
  const ncBlockEl = document.getElementById("nc-block");
  const ncLabelEl = document.getElementById("nc-label");

  // Create Shell block
  const shellBlockEl = document.createElement("div");
  shellBlockEl.id = "shell-block";
  shellBlockEl.className = "sub-block";
  // Adds the shell block into the usa block
  blockEl.appendChild(shellBlockEl);

  // Add Shell label inside the block
  const shellLabelEl = document.createElement("div");
  shellLabelEl.id = "shell-label";
  shellLabelEl.textContent = "Shell's total CO₂ emissions (116,500,000,000 tonnes)";
  shellBlockEl.appendChild(shellLabelEl);

  // Computes the amount of pixels needed for the usa block
  const co2_million_tonnes = usa2023.cumulative_co2;
  const co2_tonnes = co2_million_tonnes * 1_000_000;
  const pixels_needed = co2_tonnes / 5;

  // Summary to put above the usa block
  summaryEl.textContent = `Since 1800, the U.S. emitted ${co2_million_tonnes.toLocaleString()} million tonnes of CO₂ (~${pixels_needed.toExponential(2)} or ~86,400,000,000 pixels).`;

  // Controls the main USA block
  const widthVW = Math.log10(pixels_needed) * 250;
  blockEl.style.width = widthVW + "vw";
  blockEl.style.height = "400px";
  blockEl.style.background = rgb(0,0,0,0); // FIX THIS
  blockEl.style.marginTop = "40px";
  blockEl.style.position = "relative";

  document.body.style.width = (widthVW + 200) + "vw";

  const totalCO2 = co2_tonnes;

  // NC total contribution calculation
  const ncPopulation = 10_800_000; // North Carolina 2023
  const ncTotalCO2 = ncPopulation * 15; // tonnes

  // Scale NC block width relative to total US CO2
  ncBlockEl.style.width = `${(ncTotalCO2 / totalCO2) * widthVW}vw`;
  ncBlockEl.style.height = "60px";
  ncBlockEl.style.top = "65%";
  ncBlockEl.style.transform = "translateY(-50%)";

  // Shell block style
  const shellTotal = 116_500_000_000;
  shellBlockEl.style.width = `${(shellTotal / totalCO2) * widthVW}vw`;
  shellBlockEl.style.height = "200px";
  shellBlockEl.style.top = "50%";
  shellBlockEl.style.left = "60%";
  shellBlockEl.style.transform = "translate(-50%, -50%)";
  shellBlockEl.style.background = "#ffd600";
  shellBlockEl.style.border = "2px solid white";
  shellBlockEl.style.borderRadius = "8px";
  shellBlockEl.style.opacity = 0;
  shellBlockEl.style.position = "absolute";
  shellBlockEl.style.transition = "opacity 1s ease";

// Counter is the total co2 counter than runs under the usa section
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

    const ncVisible = (progress >= 0.4 && progress <= 0.5) ? 1 : 0;
    ncBlockEl.style.opacity = ncVisible;
    ncLabelEl.style.opacity = ncVisible;

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


// Overlay text while scrolling
window.addEventListener("scroll", () => {
  const scrollX = window.scrollX;
  const maxScroll = document.body.scrollWidth - window.innerWidth;
  const progress = scrollX / maxScroll;

  // Where the text starts and ends
  const start = 0.07;
  const end = 0.37;

  //The three texts by element
  const overlay = document.getElementById("scroll-overlay");
  const texts = [
    document.getElementById("text-1"),
    document.getElementById("text-2"),
    document.getElementById("text-3")
  ];

  texts.forEach(t => (t.style.opacity = 0));
  overlay.style.opacity = 0;

  // Splits up the 3 texts so they appear equaldistant apart
  if (progress >= start && progress <= end) {
    overlay.style.opacity = 1;
    const localProgress = (progress - start) / (end - start);

    if (localProgress < 0.33) texts[0].style.opacity = 1;
    else if (localProgress < 0.66) texts[1].style.opacity = 1;
    else texts[2].style.opacity = 1;
  }
});
