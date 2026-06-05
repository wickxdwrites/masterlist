const MASTERLIST_DATE = '2026-04-21'
const KACTORS_CATEGORY = 'K-Actors and actresses'

const actors = [
  'Lee Min-ho',
  'Kim Soo-hyun',
  'Park Seo-joon',
  'Ji Chang-wook',
  'Lee Jong-suk',
  'Song Joong-ki',
  'Hyun Bin',
  'Gong Yoo',
  'Lee Dong-wook',
  'Park Bo-gum',
  'Kim Woo-bin',
  'Jung Hae-in',
  'Seo In-guk',
  'Lee Je-hoon',
  'Im Si-wan',
  'Lee Jun-ho',
  'Park Hyung-sik',
  'Choi Woo-shik',
  'Ahn Hyo-seop',
  'Song Kang',
  'Hwang In-youp',
  'Bae In-hyuk',
  'Kim Yo-han',
  'Rowoon',
  'Cha Eun-woo',
  'Kim Young-dae',
  'Na In-woo',
  'Yoon Chan-young',
  'Moon Sang-min',
  'Lee Do-hyun',
  'Lee Byung-hun',
  'Ma Dong-seok',
  'Jung Woo-sung',
  'Hwang Jung-min',
  'Ha Jung-woo',
  'Kim Jae-wook',
  'Kim Nam-gil',
  'Yoo Yeon-seok',
  'Jung Kyung-ho',
  'Lee Sang-yoon',
  'Park Sung-woong',
]

const actresses = [
  'Song Hye-kyo',
  'Jun Ji-hyun',
  'Son Ye-jin',
  'Kim Tae-ri',
  'Park Shin-hye',
  'Bae Suzy',
  'IU',
  'Han So-hee',
  'Shin Min-a',
  'Kim Ji-won',
  'Kim Yoo-jung',
  'Kim So-hyun',
  'Roh Yoon-seo',
  'Go Youn-jung',
  'Kim Hye-yoon',
  'Park Gyu-young',
  'Moon Ga-young',
  'Lee Sung-kyung',
  'Jeon Yeo-been',
  'Kim Go-eun',
  'Tang Wei',
  'Jisoo',
  'Krystal Jung',
  'Yoona',
  'Sejeong',
]

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const createEntry = (name, specialty) => ({
  id: `kactors-${slugify(name)}`,
  date: MASTERLIST_DATE,
  name,
  specialty,
  category: KACTORS_CATEGORY,
  members: '',
  isSoloist: true,
  done: false,
  notes: '',
  tags: 'masterlist',
})

export const KACTORS_MASTERLIST_ENTRIES = [
  ...actors.map((name) => createEntry(name, 'Actor')),
  ...actresses.map((name) => createEntry(name, 'Actress')),
]
