import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { KPOP_MASTERLIST_ENTRIES } from './data/kpopMasterlist'
import { KACTORS_MASTERLIST_ENTRIES } from './data/kActorsMasterlist'
import { TPOP_MASTERLIST_ENTRIES } from './data/tpopMasterlist'
import { TACTORS_MASTERLIST_ENTRIES } from './data/tActorsMasterlist'
import { CPOP_MASTERLIST_ENTRIES } from './data/cpopMasterlist'
import { CACTORS_MASTERLIST_ENTRIES } from './data/cActorsMasterlist'
import { JPOP_MASTERLIST_ENTRIES } from './data/jpopMasterlist'
import { JACTORS_MASTERLIST_ENTRIES } from './data/jActorsMasterlist'
import { SHARED_LIST_ID, supabase } from './lib/supabaseClient'

const STORAGE_KEY = 'edits-vault-entries-v1'
const ALL_SPECIALTIES = 'All labels'
const SEEDED_MASTERLIST_ENTRIES = [
  ...KPOP_MASTERLIST_ENTRIES,
  ...KACTORS_MASTERLIST_ENTRIES,
  ...TPOP_MASTERLIST_ENTRIES,
  ...TACTORS_MASTERLIST_ENTRIES,
  ...CPOP_MASTERLIST_ENTRIES,
  ...CACTORS_MASTERLIST_ENTRIES,
  ...JPOP_MASTERLIST_ENTRIES,
  ...JACTORS_MASTERLIST_ENTRIES,
]

const CATEGORY_OPTIONS = [
  { key: 'K-pop groups and soloists', label: 'K-pop' },
  { key: 'K-Actors and actresses', label: 'K-actors' },
  { key: 'Thai singers', label: 'T-pop' },
  { key: 'Thai Actors and Actresses', label: 'T-actors' },
  { key: 'Chinese singers', label: 'C-pop' },
  { key: 'Chinese Actors and Actresses', label: 'C-actors' },
  { key: 'Japanese singers', label: 'J-Music' },
  { key: 'Japanese Actors and Actresses', label: 'J-actors' },
]

const categoryKeys = CATEGORY_OPTIONS.map((item) => item.key)

const CATEGORY_SPECIALTIES = {
  'K-pop groups and soloists': ['Boy Group', 'Girl Group', 'Band', 'Co-ed / Duo', 'Soloist'],
  'K-Actors and actresses': ['Actor', 'Actress', 'Model'],
  'Thai singers': ['Group', 'Soloist'],
  'Thai Actors and Actresses': ['Actor', 'Actress', 'Model'],
  'Chinese singers': ['Group', 'Soloist'],
  'Chinese Actors and Actresses': ['Actor', 'Actress', 'Model'],
  'Japanese singers': ['Group', 'Band', 'Soloist'],
  'Japanese Actors and Actresses': ['Actor', 'Actress', 'Model'],
}

const SOLO_SPECIALTIES = new Set(['Soloist', 'Actor', 'Actress'])

const looksActingProfile = (entry) => {
  const combinedText = [entry.specialty, entry.notes, entry.tags]
    .join(' ')
    .toLowerCase()

  return /(actor|actress|drama|movie|film|series|show)/.test(combinedText)
}

const mapLegacyCategory = (entry) => {
  if (entry.category === 'Thai pop artists') {
    return 'Thai singers'
  }

  if (entry.category === 'Chinese Singers and actors/actresses') {
    return looksActingProfile(entry)
      ? 'Chinese Actors and Actresses'
      : 'Chinese singers'
  }

  if (entry.category === 'Japanese singers and actors/actresses') {
    return looksActingProfile(entry)
      ? 'Japanese Actors and Actresses'
      : 'Japanese singers'
  }

  return entry.category
}

const normalizeEntry = (entry) => {
  const categoryCandidate = mapLegacyCategory(entry)
  const category = categoryKeys.includes(categoryCandidate)
    ? categoryCandidate
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
    editImages: Array.isArray(entry.editImages) ? entry.editImages : [],
  }
}

const toSafeFileName = (value) =>
  String(value || 'image')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'image'

const specialtyPillClass = (specialty) => {
  const s = (specialty || '').toLowerCase().replace(/[^a-z]/g, '')
  if (s === 'actor')    return 'file-pill file-pill-actor'
  if (s === 'actress')  return 'file-pill file-pill-actress'
  if (s === 'soloist')  return 'file-pill file-pill-soloist'
  if (s === 'band')     return 'file-pill file-pill-band'
  if (s === 'model')    return 'file-pill file-pill-model'
  if (s.includes('boygroup') || s === 'boygroup') return 'file-pill file-pill-boygroup'
  if (s.includes('girlgroup') || s === 'girlgroup') return 'file-pill file-pill-girlgroup'
  if (s.includes('coed') || s.includes('duo')) return 'file-pill file-pill-coed'
  if (s === 'group')    return 'file-pill file-pill-group'
  return 'file-pill file-pill-default'
}

const getImageExtension = (dataUrl) => {
  const mimeMatch = /^data:(image\/[a-zA-Z0-9+.-]+);base64,/.exec(dataUrl)
  const mimeType = mimeMatch?.[1] || ''

  if (mimeType.includes('png')) return 'png'
  if (mimeType.includes('jpeg') || mimeType.includes('jpg')) return 'jpg'
  if (mimeType.includes('webp')) return 'webp'
  if (mimeType.includes('gif')) return 'gif'

  return 'img'
}

// Safe localStorage setter that handles quota exceeded errors
const setLocalStorageSafe = (key, value) => {
  try {
    window.localStorage.setItem(key, value)
    return true
  } catch (err) {
    if (err && err.name === 'QuotaExceededError') {
      // Do not throw — caller should handle fallback behavior
      return false
    }
    throw err
  }
}

// Upload a File object to Supabase Storage and return a public URL (or error)
const uploadFileToSupabase = async (file, entryId) => {
  if (!supabase) return { error: new Error('No supabase client') }

  const ext = (file.name || '').split('.').pop() || 'jpg'
  const filename = `${toSafeFileName(file.name || entryId)}-${Date.now()}.${ext}`
  const path = `entries/${entryId}/${filename}`

  const { data: uploadData, error: uploadError } = await supabase.storage.from('entry-photos').upload(path, file)
  console.log('Supabase upload result', { path, uploadData, uploadError })
  if (uploadError) return { error: uploadError }

  // Try to get a public URL
  try {
    const publicRes = await supabase.storage.from('entry-photos').getPublicUrl(path)
    const pub = publicRes?.data?.publicUrl || publicRes?.publicUrl
    if (pub) return { url: pub }
  } catch (e) {
    console.warn('getPublicUrl failed', e)
  }

  // Fallback: create a signed URL (works for private buckets)
  try {
    const signed = await supabase.storage.from('entry-photos').createSignedUrl(path, 60 * 60)
    const signedUrl = signed?.data?.signedUrl || signed?.data?.signedURL || signed?.signedUrl
    if (signedUrl) return { url: signedUrl }
  } catch (e) {
    console.warn('createSignedUrl failed', e)
  }

  return { error: new Error('Unable to obtain URL for uploaded file') }
}

const dataUrlToFile = (dataUrl, filename) => {
  try {
    const arr = dataUrl.split(',')
    const mimeMatch = /^data:([^;]+);base64/.exec(arr[0])
    const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg'
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, { type: mime })
  } catch (err) {
    return null
  }
}

const migrateLocalBase64Images = async (entriesArray) => {
  if (!supabase) return entriesArray

  let changed = false
  const results = await Promise.all(entriesArray.map(async (entry) => {
    if (!entry.editImages || !Array.isArray(entry.editImages)) return entry

    const newImages = await Promise.all(entry.editImages.map(async (img, idx) => {
      if (typeof img === 'string' && img.startsWith('data:')) {
        const ext = getImageExtension(img)
        const filename = `${toSafeFileName(entry.name)}-migrated-${idx + 1}.${ext}`
        const file = dataUrlToFile(img, filename)
        if (!file) return null
        const { url, error } = await uploadFileToSupabase(file, entry.id)
        if (error || !url) return null
        changed = true
        return url
      }
      return img
    }))

    return {
      ...entry,
      editImages: newImages.filter(Boolean),
    }
  }))

  if (changed) {
    try {
      setLocalStorageSafe(STORAGE_KEY, JSON.stringify(results))
    } catch {}
  }

  return results
}

const mergeMasterlists = (currentEntries) => {
  const currentKeys = new Set(
    currentEntries.map((entry) => `${entry.category}::${entry.name.toLowerCase()}`),
  )

  const missingMasterEntries = SEEDED_MASTERLIST_ENTRIES.map(normalizeEntry).filter(
    (entry) => !currentKeys.has(`${entry.category}::${entry.name.toLowerCase()}`),
  )

  return [...currentEntries, ...missingMasterEntries]
}

const mergeUniqueEntries = (...entryLists) => {
  const merged = new Map()

  entryLists.flat().forEach((entry) => {
    const normalized = normalizeEntry(entry)
    const key = `${normalized.category}::${normalized.name.toLowerCase()}`
    merged.set(key, normalized)
  })

  return Array.from(merged.values())
}

function App() {
  const [entries, setEntries] = useState([])
  const [hasHydrated, setHasHydrated] = useState(false)
  const [isCloudEnabled] = useState(Boolean(supabase))
  const [syncMode, setSyncMode] = useState(Boolean(supabase) ? 'checking' : 'local')
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState(categoryKeys[0])
  const [sortDirection, setSortDirection] = useState('desc')
  const [specialtyFilter, setSpecialtyFilter] = useState(ALL_SPECIALTIES)
  const [visibleImageSections, setVisibleImageSections] = useState({})
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [newForm, setNewForm] = useState({
    name: '',
    category: categoryKeys[0],
    specialty: CATEGORY_SPECIALTIES[categoryKeys[0]][0],
  })

  useEffect(() => {
    const readLocalEntries = () => {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) return null

      try {
        const parsed = JSON.parse(raw)
        return Array.isArray(parsed) ? parsed.map(normalizeEntry) : null
      } catch {
        window.localStorage.removeItem(STORAGE_KEY)
        return null
      }
    }

    const hydrateFromLocal = () => {
      const localEntries = readLocalEntries()
      if (!localEntries) {
        setEntries(SEEDED_MASTERLIST_ENTRIES.map(normalizeEntry))
        setHasHydrated(true)
        setSyncMode('local')
        return
      }

      const merged = mergeMasterlists(localEntries)
      setEntries(merged)

      // If cloud is available, try migrating any base64 images to Supabase storage
      if (supabase) {
        migrateLocalBase64Images(merged).then((updated) => {
          if (Array.isArray(updated)) {
            setEntries(updated)
            setLocalStorageSafe(STORAGE_KEY, JSON.stringify(updated))
          }
        })
      }

      setHasHydrated(true)
      setSyncMode('local')
    }

    if (!supabase) {
      hydrateFromLocal()
      return
    }

    let isMounted = true

    const hydrateFromCloud = async () => {
      const { data, error } = await supabase
        .from('shared_lists')
        .select('entries')
        .eq('list_id', SHARED_LIST_ID)
        .maybeSingle()

      if (error) {
        hydrateFromLocal()
        return
      }

      if (data?.entries && Array.isArray(data.entries)) {
        const localEntries = readLocalEntries() || []
        const merged = mergeMasterlists(
          mergeUniqueEntries(data.entries, localEntries),
        )
        if (isMounted) {
          setEntries(merged)
          setLocalStorageSafe(STORAGE_KEY, JSON.stringify(merged))
          setHasHydrated(true)
          setSyncMode('cloud')

          // Migrate any embedded base64 images from local entries into Supabase storage
          migrateLocalBase64Images(merged).then((updated) => {
            if (Array.isArray(updated)) {
              setEntries(updated)
              setLocalStorageSafe(STORAGE_KEY, JSON.stringify(updated))
              // also push the cleaned entries to cloud
              supabase.from('shared_lists').upsert({ list_id: SHARED_LIST_ID, entries: updated }, { onConflict: 'list_id' })
            }
          })
        }
        return
      }

      const seeded = SEEDED_MASTERLIST_ENTRIES.map(normalizeEntry)
      const { error: upsertError } = await supabase.from('shared_lists').upsert(
        { list_id: SHARED_LIST_ID, entries: seeded },
        { onConflict: 'list_id' },
      )

      if (upsertError) {
        hydrateFromLocal()
        return
      }

        if (isMounted) {
        setEntries(seeded)
        setLocalStorageSafe(STORAGE_KEY, JSON.stringify(seeded))
        setHasHydrated(true)
        setSyncMode('cloud')
      }
    }

    hydrateFromCloud()

    const channel = supabase
      .channel(`shared-list-${SHARED_LIST_ID}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'shared_lists',
          filter: `list_id=eq.${SHARED_LIST_ID}`,
        },
        (payload) => {
          const cloudEntries = payload.new?.entries
          if (!Array.isArray(cloudEntries)) return

          const normalized = mergeMasterlists(cloudEntries.map(normalizeEntry))
          setEntries(normalized)
          setLocalStorageSafe(STORAGE_KEY, JSON.stringify(normalized))
        },
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setSyncMode('cloud')
        }
      })

    return () => {
      isMounted = false
      supabase.removeChannel(channel)
    }
  }, [])

  useEffect(() => {
    if (!hasHydrated) return

    const serialized = JSON.stringify(entries)
    const ok = setLocalStorageSafe(STORAGE_KEY, serialized)
    if (!ok) {
      // attempt to remove large base64 data URLs from entries and persist a cleaned copy
      const cleaned = entries.map((e) => ({
        ...e,
        editImages: (e.editImages || []).filter((img) => !String(img).startsWith('data:')),
      }))
      try {
        setLocalStorageSafe(STORAGE_KEY, JSON.stringify(cleaned))
      } catch {
        // ignore if still failing
      }
      setEntries(cleaned)
      // Inform the user that local storage couldn't hold images
      alert('Local storage quota exceeded — large images were removed from local storage. Enable cloud sync to store photos.')
    }

    if (!supabase) return

    supabase
      .from('shared_lists')
      .upsert(
        { list_id: SHARED_LIST_ID, entries },
        { onConflict: 'list_id' },
      )
      .then(({ error }) => {
        if (error) {
          setSyncMode('local')
          return
        }

        setSyncMode('cloud')
      })
  }, [entries, hasHydrated])

  const specialtyOptions = useMemo(() => {
    const options = Array.from(
      new Set(
        entries
          .filter((entry) => entry.category === activeCategory)
          .map((entry) => entry.specialty)
          .filter(Boolean),
      ),
    )

    return [ALL_SPECIALTIES, ...options]
  }, [activeCategory, entries])

  useEffect(() => {
    if (
      specialtyFilter !== ALL_SPECIALTIES &&
      !specialtyOptions.includes(specialtyFilter)
    ) {
      setSpecialtyFilter(ALL_SPECIALTIES)
    }
  }, [specialtyFilter, specialtyOptions])

  const filteredEntries = useMemo(() => {
    const searchQuery = search.trim().toLowerCase()

    return entries
      .filter((entry) => {
        if (entry.category !== activeCategory) {
          return false
        }

        if (
          specialtyFilter !== ALL_SPECIALTIES &&
          entry.specialty !== specialtyFilter
        ) {
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
  }, [activeCategory, entries, search, sortDirection, specialtyFilter])

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

  const addImagesToEntry = (id, imageDataUrls) => {
    if (imageDataUrls.length === 0) {
      return
    }

    setEntries((current) =>
      current.map((entry) => {
        if (entry.id !== id) {
          return entry
        }

        return {
          ...entry,
          editImages: [...(entry.editImages || []), ...imageDataUrls],
        }
      }),
    )
  }

  const uploadEditImages = async (id, event) => {
    const files = Array.from(event.target.files || [])
    if (files.length === 0) return

    if (supabase) {
      // Upload each file to Supabase Storage and add returned public URLs
      const uploads = await Promise.all(files.map((file) => uploadFileToSupabase(file, id)))
      const urls = uploads.map((r) => r?.url).filter(Boolean)
      if (urls.length > 0) {
        addImagesToEntry(id, urls)
      }
    } else {
      // Local-only fallback: avoid storing very large files in localStorage
      const MAX_LOCAL_FILE_BYTES = 500 * 1024 // 500KB
      const allowed = files.filter((f) => f.size <= MAX_LOCAL_FILE_BYTES)
      const rejectedCount = files.length - allowed.length
      if (rejectedCount > 0) {
        alert(`${rejectedCount} file(s) too large for local storage. Use smaller images or enable cloud sync.`)
      }

      try {
        const images = await Promise.all(
          allowed.map(
            (file) =>
              new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.onload = () => resolve(String(reader.result || ''))
                reader.onerror = () => reject(new Error('Failed to read file'))
                reader.readAsDataURL(file)
              }),
          ),
        )
        addImagesToEntry(id, images.filter(Boolean))
      } catch {
        // ignore errors reading files
      }
    }

    event.target.value = ''
  }

  const deleteImageFromEntry = (id, imageIndex) => {
    const confirmed = window.confirm('Are you sure you want to delete this photo')
    if (!confirmed) {
      return
    }

    setEntries((current) =>
      current.map((entry) => {
        if (entry.id !== id) {
          return entry
        }

        return {
          ...entry,
          editImages: (entry.editImages || []).filter((_, index) => index !== imageIndex),
        }
      }),
    )
  }

  const openAddModal = () => {
    setNewForm({
      name: '',
      category: activeCategory,
      specialty: CATEGORY_SPECIALTIES[activeCategory][0],
    })
    setAddModalOpen(true)
  }

  const closeAddModal = () => setAddModalOpen(false)

  const handleFormCategoryChange = (category) => {
    setNewForm((f) => ({
      ...f,
      category,
      specialty: CATEGORY_SPECIALTIES[category][0],
    }))
  }

  const submitNewEntry = (event) => {
    event.preventDefault()
    const trimmedName = newForm.name.trim()
    if (!trimmedName) return
    const isDupe = entries.some(
      (e) =>
        e.category === newForm.category &&
        e.name.toLowerCase() === trimmedName.toLowerCase(),
    )
    if (isDupe) {
      alert(`"${trimmedName}" already exists in this list.`)
      return
    }
    const entry = normalizeEntry({
      id: crypto.randomUUID(),
      date: new Date().toISOString().slice(0, 10),
      name: trimmedName,
      specialty: newForm.specialty,
      category: newForm.category,
      members: '',
      isSoloist: SOLO_SPECIALTIES.has(newForm.specialty),
      done: false,
      notes: '',
      tags: '',
    })
    setEntries((current) => [entry, ...current])
    setActiveCategory(newForm.category)
    setAddModalOpen(false)
  }

  const toggleImageSection = (id) => {
    setVisibleImageSections((current) => ({
      ...current,
      [id]: !current[id],
    }))
  }

  const syncStatusText = !hasHydrated
    ? 'Checking sync status...'
    : syncMode === 'cloud'
      ? 'Cloud sync connected'
      : isCloudEnabled
        ? 'Cloud unavailable - local only'
        : 'Local only mode'

  const syncBadgeClass = `sync-badge sync-${hasHydrated ? syncMode : 'checking'}`

  return (
    <main className="vault-shell">
      <header className="hero">
        <p className="eyebrow">Master List</p>
        <div className="hero-content">
          <div>
            <h1>Entertainment Master List</h1>
            <p>Navigate with tabs and tick off names once edits are complete.</p>
            <p className={syncBadgeClass}>{syncStatusText}</p>
          </div>
          <span className="hero-emoji" aria-hidden="true">🖕</span>
        </div>
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

          <button type="button" className="add-entry-btn" onClick={openAddModal}>
            + Add entry
          </button>

          <label className="type-filter" htmlFor="specialty-filter">
            <span>Filter type</span>
            <select
              id="specialty-filter"
              value={specialtyFilter}
              onChange={(event) => setSpecialtyFilter(event.target.value)}
            >
              {specialtyOptions.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
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

              {entry.specialty && <p className={specialtyPillClass(entry.specialty)}>{entry.specialty}</p>}

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
                <label className="upload-pill">
                  Upload images
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(event) => uploadEditImages(entry.id, event)}
                  />
                </label>

                <button
                  type="button"
                  className="ghost"
                  disabled={!entry.editImages || entry.editImages.length === 0}
                  onClick={() => toggleImageSection(entry.id)}
                >
                  {visibleImageSections[entry.id] ? 'Hide images' : 'Show images'}
                </button>
              </div>

              {entry.editImages &&
                entry.editImages.length > 0 &&
                visibleImageSections[entry.id] && (
                <div className="image-section">
                  <p className="image-count">
                    Saved edits: {entry.editImages.length}
                  </p>
                  <div className="image-grid">
                    {entry.editImages.map((image, index) => (
                      <div className="image-tile" key={`${entry.id}-${index}`}>
                        <div className="image-preview-wrap">
                          <button
                            type="button"
                            className="image-delete-btn"
                            aria-label={`Delete ${entry.name} image ${index + 1}`}
                            onClick={() => deleteImageFromEntry(entry.id, index)}
                          >
                            ×
                          </button>
                          <a href={image} target="_blank" rel="noreferrer">
                            <img src={image} alt={`${entry.name} edit ${index + 1}`} />
                          </a>
                        </div>
                        <a
                          className="download-link"
                          href={image}
                          download={`${toSafeFileName(entry.name)}-edit-${
                            index + 1
                          }.${getImageExtension(image)}`}
                        >
                          Download
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>

        {filteredEntries.length === 0 && (
          <p className="empty-state">No entries match your current filters.</p>
        )}
      </section>
      {addModalOpen && (
        <div className="modal-overlay" onClick={closeAddModal}>
          <div className="modal" role="dialog" aria-modal="true" aria-label="Add new entry" onClick={(e) => e.stopPropagation()}>
            <h3>Add new entry</h3>
            <form onSubmit={submitNewEntry}>
              <div className="modal-field">
                <label htmlFor="new-name">Name</label>
                <input
                  id="new-name"
                  type="text"
                  placeholder="Enter name"
                  value={newForm.name}
                  onChange={(e) => setNewForm((f) => ({ ...f, name: e.target.value }))}
                  required
                  autoFocus
                />
              </div>

              <div className="modal-field">
                <label htmlFor="new-category">Category</label>
                <select
                  id="new-category"
                  value={newForm.category}
                  onChange={(e) => handleFormCategoryChange(e.target.value)}
                >
                  {CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.key} value={opt.key}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div className="modal-field">
                <label htmlFor="new-specialty">Type</label>
                <select
                  id="new-specialty"
                  value={newForm.specialty}
                  onChange={(e) => setNewForm((f) => ({ ...f, specialty: e.target.value }))}
                >
                  {CATEGORY_SPECIALTIES[newForm.category].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="ghost" onClick={closeAddModal}>Cancel</button>
                <button type="submit" className="primary">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}

export default App
