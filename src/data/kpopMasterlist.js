const MASTERLIST_DATE = '2026-04-21'
const KPOP_CATEGORY = 'K-pop groups and soloists'

const boyGroups = [
  {
    name: 'BTS',
    members: ['RM', 'Jin', 'SUGA', 'j-hope', 'Jimin', 'V', 'Jung Kook'],
  },
  {
    name: 'SEVENTEEN',
    members: [
      'S.Coups',
      'Jeonghan',
      'Joshua',
      'Jun',
      'Hoshi',
      'Wonwoo',
      'Woozi',
      'DK',
      'Mingyu',
      'The8',
      'Seungkwan',
      'Vernon',
      'Dino',
    ],
  },
  {
    name: 'Stray Kids',
    members: ['Bang Chan', 'Lee Know', 'Changbin', 'Hyunjin', 'Han', 'Felix', 'Seungmin', 'I.N'],
  },
  {
    name: 'ATEEZ',
    members: ['Hongjoong', 'Seonghwa', 'Yunho', 'Yeosang', 'San', 'Mingi', 'Wooyoung', 'Jongho'],
  },
  {
    name: 'TOMORROW X TOGETHER (TXT)',
    members: ['Soobin', 'Yeonjun', 'Beomgyu', 'Taehyun', 'HueningKai'],
  },
  {
    name: 'ENHYPEN',
    members: ['Jungwon', 'Heeseung', 'Jay', 'Jake', 'Sunghoon', 'Sunoo', 'Ni-ki'],
  },
  {
    name: 'EXO',
    members: ['Suho', 'Xiumin', 'Baekhyun', 'Chen', 'Chanyeol', 'D.O.', 'Kai', 'Sehun'],
  },
  {
    name: 'SHINee',
    members: ['Onew', 'Key', 'Minho', 'Taemin'],
  },
  {
    name: 'RIIZE',
    members: ['Shotaro', 'Eunseok', 'Sungchan', 'Wonbin', 'Sohee', 'Anton'],
  },
  {
    name: 'NCT 127',
    members: ['Johnny', 'Taeyong', 'Yuta', 'Doyoung', 'Jaehyun', 'Jungwoo', 'Mark', 'Haechan'],
  },
  {
    name: 'NCT DREAM',
    members: ['Mark', 'Renjun', 'Jeno', 'Haechan', 'Jaemin', 'Chenle', 'Jisung'],
  },
  {
    name: 'WayV',
    members: ['Kun', 'Ten', 'Xiaojun', 'Hendery', 'YangYang'],
  },
  {
    name: 'Super Junior',
    members: ['Leeteuk', 'Heechul', 'Yesung', 'Shindong', 'Eunhyuk', 'Donghae', 'Siwon', 'Ryeowook', 'Kyuhyun'],
  },
  {
    name: 'TVXQ!',
    members: ['U-Know Yunho', 'Max Changmin'],
  },
  {
    name: '2PM',
    members: ['Jun. K', 'Nichkhun', 'Taecyeon', 'Wooyoung', 'Junho', 'Chansung'],
  },
  {
    name: 'GOT7',
    members: ['Jay B', 'Mark', 'Jackson', 'Jinyoung', 'Youngjae', 'BamBam', 'Yugyeom'],
  },
  {
    name: 'MONSTA X',
    members: ['Shownu', 'Minhyuk', 'Kihyun', 'Hyungwon', 'Joohoney', 'I.M'],
  },
  {
    name: 'BTOB',
    members: ['Eunkwang', 'Minhyuk', 'Changsub', 'Hyunsik', 'Peniel', 'Sungjae'],
  },
  {
    name: 'THE BOYZ',
    members: ['Sangyeon', 'Jacob', 'Younghoon', 'Hyunjae', 'Juyeon', 'Kevin', 'New', 'Q', 'Sunwoo', 'Eric'],
  },
  {
    name: 'TREASURE',
    members: ['Choi Hyun-suk', 'Jihoon', 'Yoshi', 'Junkyu', 'Yoon Jae-hyuk', 'Asahi', 'Doyoung', 'Haruto', 'Park Jeong-woo', 'So Jung-hwan'],
  },
  {
    name: 'P1Harmony',
    members: ['Keeho', 'Theo', 'Jiung', 'Intak', 'Soul', 'Jongseob'],
  },
  {
    name: 'ZEROBASEONE',
    members: ['Sung Han-bin', 'Kim Ji-woong', 'Zhang Hao', 'Seok Matthew', 'Kim Tae-rae', 'Ricky', 'Kim Gyu-vin', 'Park Gun-wook', 'Han Yu-jin'],
  },
  {
    name: 'BOYNEXTDOOR',
    members: ['Sungho', 'Riwoo', 'Jaehyun', 'Taesan', 'Leehan', 'Woonhak'],
  },
  {
    name: 'xikers',
    members: ['Minjae', 'Junmin', 'Sumin', 'Jinsik', 'Hyunwoo', 'Seeun', 'Yujun', 'Hunter', 'Yechan'],
  },
  {
    name: 'EVNNE',
    members: ['Keita', 'Park Han-bin', 'Lee Jeong-hyeon', 'Yoo Seung-eon', 'Ji Yun-seo', 'Mun Junghyun', 'Park Ji-hoo'],
  },
  {
    name: 'ONEUS',
    members: ['Seoho', 'Leedo', 'Keonhee', 'Hwanwoong', 'Xion'],
  },
  {
    name: 'ONF',
    members: ['Hyojin', 'E-Tion', 'J-Us', 'Wyatt', 'MK', 'U'],
  },
  {
    name: 'AB6IX',
    members: ['Woong', 'Donghyun', 'Woojin', 'Daehwi'],
  },
  {
    name: 'CIX',
    members: ['BX', 'Seunghun', 'Yonghee', 'Bae Jin-young', 'Hyunsuk'],
  },
  {
    name: 'CRAVITY',
    members: ['Serim', 'Allen', 'Jungmo', 'Woobin', 'Wonjin', 'Minhee', 'Hyeongjun', 'Taeyoung', 'Seongmin'],
  },
  {
    name: 'TEMPEST',
    members: ['Hanbin', 'Hyuk', 'Hyeongseop', 'LEW', 'Eunchan', 'Hwarang', 'Taerae'],
  },
  {
    name: 'EPEX',
    members: ['Wish', 'Keum', 'Mu', 'A-Min', 'Baekseung', 'Ayden', 'Yewang', 'Jeff'],
  },
  {
    name: 'SF9',
    members: ['Youngbin', 'Inseong', 'Jaeyoon', 'Dawon', 'Zuho', 'Yoo Taeyang', 'Hwiyoung', 'Chani'],
  },
  {
    name: '82MAJOR',
    members: ['Nam Seongmo', 'Park Seokjoon', 'Yoon Yechan', 'Cho Seongil', 'Hwang Seongbin', 'Kim Dogyun'],
  },
  {
    name: '8TURN',
    members: ['Jaeyun', 'Myungho', 'Minho', 'Yoonsung', 'Haemin', 'Kyungmin', 'Yungyu', 'Seungheon'],
  },
]

const bands = [
  { name: 'DAY6', members: ['Sungjin', 'Young K', 'Wonpil', 'Dowoon'] },
  { name: 'Xdinary Heroes', members: ['Gun-il', 'Jungsu', 'Gaon', 'O.de', 'Jun Han', 'Jooyeon'] },
  { name: 'The Rose', members: ['Woosung', 'Dojoon', 'Hajoon', 'Jaehyeong'] },
  { name: 'CNBLUE', members: ['Jung Yong-hwa', 'Kang Min-hyuk', 'Lee Jung-shin'] },
  { name: 'FTISLAND', members: ['Lee Hong-gi', 'Lee Jae-jin', 'Choi Min-hwan'] },
]

const girlGroups = [
  { name: 'BLACKPINK', members: ['Jisoo', 'Jennie', 'Rose', 'Lisa'] },
  { name: 'TWICE', members: ['Nayeon', 'Jeongyeon', 'Momo', 'Sana', 'Jihyo', 'Mina', 'Dahyun', 'Chaeyoung', 'Tzuyu'] },
  { name: 'Red Velvet', members: ['Irene', 'Seulgi', 'Wendy', 'Joy', 'Yeri'] },
  { name: 'aespa', members: ['Karina', 'Giselle', 'Winter', 'Ningning'] },
  { name: 'ITZY', members: ['Yeji', 'Lia', 'Ryujin', 'Chaeryeong', 'Yuna'] },
  { name: 'NMIXX', members: ['Lily', 'Haewon', 'Sullyoon', 'BAE', 'Jiwoo', 'Kyujin'] },
  { name: 'IVE', members: ['An Yu-jin', 'Gaeul', 'Rei', 'Jang Won-young', 'Liz', 'Leeseo'] },
  { name: 'LE SSERAFIM', members: ['Sakura', 'Kim Chaewon', 'Huh Yunjin', 'Kazuha', 'Hong Eunchae'] },
  { name: '(G)I-DLE / i-dle', members: ['Miyeon', 'Minnie', 'Soyeon', 'Yuqi', 'Shuhua'] },
  { name: 'STAYC', members: ['Sumin', 'Sieun', 'ISA', 'Seeun', 'Yoon', 'J'] },
  { name: 'MAMAMOO', members: ['Solar', 'Moonbyul', 'Wheein', 'Hwasa'] },
  { name: 'Dreamcatcher', members: ['JiU', 'SuA', 'Siyeon', 'Handong', 'Yoohyeon', 'Dami', 'Gahyeon'] },
  { name: 'Apink', members: ['Park Chorong', 'Yoon Bomi', 'Jeong Eun-ji', 'Kim Nam-joo', 'Oh Ha-young'] },
  { name: 'Oh My Girl', members: ['Hyojung', 'Mimi', 'YooA', 'Seunghee', 'Yubin', 'Arin'] },
  { name: 'Kep1er', members: ['Choi Yujin', 'Xiaoting', 'Chaehyun', 'Dayeon', 'Hikaru', 'Huening Bahiyyih', 'Youngeun'] },
  { name: 'KISS OF LIFE', members: ['Julie', 'Natty', 'Belle', 'Haneul'] },
  { name: 'ILLIT', members: ['Yunah', 'Minju', 'Moka', 'Wonhee', 'Iroha'] },
  { name: 'BABYMONSTER', members: ['Ruka', 'Pharita', 'Asa', 'Ahyeon', 'Rami', 'Rora', 'Chiquita'] },
  {
    name: 'tripleS',
    members: [
      'Seoyeon', 'Hyerin', 'Jiwoo', 'Chaeyeon', 'YooYeon', 'Soomin', 'Nakyoung', 'Yubin', 'Kaede', 'Dahyun', 'Kotone', 'Nien', 'Sohyun', 'Xinyu', 'Mayu', 'Lynn', 'Joobin', 'Hayeon', 'Shion', 'Chaewon', 'Sullin', 'SeoAh', 'Jiyeon', 'Yeonji',
    ],
  },
  { name: 'VIVIZ', members: ['Eunha', 'SinB', 'Umji'] },
  {
    name: "Girls' Generation (SNSD)",
    members: ['Taeyeon', 'Sunny', 'Tiffany Young', 'Hyoyeon', 'Yuri', 'Sooyoung', 'Yoona', 'Seohyun'],
  },
  { name: 'WJSN', members: ['Seola', 'Bona', 'Exy', 'Soobin', 'Luda', 'Dawon', 'Eunseo', 'Yeoreum', 'Dayoung', 'Yeonjung'] },
  { name: 'fromis_9', members: ['Song Hayoung', 'Park Jiwon', 'Lee Nagyung', 'Lee Chaeyoung', 'Lee Seoyeon'] },
  { name: 'Hearts2Hearts', members: ['Jiwoo', 'Carmen', 'Yuha', 'Stella', 'Juun', 'A-na', 'Ian', 'Ye-on'] },
]

const coEdAndDuoActs = [
  { name: 'KARD', members: ['J.Seph', 'BM', 'Somin', 'Jiwoo'] },
  { name: 'AKMU', members: ['Lee Chan-hyuk', 'Lee Su-hyun'] },
]

const soloists = [
  'IU', 'Yerin', 'Dean', 'BoA', 'Kwon Eun-bi', 'DPR IAN', 'Taeyeon', 'Jo Yuri', 'Colde', 'Hyoyeon',
  'Choi Yena', 'Paul Kim', 'Yuri', 'Kang Daniel', '10CM', 'Yoona', 'Zico', 'Roy Kim', 'Seohyun',
  'Jay Park', 'AKMU Lee Su-hyun', 'Tiffany Young', 'Wonho', 'Lee Chan-hyuk', 'Taemin', 'Woodz',
  'Solar', 'Key', 'BamBam', 'Moonbyul', 'Onew', 'Yugyeom', 'Wheein', 'Minho', 'Jackson Wang', 'Hwasa',
  'Baekhyun', 'Mark Tuan', 'Seulgi', 'Kai', 'Jinyoung', 'Wendy', 'D.O.', 'Youngjae', 'Joy', 'Suho',
  'Jay B', 'Yeri', 'Xiumin', 'RM', 'Karina', 'Chen', 'Jin', 'Giselle', 'Chanyeol', 'j-hope', 'Winter',
  'Nayeon', 'Jimin', 'Ningning', 'Jihyo', 'V', 'Jennie', 'Tzuyu', 'Jung Kook', 'Jisoo', 'Jeon Somi',
  'Agust D', 'Rose', 'Sunmi', 'B.I', 'Lisa', 'Chungha', 'Bobby', 'Yoon Bomi', 'Ailee', 'Mino',
  'Jeong Eun-ji', 'Heize', 'Taeyang', 'YooA', 'Lee Hi', 'G-Dragon', 'Miyeon', 'BIBI', 'DAWN',
  'Soyeon', 'AleXa', 'HyunA', 'Yuqi', 'Yena', 'Wonstein', 'Minnie', 'Yuju', 'Crush',
]

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const createEntry = (name, section, members = []) => ({
  id: `kpop-${slugify(name)}`,
  date: MASTERLIST_DATE,
  name,
  specialty: section,
  category: KPOP_CATEGORY,
  members: members.join(', '),
  isSoloist: members.length === 0,
  done: false,
  notes: '',
  tags: 'masterlist',
})

const collectEntries = (groups, section) =>
  groups.map((group) => createEntry(group.name, section, group.members))

const soloEntries = soloists.map((name) => createEntry(name, 'Soloist', []))

export const KPOP_MASTERLIST_ENTRIES = [
  ...collectEntries(boyGroups, 'Boy Group'),
  ...collectEntries(bands, 'Band'),
  ...collectEntries(girlGroups, 'Girl Group'),
  ...collectEntries(coEdAndDuoActs, 'Co-ed / Duo'),
  ...soloEntries,
]
