interface DeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  taskTitle: string
  isBulkDelete?: boolean
}

export default function DeleteModal({ isOpen, onClose, onConfirm, taskTitle, isBulkDelete }: DeleteModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-gray-900/95 border border-white/20 rounded-2xl p-6 max-w-md w-full space-y-6 animate-fade-in shadow-xl">
        <h2 className="text-xl font-semibold text-white">Smazat {isBulkDelete ? 'úkoly' : 'úkol'}?</h2>
        <p className="text-white/90">
          {isBulkDelete ? (
            'Opravdu chcete smazat všechny dokončené úkoly? Tuto akci nelze vrátit zpět.'
          ) : (
            <>
              Opravdu chcete smazat úkol &ldquo;{taskTitle}&rdquo;?
              <br />
              Tuto akci nelze vrátit zpět.
            </>
          )}
        </p>
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 p-3 rounded-xl bg-white/10 text-white 
            hover:bg-white/20 transition-all duration-200 font-medium
            border border-white/10"
          >
            ↩️ Zrušit
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 p-3 rounded-xl bg-red-500/90 text-white 
            hover:bg-red-500 transition-all duration-200 font-medium
            border border-red-500/20"
          >
            🗑️ Smazat
          </button>
        </div>
      </div>
    </div>
  )
} 