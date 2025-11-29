import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { InventoryItem } from '../types/inventory'

const INITIAL_ITEMS: InventoryItem[] = [
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
]

const PADDED_ITEMS: (InventoryItem | null)[] = [
  ...INITIAL_ITEMS,
  ...Array(50 - INITIAL_ITEMS.length).fill(null)
]

export const useInventoryStore = defineStore('inventory', () => {
  const items = ref<(InventoryItem | null)[]>([... PADDED_ITEMS])
  const layoutKey = ref<string>('briefcase')
  const themeKey = ref<string>('classicLeather')
  const animationKey = ref<string>('none')
  
  function moveItem(fromIndex: number, toIndex: number) {
    const newItems = [...items.value]
    const itemA = newItems[fromIndex]
    const itemB = newItems[toIndex]

    if (itemA === null) return
    
    newItems[toIndex] = itemA
    newItems[fromIndex] = itemB
    
    items.value = newItems
  }
  
  return { items, layoutKey, themeKey, animationKey, moveItem }

  function toggleSettings() {
    settingsOpen.value = !settingsOpen. value
  }
  
  function updateSettingsPosition(x: number, y: number) {
    settingsPosition.value = { x, y }
  }
  
  return { 
    items, 
    layoutKey, 
    themeKey, 
    animationKey, 
    settingsOpen,
    settingsPosition,
    moveItem,
    toggleSettings,
    updateSettingsPosition
  }
})