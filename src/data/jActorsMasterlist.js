const MASTERLIST_DATE = '2026-04-21'
const JACTORS_CATEGORY = 'Japanese Actors and Actresses'

const actors = [
  'Takeru Satoh',
  'Masaki Suda',
  'Kento Yamazaki',
  'Ryunosuke Kamiki',
  'Mackenyu',
  'Ryo Yoshizawa',
  'Kentaro Sakaguchi',
  'Hokuto Matsumura',
  'Ren Nagase',
  'Yuki Yamada',
  'Shunsuke Michieda',
  'Eiji Akaso',
  'Keita Machida',
  'Yusei Yagi',
  'Riku Hagiwara',
  'Takumi Kitamura',
  'Ryusei Yokohama',
  'Fumiya Takahashi',
  'Shuhei Uesugi',
  'Yudai Chiba',
]

const actresses = [
  'Suzu Hirose',
  'Kasumi Arimura',
  'Tao Tsuchiya',
  'Mirei Kiritani',
  'Satomi Ishihara',
  'Minami Hamabe',
  'Kanna Hashimoto',
  'Nana Komatsu',
  'Elaiza Ikeda',
  'Mio Imada',
  'Yurika Nakamura',
  'Sayuri Matsumura',
  'Ai Hashimoto',
  'Riko Fukumoto',
  'Natsuki Deguchi',
]

const models = [
  'Rola',
  'Kiko Mizuhara',
  'Tao Okamoto',
  'Ai Tominaga',
  'Nana Komatsu',
  'Koki',
  'Yamato Kochi',
]

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const JACTORS_MASTERLIST_ENTRIES = [
  ...actors.map((name) => ({
    id: `jactor-${slugify(name)}`,
    date: MASTERLIST_DATE,
    name,
    specialty: 'Actor',
    category: JACTORS_CATEGORY,
    members: '',
    isSoloist: true,
    done: false,
    notes: '',
    tags: 'masterlist',
  })),
  ...actresses.map((name) => ({
    id: `jactress-${slugify(name)}`,
    date: MASTERLIST_DATE,
    name,
    specialty: 'Actress',
    category: JACTORS_CATEGORY,
    members: '',
    isSoloist: true,
    done: false,
    notes: '',
    tags: 'masterlist',
  })),
  ...models.map((name) => ({
    id: `jmodel-${slugify(name)}`,
    date: MASTERLIST_DATE,
    name,
    specialty: 'Model',
    category: JACTORS_CATEGORY,
    members: '',
    isSoloist: true,
    done: false,
    notes: '',
    tags: 'masterlist',
  })),
]
