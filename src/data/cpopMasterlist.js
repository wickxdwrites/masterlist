const MASTERLIST_DATE = '2026-04-21'
const CPOP_CATEGORY = 'Chinese singers'

const groups = [
  {
    name: 'INTO1',
    members: ['Liu Yu', 'Santa', 'Rikimaru', 'Mika', 'Nine', 'Lin Mo', 'Bo Yuan', 'Zhang Jiayuan', 'Patrick', 'Zhou Keyu', 'AK Liu Zhang'],
  },
  {
    name: 'R1SE',
    members: ['Zhou Zhennan', 'He Luoluo', 'Yan Xujia', 'Xia Zhiguang', 'Yao Chen', 'Zhang Yanqi', 'Liu Ye', 'Ren Hao', 'Zhao Lei', 'Zhao Rang', 'Zhai Xiaowen'],
  },
  {
    name: 'UNINE',
    members: ['Li Wenhan', 'Li Zhenning', 'Yao Mingming', 'Guan Hong', 'Chen Youwei', 'Xia Hanyu', 'He Changxi', 'Deng Chaoyuan', 'Hu Chunyang'],
  },
  {
    name: 'THE9',
    members: ['Liu Yuxin', 'Yu Shuxin', 'Xu Jiaqi', 'Kong Xueer', 'Zhao Xiaotang', 'An Qi', 'Lu Keran', 'Xie Keyin', 'Esther Yu'],
  },
  {
    name: 'WayV',
    members: ['Kun', 'Ten', 'Winwin', 'Xiaojun', 'Hendery', 'Yangyang'],
  },
]

const soloists = [
  'Jay Chou',
  'JJ Lin',
  'Eason Chan',
  'G.E.M.',
  'Hebe Tien',
  'Jolin Tsai',
  'A-Mei',
  'Jackson Wang',
  'Lay Zhang',
  'Luhan',
  'Huang Zitao',
  'Cai Xukun',
  'Zhou Shen',
  'Mao Buyi',
  'Xiao Zhan',
  'Wang Yibo',
  'Dylan Wang',
  'Chen Feiyu',
]

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const CPOP_MASTERLIST_ENTRIES = [
  ...groups.map(({ name, members }) => ({
    id: `cpop-${slugify(name)}`,
    date: MASTERLIST_DATE,
    name,
    specialty: 'Group',
    category: CPOP_CATEGORY,
    members: members.join(', '),
    isSoloist: false,
    done: false,
    notes: '',
    tags: 'masterlist',
  })),
  ...soloists.map((name) => ({
    id: `cpop-${slugify(name)}`,
    date: MASTERLIST_DATE,
    name,
    specialty: 'Soloist',
    category: CPOP_CATEGORY,
    members: '',
    isSoloist: true,
    done: false,
    notes: '',
    tags: 'masterlist',
  })),
]
