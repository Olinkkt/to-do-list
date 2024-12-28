import { useState, useEffect } from 'react'

interface NotificationPromptProps {
  onPermissionChange: (permission: NotificationPermission) => void
}

export default function NotificationPrompt({ onPermissionChange }: NotificationPromptProps) {
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    // Zkontrolujeme, jestli prohlížeč podporuje notifikace
    if (!('Notification' in window)) return

    // Zobrazíme prompt pouze pokud notifikace nejsou ani povolené ani zakázané
    if (Notification.permission === 'default') {
      setShowPrompt(true)
    }
  }, [])

  const handleRequestPermission = async () => {
    try {
      const permission = await Notification.requestPermission()
      onPermissionChange(permission)
      setShowPrompt(false)
    } catch (error) {
      console.error('Chyba při žádosti o povolení notifikací:', error)
    }
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 
    bg-gray-900/95 border border-white/20 rounded-2xl p-4 shadow-xl animate-fade-in">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 p-2 bg-blue-500/20 rounded-xl">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
            strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-400">
            <path strokeLinecap="round" strokeLinejoin="round" 
              d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
          </svg>
        </div>
        <div className="flex-1 space-y-2">
          <h3 className="font-medium text-white">Povolit oznámení?</h3>
          <p className="text-sm text-white/70">
            Dostávejte upozornění na blížící se deadliny vašich úkolů.
          </p>
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleRequestPermission}
              className="flex-1 px-3 py-2 rounded-xl bg-blue-500/20 text-blue-300 
              hover:bg-blue-500/30 text-sm font-medium transition-all duration-200"
            >
              Povolit
            </button>
            <button
              onClick={() => setShowPrompt(false)}
              className="flex-1 px-3 py-2 rounded-xl bg-gray-800/50 text-gray-300 
              hover:bg-gray-800/70 text-sm font-medium transition-all duration-200"
            >
              Později
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 