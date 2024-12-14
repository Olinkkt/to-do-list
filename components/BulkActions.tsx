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
  return (
    <div className="flex-1 flex gap-4 bg-gray-900/50 p-4 rounded-3xl border border-white/10">
      <button
        onClick={onToggleAll}
        className="flex-1 px-4 py-2 rounded-2xl bg-blue-500/20 text-blue-300 
        hover:bg-blue-500/30 text-sm font-medium transition-all duration-200"
      >
        {allTasksCompleted ? '↩️ Označit vše jako nedokončené' : '✓ Označit vše jako dokončené'}
      </button>
      <button
        onClick={onDeleteCompleted}
        disabled={!hasCompletedTasks}
        className="flex-1 px-4 py-2 rounded-2xl bg-red-500/20 text-red-300 
        hover:bg-red-500/30 text-sm font-medium transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed"
      >
        🗑️ Smazat dokončené
      </button>
    </div>
  )
} 