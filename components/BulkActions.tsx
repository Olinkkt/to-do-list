import { useState } from 'react'
import DeleteModal from './DeleteModal'

interface BulkActionsProps {
  onDeleteCompleted: () => void
  onToggleAll: () => void
  hasCompletedTasks: boolean
  allTasksCompleted: boolean
}

export default function BulkActions({ 
  onDeleteCompleted, 
  onToggleAll, 
  hasCompletedTasks,
  allTasksCompleted 
}: BulkActionsProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleDeleteClick = () => {
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = () => {
    onDeleteCompleted()
    setShowDeleteModal(false)
  }

  return (
    <>
      <div className="flex flex-row gap-4 bg-gray-900/50 p-4 rounded-3xl border border-white/10 h-full">
        <button
          onClick={onToggleAll}
          className="w-1/2 px-4 py-2 rounded-2xl bg-blue-500/20 text-blue-300 
          hover:bg-blue-500/30 text-sm font-medium transition-all duration-200
          flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <span className="hidden sm:inline">
            {allTasksCompleted ? '↩️ Zrušit označení' : '✓ Označit vše jako hotové'}
          </span>
          <span className="sm:hidden">
            {allTasksCompleted ? '↩️ Zrušit' : '✓ Označit vše'}
          </span>
        </button>
        <button
          onClick={handleDeleteClick}
          disabled={!hasCompletedTasks}
          className="w-1/2 px-4 py-2 rounded-2xl bg-red-500/20 text-red-300 
          hover:bg-red-500/30 text-sm font-medium transition-all duration-200
          flex items-center justify-center gap-2 whitespace-nowrap
          disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="hidden sm:inline">🗑️ Smazat dokončené</span>
          <span className="sm:hidden">🗑️ Smazat</span>
        </button>
      </div>

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        taskTitle=""
        isBulkDelete={true}
      />
    </>
  )
} 