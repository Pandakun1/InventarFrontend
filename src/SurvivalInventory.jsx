import React, { useState } from 'react';
import BriefcaseDesign from './designs/BriefcaseDesign.jsx';
// Später: weitere Designs importieren
import KidsShelfDesign from './designs/KidsShelfDesign.jsx';
import TacticalBackpackDesign from './designs/TacticalBackpackDesign.jsx';
import RetroDrawerDesign from './designs/RetroDrawerDesign.jsx';
import SciFiHudDesign from './designs/SciFiHudDesign.jsx';

const LAYOUTS = {
  briefcase: { name: 'Koffer', key: 'briefcase' },
  kidsShelf: { name: 'Kinderregal', key: 'kidsShelf' },
  tacticalBackpack: { name: 'Taktischer Rucksack', key: 'tacticalBackpack' },
  retroDrawer: { name: 'Retro Schubladen', key: 'retroDrawer' },
  sciFiHud: { name: 'Sci-Fi HUD', key: 'sciFiHud' },
};

const THEMES = {
  classicLeather: { name: 'Classic Leder', key: 'classicLeather' },
  nightOps: { name: 'Night Ops', key: 'nightOps' },
  desertDust: { name: 'Desert Dust', key: 'desertDust' },
  neonMiami: { name: 'Neon Miami', key: 'neonMiami' },
  arcticBlue: { name: 'Arctic Blue', key: 'arcticBlue' },
};

// NEU: Animationen definieren
const ANIMATIONS = {
  none: { name: 'Keine', key: 'none' },
  subtleGlow: { name: 'Subtiles Glühen', key: 'subtleGlow' },
  quickResponse: { name: 'Schnelle Reaktion', key: 'quickResponse' },
  scannerPulse: { name: 'Scanner-Puls', key: 'scannerPulse' },
};

const INITIAL_ITEMS = [
  { id: 1, name: 'Sandwich', emoji: '🥪', quantity: 2 },
  { id: 2, name: 'Dokumente', emoji: '📋', quantity: 1 },
  { id: 3, name: 'Getränk', emoji: '🧃', quantity: 3 },
  { id: 4, name: 'Verbandskasten', emoji: '🏥', quantity: 1 },
  { id: 5, name: 'Lieferbox', emoji: '📦', quantity: 1 },
  { id: 6, name: 'Autoschlüssel', emoji: '🔑', quantity: 1 },
  { id: 7, name: 'Werkzeug', emoji: '🔧', quantity: 2 },
  { id: 8, name: 'Plastiktüte', emoji: '🗂️', quantity: 1 },
  { id: 9, name: 'Axt', emoji: '🪓', quantity: 1 },
  { id: 10, name: 'Messer', emoji: '🔪', quantity: 1 },
  { id: 11, name: 'Smartphone', emoji: '📱', quantity: 1 },
  { id: 12, name: 'Burger', emoji: '🍔', quantity: 4 },
  { id: 13, name: 'Notizbuch', emoji: '📓', quantity: 1 },
  { id: 14, name: 'Munition', emoji: '🪙', quantity: 50 },
  { id: 15, name: 'Pizza', emoji: '🍕', quantity: 2 },
  { id: 16, name: 'Bargeld', emoji: '💵', quantity: 1 },
  { id: 17, name: 'Dose', emoji: '🥫', quantity: 3 },
  { id: 18, name: 'Diamant', emoji: '💎', quantity: 1 },
  { id: 19, name: 'Orange', emoji: '🍊', quantity: 5 },
  { id: 20, name: 'Spiegel', emoji: '🪞', quantity: 1 },
  { id: 21, name: 'Mandarine', emoji: '🍊', quantity: 3 },
  { id: 22, name: 'Cheeseburger', emoji: '🍔', quantity: 2 },
  { id: 23, name: 'Schlüssel', emoji: '🗝️', quantity: 1 },
  { id: 24, name: 'Medikamente', emoji: '💊', quantity: 10 },
  { id: 25, name: 'Wasserflasche', emoji: '💧', quantity: 2 },
];
// 50 Slots: Fülle die restlichen mit null auf
const PADDED_ITEMS = [...INITIAL_ITEMS, ...Array(50 - INITIAL_ITEMS.length).fill(null)];


export default function SurvivalInventory() {
  const [items, setItems] = useState(PADDED_ITEMS); // Inventar-Items jetzt als State
  const [layoutKey, setLayoutKey] = useState('briefcase');
  const [themeKey, setThemeKey] = useState('classicLeather');
  const [animationKey, setAnimationKey] = useState('none');
  
  // NEUE FUNKTION: Verschieben von Items (Drag & Drop Logik)
  const moveItem = (fromIndex, toIndex) => {
      setItems((prevItems) => {
          const newItems = [...prevItems];
          const itemA = newItems[fromIndex];
          const itemB = newItems[toIndex];

          // Nur tauschen, wenn Quellslot existiert (nicht null)
          if (itemA === null) return prevItems;
          
          // Swap: ItemA (gezogenes Item) geht zu toIndex, ItemB (Ziel-Item/null) geht zu fromIndex
          newItems[toIndex] = itemA;
          newItems[fromIndex] = itemB;

          return newItems;
      });
  };

  const keys = [
    { name: 'Autoschlüssel', icon: '🚗🔑' },
    { name: 'Haustür Schlüssel', icon: '🏠🔑' },
    { name: 'Job Schlüssel', icon: '🏢🔑' },
  ];

  const licenses = [
    { id: 'id', label: 'ID Card', desc: 'Personalausweis' },
    { id: 'driver', label: 'Führerschein', desc: 'PKW / Motorrad' },
    { id: 'weapon', label: 'Waffenschein', desc: 'Registrierte Waffen' },
  ];

  const stats = [
    { name: 'Health', value: 95, max: 100, color: '#16a34a' },
    { name: 'Armor', value: 60, max: 100, color: '#2563eb' },
    { name: 'Hunger', value: 35, max: 100, color: '#ea580c' },
    { name: 'Durst', value: 70, max: 100, color: '#7c3aed' },
  ];

  const renderLayout = () => {
    const layoutProps = {
      themeKey,
      animationKey, // NEU: Animationen übergeben
      inventoryItems: items, // NEU: State-Items übergeben
      moveItem, // NEU: Move-Funktion übergeben
      keys,
      licenses,
      stats,
    };

    switch (layoutKey) {
      case 'briefcase':
        return <BriefcaseDesign {...layoutProps} />;
      case 'kidsShelf':
        return <KidsShelfDesign {...layoutProps} />;
      case 'tacticalBackpack':
        return <TacticalBackpackDesign {...layoutProps} />;
      case 'sciFiHud':
        return <SciFiHudDesign {...layoutProps} />;
      case 'retroDrawer':
        return <RetroDrawerDesign {...layoutProps} />;
      default:
        return <BriefcaseDesign {...layoutProps} />;
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-8 app-root theme-${themeKey} layout-${layoutKey}`}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Unica+One&family=Shadows+Into+Light&display=swap');

        :root {
          /* Standardwerte */
          --bg-main: #050308;
          --accent-1: #f97316;
          --accent-2: #38bdf8;
          --accent-3: #22c55e;
          --paper-color: #fef3c7;
          --paper-ink: #111827;
          --metal-color: #9ca3af;
          --panel-inner: #0b1120;
          
          /* Neue Variablen für Animationen */
          --animation-speed: 2.5s;
          --animation-pulse-color: var(--accent-1);
          /* NEU: Farb-Fallback für RGB-Animationen (Sci-Fi) */
          --animation-pulse-color-rgb: 249, 115, 22; /* Standard: f97316 */
        }

        .app-root {
          background: radial-gradient(circle at top, #020617 0, #020617 40%, #000 100%);
        }

        /* THEMES: Überschreibt Standard-Akzente */

        .theme-classicLeather {
          --accent-1: #f97316;
          --accent-2: #22c55e;
          --accent-3: #eab308;
          --paper-color: #fef3c7;
          --paper-ink: #111827;
          --metal-color: #9ca3af;
          --panel-inner: #0b1120;
          --animation-pulse-color: var(--accent-1);
          --animation-pulse-color-rgb: 249, 115, 22; /* Orange */
        }

        .theme-nightOps {
          --accent-1: #0ea5e9;
          --accent-2: #22c55e;
          --accent-3: #f97316;
          --paper-color: #e5e7eb;
          --paper-ink: #020617;
          --metal-color: #6b7280;
          --panel-inner: #020617;
          --animation-pulse-color: var(--accent-1); 
          --animation-pulse-color-rgb: 14, 165, 233; /* Blau */
        }

        .theme-desertDust {
          --accent-1: #f97316;
          --accent-2: #eab308;
          --accent-3: #22c55e;
          --paper-color: #fef9c3;
          --paper-ink: #422006;
          --metal-color: #a16207;
          --panel-inner: #1c1917;
          --animation-pulse-color: var(--accent-2); 
          --animation-pulse-color-rgb: 234, 179, 8; /* Gelb/Orange */
        }

        .theme-neonMiami {
          --accent-1: #ec4899;
          --accent-2: #22d3ee;
          --accent-3: #fbbf24;
          --paper-color: #fee2e2;
          --paper-ink: #111827;
          --metal-color: #a855f7;
          --panel-inner: #020617;
          --animation-pulse-color: var(--accent-1); 
          --animation-pulse-color-rgb: 236, 72, 153; /* Pink */
        }

        .theme-arcticBlue {
          --accent-1: #38bdf8;
          --accent-2: #22c55e;
          --accent-3: #e5e7eb;
          --paper-color: #e0f2fe;
          --paper-ink: #020617;
          --metal-color: #cbd5f5;
          --panel-inner: #020617;
          --animation-pulse-color: var(--accent-1); 
          --animation-pulse-color-rgb: 56, 189, 248; /* Hellblau */
        }

        /* ANIMATIONS-KLASSEN (zentral definiert) */
        
        /* 1. Slot-Flash */
        @keyframes slotFlash {
            0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.0); }
            50% { box-shadow: 0 0 6px 0 var(--animation-pulse-color); }
        }
        
        /* 2. Panel-Glow */
        @keyframes panelGlow {
            0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.0), inset 0 0 0 1px rgba(15,23,42,1); }
            50% { box-shadow: 0 0 12px rgba(0,0,0,0.9), inset 0 0 8px 1px var(--animation-pulse-color); }
        }

        /* 3. Background-Scan */
        @keyframes backgroundScan {
            0% { background-position: 0 0; }
            100% { background-position: -400% 0; }
        }

        /* 4. Pulse-Effect (für Buttons, Keys etc.) */
        @keyframes pulseEffect {
            0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 var(--animation-pulse-color); }
            50% { transform: scale(1.02); box-shadow: 0 0 12px 0 var(--animation-pulse-color); }
        }

        /* Dragging Visuelle Hilfe (Für alle Designs gültig) */
        .drag-hover {
            box-shadow: 0 0 10px 4px var(--animation-pulse-color, #f97316), inset 0 0 0 2px var(--animation-pulse-color, #f97316) !important;
            transform: scale(1.01);
        }
        .dragging {
            opacity: 0.5;
            border: 2px dashed var(--animation-pulse-color, #f97316) !important;
            box-shadow: none !important;
            transform: scale(1) !important;
        }

        .ui-select-container {
            display: flex;
            align-items: center;
            position: relative;
            gap: 4px; 
            background: #020617;
            border: 1px solid #334155;
            border-radius: 8px;
            padding: 4px 8px;
        }

        .ui-select-label {
            font-size: calc(var(--ui-scale) * 1000);
            text-transform: uppercase;
            letter-spacing: 0.16em;
            color: #94a3b8;
            padding-right: 4px;
        }

        .ui-select {
            background: #020617;
            color: #f8fafc;
            border: none;
            padding: 4px 6px;
            border-radius: 6px;
            font-size: calc(var(--ui-scale) * 1100);
            text-transform: uppercase;
            letter-spacing: 0.1em;
            appearance: none; /* Entfernt native Dropdown-Pfeile */
            cursor: pointer;
            outline: none;
            transition: background 0.1s;
        }

        .ui-select:focus, .ui-select:hover {
            background: #1e293b;
        }

      `}</style>

      <div className="w-full h-full"> 
        {/* NEUE DROPDOWN-LEISTE */}
        <div className="center justify-start items-center mb-6 gap-4 flex-wrap flex">
          <div className="ui-select-container">
            {/* 1. Layout Selction */}
            <div className="ui-select-container">
              <span className="ui-select-label">Layout</span>
              <select 
                value={layoutKey} 
                onChange={(e) => setLayoutKey(e.target.value)} 
                className="ui-select"
              >
                {Object.entries(LAYOUTS).map(([key, layout]) => (
                  <option key={key} value={key}>
                    {layout.name}
                  </option>
                ))}
              </select>
            </div>

                {/* 2. Layout Selction */}
            <div className="ui-select-container">
              <span className="ui-select-label">Theme</span>
              <select 
                value={themeKey} 
                onChange={(e) => setThemeKey(e.target.value)} 
                className="ui-select"
              >
                {Object.entries(THEMES).map(([key, theme]) => (
                  <option key={key} value={key}>
                    {theme.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Animation Dropdown */}
            <div className="ui-select-container">
              <span className="ui-select-label">Animation</span>
              <select 
                value={animationKey} 
                onChange={(e) => setAnimationKey(e.target.value)} 
                className="ui-select"
              >
                {Object.entries(ANIMATIONS).map(([key, animation]) => (
                  <option key={key} value={key}>
                    {animation.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {/* Hier wird das aktuelle Design gerendert */}
        {renderLayout()}
      </div>
    </div>
  );
}