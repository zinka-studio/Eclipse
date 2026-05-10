'use client';
import { useState, useRef, useEffect } from 'react';
import { useParallax } from '@/hooks/useParallax';

interface MenuItem {
  category: string;
  item_name: string;
  description: string;
  price_ils: number;
}

const MENU: MenuItem[] = [
  { category: 'Raw / Sea',           item_name: 'Oyamel Oysters',          description: 'White balsamic pearls, mignonette foam',            price_ils: 68  },
  { category: 'Raw / Sea',           item_name: 'Citrus Cured Sea Bass',    description: 'Yuzu kosho, cucumber gel, crispy shallot',           price_ils: 72  },
  { category: 'Raw / Sea',           item_name: 'Tuna Crudo',               description: 'Burnt chili oil, lime leaf, pickled radish',         price_ils: 76  },
  { category: 'Raw / Sea',           item_name: 'Scallop Pearl',            description: 'Coconut beurre blanc, finger lime, herb oil',        price_ils: 82  },
  { category: 'Meat',                item_name: 'Wagyu Tataki',             description: 'Truffle ponzu, micro-herb garnish',                  price_ils: 118 },
  { category: 'Meat',                item_name: 'Smoked Short Rib Bite',    description: 'Tamarind glaze, onion ash, crispy garlic',           price_ils: 92  },
  { category: 'Meat',                item_name: 'Duck Bao',                 description: 'Hoisin caramel, cucumber ribbons, sesame crunch',    price_ils: 74  },
  { category: 'Meat',                item_name: 'Lamb Kofta Skewer',        description: 'Yogurt foam, smoked eggplant, herb salad',           price_ils: 84  },
  { category: 'Vegetarian',          item_name: 'Charred Broccolini',       description: 'Miso butter, toasted almonds, lemon zest',           price_ils: 54  },
  { category: 'Vegetarian',          item_name: 'Crispy Potato Terrine',    description: 'Black garlic aioli, chive oil, parmesan snow',       price_ils: 58  },
  { category: 'Vegetarian',          item_name: 'Mushroom XO Toast',        description: 'Wild mushrooms, soy glaze, cured yolk',              price_ils: 64  },
  { category: 'Vegetarian',          item_name: 'Labneh Cloud',             description: "Fermented tomato, za'atar oil, sourdough crisp",     price_ils: 52  },
  { category: "Chef's Specials",     item_name: "Chef's Selection",         description: "Tonight's laboratory creation — ask your server",    price_ils: 96  },
  { category: "Chef's Specials",     item_name: 'Golden Plate Tasting',     description: "Four changing bites from the chef's counter",        price_ils: 148 },
  { category: 'Dessert',             item_name: 'Black Sesame Tart',        description: 'Fermented honey, edible gold dust',                  price_ils: 62  },
  { category: 'Dessert',             item_name: 'Miso Caramel Éclair',      description: 'Dark chocolate, sea salt, hazelnut crumble',         price_ils: 58  },
  { category: 'Dessert',             item_name: 'Citrus Pavlova',           description: 'Lime cream, grapefruit pearls, basil syrup',         price_ils: 56  },
  { category: 'Dessert',             item_name: 'Tonka Bean Crème Brûlée',  description: 'Burnt sugar, vanilla salt, almond tuile',            price_ils: 54  },
  { category: 'Signature Cocktails', item_name: 'Golden Hour',              description: 'Gin, yuzu, elderflower, sparkling sake',             price_ils: 58  },
  { category: 'Signature Cocktails', item_name: 'Midnight Lab',             description: 'Bourbon, black sesame, honey, bitters',             price_ils: 64  },
  { category: 'Signature Cocktails', item_name: 'Oyamel Martini',           description: 'Vodka, dry vermouth, oyster leaf, white balsamic mist', price_ils: 66 },
  { category: 'Signature Cocktails', item_name: 'Truffle Negroni',          description: 'Gin, Campari, sweet vermouth, truffle essence',      price_ils: 68  },
  { category: 'Signature Cocktails', item_name: 'Velvet Smoke',             description: 'Mezcal, pineapple cordial, chili, smoked salt',      price_ils: 62  },
  { category: 'Signature Cocktails', item_name: 'Green Lantern',            description: 'Tequila, cucumber, basil, lime, jalapeño',           price_ils: 58  },
  { category: 'Signature Cocktails', item_name: 'Fermented Garden',         description: 'Rum, fermented pineapple, mint, lime foam',          price_ils: 60  },
  { category: 'Classic Cocktails',   item_name: 'Old Fashioned',            description: 'Bourbon, bitters, demerara',                         price_ils: 54  },
  { category: 'Classic Cocktails',   item_name: 'Negroni',                  description: 'Gin, Campari, sweet vermouth',                       price_ils: 52  },
  { category: 'Classic Cocktails',   item_name: 'Margarita',                description: 'Tequila, lime, orange liqueur, salt',                price_ils: 52  },
  { category: 'Classic Cocktails',   item_name: 'Espresso Martini',         description: 'Vodka, espresso, coffee liqueur',                    price_ils: 56  },
  { category: 'Spirits',             item_name: 'Macallan 12',              description: 'Single malt whisky',                                 price_ils: 72  },
  { category: 'Spirits',             item_name: 'Glenfiddich 15',           description: 'Single malt whisky',                                 price_ils: 64  },
  { category: 'Spirits',             item_name: 'Hibiki Harmony',           description: 'Japanese whisky',                                    price_ils: 78  },
  { category: 'Spirits',             item_name: 'Don Julio Blanco',         description: 'Tequila',                                            price_ils: 58  },
  { category: 'Spirits',             item_name: 'Clase Azul Reposado',      description: 'Premium tequila',                                    price_ils: 145 },
  { category: 'Spirits',             item_name: 'Monkey 47',                description: 'Gin',                                                price_ils: 62  },
  { category: 'Spirits',             item_name: 'Grey Goose',               description: 'Vodka',                                              price_ils: 52  },
  { category: 'Spirits',             item_name: 'Zacapa 23',                description: 'Rum',                                                price_ils: 68  },
  { category: 'Non-Alcoholic',       item_name: 'Citrus Ritual',            description: 'Grapefruit, lime, basil, soda',                      price_ils: 36  },
  { category: 'Non-Alcoholic',       item_name: 'Zero Negroni',             description: 'Bitter orange, herbal vermouth, tonic',              price_ils: 42  },
  { category: 'Non-Alcoholic',       item_name: 'Ginger Garden',            description: 'Ginger, cucumber, mint, lemon',                      price_ils: 34  },
  { category: 'Non-Alcoholic',       item_name: 'Sparkling Yuzu Tea',       description: 'Yuzu, jasmine tea, soda',                            price_ils: 38  },
];

interface TabCol { heading: string; categories: string[]; }
interface Tab { id: string; label: string; cols: [TabCol, TabCol]; }

const TABS: Tab[] = [
  {
    id: 'cocktails', label: 'Cocktails',
    cols: [
      { heading: 'Signature',       categories: ['Signature Cocktails'] },
      { heading: 'Classics',        categories: ['Classic Cocktails']   },
    ],
  },
  {
    id: 'drinks', label: 'Drinks',
    cols: [
      { heading: 'Spirits',         categories: ['Spirits']         },
      { heading: 'Zero Proof',      categories: ['Non-Alcoholic']   },
    ],
  },
  {
    id: 'starters', label: 'Starters',
    cols: [
      { heading: 'Sea',             categories: ['Raw / Sea']       },
      { heading: 'Garden',          categories: ['Vegetarian']      },
    ],
  },
  {
    id: 'mains', label: 'Mains',
    cols: [
      { heading: 'Meat',            categories: ['Meat']            },
      { heading: "Chef's Table",    categories: ["Chef's Specials"] },
    ],
  },
  {
    id: 'desserts', label: 'Desserts',
    cols: [
      { heading: 'Sweet Endings',   categories: ['Dessert']         },
      { heading: '',                categories: []                  },
    ],
  },
];

function ColItems({ col }: { col: TabCol }) {
  const items = MENU.filter(m => col.categories.includes(m.category));
  if (!items.length && !col.heading) return null;
  return (
    <div className="mn-col">
      {col.heading && <div className="mn-col-heading">{col.heading}</div>}
      <div className="mn-col-items">
        {items.map((item, i) => (
          <div key={i} className="mn-item">
            <div className="mn-item-top">
              <span className="mn-item-name">{item.item_name}</span>
              <span className="mn-item-dots" aria-hidden="true" />
              <span className="mn-item-price">₪{item.price_ils}</span>
            </div>
            <div className="mn-item-desc">{item.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Menu() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef  = useRef<HTMLDivElement>(null);
  const gridRef    = useRef<HTMLDivElement>(null);

  useParallax(headerRef, 0.03);
  useParallax(gridRef,   0.06);

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } });
    }, { threshold: 0.06 });
    sectionRef.current?.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const tab = TABS[active];

  return (
    <section id="menu" ref={sectionRef}>
      <div ref={headerRef} className="mn-header">
        <div className="mn-header-top reveal">
          <div className="sec-tag">
            <span className="sec-tag-num">06</span>
            <span className="sec-tag-line" />
            <span className="label">The Menu</span>
          </div>
          <div className="mn-title">Every night.<br />A new composition.</div>
        </div>

        <nav className="mn-tabs reveal" data-d="1" aria-label="Menu categories">
          {TABS.map((t, i) => (
            <button
              key={t.id}
              className={`mn-tab${active === i ? ' active' : ''}`}
              onClick={() => setActive(i)}
              style={{ cursor: 'none' }}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      <div ref={gridRef} className="mn-grid reveal" data-d="2">
        <ColItems col={tab.cols[0]} />
        <div className="mn-col-divider" />
        <ColItems col={tab.cols[1]} />
      </div>
    </section>
  );
}
