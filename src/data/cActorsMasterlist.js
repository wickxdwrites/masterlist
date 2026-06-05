const MASTERLIST_DATE = '2026-04-21'
const CACTORS_CATEGORY = 'Chinese Actors and Actresses'

const actors = [
  'Xiao Zhan',
  'Wang Yibo',
  'Yang Yang',
  'Li Xian',
  'Dylan Wang',
  'Leo Wu',
  'Chen Feiyu',
  'Zhang Linghe',
  'Arthur Chen',
  'Xu Kai',
  'Cheng Yi',
  'Allen Ren',
  'Luo Yunxi',
  'Gong Jun',
  'Tan Jianci',
  'Hu Yitian',
  'Zhang Ruoyun',
  'Chen Zheyuan',
  'Lin Yi',
  'Zhou Yiran',
  'Song Weilong',
  'Gao Weiguang',
]

const actresses = [
  'Yang Mi',
  'Dilraba Dilmurat',
  'Zhao Liying',
  'Liu Yifei',
  'Bai Lu',
  'Esther Yu',
  'Zhou Ye',
  'Tian Xiwei',
  "Song Zu'er",
  'Shen Yue',
  'Guan Xiaotong',
  'Zhang Jingyi',
  'Zhou Dongyu',
  'Qiao Xin',
  'Zhang Yuxi',
  'Xu Lu',
  'Chen Duling',
  'Li Landi',
]

const models = [
  'Liu Wen',
  'Fei Fei Sun',
  'Ming Xi',
  'Sui He',
  'He Cong',
  'Angelababy',
  'Ouyang Nana',
]

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const CACTORS_MASTERLIST_ENTRIES = [
  ...actors.map((name) => ({
    id: `cactor-${slugify(name)}`,
    date: MASTERLIST_DATE,
    name,
    specialty: 'Actor',
    category: CACTORS_CATEGORY,
    members: '',
    isSoloist: true,
    done: false,
    notes: '',
    tags: 'masterlist',
  })),
  ...actresses.map((name) => ({
    id: `cactress-${slugify(name)}`,
    date: MASTERLIST_DATE,
    name,
    specialty: 'Actress',
    category: CACTORS_CATEGORY,
    members: '',
    isSoloist: true,
    done: false,
    notes: '',
    tags: 'masterlist',
  })),
  ...models.map((name) => ({
    id: `cmodel-${slugify(name)}`,
    date: MASTERLIST_DATE,
    name,
    specialty: 'Model',
    category: CACTORS_CATEGORY,
    members: '',
    isSoloist: true,
    done: false,
    notes: '',
    tags: 'masterlist',
  })),
]
