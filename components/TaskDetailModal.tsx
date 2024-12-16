import { useState, useMemo, useRef } from 'react'
import { Task, SubTask, Tag } from './types'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { cs } from 'date-fns/locale'

// Registrujeme českou lokalizaci
registerLocale('cs', cs)

interface TaskDetailModalProps {
  task: Task
  isOpen: boolean
  onClose: () => void
  onUpdate: (updatedTask: Task) => void
}

export default function TaskDetailModal({ task, isOpen, onClose, onUpdate }: TaskDetailModalProps) {
  const [editedTask, setEditedTask] = useState(task)
  const [newSubTask, setNewSubTask] = useState('')
  const [newLink, setNewLink] = useState('')
  const [newTagName, setNewTagName] = useState('')
  const [isAddingTag, setIsAddingTag] = useState(false)
  const newTagInputRef = useRef<HTMLInputElement>(null)
  
  // Předefinované barvy pro štítky
  const tagColors = [
    'bg-blue-500/30 text-blue-300',
    'bg-green-500/30 text-green-300',
    'bg-yellow-500/30 text-yellow-300',
    'bg-red-500/30 text-red-300',
    'bg-purple-500/30 text-purple-300',
    'bg-pink-500/30 text-pink-300',
  ]

  // Výpočet procenta dokončení
  const completionPercentage = useMemo(() => {
    if (!editedTask?.subTasks) return task.completed ? 100 : 0;
    
    if (editedTask.subTasks.length === 0) return task.completed ? 100 : 0;
    
    const completed = editedTask.subTasks.filter(st => st.completed).length;
    return Math.round((completed / editedTask.subTasks.length) * 100);
  }, [editedTask.subTasks, task.completed])

  const handleAddSubTask = () => {
    if (!newSubTask.trim()) return
    setEditedTask(prev => ({
      ...prev,
      subTasks: [...prev.subTasks, {
        id: Date.now(),
        title: newSubTask.trim(),
        completed: false
      }]
    }))
    setNewSubTask('')
  }

  const handleToggleSubTask = (subTaskId: number) => {
    setEditedTask(prev => ({
      ...prev,
      subTasks: prev.subTasks.map(st =>
        st.id === subTaskId ? { ...st, completed: !st.completed } : st
      )
    }))
  }

  const handleAddLink = () => {
    if (!newLink.trim()) return
    setEditedTask(prev => ({
      ...prev,
      links: [...prev.links, newLink.trim()]
    }))
    setNewLink('')
  }

  const handleStartAddingTag = () => {
    setIsAddingTag(true)
    // Zaměříme input po zobrazení
    setTimeout(() => newTagInputRef.current?.focus(), 50)
  }

  const handleTagSubmit = () => {
    if (!newTagName.trim()) {
      setIsAddingTag(false)
      setNewTagName('')
      return
    }
    
    const randomColor = tagColors[Math.floor(Math.random() * tagColors.length)]
    
    const newTag: Tag = {
      id: Date.now(),
      name: newTagName.trim(),
      color: randomColor
    }

    setEditedTask(prev => ({
      ...prev,
      tags: [...prev.tags, newTag]
    }))
    setNewTagName('')
    setIsAddingTag(false)
  }

  const handleRemoveTag = (tagId: number) => {
    setEditedTask(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag.id !== tagId)
    }))
  }

  const handleSave = () => {
    onUpdate(editedTask)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gray-900/95 border border-white/20 rounded-3xl p-6 max-w-2xl w-full 
      space-y-6 animate-fade-in shadow-xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-white">{task.title}</h2>
          <div className="flex items-center gap-4">
            <div className="text-lg font-medium text-white/80">
              {completionPercentage}% dokončeno
            </div>
            <button onClick={onClose} className="text-white/60 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Štítky */}
        <div className="space-y-2">
          <label className="text-white/80 text-sm font-medium">Štítky</label>
          <div className="flex flex-wrap gap-2">
            {editedTask.tags.map(tag => (
              <span
                key={tag.id}
                className={`px-3 py-1 rounded-full text-sm font-medium 
                flex items-center gap-2 ${tag.color}`}
              >
                {tag.name}
                <button
                  onClick={() => handleRemoveTag(tag.id)}
                  className="hover:text-white/80 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
            
            {/* Přidání nového štítku */}
            {isAddingTag ? (
              <div className="px-3 py-1 rounded-full bg-gray-800/50 flex items-center">
                <input
                  ref={newTagInputRef}
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  onBlur={handleTagSubmit}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleTagSubmit()
                    if (e.key === 'Escape') {
                      setIsAddingTag(false)
                      setNewTagName('')
                    }
                  }}
                  className="bg-transparent border-none outline-none text-sm text-white/80 w-24"
                  placeholder="Nový štítek"
                />
              </div>
            ) : (
              <button
                onClick={handleStartAddingTag}
                className="px-3 py-1 rounded-full bg-gray-800/50 text-gray-400 
                hover:bg-gray-800/70 text-sm font-medium transition-all duration-200
                flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Přidat štítek
              </button>
            )}
          </div>
        </div>

        {/* Podúkoly */}
        <div className="space-y-2">
          <label className="text-white/80 text-sm font-medium">Podúkoly</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newSubTask}
              onChange={(e) => setNewSubTask(e.target.value)}
              placeholder="Nový podúkol..."
              className="modern-input rounded-xl flex-1"
              onKeyDown={(e) => e.key === 'Enter' && handleAddSubTask()}
            />
            <button
              onClick={handleAddSubTask}
              className="px-4 py-2 rounded-xl bg-blue-500/20 text-blue-300 
              hover:bg-blue-500/30 text-sm font-medium transition-all duration-200"
            >
              Přidat
            </button>
          </div>
          <div className="space-y-2">
            {editedTask.subTasks.map(subTask => (
              <div 
                key={subTask.id} 
                className="group flex items-center gap-3 bg-black/20 p-3 rounded-xl
                hover:bg-black/30 transition-all duration-200"
              >
                <button
                  onClick={() => handleToggleSubTask(subTask.id)}
                  className={`w-5 h-5 rounded-md border transition-all duration-200 flex items-center justify-center
                  ${subTask.completed ? 
                    'bg-green-500/20 border-green-500/50 text-green-400' : 
                    'border-white/20 hover:border-white/40'
                  }`}
                >
                  {subTask.completed && (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                </button>
                <span 
                  className={`flex-1 text-white/80 transition-all duration-200
                  ${subTask.completed ? 'line-through text-white/40' : 'group-hover:text-white'}`}
                >
                  {subTask.title}
                </span>
                <button
                  onClick={() => {
                    setEditedTask(prev => ({
                      ...prev,
                      subTasks: prev.subTasks.filter(st => st.id !== subTask.id)
                    }))
                  }}
                  className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 
                  transition-all duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Poznámky */}
        <div className="space-y-2">
          <label className="text-white/80 text-sm font-medium">Poznámky</label>
          <textarea
            value={editedTask.notes}
            onChange={(e) => setEditedTask(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Přidat poznámky..."
            rows={4}
            className="modern-input rounded-xl resize-none"
          />
        </div>

        {/* Odkazy */}
        <div className="space-y-2">
          <label className="text-white/80 text-sm font-medium">Odkazy</label>
          <div className="flex gap-2">
            <input
              type="url"
              value={newLink}
              onChange={(e) => setNewLink(e.target.value)}
              placeholder="https://..."
              className="modern-input rounded-xl flex-1"
              onKeyDown={(e) => e.key === 'Enter' && handleAddLink()}
            />
            <button
              onClick={handleAddLink}
              className="px-4 py-2 rounded-xl bg-blue-500/20 text-blue-300 
              hover:bg-blue-500/30 text-sm font-medium transition-all duration-200"
            >
              Přidat
            </button>
          </div>
          <div className="space-y-2">
            {editedTask.links.map((link, index) => (
              <div
                key={index}
                className="group flex items-center gap-3 bg-black/20 p-3 rounded-xl
                hover:bg-black/30 transition-all duration-200"
              >
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-blue-400 hover:text-blue-300 
                  transition-colors duration-200 truncate"
                >
                  {link}
                </a>
                <button
                  onClick={() => {
                    setEditedTask(prev => ({
                      ...prev,
                      links: prev.links.filter((_, i) => i !== index)
                    }))
                  }}
                  className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 
                  transition-all duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Deadline */}
        <div className="space-y-2">
          <label className="text-white/80 text-sm font-medium">Deadline</label>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <DatePicker
                selected={editedTask.deadline ? new Date(editedTask.deadline) : null}
                onChange={(date: Date | null) => {
                  if (date) {
                    const currentDeadline = editedTask.deadline ? new Date(editedTask.deadline) : new Date()
                    date.setHours(currentDeadline.getHours(), currentDeadline.getMinutes())
                    setEditedTask(prev => ({ ...prev, deadline: date.getTime() }))
                  } else {
                    setEditedTask(prev => ({ ...prev, deadline: undefined }))
                  }
                }}
                locale="cs"
                dateFormat="P"
                placeholderText="Vyberte datum..."
                showPopperArrow={false}
                className="w-full bg-black/20 p-3 rounded-xl text-white/80 
                border-none focus:ring-0 cursor-pointer hover:bg-black/30 transition-all"
                calendarClassName="deadline-calendar"
                wrapperClassName="w-full"
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="Čas"
                isClearable
              />
            </div>
          </div>
          {editedTask.deadline && (
            <p className="text-sm text-white/60 pl-1">
              {new Date(editedTask.deadline).toLocaleString('cs', { 
                dateStyle: 'full', 
                timeStyle: 'short' 
              })}
            </p>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={handleSave}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 
            text-white font-medium hover:opacity-90 transition-all duration-200"
          >
            Uložit změny
          </button>
        </div>
      </div>
    </div>
  )
} 