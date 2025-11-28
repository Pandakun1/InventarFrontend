import React, { useState } from 'react';
import { Package } from 'lucide-react';

// Füge moveItem zu den Props hinzu
export default function BriefcaseDesign({ themeKey, animationKey, inventoryItems, moveItem, keys, licenses, stats }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [draggedItemIndex, setDraggedItemIndex] = useState(null); // State für den Index des gezogenen Items

  // Item ist definiert, wenn es nicht null ist
  const isItemDefined = (item) => item !== null && item?.emoji !== undefined && item?.emoji !== '';

  // Hotbar sind die ersten 5 Slots im Hauptinventar-Array
  const hotbarItems = inventoryItems.slice(0, 5);
  
  // Bestimme die zu verwendenden Animationsklassen
  const useGlow = animationKey === 'subtleGlow' || animationKey === 'scannerPulse';
  const useFlash = animationKey === 'quickResponse';
  const usePulse = animationKey === 'scannerPulse';

const handleDragStart = (e, index) => {
    if (!isItemDefined(inventoryItems[index])) {
      e.preventDefault();
      return;
    }
setDraggedItemIndex(index);
    // Speichere den Start-Index
    e.dataTransfer.setData('fromIndex', index.toString());
    e.currentTarget.classList.add('dragging');
  };

  const handleDragEnd = (e) => {
      e.currentTarget.classList.remove('dragging');
      setDraggedItemIndex(null);
  };
    
  const handleDragOver = (e) => {
    e.preventDefault(); 
    e.currentTarget.classList.add('drag-hover');
  };
  
  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-hover');
  };


  const handleDrop = (e, toIndex) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-hover');
    const fromIndex = parseInt(e.dataTransfer.getData('fromIndex'), 10);
    
    if (fromIndex !== toIndex) {
      moveItem(fromIndex, toIndex); // Ruft die Move-Logik aus SurvivalInventory auf
    }
    setDraggedItemIndex(null);
  };

  const renderSlot = (item, index) => {
    const isOccupied = isItemDefined(item);
    const slotClass = `briefcase-slot ${!isOccupied ? 'empty' : ''} ${
      selectedItem === item?.id ? 'selected' : ''
    } ${useFlash ? 'briefcase-slot-flash' : ''} ${isOccupied && useGlow ? 'slot-glow' : ''}`;

    return (
      <div
        key={index}
        data-index={index}
        className={slotClass}
        onClick={() => setSelectedItem(selectedItem === item?.id ? null : item?.id)}
        onMouseEnter={() => setHoveredItem(item?.id)}
        onMouseLeave={() => setHoveredItem(null)}
        
        // DRAG & DROP Hinzufügen (Wird von Hotbar und Inventar genutzt)
        draggable={isOccupied} // Nur belegte Slots sind ziehbar
        onDragStart={(e) => handleDragStart(e, index)}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, index)}
      >
        {isOccupied && (
          <>
            <div className="briefcase-item-icon">{item.emoji}</div>
            {item.quantity > 1 && (
              <div className="briefcase-item-qty">{item.quantity}</div>
            )}
            {hoveredItem === item.id && (
              <div
                className="briefcase-tooltip"
                style={{ left: '50%', bottom: '100%' }}
              >
                {item.name}
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="briefcase-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Unica+One&family=Shadows+Into+Light&display=swap');

.briefcase-root {
          position: relative;
          width: 100%;
          max-width: 1100px;
          aspect-ratio: 16 / 9;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .briefcase-shadow {
          position: absolute;
          inset: 0;
          filter: blur(50px);
          background:
            radial-gradient(circle at top, rgba(250,250,250,0.08), transparent 55%),
            radial-gradient(circle at bottom right, rgba(59,130,246,0.35), transparent 65%),
            radial-gradient(circle at bottom left, rgba(248,250,252,0.12), transparent 60%);
          opacity: 0.6;
        }

        .briefcase {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 34px;
          background:
            radial-gradient(circle at top left, rgba(248,250,252,0.06), transparent 50%),
            linear-gradient(135deg, #3f2a20, #22130e);
          box-shadow:
            0 26px 60px rgba(0,0,0,0.85),
            0 0 0 2px rgba(15,23,42,0.9);
          padding: 26px 40px 32px 40px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .briefcase::before {
          /* äußerer Metallrahmen */
          content: '';
          position: absolute;
          inset: 8px;
          border-radius: 28px;
          border: 3px solid rgba(15,23,42,0.9);
          box-shadow:
            inset 0 0 0 2px rgba(75,85,99,0.8),
            0 0 0 1px rgba(0,0,0,0.8);
          pointer-events: none;
        }

        .briefcase-handle {
          position: absolute;
          top: -32px;
          left: 50%;
          transform: translateX(-50%);
          width: 190px;
          height: 32px;
          border-radius: 999px;
          background: linear-gradient(180deg, #111827, #020617);
          border: 2px solid #020617;
          box-shadow:
            0 18px 18px rgba(0,0,0,0.9),
            inset 0 0 0 1px rgba(148,163,184,0.4);
        }

        .briefcase-handle::before,
        .briefcase-handle::after {
          content: '';
          position: absolute;
          top: 10px;
          width: 20px;
          height: 10px;
          border-radius: 4px;
          background: linear-gradient(180deg, var(--metal-color, #9ca3af), #111827);
        }

        .briefcase-handle::before { left: 16px; }
        .briefcase-handle::after { right: 16px; }

        .briefcase-inner {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-rows: 1fr;
          height: 100%;
        }

        /* Innenseite des Koffers (Innenfutter) */
        .briefcase-wall {
          position: relative;
          border-radius: 22px;
          background:
            radial-gradient(circle at top left, rgba(248,250,252,0.08), transparent 55%),
            repeating-linear-gradient(
              45deg,
              rgba(15,23,42,0.7) 0,
              rgba(15,23,42,0.7) 6px,
              rgba(30,41,59,0.75) 6px,
              rgba(30,41,59,0.75) 12px
            );
          padding: 14px 20px;
          box-shadow: inset 0 0 0 1px rgba(15,23,42,0.9);
        }

          /* Layout wie KidsShelf:
           3 Spalten (Wallet+Keys, Inventar, Stats+Aktionen),
           2 Reihen (Wallet/Stats oben, Keys/Aktionen unten, Inventar über beide Reihen) */
        .briefcase-layout {
          display: grid;
          grid-template-columns: 260px minmax(0, 1fr) 220px;
          grid-template-rows: minmax(0, 1fr) minmax(0, 1fr);
          gap: 16px;
          align-items: stretch;
          height: 100%;
        }

        /* Klassen für Animationen */
        .briefcase-panel-glow {
            animation: panelGlow var(--animation-speed, 3s) ease-in-out infinite alternate;
        }

        .briefcase-pulse {
            animation: pulseEffect var(--animation-speed, 2.5s) ease-in-out infinite;
        }

        .briefcase-slot-flash:hover {
            animation: slotFlash 0.3s ease-out;
        }


        /* ---------- GELDBEUTEL (oben links) ---------- */

        .briefcase-wallet-panel {
          grid-column: 1;
          grid-row: 1;
          position: relative;
          border-radius: 20px;
          background:
            linear-gradient(135deg, #111827, #020617);
          box-shadow:
            0 16px 34px rgba(0,0,0,0.9),
            inset 0 0 0 1px rgba(15,23,42,1);
          padding: 12px 14px 14px 14px;
          display: flex;
          flex-direction: column;
        }

        .briefcase-wallet-panel::before {
          /* kleine Lederlasche */
          content: '';
          position: absolute;
          top: -10px;
          left: 32px;
          right: 32px;
          height: 10px;
          border-radius: 10px 10px 0 0;
          background: linear-gradient(180deg, #4b5563, #020617);
          box-shadow: 0 8px 12px rgba(0,0,0,0.8);
        }

        .wallet-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 10px;
        }

        .wallet-title {
          font-family: 'Unica One', system-ui, sans-serif;
          letter-spacing: 0.22em;
          font-size: 11px;
          text-transform: uppercase;
          color: #e5e7eb;
        }

        .wallet-label {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: #9ca3af;
        }

        .wallet-row {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }

        .wallet-cash {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          border-radius: 14px;
          background: linear-gradient(135deg, var(--accent-1, #f97316), var(--accent-2, #22c55e));
          box-shadow:
            0 14px 24px rgba(0,0,0,0.7);
        }

        .wallet-cash-icon {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          background: rgba(15,23,42,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
        }

        .wallet-cash-main {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .wallet-cash-label {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: rgba(15,23,42,0.85);
        }

        .wallet-cash-value {
          font-family: 'Space Grotesk', system-ui, sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #f9fafb;
        }

        .wallet-licenses {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 6px;
          margin-top: 4px;
        }

        .license-card {
          border-radius: 10px;
          background: linear-gradient(135deg, #0f172a, #020617);
          border: 1px solid rgba(148,163,184,0.7);
          padding: 6px 8px;
        }

        .license-main {
          font-family: 'Space Grotesk', system-ui, sans-serif;
          font-size: 11px;
          font-weight: 600;
          color: #e5e7eb;
        }

        .license-sub {
          font-size: 10px;
          color: #9ca3af;
        }

        /* ---------- STATS (oben rechts) als Notizzettel im Deckelbereich ---------- */

        .briefcase-stats-panel {
          grid-column: 3;
          grid-row: 1;
          border-radius: 20px;
          background:
            radial-gradient(circle at top left, rgba(248,250,252,0.16), transparent 60%),
            linear-gradient(135deg, #111827, #020617);
          box-shadow:
            inset 0 0 0 1px rgba(15,23,42,1),
            0 12px 20px rgba(0,0,0,0.75);
          padding: 12px 14px 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .briefcase-stats-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }

        .briefcase-stats-title {
          font-family: 'Unica One', system-ui, sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.22em;
          font-size: 11px;
          color: #e5e7eb;
        }

        .briefcase-stats-sub {
          font-size: 10px;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.16em;
        }

        .briefcase-note-strip {
          display: flex;
          gap: 8px;
          justify-content: space-between;
        }

        .briefcase-note-card {
          position: relative;
          flex: 1;
          min-width: 0;
          background: var(--paper-color, #fef3c7);
          border-radius: 10px;
          padding: 8px 9px 9px 9px;
          box-shadow:
            0 6px 10px rgba(0,0,0,0.45),
            inset 0 0 0 1px rgba(0,0,0,0.08);
          transform-origin: top center;
        }

        .briefcase-note-card:nth-child(1) { transform: rotate(-1.6deg); }
        .briefcase-note-card:nth-child(2) { transform: rotate(1.2deg); }
        .briefcase-note-card:nth-child(3) { transform: rotate(-1.1deg); }
        .briefcase-note-card:nth-child(4) { transform: rotate(1.5deg); }
        
        /* HINZUFÜGEN von Pulse-Effekt auf Stats-Karten */
        .briefcase-note-card.pulse-active {
            animation: pulseEffect var(--animation-speed, 2.5s) ease-in-out infinite;
        }

        .briefcase-note-card::before {
          content: '';
          position: absolute;
          top: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 28px;
          height: 14px;
          border-radius: 999px;
          background: radial-gradient(circle at top, #e5e7eb, var(--metal-color, #9ca3af));
          box-shadow:
            0 4px 6px rgba(0,0,0,0.6);
        }

        .briefcase-note-title {
          font-family: 'Shadows Into Light', cursive;
          font-size: 13px;
          color: var(--paper-ink, #111827);
          margin-bottom: 2px;
        }

        .briefcase-note-value-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }

        .briefcase-note-value {
          font-family: 'Space Grotesk', system-ui, sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: var(--paper-ink, #111827);
        }

        .briefcase-note-max {
          font-size: 11px;
          color: rgba(55,65,81,0.9);
        }

        .briefcase-note-bar {
          margin-top: 6px;
          height: 6px;
          border-radius: 999px;
          background: rgba(148,163,184,0.6);
          overflow: hidden;
        }

        .briefcase-note-bar-fill {
          height: 100%;
          border-radius: 999px;
          transition: width 0.3s ease;
        }

        .briefcase-weight-row {
          margin-top: 6px;
          border-radius: 10px;
          background: rgba(15,23,42,0.96);
          border: 1px solid rgba(55,65,81,0.9);
          padding: 6px 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .briefcase-weight-text {
          font-family: 'Space Grotesk', system-ui, sans-serif;
          font-size: 12px;
          color: #e5e7eb;
        }

        .briefcase-weight-sub {
          font-size: 10px;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.14em;
        }

        .briefcase-weight-status {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: var(--accent-2, #22c55e);
        }

        /* ---------- SCHLÜSSELBUND (links unten) ---------- */

        .briefcase-keys-panel {
          grid-column: 1;
          grid-row: 2;
          position: relative;
          border-radius: 20px;
          background:
            linear-gradient(180deg, #111827, #020617);
          box-shadow:
            0 12px 28px rgba(0,0,0,0.9),
            inset 0 0 0 2px rgba(15,23,42,1);
          padding: 12px 14px 10px 14px;
          display: flex;
          flex-direction: column;
        }

        .briefcase-keys-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 8px;
        }

        .briefcase-keys-title {
          font-family: 'Unica One', system-ui, sans-serif;
          letter-spacing: 0.22em;
          font-size: 11px;
          text-transform: uppercase;
          color: #e5e7eb;
        }

        .briefcase-keys-sub {
          font-size: 10px;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.16em;
        }

        .briefcase-keys-ring {
          position: absolute;
          top: -18px;
          left: 50%;
          transform: translateX(-50%);
          width: 40px;
          height: 40px;
          border-radius: 999px;
          border: 4px solid var(--metal-color, #9ca3af);
          background: radial-gradient(circle, #e5e7eb, var(--metal-color, #9ca3af));
          box-shadow: 0 10px 18px rgba(0,0,0,0.9);
        }
        
        /* HINZUFÜGEN von Pulse-Effekt auf Schlüsselring */
        .briefcase-keys-ring.pulse-active {
            animation: pulseEffect var(--animation-speed, 2.5s) ease-in-out infinite;
        }

        .briefcase-keys-list {
          margin-top: 8px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
          overflow-y: auto;
        }

        .briefcase-key-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 8px;
          border-radius: 999px;
          background: rgba(15,23,42,0.96);
          border: 1px solid rgba(55,65,81,0.9);
        }

        .briefcase-key-icon {
          width: 28px;
          height: 28px;
          border-radius: 999px;
          background: radial-gradient(circle at top, #fbbf24, #b45309);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          color: #111827;
        }

        .briefcase-key-name {
          font-family: 'Space Grotesk', system-ui, sans-serif;
          font-size: 11px;
          color: #e5e7eb;
        }

        /* ---------- INVENTAR (Mitte, über beide Reihen) ---------- */

        .briefcase-inventory-panel {
          grid-column: 2;
          grid-row: 1 / span 2;
          position: relative;
          border-radius: 24px;
          background:
            linear-gradient(180deg, #111827, #020617);
          box-shadow:
            0 20px 40px rgba(0,0,0,0.95),
            inset 0 0 0 2px rgba(15,23,42,1);
          padding: 12px 14px 14px 14px;
          display: flex;
          flex-direction: column;
        }

        .briefcase-inventory-frame {
          position: absolute;
          inset: 8px;
          border-radius: 20px;
          border: 8px solid rgba(63,46,32,0.98);
          box-shadow:
            inset 0 0 0 1px rgba(0,0,0,0.9);
          pointer-events: none;
        }

        .briefcase-inventory-inner {
          position: relative;
          z-index: 1;
          border-radius: 14px;
          background:
            radial-gradient(circle at top left, rgba(248,250,252,0.06), transparent 55%),
            linear-gradient(180deg, #020617, #020617);
          padding: 10px 12px 10px 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1; /* Wichtig für Scroll-Berechnung */
        }

        .briefcase-inventory-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }

        .briefcase-inventory-title {
          font-family: 'Unica One', system-ui, sans-serif;
          letter-spacing: 0.26em;
          font-size: 11px;
          text-transform: uppercase;
          color: #e5e7eb;
        }

        .briefcase-inventory-sub {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: #9ca3af;
        }

        .briefcase-inventory-scroll {
          position: relative;
          flex: 1; /* Wichtig für Scroll-Berechnung */
          border-radius: 10px;
          background:
            linear-gradient(180deg, #020617, #020617);
          border: 1px solid rgba(31,41,55,1);
          padding: 8px;
          /* FIX 2: Scrollen aktivieren */
          overflow-y: auto;
        }

        .briefcase-inventory-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 8px;
          /* FIX 3: Wichtig für Scroll und Flex-Layout */
          min-height: 0; 
        }

        .briefcase-slot {
          position: relative;
          border-radius: 10px;
          background:
            radial-gradient(circle at top, rgba(248,250,252,0.12), transparent 60%),
            linear-gradient(160deg, #020617, #020617);
          border: 1px solid rgba(55,65,81,0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 6px;
          cursor: grab;
          transition: all 0.16s ease-out;
          /* FIX 3: Einheitliche Größe */
          aspect-ratio: 1 / 1; 
          min-height: 0;
        }

        .briefcase-slot:hover {
          transform: translateY(-2px) scale(1.03);
          box-shadow:
            0 12px 18px rgba(0,0,0,0.9),
            0 0 0 1px rgba(148,163,184,0.9);
          border-color: #e5e7eb;
        }

        .briefcase-slot.empty:hover {
            transform: none;
            box-shadow: none;
            border-color: rgba(55,65,81,0.9);
        }

        /* Dynamische Animationen für Slots */
        .briefcase-slot.slot-glow.selected {
             animation: panelGlow 3s ease-in-out infinite alternate;
        }

        .briefcase-slot.slot-flash:hover {
            animation: slotFlash 0.3s ease-out;
            transform: translateY(0px) scale(1.00); /* Flash überschreibt den Hover-Scale */
        }
        
        .briefcase-slot.selected {
          box-shadow:
            0 0 0 2px var(--accent-2, #22c55e),
            0 0 24px rgba(34,197,94,0.85);
          border-color: var(--accent-2, #22c55e);
        }

        .briefcase-item-icon {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          background: rgba(15,23,42,0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }

        .briefcase-item-qty {
          position: absolute;
          top: 4px;
          right: 6px;
          min-width: 22px;
          height: 18px;
          padding: 0 6px;
          border-radius: 999px;
          background: linear-gradient(135deg, var(--accent-1, #f97316), var(--accent-3, #22c55e));
          color: #111827;
          font-size: 11px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .briefcase-tooltip {
          position: absolute;
          padding: 4px 8px;
          border-radius: 8px;
          font-size: 11px;
          background: rgba(15,23,42,0.96);
          color: #e5e7eb;
          border: 1px solid rgba(148,163,184,0.9);
          white-space: nowrap;
          z-index: 50;
          transform: translate(-50%, -100%);
          margin-bottom: 6px;
          animation: briefcaseTooltipFade 0.16s ease-out;
        }

        @keyframes briefcaseTooltipFade {
          from { opacity: 0; transform: translate(-50%, -110%); }
          to { opacity: 1; transform: translate(-50%, -100%); }
        }

        /* HOTBAR unten im Inventar */

        .briefcase-hotbar {
          margin-top: 6px;
          border-radius: 12px;
          background:
            linear-gradient(180deg, #020617, #020617);
          border: 1px solid rgba(55,65,81,0.9);
          padding: 6px 8px;
        }

        .briefcase-hotbar-header {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: #9ca3af;
          margin-bottom: 4px;
        }

        .briefcase-hotbar-row {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 6px;
        }
        
        /* FIX 1: Wrapper-Stil für Hotbar-Slots, der den Hotbar-Hintergrund bereitstellt */
        .briefcase-hotbar-slot-wrapper {
            position: relative;
            aspect-ratio: 1 / 1;
            padding: 4px;
            border-radius: 10px;
            background: radial-gradient(circle at top, rgba(248,250,252,0.12), transparent 60%),
                        linear-gradient(145deg, #020617, #020617);
            border: 1px solid var(--accent-2, #22c55e);
            box-shadow: 0 0 0 1px rgba(34,197,94,0.6), 0 8px 14px rgba(0,0,0,0.7);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        /* Setze Hotbar Slot auf den Hotbar Style zurück */
        .briefcase-hotbar-slot-wrapper .briefcase-slot {
            border: none;
            background: none;
            padding: 0; 
            box-shadow: none !important;
            transform: none !important;
        }

        /* Hotbar Icon wird größer */
        .briefcase-hotbar-slot-wrapper .briefcase-item-icon {
            width: 38px;
            height: 38px;
            font-size: 24px;
            box-shadow: none;
            border-radius: 12px;
            background: rgba(15,23,42,0.9);
        }

        /* Korrektur des Hotbar-Item-QTY-Stils */
        .briefcase-hotbar-slot-wrapper .briefcase-item-qty {
             top: 4px; 
             right: 6px; 
             min-width: 22px; 
             height: 18px; 
             font-size: 11px;
             padding: 0 6px;
        }

        /* ---------- AKTIONEN (rechts unten) ---------- */

        .briefcase-actions-panel {
          grid-column: 3;
          grid-row: 2;
          border-radius: 20px;
          background:
            linear-gradient(180deg, #111827, #020617);
          box-shadow:
            0 12px 28px rgba(0,0,0,0.9),
            inset 0 0 0 2px rgba(15,23,42,1);
          padding: 10px 12px 10px 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .briefcase-actions-title {
          font-family: 'Unica One', system-ui, sans-serif;
          letter-spacing: 0.22em;
          font-size: 11px;
          text-transform: uppercase;
          color: #e5e7eb;
          margin-bottom: 4px;
        }

        .briefcase-action-button {
          position: relative;
          border-radius: 999px;
          padding: 8px 10px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          border: 1px solid rgba(55,65,81,0.9);
          background: rgba(15,23,42,0.96);
          color: #e5e7eb;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.16s ease;
        }

        .briefcase-action-button.primary {
          border-color: var(--accent-1, #f97316);
          background: linear-gradient(135deg, var(--accent-1, #f97316), var(--accent-2, #22c55e));
          color: #020617;
          box-shadow:
            0 14px 26px rgba(0,0,0,0.8);
        }
        
        /* HINZUFÜGEN von Pulse-Effekt auf primäre Schaltfläche */
        .briefcase-action-button.primary.pulse-active {
            animation: pulseEffect var(--animation-speed, 2.5s) ease-in-out infinite;
        }

        .briefcase-action-button::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(248,250,252,0.18), transparent 60%);
          transform: translate(-50%, -50%);
          transition: width 0.4s ease, height 0.4s ease;
        }

        .briefcase-action-button:hover::after {
          width: 230px;
          height: 230px;
        }

        .briefcase-action-button:hover {
          transform: translateY(-1px);
          box-shadow:
            0 14px 30px rgba(0,0,0,0.9);
        }

        .briefcase-hotbar-slot-wrapper {
            position: relative;
            aspect-ratio: 1 / 1;
            padding: 4px;
            border-radius: 10px;
            background: radial-gradient(circle at top, rgba(248,250,252,0.12), transparent 60%),
                        linear-gradient(145deg, #020617, #020617);
            border: 1px solid var(--accent-2, #22c55e);
            box-shadow: 0 0 0 1px rgba(34,197,94,0.6), 0 8px 14px rgba(0,0,0,0.7);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        /* Setze Hotbar Slot auf den Hotbar Style zurück */
        .briefcase-hotbar-slot-wrapper .briefcase-slot {
            border: none;
            background: none;
            padding: 0; 
            box-shadow: none !important;
            transform: none !important;
        }

        /* Hotbar Icon wird größer */
        .briefcase-hotbar-slot-wrapper .briefcase-item-icon {
            width: 38px;
            height: 38px;
            font-size: 24px;
            box-shadow: none;
            border-radius: 12px;
            background: rgba(15,23,42,0.9);
        }

        /* Korrektur des Hotbar-Item-QTY-Stils */
        .briefcase-hotbar-slot-wrapper .briefcase-item-qty {
             top: 4px; 
             right: 6px; 
             min-width: 22px; 
             height: 18px; 
             font-size: 11px;
             padding: 0 6px;
        }
        
        /* Visuelles Feedback für Drop-Ziel */
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

      `}</style>

      <div className="briefcase-shadow" />
      <div className="briefcase">
        <div className="briefcase-handle" />

        <div className="briefcase-inner">
          <div className="briefcase-wall">
            <div className="briefcase-layout">
              {/* oben links: Geldbeutel */}
              <div className={`briefcase-wallet-panel ${useGlow ? 'briefcase-panel-glow' : ''}`}>
                <div className="wallet-header">
                  <div className="wallet-title">Geldbörse</div>
                  <div className="wallet-label">Bargeld &amp; Lizenzen</div>
                </div>
                <div className="wallet-row">
                  <div className="wallet-cash">
                    <div className="wallet-cash-icon">💵</div>
                    <div className="wallet-cash-main">
                      <div className="wallet-cash-label">Bargeld</div>
                      <div className="wallet-cash-value">2.500 $</div>
                    </div>
                  </div>

                  <div className="wallet-licenses">
                    {licenses.map((lic) => (
                      <div key={lic.id} className="license-card">
                        <div className="license-main">{lic.label}</div>
                        <div className="license-sub">{lic.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* oben rechts: Stats im Deckel-Notizzettel-Stil */}
              <div className="briefcase-stats-panel">
                <div className="briefcase-stats-header">
                  <div className="briefcase-stats-title">Status Notizen</div>
                  <div className="briefcase-stats-sub">Vital &amp; Last</div>
                </div>
                <div className="briefcase-note-strip">
                  {stats.map((stat) => (
                    <div 
                      key={stat.name} 
                      className={`briefcase-note-card ${usePulse ? 'briefcase-pulse' : ''}`}
                      // Der Pulse-Effekt wird hier über die Klasse briefacse-pulse auf die Karte angewendet
                    >
                      <div className="briefcase-note-title">{stat.name}</div>
                      <div className="briefcase-note-value-row">
                        <div className="briefcase-note-value">{stat.value}</div>
                        <div className="briefcase-note-max">/ {stat.max}</div>
                      </div>
                      <div className="briefcase-note-bar">
                        <div
                          className="briefcase-note-bar-fill"
                          style={{
                            width: `${(stat.value / stat.max) * 100}%`,
                            background: stat.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="briefcase-weight-row">
                  <div>
                    <div className="briefcase-weight-text">24.5 / 50.0 kg</div>
                    <div className="briefcase-weight-sub">Gewicht / Gesamtgewicht</div>
                  </div>
                  <div className="briefcase-weight-status">OK</div>
                </div>
              </div>

              {/* links unten: Schlüsselbund */}
              <div className="briefcase-keys-panel">
                <div className={`briefcase-keys-ring ${usePulse ? 'briefcase-pulse' : ''}`} />
                <div className="briefcase-keys-header">
                  <div className="briefcase-keys-title">Schlüsselbund</div>
                  <div className="briefcase-keys-sub">{keys.length} Schlüssel</div>
                </div>
                <div className="briefcase-keys-list">
                  {keys.map((k, i) => (
                    <div key={i} className="briefcase-key-item">
                      <div className="briefcase-key-icon">{k.icon}</div>
                      <div className="briefcase-key-name">{k.name}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mitte: Inventar + Hotbar */}
              <div className={`briefcase-inventory-panel ${useGlow ? 'briefcase-panel-glow' : ''}`}>
                <div className="briefcase-inventory-frame" />
                <div className="briefcase-inventory-inner">
                  <div className="briefcase-inventory-header">
                    <div className="briefcase-inventory-title">INVENTAR</div>
                    <div className="briefcase-inventory-sub">
                      50 Slots • {inventoryItems.filter(isItemDefined).length} belegt
                    </div>
                  </div>

                  <div className="briefcase-inventory-scroll">
                    <div className="briefcase-inventory-grid">
                      {/* Inventar Slots (Index 0 bis 49) */}
                      {inventoryItems.map((item, index) => renderSlot(item, index))}
                    </div>
                  </div>

                  {/* Hotbar: Nutzt renderSlot für D&D und wickelt ihn in einen Hotbar-Wrapper-Stil */}
                  <div className="briefcase-hotbar">
                    <div className="briefcase-hotbar-header">Hotbar • Schnellzugriff</div>
                    <div className="briefcase-hotbar-row">
                      {hotbarItems.map((item, index) => {
                          const isOccupied = isItemDefined(item);
                          
                          // Hotbar-Slots spiegeln die ersten 5 Hauptslots wider (Index 0-4)
                          return (
                              <div key={index} className="briefcase-hotbar-slot">
                                  {isOccupied && (
                                      <div className="briefcase-hotbar-icon">{item.emoji}</div>
                                  )}
                              </div>
                          );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* rechts unten: Aktionen */}
              <div className="briefcase-actions-panel">
                <div className="briefcase-actions-title">Aktionen</div>
                <button className={`briefcase-action-button primary ${usePulse ? 'briefcase-pulse' : ''}`}>
                  Auf den Boden ablegen
                </button>
                <button className="briefcase-action-button">
                  Vom Boden aufheben
                </button>
                <button className="briefcase-action-button">
                  Geben-Modus
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}