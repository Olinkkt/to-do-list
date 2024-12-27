export type Priority = 'Nízká' | 'Střední' | 'Vysoká'

export interface Task {
  id?: number
  title: string
  description: string
  priority: Priority
  completed: boolean
} 

declare global {
  interface NotificationOptions {
    body?: string
    icon?: string
    tag?: string
    requireInteraction?: boolean
    vibrate?: number[]
  }
} 