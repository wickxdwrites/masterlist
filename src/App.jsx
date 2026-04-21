import { useEffect, useMemo, useState } from 'react'
import './App.css'

const STORAGE_KEY = 'edits-vault-entries-v1'

const CATEGORY_OPTIONS = [
  { key: 'K-pop groups and soloists', label: 'kpop' },
  { key: 'K-Actors and actresses', label: 'kActor' },
  { key: 'Thai pop artists', label: 'thaiPop' },
  { key: 'Thai Actors and Actresses', label: 'thaiActor' },
  { key: 'Chinese Singers and actors/actresses', label: 'cPop' },
  { key: 'Japanese singers and actors/actresses', label: 'jPop' },
]

const categoryKeys = CATEGORY_OPTIONS.map((item) => item.key)

const normalizeEntry = (entry) => {
  const category = categoryKeys.includes(entry.category)
    ? entry.category
    : categoryKeys[0]

  return {
    id: entry.id || crypto.randomUUID(),
    date: entry.date || new Date().toISOString().slice(0, 10),
    name: entry.name || entry.project || '',
    specialty: entry.specialty || entry.file || '',
    category,
    members: entry.members || '',
    isSoloist: Boolean(entry.isSoloist),
    done: Boolean(entry.done),
    notes: entry.notes || '',
    tags: entry.tags || '',
  }
}

function App() {
  const [entries, setEntries] = useState([])
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState(categoryKeys[0])
  const [sortDirection, setSortDirection] = useState('desc')

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return
    }

    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        setEntries(parsed.map(normalizeEntry))
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  }, [entries])

  const filteredEntries = useMemo(() => {
    const searchQuery = search.trim().toLowerCase()

    return entries
      .filter((entry) => {
        if (entry.category !== activeCategory) {
          return false
        }
        if (!searchQuery) {
          return true
        }

        return [
          entry.name,
          entry.specialty,
          entry.members,
          entry.notes,
          entry.tags,
          entry.category,
        ]
          .join(' ')
          .toLowerCase()
          .includes(searchQuery)
      })
      .sort((a, b) => {
        const aTime = new Date(a.date).getTime()
        const bTime = new Date(b.date).getTime()
        return sortDirection === 'desc' ? bTime - aTime : aTime - bTime
      })
  }, [activeCategory, entries, search, sortDirection])

  const toggleDone = (id) => {
    setEntries((current) =>
      current.map((entry) => {
        if (entry.id !== id) {
          return entry
        }
        return {
          ...entry,
          done: !entry.done,
        }
      }),
    )
  }

  const removeEntry = (id) => {
    setEntries((current) => current.filter((entry) => entry.id !== id))
  }

  const exportData = () => {
    const blob = new Blob([JSON.stringify(entries, null, 2)], {
      type: 'application/json',
    })

    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `edits-vault-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(link.href)
  }

  const importData = (event) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || '[]'))
        if (!Array.isArray(parsed)) {
          return
        }
        setEntries(parsed.map(normalizeEntry))
      } catch {
        // Ignore malformed imports to avoid overwriting existing data.
      }
    }

    reader.readAsText(file)
    event.target.value = ''
  }

  return (
    <main className="vault-shell">
      <header className="hero">
        <p className="eyebrow">Master List</p>
        <h1>Entertainment Master List</h1>
        <p>Navigate with tabs and tick off names once edits are complete.</p>
      </header>

      <section className="panel" aria-label="Filter and browse entries">
        <div className="tabs" role="tablist" aria-label="Celebrity categories">
          {CATEGORY_OPTIONS.map((category) => (
            <button
              key={category.key}
              type="button"
              role="tab"
              className={`tab ${activeCategory === category.key ? 'active' : ''}`}
              aria-selected={activeCategory === category.key}
              onClick={() => setActiveCategory(category.key)}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="toolbar">
          <input
            type="search"
            placeholder="Search names, members, notes, tags"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <button
            type="button"
            className="ghost"
            onClick={() =>
              setSortDirection((current) =>
                current === 'desc' ? 'asc' : 'desc',
              )
            }
          >
            Sort: {sortDirection === 'desc' ? 'Newest' : 'Oldest'}
          </button>

          <button type="button" className="ghost" onClick={exportData}>
            Export JSON
          </button>

          <label className="import-pill">
            Import JSON
            <input type="file" accept="application/json" onChange={importData} />
          </label>
        </div>

        <div className="category-head">
          <h3>{activeCategory}</h3>
          <span className="category-count">{filteredEntries.length}</span>
        </div>

        <ul className="entry-list">
          {filteredEntries.map((entry) => (
            <li key={entry.id} className={`entry-card ${entry.done ? 'completed' : ''}`}>
              <div className="entry-head">
                <label className="name-check">
                  <input
                    type="checkbox"
                    checked={entry.done}
                    onChange={() => toggleDone(entry.id)}
                  />
                  <strong>{entry.name}</strong>
                </label>
                <span>{entry.date}</span>
              </div>

              {entry.specialty && <p className="file-pill">{entry.specialty}</p>}

              {!entry.isSoloist && entry.members && (
                <details className="member-dropdown">
                  <summary>Members</summary>
                  <ul>
                    {entry.members
                      .split(',')
                      .map((member) => member.trim())
                      .filter(Boolean)
                      .map((member) => (
                        <li key={`${entry.id}-${member}`}>{member}</li>
                      ))}
                  </ul>
                </details>
              )}

              {entry.isSoloist && <p className="solo-pill">Soloist</p>}
              {entry.notes && <p>{entry.notes}</p>}

              <div className="chip-row">
                <span className="chip">{entry.category}</span>
                {entry.tags && <span className="chip">{entry.tags}</span>}
              </div>

              <div className="actions">
                <button
                  type="button"
                  className="danger"
                  onClick={() => removeEntry(entry.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        {filteredEntries.length === 0 && (
          <p className="empty-state">No entries match your current filters.</p>
        )}
      </section>
    </main>
  )
}

export default App
