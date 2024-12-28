const hashString = (str: string) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return hash.toString()
}

const id = process.argv[2]
if (!id) {
  console.log('Použití: ts-node generate-hash.ts <tvoje-id>')
  process.exit(1)
}

console.log(`Hash pro ID '${id}':`, hashString(id)) 