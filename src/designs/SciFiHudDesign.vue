<script setup lang="ts">
import { ref, computed } from 'vue'
import type { DesignProps } from '@/types/inventory'

const props = defineProps<DesignProps>()

const selectedItem = ref<number | null>(null)
const hoveredItem = ref<number | null>(null)
const draggedItemIndex = ref<number | null>(null)

const isItemDefined = (item: any) => item !== null && item?. emoji !== undefined && item?.emoji !== ''

const hotbarSlots = computed(() => props.inventoryItems. slice(0, 5))

const useGlow = computed(() => props.animationKey === 'subtleGlow' || props.animationKey === 'scannerPulse')
const useFlash = computed(() => props.animationKey === 'quickResponse')
const usePulse = computed(() => props. animationKey === 'scannerPulse')
const useScan = computed(() => props.animationKey === 'scannerPulse') // Speziell für Sci-Fi/HUD

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
</script>

<template>
  <div class="hud-root">
    <div class="hud-shadow" />
    <div class="hud-shell">
      <div class="hud-frame-outline" />

      <div class="hud-header-bar">
        <div class="hud-title-left">
          <div class="hud-logo-dot" />
          <div class="hud-title-text">INVENTORY HUD</div>
        </div>
        <div class="hud-title-right">
          MODE: ONLINE • GRID 50
        </div>
        <div :class="['hud-scan-line', useScan ? 'scan-active' : '']" />
      </div>

      <div :class="['hud-panel', useScan ? 'hud-scan-active' : '']">
        <div class="hud-layout">
          <!-- oben links – Wallet -->
          <div :class="['hud-wallet', useGlow ? 'hud-panel-glow' : '']">
            <div class="hud-wallet-header">
              <div class="hud-wallet-title">Wallet</div>
              <div class="hud-wallet-sub">Cash &amp; IDs</div>
            </div>
            <div class="hud-wallet-row">
              <div :class="['hud-wallet-cash', usePulse ? 'pulse-active' : '']">
                <div class="hud-wallet-icon">💳</div>
                <div class="hud-wallet-main">
                  <div class="hud-wallet-label">Bargeld</div>
                  <div class="hud-wallet-value">2. 500 $</div>
                </div>
              </div>
              <div class="hud-wallet-licenses">
                <div
                  v-for="lic in licenses"
                  :key="lic. id"
                  class="hud-license-card"
                >
                  <div class="hud-license-main">{{ lic.label }}</div>
                  <div class="hud-license-sub">{{ lic.desc }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- oben rechts – Stats -->
          <div :class="['hud-stats', useGlow ? 'hud-panel-glow' : '']">
            <div class="hud-stats-header">
              <div class="hud-stats-title">Status</div>
              <div class="hud-stats-sub">Vitals &amp; Load</div>
            </div>
            <div class="hud-stats-grid">
              <div
                v-for="stat in stats"
                :key="stat. name"
                :class="['hud-stat-block', usePulse ? 'pulse-active' : '']"
              >
                <div class="hud-stat-name">{{ stat. name }}</div>
                <div class="hud-stat-value-row">
                  <div class="hud-stat-value">{{ stat.value }}</div>
                  <div class="hud-stat-max">/ {{ stat.max }}</div>
                </div>
                <div class="hud-stat-bar">
                  <div
                    class="hud-stat-bar-fill"
                    :style="{
                      width: `${(stat.value / stat.max) * 100}%`,
                      background: stat.color,
                    }"
                  />
                </div>
              </div>
            </div>
            <div class="hud-weight-row">
              <div>
                <div class="hud-weight-text">24. 5 / 50. 0 kg</div>
                <div class="hud-weight-sub">Gewicht / Gesamtgewicht</div>
              </div>
              <div class="hud-weight-status">OK</div>
            </div>
          </div>

          <!-- links unten – Keys -->
          <div :class="['hud-keys', useGlow ? 'hud-panel-glow' : '']">
            <div class="hud-keys-header">
              <div class="hud-keys-title">Keys</div>
              <div class="hud-keys-sub">{{ keys.length }} linked</div>
            </div>
            <div class="hud-keys-list">
              <div
                v-for="(k, i) in keys"
                :key="i"
                :class="['hud-key-item', usePulse ? 'pulse-active' : '']"
              >
                <div class="hud-key-icon">{{ k.icon }}</div>
                <div class="hud-key-name">{{ k.name }}</div>
              </div>
            </div>
          </div>

          <!-- Mitte – Inventar + Hotbar -->
          <div :class="['hud-inventory', useGlow ? 'hud-panel-glow' : '']">
            <div class="hud-inventory-inner">
              <div class="hud-inventory-header">
                <div class="hud-inventory-title">INVENTAR</div>
                <div class="hud-inventory-sub">
                  50 Slots • {{ inventoryItems.filter(isItemDefined).length }} belegt
                </div>
              </div>

              <div class="hud-inventory-scroll">
                <div class="hud-inventory-grid">
                  <!-- Inventar Slots (Index 0 bis 49) -->
                  <div
                    v-for="(item, index) in inventoryItems"
                    :key="index"
                    :data-index="index"
                    :class="[
                      'hud-slot',
                      ! isItemDefined(item) ?  'empty' : '',
                      selectedItem === item?. id ? 'selected' : '',
                      useFlash ? 'hud-slot-flash' : '',
                      isItemDefined(item) && useGlow ? 'slot-glow' : ''
                    ]"
                    :draggable="isItemDefined(item)"
                    @click="selectedItem = selectedItem === item?. id ? null : item?.id"
                    @mouseenter="hoveredItem = item?. id"
                    @mouseleave="hoveredItem = null"
                    @dragstart="(e) => handleDragStart(e, index)"
                    @dragend="handleDragEnd"
                    @dragover="handleDragOver"
                    @dragleave="handleDragLeave"
                    @drop="(e) => handleDrop(e, index)"
                  >
                    <template v-if="isItemDefined(item)">
                      <div class="hud-item-icon">{{ item.emoji }}</div>
                      <div
                        v-if="item.quantity > 1"
                        class="hud-item-qty"
                      >
                        {{ item.quantity }}
                      </div>
                      <div
                        v-if="hoveredItem === item. id"
                        class="hud-tooltip"
                        style="left: 50%; bottom: 100%"
                      >
                        {{ item.name }}
                      </div>
                    </template>
                  </div>
                </div>
              </div>

              <!-- Hotbar -->
              <div class="hud-hotbar">
                <div class="hud-hotbar-header">Hotbar • Quick Access</div>
                <div class="hud-hotbar-row">
                  <div
                    v-for="(item, index) in hotbarSlots"
                    :key="index"
                    class="hud-hotbar-slot-wrapper"
                  >
                    <div
                      :data-index="index"
                      :class="[
                        'hud-slot',
                        !isItemDefined(item) ? 'empty' : '',
                        selectedItem === item?.id ? 'selected' : '',
                        useFlash ? 'hud-slot-flash' : '',
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
                        <div class="hud-item-icon">{{ item. emoji }}</div>
                        <div
                          v-if="item.quantity > 1"
                          class="hud-item-qty"
                        >
                          {{ item.quantity }}
                        </div>
                        <div
                          v-if="hoveredItem === item.id"
                          class="hud-tooltip"
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

          <!-- rechts unten – Aktionen -->
          <div :class="['hud-actions', useGlow ? 'hud-panel-glow' : '']">
            <div class="hud-actions-title">Aktionen</div>
            <button :class="['hud-action-button primary', usePulse ? 'pulse-active' : '']">
              Auf den Boden ablegen
            </button>
            <button class="hud-action-button">
              Vom Boden aufheben
            </button>
            <button class="hud-action-button">
              Geben-Modus
            </button>
          </div>
        </div>
      </div>

      <!-- Untere „Boden"-Leiste, nur als Deko -->
      <div class="hud-floor" />
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Unica+One&family=Shadows+Into+Light&display=swap');

.hud-root {
  position: relative;
  width: 100%;
  max-width: 1100px;
  aspect-ratio: 16 / 9;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hud-shadow {
  position: absolute;
  inset: 0;
  filter: blur(45px);
  background:
    radial-gradient(circle at top, rgba(56,189,248,0.4), transparent 60%),
    radial-gradient(circle at bottom right, rgba(94,234,212,0.35), transparent 65%),
    radial-gradient(circle at bottom left, rgba(129,140,248,0.35), transparent 60%);
  opacity: 0.9;
}

.hud-shell {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 30px;
  background:
    radial-gradient(circle at top, rgba(15,23,42,0.9), transparent 60%),
    linear-gradient(180deg, #020617 0%, #000 100%);
  box-shadow:
    0 26px 60px rgba(0,0,0,0.95),
    0 0 0 1px rgba(15,23,42,0.95);
  padding: 18px 22px 18px 22px;
  display: grid;
  grid-template-rows: auto 1fr;
  overflow: hidden;
}

.hud-frame-outline {
  position: absolute;
  inset: 10px;
  border-radius: 24px;
  border: 1px solid rgba(148,163,184,0.6);
  box-shadow:
    0 0 30px rgba(56,189,248,0.6),
    inset 0 0 0 1px rgba(15,23,42,0.9);
  pointer-events: none;
}

.hud-panel-glow {
  animation: panelGlow var(--animation-speed, 3s) ease-in-out infinite alternate;
}

. hud-pulse {
  animation: pulseEffect var(--animation-speed, 2. 5s) ease-in-out infinite;
}

.hud-slot-flash:hover {
  animation: slotFlash 0.3s ease-out;
  transform: translateY(0px) scale(1.00);
}

/* Spezieller Sci-Fi Scan-Effekt */
. hud-scan-active::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg,
      rgba(var(--animation-pulse-color-rgb, 56, 189, 248), 0.05) 1px,
      transparent 1px),
      linear-gradient(rgba(var(--animation-pulse-color-rgb, 56, 189, 248), 0. 05) 1px,
      transparent 1px);
  background-size: 20px 20px;
  animation: backgroundScan 15s linear infinite;
  mix-blend-mode: overlay;
  opacity: 0.3;
  pointer-events: none;
}

. hud-header-bar {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  z-index: 1;
}

.hud-title-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.hud-logo-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: radial-gradient(circle, var(--accent-2, #22c55e), transparent 60%);
  box-shadow: 0 0 12px var(--accent-2, #22c55e);
}

. hud-title-text {
  font-family: 'Unica One', system-ui, sans-serif;
  font-size: 11px;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  color: #e5e7eb;
}

.hud-title-right {
  font-family: 'Space Grotesk', system-ui, sans-serif;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: #9ca3af;
}

. hud-scan-line {
  position: absolute;
  left: 0;
  right: 0;
  top: 36px;
  height: 1px;
  background: linear-gradient(90deg,
    transparent,
    rgba(56,189,248,0.8),
    transparent
  );
  opacity: 0.8;
}

.hud-scan-line.scan-active {
  animation: scanLineMove 4s linear infinite;
}

@keyframes scanLineMove {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.hud-panel {
  position: relative;
  border-radius: 18px;
  padding: 10px 18px;
  background:
    radial-gradient(circle at top, rgba(15,23,42,0.9), transparent 70%);
  box-shadow: inset 0 0 0 1px rgba(15,23,42,0.95);
}

.hud-layout {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr) 220px;
  grid-template-rows: minmax(0, 1fr) minmax(0, 1fr);
  gap: 12px;
  height: 100%;
  align-items: stretch;
}

/* ---------- WALLET (oben links) ---------- */

.hud-wallet {
  grid-column: 1;
  grid-row: 1;
  border-radius: 16px;
  background:
    linear-gradient(135deg, rgba(15,23,42,0.9), rgba(15,23,42,0.98));
  box-shadow:
    0 12px 24px rgba(0,0,0,0.9),
    inset 0 0 0 1px rgba(15,23,42,1);
  padding: 10px 12px 12px 12px;
  display: flex;
  flex-direction: column;
}

.hud-wallet-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 8px;
}

.hud-wallet-title {
  font-family: 'Unica One', system-ui, sans-serif;
  letter-spacing: 0.2em;
  font-size: 11px;
  text-transform: uppercase;
  color: #e5e7eb;
}

.hud-wallet-sub {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: #9ca3af;
}

. hud-wallet-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.hud-wallet-cash {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 12px;
  background:
    radial-gradient(circle at top left, rgba(248,250,252,0.16), transparent 60%),
    linear-gradient(135deg, var(--accent-1, #f97316), var(--accent-2, #22c55e));
  box-shadow:
    0 12px 24px rgba(0,0,0,0.9);
  overflow: hidden;
}

.hud-wallet-cash. pulse-active {
  animation: pulseEffect var(--animation-speed, 2.5s) ease-in-out infinite;
}

.hud-wallet-cash::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg,
    transparent 0,
    rgba(248,250,252,0.15) 30%,
    transparent 60%
  );
  mix-blend-mode: screen;
  opacity: 0. 4;
  pointer-events: none;
}

.hud-wallet-icon {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: rgba(15,23,42,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #f9fafb;
}

.hud-wallet-main {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.hud-wallet-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: rgba(15,23,42,0.85);
}

.hud-wallet-value {
  font-family: 'Space Grotesk', system-ui, sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #f9fafb;
}

.hud-wallet-licenses {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px;
}

.hud-license-card {
  border-radius: 8px;
  background:
    linear-gradient(145deg, #020617, #020617);
  border: 1px solid rgba(55,65,81,0.9);
  padding: 5px 7px;
  position: relative;
  overflow: hidden;
}

.hud-license-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--accent-1, #f97316), transparent);
  opacity: 0.7;
}

.hud-license-main {
  font-family: 'Space Grotesk', system-ui, sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: #e5e7eb;
}

.hud-license-sub {
  font-size: 10px;
  color: #9ca3af;
}

/* ---------- STATS (oben rechts) ---------- */

.hud-stats {
  grid-column: 3;
  grid-row: 1;
  border-radius: 16px;
  background:
    linear-gradient(145deg, #020617, #020617);
  box-shadow:
    0 14px 26px rgba(0,0,0,0.9),
    inset 0 0 0 1px rgba(15,23,42,1);
  padding: 10px 12px 12px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.hud-stats-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.hud-stats-title {
  font-family: 'Unica One', system-ui, sans-serif;
  letter-spacing: 0.2em;
  font-size: 11px;
  text-transform: uppercase;
  color: #e5e7eb;
}

.hud-stats-sub {
  font-size: 10px;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.16em;
}

.hud-stats-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px;
}

.hud-stat-block {
  border-radius: 9px;
  background: radial-gradient(circle at top, rgba(15,23,42,0.95), transparent 120%);
  border: 1px solid rgba(55,65,81,0.9);
  padding: 5px 7px;
}

.hud-stat-block.pulse-active {
  animation: pulseEffect var(--animation-speed, 2.5s) ease-in-out infinite;
}

.hud-stat-name {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: #9ca3af;
  margin-bottom: 2px;
}

.hud-stat-value-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 3px;
}

.hud-stat-value {
  font-family: 'Space Grotesk', system-ui, sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #e5e7eb;
}

.hud-stat-max {
  font-size: 11px;
  color: #6b7280;
}

. hud-stat-bar {
  height: 5px;
  border-radius: 999px;
  background: rgba(17,24,39,1);
  overflow: hidden;
}

.hud-stat-bar-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.3s ease;
}

.hud-weight-row {
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

.hud-weight-text {
  font-family: 'Space Grotesk', system-ui, sans-serif;
  font-size: 12px;
  color: #e5e7eb;
}

.hud-weight-sub {
  font-size: 10px;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.14em;
}

. hud-weight-status {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: var(--accent-2, #22c55e);
}

/* ---------- KEYS (links unten) ---------- */

. hud-keys {
  grid-column: 1;
  grid-row: 2;
  border-radius: 16px;
  background:
    linear-gradient(145deg, #020617, #020617);
  box-shadow:
    0 12px 26px rgba(0,0,0,0.9),
    inset 0 0 0 1px rgba(15,23,42,1);
  padding: 10px 12px 10px 12px;
  display: flex;
  flex-direction: column;
}

.hud-keys-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 6px;
}

.hud-keys-title {
  font-family: 'Unica One', system-ui, sans-serif;
  letter-spacing: 0.2em;
  font-size: 11px;
  text-transform: uppercase;
  color: #e5e7eb;
}

.hud-keys-sub {
  font-size: 10px;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.16em;
}

.hud-keys-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow-y: auto;
}

.hud-key-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 999px;
  background: rgba(15,23,42,0.98);
  border: 1px solid rgba(55,65,81,0.9);
}

.hud-key-icon {
  width: 26px;
  height: 26px;
  border-radius: 999px;
  background: radial-gradient(circle at top, #22c55e, #0f766e);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #020617;
}

.hud-key-name {
  font-family: 'Space Grotesk', system-ui, sans-serif;
  font-size: 11px;
  color: #e5e7eb;
}

/* ---------- INVENTAR (Mitte, über beide Reihen) ---------- */

.hud-inventory {
  grid-column: 2;
  grid-row: 1 / span 2;
  border-radius: 20px;
  background:
    radial-gradient(circle at top, rgba(15,23,42,0.7), transparent 70%),
    linear-gradient(180deg, #020617, #020617);
  box-shadow:
    0 20px 38px rgba(0,0,0,0.95),
    inset 0 0 0 1px rgba(15,23,42,1);
  padding: 10px 12px 12px 12px;
  display: flex;
  flex-direction: column;
}

.hud-inventory-inner {
  border-radius: 16px;
  background:
    radial-gradient(circle at top, rgba(15,23,42,0.9), transparent 60%),
    linear-gradient(180deg, #020617, #020617);
  padding: 10px 12px 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

. hud-inventory-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.hud-inventory-title {
  font-family: 'Unica One', system-ui, sans-serif;
  letter-spacing: 0.26em;
  font-size: 11px;
  text-transform: uppercase;
  color: #e5e7eb;
}

.hud-inventory-sub {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: #9ca3af;
}

.hud-inventory-scroll {
  position: relative;
  flex: 30vh;
  border-radius: 10px;
  background: radial-gradient(circle at center, rgba(15,23,42,0.9), #020617);
  border: 1px solid rgba(31,41,55,1);
  padding: 8px;
  overflow-y: auto;
}

.hud-inventory-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 7px;
  min-height: 0;
}

.hud-slot {
  position: relative;
  border-radius: 9px;
  background:
    radial-gradient(circle at top, rgba(15,23,42,0.7), transparent 80%);
  border: 1px solid rgba(55,65,81,0.9);
  box-shadow:
    0 0 0 1px rgba(15,23,42,1);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  cursor: grab;
  transition: all 0.15s ease-out;
  aspect-ratio: 1 / 1;
  min-height: 0;
}

. hud-slot. empty:hover {
  transform: none;
  box-shadow: none;
  border-color: rgba(55,65,81,0.9);
}

.hud-slot:hover {
  transform: translateY(-1px) scale(1.02);
  box-shadow:
    0 10px 16px rgba(0,0,0,0.9),
    0 0 0 1px rgba(148,163,184,0.9);
  border-color: #e5e7eb;
}

.hud-slot. slot-glow. selected {
  animation: panelGlow 3s ease-in-out infinite alternate;
}

.hud-slot.slot-flash:hover {
  animation: slotFlash 0.3s ease-out;
  transform: translateY(0px) scale(1. 00);
}

.hud-slot.selected {
  box-shadow:
    0 0 0 2px var(--accent-2, #22c55e),
    0 0 22px rgba(34,197,94,0.85);
  border-color: var(--accent-2, #22c55e);
}

. hud-item-icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: rgba(15,23,42,0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
}

.hud-item-qty {
  position: absolute;
  top: 3px;
  right: 4px;
  min-width: 20px;
  height: 16px;
  border-radius: 999px;
  padding: 0 5px;
  background: linear-gradient(135deg, var(--accent-1, #f97316), var(--accent-3, #22c55e));
  color: #0b1120;
  font-size: 10px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.hud-tooltip {
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
  animation: hudTooltipFade 0.16s ease-out;
}

@keyframes hudTooltipFade {
  from { opacity: 0; transform: translate(-50%, -110%); }
  to { opacity: 1; transform: translate(-50%, -100%); }
}

/* HOTBAR */

.hud-hotbar {
  margin-top: 6px;
  border-radius: 10px;
  background:
    linear-gradient(180deg, #020617, #020617);
  border: 1px solid rgba(55,65,81,0.9);
  padding: 6px 8px;
}

.hud-hotbar-header {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: #9ca3af;
  margin-bottom: 4px;
}

.hud-hotbar-row {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 6px;
}

.hud-hotbar-slot-wrapper {
  position: relative;
  aspect-ratio: 1 / 1;
  padding: 3px;
  border-radius: 9px;
  background: radial-gradient(circle at top, rgba(15,23,42,0.85), transparent 80%);
  border: 1px solid var(--accent-2, #22c55e);
  box-shadow: 0 0 0 1px rgba(34,197,94,0.6), 0 8px 14px rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}

.hud-hotbar-slot-wrapper . hud-slot {
  border: none;
  background: none;
  padding: 0;
  box-shadow: none ! important;
  transform: none !important;
  cursor: grab;
}

.hud-hotbar-slot-wrapper . hud-item-icon {
  width: 30px;
  height: 30px;
  font-size: 20px;
  box-shadow: none;
  border-radius: 8px;
  background: rgba(15,23,42,0. 95);
}

.hud-hotbar-slot-wrapper .hud-item-qty {
  top: 3px;
  right: 4px;
  min-width: 20px;
  height: 16px;
  font-size: 10px;
  padding: 0 5px;
}

/* ---------- ACTIONS (rechts unten) ---------- */

.hud-actions {
  grid-column: 3;
  grid-row: 2;
  border-radius: 16px;
  background:
    linear-gradient(145deg, #020617, #020617);
  box-shadow:
    0 12px 26px rgba(0,0,0,0.9),
    inset 0 0 0 1px rgba(15,23,42,1);
  padding: 10px 12px 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.hud-actions-title {
  font-family: 'Unica One', system-ui, sans-serif;
  letter-spacing: 0.22em;
  font-size: 11px;
  text-transform: uppercase;
  color: #e5e7eb;
  margin-bottom: 4px;
}

.hud-action-button {
  position: relative;
  border-radius: 999px;
  padding: 8px 10px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  border: 1px solid rgba(55,65,81,0.9);
  background: radial-gradient(circle at center, rgba(15,23,42,0.9), #020617);
  color: #e5e7eb;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.16s ease;
}

.hud-action-button. primary {
  border-color: var(--accent-1, #f97316);
  background: radial-gradient(circle at center,
    rgba(56,189,248,0.2),
    rgba(15,23,42,1)
  );
  color: #e5e7eb;
  box-shadow:
    0 14px 26px rgba(0,0,0,0.8);
}

.hud-action-button.primary. pulse-active {
  animation: pulseEffect var(--animation-speed, 2.5s) ease-in-out infinite;
}

.hud-action-button::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(56,189,248,0.4), transparent 60%);
  transform: translate(-50%, -50%);
  transition: width 0.4s ease, height 0.4s ease;
}

.hud-action-button:hover::after {
  width: 220px;
  height: 220px;
}

.hud-action-button:hover {
  transform: translateY(-1px);
  box-shadow:
    0 16px 32px rgba(0,0,0,0.95);
}
</style>