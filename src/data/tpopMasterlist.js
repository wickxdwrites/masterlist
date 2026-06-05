const MASTERLIST_DATE = '2026-04-21'
const TPOP_CATEGORY = 'Thai singers'

const groups = [
  {
    name: 'TRINITY',
    members: ['Third', 'Porsche', 'Jackie'],
  },
  {
    name: 'ATLAS',
    members: ['Erwin', 'Jet', 'Nice', 'Muon', 'Tadd', 'Jun', 'Poom'],
  },
  {
    name: 'PERSES',
    members: ['Jung', 'Krittin', 'Plugg', 'Palm', 'Gorn'],
  },
  {
    name: '4EVE',
    members: ['Mind', 'Jorin', 'Taaom', 'Hannah', 'Fai', 'Punch', 'Aheye'],
  },
  {
    name: 'Pretzelle',
    members: ['Inc', 'Grace', 'Aumaim'],
  },
]

const soloists = [
  'Milli',
  'Ink Waruntorn',
  'Bowkylion',
  'Nont Tanont',
  'The Toys',
  'Violette Wautier',
  'Jeff Satur',
  'Billkin',
  'PP Krit',
  'Ice Paris',
  'Gavin D',
  'Sprite',
  'Bright Vachirawit',
  'Win Metawin',
  'Tor Thanapob',
  'Peck Palitchoke',
]

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const createGroupEntry = (name, members) => ({
  id: `tpop-${slugify(name)}`,
  date: MASTERLIST_DATE,
  name,
  specialty: 'Group',
  category: TPOP_CATEGORY,
  members: members.join(', '),
  isSoloist: false,
  done: false,
  notes: '',
  tags: 'masterlist',
})

const createSoloEntry = (name) => ({
  id: `tpop-${slugify(name)}`,
  date: MASTERLIST_DATE,
  name,
  specialty: 'Soloist',
  category: TPOP_CATEGORY,
  members: '',
  isSoloist: true,
  done: false,
  notes: '',
  tags: 'masterlist',
})

export const TPOP_MASTERLIST_ENTRIES = [
  ...groups.map((g) => createGroupEntry(g.name, g.members)),
  ...soloists.map(createSoloEntry),
]
