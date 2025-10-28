async function loadData() {
  let data;

  try {
    data = await d3.csv("filtered_owid_data.csv", d3.autoType);
    console.log("Loaded CSV rows:", data.length);
  } catch (err) {
    console.warn("Could not load CSV, using fallback data.", err);
    data = [{ country: "United States", year: 2023, co2: 4911.391 }];
  }

  const usa2023 = data.find(d => d.country === "United States" && +d.year === 2023);
  console.log("Found USA 2023 data:", usa2023);

  const summaryEl = document.getElementById("usa-summary");
  const blockEl = document.getElementById("usa-block");

  if (!usa2023) {
    summaryEl.textContent = "No 2023 data for the U.S. found.";
    return;
  }

  // Compute data
  const co2_million_tonnes = usa2023.co2;
  const co2_tonnes = co2_million_tonnes * 1e6;
  const pixels_needed = co2_tonnes / 5;

  // ✅ Display summary
  const summary = `In 2023, the U.S. emitted ${co2_million_tonnes.toLocaleString()} million tonnes of CO₂ — 
  equivalent to about ${pixels_needed.toExponential(2)} pixels (1px = 5 tonnes).`;
  summaryEl.textContent = summary;

  // ✅ Make the block visible and scaled
  const widthVW = Math.log10(pixels_needed) * 250;
  
  blockEl.style.width = widthVW + "vw";
  blockEl.style.height = "400px";
  blockEl.style.background = "linear-gradient(90deg, #000000, #505050)";
  blockEl.style.marginTop = "40px";

  // ✅ Force horizontal scroll space
  document.body.style.width = (widthVW + 400) + "vw";

  console.log("Set USA block width:", blockEl.style.width);
}
loadData();
