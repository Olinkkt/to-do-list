import { SortType } from './types'

interface TaskFilterProps {
  sortBy: SortType
  onSortChange: (sort: SortType) => void
}

export default function TaskFilter({ sortBy, onSortChange }: TaskFilterProps) {
  return (
    <div className="flex flex-row items-center gap-4 bg-gray-900/50 p-4 rounded-3xl border border-white/10 h-full">
      <span className="text-white/80 whitespace-nowrap">Seřadit:</span>
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value as SortType)}
        className="modern-select !py-2 rounded-2xl flex-1 min-w-0"
      >
        <option value="createdAt">📅 Data vytvoření</option>
        <option value="priority">🎯 Priority</option>
        <option value="custom">🔄 Vlastní pořadí</option>
        <option value="deadline">⏰ Deadline</option>
      </select>
    </div>
  )
} 