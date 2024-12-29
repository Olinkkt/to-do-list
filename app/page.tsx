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

// Přidáme hash funkci
const hashString = (str: string) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return hash.toString()
}

// Odstraníme starý DEVELOPER_ID a necháme jen hash
const DEVELOPER_HASH = process.env.NEXT_PUBLIC_DEVELOPER_HASH

// Přidáme helper funkci pro kontrolu, jestli jsme na mobilním zařízení
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isStorageAvailable, setIsStorageAvailable] = useState(false)
  const [sortBy, setSortBy] = useState<SortType>('createdAt')
  const [searchQuery, setSearchQuery] = useState('')
  const [customOrder, setCustomOrder] = useState<number[]>([])
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Nastavíme isClient na true po prvním renderu
  useEffect(() => {
    setIsClient(true)
  }, [])

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

  // Požádáme o povolení notifikací při prvním načtení
  useEffect(() => {
    const requestNotifications = async () => {
      if (!('Notification' in window)) return
      
      try {
        // Na iOS nebudeme automaticky žádat o povolení
        if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
          return
        }

        // Pro ostatní zařízení původní logika
        if (Notification.permission === 'granted') {
          setNotificationsEnabled(true)
          return
        }
        
        const notificationState = localStorage.getItem('notification-state')
        if (notificationState === 'asked') return

        const permission = await Notification.requestPermission()
        setNotificationsEnabled(permission === 'granted')
        localStorage.setItem('notification-state', 'asked')
      } catch (error) {
        console.error('Chyba při žádosti o notifikace:', error)
      }
    }

    const timer = setTimeout(requestNotifications, 2000)
    return () => clearTimeout(timer)
  }, [])

  // Kontrola deadlinů a odesílání notifikací
  useEffect(() => {
    if (!notificationsEnabled) return

    // Na iOS nebudeme notifikace vůbec používat
    if (/iPhone|iPad|iPod/.test(navigator.userAgent)) return

    const checkDeadlines = () => {
      const now = Date.now()
      tasks.forEach(task => {
        if (task.deadline && !task.completed) {
          const timeToDeadline = task.deadline - now
          const oneHour = 60 * 60 * 1000
          const oneDay = 24 * oneHour
          const oneWeek = 7 * oneDay

          // Různé typy notifikací podle zbývajícího času
          if (timeToDeadline <= 0 && timeToDeadline > -oneHour) {
            // Právě teď - deadline
            new Notification('⚠️ DEADLINE PRÁVĚ TEĎ!', {
              body: `"${task.title}" - Termín vypršel! Dokončete úkol co nejdříve!`,
              icon: '/icon-192x192.png',
              tag: `deadline-now-${task.id}`,
              requireInteraction: true,
              vibrate: [200, 100, 200] // Výraznější vibrace
            })
          } else if (timeToDeadline > 0 && timeToDeadline <= oneHour) {
            // 1 hodina do deadlinu
            new Notification('🚨 Poslední hodina!', {
              body: `"${task.title}" - Méně než hodina do deadlinu! Rychle to dokončete!`,
              icon: '/icon-192x192.png',
              tag: `deadline-hour-${task.id}`,
              requireInteraction: true,
              vibrate: [100, 50, 100]
            })
          } else if (timeToDeadline > oneHour && timeToDeadline <= oneDay) {
            // 1 den do deadlinu
            new Notification('⏰ Zítra deadline!', {
              body: `"${task.title}" - Deadline je zítra! Nezapomeňte úkol dokončit.`,
              icon: '/icon-192x192.png',
              tag: `deadline-day-${task.id}`,
              requireInteraction: true
            })
          } else if (timeToDeadline > oneDay && timeToDeadline <= oneWeek) {
            // 1 týden do deadlinu
            new Notification('📅 Blíží se deadline', {
              body: `"${task.title}" - Deadline je za týden. Máte ještě čas, ale nezapomeňte na to!`,
              icon: '/icon-192x192.png',
              tag: `deadline-week-${task.id}`
            })
          }
        }
      })
    }

    // Kontrolujeme každou minutu
    const interval = setInterval(checkDeadlines, 60 * 1000)
    
    // Spustíme kontrolu ihned po načtení
    checkDeadlines()

    return () => clearInterval(interval)
  }, [tasks, notificationsEnabled])

  // Funkce pro testování notifikací
  const testNotification = async (type: 'week' | 'day' | 'hour' | 'now') => {
    // Kontrola podpory notifikací
    if (!('Notification' in window)) {
      alert('Váš prohlížeč nepodporuje notifikace')
      return
    }

    // Na mobilních zařízeních nejdřív požádáme o povolení
    if (isMobile() && Notification.permission !== 'granted') {
      try {
        const permission = await Notification.requestPermission()
        if (permission !== 'granted') {
          alert('Pro testování notifikací je potřeba je povolit')
          return
        }
      } catch (error) {
        console.error('Chyba při žádosti o povolení:', error)
        alert('Nepodařilo se získat povolení pro notifikace')
        return
      }
    }

    // Kontrola povolení
    if (Notification.permission !== 'granted') {
      alert('Notifikace nejsou povoleny!')
      return
    }

    // Pokud jsme na iOS, nebudeme dělat nic
    if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
      return
    }

    // Pro ostatní zařízení použijeme standardní notifikace
    const testTask = {
      id: Date.now(),
      title: "Testovací úkol",
      description: "Test notifikace",
      priority: "Střední" as Priority,
      completed: false,
      deadline: Date.now(),
      createdAt: Date.now(),
      tags: [],
      notes: "",
      links: [],
      subTasks: []
    }

    switch(type) {
      case 'week':
        new Notification('📅 Blíží se deadline', {
          body: `"${testTask.title}" - Deadline je za týden. Máte ještě čas, ale nezapomeňte na to!`,
          icon: '/icon-192x192.png',
          tag: `test-week-${testTask.id}`
        })
        break
      case 'day':
        new Notification('⏰ Zítra deadline!', {
          body: `"${testTask.title}" - Deadline je zítra! Nezapomeňte úkol dokončit.`,
          icon: '/icon-192x192.png',
          tag: `test-day-${testTask.id}`,
          requireInteraction: true
        })
        break
      case 'hour':
        new Notification('🚨 Poslední hodina!', {
          body: `"${testTask.title}" - Méně než hodina do deadlinu! Rychle to dokončete!`,
          icon: '/icon-192x192.png',
          tag: `test-hour-${testTask.id}`,
          requireInteraction: true,
          vibrate: [100, 50, 100]
        })
        break
      case 'now':
        new Notification('⚠️ DEADLINE PRÁVĚ TEĎ!', {
          body: `"${testTask.title}" - Termín vypršel! Dokončete úkol co nejdříve!`,
          icon: '/icon-192x192.png',
          tag: `test-now-${testTask.id}`,
          requireInteraction: true,
          vibrate: [200, 100, 200]
        })
        break
    }
  }

  // Zjistíme, jestli je přihlášený vývojář (pouze na klientovi)
  const isDeveloper = isClient && 
    hashString(localStorage.getItem('userId') || '') === DEVELOPER_HASH

  return (
    <div className="min-h-screen py-4 sm:py-8 px-3 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        <h1 
          className="text-3xl sm:text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500"
          onDoubleClick={() => {
            if (!isClient) return
            const id = prompt('ID:')
            if (id) {
              localStorage.setItem('userId', id)
              window.location.reload()
              if (hashString(id) === DEVELOPER_HASH) {
                alert('Vývojářský mód aktivován! Stránka se obnoví.')
              } else {
                alert('Nesprávné ID')
              }
            }
          }}
        >
          To-Do List
        </h1>

        {/* Vývojářská sekce - renderujeme pouze na klientovi */}
        {isClient && isDeveloper && (
          <div className="bg-gray-800/50 p-4 rounded-xl space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-white/60 text-sm">Vývojářské nástroje</p>
              <button
                onClick={() => {
                  localStorage.removeItem('userId')
                  window.location.reload() // Obnovíme stránku pro aktualizaci UI
                }}
                className="px-2 py-1 text-xs bg-red-500/20 text-red-300 rounded-lg 
                hover:bg-red-500/30 flex items-center gap-1"
              >
                <span>Odhlásit</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                  strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                  <path strokeLinecap="round" strokeLinejoin="round" 
                    d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6A2.25 2.25 0 0 1 18.75 5.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                </svg>
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => testNotification('week')}
                className="px-3 py-1 text-sm bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30"
              >
                Test notifikace (týden)
              </button>
              <button
                onClick={() => testNotification('day')}
                className="px-3 py-1 text-sm bg-yellow-500/20 text-yellow-300 rounded-lg hover:bg-yellow-500/30"
              >
                Test notifikace (den)
              </button>
              <button
                onClick={() => testNotification('hour')}
                className="px-3 py-1 text-sm bg-orange-500/20 text-orange-300 rounded-lg hover:bg-orange-500/30"
              >
                Test notifikace (hodina)
              </button>
              <button
                onClick={() => testNotification('now')}
                className="px-3 py-1 text-sm bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30"
              >
                Test notifikace (teď)
              </button>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('notification-state')
                window.location.reload()
              }}
              className="px-3 py-1 text-sm bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30"
            >
              Reset notifikací
            </button>
          </div>
        )}
        
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

