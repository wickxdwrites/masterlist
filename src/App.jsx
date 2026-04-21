import { useEffect, useMemo, useState } from 'react'
import './App.css'

const STORAGE_KEY = 'edits-vault-entries-v1'

const CATEGORY_OPTIONS = [
  'K-pop groups and soloists',
  'K-Actors and actresses',
  'Thai pop artists',
  'Thai Actors and Actresses',
  'Chinese Singers and actors/actresses',
  'Japanese singers and actors/actresses',
]

const defaultForm = {
  date: new Date().toISOString().slice(0, 10),
  name: '',
  specialty: '',
  category: CATEGORY_OPTIONS[0],
  notes: '',
  tags: '',
}

const normalizeEntry = (entry) => {
  const category = CATEGORY_OPTIONS.includes(entry.category)
    ? entry.category
    : CATEGORY_OPTIONS[0]

  return {
    id: entry.id || crypto.randomUUID(),
    date: entry.date || new Date().toISOString().slice(0, 10),
    name: entry.name || entry.project || '',
    specialty: entry.specialty || entry.file || '',
    category,
    notes: entry.notes || '',
    tags: entry.tags || '',
  }
}

function App() {
  const [entries, setEntries] = useState([])
  const [form, setForm] = useState(defaultForm)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
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
        if (categoryFilter !== 'all' && entry.category !== categoryFilter) {
          return false
        }
        if (!searchQuery) {
          return true
        }

        return [entry.name, entry.specialty, entry.notes, entry.tags, entry.category]
          .join(' ')
          .toLowerCase()
          .includes(searchQuery)
      })
      .sort((a, b) => {
        const aTime = new Date(a.date).getTime()
        const bTime = new Date(b.date).getTime()
        return sortDirection === 'desc' ? bTime - aTime : aTime - bTime
      })
  }, [categoryFilter, entries, search, sortDirection])

  const groupedEntries = useMemo(() => {
    const grouped = Object.fromEntries(CATEGORY_OPTIONS.map((name) => [name, []]))
    filteredEntries.forEach((entry) => {
      grouped[entry.category].push(entry)
    })
    return grouped
  }, [filteredEntries])

  const stats = useMemo(() => {
    const filledCategories = CATEGORY_OPTIONS.filter(
      (category) => entries.filter((entry) => entry.category === category).length > 0,
    ).length

    let topCategory = 'None yet'
    let topCount = 0
    CATEGORY_OPTIONS.forEach((category) => {
      const count = entries.filter((entry) => entry.category === category).length
      if (count > topCount) {
        topCount = count
        topCategory = category
      }
    })

    return {
      total: entries.length,
      categories: CATEGORY_OPTIONS.length,
      filledCategories,
      topCategory,
      topCount,
    }
  }, [entries])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleAddEntry = (event) => {
    event.preventDefault()

    if (!form.name.trim()) {
      return
    }

    const normalizedTags = form.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
      .join(', ')

    const newEntry = {
      id: crypto.randomUUID(),
      ...form,
      name: form.name.trim(),
      specialty: form.specialty.trim(),
      notes: form.notes.trim(),
      tags: normalizedTags,
    }

    setEntries((current) => [newEntry, ...current])
    setForm({ ...defaultForm, date: form.date })
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
        setEntries(parsed)
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
        <p className="eyebrow">Standalone Personal Site</p>
        <h1>Entertainment Master List</h1>
        <p>
          A category-first database for artists, singers, actors, and actresses.
        </p>
      </header>

      <section className="stats-grid" aria-label="Summary">
        <article>
          <h2>Total Profiles</h2>
          <p>{stats.total}</p>
        </article>
        <article>
          <h2>Categories Used</h2>
          <p>{stats.filledCategories}</p>
        </article>
        <article>
          <h2>Category Slots</h2>
          <p>{stats.categories}</p>
        </article>
        <article>
          <h2>Largest Category</h2>
          <p>{stats.topCount}</p>
        </article>
      </section>

      <section className="panel" aria-label="Create entry">
        <h2>Add New Person or Group</h2>
        <form className="entry-form" onSubmit={handleAddEntry}>
          <label>
            Date
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
            />
          </label>
          <label>
            Name
            <input
              type="text"
              name="name"
              placeholder="e.g. IU, NCT, Kim Soo-hyun"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Specialty
            <input
              type="text"
              name="specialty"
              placeholder="Singer, actor, group, actress"
              value={form.specialty}
              onChange={handleChange}
            />
          </label>
          <label>
            Category
            <select name="category" value={form.category} onChange={handleChange}>
              {CATEGORY_OPTIONS.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
          <label className="wide">
            Notes
            <textarea
              name="notes"
              rows="3"
              placeholder="Any details you want to keep for this entry"
              value={form.notes}
              onChange={handleChange}
            />
          </label>
          <label className="wide">
            Tags
            <input
              type="text"
              name="tags"
              placeholder="comma separated: OST, drama, bias, variety"
              value={form.tags}
              onChange={handleChange}
            />
          </label>
          <button type="submit">Add Entry</button>
        </form>
      </section>

      <section className="panel" aria-label="Filter and browse entries">
        <div className="toolbar">
          <input
            type="search"
            placeholder="Search notes, files, tags"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
          >
            <option value="all">All Categories</option>
            {CATEGORY_OPTIONS.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

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

        <div className="category-sections">
          {CATEGORY_OPTIONS.map((category) => {
            const categoryEntries = groupedEntries[category]
            if (categoryEntries.length === 0) {
              return null
            }

            return (
              <section key={category} className="category-block">
                <div className="category-head">
                  <h3>{category}</h3>
                  <span className="category-count">{categoryEntries.length}</span>
                </div>

                <ul className="entry-list">
                  {categoryEntries.map((entry) => (
                    <li key={entry.id} className="entry-card">
                      <div className="entry-head">
                        <strong>{entry.name}</strong>
                        <span>{entry.date}</span>
                      </div>

                      {entry.specialty && <p className="file-pill">{entry.specialty}</p>}
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
              </section>
            )
          })}
        </div>

        {filteredEntries.length === 0 && (
          <p className="empty-state">No entries match your current filters.</p>
        )}
      </section>
    </main>
  )
}

export default App
