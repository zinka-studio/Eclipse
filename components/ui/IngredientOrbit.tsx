'use client';
import { useEffect, useRef, useState } from 'react';

const RING_1_WORDS = [
  'Juniper berries', 'Cardamom', 'Cinnamon stick', 'Absinthe', 'Amaretto', 'Dark rum',
  'Pisco', 'Tamarind', 'Lavender', 'Vanilla bitters', 'Cherry', 'Rye whiskey',
  'Black cardamom', 'Frangelico', 'Date syrup', 'Sage syrup', 'Fennel',
  'Chocolate bitters', 'Walnut liqueur', 'Elderflower tonic', 'Ginger kombucha',
  'Violet flowers', 'Pineapple juice', 'Byrrh', 'Orange twist', 'Mango puree',
  'Brown sugar syrup', 'Angostura', 'Peychaud bitters', 'Cointreau',
];

const RING_2_WORDS = [
  'Raspberry cordial', 'Allspice', 'Port wine', 'Coconut butter', 'Mango syrup',
  'Smoked salt', 'Ginger bitters', 'Coconut rum', 'Blueberry puree', 'Fig bitters',
  'Espresso syrup', 'Tequila añejo', 'Cream of coconut', 'Wasabi', 'Lime cordial',
  'Hazelnut liqueur', 'Sarsaparilla', 'Peach syrup', 'Blackcurrant juice',
  'Tangerine', 'Licorice root', 'Maple syrup', 'Sweet vermouth', 'Passionfruit',
  'Smoked mandarin', 'Demerara sugar', 'Merlot', 'Yuzu soda', 'Strawberry puree',
  'Cinnamon bitters', 'Lemonade', 'Chartreuse', 'Drambuie', 'Calvados',
];

const RING_3_WORDS = [
  'Lavender', 'Chamomile', 'Cassia bark', 'Fennel seed', 'Blackberry syrup',
  'Anise seed', 'Sage', 'Agave nectar', 'Himalayan salt', 'Creme de violette',
  'Calamansi juice', 'Persian lime', 'Apricot liqueur', 'Aperol', 'Clementine',
  'Celery leaves', 'Watermelon', 'Galangal', 'Cold brew coffee', 'Cinnamon syrup',
  'Peach puree', 'Nocino', 'Honey liqueur', 'Blackcurrant', 'Coconut flakes',
  'Chili powder', 'Toasted coconut', 'Caramel syrup', 'Aloe vera juice', 'Cumin',
  'Mace', 'Saffron', 'Turmeric', 'Sumac', 'Yuzu', 'Bergamot', 'Lychee',
  'Hibiscus', 'Cardamom pods', 'Smoked paprika', 'Tarragon', 'Star anise',
  'Makrut lime', 'Lemongrass', 'Shiso leaf', 'Tonka bean', 'Gentian root',
];

// Radii and font sizes as fractions of viewport width (calibrated at 1920px)
const RINGS = [
  { id: 'io-c1', rVw: 329 / 1920, fsVw: 14 / 1920, opacity: 0.5,  words: RING_1_WORDS, duration: '80s',  dir:  1 },
  { id: 'io-c2', rVw: 494 / 1920, fsVw: 12 / 1920, opacity: 0.3,  words: RING_2_WORDS, duration: '130s', dir: -1 },
  { id: 'io-c3', rVw: 633 / 1920, fsVw: 11 / 1920, opacity: 0.1,  words: RING_3_WORDS, duration: '195s', dir:  1 },
];

function buildText(words: string[], minChars: number): string {
  const seg = words.join('  ·  ') + '  ·  ';
  let s = seg;
  while (s.length < minChars) s += seg;
  return s;
}

function circlePath(cx: number, cy: number, r: number) {
  return `M${cx},${cy} m-${r},0 a${r},${r},0,1,1,${r * 2},0 a${r},${r},0,1,1,-${r * 2},0`;
}

export default function IngredientOrbit() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dims, setDims] = useState({ w: 1920, h: 1080 });

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setDims({ w: Math.round(width), h: Math.round(height) });
    });
    ro.observe(svg);
    return () => ro.disconnect();
  }, []);

  const { w, h } = dims;
  const cx = w / 2;
  const cy = h / 2;

  return (
    <svg
      ref={svgRef}
      className="io-svg"
      viewBox={`0 0 ${w} ${h}`}
      aria-hidden="true"
    >
      <defs>
        {RINGS.map(ring => {
          const r = w * ring.rVw;
          return (
            <path key={ring.id} id={ring.id} d={circlePath(cx, cy, r)} />
          );
        })}
      </defs>

      {RINGS.map(ring => {
        const r = w * ring.rVw;
        const fs = w * ring.fsVw;
        const circumference = 2 * Math.PI * r;
        const avgCharWidth = fs * 0.52;
        const minChars = Math.ceil(circumference / avgCharWidth) + 80;
        const text = buildText(ring.words, minChars);
        return (
          <g
            key={ring.id}
            className={ring.dir > 0 ? 'io-cw' : 'io-ccw'}
            style={{ animationDuration: ring.duration }}
          >
            <text
              opacity={ring.opacity}
              fill="white"
              fontSize={fs}
              fontFamily="Supreme, sans-serif"
              fontWeight="300"
              letterSpacing={fs * 0.1}
            >
              <textPath href={`#${ring.id}`}>{text}</textPath>
            </text>
          </g>
        );
      })}
    </svg>
  );
}
