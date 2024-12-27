'use client'

import { useState, useEffect, useMemo } from 'react'
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd'
import TaskForm from '../components/TaskForm'
import TaskList from '../components/TaskList'
import { Task, Priority, SortType } from '../components/types'
import TaskFilter from '../components/TaskFilter'
import BulkActions from '../components/BulkActions'
import SearchBar from '../components/SearchBar'

// Klíč pro localStorage
const STORAGE_KEY = 'todo-tasks'

// Pomocná funkce pro kontrolu dostupnosti localStorage
const isLocalStorageAvailable = () => {
  try {
    const test = 'test'
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch (_) {
    return false
  }
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isStorageAvailable, setIsStorageAvailable] = useState(false)
  const [sortBy, setSortBy] = useState<SortType>('createdAt')
  const [searchQuery, setSearchQuery] = useState('')
  const [customOrder, setCustomOrder] = useState<number[]>([])

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

  // Při načtení úkolů nastavíme výchozí vlastní pořadí
  useEffect(() => {
    if (tasks.length > 0) {
      setCustomOrder(tasks.map(task => task.id!))
    }
  }, [tasks])

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

    if (sortBy === 'custom') {
      // Aktualizujeme vlastní pořadí
      const items = Array.from(customOrder)
      const [reorderedItem] = items.splice(result.source.index, 1)
      items.splice(result.destination.index, 0, reorderedItem)
      setCustomOrder(items)

      // Aktualizujeme také pole úkolů, aby se zachovalo vizuální pořadí
      const taskItems = Array.from(tasks)
      const [reorderedTask] = taskItems.splice(result.source.index, 1)
      taskItems.splice(result.destination.index, 0, reorderedTask)
      setTasks(taskItems)
    }
  }

  // Pomocná funkce pro určení váhy priority
  const getPriorityWeight = (priority: Priority): number => {
    switch (priority) {
      case 'Vysoká': return 3
      case 'Střední': return 2
      case 'Nízká': return 1
    }
  }

  // Pomocné výpočty pro bulk actions
  const hasCompletedTasks = useMemo(() => 
    tasks.some(task => task.completed), [tasks]
  )
  
  const allTasksCompleted = useMemo(() => 
    tasks.length > 0 && tasks.every(task => task.completed), [tasks]
  )

  // Hromadné akce
  const handleDeleteCompleted = () => {
    setTasks(prevTasks => prevTasks.filter(task => !task.completed))
  }

  const handleToggleAll = () => {
    setTasks(prevTasks => prevTasks.map(task => ({
      ...task,
      completed: !allTasksCompleted
    })))
  }

  // Filtrované a seřazené úkoly
  const filteredAndSortedTasks = useMemo(() => {
    // Nejdřív filtrujeme podle vyhledávání
    const filteredTasks = tasks.filter(task => {
      const searchLower = searchQuery.toLowerCase()
      return (
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower)
      )
    })

    // Pak seřadíme podle vybraného způsobu
    if (sortBy === 'priority') {
      return filteredTasks.sort((a, b) => {
        const priorityDiff = getPriorityWeight(b.priority) - getPriorityWeight(a.priority)
        if (priorityDiff === 0) {
          return b.createdAt - a.createdAt
        }
        return priorityDiff
      })
    } else if (sortBy === 'createdAt') {
      return filteredTasks.sort((a, b) => b.createdAt - a.createdAt)
    } else if (sortBy === 'deadline') {
      // Úkoly bez deadline řadíme na konec
      return filteredTasks.sort((a, b) => {
        if (!a.deadline && !b.deadline) return b.createdAt - a.createdAt
        if (!a.deadline) return 1
        if (!b.deadline) return -1
        return a.deadline - b.deadline
      })
    } else {
      // Pro vlastní řazení použijeme pořadí z customOrder
      return filteredTasks.sort((a, b) => {
        const indexA = customOrder.indexOf(a.id!)
        const indexB = customOrder.indexOf(b.id!)
        return indexA - indexB
      })
    }
  }, [tasks, sortBy, searchQuery, customOrder])

  // Přidáme ukládání vlastního pořadí do localStorage
  useEffect(() => {
    if (!isStorageAvailable) return
    try {
      localStorage.setItem('todo-custom-order', JSON.stringify(customOrder))
    } catch (error) {
      console.error('Chyba při ukládání vlastního pořadí:', error)
    }
  }, [customOrder, isStorageAvailable])

  // Načteme vlastní pořadí při startu
  useEffect(() => {
    if (!isStorageAvailable) return
    try {
      const savedOrder = localStorage.getItem('todo-custom-order')
      if (savedOrder) {
        setCustomOrder(JSON.parse(savedOrder))
      }
    } catch (error) {
      console.error('Chyba při načítání vlastního pořadí:', error)
    }
  }, [isStorageAvailable])

  const handleMoveTask = (fromIndex: number, toIndex: number) => {
    // Aktualizujeme pole úkolů
    const newTasks = Array.from(tasks)
    const [movedTask] = newTasks.splice(fromIndex, 1)
    newTasks.splice(toIndex, 0, movedTask)
    setTasks(newTasks)

    // Aktualizujeme vlastní pořadí
    const newOrder = Array.from(customOrder)
    const [movedId] = newOrder.splice(fromIndex, 1)
    newOrder.splice(toIndex, 0, movedId)
    setCustomOrder(newOrder)
  }

  const handleSortChange = (newSort: SortType) => {
    setSortBy(newSort)
  }

  return (
    <div className="min-h-screen py-4 sm:py-8 px-3 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
          To-Do List
        </h1>
        
        <TaskForm onAddTask={addTask} />

        <div className="space-y-4">
          <SearchBar 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TaskFilter 
              sortBy={sortBy} 
              onSortChange={handleSortChange}
            />
            <BulkActions
              onDeleteCompleted={handleDeleteCompleted}
              onToggleAll={handleToggleAll}
              hasCompletedTasks={hasCompletedTasks}
              allTasksCompleted={allTasksCompleted}
            />
          </div>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="tasks">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                <TaskList 
                  tasks={filteredAndSortedTasks}
                  onUpdateTask={updateTask} 
                  onDeleteTask={deleteTask} 
                  sortBy={sortBy}
                  onMoveTask={handleMoveTask}
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

