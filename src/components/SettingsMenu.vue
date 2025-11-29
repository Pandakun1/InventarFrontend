<script setup lang="ts">
import { ref, computed } from 'vue'
import { useInventoryStore } from '../stores/inventory'

const store = useInventoryStore()

const isDragging = ref(false)
const dragOffset = ref({ x: 0, y: 0 })

const LAYOUTS = {
  briefcase: { name: '🧳 Koffer', key: 'briefcase' },
  kidsShelf: { name: '🎨 Kinderregal', key: 'kidsShelf' },
  tacticalBackpack: { name: '🎒 Taktischer Rucksack', key: 'tacticalBackpack' },
  retroDrawer: { name: '📦 Retro Schubladen', key: 'retroDrawer' },
  sciFiHud: { name: '🚀 Sci-Fi HUD', key: 'sciFiHud' },
}

const THEMES = {
  classicLeather: { name: '🟤 Classic Leder', key: 'classicLeather' },
  nightOps: { name: '🌙 Night Ops', key: 'nightOps' },
  desertDust: { name: '🏜️ Desert Dust', key: 'desertDust' },
  neonMiami: { name: '🌆 Neon Miami', key: 'neonMiami' },
  arcticBlue: { name: '❄️ Arctic Blue', key: 'arcticBlue' },
}

const ANIMATIONS = {
  none: { name: '⚪ Keine', key: 'none' },
  subtleGlow: { name: '✨ Subtiles Glühen', key: 'subtleGlow' },
  quickResponse: { name: '⚡ Schnelle Reaktion', key: 'quickResponse' },
  scannerPulse: { name: '📡 Scanner-Puls', key: 'scannerPulse' },
}

const handleMouseDown = (e: MouseEvent) => {
  isDragging.value = true
  dragOffset.value = {
    x: e.clientX - store.settingsPosition.x,
    y: e.clientY - store.settingsPosition. y
  }
}

const handleMouseMove = (e: MouseEvent) => {
  if (isDragging.value) {
    store.updateSettingsPosition(
      e.clientX - dragOffset.value.x,
      e.clientY - dragOffset.value.y
    )
  }
}

const handleMouseUp = () => {
  isDragging.value = false
}

// Event Listeners für Dragging
if (typeof window !== 'undefined') {
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseup', handleMouseUp)
}
</script>

<template>
  <Transition name="settings-fade">
    <div
      v-if="store.settingsOpen"
      class="settings-overlay"
      @click. self="store.toggleSettings()"
    >
      <div
        class="settings-window"
        :style="{
          left: `${store.settingsPosition.x}px`,
          top: `${store.settingsPosition.y}px`,
        }"
      >
        <!-- Draggable Header -->
        <div
          class="settings-header"
          @mousedown="handleMouseDown"
        >
          <div class="settings-title">
            <span class="settings-icon">⚙️</span>
            Einstellungen
          </div>
          <button
            class="settings-close"
            @click="store.toggleSettings()"
          >
            ✕
          </button>
        </div>

        <!-- Settings Content -->
        <div class="settings-content">
          <!-- Layout Kategorie -->
          <div class="settings-category">
            <div class="settings-category-title">
              <span class="category-icon">🎨</span>
              Layout
            </div>
            <div class="settings-options">
              <button
                v-for="(layout, key) in LAYOUTS"
                :key="key"
                :class="['settings-option-btn', store.layoutKey === key ? 'active' : '']"
                @click="store.layoutKey = key"
              >
                {{ layout. name }}
              </button>
            </div>
          </div>

          <!-- Theme Kategorie -->
          <div class="settings-category">
            <div class="settings-category-title">
              <span class="category-icon">🎨</span>
              Farbschema
            </div>
            <div class="settings-options">
              <button
                v-for="(theme, key) in THEMES"
                :key="key"
                :class="['settings-option-btn', store. themeKey === key ? 'active' : '']"
                @click="store.themeKey = key"
              >
                {{ theme.name }}
              </button>
            </div>
          </div>

          <!-- Animation Kategorie -->
          <div class="settings-category">
            <div class="settings-category-title">
              <span class="category-icon">✨</span>
              Animationen
            </div>
            <div class="settings-options">
              <button
                v-for="(animation, key) in ANIMATIONS"
                :key="key"
                :class="['settings-option-btn', store. animationKey === key ? 'active' : '']"
                @click="store.animationKey = key"
              >
                {{ animation.name }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.settings-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.settings-window {
  position: absolute;
  width: 480px;
  max-height: 80vh;
  background: linear-gradient(135deg, #1e293b, #0f172a);
  border-radius: 16px;
  box-shadow:
    0 30px 60px rgba(0, 0, 0, 0.9),
    0 0 0 2px rgba(148, 163, 184, 0.3),
    inset 0 0 40px rgba(56, 189, 248, 0.05);
  overflow: hidden;
  cursor: default;
}

.settings-header {
  background: linear-gradient(135deg, #334155, #1e293b);
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: move;
  border-bottom: 2px solid rgba(56, 189, 248, 0.3);
  user-select: none;
}

.settings-title {
  font-family: 'Space Grotesk', system-ui, sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #f8fafc;
  display: flex;
  align-items: center;
  gap: 8px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.settings-icon {
  font-size: 20px;
}

.settings-close {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: rgba(239, 68, 68, 0.2);
  color: #fca5a5;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.settings-close:hover {
  background: rgba(239, 68, 68, 0.4);
  color: #fff;
  transform: scale(1.05);
}

.settings-content {
  padding: 16px;
  max-height: calc(80vh - 60px);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.settings-category {
  background: rgba(15, 23, 42, 0.6);
  border-radius: 12px;
  padding: 12px;
  border: 1px solid rgba(148, 163, 184, 0.2);
}

.settings-category-title {
  font-family: 'Unica One', system-ui, sans-serif;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #cbd5e1;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}

. category-icon {
  font-size: 16px;
}

.settings-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.settings-option-btn {
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid rgba(148, 163, 184, 0. 3);
  background: rgba(30, 41, 59, 0.6);
  color: #cbd5e1;
  font-family: 'Space Grotesk', system-ui, sans-serif;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.settings-option-btn:hover {
  background: rgba(51, 65, 85, 0.8);
  border-color: rgba(56, 189, 248, 0.5);
  transform: translateY(-1px);
}

.settings-option-btn.active {
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.3), rgba(34, 197, 94, 0.3));
  border-color: rgba(56, 189, 248, 0.8);
  color: #f8fafc;
  font-weight: 700;
  box-shadow: 0 0 16px rgba(56, 189, 248, 0.4);
}

/* Scrollbar Styling */
.settings-content::-webkit-scrollbar {
  width: 8px;
}

.settings-content::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.6);
  border-radius: 4px;
}

.settings-content::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.4);
  border-radius: 4px;
}

.settings-content::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.6);
}

/* Fade Transition */
.settings-fade-enter-active,
.settings-fade-leave-active {
  transition: opacity 0.3s ease;
}

.settings-fade-enter-from,
.settings-fade-leave-to {
  opacity: 0;
}

. settings-fade-enter-active . settings-window,
.settings-fade-leave-active .settings-window {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.settings-fade-enter-from .settings-window,
.settings-fade-leave-to .settings-window {
  transform: scale(0.9);
  opacity: 0;
}
</style>