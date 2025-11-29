<script setup lang="ts">
import { ref, computed } from 'vue'
import type { DesignProps } from '@/types/inventory'

const props = defineProps<DesignProps>()

const selectedItem = ref<number | null>(null)
const hoveredItem = ref<number | null>(null)
const draggedItemIndex = ref<number | null>(null)

defineEmits(['openSettings'])

// Item ist definiert, wenn es nicht null ist
const isItemDefined = (item: any) => item !== null && item?. emoji !== undefined && item?.emoji !== ''

// Bestimme die zu verwendenden Animationsklassen
const useGlow = computed(() => props.animationKey === 'subtleGlow' || props.animationKey === 'scannerPulse')
const useFlash = computed(() => props. animationKey === 'quickResponse')
const usePulse = computed(() => props.animationKey === 'scannerPulse')

// Drag & Drop Handler
const handleDragStart = (e: DragEvent, index: number) => {
  if (! isItemDefined(props.inventoryItems[index])) {
    e.preventDefault()
    return
  }
  draggedItemIndex.value = index
  e.dataTransfer! .setData('fromIndex', index. toString())
  ;(e.currentTarget as HTMLElement).classList.add('dragging')
}

const handleDragEnd = (e: DragEvent) => {
  ;(e.currentTarget as HTMLElement).classList.remove('dragging')
  draggedItemIndex.value = null
}

const handleDragOver = (e: DragEvent) => {
  e. preventDefault()
  ;(e.currentTarget as HTMLElement).classList.add('drag-hover')
}

const handleDragLeave = (e: DragEvent) => {
  ;(e.currentTarget as HTMLElement). classList.remove('drag-hover')
}

const handleDrop = (e: DragEvent, toIndex: number) => {
  e.preventDefault()
  ;(e.currentTarget as HTMLElement).classList.remove('drag-hover')
  const fromIndex = parseInt(e.dataTransfer!.getData('fromIndex'), 10)
  
  if (fromIndex !== toIndex) {
    props.moveItem(fromIndex, toIndex)
  }
  draggedItemIndex.value = null
}

const handleHotbarDragStart = (e: DragEvent, index: number) => {
  if (! isItemDefined(props.hotbarItems[index])) {
    e.preventDefault()
    return
  }
  draggedItemIndex.value = index
  e.dataTransfer! .setData('fromIndex', index. toString())
  e.dataTransfer!.setData('source', 'hotbar')
  ;(e.currentTarget as HTMLElement).classList.add('dragging')
}

const handleHotbarDrop = (e: DragEvent, toIndex: number) => {
  e.preventDefault()
  ;(e.currentTarget as HTMLElement).classList.remove('drag-hover')
  const fromIndex = parseInt(e.dataTransfer!.getData('fromIndex'), 10)
  const source = e.dataTransfer!. getData('source')
  
  if (source === 'hotbar' && fromIndex !== toIndex) {
    props.moveHotbarItem(fromIndex, toIndex)
  }
  draggedItemIndex.value = null
}
</script>

<template>
  <div class="briefcase-root">
    <div class="briefcase-shadow" />
    <div class="briefcase">
      <div class="briefcase-handle" />

      <div class="briefcase-inner">
        <div class="briefcase-wall">
          <div class="briefcase-layout">
            <!-- oben links: Geldbeutel -->
            <div :class="['briefcase-wallet-panel', useGlow ? 'briefcase-panel-glow' : '']">
              <div class="wallet-header">
                <div class="wallet-title">Geldbörse</div>
                <div class="wallet-label">Bargeld &amp; Lizenzen</div>
              </div>
              <div class="wallet-row">
                <div class="wallet-cash">
                  <div class="wallet-cash-icon">💵</div>
                  <div class="wallet-cash-main">
                    <div class="wallet-cash-label">Bargeld</div>
                    <div class="wallet-cash-value">2.500 $</div>
                  </div>
                </div>

                <div class="wallet-licenses">
                  <div
                    v-for="lic in licenses"
                    :key="lic.id"
                    class="license-card"
                  >
                    <div class="license-main">{{ lic.label }}</div>
                    <div class="license-sub">{{ lic.desc }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- oben rechts: Stats im Deckel-Notizzettel-Stil -->
            <div class="briefcase-stats-panel">
              <div class="briefcase-stats-header">
                <div class="briefcase-stats-title">Status Notizen</div>
                <div class="briefcase-stats-sub">Vital &amp; Last</div>
              </div>
              <div class="briefcase-note-strip">
                <div
                  v-for="stat in stats"
                  :key="stat.name"
                  :class="['briefcase-note-card', usePulse ? 'briefcase-pulse' : '']"
                >
                  <div class="briefcase-note-title">{{ stat.name }}</div>
                  <div class="briefcase-note-value-row">
                    <div class="briefcase-note-value">{{ stat.value }}</div>
                    <div class="briefcase-note-max">/ {{ stat.max }}</div>
                  </div>
                  <div class="briefcase-note-bar">
                    <div
                      class="briefcase-note-bar-fill"
                      :style="{
                        width: `${(stat.value / stat.max) * 100}%`,
                        background: stat.color,
                      }"
                    />
                  </div>
                </div>
              </div>
              <div class="briefcase-weight-row">
                <div>
                  <div class="briefcase-weight-text">24. 5 / 50. 0 kg</div>
                  <div class="briefcase-weight-sub">Gewicht / Gesamtgewicht</div>
                </div>
                <div class="briefcase-weight-status">OK</div>
              </div>
            </div>

            <!-- links unten: Schlüsselbund -->
            <div class="briefcase-keys-panel">
              <div :class="['briefcase-keys-ring', usePulse ? 'briefcase-pulse' : '']" />
              <div class="briefcase-keys-header">
                <div class="briefcase-keys-title">Schlüsselbund</div>
                <div class="briefcase-keys-sub">{{ keys.length }} Schlüssel</div>
              </div>
              <div class="briefcase-keys-list">
                <div
                  v-for="(k, i) in keys"
                  :key="i"
                  class="briefcase-key-item"
                >
                  <div class="briefcase-key-icon">{{ k.icon }}</div>
                  <div class="briefcase-key-name">{{ k.name }}</div>
                </div>
              </div>
            </div>

            <!-- Mitte: Inventar + Hotbar -->
            <div :class="['briefcase-inventory-panel', useGlow ? 'briefcase-panel-glow' : '']">
              <div class="briefcase-inventory-frame" />
              <div class="briefcase-inventory-inner">
                <div class="briefcase-inventory-header">
                  <div class="briefcase-inventory-title">INVENTAR</div>
                  <div class="briefcase-inventory-sub">
                    50 Slots • {{ inventoryItems.filter(isItemDefined).length }} belegt
                  </div>
                </div>

                <div class="briefcase-inventory-scroll">
                  <div class="briefcase-inventory-grid">
                    <!-- Inventar Slots (Index 0 bis 49) -->
                    <div
                      v-for="(item, index) in inventoryItems"
                      :key="index"
                      :data-index="index"
                      :class="[
                        'briefcase-slot',
                        index < 5 ? 'briefcase-hotbar-style' : '',  // NEU: Hotbar-Style für erste 5! 
                        !isItemDefined(item) ? 'empty' : '',
                        selectedItem === item?. id ? 'selected' : '',
                        useFlash ? 'briefcase-slot-flash' : '',
                        isItemDefined(item) && useGlow ? 'slot-glow' : ''
                      ]"
                      :draggable="isItemDefined(item)"
                      @click="selectedItem = selectedItem === item?. id ? null : item?. id"
                      @mouseenter="hoveredItem = item?. id"
                      @mouseleave="hoveredItem = null"
                      @dragstart="(e) => handleDragStart(e, index)"
                      @dragend="handleDragEnd"
                      @dragover="handleDragOver"
                      @dragleave="handleDragLeave"
                      @drop="(e) => handleDrop(e, index)"
                    >
                      <!-- NEU: Hotbar-Nummer hinzufügen -->
                    <div v-if="index < 5" :class="['briefcase-hotbar-number', usePulse ? 'pulse-active' : '']">{{ index + 1 }}</div>
                      
                      <template v-if="isItemDefined(item)">
                        <div class="briefcase-item-icon">{{ item.emoji }}</div>
                        <div
                          v-if="item.quantity > 1"
                          class="briefcase-item-qty"
                        >
                          {{ item.quantity }}
                        </div>
                        <div
                          v-if="hoveredItem === item.id"
                          class="briefcase-tooltip"
                          style="left: 50%; bottom: 100%"
                        >
                          {{ item. name }}
                        </div>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- rechts unten: Aktionen -->
            <div :class="['briefcase-actions-panel', useGlow ? 'briefcase-panel-glow' : '']">
              <div class="briefcase-actions-title">Aktionen</div>
              <button :class="['briefcase-action-button primary', usePulse ? 'pulse-active' : '']">
                Auf den Boden ablegen
              </button>
              <button class="briefcase-action-button">
                Vom Boden aufheben
              </button>
              <button class="briefcase-action-button">
                Geben-Modus
              </button>
              
              <!-- NEU: Einstellungs-Button -->
              <button 
                class="briefcase-action-button settings"
                @click="$emit('openSettings')"
              >
                ⚙️ Einstellungen
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Unica+One&family=Shadows+Into+Light&display=swap');

. briefcase-root {
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

.briefcase-layout {
  display: grid;
  grid-template-columns: 260px 380px 220px;  /* ← Hier geändert!  */
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
  animation: pulseEffect var(--animation-speed, 2. 5s) ease-in-out infinite;
}

. briefcase-slot-flash:hover {
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

. wallet-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: #9ca3af;
}

. wallet-row {
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

/* ---------- STATS (oben rechts) ---------- */

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

.briefcase-note-card:nth-child(1) { transform: rotate(-1. 6deg); }
.briefcase-note-card:nth-child(2) { transform: rotate(1.2deg); }
.briefcase-note-card:nth-child(3) { transform: rotate(-1.1deg); }
.briefcase-note-card:nth-child(4) { transform: rotate(1.5deg); }

.briefcase-note-card. pulse-active {
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
  letter-spacing: 0. 16em;
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
  flex: 1;
}

. briefcase-inventory-header {
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
  flex: 30vh;
  border-radius: 10px;
  background:
    linear-gradient(180deg, #020617, #020617);
  border: 1px solid rgba(31,41,55,1);
  padding: 8px;
  overflow-y: auto;
}

.briefcase-inventory-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 8px;
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

.briefcase-slot.slot-glow. selected {
  animation: panelGlow 3s ease-in-out infinite alternate;
}

.briefcase-slot.slot-flash:hover {
  animation: slotFlash 0.3s ease-out;
  transform: translateY(0px) scale(1.00);
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

/* Hotbar-Style für die ersten 5 Inventar-Slots */
.briefcase-slot. briefcase-hotbar-style {
  position: relative;
  padding: 6px;  /* Etwas mehr Padding für den dickeren Rahmen */
  border-radius: 12px;
  background: radial-gradient(circle at top, rgba(248,250,252,0.18), transparent 60%),
              linear-gradient(145deg, #020617, #020617);
  border: 3px solid var(--accent-2, #22c55e) ! important;  /* Dickerer Border */
  box-shadow: 
    0 0 0 2px rgba(34,197,94,0.4),  /* Äußerer Glow */
    0 0 16px rgba(34,197,94,0.6),   /* Starker Glow */
    inset 0 0 20px rgba(34,197,94,0.1),  /* Innerer Glow */
    0 8px 14px rgba(0,0,0,0.7) !important;
}

.briefcase-slot. briefcase-hotbar-style:hover {
  transform: translateY(-2px) scale(1. 05) !important;
  box-shadow: 
    0 0 0 3px rgba(34,197,94,0.6),
    0 0 24px rgba(34,197,94,0.8),
    inset 0 0 24px rgba(34,197,94,0.15),
    0 12px 20px rgba(0,0,0,0.9) !important;
  border-color: var(--accent-2, #22c55e) ! important;
}

.briefcase-slot.briefcase-hotbar-style .briefcase-item-icon {
  width: 38px;
  height: 38px;
  font-size: 24px;
  border-radius: 12px;
  background: rgba(15,23,42,0.9);
}

.briefcase-slot.briefcase-hotbar-style .briefcase-item-qty {
  top: 4px;
  right: 6px;
  min-width: 22px;
  height: 18px;
  font-size: 11px;
  padding: 0 6px;
  background: linear-gradient(135deg, var(--accent-1, #f97316), var(--accent-3, #22c55e));
  color: #111827;
}

/* NEU: Hotbar-Nummer (1-5) */
.briefcase-hotbar-number {
  position: absolute;
  top: 2px;
  left: 4px;
  width: 20px;
  height: 20px;
  border-radius: 6px;
  background: linear-gradient(135deg, var(--accent-2, #22c55e), var(--accent-3, #22c55e));
  color: #020617;
  font-family: 'Space Grotesk', system-ui, sans-serif;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 2px 6px rgba(0,0,0,0.6),
    inset 0 1px 2px rgba(255,255,255,0.3);
  z-index: 10;
}

/* Hotbar-Nummer pulsiert bei scannerPulse Animation */
.briefcase-slot.briefcase-hotbar-style .briefcase-hotbar-number. pulse-active {
  animation: pulseEffect var(--animation-speed, 2. 5s) ease-in-out infinite;
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

.briefcase-action-button. primary {
  border-color: var(--accent-1, #f97316);
  background: linear-gradient(135deg, var(--accent-1, #f97316), var(--accent-2, #22c55e));
  color: #020617;
  box-shadow:
    0 14px 26px rgba(0,0,0,0.8);
}

.briefcase-action-button.primary. pulse-active {
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

.briefcase-action-button. settings {
  margin-top: 8px;
  border-color: rgba(148, 163, 184, 0.6);
  background: rgba(30, 41, 59, 0.8);
  color: #cbd5e1;
}

.briefcase-action-button.settings:hover {
  background: rgba(51, 65, 85, 0.9);
  border-color: rgba(56, 189, 248, 0.8);
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
</style>