"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useWishlist } from "@/components/WishlistContext";

// MBTI-style 4 dimensions for club matching
const questions = [
  {
    dimension: "EI",
    title: "社交能量",
    question: "社团迎新晚会上，你更可能？",
    optionA: { text: "主动上台表演、到处认识新朋友", letter: "E", emoji: "🎉" },
    optionB: { text: "找个角落和两三个人深入聊天", letter: "I", emoji: "☕" },
    colorA: "#FFB5BA",
    colorB: "#A8D8FF",
  },
  {
    dimension: "SN",
    title: "行动风格",
    question: "社团要办一场活动，你更想负责？",
    optionA: { text: "落地执行——场地布置、物资准备、现场协调", letter: "S", emoji: "🔧" },
    optionB: { text: "策划创意——主题构思、流程设计、玩法创新", letter: "N", emoji: "💡" },
    colorA: "#B8E6B8",
    colorB: "#E6C6FF",
  },
  {
    dimension: "TF",
    title: "价值取向",
    question: "加入社团，你最看重的是？",
    optionA: { text: "学到真本事、提升硬技能、积累项目经验", letter: "T", emoji: "🎯" },
    optionB: { text: "找到归属感、交到好朋友、享受氛围", letter: "F", emoji: "💝" },
    colorA: "#A8D8FF",
    colorB: "#FFE4B5",
  },
  {
    dimension: "JP",
    title: "参与节奏",
    question: "你理想中的社团活动频率是？",
    optionA: { text: "每周固定时间，有计划有目标地推进", letter: "J", emoji: "📅" },
    optionB: { text: "灵活随性，有好活动就参加，自由度高", letter: "P", emoji: "🌊" },
    colorA: "#FFB5BA",
    colorB: "#B8E6B8",
  },
];

// 16 MBTI types → club personality archetypes
const personalityMap: Record<string, {
  name: string; emoji: string; title: string; description: string;
  traits: string[]; clubTypes: string[]; advice: string;
  color: string; textColor: string; bgGradient: string;
}> = {
  ESTJ: {
    name: "ESTJ", emoji: "👑", title: "社团领袖型",
    description: "你天生具备组织力和执行力，喜欢把事情安排得井井有条。在社团中你很快就会成为核心骨干，带领团队高效运转。",
    traits: ["执行力强", "有条理", "目标明确", "天生领导者"],
    clubTypes: ["创行创业社", "风华辩论社", "模拟联合国协会"],
    advice: "适合有明确组织架构和目标的社团，你会在管理岗位上大放异彩！",
    color: "#FFB5BA", textColor: "#FF8A9C", bgGradient: "from-[#FFB5BA] to-[#FFC4C9]",
  },
  ESTP: {
    name: "ESTP", emoji: "⚡", title: "行动派玩家",
    description: "你精力充沛、喜欢刺激，是「说干就干」的行动派。比起坐着开会，你更想上场比赛或动手实践。",
    traits: ["活力四射", "敢想敢做", "临场应变", "喜欢挑战"],
    clubTypes: ["篮球俱乐部", "极限运动社", "旋律吉他社"],
    advice: "选择体育竞技或实践性强的社团，让你的能量有处释放！",
    color: "#B8E6B8", textColor: "#6CB46C", bgGradient: "from-[#B8E6B8] to-[#C8EBC8]",
  },
  ESFJ: {
    name: "ESFJ", emoji: "🤗", title: "暖心凝聚者",
    description: "你热情体贴、善于照顾他人，是社团里的「大家长」。你能让每个人都感到被重视和欢迎。",
    traits: ["热心肠", "善于关怀", "团队粘合剂", "责任感强"],
    clubTypes: ["绿芽志愿者协会", "心理健康协会", "墨韵书法社"],
    advice: "公益服务类社团最能发挥你的温暖力量，你会成为大家最信赖的人！",
    color: "#FFE4B5", textColor: "#D4A85A", bgGradient: "from-[#FFE4B5] to-[#FFEBC4]",
  },
  ESFP: {
    name: "ESFP", emoji: "🎭", title: "舞台焦点型",
    description: "你是天生的表演者和气氛担当！哪里有你，哪里就有欢笑。社团活动因你而精彩。",
    traits: ["感染力强", "多才多艺", "乐观开朗", "享受当下"],
    clubTypes: ["旋律吉他社", "ACG动漫社", "星辰摄影协会"],
    advice: "文艺表演类社团就是你的主场，尽情绽放你的舞台魅力！",
    color: "#FFB5BA", textColor: "#FF8A9C", bgGradient: "from-[#FFB5BA] to-[#E6C6FF]",
  },
  ENTJ: {
    name: "ENTJ", emoji: "🚀", title: "战略指挥官",
    description: "你有远见卓识和强大的驱动力，擅长制定目标并带领团队达成。社团在你手里会变得更有影响力。",
    traits: ["战略思维", "果断高效", "有野心", "推动变革"],
    clubTypes: ["创行创业社", "风华辩论社", "模拟联合国协会"],
    advice: "选择有挑战性和成长空间的社团，你会把它带到新高度！",
    color: "#A8D8FF", textColor: "#5BA3D0", bgGradient: "from-[#A8D8FF] to-[#B8E0FF]",
  },
  ENTP: {
    name: "ENTP", emoji: "💡", title: "创意鬼才型",
    description: "你脑子里永远有新点子，喜欢打破常规。在社团里你是那个总能提出「不如我们试试这个？」的人。",
    traits: ["创意无限", "思维活跃", "喜欢辩论", "不走寻常路"],
    clubTypes: ["创行创业社", "风华辩论社", "代码创想社"],
    advice: "需要创新思维的社团最适合你，别选太循规蹈矩的！",
    color: "#E6C6FF", textColor: "#9B7CB6", bgGradient: "from-[#E6C6FF] to-[#ECD4FF]",
  },
  ENFJ: {
    name: "ENFJ", emoji: "🌟", title: "灵魂引领者",
    description: "你有感召力，能激发他人的潜能。你不只是参与社团，而是用热情感染每一个人。",
    traits: ["有感召力", "善于激励", "同理心强", "理想主义"],
    clubTypes: ["绿芽志愿者协会", "心理健康协会", "模拟联合国协会"],
    advice: "能影响和帮助他人的社团会让你最有成就感！",
    color: "#FFE4B5", textColor: "#D4A85A", bgGradient: "from-[#FFE4B5] to-[#FFB5BA]",
  },
  ENFP: {
    name: "ENFP", emoji: "🦋", title: "热情探索家",
    description: "你对一切充满好奇和热情，是社团里的「开心果」。你能在任何社团找到乐趣，但最怕无聊。",
    traits: ["好奇心强", "热情洋溢", "善于社交", "讨厌束缚"],
    clubTypes: ["星辰摄影协会", "极限运动社", "旋律吉他社"],
    advice: "选择活动丰富多彩、氛围自由的社团，保持你的热情！",
    color: "#FFB5BA", textColor: "#FF8A9C", bgGradient: "from-[#FFB5BA] to-[#FFE4B5]",
  },
  ISTJ: {
    name: "ISTJ", emoji: "📐", title: "可靠工匠型",
    description: "你做事认真负责、一丝不苟，是社团里最可靠的存在。交给你的事，大家都放一百个心。",
    traits: ["严谨可靠", "注重细节", "踏实肯干", "守时守信"],
    clubTypes: ["代码创想社", "模拟联合国协会", "墨韵书法社"],
    advice: "需要专注和耐心的学术技术类社团最适合你的风格！",
    color: "#A8D8FF", textColor: "#5BA3D0", bgGradient: "from-[#A8D8FF] to-[#B8E6B8]",
  },
  ISTP: {
    name: "ISTP", emoji: "🔧", title: "冷静实干家",
    description: "你沉着冷静、动手能力强，喜欢拆解问题找到解决方案。社团里的技术难题都指望你。",
    traits: ["动手能力强", "冷静分析", "独立自主", "效率至上"],
    clubTypes: ["代码创想社", "极限运动社", "创行创业社"],
    advice: "技术实践类社团能让你尽情发挥动手天赋！",
    color: "#B8E6B8", textColor: "#6CB46C", bgGradient: "from-[#B8E6B8] to-[#A8D8FF]",
  },
  ISFJ: {
    name: "ISFJ", emoji: "🌸", title: "默默守护者",
    description: "你温柔细心、默默付出，总在背后支撑着社团运转。你不爱出风头，但社团离不开你。",
    traits: ["细心体贴", "默默奉献", "忠诚可靠", "善于倾听"],
    clubTypes: ["绿芽志愿者协会", "心理健康协会", "墨韵书法社"],
    advice: "温馨友爱的小型社团会让你找到归属感和价值感！",
    color: "#E6C6FF", textColor: "#9B7CB6", bgGradient: "from-[#E6C6FF] to-[#FFB5BA]",
  },
  ISFP: {
    name: "ISFP", emoji: "🎨", title: "自由艺术家",
    description: "你有独特的审美和感受力，喜欢用自己的方式表达内心。你在艺术创作中最能找到自我。",
    traits: ["审美独特", "感受力强", "自由随性", "低调有才"],
    clubTypes: ["星辰摄影协会", "ACG动漫社", "墨韵书法社"],
    advice: "艺术创作类社团能给你自由表达的空间，不要选太卷的！",
    color: "#E6C6FF", textColor: "#9B7CB6", bgGradient: "from-[#E6C6FF] to-[#FFE4B5]",
  },
  INTJ: {
    name: "INTJ", emoji: "🧠", title: "独立策略师",
    description: "你有深度思考能力和独到见解，喜欢按自己的节奏钻研。在社团中你是最有深度的那个人。",
    traits: ["独立思考", "有深度", "追求卓越", "战略眼光"],
    clubTypes: ["代码创想社", "风华辩论社", "模拟联合国协会"],
    advice: "选择能深度钻研的学术技术社团，和同样有想法的人碰撞！",
    color: "#A8D8FF", textColor: "#5BA3D0", bgGradient: "from-[#A8D8FF] to-[#E6C6FF]",
  },
  INTP: {
    name: "INTP", emoji: "🔬", title: "好奇研究员",
    description: "你对知识有无尽的渴望，喜欢研究「为什么」。社团里最烧脑的问题都能激发你的兴趣。",
    traits: ["求知欲强", "逻辑清晰", "享受思考", "追求真理"],
    clubTypes: ["代码创想社", "创行创业社", "ACG动漫社"],
    advice: "技术探索类社团能满足你的求知欲，找到和你一样爱思考的伙伴！",
    color: "#A8D8FF", textColor: "#5BA3D0", bgGradient: "from-[#A8D8FF] to-[#B8E6B8]",
  },
  INFJ: {
    name: "INFJ", emoji: "🔮", title: "理想主义者",
    description: "你内心有强烈的使命感，想通过社团做一些有意义的事。你看得远，也看得深。",
    traits: ["有使命感", "洞察力强", "理想远大", "共情能力强"],
    clubTypes: ["绿芽志愿者协会", "心理健康协会", "模拟联合国协会"],
    advice: "有社会价值的公益类社团能让你实现理想，收获深层满足感！",
    color: "#FFE4B5", textColor: "#D4A85A", bgGradient: "from-[#FFE4B5] to-[#E6C6FF]",
  },
  INFP: {
    name: "INFP", emoji: "🌙", title: "浪漫梦想家",
    description: "你内心丰富、充满想象力，追求真实和有意义的体验。你希望社团不只是活动，而是一段故事。",
    traits: ["想象力丰富", "追求意义", "温柔坚定", "文艺气质"],
    clubTypes: ["墨韵书法社", "星辰摄影协会", "旋律吉他社"],
    advice: "氛围温暖、注重表达的文艺类社团最适合你的气质！",
    color: "#E6C6FF", textColor: "#9B7CB6", bgGradient: "from-[#E6C6FF] to-[#A8D8FF]",
  },
};

export default function PersonalityPage() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [copied, setCopied] = useState(false);
  const [clubs, setClubs] = useState<{id:number;name:string;logo:string;category:string;memberCount:number}[]>([]);
  const { addToWishlist, isInWishlist, isFull } = useWishlist();

  // Fetch clubs when result is shown
  useEffect(() => {
    if (showResult) {
      fetch("/api/clubs").then(r => r.json()).then(setClubs);
    }
  }, [showResult]);

  const handleAnswer = (letter: string) => {
    const newAnswers = [...answers, letter];
    setAnswers(newAnswers);
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setShowResult(true);
    }
  };

  const getResult = () => {
    const code = answers.join("");
    return personalityMap[code] || personalityMap["ENFP"];
  };

  const restart = () => {
    setCurrentQ(0);
    setAnswers([]);
    setShowResult(false);
  };

  const handleShare = () => {
    const r = getResult();
    navigator.clipboard.writeText(
      `我的社团人格是【${r.name} ${r.title}${r.emoji}】\n${r.description}\n\n你也来测测吧！`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const progress = ((showResult ? questions.length : currentQ) / questions.length) * 100;

  // --- Result Screen ---
  if (showResult) {
    const r = getResult();
    return (
      <div className="min-h-screen relative overflow-hidden py-12 px-4">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-[#FFB5BA]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-[#A8D8FF]/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#E6C6FF]/15 rounded-full blur-3xl" />
        </div>
        <div className="max-w-2xl mx-auto relative">
          <div className="macaron-card rounded-3xl overflow-hidden">
            <div className={`h-2 bg-gradient-to-r ${r.bgGradient}`} />
            <div className="p-8 md:p-12 text-center">
              {/* Emoji + Type */}
              <div className="text-8xl mb-6 animate-bounce">{r.emoji}</div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-white text-sm font-medium mb-4" style={{ background: `linear-gradient(135deg, ${r.color}, ${r.textColor})` }}>
                你的社团人格
              </div>
              <h1 className="text-4xl font-bold mb-2" style={{ color: r.textColor }}>{r.title}</h1>
              <p className="text-[#888] text-sm mb-4 font-mono">{r.name}</p>
              <p className="text-[#666] text-lg mb-8 max-w-md mx-auto leading-relaxed">{r.description}</p>

              {/* Traits */}
              <div className="mb-8">
                <h3 className="font-bold text-[#4A4A4A] mb-4">你的特质</h3>
                <div className="flex flex-wrap justify-center gap-3">
                  {r.traits.map(t => (
                    <span key={t} className="px-4 py-2 bg-white/70 rounded-full text-sm font-medium text-[#4A4A4A] border border-[#F0F0F0]">{t}</span>
                  ))}
                </div>
              </div>

              {/* Recommended clubs - linked to actual clubs */}
              <div className="mb-8 p-6 bg-white/70 rounded-2xl border border-[#F0F0F0]">
                <h3 className="font-bold text-[#4A4A4A] mb-3">推荐社团</h3>
                <p className="text-[#888] mb-4 text-sm">{r.advice}</p>
                <div className="space-y-3">
                  {r.clubTypes.map(name => {
                    const club = clubs.find(c => c.name === name);
                    if (!club) return (
                      <span key={name} className="inline-block px-3 py-1 border border-[#E6C6FF] text-[#9B7CB6] rounded-full text-sm mr-2">{name}</span>
                    );
                    return (
                      <div key={name} className="flex items-center justify-between p-4 bg-white/80 rounded-xl border border-[#F0F0F0] hover:shadow-md transition">
                        <Link href={`/clubs/${club.id}`} className="flex items-center gap-3 flex-1">
                          <span className="text-2xl">{club.logo}</span>
                          <div className="text-left">
                            <div className="font-semibold text-[#4A4A4A]">{club.name}</div>
                            <div className="text-xs text-[#888]">{club.category} · {club.memberCount}人</div>
                          </div>
                        </Link>
                        <div className="flex gap-2">
                          <button
                            onClick={() => addToWishlist({ clubId: club.id, clubName: club.name, logo: club.logo, category: club.category })}
                            disabled={isInWishlist(club.id)||isFull()}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${isInWishlist(club.id) ? "bg-[#B8E6B8]/20 text-[#6CB46C]" : isFull() ? "bg-[#f0f0f0] text-[#bbb] cursor-not-allowed" : "border border-[#FFB5BA]/50 text-[#FF8A9C] hover:bg-[#FFB5BA]/10"}`}
                          >
                            {isInWishlist(club.id) ? "✓ 已收藏" : isFull() ? "已满" : "收藏"}
                          </button>
                          <Link href={`/apply/${club.id}`} className="px-3 py-1.5 btn-macaron rounded-lg text-xs font-medium">
                            报名
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* MBTI dimensions breakdown */}
              <div className="mb-8 p-6 bg-white/70 rounded-2xl border border-[#F0F0F0] text-left">
                <h3 className="font-bold text-[#4A4A4A] mb-4 text-center">你的四维分析</h3>
                <div className="space-y-3">
                  {[
                    { left: "E 外向社交", right: "I 深度交流", value: answers[0] },
                    { left: "S 实践落地", right: "N 创意策划", value: answers[1] },
                    { left: "T 技能成长", right: "F 情感归属", value: answers[2] },
                    { left: "J 规律计划", right: "P 自由灵活", value: answers[3] },
                  ].map((d, i) => {
                    const isLeft = d.value === d.left[0];
                    return (
                      <div key={i} className="flex items-center gap-3 text-sm">
                        <span className={`flex-1 text-right ${isLeft ? "font-bold text-[#FF8A9C]" : "text-[#CCC]"}`}>{d.left}</span>
                        <div className="w-32 h-2 bg-[#F5F5F5] rounded-full overflow-hidden relative">
                          <div className={`absolute h-full rounded-full transition-all`} style={{
                            width: "50%",
                            backgroundColor: isLeft ? "#FFB5BA" : "#A8D8FF",
                            left: isLeft ? 0 : "50%",
                          }} />
                        </div>
                        <span className={`flex-1 text-left ${!isLeft ? "font-bold text-[#5BA3D0]" : "text-[#CCC]"}`}>{d.right}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button onClick={handleShare} className="px-6 py-3 border-2 border-[#E6C6FF] text-[#9B7CB6] rounded-xl font-medium hover:bg-[#E6C6FF]/10 transition">
                  {copied ? "✓ 已复制" : "📋 分享结果"}
                </button>
                <button onClick={restart} className="px-6 py-3 border-2 border-[#FFB5BA] text-[#FF8A9C] rounded-xl font-medium hover:bg-[#FFB5BA]/10 transition">
                  🔄 重新测试
                </button>
                <Link href="/clubs" className="px-6 py-3 btn-macaron rounded-xl font-medium text-center">
                  🎯 去发现社团
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Quiz Screen ---
  const q = questions[currentQ];
  return (
    <div className="min-h-screen relative overflow-hidden py-12 px-4">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-[#FFB5BA]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-[#A8D8FF]/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-[#E6C6FF]/15 rounded-full blur-3xl" />
      </div>
      <div className="max-w-2xl mx-auto relative">
        <Link href="/" className="text-[#888] hover:text-[#FF8A9C] text-sm mb-6 inline-block transition">← 返回首页</Link>

        <div className="macaron-card rounded-3xl overflow-hidden">
          <div className="h-1 progress-rainbow" />
          <div className="p-8 md:p-12">
            {/* Progress */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-[#888] font-medium">问题 {currentQ + 1}/{questions.length}</span>
                <span className="text-sm text-[#888] font-medium">{Math.round(progress)}%</span>
              </div>
              <div className="h-3 bg-[#F5F5F5] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500 progress-rainbow" style={{ width: `${progress}%` }} />
              </div>
            </div>

            {/* Dimension badge */}
            <div className="inline-flex items-center gap-2 bg-[#FFB5BA]/20 text-[#FF8A9C] px-4 py-2 rounded-full text-sm font-medium mb-6">
              ✨ {q.title}
            </div>

            {/* Question */}
            <h2 className="text-2xl md:text-3xl font-bold text-[#4A4A4A] mb-8">{q.question}</h2>

            {/* Two options - big cards */}
            <div className="grid md:grid-cols-2 gap-5">
              <button
                onClick={() => handleAnswer(q.optionA.letter)}
                className="group p-8 bg-white/70 rounded-2xl border-2 border-[#F0F0F0] hover:shadow-lg text-left transition-all duration-300"
                style={{ ["--hover-border" as string]: q.colorA }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = q.colorA)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "#F0F0F0")}
              >
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-all" style={{ backgroundColor: `${q.colorA}20` }}>
                  <span className="text-3xl">{q.optionA.emoji}</span>
                </div>
                <p className="font-semibold text-[#4A4A4A] text-lg leading-relaxed">{q.optionA.text}</p>
              </button>

              <button
                onClick={() => handleAnswer(q.optionB.letter)}
                className="group p-8 bg-white/70 rounded-2xl border-2 border-[#F0F0F0] hover:shadow-lg text-left transition-all duration-300"
                onMouseEnter={e => (e.currentTarget.style.borderColor = q.colorB)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "#F0F0F0")}
              >
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-all" style={{ backgroundColor: `${q.colorB}20` }}>
                  <span className="text-3xl">{q.optionB.emoji}</span>
                </div>
                <p className="font-semibold text-[#4A4A4A] text-lg leading-relaxed">{q.optionB.text}</p>
              </button>
            </div>

            {/* Step dots */}
            <div className="flex justify-center gap-2 mt-8">
              {questions.map((_, i) => (
                <div key={i} className={`w-3 h-3 rounded-full transition-all ${i < currentQ ? "bg-[#FFB5BA]" : i === currentQ ? "bg-[#FF8A9C] scale-125" : "bg-[#F0F0F0]"}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
