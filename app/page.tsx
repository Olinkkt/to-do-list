'use client'

import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd'
import TaskForm from '../components/TaskForm'
import TaskList from '../components/TaskList'
import { Task } from '../components/types'

// Klíč pro localStorage
const STORAGE_KEY = 'todo-tasks'

// Pomocná funkce pro kontrolu dostupnosti localStorage
const isLocalStorageAvailable = () => {
  try {
    const test = 'test'
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch (e) {
    return false
  }
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isStorageAvailable, setIsStorageAvailable] = useState(false)

  // Kontrola dostupnosti localStorage
  useEffect(() => {
    setIsStorageAvailable(isLocalStorageAvailable())
  }, [])

  // Načtení úkolů při prvním renderování
  useEffect(() => {
    if (!isStorageAvailable) return

    try {
      const savedTasks = localStorage.getItem(STORAGE_KEY)
      console.log('Načtené úkoly:', savedTasks)
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks)
        console.log('Parsované úkoly:', parsedTasks)
        setTasks(parsedTasks)
      }
    } catch (error) {
      console.error('Chyba při načítání úkolů:', error)
    }
  }, [isStorageAvailable])

  // Uložení úkolů při každé změně
  useEffect(() => {
    if (!isStorageAvailable) return

    try {
      console.log('Ukládám úkoly:', tasks)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    } catch (error) {
      console.error('Chyba při ukládání úkolů:', error)
    }
  }, [tasks, isStorageAvailable])

  const addTask = (task: Task) => {
    setTasks(prevTasks => [...prevTasks, { ...task, id: Date.now() }])
  }

  const updateTask = (updatedTask: Task) => {
    setTasks(prevTasks => prevTasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ))
  }

  const deleteTask = (id: number) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id))
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return
    const items = Array.from(tasks)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)
    setTasks(items)
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
          To-Do List
        </h1>
        
        <TaskForm onAddTask={addTask} />

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="tasks">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                <TaskList 
                  tasks={tasks} 
                  onUpdateTask={updateTask} 
                  onDeleteTask={deleteTask} 
                />
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  )
}

