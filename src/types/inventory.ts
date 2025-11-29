export interface InventoryItem {
  id: number
  name: string
  emoji: string
  quantity: number
}

export interface KeyItem {
  name: string
  icon: string
}

export interface License {
  id: string
  label: string
  desc: string
}

export interface Stat {
  name: string
  value: number
  max: number
  color: string
}

export interface DesignProps {
  themeKey: string
  animationKey: string
  inventoryItems: (InventoryItem | null)[]
  moveItem: (fromIndex: number, toIndex: number) => void
  keys: KeyItem[]
  licenses: License[]
  stats: Stat[]
}