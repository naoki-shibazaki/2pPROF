// ── Self profile ────────────────────────────────────────────────
export const profileData = {
  name:   'ひろ',
  handle: 'hiro_pixel',
  level:  24,
  class:  '冒険者',
  status: '今日もゲームしながらのんびり中…',
  bio:    'ゲームと漫画が大好きな普通の人間です。\nRPGはジャンル問わず好きで、休みの日はひたすら遊んでます。\n映画も週1本は観るようにしてるので、おすすめがあればぜひ教えてください！\nよろしくお願いします。',
  stats: [
    { label: 'フォロワー', value: '128' },
    { label: '紹介文',     value:   '3' },
    { label: 'Q&A',        value:  '20' },
  ],
  qa: [
    { q: '出身地はどこ？',             a: '神奈川です！海が近くて好きな場所です' },
    { q: '好きな食べ物は？',           a: 'カレーライスです。毎週食べても飽きない' },
    { q: '苦手な食べ物は？',           a: 'セロリとパクチー…香りがどうしても無理' },
    { q: '趣味は？',                    a: 'ゲーム・映画鑑賞・散歩。インドア寄りです笑' },
    { q: '好きなゲームジャンルは？',   a: 'RPGが一番好き！世界観に浸れるやつ最高' },
    { q: '最近ハマっているものは？',   a: '新作RPGにどハマり中。もうすぐ100時間になる' },
    { q: '朝型？夜型？',               a: '完全夜型。深夜2時くらいが一番集中できる' },
    { q: '犬派？猫派？',               a: '猫派！気ままなところが好き' },
    { q: '好きな季節は？',             a: '秋です。涼しくてゲームも映画もはかどる' },
    { q: '特技は？',                    a: 'ゲームの攻略情報を覚えるのだけは早い笑' },
    { q: '苦手なことは？',             a: '朝起きること。あと電話が少し苦手' },
    { q: '将来の夢は？',               a: 'ゲームのシナリオライターになりたい！' },
    { q: '座右の銘は？',               a: '「なるようになる」。考えすぎないのが大事' },
    { q: '好きな映画ジャンルは？',     a: 'SF・ファンタジー系が好き。世界観大事' },
    { q: '最後に食べたいものは？',     a: '迷わずカレーライスです（笑）' },
    { q: '行ってみたい国は？',         a: 'アイスランド！オーロラを見てみたい' },
    { q: '自分を動物に例えると？',     a: 'ナマケモノ。のんびりしてるので…' },
    { q: '一番大切にしていることは？', a: '自分のペースを守ること' },
    { q: 'ストレス発散方法は？',       a: 'ゲームか散歩。どちらかで大抵リセットできる' },
    { q: '読者へひとこと！',           a: 'よかったら気軽に話しかけてください！' },
  ],
}

// ── Others (friends' introductions) ─────────────────────────────
export type FriendEntry = {
  name:   string
  handle: string
  emoji:  string
  color:  string
  intro:  string
  qa:     { q: string; a: string }[]
}

export const demoPosts = [
  { id: 'demo-1', body: '今日もいい天気！☀️ 散歩しながらカフェ巡りしてきた', created_at: '2024-03-15T09:00:00Z', author_name: 'ひろ', author_handle: 'hiro_pixel', author_image: null, comment_count: 3, my_reaction: null, reaction_counts: { '👍': 5, '😂': 2 } },
  { id: 'demo-2', body: '新しいRPG買っちゃった🎮 やばい沼にハマりそう', created_at: '2024-03-14T21:00:00Z', author_name: 'ひろ', author_handle: 'hiro_pixel', author_image: null, comment_count: 1, my_reaction: null, reaction_counts: { '👍': 8 } },
  { id: 'demo-3', body: 'みんな週末どこかおすすめある？旅行したい気分', created_at: '2024-03-13T18:00:00Z', author_name: 'ひろ', author_handle: 'hiro_pixel', author_image: null, comment_count: 5, my_reaction: null, reaction_counts: { '👍': 3, '😮': 1 } },
]

export const demoFriends = [
  { id: 'demo-f1', name: 'たかし', handle: 'takashi_gamer', image: null, proximity_count: 42 },
  { id: 'demo-f2', name: 'さくら', handle: 'sakura_eats', image: null, proximity_count: 18 },
  { id: 'demo-f3', name: 'けんじ', handle: 'kenji_walks', image: null, proximity_count: 7 },
]

export const demoIntros = [
  { id: 'demo-i1', body: '高校からの友達です。ゲームの話になると止まらないタイプで、RPGのことをめちゃくちゃ詳しく知ってます。最初は人見知りに見えるかもしれないけど、慣れるとすごく面白い人！', met_year: 2018, met_month: 4, author_name: 'たかし', author_handle: 'takashi_gamer', created_at: '2024-01-10T00:00:00Z' },
  { id: 'demo-i2', body: '一緒に働いていた仲間です！食べることが大好きで、ランチの誘いは絶対OKしてくれる。笑顔が素敵な人です。', met_year: 2021, met_month: 6, author_name: 'さくら', author_handle: 'sakura_eats', created_at: '2024-02-05T00:00:00Z' },
  { id: 'demo-i3', body: '週末の散歩仲間です。道に異常に詳しくて、地図なしでもすいすい歩いていく。方向音痴な私には神様みたいな存在（笑）', met_year: 2022, met_month: 9, author_name: 'けんじ', author_handle: 'kenji_walks', created_at: '2024-03-01T00:00:00Z' },
]

export const demoQA = [
  { id: 'demo-q1', question: '好きな食べ物は？', answer: 'カレーライスです！毎週食べてます', is_anonymous: false, asker_name: 'さくら', asker_handle: 'sakura_eats', created_at: '2024-03-01T00:00:00Z' },
  { id: 'demo-q2', question: '最近ハマってることは？', answer: '新しいRPGにドはまり中。もう100時間超えた', is_anonymous: false, asker_name: 'たかし', asker_handle: 'takashi_gamer', created_at: '2024-02-28T00:00:00Z' },
  { id: 'demo-q3', question: '趣味を教えて！', answer: 'ゲーム・映画鑑賞・散歩です', is_anonymous: true, asker_name: null, asker_handle: null, created_at: '2024-02-20T00:00:00Z' },
  { id: 'demo-q4', question: '将来の夢は？', answer: 'ゲームシナリオライターになりたい', is_anonymous: false, asker_name: 'けんじ', asker_handle: 'kenji_walks', created_at: '2024-02-10T00:00:00Z' },
]

export const othersData: FriendEntry[] = [
  {
    name:   'たかし',
    handle: 'takashi_gamer',
    emoji:  '★',
    color:  '#4060cc',
    intro:
      '高校からの友達です。ゲームの話になると止まらないタイプで、RPGのことをめちゃくちゃ詳しく知ってます。\n最初は人見知りに見えるかもしれないけど、慣れるとすごく面白い人なので、ぜひ話しかけてみてください。',
    qa: [
      { q: '第一印象は？',         a: 'ゲームめちゃ詳しそうな人だなって思った（笑）' },
      { q: 'この人の一番の魅力は？', a: '一度仲良くなると本当に信頼できる。長く付き合いたい友達。' },
    ],
  },
  {
    name:   'さくら',
    handle: 'sakura_eats',
    emoji:  '♡',
    color:  '#cc4060',
    intro:
      '一緒に働いていた仲間です！食べることが大好きで、ランチの誘いは絶対OKしてくれる。\n自作のカレーを一度食べさせてもらったんですが、本当においしかった！笑顔が素敵な人です。',
    qa: [
      { q: '一緒にいるとどんな感じ？',       a: 'ゆるくて楽。話が自然と盛り上がる。' },
      { q: 'ここだけ直してほしい！',          a: '朝が本当に弱い（笑）待つのに慣れました。' },
    ],
  },
  {
    name:   'けんじ',
    handle: 'kenji_walks',
    emoji:  '▶',
    color:  '#286428',
    intro:
      '週末の散歩仲間です。道に異常に詳しくて、地図なしでもすいすい歩いていく。\nその特技には毎回助けてもらってます。方向音痴な私には神様みたいな存在（笑）',
    qa: [
      { q: 'この人を一言で表すと？', a: '「のんびり屋」。焦らないところが好き。' },
      { q: 'オススメする理由は？',   a: '話を真剣に聞いてくれる。一緒にいると落ち着く。' },
    ],
  },
]
