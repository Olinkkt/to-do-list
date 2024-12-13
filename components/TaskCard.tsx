import { useState } from 'react'
import { Task, Priority } from './types'
import DeleteModal from './DeleteModal'

interface TaskCardProps {
  task: Task
  onUpdateTask: (task: Task) => void
  onDeleteTask: (id: number) => void
}

export default function TaskCard({ task, onUpdateTask, onDeleteTask }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTask, setEditedTask] = useState(task)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

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

  return (
    <>
      <div className={`task-card ${task.completed ? 'opacity-60' : ''}`}>
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
                <h3 className={`text-xl font-medium ${task.completed ? 'line-through text-gray-400' : 'text-white'}`}>
                  {task.title}
                </h3>
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
            <div className="flex justify-end space-x-3 mt-6">
              <button 
                onClick={handleComplete}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                ${task.completed ? 
                  'bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30' : 
                  'bg-green-500/20 text-green-300 hover:bg-green-500/30'}`}
              >
                {task.completed ? '↩️ Obnovit' : '✓ Hotovo'}
              </button>
              <button 
                onClick={handleEdit}
                className="px-4 py-2 rounded-xl bg-blue-500/20 text-blue-300 
                hover:bg-blue-500/30 text-sm font-medium transition-all duration-200"
              >
                ✏️ Upravit
              </button>
              <button 
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl bg-red-500/20 text-red-300 
                hover:bg-red-500/30 text-sm font-medium transition-all duration-200"
              >
                🗑️ Smazat
              </button>
            </div>
          </>
        )}
      </div>

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        taskTitle={task.title}
      />
    </>
  )
}

