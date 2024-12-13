import { Task } from './types'
import TaskCard from './TaskCard'
import { Draggable, DraggableProvided } from 'react-beautiful-dnd'

interface TaskListProps {
  tasks: Task[]
  onUpdateTask: (task: Task) => void
  onDeleteTask: (id: number) => void
}

export default function TaskList({ tasks, onUpdateTask, onDeleteTask }: TaskListProps) {
  return (
    <div className="space-y-4">
      {tasks.length === 0 ? (
        <p className="text-center text-gray-400">Žádné úkoly k zobrazení. Přidejte nový úkol!</p>
      ) : (
        tasks.map((task, index) => (
          <Draggable key={task.id} draggableId={task.id!.toString()} index={index}>
            {(provided: DraggableProvided) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
              >
                <TaskCard
                  task={task}
                  onUpdateTask={onUpdateTask}
                  onDeleteTask={onDeleteTask}
                />
              </div>
            )}
          </Draggable>
        ))
      )}
    </div>
  )
}

