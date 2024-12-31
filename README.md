# To-Do List Aplikace

Moderní webová aplikace pro správu úkolů s podporou PWA (Progressive Web App) a pokročilými funkcemi.

## 🚀 Funkce

- ✅ Správa úkolů s prioritami a deadliny
- 📱 PWA - možnost instalace na mobil/desktop
- 🔔 Push notifikace pro deadliny (kromě iOS)
- 🏷️ Štítky a poznámky k úkolům
- 🔍 Vyhledávání v úkolech
- ⚡ Drag & Drop řazení
- 🎨 Moderní responzivní design
- 💾 Offline podpora
- 📋 Podúkoly
- 🔗 Externí odkazy

## 🛠️ Tech Stack

- **Framework:** Next.js 14
- **Styling:** Tailwind CSS
- **PWA:** next-pwa
- **State Management:** React Hooks + Local Storage
- **Drag & Drop:** react-beautiful-dnd
- **Typescript:** Pro typovou bezpečnost
- **Icons:** Heroicons

## 📦 Instalace

```bash
# Naklonování repozitáře
git clone https://github.com/Olinkkt/to-do-list.git
cd to-do-list

# Instalace závislostí
npm install
# nebo
yarn install
# nebo
pnpm install
```

## 🚀 Spuštění

### Vývojové prostředí

```bash
npm run dev
# nebo
yarn dev
# nebo
pnpm dev
```

Aplikace bude dostupná na `http://localhost:3000`

### Produkční build

```bash
# Build aplikace
npm run build
# nebo
yarn build
# nebo
pnpm build

# Spuštění produkční verze
npm start
# nebo
yarn start
# nebo
pnpm start
```

## 📱 PWA Instalace

### Desktop
1. Otevřete aplikaci v Chrome/Edge/prohlížeči podporujícím PWA
2. Klikněte na ikonu instalace v adresním řádku (nebo v menu)
3. Potvrďte instalaci

### Android
1. Otevřete aplikaci v Chrome
2. Klikněte na "Přidat na plochu" v menu prohlížeče
3. Následujte instrukce pro instalaci

### iOS
1. Otevřete aplikaci v Safari
2. Klikněte na tlačítko sdílení
3. Vyberte "Přidat na plochu"
4. Potvrďte přidání

## 🔔 Notifikace

- **Desktop:** Plně podporovány ve všech moderních prohlížečích
- **Android:** Plně podporovány v Chrome a PWA verzi
- **iOS:** Nepodporováno (omezení platformy)

## 💡 Použití

1. **Přidání úkolu:**
   - Klikněte na "Přidat úkol"
   - Vyplňte název, popis, prioritu a případně deadline
   - Můžete přidat štítky, poznámky a odkazy

2. **Správa úkolů:**
   - Označení jako dokončené: checkbox
   - Úprava: tlačítko tužky
   - Smazání: tlačítko koše
   - Přesunutí: drag & drop (v režimu vlastního řazení)

3. **Filtrování a řazení:**
   - Vyhledávání v názvu a popisu
   - Řazení podle priority, data vytvoření, deadlinu nebo vlastní pořadí

4. **Hromadné akce:**
   - Označení všech jako dokončené/nedokončené
   - Smazání dokončených úkolů

## 🤝 Úpravy

Úpravy jsou vítány! Pro větší změny prosím nejdříve otevřete issue k diskuzi.

## 📄 Licence

MIT
