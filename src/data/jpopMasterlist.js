const MASTERLIST_DATE = '2026-04-21'
const JPOP_CATEGORY = 'Japanese singers'

const groups = [
  {
    name: 'Snow Man',
    members: ['Hikaru Iwamoto', 'Tatsuya Fukazawa', 'Raul', 'Shota Watanabe', 'Koji Mukai', 'Ryohei Abe', 'Ren Meguro', 'Daisuke Sakuma', 'Ryota Miyadate'],
  },
  {
    name: 'SixTONES',
    members: ['Jesse', 'Taiga Kyomoto', 'Hokuto Matsumura', 'Yugo Kochi', 'Juri Tanaka', 'Shintaro Morimoto'],
  },
  {
    name: 'King & Prince',
    members: ['Ren Nagase', 'Kaito Takahashi'],
  },
  {
    name: 'JO1',
    members: ['Sho Yonashiro', 'Ren Kawashiri', 'Ruki Shiroiwa', 'Keigo Sato', 'Takumi Kawanishi', 'Syoya Kimata', 'Shosei Ohira', 'Sukai Kinjo', 'Junki Kono', 'Haru Yonashiro', 'Issei Mamehara'],
  },
  {
    name: 'ONE OK ROCK',
    members: ['Taka', 'Toru', 'Ryota', 'Tomoya'],
    specialty: 'Band',
  },
  {
    name: 'RADWIMPS',
    members: ['Yojiro Noda', 'Akira Kuwahara', 'Yusuke Takeda', 'Satoshi Yamaguchi'],
    specialty: 'Band',
  },
  {
    name: 'Official HIGE DANdism',
    members: ['Satoshi Fujihara', 'Daisuke Ozasa', 'Makoto Narazaki', 'Masaki Matsuura'],
    specialty: 'Band',
  },
  {
    name: 'Mrs. GREEN APPLE',
    members: ['Motoki Ohmori', 'Hiroto Wakai', 'Ryoka Fujisawa'],
    specialty: 'Band',
  },
]

const soloists = [
  'Utada Hikaru',
  'Ayumi Hamasaki',
  'Kenshi Yonezu',
  'Aimer',
  'YOASOBI',
  'Eve',
  'Vaundy',
  'Fujii Kaze',
  'Ado',
  'Yamashita Tomohisa',
  'Kento Nakajima',
  'Sho Hirano',
]

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const JPOP_MASTERLIST_ENTRIES = [
  ...groups.map(({ name, members, specialty = 'Group' }) => ({
    id: `jpop-${slugify(name)}`,
    date: MASTERLIST_DATE,
    name,
    specialty,
    category: JPOP_CATEGORY,
    members: members.join(', '),
    isSoloist: false,
    done: false,
    notes: '',
    tags: 'masterlist',
  })),
  ...soloists.map((name) => ({
    id: `jpop-${slugify(name)}`,
    date: MASTERLIST_DATE,
    name,
    specialty: 'Soloist',
    category: JPOP_CATEGORY,
    members: '',
    isSoloist: true,
    done: false,
    notes: '',
    tags: 'masterlist',
  })),
]
