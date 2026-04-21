import { useEffect, useMemo, useState } from 'react'
import './App.css'

const STORAGE_KEY = 'edits-vault-entries-v1'

const defaultForm = {
  date: new Date().toISOString().slice(0, 10),
  project: '',
  file: '',
  category: 'revision',
  status: 'open',
  notes: '',
  tags: '',
}

function App() {
  const [entries, setEntries] = useState([])
  const [form, setForm] = useState(defaultForm)
  const [search, setSearch] = useState('')
  const [projectFilter, setProjectFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortDirection, setSortDirection] = useState('desc')

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return
    }

    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        setEntries(parsed)
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  }, [entries])

  const projects = useMemo(
    () => Array.from(new Set(entries.map((entry) => entry.project))).sort(),
    [entries],
  )

  const filteredEntries = useMemo(() => {
    const searchQuery = search.trim().toLowerCase()

    return entries
      .filter((entry) => {
        if (projectFilter !== 'all' && entry.project !== projectFilter) {
          return false
        }
        if (statusFilter !== 'all' && entry.status !== statusFilter) {
          return false
        }
        if (!searchQuery) {
          return true
        }

        return [entry.project, entry.file, entry.notes, entry.tags]
          .join(' ')
          .toLowerCase()
          .includes(searchQuery)
      })
      .sort((a, b) => {
        const aTime = new Date(a.date).getTime()
        const bTime = new Date(b.date).getTime()
        return sortDirection === 'desc' ? bTime - aTime : aTime - bTime
      })
  }, [entries, projectFilter, search, sortDirection, statusFilter])

  const stats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10)

    return {
      total: entries.length,
      today: entries.filter((entry) => entry.date === today).length,
      open: entries.filter((entry) => entry.status === 'open').length,
      closed: entries.filter((entry) => entry.status === 'closed').length,
    }
  }, [entries])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleAddEntry = (event) => {
    event.preventDefault()

    if (!form.project.trim() || !form.file.trim() || !form.notes.trim()) {
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
      project: form.project.trim(),
      file: form.file.trim(),
      notes: form.notes.trim(),
      tags: normalizedTags,
      createdAt: new Date().toISOString(),
    }

    setEntries((current) => [newEntry, ...current])
    setForm({ ...defaultForm, date: form.date })
  }

  const toggleStatus = (id) => {
    setEntries((current) =>
      current.map((entry) => {
        if (entry.id !== id) {
          return entry
        }

        return {
          ...entry,
          status: entry.status === 'open' ? 'closed' : 'open',
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
        <h1>Edit Vault</h1>
        <p>
          A private, local-first archive for tracking revisions, fixes, and
          editorial notes.
        </p>
      </header>

      <section className="stats-grid" aria-label="Summary">
        <article>
          <h2>Total Entries</h2>
          <p>{stats.total}</p>
        </article>
        <article>
          <h2>Added Today</h2>
          <p>{stats.today}</p>
        </article>
        <article>
          <h2>Open Tasks</h2>
          <p>{stats.open}</p>
        </article>
        <article>
          <h2>Closed Tasks</h2>
          <p>{stats.closed}</p>
        </article>
      </section>

      <section className="panel" aria-label="Create entry">
        <h2>Log New Edit</h2>
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
            Project
            <input
              type="text"
              name="project"
              placeholder="AEHB, blog, client site"
              value={form.project}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            File or Section
            <input
              type="text"
              name="file"
              placeholder="chapter4.js or Intro section"
              value={form.file}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Category
            <select name="category" value={form.category} onChange={handleChange}>
              <option value="revision">Revision</option>
              <option value="proofread">Proofread</option>
              <option value="rewrite">Rewrite</option>
              <option value="metadata">Metadata</option>
            </select>
          </label>
          <label>
            Status
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </label>
          <label className="wide">
            Notes
            <textarea
              name="notes"
              rows="3"
              placeholder="What changed and why?"
              value={form.notes}
              onChange={handleChange}
              required
            />
          </label>
          <label className="wide">
            Tags
            <input
              type="text"
              name="tags"
              placeholder="character arc, pacing, typo"
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
            value={projectFilter}
            onChange={(event) => setProjectFilter(event.target.value)}
          >
            <option value="all">All Projects</option>
            {projects.map((project) => (
              <option key={project} value={project}>
                {project}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
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

        <ul className="entry-list">
          {filteredEntries.map((entry) => (
            <li key={entry.id} className="entry-card">
              <div className="entry-head">
                <strong>{entry.project}</strong>
                <span>{entry.date}</span>
              </div>

              <p className="file-pill">{entry.file}</p>
              <p>{entry.notes}</p>

              <div className="chip-row">
                <span className="chip">{entry.category}</span>
                {entry.tags && <span className="chip">{entry.tags}</span>}
                <span className={`chip ${entry.status}`}>{entry.status}</span>
              </div>

              <div className="actions">
                <button type="button" onClick={() => toggleStatus(entry.id)}>
                  Toggle Status
                </button>
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
