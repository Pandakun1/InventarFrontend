import React, { useState } from 'react';
import { Package } from 'lucide-react';

export default function RetroDrawerDesign({ themeKey, animationKey, inventoryItems, moveItem, keys, licenses, stats }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);

  const isItemDefined = (item) => item !== null && item?.emoji !== undefined && item?.emoji !== '';

  const hotbarSlots = inventoryItems.slice(0, 5);
  
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

  // --- ENDE DRAG & DROP HANDLER ---

  // Funktion zum Rendern eines einzelnen Slots (für Inventar und Hotbar)
  const renderSlot = (item, index) => {
    const isOccupied = isItemDefined(item);
    const slotClass = `drawer-slot ${!isOccupied ? 'empty' : ''} ${
      selectedItem === item?.id ? 'selected' : ''
    } ${useFlash ? 'drawer-slot-flash' : ''} ${isOccupied && useGlow ? 'slot-glow' : ''}`;

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
            <div className="drawer-item-icon">{item.emoji}</div>
            {item.quantity > 1 && (
              <div className="drawer-item-qty">{item.quantity}</div>
            )}
            {hoveredItem === item.id && (
              <div
                className="drawer-tooltip"
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
    <div className="drawer-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Unica+One&family=Shadows+Into+Light&display=swap');

        .drawer-root {
          position: relative;
          width: 100%;
          max-width: 1100px;
          aspect-ratio: 16 / 9;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .drawer-shadow {
          position: absolute;
          inset: 0;
          filter: blur(40px);
          background:
            radial-gradient(circle at top, rgba(248,250,252,0.12), transparent 60%),
            radial-gradient(circle at bottom right, rgba(147,51,234,0.25), transparent 65%),
            radial-gradient(circle at bottom left, rgba(248,250,252,0.12), transparent 60%);
          opacity: 0.8;
        }

        .drawer-shell {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 32px;
          background:
            radial-gradient(circle at top left, rgba(248,250,252,0.08), transparent 60%),
            linear-gradient(180deg, #4b2c18 0%, #2b160c 45%, #1b110a 100%);
          box-shadow:
            0 30px 70px rgba(0,0,0,0.95),
            0 0 0 2px rgba(15,23,42,0.95);
          padding: 18px 22px 18px 22px;
          display: grid;
          grid-template-rows: 1fr auto;
          overflow: hidden;
        }
        
        /* HINZUFÜGEN: Klassen für Animationen */
        .drawer-panel-glow {
            animation: panelGlow var(--animation-speed, 3s) ease-in-out infinite alternate;
        }
        
        .drawer-pulse {
            animation: pulseEffect var(--animation-speed, 2.5s) ease-in-out infinite;
        }
        
        .drawer-slot-flash:hover {
            animation: slotFlash 0.3s ease-out;
            transform: translateY(0px) scale(1.00);
        }

        .drawer-shell::before {
          /* Außenholzrahmen */
          content: '';
          position: absolute;
          inset: 8px;
          border-radius: 24px;
          border: 7px solid rgba(94,54,27,0.98);
          box-shadow:
            inset 0 0 0 1px rgba(0,0,0,0.85);
          pointer-events: none;
        }

        .drawer-shell::after {
          /* Holzmaserung / Desk */
          content: '';
          position: absolute;
          inset: 18px 28px 22px 28px;
          border-radius: 18px;
          background:
            repeating-linear-gradient(
              90deg,
              rgba(68,32,15,0.98) 0,
              rgba(68,32,15,0.98) 32px,
              rgba(55,28,13,0.98) 32px,
              rgba(55,28,13,0.98) 64px
            );
          opacity: 0.22;
          pointer-events: none;
        }

        .drawer-title-plate {
          position: absolute;
          top: 10px;
          left: 50%;
          transform: translateX(-50%);
          padding: 3px 14px;
          border-radius: 999px;
          background: radial-gradient(circle at top, #e5e7eb, #6b7280);
          box-shadow:
            0 8px 12px rgba(0,0,0,0.85),
            inset 0 0 0 1px rgba(148,163,184,0.7);
          font-family: 'Unica One', system-ui, sans-serif;
          font-size: 10px;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: #111827;
        }

        .drawer-inner-wall {
          position: relative;
          border-radius: 20px;
          background:
            linear-gradient(90deg,
              rgba(124,74,38,0.9) 0,
              rgba(68,32,15,0.98) 14%,
              rgba(68,32,15,0.98) 86%,
              rgba(124,74,38,0.9) 100%
            ),
            repeating-linear-gradient(
              90deg,
              rgba(0,0,0,0.18) 0,
              rgba(0,0,0,0.18) 1px,
              transparent 1px,
              transparent 24px
            );
          padding: 14px 18px;
          box-shadow:
            inset 0 0 0 1px rgba(15,23,42,0.85);
        }

        /* Layout-Grid bleibt: 3 Spalten x 2 Reihen */
        .drawer-layout {
          display: grid;
          grid-template-columns: 250px minmax(0, 1fr) 220px;
          grid-template-rows: minmax(0, 1fr) minmax(0, 1fr);
          gap: 16px;
          height: 100%;
          align-items: stretch;
        }

        .drawer-floor {
          position: relative;
          border-radius: 18px;
          background:
            linear-gradient(180deg, #111827 0, #020617 45%, #000 100%);
          box-shadow: inset 0 8px 12px rgba(0,0,0,0.85);
        }

        .drawer-floor-line {
          position: absolute;
          inset: 10px 40px 0 40px;
          border-top: 3px solid rgba(15,23,42,0.95);
        }

        /* ---------- WALLET-SCHRUBLADE (oben links) mit Papier + Büroklammern ---------- */

        .drawer-wallet-panel {
          grid-column: 1;
          grid-row: 1;
          position: relative;
          border-radius: 18px;
          background:
            linear-gradient(180deg, #321a0e, #1b1008);
          box-shadow:
            0 16px 36px rgba(0,0,0,0.95),
            inset 0 0 0 1px rgba(0,0,0,0.9);
          padding: 10px 12px 12px 12px;
          display: flex;
          flex-direction: column;
        }

        .drawer-wallet-panel::before {
          /* Rahmen der Schubladenfront */
          content: '';
          position: absolute;
          inset: 6px;
          border-radius: 14px;
          border: 3px solid rgba(75,40,20,0.9);
          box-shadow: inset 0 0 0 1px rgba(0,0,0,0.9);
          pointer-events: none;
        }

        .drawer-wallet-panel::after {
          /* Holzknopf */
          content: '';
          position: absolute;
          bottom: -7px;
          left: 50%;
          transform: translateX(-50%);
          width: 18px;
          height: 18px;
          border-radius: 999px;
          background: radial-gradient(circle at top, #e5e7eb, #6b7280);
          box-shadow:
            0 6px 10px rgba(0,0,0,0.9);
        }
        
        /* HINZUFÜGEN von Pulse-Effekt auf Holzknopf */
        .drawer-wallet-panel.pulse-active::after {
            animation: pulseEffect var(--animation-speed, 2.5s) ease-in-out infinite;
        }

        .drawer-wallet-header {
          position: relative;
          z-index: 1;
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 6px;
        }

        .drawer-wallet-title {
          font-family: 'Unica One', system-ui, sans-serif;
          letter-spacing: 0.22em;
          font-size: 11px;
          text-transform: uppercase;
          color: #f9fafb;
        }

        .drawer-wallet-sub {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: #e5e7ebaa;
        }

        .drawer-notes-stack {
          position: relative;
          margin-top: 2px;
        }

        .drawer-note-sheet {
          position: relative;
          border-radius: 10px;
          background: #fef3c7;
          padding: 7px 8px 9px 10px;
          box-shadow:
            0 8px 14px rgba(0,0,0,0.7),
            inset 0 0 0 1px rgba(0,0,0,0.1);
        }

        .drawer-note-sheet::before {
          /* leicht herausstehendes zweites Blatt */
          content: '';
          position: absolute;
          inset: 3px 6px auto auto;
          height: 80%;
          border-radius: 8px;
          background: #fef9c3;
          box-shadow: 0 4px 8px rgba(0,0,0,0.25);
          transform: translate(4px, 4px);
          opacity: 0.9;
        }

        .drawer-paperclip {
          position: absolute;
          top: -6px;
          right: 16px;
          width: 24px;
          height: 20px;
          border-radius: 999px;
          border: 2px solid rgba(148,163,184,1);
          border-left-color: transparent;
          border-bottom-color: transparent;
          transform: rotate(18deg);
          box-shadow: 0 4px 4px rgba(0,0,0,0.4);
        }

        .drawer-wallet-content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .drawer-cash-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .drawer-cash-icon {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          background: rgba(15,23,42,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .drawer-cash-main {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .drawer-cash-label {
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #6b7280;
        }

        .drawer-cash-value {
          font-family: 'Space Grotesk', system-ui, sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #111827;
        }

        .drawer-license-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 4px;
          margin-top: 4px;
        }

        .drawer-license-tag {
          border-radius: 7px;
          background: #f9fafb;
          padding: 4px 6px;
          box-shadow:
            0 3px 5px rgba(0,0,0,0.25),
            inset 0 0 0 1px rgba(148,163,184,0.5);
        }

        .drawer-license-name {
          font-size: 11px;
          font-weight: 600;
          color: #111827;
        }

        .drawer-license-desc {
          font-size: 10px;
          color: #4b5563;
        }

        /* ---------- STATS (oben rechts) – Karteikarten mit Büroklammern ---------- */

        .drawer-stats-panel {
          grid-column: 3;
          grid-row: 1;
          border-radius: 18px;
          background:
            linear-gradient(180deg, #231717, #111827);
          box-shadow:
            0 16px 34px rgba(0,0,0,0.95),
            inset 0 0 0 1px rgba(0,0,0,0.9);
          padding: 10px 12px 12px 12px;
          display: flex;
          flex-direction: column;
        }

        .drawer-stats-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 6px;
        }

        .drawer-stats-title {
          font-family: 'Unica One', system-ui, sans-serif;
          letter-spacing: 0.22em;
          font-size: 11px;
          text-transform: uppercase;
          color: #f9fafb;
        }

        .drawer-stats-sub {
          font-size: 10px;
          color: #e5e7ebaa;
          text-transform: uppercase;
          letter-spacing: 0.16em;
        }

        .drawer-card-strip {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 6px;
        }

        .drawer-stat-card {
          position: relative;
          border-radius: 9px;
          background: #fefcf5;
          padding: 6px 7px 7px 8px;
          box-shadow:
            0 5px 8px rgba(0,0,0,0.4),
            inset 0 0 0 1px rgba(148,163,184,0.45);
        }
        
        /* HINZUFÜGEN von Pulse-Effekt auf Stat-Karten */
        .drawer-stat-card.pulse-active {
            animation: pulseEffect var(--animation-speed, 2.5s) ease-in-out infinite;
        }

        .drawer-stat-card::before {
          /* Papierclip */
          content: '';
          position: absolute;
          top: -4px;
          left: 10px;
          width: 20px;
          height: 14px;
          border-radius: 999px;
          border: 2px solid rgba(148,163,184,1);
          border-bottom-color: transparent;
          border-right-color: transparent;
          transform: rotate(-14deg);
          box-shadow: 0 3px 4px rgba(0,0,0,0.35);
        }

        .drawer-stat-name {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: #6b7280;
          margin-bottom: 2px;
        }

        .drawer-stat-value-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 3px;
        }

        .drawer-stat-value {
          font-family: 'Space Grotesk', system-ui, sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: #111827;
        }

        .drawer-stat-max {
          font-size: 11px;
          color: #9ca3af;
        }

        .drawer-stat-bar {
          height: 5px;
          border-radius: 999px;
          background: #e5e7eb;
          overflow: hidden;
        }

        .drawer-stat-bar-fill {
          height: 100%;
          border-radius: 999px;
          transition: width 0.3s ease;
        }

        .drawer-weight-row {
          margin-top: 6px;
          border-radius: 8px;
          background: #020617;
          border: 1px solid rgba(75,85,99,0.9);
          padding: 6px 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .drawer-weight-text {
          font-family: 'Space Grotesk', system-ui, sans-serif;
          font-size: 12px;
          color: #e5e7eb;
        }

        .drawer-weight-sub {
          font-size: 10px;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.14em;
        }

        .drawer-weight-status {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: var(--accent-2, #22c55e);
        }

        /* ---------- SCHLÜSSELBUND (links unten) ---------- */

        .drawer-keys-panel {
          grid-column: 1;
          grid-row: 2;
          border-radius: 18px;
          background:
            linear-gradient(180deg, #321a0e, #1b1008);
          box-shadow:
            0 12px 30px rgba(0,0,0,0.95),
            inset 0 0 0 1px rgba(0,0,0,0.9);
          padding: 10px 12px 10px 12px;
          display: flex;
          flex-direction: column;
        }

        .drawer-keys-panel::before {
          content: '';
          position: absolute;
          inset: 6px;
          border-radius: 14px;
          border: 3px solid rgba(75,40,20,0.9);
          box-shadow: inset 0 0 0 1px rgba(0,0,0,0.9);
          pointer-events: none;
        }

        .drawer-keys-panel::after {
          /* Knopf */
          content: '';
          position: absolute;
          bottom: -7px;
          left: 50%;
          transform: translateX(-50%);
          width: 18px;
          height: 18px;
          border-radius: 999px;
          background: radial-gradient(circle at top, #e5e7eb, #6b7280);
          box-shadow:
            0 6px 10px rgba(0,0,0,0.9);
        }

        .drawer-keys-header {
          position: relative;
          z-index: 1;
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 6px;
        }

        .drawer-keys-title {
          font-family: 'Unica One', system-ui, sans-serif;
          letter-spacing: 0.2em;
          font-size: 11px;
          text-transform: uppercase;
          color: #f9fafb;
        }

        .drawer-keys-sub {
          font-size: 10px;
          color: #e5e7ebaa;
          text-transform: uppercase;
          letter-spacing: 0.16em;
        }

        .drawer-key-rail {
          position: relative;
          z-index: 1;
          height: 16px;
          border-radius: 999px;
          background:
            linear-gradient(180deg, #020617, #020617);
          box-shadow:
            inset 0 0 0 1px rgba(15,23,42,0.9),
            0 4px 6px rgba(0,0,0,0.8);
          margin-bottom: 6px;
        }

        .drawer-keys-list {
          position: relative;
          z-index: 1;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
          overflow-y: auto;
        }

        .drawer-key-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 8px;
          border-radius: 999px;
          background: rgba(15,23,42,0.96);
          border: 1px solid rgba(55,65,81,0.9);
        }

        .drawer-key-icon {
          width: 26px;
          height: 26px;
          border-radius: 999px;
          background: radial-gradient(circle at top, #fbbf24, #b45309);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          color: #111827;
        }

        .drawer-key-name {
          font-family: 'Space Grotesk', system-ui, sans-serif;
          font-size: 11px;
          color: #e5e7eb;
        }

        /* ---------- INVENTAR (Mitte, über beide Reihen) mit Holz-Hintergrund sichtbar ---------- */

        .drawer-inventory-panel {
          grid-column: 2;
          grid-row: 1 / span 2;
          border-radius: 20px;
          background: transparent;
          display: flex;
          flex-direction: column;
        }

        .drawer-inventory-inner {
          border-radius: 16px;
          background:
            linear-gradient(180deg, rgba(15,23,42,0.85), rgba(15,23,42,0.9));
          backdrop-filter: blur(2px);
          padding: 10px 12px 10px 12px;
          box-shadow:
            0 20px 40px rgba(0,0,0,0.95),
            inset 0 0 0 1px rgba(0,0,0,0.9);
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }

        .drawer-inventory-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }

        .drawer-inventory-title {
          font-family: 'Unica One', system-ui, sans-serif;
          letter-spacing: 0.26em;
          font-size: 11px;
          text-transform: uppercase;
          color: #f9fafb;
        }

        .drawer-inventory-sub {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: #e5e7ebaa;
        }

        .drawer-inventory-scroll {
          position: relative;
          flex: 30vh;
          border-radius: 12px;
          background:
            linear-gradient(180deg, rgba(15,23,42,0.9), rgba(15,23,42,0.98));
          border: 1px solid rgba(31,41,55,0.95);
          padding: 8px;
          overflow-y: auto;
        }

        .drawer-inventory-scroll::before {
          /* Linienraster, leicht transparent, damit Holz durchscheint */
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(148,163,184,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148,163,184,0.08) 1px, transparent 1px);
          background-size: 24px 24px;
          pointer-events: none;
        }

        .drawer-inventory-grid {
          position: relative;
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 7px;
          z-index: 1;
          min-height: 0;
        }

        .drawer-slot {
          position: relative;
          border-radius: 9px;
          background:
            linear-gradient(180deg, rgba(15,23,42,0.82), rgba(15,23,42,0.95));
          border: 1px solid rgba(75,85,99,0.9);
          box-shadow:
            0 0 0 1px rgba(0,0,0,0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 5px;
          cursor: grab;
          transition: all 0.15s ease-out;
          aspect-ratio: 1 / 1;
          min-height: 0;
        }

        .drawer-slot.empty:hover {
            transform: none;
            box-shadow: none;
            border-color: rgba(75,85,99,0.9);
        }

        .drawer-slot::before {
          content: '';
          position: absolute;
          inset: 1px 1px auto 1px;
          height: 50%;
          border-radius: 8px 8px 0 0;
          background: radial-gradient(circle at top, rgba(248,250,252,0.18), transparent 70%);
          opacity: 0.6;
          pointer-events: none;
        }

        .drawer-slot:hover {
          transform: translateY(-1px);
          box-shadow:
            0 10px 14px rgba(0,0,0,0.9),
            0 0 0 1px rgba(248,250,252,0.6);
          border-color: #e5e7eb;
        }

        /* Dynamische Animationen für Slots */
        .drawer-slot.slot-glow.selected {
             animation: panelGlow 3s ease-in-out infinite alternate;
        }

        .drawer-slot.slot-flash:hover {
            animation: slotFlash 0.3s ease-out;
            transform: translateY(0px) scale(1.00);
        }

        .drawer-slot.selected {
          box-shadow:
            0 0 0 2px var(--accent-2, #22c55e),
            0 0 22px rgba(34,197,94,0.85);
          border-color: var(--accent-2, #22c55e);
        }

        .drawer-item-icon {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          background: rgba(15,23,42,0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
        }

        .drawer-item-qty {
          position: absolute;
          bottom: 3px;
          right: 4px;
          min-width: 20px;
          height: 16px;
          border-radius: 999px;
          padding: 0 5px;
          font-size: 10px;
          font-weight: 700;
          background: linear-gradient(135deg, var(--accent-1, #f97316), var(--accent-3, #22c55e));
          color: #111827;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .drawer-tooltip {
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
          animation: drawerTooltipFade 0.16s ease-out;
        }

        @keyframes drawerTooltipFade {
          from { opacity: 0; transform: translate(-50%, -110%); }
          to { opacity: 1; transform: translate(-50%, -100%); }
        }

        /* HOTBAR */

        .drawer-hotbar {
          margin-top: 6px;
          border-radius: 10px;
          background: #020617;
          border: 1px solid rgba(55,65,81,0.9);
          padding: 6px 8px;
        }

        .drawer-hotbar-header {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: #9ca3af;
          margin-bottom: 4px;
        }

        .drawer-hotbar-row {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 6px;
        }

        .drawer-hotbar-slot {
          position: relative;
          border-radius: 8px;
          background:
            linear-gradient(135deg, #020617, #020617);
          border: 1px solid var(--accent-2, #22c55e);
          box-shadow:
            0 0 0 1px rgba(34,197,94,0.6),
            0 8px 14px rgba(0,0,0,0.8);
          padding: 3px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .drawer-hotbar-icon {
          width: 30px;
          height: 30px;
          border-radius: 7px;
          background: rgba(15,23,42,0.96);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .drawer-hotbar-slot-wrapper {
            position: relative;
            aspect-ratio: 1 / 1;
            padding: 3px;
            border-radius: 8px;
            background: linear-gradient(135deg, #020617, #020617);
            border: 1px solid var(--accent-2, #22c55e);
            box-shadow: 0 0 0 1px rgba(34,197,94,0.6), 0 8px 14px rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        /* Setze nested slot auf Hotbar-Style zurück */
        .drawer-hotbar-slot-wrapper .drawer-slot {
            border: none;
            background: none;
            padding: 0; 
            box-shadow: none !important;
            transform: none !important;
            cursor: grab;
        }

        /* Hotbar Icon wird größer */
        .drawer-hotbar-slot-wrapper .drawer-item-icon {
            width: 30px;
            height: 30px;
            font-size: 20px;
            box-shadow: none;
            border-radius: 7px;
            background: rgba(15,23,42,0.96);
        }

        /* Korrektur des Hotbar-Item-QTY-Stils */
        .drawer-hotbar-slot-wrapper .drawer-item-qty {
             bottom: 3px; 
             right: 4px; 
             min-width: 20px; 
             height: 16px; 
             font-size: 10px;
             padding: 0 5px;
        }

        /* ---------- ACTIONS (rechts unten) – Retro-Metallknöpfe ---------- */

        .drawer-actions-panel {
          grid-column: 3;
          grid-row: 2;
          border-radius: 18px;
          background:
            linear-gradient(180deg, #261716, #020617);
          box-shadow:
            0 12px 30px rgba(0,0,0,0.95),
            inset 0 0 0 1px rgba(0,0,0,0.9);
          padding: 10px 12px 10px 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .drawer-actions-title {
          font-family: 'Unica One', system-ui, sans-serif;
          letter-spacing: 0.22em;
          font-size: 11px;
          text-transform: uppercase;
          color: #e5e7eb;
          margin-bottom: 4px;
        }

        .drawer-action-button {
          position: relative;
          border-radius: 999px;
          padding: 8px 10px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          border: 1px solid rgba(75,85,99,0.9);
          background: radial-gradient(circle at center, #020617, #020617);
          color: #e5e7eb;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.16s ease;
        }

        .drawer-action-button.primary {
          border-color: var(--accent-1, #f97316);
          background: radial-gradient(circle at center, #f97316, #b45309);
          color: #111827;
          box-shadow:
            0 14px 26px rgba(0,0,0,0.8);
        }
        
        /* HINZUFÜGEN von Pulse-Effekt auf primäre Schaltfläche */
        .drawer-action-button.primary.pulse-active {
            animation: pulseEffect var(--animation-speed, 2.5s) ease-in-out infinite;
        }

        .drawer-action-button::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(248,250,252,0.2), transparent 60%);
          transform: translate(-50%, -50%);
          transition: width 0.4s ease, height 0.4s ease;
        }

        .drawer-action-button:hover::after {
          width: 180px;
          height: 180px;
        }

        .drawer-action-button:hover {
          transform: translateY(-1px);
          box-shadow:
            0 14px 28px rgba(0,0,0,0.9);
        }

      `}</style>

      <div className="drawer-shadow" />
      <div className="drawer-shell">
        <div className="drawer-title-plate">RETRO INVENTAR</div>

        <div className="drawer-inner-wall">
          <div className="drawer-layout">
            {/* Oben links: Wallet/Brieftasche */}
            <div className={`drawer-wallet-panel ${usePulse ? 'pulse-active' : ''}`}>
              <div className="drawer-wallet-header">
                <div className="drawer-wallet-title">Geldschublade</div>
                <div className="drawer-wallet-sub">Bargeld &amp; Lizenzen</div>
              </div>
              <div className="drawer-notes-stack">
                <div className="drawer-note-sheet">
                  <div className="drawer-paperclip" />
                  <div className="drawer-wallet-content">
                    <div className="drawer-cash-row">
                      <div className="drawer-cash-icon">💰</div>
                      <div className="drawer-cash-main">
                        <div className="drawer-cash-label">Bargeld</div>
                        <div className="drawer-cash-value">2.500 $</div>
                      </div>
                    </div>
                    <div className="drawer-license-grid">
                      {licenses.map((lic) => (
                        <div key={lic.id} className="drawer-license-tag">
                          <div className="drawer-license-name">{lic.label}</div>
                          <div className="drawer-license-desc">{lic.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Oben rechts: Stats / Gewicht */}
            <div className={`drawer-stats-panel ${useGlow ? 'drawer-panel-glow' : ''}`}>
              <div className="drawer-stats-header">
                <div className="drawer-stats-title">Status</div>
                <div className="drawer-stats-sub">Werte &amp; Last</div>
              </div>
              <div className="drawer-card-strip">
                {stats.map((stat) => (
                  <div key={stat.name} className={`drawer-stat-card ${usePulse ? 'pulse-active' : ''}`}>
                    <div className="drawer-stat-name">{stat.name}</div>
                    <div className="drawer-stat-value-row">
                      <div className="drawer-stat-value">{stat.value}</div>
                      <div className="drawer-stat-max">/ {stat.max}</div>
                    </div>
                    <div className="drawer-stat-bar">
                      <div
                        className="drawer-stat-bar-fill"
                        style={{
                          width: `${(stat.value / stat.max) * 100}%`,
                          background: stat.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="drawer-weight-row">
                <div>
                  <div className="drawer-weight-text">24.5 / 50.0 kg</div>
                  <div className="drawer-weight-sub">Gewicht / Gesamtgewicht</div>
                </div>
                <div className="drawer-weight-status">OK</div>
              </div>
            </div>

            {/* Links unten: Schlüssel-Schublade */}
            <div className={`drawer-keys-panel ${usePulse ? 'pulse-active' : ''}`}>
              <div className="drawer-keys-header">
                <div className="drawer-keys-title">Schlüssel</div>
                <div className="drawer-keys-sub">{keys.length} Stück</div>
              </div>
              <div className="drawer-key-rail" />
              <div className="drawer-keys-list">
                {keys.map((k, i) => (
                  <div key={i} className="drawer-key-item">
                    <div className="drawer-key-icon">{k.icon}</div>
                    <div className="drawer-key-name">{k.name}</div>
                  </div>
                ))}
              </div>
            </div>

           {/* Mitte: Inventar + Hotbar (mit viel Hintergrundsicht) */}
          <div className="drawer-inventory-panel">
              <div className={`drawer-inventory-inner ${useGlow ? 'drawer-panel-glow' : ''}`}>
                <div className="drawer-inventory-header">
                  <div className="drawer-inventory-title">INVENTAR</div>
                  <div className="drawer-inventory-sub">
                    50 Slots • {inventoryItems.filter(isItemDefined).length} belegt
                  </div>
                </div>

                <div className="drawer-inventory-scroll">
                  <div className="drawer-inventory-grid">
                    {/* Inventar Slots (Index 0 bis 49) */}
                    {inventoryItems.map((item, index) => renderSlot(item, index))}
                  </div>
                </div>

                {/* Hotbar: Nutzt renderSlot für D&D und wickelt ihn in einen Hotbar-Wrapper-Stil */}
                <div className="drawer-hotbar">
                  <div className="drawer-hotbar-header">Hotbar • Schnellzugriff</div>
                  <div className="drawer-hotbar-row">
                    {/* Hotbar mappt die ersten 5 Items. Index ist 0 bis 4! */}
                    {hotbarSlots.map((item, index) => (
                      <div key={index} className="drawer-hotbar-slot-wrapper">
                          {renderSlot(item, index)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* rechts unten: Aktionen */}
            <div className="drawer-actions-panel">
              <div className="drawer-actions-title">Aktionen</div>
              <button className={`drawer-action-button primary ${usePulse ? 'pulse-active' : ''}`}>
                Auf den Boden ablegen
              </button>
              <button className="drawer-action-button">
                Vom Boden aufheben
              </button>
              <button className="drawer-action-button">
                Geben-Modus
              </button>
            </div>
          </div>
        </div>

        <div className="drawer-floor">
          <div className="drawer-floor-line" />
        </div>
      </div>
    </div>
  );
}