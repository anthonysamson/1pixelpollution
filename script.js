// 1 pixel = 1 person's annual CO2 emissions (≈5 tonnes)
const TONNES_PER_PIXEL = 5;
const SCALE = 1 / 1000000; // shrink factor to make the bars fit on screen
const AVERAGE_PERSON_CO2 = 5; // tonnes per person per year
const TARGET_YEAR = 2022;

// Load CSV
d3.csv("co2_data.csv").then(data => {
  const countries = ["China", "United States", "Russia"];
  const filtered = data.filter(d => +d.year === TARGET_YEAR && countries.includes(d.country));

  const visData = [
    { label: "Average Person", co2_tonnes: AVERAGE_PERSON_CO2 },
    ...filtered.map(d => ({
      label: d.country,
      co2_tonnes: +d.co2 * 1e6, // million tonnes → tonnes
      share: +d.share_global_cumulative_co2
    }))
  ];

  // Compute pixel widths based on "people equivalents"
  visData.forEach(d => {
    const peopleEquivalent = d.co2_tonnes / AVERAGE_PERSON_CO2; // how many people’s worth
    d.width = peopleEquivalent * SCALE; // scaled-down visual width
  });

  const strip = d3.select("#strip");
  const colors = {
    "Average Person": "#66bb6a",
    "China": "#ef5350",
    "United States": "#42a5f5",
    "Russia": "#ab47bc"
  };

  visData.forEach(d => {
    const container = strip.append("div").style("text-align", "center");

    container.append("div")
      .attr("class", "bar")
      .style("background", colors[d.label])
      .style("width", `${d.width}px`)
      .attr(
        "title",
        `${d.label}: ${Math.round(d.co2_tonnes).toLocaleString()} tonnes CO₂ ≈ ${Math.round(d.co2_tonnes / AVERAGE_PERSON_CO2).toLocaleString()} people`
      );

    container.append("span")
      .attr("class", "label")
      .text(d.label);
  });

  const usa = filtered.find(d => d.country === "United States");
  if (usa) {
    d3.select("#usa-share").text(
      `The United States accounts for ${usa.share_global_cumulative_co2}% of all historical CO₂ emissions.`
    );
  }
});
