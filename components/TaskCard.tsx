import { useState } from 'react'
import { Task, Priority, SortType } from './types'
import DeleteModal from './DeleteModal'
import TaskDetailModal from './TaskDetailModal'

interface TaskCardProps {
  task: Task
  onUpdateTask: (task: Task) => void
  onDeleteTask: (id: number) => void
  sortBy: SortType
  onMoveUp?: () => void
  onMoveDown?: () => void
  isFirst?: boolean
  isLast?: boolean
}

export default function TaskCard({ 
  task, 
  onUpdateTask, 
  onDeleteTask, 
  sortBy,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast 
}: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTask, setEditedTask] = useState(task)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)

  const handleComplete = () => {
    onUpdateTask({ ...task, completed: !task.completed })
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    onUpdateTask(editedTask)
    setIsEditing(false)
  }

  const handleDelete = () => {
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    onDeleteTask(task.id!)
    setShowDeleteModal(false)
  }

  const getTimeRemaining = (deadline: number) => {
    const now = Date.now()
    const remaining = deadline - now
    
    if (remaining < 0) return { text: 'Po termínu', isOverdue: true }
    
    const days = Math.floor(remaining / (1000 * 60 * 60 * 24))
    const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) return { text: `${days} ${days === 1 ? 'den' : days < 5 ? 'dny' : 'dní'}`, isOverdue: false }
    return { text: `${hours} ${hours === 1 ? 'hodina' : hours < 5 ? 'hodiny' : 'hodin'}`, isOverdue: false }
  }

  return (
    <>
      <div 
        className="task-card cursor-pointer hover:scale-[1.01]" 
        onClick={(e) => {
          if (!isEditing && !(e.target as HTMLElement).closest('button')) {
            setShowDetailModal(true)
          }
        }}
      >
        {isEditing ? (
          <div className="space-y-4">
            <input
              type="text"
              value={editedTask.title}
              onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
              className="modern-input"
            />
            <textarea
              value={editedTask.description}
              onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
              className="modern-input"
              rows={3}
            />
            <select
              value={editedTask.priority}
              onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value as Priority })}
              className="modern-select"
            >
              <option value="Nízká">🟢 Nízká priorita</option>
              <option value="Střední">🟡 Střední priorita</option>
              <option value="Vysoká">🔴 Vysoká priorita</option>
            </select>
            <button 
              onClick={handleSave} 
              className="w-full p-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 
              text-white font-medium hover:opacity-90 transition-all duration-200"
            >
              Uložit
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className={`text-xl font-medium ${task.completed ? 'line-through text-gray-400' : 'text-white'}`}>
                    {task.title}
                  </h3>
                  {task.deadline && (
                    <div className={`text-sm mt-1 flex items-center gap-2
                      ${task.completed ? 'text-gray-500' :
                        getTimeRemaining(task.deadline).isOverdue ? 'text-red-400' : 'text-blue-400'}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {new Date(task.deadline).toLocaleDateString('cs')} ({getTimeRemaining(task.deadline).text})
                    </div>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  task.priority === 'Vysoká' ? 'bg-red-500/20 text-red-300' :
                  task.priority === 'Střední' ? 'bg-yellow-500/20 text-yellow-300' :
                  'bg-green-500/20 text-green-300'
                }`}>
                  {task.priority === 'Vysoká' ? '🔴' : task.priority === 'Střední' ? '🟡' : '🟢'} {task.priority}
                </span>
              </div>
              <p className="text-gray-300">{task.description}</p>
            </div>
            <div className="flex justify-between items-center mt-6">
              {/* Levá strana - tlačítka pro posun */}
              {sortBy === 'custom' && (
                <div className="flex gap-2">
                  <button
                    onClick={onMoveUp}
                    disabled={isFirst}
                    className="px-4 py-2 rounded-xl bg-gray-800/50 text-gray-300
                    hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed
                    text-sm font-medium transition-all duration-200 flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                    </svg>
                    Nahoru
                  </button>
                  <button
                    onClick={onMoveDown}
                    disabled={isLast}
                    className="px-4 py-2 rounded-xl bg-gray-800/50 text-gray-300
                    hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed
                    text-sm font-medium transition-all duration-200 flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                    </svg>
                    Dolů
                  </button>
                </div>
              )}
              {sortBy !== 'custom' && <div></div>}

              {/* Pravá strana - existující tlačítka */}
              <div className="flex space-x-3">
                <button 
                  onClick={handleComplete}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                  flex items-center gap-2
                  ${task.completed ? 
                    'bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30' : 
                    'bg-green-500/20 text-green-300 hover:bg-green-500/30'}`}
                >
                  {task.completed ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                      </svg>
                      Obnovit
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      Hotovo
                    </>
                  )}
                </button>
                <button 
                  onClick={handleEdit}
                  className="px-4 py-2 rounded-xl bg-blue-500/20 text-blue-300 
                  hover:bg-blue-500/30 text-sm font-medium transition-all duration-200
                  flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                  </svg>
                  Upravit
                </button>
                <button 
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-xl bg-red-500/20 text-red-300 
                  hover:bg-red-500/30 text-sm font-medium transition-all duration-200
                  flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                  Smazat
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <TaskDetailModal
        task={task}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        onUpdate={onUpdateTask}
      />

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        taskTitle={task.title}
      />
    </>
  )
}

