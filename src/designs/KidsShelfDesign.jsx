import React, { useState } from 'react';
import { Package } from 'lucide-react';

export default function KidsShelfDesign({ themeKey, animationKey, inventoryItems, moveItem, keys, licenses, stats }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);

  const isItemDefined = (item) => item !== null && item?.emoji !== undefined && item?.emoji !== '';

  const isPinkTheme = themeKey === 'neonMiami'; // pinkes Theme => Teddy im Regal

  const hotbarSlots = inventoryItems.slice(0, 5); // Hotbar = erste 5 Slots (Index 0 bis 4)
  
  // Bestimme die zu verwendenden Animationsklassen
  const useGlow = animationKey === 'subtleGlow' || animationKey === 'scannerPulse';
  const useFlash = animationKey === 'quickResponse';
  const usePulse = animationKey === 'scannerPulse';

  // --- DRAG & DROP HANDLER ---

  const handleDragStart = (e, index) => {
    if (!isItemDefined(inventoryItems[index])) {
      e.preventDefault();
      return;
    }
    setDraggedItemIndex(index);
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
      moveItem(fromIndex, toIndex);
    }
    setDraggedItemIndex(null);
  };

  // Funktion zum Rendern eines einzelnen Slots (für Inventar und Hotbar)
  const renderSlot = (item, index) => {
    const isOccupied = isItemDefined(item);
    const slotClass = `kids-inventory-slot ${!isOccupied ? 'empty' : ''} ${
      selectedItem === item?.id ? 'selected' : ''
    } ${useFlash ? 'kids-slot-flash' : ''} ${isOccupied && useGlow ? 'slot-glow' : ''}`;

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
            <div className="kids-item-icon">{item.emoji}</div>
            {item.quantity > 1 && (
              <div className="kids-item-qty">{item.quantity}</div>
            )}
            {hoveredItem === item.id && (
              <div
                className="kids-tooltip"
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
    <div className="kids-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Unica+One&family=Shadows+Into+Light&display=swap');

        .kids-root {
          position: relative;
          width: 100%;
          max-width: 1100px; /* passend zum Wrapper im SurvivalInventory */
          aspect-ratio: 16 / 9;
          margin: 0 auto;
          border-radius: 30px;
          padding: 18px 22px 22px 22px;
          background:
            radial-gradient(circle at top left, rgba(244,114,182,0.18), transparent 55%),
            radial-gradient(circle at top right, rgba(56,189,248,0.18), transparent 55%),
            linear-gradient(180deg, #0f172a 0%, #020617 60%, #000 100%);
          box-shadow:
            0 40px 90px rgba(0,0,0,0.9),
            0 0 0 1px rgba(15,23,42,0.9);
          overflow: hidden;
          display: grid;
          grid-template-rows: 1fr auto;
          gap: 10px;
        }
        
        /* HINZUFÜGEN: Klassen für Animationen */
        .kids-panel-glow {
            animation: panelGlow var(--animation-speed, 3s) ease-in-out infinite alternate;
        }
        
        .kids-pulse {
            animation: pulseEffect var(--animation-speed, 2.5s) ease-in-out infinite;
        }
        
        .kids-slot-flash:hover {
            animation: slotFlash 0.3s ease-out;
            transform: translateY(0px) scale(1.00);
        }


        .kids-wall {
          position: relative;
          border-radius: 18px;
          background:
            radial-gradient(circle at top left, rgba(248,250,252,0.18), transparent 60%),
            repeating-linear-gradient(
              -45deg,
              rgba(148,163,184,0.16) 0,
              rgba(148,163,184,0.16) 4px,
              rgba(15,23,42,0.1) 4px,
              rgba(15,23,42,0.1) 8px
            );
          padding: 14px 20px;
        }

        /* EIN gemeinsames Layout-Grid:
           3 Spalten (links: Wallet+Keys, Mitte: Inventar, rechts: Stats+Aktionen)
           2 Reihen (oben: Wallet + Inventar + Stats, unten: Keys + Inventar + Aktionen),
           beide Reihen füllen die Höhe */
        .kids-layout {
          display: grid;
          grid-template-columns: 260px minmax(0, 1fr) 220px;
          grid-template-rows: minmax(0, 1fr) minmax(0, 1fr);
          gap: 16px;
          align-items: stretch;
          height: 100%;
        }

        .kids-floor {
          position: relative;
          border-radius: 18px;
          background:
            linear-gradient(180deg, #111827 0, #020617 40%, #000 100%);
          box-shadow: inset 0 8px 12px rgba(0,0,0,0.85);
        }

        .kids-floor-line {
          position: absolute;
          inset: 10px 40px 0 40px;
          border-top: 3px solid rgba(15,23,42,0.95);
        }

        /* ---------- GELDBEUTEL (oben links, Spalte 1, Zeile 1) ---------- */

        .kids-wallet-panel {
          grid-column: 1;
          grid-row: 1;
          position: relative;
          border-radius: 22px;
          background:
            linear-gradient(135deg, #111827, #020617);
          box-shadow:
            0 16px 34px rgba(0,0,0,0.85),
            inset 0 0 0 2px rgba(15,23,42,1);
          padding: 12px 14px 14px 14px;
          display: flex;
          flex-direction: column;
        }

        .kids-wallet-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 10px;
        }

        .kids-wallet-title {
          font-family: 'Unica One', system-ui, sans-serif;
          letter-spacing: 0.22em;
          font-size: 11px;
          text-transform: uppercase;
          color: #e5e7eb;
        }

        .kids-wallet-sub {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: #9ca3af;
        }

        .kids-wallet-row {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }

        .kids-wallet-cash {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          border-radius: 14px;
          background: linear-gradient(135deg, var(--accent-1, #f97316), var(--accent-2, #22c55e));
          box-shadow: 0 14px 24px rgba(0,0,0,0.7);
        }

        .kids-wallet-cash-icon {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          background: rgba(15,23,42,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
        }

        .kids-wallet-cash-main {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .kids-wallet-label {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: rgba(15,23,42,0.85);
        }

        .kids-wallet-value {
          font-family: 'Space Grotesk', system-ui, sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #f9fafb;
        }

        .kids-wallet-licenses {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 6px;
          margin-top: 4px;
        }

        .kids-license-card {
          border-radius: 10px;
          background: linear-gradient(135deg, #0f172a, #020617);
          border: 1px solid rgba(148,163,184,0.7);
          padding: 6px 8px;
        }

        .kids-license-main {
          font-family: 'Space Grotesk', system-ui, sans-serif;
          font-size: 11px;
          font-weight: 600;
          color: #e5e7eb;
        }

        .kids-license-sub {
          font-size: 10px;
          color: #9ca3af;
        }

        /* ---------- STATS (oben rechts, Spalte 3, Zeile 1) ---------- */

        .kids-stats-panel {
          grid-column: 3;
          grid-row: 1;
          border-radius: 22px;
          background:
            radial-gradient(circle at top left, rgba(248,250,252,0.12), transparent 60%),
            linear-gradient(135deg, #020617, #020617);
          box-shadow:
            0 16px 34px rgba(0,0,0,0.85),
            inset 0 0 0 2px rgba(15,23,42,1);
          padding: 12px 14px 12px 14px;
          display: flex;
          flex-direction: column;
        }

        .kids-stats-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 6px;
        }

        .kids-stats-title {
          font-family: 'Unica One', system-ui, sans-serif;
          letter-spacing: 0.22em;
          font-size: 11px;
          text-transform: uppercase;
          color: #e5e7eb;
        }

        .kids-stats-sub {
          font-size: 10px;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.16em;
        }

        .kids-stats-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
        }

        .kids-stat-block {
          border-radius: 10px;
          background: rgba(15,23,42,0.96);
          border: 1px solid rgba(55,65,81,0.9);
          padding: 6px 8px;
        }
        
        /* HINZUFÜGEN von Pulse-Effekt auf Stat-Blöcke */
        .kids-stat-block.pulse-active {
            animation: pulseEffect var(--animation-speed, 2.5s) ease-in-out infinite;
        }

        .kids-stat-name {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: #9ca3af;
          margin-bottom: 2px;
        }

        .kids-stat-value-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 4px;
        }

        .kids-stat-value {
          font-family: 'Space Grotesk', system-ui, sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #e5e7eb;
        }

        .kids-stat-max {
          font-size: 11px;
          color: #6b7280;
        }

        .kids-stat-bar {
          height: 6px;
          border-radius: 999px;
          background: rgba(31,41,55,1);
          overflow: hidden;
        }

        .kids-stat-bar-fill {
          height: 100%;
          border-radius: 999px;
          transition: width 0.3s ease;
        }

        .kids-weight-row {
          margin-top: 6px;
          border-radius: 10px;
          background: rgba(15,23,42,0.96);
          border: 1px solid rgba(55,65,81,0.9);
          padding: 6px 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .kids-weight-text {
          font-family: 'Space Grotesk', system-ui, sans-serif;
          font-size: 12px;
          color: #e5e7eb;
        }

        .kids-weight-sub {
          font-size: 10px;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.14em;
        }

        .kids-weight-status {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: var(--accent-2, #22c55e);
        }

        /* ---------- SCHLÜSSELBUND (links unten, Spalte 1, Zeile 2) ---------- */

        .kids-keys-panel {
          grid-column: 1;
          grid-row: 2;
          position: relative;
          border-radius: 22px;
          background:
            linear-gradient(180deg, #111827, #020617);
          box-shadow:
            0 12px 28px rgba(0,0,0,0.9),
            inset 0 0 0 2px rgba(15,23,42,1);
          padding: 12px 14px 10px 14px;
          display: flex;
          flex-direction: column;
        }

        .kids-keys-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 8px;
        }

        .kids-keys-title {
          font-family: 'Unica One', system-ui, sans-serif;
          letter-spacing: 0.22em;
          font-size: 11px;
          text-transform: uppercase;
          color: #e5e7eb;
        }

        .kids-keys-sub {
          font-size: 10px;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.16em;
        }

        .kids-keys-ring {
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
        .kids-keys-ring.pulse-active {
            animation: pulseEffect var(--animation-speed, 2.5s) ease-in-out infinite;
        }

        .kids-keys-list {
          margin-top: 8px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
          overflow-y: auto;
        }

        .kids-key-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 8px;
          border-radius: 999px;
          background: rgba(15,23,42,0.96);
          border: 1px solid rgba(55,65,81,0.9);
        }

        .kids-key-icon {
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

        .kids-key-name {
          font-family: 'Space Grotesk', system-ui, sans-serif;
          font-size: 11px;
          color: #e5e7eb;
        }

        /* ---------- INVENTAR (Mitte, Spalte 2, Zeilen 1–2) ---------- */

        .kids-inventory-panel {
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

        .kids-inventory-bg-frame {
          position: absolute;
          inset: 8px;
          border-radius: 20px;
          border: 8px solid rgba(120,53,15,0.98);
          box-shadow: inset 0 0 0 1px rgba(0,0,0,0.9);
          pointer-events: none;
        }

        .kids-inventory-inner {
          position: relative;
          z-index: 1;
          border-radius: 14px;
          background:
            linear-gradient(180deg, rgba(15,23,42,0.98), rgba(15,23,42,0.98));
          padding: 10px 12px 10px 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }

        .kids-inventory-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }

        .kids-inventory-title {
          font-family: 'Unica One', system-ui, sans-serif;
          letter-spacing: 0.26em;
          font-size: 11px;
          text-transform: uppercase;
          color: #e5e7eb;
        }

        .kids-inventory-sub {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: #9ca3af;
        }

        .kids-inventory-scroll {
          position: relative;
          flex: 30vh;
          border-radius: 12px;
          background:
            linear-gradient(180deg, #020617, #020617);
          border: 1px solid rgba(31,41,55,1);
          padding: 8px;
          overflow-y: auto;
        }

        .kids-inventory-teddy-bg {
          position: absolute;
          right: 12px;
          bottom: 8px;
          font-size: 64px;
          opacity: 0.18;
          pointer-events: none;
          filter: drop-shadow(0 16px 18px rgba(0,0,0,0.9));
        }

        .kids-inventory-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 8px;
          min-height: 0;
        }

        .kids-inventory-slot {
          position: relative;
          border-radius: 10px;
          background:
            radial-gradient(circle at top left, rgba(248,250,252,0.12), transparent 55%),
            linear-gradient(180deg, #020617, #020617);
          border: 1px solid rgba(55,65,81,0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 6px;
          cursor: grab;
          transition: all 0.16s ease-out;
          aspect-ratio: 1 / 1;
          min-height: 0;
        }

        .kids-inventory-slot.empty:hover {
            transform: none;
            box-shadow: none;
            border-color: rgba(55,65,81,0.9);
        }

        .kids-inventory-slot:hover {
          transform: translateY(-2px) scale(1.03);
          box-shadow:
            0 12px 18px rgba(0,0,0,0.9),
            0 0 0 1px rgba(148,163,184,0.9);
          border-color: #e5e7eb;
        }

        .kids-inventory-slot.selected {
          box-shadow:
            0 0 0 2px var(--accent-2, #22c55e),
            0 0 24px rgba(34,197,94,0.85);
          border-color: var(--accent-2, #22c55e);
        }

        .kids-item-icon {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          background: rgba(15,23,42,0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }

        .kids-item-qty {
          position: absolute;
          top: 4px;
          right: 6px;
          border-radius: 999px;
          min-width: 22px;
          height: 18px;
          padding: 0 6px;
          font-size: 11px;
          font-weight: 700;
          background: linear-gradient(135deg, var(--accent-1, #f97316), var(--accent-3, #22c55e));
          color: #111827;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .kids-tooltip {
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
          animation: kidsTooltipFade 0.16s ease-out;
        }

        @keyframes kidsTooltipFade {
          from { opacity: 0; transform: translate(-50%, -110%); }
          to { opacity: 1; transform: translate(-50%, -100%); }
        }

        /* HOTBAR unter dem Inventar (innerhalb des Inventarpanels) */

        .kids-hotbar {
          margin-top: 6px;
          border-radius: 14px;
          background:
            linear-gradient(180deg, #020617, #020617);
          border: 1px solid rgba(55,65,81,0.9);
          padding: 6px 8px;
        }

        .kids-hotbar-header {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: #9ca3af;
          margin-bottom: 4px;
        }

        .kids-hotbar-row {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 6px;
        }

        .kids-hotbar-slot {
          position: relative;
          border-radius: 10px;
          background:
            radial-gradient(circle at top left, rgba(248,250,252,0.12), transparent 55%),
            linear-gradient(145deg, #020617, #020617);
          border: 1px solid var(--accent-2, #22c55e);
          box-shadow:
            0 0 0 1px rgba(34,197,94,0.6),
            0 8px 14px rgba(0,0,0,0.7);
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .kids-hotbar-icon {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: rgba(15,23,42,0.96);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
        }

        .kids-hotbar-slot-wrapper {
            position: relative;
            aspect-ratio: 1 / 1;
            padding: 4px;
            border-radius: 10px;
            background: radial-gradient(circle at top left, rgba(248,250,252,0.12), transparent 55%),
                        linear-gradient(145deg, #020617, #020617);
            border: 1px solid var(--accent-2, #22c55e);
            box-shadow: 0 0 0 1px rgba(34,197,94,0.6), 0 8px 14px rgba(0,0,0,0.7);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        /* Setze nested slot auf Hotbar-Style zurück */
        .kids-hotbar-slot-wrapper .kids-inventory-slot {
            border: none;
            background: none;
            padding: 0; 
            box-shadow: none !important;
            transform: none !important;
            cursor: grab;
        }

        /* Hotbar Icon wird größer */
        .kids-hotbar-slot-wrapper .kids-item-icon {
            width: 34px;
            height: 34px;
            font-size: 22px;
            box-shadow: none;
            border-radius: 10px;
            background: rgba(15,23,42,0.96);
        }

        /* Korrektur des Hotbar-Item-QTY-Stils */
        .kids-hotbar-slot-wrapper .kids-item-qty {
             top: 4px; 
             right: 6px; 
             min-width: 22px; 
             height: 18px; 
             font-size: 11px;
             padding: 0 6px;
        }

        /* ---------- AKTIONEN (rechts unten, Spalte 3, Zeile 2) ---------- */

        .kids-actions-panel {
          grid-column: 3;
          grid-row: 2;
          border-radius: 22px;
          background:
            linear-gradient(180deg, #111827, #020617);
          box-shadow:
            0 12px 28px rgba(0,0,0,0.9),
            inset 0 0 0 2px rgba(15,23,42,1);
          padding: 10px 12px 10px 12px;
          display: flex;
          flex-direction: column;
        }

        .kids-actions-title {
          font-family: 'Unica One', system-ui, sans-serif;
          letter-spacing: 0.22em;
          font-size: 11px;
          text-transform: uppercase;
          color: #e5e7eb;
          margin-bottom: 4px;
        }

        .kids-action-button {
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

        .kids-action-button.primary {
          border-color: var(--accent-1, #f97316);
          background: linear-gradient(135deg, var(--accent-1, #f97316), var(--accent-2, #22c55e));
          color: #020617;
          box-shadow:
            0 14px 26px rgba(0,0,0,0.8);
        }
        
        /* HINZUFÜGEN von Pulse-Effekt auf primäre Schaltfläche */
        .kids-action-button.primary.pulse-active {
            animation: pulseEffect var(--animation-speed, 2.5s) ease-in-out infinite;
        }

        .kids-action-button::after {
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

        .kids-action-button:hover::after {
          width: 230px;
          height: 230px;
        }

        .kids-action-button:hover {
          transform: translateY(-1px);
          box-shadow:
            0 14px 30px rgba(0,0,0,0.9);
        }

      `}</style>

      {/* Wand / UI-Fläche */}
      <div className="kids-wall">
        <div className="kids-layout">
          {/* oben links: Geldbeutel */}
          <div className={`kids-wallet-panel ${useGlow ? 'kids-panel-glow' : ''}`}>
            <div className="kids-wallet-header">
              <div className="kids-wallet-title">Geldbeutel</div>
              <div className="kids-wallet-sub">Bargeld &amp; Lizenzen</div>
            </div>
            <div className="kids-wallet-row">
              <div className={`kids-wallet-cash ${usePulse ? 'kids-pulse' : ''}`}>
                <div className="kids-wallet-cash-icon">💰</div>
                <div className="kids-wallet-cash-main">
                  <div className="kids-wallet-label">Bargeld</div>
                  <div className="kids-wallet-value">2.500 $</div>
                </div>
              </div>
              <div className="kids-wallet-licenses">
                {licenses.map((lic) => (
                  <div key={lic.id} className="kids-license-card">
                    <div className="kids-license-main">{lic.label}</div>
                    <div className="kids-license-sub">{lic.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* oben rechts: Stats */}
          <div className={`kids-stats-panel ${useGlow ? 'kids-panel-glow' : ''}`}>
            <div className="kids-stats-header">
              <div className="kids-stats-title">Status</div>
              <div className="kids-stats-sub">Vital &amp; Last</div>
            </div>
            <div className="kids-stats-grid">
              {stats.map((stat) => (
                <div key={stat.name} className={`kids-stat-block ${usePulse ? 'kids-pulse' : ''}`}>
                  <div className="kids-stat-name">{stat.name}</div>
                  <div className="kids-stat-value-row">
                    <div className="kids-stat-value">{stat.value}</div>
                    <div className="kids-stat-max">/ {stat.max}</div>
                  </div>
                  <div className="kids-stat-bar">
                    <div
                      className="kids-stat-bar-fill"
                      style={{
                        width: `${(stat.value / stat.max) * 100}%`,
                        background: stat.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="kids-weight-row">
              <div>
                <div className="kids-weight-text">24.5 / 50.0 kg</div>
                <div className="kids-weight-sub">Gewicht / Gesamtgewicht</div>
              </div>
              <div className="kids-weight-status">OK</div>
            </div>
          </div>

          {/* links unten: Schlüsselbund */}
          <div className={`kids-keys-panel ${useGlow ? 'kids-panel-glow' : ''}`}>
            <div className={`kids-keys-ring ${usePulse ? 'kids-pulse' : ''}`} />
            <div className="kids-keys-header">
              <div className="kids-keys-title">Schlüsselbund</div>
              <div className="kids-keys-sub">{keys.length} Schlüssel</div>
            </div>
            <div className="kids-keys-list">
              {keys.map((k, i) => (
                <div key={i} className="kids-key-item">
                  <div className="kids-key-icon">{k.icon}</div>
                  <div className="kids-key-name">{k.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Mitte: Inventar + Hotbar (über beide Zeilen) */}
          <div className="kids-inventory-panel">
            <div className="kids-inventory-bg-frame" />
            <div className={`kids-inventory-inner ${useGlow ? 'kids-panel-glow' : ''}`}>
              <div className="kids-inventory-header">
                <div className="kids-inventory-title">INVENTAR</div>
                <div className="kids-inventory-sub">
                  50 Slots • {inventoryItems.filter(isItemDefined).length} belegt
                </div>
              </div>

              <div className="kids-inventory-scroll">
                {isPinkTheme && (
                  <div className="kids-inventory-teddy-bg">🧸</div>
                )}
                <div className="kids-inventory-grid">
                  {/* Inventar Slots (Index 0 bis 49) */}
                  {inventoryItems.map((item, index) => renderSlot(item, index))}
                </div>
              </div>

              {/* Hotbar: Nutzt renderSlot für D&D und wickelt ihn in einen Hotbar-Wrapper-Stil */}
              <div className="kids-hotbar">
                <div className="kids-hotbar-header">Hotbar • Schnellzugriff</div>
                <div className="kids-hotbar-row">
                  {/* Hotbar mappt die ersten 5 Items. Index ist 0 bis 4! */}
                  {hotbarSlots.map((item, index) => (
                    <div key={index} className="kids-hotbar-slot-wrapper">
                        {renderSlot(item, index)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* rechts unten: Aktionen */}
          <div className={`kids-actions-panel ${useGlow ? 'kids-panel-glow' : ''}`}>
            <div className="kids-actions-title">Aktionen</div>
            <button className={`kids-action-button primary ${usePulse ? 'kids-pulse' : ''}`}>
              Auf den Boden ablegen
            </button>
            <button className="kids-action-button">
              Vom Boden aufheben
            </button>
            <button className="kids-action-button">
              Geben-Modus
            </button>
          </div>
        </div>
      </div>

      {/* Boden */}
      <div className="kids-floor">
        <div className="kids-floor-line" />
      </div>
    </div>
  );
}