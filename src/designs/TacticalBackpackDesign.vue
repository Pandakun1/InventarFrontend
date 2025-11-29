
<script setup lang="ts">
import { ref, computed } from 'vue'
import type { DesignProps } from '@/types/inventory'

const props = defineProps<DesignProps>()

const selectedItem = ref<number | null>(null)
const hoveredItem = ref<number | null>(null)
const draggedItemIndex = ref<number | null>(null)

const isItemDefined = (item: any) => item !== null && item?. emoji !== undefined && item?.emoji !== ''

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
  e.dataTransfer! .setData('fromIndex', index.toString())
  ;(e.currentTarget as HTMLElement).classList.add('dragging')
}

const handleDragEnd = (e: DragEvent) => {
  ;(e.currentTarget as HTMLElement).classList.remove('dragging')
  draggedItemIndex.value = null
}

const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
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
</script>

<template>
  <div class="pack-root">
    <div class="pack-shadow" />
    <div class="pack-shell">
      <div class="pack-handle" />
      <div class="pack-molle-top">
        <div class="pack-molle-strip" />
        <div class="pack-patch-label">TACTICAL INVENTORY</div>
        <div class="pack-molle-strip" />
      </div>

      <div class="pack-front">
        <div class="pack-layout">
          <!-- oben links: Geldbeutel -->
          <div :class="['pack-wallet-panel', useGlow ? 'pack-panel-glow' : '']">
            <div class="pack-wallet-header">
              <div class="pack-wallet-title">Geldbeutel</div>
              <div class="pack-wallet-sub">Bargeld &amp; Lizenzen</div>
            </div>
            <div class="pack-wallet-row">
              <div :class="['pack-wallet-cash', usePulse ? 'pack-pulse' : '']">
                <div class="pack-wallet-cash-icon">💰</div>
                <div class="pack-wallet-cash-main">
                  <div class="pack-wallet-label">Bargeld</div>
                  <div class="pack-wallet-value">2.500 $</div>
                </div>
              </div>
              <div class="pack-wallet-licenses">
                <div
                  v-for="lic in licenses"
                  :key="lic. id"
                  class="pack-license-card"
                >
                  <div class="pack-license-main">{{ lic.label }}</div>
                  <div class="pack-license-sub">{{ lic.desc }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- oben rechts: Stats -->
          <div :class="['pack-stats-panel', useGlow ? 'pack-panel-glow' : '']">
            <div class="pack-stats-header">
              <div class="pack-stats-title">Status</div>
              <div class="pack-stats-sub">Vital &amp; Last</div>
            </div>
            <div class="pack-stats-grid">
              <div
                v-for="stat in stats"
                :key="stat. name"
                :class="['pack-stat-patch', usePulse ? 'pack-pulse' : '']"
              >
                <div class="pack-stat-name">{{ stat. name }}</div>
                <div class="pack-stat-value-row">
                  <div class="pack-stat-value">{{ stat.value }}</div>
                  <div class="pack-stat-max">/ {{ stat.max }}</div>
                </div>
                <div class="pack-stat-bar">
                  <div
                    class="pack-stat-bar-fill"
                    :style="{
                      width: `${(stat.value / stat.max) * 100}%`,
                      background: stat.color,
                    }"
                  />
                </div>
              </div>
            </div>
            <div class="pack-weight-row">
              <div>
                <div class="pack-weight-text">24. 5 / 50. 0 kg</div>
                <div class="pack-weight-sub">Gewicht / Gesamtgewicht</div>
              </div>
              <div class="pack-weight-status">OK</div>
            </div>
          </div>

          <!-- links unten: Schlüsselbund -->
          <div :class="['pack-keys-panel', useGlow ? 'pack-panel-glow' : '']">
            <div class="pack-keys-header">
              <div class="pack-keys-title">Schlüsselbund</div>
              <div class="pack-keys-sub">{{ keys.length }} Schlüssel</div>
            </div>
            <div class="pack-keys-molle" />
            <div class="pack-keys-list">
              <div
                v-for="(k, i) in keys"
                :key="i"
                :class="['pack-key-item', usePulse ? 'pack-pulse' : '']"
              >
                <div class="pack-key-icon">{{ k.icon }}</div>
                <div class="pack-key-name">{{ k.name }}</div>
              </div>
            </div>
          </div>

          <!-- Mitte: Inventar + Hotbar -->
          <div class="pack-inventory-panel">
            <div :class="['pack-inventory-inner', useGlow ? 'pack-panel-glow' : '']">
              <div class="pack-inventory-header">
                <div class="pack-inventory-title">INVENTAR</div>
                <div class="pack-inventory-sub">
                  50 Slots • {{ inventoryItems.filter(isItemDefined).length }} belegt
                </div>
              </div>

              <div class="pack-inventory-scroll">
                <div class="pack-inventory-grid">
                  <!-- Inventar Slots (Index 0 bis 49) -->
                  <div
                    v-for="(item, index) in inventoryItems"
                    :key="index"
                    :data-index="index"
                    :class="[
                      'pack-slot',
                      ! isItemDefined(item) ?  'empty' : '',
                      selectedItem === item?. id ? 'selected' : '',
                      useFlash ? 'pack-slot-flash' : '',
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
                      <div class="pack-item-icon">{{ item.emoji }}</div>
                      <div
                        v-if="item.quantity > 1"
                        class="pack-item-qty"
                      >
                        {{ item.quantity }}
                      </div>
                      <div
                        v-if="hoveredItem === item.id"
                        class="pack-tooltip"
                        style="left: 50%; bottom: 100%"
                      >
                        {{ item.name }}
                      </div>
                    </template>
                  </div>
                </div>
              </div>

              <!-- Hotbar -->
              <div class="pack-hotbar">
                <div class="pack-hotbar-header">Hotbar • Schnellzugriff</div>
                <div class="pack-hotbar-row">
                  <div
                    v-for="(item, index) in hotbarSlots"
                    :key="index"
                    class="pack-hotbar-slot-wrapper"
                  >
                    <div
                      :data-index="index"
                      :class="[
                        'pack-slot',
                        !isItemDefined(item) ? 'empty' : '',
                        selectedItem === item?.id ? 'selected' : '',
                        useFlash ? 'pack-slot-flash' : '',
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
                        <div class="pack-item-icon">{{ item.emoji }}</div>
                        <div
                          v-if="item.quantity > 1"
                          class="pack-item-qty"
                        >
                          {{ item.quantity }}
                        </div>
                        <div
                          v-if="hoveredItem === item.id"
                          class="pack-tooltip"
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
          <div :class="['pack-actions-panel', useGlow ? 'pack-panel-glow' : '']">
            <div class="pack-actions-title">Aktionen</div>
            <button :class="['pack-action-button primary', usePulse ? 'pack-pulse' : '']">
              Auf den Boden ablegen
            </button>
            <button class="pack-action-button">
              Vom Boden aufheben
            </button>
            <button class="pack-action-button">
              Geben-Modus
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Unica+One&family=Shadows+Into+Light&display=swap');

.pack-root {
  position: relative;
  width: 100%;
  max-width: 1100px;
  aspect-ratio: 16 / 9;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pack-shadow {
  position: absolute;
  inset: 0;
  filter: blur(40px);
  background:
    radial-gradient(circle at top, rgba(34,197,94,0.28), transparent 60%),
    radial-gradient(circle at bottom right, rgba(59,130,246,0.25), transparent 65%),
    radial-gradient(circle at bottom left, rgba(15,23,42,0.8), transparent 60%);
  opacity: 0.8;
}

.pack-shell {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 40px;
  background:
    radial-gradient(circle at top center, rgba(148,163,184,0.16), transparent 60%),
    linear-gradient(180deg, #0b1120 0%, #020617 55%, #020617 100%);
  box-shadow:
    0 30px 70px rgba(0,0,0,0.9),
    0 0 0 2px rgba(15,23,42,0.9);
  padding: 26px 30px 26px 30px;
  display: grid;
  grid-template-rows: auto 1fr;
  overflow: hidden;
}

.pack-shell::before {
  content: '';
  position: absolute;
  inset: 10px;
  border-radius: 32px;
  border: 3px solid rgba(15,23,42,1);
  box-shadow:
    inset 0 0 0 1px rgba(30,64,54,0.9),
    0 0 0 1px rgba(0,0,0,0.9);
  pointer-events: none;
}

.pack-handle {
  position: absolute;
  top: -24px;
  left: 50%;
  transform: translateX(-50%);
  width: 160px;
  height: 26px;
  border-radius: 999px 999px 20px 20px;
  background: linear-gradient(180deg, #020617, #0f172a);
  box-shadow:
    0 12px 16px rgba(0,0,0,0.85),
    inset 0 0 0 1px rgba(148,163,184,0.4);
}

.pack-handle::before,
.pack-handle::after {
  content: '';
  position: absolute;
  top: 12px;
  width: 26px;
  height: 12px;
  border-radius: 8px;
  background: linear-gradient(180deg, #4b5563, #020617);
}

.pack-handle::before { left: 16px; }
.pack-handle::after { right: 16px; }

.pack-molle-top {
  position: relative;
  height: 40px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.pack-molle-strip {
  flex: 1;
  height: 16px;
  border-radius: 999px;
  background:
    repeating-linear-gradient(
      90deg,
      rgba(15,23,42,1) 0,
      rgba(15,23,42,1) 12px,
      rgba(30,64,54,1) 12px,
      rgba(30,64,54,1) 22px
    );
  box-shadow:
    0 6px 10px rgba(0,0,0,0.8),
    inset 0 0 0 1px rgba(15,23,42,1);
}

.pack-patch-label {
  font-family: 'Unica One', system-ui, sans-serif;
  letter-spacing: 0.24em;
  font-size: 10px;
  text-transform: uppercase;
  color: #e5e7eb;
}

.pack-front {
  position: relative;
  border-radius: 26px;
  background:
    radial-gradient(circle at top center, rgba(15,23,42,0.85), transparent 70%),
    linear-gradient(180deg, #020617, #020617);
  padding: 14px 18px;
  display: grid;
  grid-template-rows: 1fr;
}

.pack-front::before {
  content: '';
  position: absolute;
  top: 12px;
  bottom: 12px;
  left: 0;
  width: 12px;
  border-radius: 999px;
  background:
    linear-gradient(180deg, #020617, #020617);
  box-shadow:
    inset 0 0 0 2px rgba(15,23,42,0.9),
    4px 0 12px rgba(0,0,0,0.8);
}

.pack-front::after {
  content: '';
  position: absolute;
  top: 12px;
  bottom: 12px;
  right: 0;
  width: 12px;
  border-radius: 999px;
  background:
    linear-gradient(180deg, #020617, #020617);
  box-shadow:
    inset 0 0 0 2px rgba(15,23,42,0. 9),
    -4px 0 12px rgba(0,0,0,0.8);
}

.pack-layout {
  position: relative;
  display: grid;
  grid-template-columns: 250px minmax(0, 1fr) 220px;
  grid-template-rows: minmax(0, 1fr) minmax(0, 1fr);
  gap: 14px;
  height: 100%;
  align-items: stretch;
}

.pack-panel-glow {
  animation: panelGlow var(--animation-speed, 3s) ease-in-out infinite alternate;
}

.pack-pulse {
  animation: pulseEffect var(--animation-speed, 2. 5s) ease-in-out infinite;
}

. pack-slot-flash:hover {
  animation: slotFlash 0.3s ease-out;
  transform: translateY(0px) scale(1.00);
}

/* ---------- WALLET (oben links) ---------- */

.pack-wallet-panel {
  grid-column: 1;
  grid-row: 1;
  position: relative;
  border-radius: 20px;
  background:
    linear-gradient(145deg, #020617, #020617);
  box-shadow:
    0 16px 30px rgba(0,0,0,0.9),
    inset 0 0 0 1px rgba(15,23,42,1);
  padding: 10px 12px 12px 12px;
  display: flex;
  flex-direction: column;
}

.pack-wallet-panel::before {
  content: '';
  position: absolute;
  top: 6px;
  left: 10px;
  right: 10px;
  height: 4px;
  border-radius: 999px;
  background:
    repeating-linear-gradient(
      90deg,
      rgba(51,65,85,1) 0,
      rgba(51,65,85,1) 4px,
      rgba(17,24,39,1) 4px,
      rgba(17,24,39,1) 8px
    );
}

.pack-wallet-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-top: 6px;
  margin-bottom: 8px;
}

.pack-wallet-title {
  font-family: 'Unica One', system-ui, sans-serif;
  letter-spacing: 0.2em;
  font-size: 11px;
  text-transform: uppercase;
  color: #e5e7eb;
}

.pack-wallet-sub {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: #9ca3af;
}

. pack-wallet-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

. pack-wallet-cash {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--accent-1, #f97316), var(--accent-2, #22c55e));
  box-shadow:
    0 12px 22px rgba(0,0,0,0.85);
}

.pack-wallet-cash. pulse-active {
  animation: pulseEffect var(--animation-speed, 2.5s) ease-in-out infinite;
}

.pack-wallet-cash-icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: rgba(15,23,42,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.pack-wallet-cash-main {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.pack-wallet-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: rgba(15,23,42,0.85);
}

.pack-wallet-value {
  font-family: 'Space Grotesk', system-ui, sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #f9fafb;
}

.pack-wallet-licenses {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px;
  margin-top: 4px;
}

.pack-license-card {
  border-radius: 9px;
  background:
    linear-gradient(145deg, #020617, #020617);
  border: 1px solid rgba(75,85,99,0.9);
  padding: 5px 7px;
}

.pack-license-main {
  font-family: 'Space Grotesk', system-ui, sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: #e5e7eb;
}

. pack-license-sub {
  font-size: 10px;
  color: #9ca3af;
}

/* ---------- STATS (oben rechts) ---------- */

.pack-stats-panel {
  grid-column: 3;
  grid-row: 1;
  border-radius: 20px;
  background:
    linear-gradient(145deg, #020617, #020617);
  box-shadow:
    0 16px 30px rgba(0,0,0,0.9),
    inset 0 0 0 1px rgba(15,23,42,1);
  padding: 10px 12px 12px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.pack-stats-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.pack-stats-title {
  font-family: 'Unica One', system-ui, sans-serif;
  letter-spacing: 0.2em;
  font-size: 11px;
  text-transform: uppercase;
  color: #e5e7eb;
}

.pack-stats-sub {
  font-size: 10px;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.16em;
}

.pack-stats-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px;
}

.pack-stat-patch {
  border-radius: 8px;
  background:
    linear-gradient(135deg, #020617, #020617);
  border: 1px solid rgba(55,65,81,0.9);
  padding: 5px 7px;
}

.pack-stat-patch. pulse-active {
  animation: pulseEffect var(--animation-speed, 2.5s) ease-in-out infinite;
}

.pack-stat-name {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: #9ca3af;
  margin-bottom: 2px;
}

.pack-stat-value-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 3px;
}

.pack-stat-value {
  font-family: 'Space Grotesk', system-ui, sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #e5e7eb;
}

. pack-stat-max {
  font-size: 11px;
  color: #6b7280;
}

. pack-stat-bar {
  height: 5px;
  border-radius: 999px;
  background: rgba(31,41,55,1);
  overflow: hidden;
}

.pack-stat-bar-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.3s ease;
}

.pack-weight-row {
  margin-top: 4px;
  border-radius: 8px;
  background:
    linear-gradient(145deg, #020617, #020617);
  border: 1px solid rgba(55,65,81,0.9);
  padding: 6px 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pack-weight-text {
  font-family: 'Space Grotesk', system-ui, sans-serif;
  font-size: 12px;
  color: #e5e7eb;
}

.pack-weight-sub {
  font-size: 10px;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.14em;
}

.pack-weight-status {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: var(--accent-2, #22c55e);
}

/* ---------- KEYS (links unten) ---------- */

.pack-keys-panel {
  grid-column: 1;
  grid-row: 2;
  border-radius: 20px;
  background:
    linear-gradient(180deg, #020617, #020617);
  box-shadow:
    0 12px 28px rgba(0,0,0,0.9),
    inset 0 0 0 2px rgba(15,23,42,1);
  padding: 10px 12px 10px 12px;
  display: flex;
  flex-direction: column;
}

.pack-keys-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 6px;
}

.pack-keys-title {
  font-family: 'Unica One', system-ui, sans-serif;
  letter-spacing: 0.2em;
  font-size: 11px;
  text-transform: uppercase;
  color: #e5e7eb;
}

.pack-keys-sub {
  font-size: 10px;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.16em;
}

. pack-keys-molle {
  height: 16px;
  border-radius: 999px;
  background:
    repeating-linear-gradient(
      90deg,
      rgba(15,23,42,1) 0,
      rgba(15,23,42,1) 10px,
      rgba(31,41,55,1) 10px,
      rgba(31,41,55,1) 18px
    );
  margin-bottom: 6px;
}

.pack-keys-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow-y: auto;
}

.pack-key-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 999px;
  background: rgba(15,23,42,0.96);
  border: 1px solid rgba(55,65,81,0.9);
}

.pack-key-icon {
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

.pack-key-name {
  font-family: 'Space Grotesk', system-ui, sans-serif;
  font-size: 11px;
  color: #e5e7eb;
}

/* ---------- INVENTAR (Mitte) ---------- */

.pack-inventory-panel {
  grid-column: 2;
  grid-row: 1 / span 2;
  border-radius: 24px;
  background:
    linear-gradient(180deg, #020617, #020617);
  box-shadow:
    0 20px 38px rgba(0,0,0,0.95),
    inset 0 0 0 2px rgba(15,23,42,1);
  padding: 10px 12px 12px 12px;
  display: flex;
  flex-direction: column;
}

.pack-inventory-inner {
  border-radius: 18px;
  background:
    radial-gradient(circle at top center, rgba(15,23,42,0.65), transparent 65%),
    linear-gradient(180deg, #020617, #020617);
  padding: 10px 12px 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.pack-inventory-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.pack-inventory-title {
  font-family: 'Unica One', system-ui, sans-serif;
  letter-spacing: 0.26em;
  font-size: 11px;
  text-transform: uppercase;
  color: #e5e7eb;
}

.pack-inventory-sub {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: #9ca3af;
}

.pack-inventory-scroll {
  position: relative;
  flex: 30vh;
  border-radius: 12px;
  background:
    linear-gradient(180deg, #020617, #020617);
  border: 1px solid rgba(31,41,55,1);
  padding: 8px;
  overflow-y: auto;
}

.pack-inventory-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 8px;
  min-height: 0;
}

.pack-slot {
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

. pack-slot. empty:hover {
  transform: none;
  box-shadow: none;
  border-color: rgba(55,65,81,0.9);
}

.pack-slot:hover {
  transform: translateY(-2px) scale(1.03);
  box-shadow:
    0 12px 18px rgba(0,0,0,0.9),
    0 0 0 1px rgba(148,163,184,0.9);
  border-color: #e5e7eb;
}

.pack-slot. slot-glow. selected {
  animation: panelGlow 3s ease-in-out infinite alternate;
}

.pack-slot.slot-flash:hover {
  animation: slotFlash 0.3s ease-out;
  transform: translateY(0px) scale(1.00);
}

.pack-slot.selected {
  box-shadow:
    0 0 0 2px var(--accent-2, #22c55e),
    0 0 24px rgba(34,197,94,0.85);
  border-color: var(--accent-2, #22c55e);
}

. pack-item-icon {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: rgba(15,23,42,0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.pack-item-qty {
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

.pack-tooltip {
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
  animation: packTooltipFade 0.16s ease-out;
}

@keyframes packTooltipFade {
  from { opacity: 0; transform: translate(-50%, -110%); }
  to { opacity: 1; transform: translate(-50%, -100%); }
}

/* HOTBAR */

.pack-hotbar {
  margin-top: 6px;
  border-radius: 12px;
  background:
    linear-gradient(180deg, #020617, #020617);
  border: 1px solid rgba(55,65,81,0.9);
  padding: 6px 8px;
}

.pack-hotbar-header {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: #9ca3af;
  margin-bottom: 4px;
}

.pack-hotbar-row {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 6px;
}

.pack-hotbar-slot-wrapper {
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

.pack-hotbar-slot-wrapper . pack-slot {
  border: none;
  background: none;
  padding: 0;
  box-shadow: none ! important;
  transform: none !important;
  cursor: grab;
}

.pack-hotbar-slot-wrapper . pack-item-icon {
  width: 38px;
  height: 38px;
  font-size: 24px;
  box-shadow: none;
  border-radius: 12px;
  background: rgba(15,23,42,0.9);
}

.pack-hotbar-slot-wrapper .pack-item-qty {
  top: 4px;
  right: 6px;
  min-width: 22px;
  height: 18px;
  font-size: 11px;
  padding: 0 6px;
}

/* ---------- ACTIONS (rechts unten) ---------- */

.pack-actions-panel {
  grid-column: 3;
  grid-row: 2;
  border-radius: 20px;
  background:
    linear-gradient(180deg, #020617, #020617);
  box-shadow:
    0 12px 28px rgba(0,0,0,0.9),
    inset 0 0 0 2px rgba(15,23,42,1);
  padding: 10px 12px 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.pack-actions-title {
  font-family: 'Unica One', system-ui, sans-serif;
  letter-spacing: 0.22em;
  font-size: 11px;
  text-transform: uppercase;
  color: #e5e7eb;
  margin-bottom: 4px;
}

.pack-action-button {
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

.pack-action-button. primary {
  border-color: var(--accent-1, #f97316);
  background: linear-gradient(135deg, var(--accent-1, #f97316), var(--accent-2, #22c55e));
  color: #020617;
  box-shadow:
    0 14px 26px rgba(0,0,0,0.8);
}

.pack-action-button.primary. pulse-active {
  animation: pulseEffect var(--animation-speed, 2. 5s) ease-in-out infinite;
}

.pack-action-button::after {
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

.pack-action-button:hover::after {
  width: 230px;
  height: 230px;
}

.pack-action-button:hover {
  transform: translateY(-1px);
  box-shadow:
    0 14px 30px rgba(0,0,0,0.9);
}
</style>