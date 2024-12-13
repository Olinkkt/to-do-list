import { useState } from 'react'
import { Task, Priority } from './types'

interface TaskFormProps {
  onAddTask: (task: Task) => void
}

export default function TaskForm({ onAddTask }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('Střední')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onAddTask({ title, description, priority, completed: false })
    setTitle('')
    setDescription('')
    setPriority('Střední')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-gray-900/50 rounded-3xl p-8 border border-white/10 shadow-xl">
      <div className="space-y-2">
        <label htmlFor="title" className="block text-white/80 text-sm font-medium pl-1">
          Název úkolu
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="modern-input rounded-2xl"
          placeholder="Např.: Dokončit projekt"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="block text-white/80 text-sm font-medium pl-1">
          Popis úkolu
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="modern-input rounded-2xl min-h-[120px] resize-none"
          placeholder="Např.: Implementovat nové funkce..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="priority" className="block text-white/80 text-sm font-medium pl-1">
          Priorita
        </label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className="modern-select rounded-2xl"
        >
          <option value="Nízká">🟢 Nízká priorita</option>
          <option value="Střední">🟡 Střední priorita</option>
          <option value="Vysoká">🔴 Vysoká priorita</option>
        </select>
      </div>

      <button 
        type="submit" 
        className="gradient-button w-full rounded-2xl"
      >
        ✨ Přidat úkol
      </button>
    </form>
  )
}

