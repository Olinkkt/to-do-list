interface SearchBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export default function SearchBar({ searchQuery, onSearchChange }: SearchBarProps) {
  return (
    <div className="bg-gray-900/50 p-4 rounded-3xl border border-white/10">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="🔍 Vyhledat v úkolech..."
        className="modern-input rounded-2xl"
      />
    </div>
  )
} 