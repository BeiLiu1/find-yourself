export const questions = [
  { id: 1, text: "我常感到害怕", dimension: "N", isReverse: false },
  { id: 2, text: "一旦确定了目标，我会坚持努力地实现它", dimension: "C", isReverse: false },
  { id: 3, text: "我觉得大部分人基本上是心怀善意的", dimension: "A", isReverse: false },
  { id: 4, text: "我头脑中经常充满生动的画面", dimension: "O", isReverse: false },
  { id: 5, text: "我对人多的聚会感到乏味", dimension: "E", isReverse: true },
  { id: 6, text: "有时我觉得自己一无是处", dimension: "N", isReverse: false },
  { id: 7, text: "我常常是仔细考虑之后才做出决定", dimension: "C", isReverse: false },
  { id: 8, text: "我不太关心别人是否受到不公正的待遇", dimension: "A", isReverse: true },
  { id: 9, text: "我是个勇于冒险，突破常规的人", dimension: "O", isReverse: false },
  { id: 10, text: "在热闹的聚会上，我常常表现主动并尽情玩耍", dimension: "E", isReverse: false },
  { id: 11, text: "别人一句漫不经心的话，我常会联系在自己身上", dimension: "N", isReverse: false },
  { id: 12, text: "别人认为我是个慎重的人", dimension: "C", isReverse: false },
  { id: 13, text: "我时常觉得别人的痛苦与我无关", dimension: "A", isReverse: true },
  { id: 14, text: "我喜欢冒险", dimension: "O", isReverse: false },
  { id: 15, text: "我尽量避免参加人多的聚会和嘈杂的环境", dimension: "E", isReverse: true },
  { id: 16, text: "在面对压力时，我有种快要崩溃的感觉", dimension: "N", isReverse: false },
  { id: 17, text: "我喜欢一开头就把事情计划好", dimension: "C", isReverse: false },
  { id: 18, text: "我是那种只照顾好自己，不替别人担忧的人", dimension: "A", isReverse: true },
  { id: 19, text: "我对许多事情有着很强的好奇心", dimension: "O", isReverse: false },
  { id: 20, text: "有我在的场合一般不会冷场", dimension: "E", isReverse: false },
  { id: 21, text: "我常担忧一些无关紧要的事情", dimension: "N", isReverse: false },
  { id: 22, text: "我工作或学习很勤奋", dimension: "C", isReverse: false },
  { id: 23, text: "虽然社会上有些骗子，但我觉得大部分人还是可信的", dimension: "A", isReverse: false },
  { id: 24, text: "我身上具有别人没有的冒险精神", dimension: "O", isReverse: false },
  { id: 25, text: "在一个团体中，我希望处于领导地位", dimension: "E", isReverse: false },
  { id: 26, text: "我常常感到内心不踏实", dimension: "N", isReverse: false },
  { id: 27, text: "我是个倾尽全力做事的人", dimension: "C", isReverse: false },
  { id: 28, text: "当别人向我诉说不幸时，我常感到难过", dimension: "A", isReverse: false },
  { id: 29, text: "我渴望学习一些新东西，即使它们与我的日常生活无关", dimension: "O", isReverse: false },
  { id: 30, text: "别人多认为我是一个热情和友好的人", dimension: "E", isReverse: false },
  { id: 31, text: "我常担心有什么不好的事情要发生", dimension: "N", isReverse: false },
  { id: 32, text: "在工作上，我常只求能应付过去便可", dimension: "C", isReverse: true },
  { id: 33, text: "尽管人类社会存在着一些阴暗的东西（如战争、罪恶、欺诈），我仍然相信人性总的来说是善良的", dimension: "A", isReverse: false },
  { id: 34, text: "我的想象力相当丰富", dimension: "O", isReverse: false },
  { id: 35, text: "我喜欢参加社交与娱乐聚会", dimension: "E", isReverse: false },
  { id: 36, text: "我很少感到忧郁或沮丧", dimension: "N", isReverse: true },
  { id: 37, text: "做事讲究逻辑和条理是我的一个特点", dimension: "C", isReverse: false },
  { id: 38, text: "我常为那些遭遇不幸的人感到难过", dimension: "A", isReverse: false },
  { id: 39, text: "我很愿意也很容易接受那些新事物、新观点、新想法", dimension: "O", isReverse: false },
  { id: 40, text: "我希望成为领导者而不是被领导者", dimension: "E", isReverse: false },
];

export const dimensions = {
  E: {
    key: "E",
    name: "外向性",
    nameEn: "Extraversion",
    color: "#f59e0b",
    colorLight: "#fef3c7",
    icon: "Sun",
    description: "外向性反映人际互动的数量和密度、对刺激的需要以及获得愉悦的能力。",
    highDesc: "您是一个充满活力、热情开朗的人。您喜欢与人交往，善于在社交场合中表现自如，乐于成为关注的焦点。您精力充沛，倾向于积极乐观地看待生活。",
    lowDesc: "您是一个安静内敛、独立自主的人。您更享受独处或小范围社交的时光，这并非因为害羞或不友善，而是您不需要过多的外部刺激来获得满足感。",
  },
  N: {
    key: "N",
    name: "神经质",
    nameEn: "Neuroticism",
    color: "#ef4444",
    colorLight: "#fee2e2",
    icon: "Heart",
    description: "神经质反映个体情感调节过程，体现体验消极情绪的倾向和情绪不稳定性。",
    highDesc: "您可能比一般人更容易体验到焦虑、紧张等负面情绪，面对压力时的情绪波动较大。建议学习情绪管理技巧，培养正念冥想等习惯来提升情绪稳定性。",
    lowDesc: "您情绪稳定、冷静从容。面对压力和挑战时能够保持平和的心态，不易被负面情绪所困扰。这种特质有助于您在复杂情境中做出理性的决策。",
  },
  C: {
    key: "C",
    name: "严谨性",
    nameEn: "Conscientiousness",
    color: "#3b82f6",
    colorLight: "#dbeafe",
    icon: "Target",
    description: "严谨性反映个体按照社会规范控制冲动、以目标为导向、延迟满足及遵守纪律等方面的个体差异。",
    highDesc: "您是一个有条理、自律性强的人。您善于制定计划并坚持执行，工作认真负责，注重细节。您的可靠性和毅力是您取得成就的重要基础。",
    lowDesc: "您倾向于灵活随性的生活方式，不太喜欢被严格的计划和规则所束缚。虽然这种特质赋予您更多的创造性和适应性，但在需要持续努力的任务上可能需要更多的自我管理。",
  },
  A: {
    key: "A",
    name: "宜人性",
    nameEn: "Agreeableness",
    color: "#22c55e",
    colorLight: "#dcfce7",
    icon: "Users",
    description: "宜人性反映个体对人性及他人（遭遇）表现出的同情心和人文关怀。",
    highDesc: "您是一个善解人意、富有同情心的人。您关心他人的感受，乐于助人，对人性持乐观态度。您在人际关系中表现得温暖友善，善于维护和谐的人际氛围。",
    lowDesc: "您更注重理性分析和客观判断，不轻易被情感所左右。您可能在需要做出困难决策的场合更具优势，因为您能够保持独立思考，不受他人影响。",
  },
  O: {
    key: "O",
    name: "开放性",
    nameEn: "Openness",
    color: "#a855f7",
    colorLight: "#f3e8ff",
    icon: "Sparkles",
    description: "开放性描述个体对待新事物、新观念和新异刺激的态度和行为差异。",
    highDesc: "您对新事物充满好奇，想象力丰富，喜欢探索未知领域。您有着广泛的兴趣爱好，善于进行抽象思维和创造性思考。您乐于接受新观点和新体验。",
    lowDesc: "您倾向于务实和传统的思维方式，偏好熟悉和常规的事物。您在需要稳定性和可预测性的环境中表现出色，能够专注于眼前的实际问题。",
  },
};

export const norms = {
  female: {
    C: { mean: 33.29, sd: 6.52 },
    A: { mean: 37.71, sd: 5.65 },
    E: { mean: 30.76, sd: 6.94 },
    N: { mean: 26.91, sd: 7.47 },
    O: { mean: 31.97, sd: 6.18 },
  },
  male: {
    C: { mean: 32.90, sd: 6.64 },
    A: { mean: 36.29, sd: 6.30 },
    E: { mean: 31.09, sd: 7.24 },
    N: { mean: 24.97, sd: 7.06 },
    O: { mean: 32.60, sd: 6.74 },
  },
};

export const likertLabels = [
  { value: 1, label: "完全不符合" },
  { value: 2, label: "大部分不符合" },
  { value: 3, label: "有点不符合" },
  { value: 4, label: "有点符合" },
  { value: 5, label: "大部分符合" },
  { value: 6, label: "完全符合" },
];

export const personalityTypes = {
  E: { label: "社交达人", emoji: "🌟" },
  N: { label: "敏锐感知者", emoji: "🎭" },
  C: { label: "卓越执行者", emoji: "🎯" },
  A: { label: "温暖守护者", emoji: "🤝" },
  O: { label: "创意探索家", emoji: "✨" },
};

export const typeModifiers = {
  E: "热情",
  N: "细腻",
  C: "严谨",
  A: "仁爱",
  O: "灵动",
};

export function zToPercentile(z) {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989422804014327;
  const p = d * Math.exp(-z * z / 2) *
    (t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429)))));
  return z > 0 ? (1 - p) * 100 : p * 100;
}
