export type Priority = 'Nízká' | 'Střední' | 'Vysoká'
export interface Tag {
  id: number
  name: string
  color: string
}

export interface SubTask {
  id: number
  title: string
  completed: boolean
}

export interface Task {
  id?: number
  title: string
  description: string
  priority: Priority
  completed: boolean
  createdAt: number
  deadline?: number
  tags: Tag[]
  notes: string
  links: string[]
  subTasks: SubTask[]
}

export type SortType = 'createdAt' | 'priority' | 'custom' | 'deadline' 