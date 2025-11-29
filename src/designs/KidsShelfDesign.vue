<script setup lang="ts">
import { ref, computed } from 'vue'
import type { DesignProps } from '@/types/inventory'

const props = defineProps<DesignProps>()

const selectedItem = ref<number | null>(null)
const hoveredItem = ref<number | null>(null)
const draggedItemIndex = ref<number | null>(null)

const isItemDefined = (item: any) => item !== null && item?. emoji !== undefined && item?.emoji !== ''

const isPinkTheme = computed(() => props.themeKey === 'neonMiami')
const hotbarSlots = computed(() => props.inventoryItems.slice(0, 5))

const useGlow = computed(() => props.animationKey === 'subtleGlow' || props.animationKey === 'scannerPulse')
const useFlash = computed(() => props.animationKey === 'quickResponse')
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
  ;(e.currentTarget as HTMLElement).classList.remove('drag-hover')
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
</script>

<template>
  <div class="kids-root">
    <!-- Wand / UI-Fläche -->
    <div class="kids-wall">
      <div class="kids-layout">
        <!-- oben links: Geldbeutel -->
        <div :class="['kids-wallet-panel', useGlow ? 'kids-panel-glow' : '']">
          <div class="kids-wallet-header">
            <div class="kids-wallet-title">Geldbeutel</div>
            <div class="kids-wallet-sub">Bargeld &amp; Lizenzen</div>
          </div>
          <div class="kids-wallet-row">
            <div :class="['kids-wallet-cash', usePulse ? 'kids-pulse' : '']">
              <div class="kids-wallet-cash-icon">💰</div>
              <div class="kids-wallet-cash-main">
                <div class="kids-wallet-label">Bargeld</div>
                <div class="kids-wallet-value">2.500 $</div>
              </div>
            </div>
            <div class="kids-wallet-licenses">
              <div
                v-for="lic in licenses"
                :key="lic. id"
                class="kids-license-card"
              >
                <div class="kids-license-main">{{ lic.label }}</div>
                <div class="kids-license-sub">{{ lic.desc }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- oben rechts: Stats -->
        <div :class="['kids-stats-panel', useGlow ? 'kids-panel-glow' : '']">
          <div class="kids-stats-header">
            <div class="kids-stats-title">Status</div>
            <div class="kids-stats-sub">Vital &amp; Last</div>
          </div>
          <div class="kids-stats-grid">
            <div
              v-for="stat in stats"
              :key="stat. name"
              :class="['kids-stat-block', usePulse ? 'kids-pulse' : '']"
            >
              <div class="kids-stat-name">{{ stat.name }}</div>
              <div class="kids-stat-value-row">
                <div class="kids-stat-value">{{ stat. value }}</div>
                <div class="kids-stat-max">/ {{ stat.max }}</div>
              </div>
              <div class="kids-stat-bar">
                <div
                  class="kids-stat-bar-fill"
                  :style="{
                    width: `${(stat.value / stat.max) * 100}%`,
                    background: stat.color,
                  }"
                />
              </div>
            </div>
          </div>
          <div class="kids-weight-row">
            <div>
              <div class="kids-weight-text">24. 5 / 50. 0 kg</div>
              <div class="kids-weight-sub">Gewicht / Gesamtgewicht</div>
            </div>
            <div class="kids-weight-status">OK</div>
          </div>
        </div>

        <!-- links unten: Schlüsselbund -->
        <div :class="['kids-keys-panel', useGlow ? 'kids-panel-glow' : '']">
          <div :class="['kids-keys-ring', usePulse ? 'kids-pulse' : '']" />
          <div class="kids-keys-header">
            <div class="kids-keys-title">Schlüsselbund</div>
            <div class="kids-keys-sub">{{ keys.length }} Schlüssel</div>
          </div>
          <div class="kids-keys-list">
            <div
              v-for="(k, i) in keys"
              :key="i"
              class="kids-key-item"
            >
              <div class="kids-key-icon">{{ k. icon }}</div>
              <div class="kids-key-name">{{ k.name }}</div>
            </div>
          </div>
        </div>

        <!-- Mitte: Inventar + Hotbar (über beide Zeilen) -->
        <div class="kids-inventory-panel">
          <div class="kids-inventory-bg-frame" />
          <div :class="['kids-inventory-inner', useGlow ? 'kids-panel-glow' : '']">
            <div class="kids-inventory-header">
              <div class="kids-inventory-title">INVENTAR</div>
              <div class="kids-inventory-sub">
                50 Slots • {{ inventoryItems.filter(isItemDefined).length }} belegt
              </div>
            </div>

            <div class="kids-inventory-scroll">
              <div v-if="isPinkTheme" class="kids-inventory-teddy-bg">🧸</div>
              <div class="kids-inventory-grid">
                <!-- Inventar Slots (Index 0 bis 49) -->
                <div
                  v-for="(item, index) in inventoryItems"
                  :key="index"
                  :data-index="index"
                  :class="[
                    'kids-inventory-slot',
                    ! isItemDefined(item) ? 'empty' : '',
                    selectedItem === item?. id ? 'selected' : '',
                    useFlash ? 'kids-slot-flash' : '',
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
                  <template v-if="isItemDefined(item)">
                    <div class="kids-item-icon">{{ item.emoji }}</div>
                    <div
                      v-if="item.quantity > 1"
                      class="kids-item-qty"
                    >
                      {{ item.quantity }}
                    </div>
                    <div
                      v-if="hoveredItem === item.id"
                      class="kids-tooltip"
                      style="left: 50%; bottom: 100%"
                    >
                      {{ item.name }}
                    </div>
                  </template>
                </div>
              </div>
            </div>

            <!-- Hotbar -->
            <div class="kids-hotbar">
              <div class="kids-hotbar-header">Hotbar • Schnellzugriff</div>
              <div class="kids-hotbar-row">
                <div
                  v-for="(item, index) in hotbarSlots"
                  :key="index"
                  class="kids-hotbar-slot-wrapper"
                >
                  <div
                    :data-index="index"
                    :class="[
                      'kids-inventory-slot',
                      !isItemDefined(item) ? 'empty' : '',
                      selectedItem === item?.id ? 'selected' : '',
                      useFlash ? 'kids-slot-flash' : '',
                      isItemDefined(item) && useGlow ? 'slot-glow' : ''
                    ]"
                    :draggable="isItemDefined(item)"
                    @click="selectedItem = selectedItem === item?.id ? null : item?.id"
                    @mouseenter="hoveredItem = item?.id"
                    @mouseleave="hoveredItem = null"
                    @dragstart="(e) => handleDragStart(e, index)"
                    @dragend="handleDragEnd"
                    @dragover="handleDragOver"
                    @dragleave="handleDragLeave"
                    @drop="(e) => handleDrop(e, index)"
                  >
                    <template v-if="isItemDefined(item)">
                      <div class="kids-item-icon">{{ item.emoji }}</div>
                      <div
                        v-if="item.quantity > 1"
                        class="kids-item-qty"
                      >
                        {{ item.quantity }}
                      </div>
                      <div
                        v-if="hoveredItem === item.id"
                        class="kids-tooltip"
                        style="left: 50%; bottom: 100%"
                      >
                        {{ item.name }}
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- rechts unten: Aktionen -->
        <div :class="['kids-actions-panel', useGlow ? 'kids-panel-glow' : '']">
          <div class="kids-actions-title">Aktionen</div>
          <button :class="['kids-action-button primary', usePulse ? 'kids-pulse' : '']">
            Auf den Boden ablegen
          </button>
          <button class="kids-action-button">
            Vom Boden aufheben
          </button>
          <button class="kids-action-button">
            Geben-Modus
          </button>
        </div>
      </div>
    </div>

    <!-- Boden -->
    <div class="kids-floor">
      <div class="kids-floor-line" />
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Unica+One&family=Shadows+Into+Light&display=swap');

.kids-root {
  position: relative;
  width: 100%;
  max-width: 1100px;
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

.kids-panel-glow {
  animation: panelGlow var(--animation-speed, 3s) ease-in-out infinite alternate;
}

. kids-pulse {
  animation: pulseEffect var(--animation-speed, 2. 5s) ease-in-out infinite;
}

. kids-slot-flash:hover {
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

/* ---------- GELDBEUTEL (oben links) ---------- */

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

. kids-wallet-row {
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

. kids-wallet-licenses {
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

. kids-license-sub {
  font-size: 10px;
  color: #9ca3af;
}

/* ---------- STATS (oben rechts) ---------- */

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

.kids-stat-block. pulse-active {
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

. kids-stat-max {
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

/* ---------- SCHLÜSSELBUND (links unten) ---------- */

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

. kids-keys-ring {
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

.kids-keys-ring. pulse-active {
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
  background: rgba(15,23,42,0. 96);
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

/* ---------- INVENTAR (Mitte) ---------- */

. kids-inventory-panel {
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

. kids-inventory-header {
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

. kids-inventory-slot. empty:hover {
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

.kids-inventory-slot. selected {
  box-shadow:
    0 0 0 2px var(--accent-2, #22c55e),
    0 0 24px rgba(34,197,94,0.85);
  border-color: var(--accent-2, #22c55e);
}

. kids-item-icon {
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

/* HOTBAR */

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

.kids-hotbar-slot-wrapper . kids-inventory-slot {
  border: none;
  background: none;
  padding: 0;
  box-shadow: none ! important;
  transform: none !important;
  cursor: grab;
}

.kids-hotbar-slot-wrapper . kids-item-icon {
  width: 34px;
  height: 34px;
  font-size: 22px;
  box-shadow: none;
  border-radius: 10px;
  background: rgba(15,23,42,0.96);
}

.kids-hotbar-slot-wrapper .kids-item-qty {
  top: 4px;
  right: 6px;
  min-width: 22px;
  height: 18px;
  font-size: 11px;
  padding: 0 6px;
}

/* ---------- AKTIONEN (rechts unten) ---------- */

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

.kids-action-button. primary {
  border-color: var(--accent-1, #f97316);
  background: linear-gradient(135deg, var(--accent-1, #f97316), var(--accent-2, #22c55e));
  color: #020617;
  box-shadow:
    0 14px 26px rgba(0,0,0,0.8);
}

.kids-action-button.primary. pulse-active {
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
</style>