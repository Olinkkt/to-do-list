import { Task, SortType } from './types'
import TaskCard from './TaskCard'

interface TaskListProps {
  tasks: Task[]
  onUpdateTask: (task: Task) => void
  onDeleteTask: (id: number) => void
  sortBy: SortType
  onMoveTask?: (fromIndex: number, toIndex: number) => void
}

export default function TaskList({ tasks, onUpdateTask, onDeleteTask, sortBy, onMoveTask }: TaskListProps) {
  return (
    <div className="space-y-4">
      {tasks.length === 0 ? (
        <p className="text-center text-gray-400">Žádné úkoly k zobrazení. Přidejte nový úkol!</p>
      ) : (
        tasks.map((task, index) => (
          <TaskCard
            key={task.id}
            task={task}
            onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask}
            sortBy={sortBy}
            isFirst={index === 0}
            isLast={index === tasks.length - 1}
            onMoveUp={
              sortBy === 'custom' && index > 0
                ? () => onMoveTask?.(index, index - 1)
                : undefined
            }
            onMoveDown={
              sortBy === 'custom' && index < tasks.length - 1
                ? () => onMoveTask?.(index, index + 1)
                : undefined
            }
          />
        ))
      )}
    </div>
  )
}

