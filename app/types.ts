export type Priority = 'Nízká' | 'Střední' | 'Vysoká'

export interface Task {
  id?: number
  title: string
  description: string
  priority: Priority
  completed: boolean
}

