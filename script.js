// conversion used on the original: 10 pixels = $5,000,000 -> 1 pixel = $500,000
function dollarsToPixels(dollars){ return Math.round(dollars / 500000); }

// Example data points: label and dollar amount
const items = [
  {label: "$1,000", dollars: 1000},
  {label: "Median US household income", dollars: 68000},
  {label: "$1 million", dollars: 1_000_000},
  {label: "$1 billion", dollars: 1_000_000_000},
  {label: "Elon Musk (example)", dollars: 240_700_000_000}
];

const strip = document.getElementById('strip');
const ruler = document.getElementById('ruler');

// build a long inline visual: concatenate blocks for each item separated by small gaps
let totalWidth = 0;
items.forEach(it=>{
  const w = dollarsToPixels(it.dollars);
  const block = document.createElement('div');
  block.style.display = 'inline-block';
  block.style.width = w + 'px';
  block.style.height = '100%';
  block.title = `${it.label} — $${it.dollars.toLocaleString()}`;
  block.style.borderRight = '1px solid rgba(255,255,255,0.05)';

  // optional: add a small label element at start of each block (keeps page simple)
  const label = document.createElement('span');
  label.textContent = ` ${it.label} `;
  label.style.position = 'relative';
  label.style.left = '0';
  label.style.top = '-1.25rem';
  label.style.fontSize = '0.9rem';
  label.style.whiteSpace = 'normal';

  strip.appendChild(block);
  totalWidth += w;

  const mini = document.createElement('div');
  mini.style.display = 'inline-block';
  mini.style.marginRight = '1rem';
  mini.textContent = `${it.label} (${w} px)`;
  ruler.appendChild(mini);
});

// set strip width explicitly so it scrolls
strip.style.width = totalWidth + 'px';
