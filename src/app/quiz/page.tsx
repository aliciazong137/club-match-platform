"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const majorOptions = [
  { id: "理工科", label: "理工科", desc: "计算机、电子、机械等", emoji: "💻" },
  { id: "商科", label: "商科", desc: "金融、管理、经济等", emoji: "📊" },
  { id: "文科艺术", label: "文科/艺术", desc: "中文、历史、设计等", emoji: "🎨" },
  { id: "理学", label: "理学", desc: "数学、物理、化学等", emoji: "🔬" },
  { id: "医学", label: "医学/生命科学", desc: "", emoji: "🏥" },
  { id: "其他", label: "其他", desc: "", emoji: "📖" },
];

const interestTags = [
  { id: "摄影", name: "摄影", icon: "📷" },
  { id: "编程", name: "编程", icon: "💻" },
  { id: "音乐", name: "音乐", icon: "🎵" },
  { id: "篮球", name: "篮球", icon: "🏀" },
  { id: "志愿", name: "志愿服务", icon: "💚" },
  { id: "辩论", name: "辩论演讲", icon: "🎤" },
  { id: "舞蹈", name: "舞蹈", icon: "💃" },
  { id: "创业", name: "创业", icon: "🚀" },
  { id: "旅行", name: "旅行", icon: "✈️" },
  { id: "阅读", name: "阅读", icon: "📚" },
  { id: "运动", name: "运动健身", icon: "💪" },
  { id: "艺术", name: "艺术创作", icon: "🎨" },
];

const motivationOptions = [
  { id: "技能", label: "学习实用技能", desc: "提升硬实力", emoji: "🎯" },
  { id: "社交", label: "交志同道合的朋友", desc: "拓展社交圈", emoji: "👥" },
  { id: "履历", label: "丰富简历/获得学分", desc: "为未来加分", emoji: "📄" },
  { id: "乐趣", label: "丰富课余生活", desc: "纯粹找乐趣", emoji: "🎉" },
];

const vibeOptions = [
  { id: "热闹", label: "热闹活跃", desc: "经常团建、大型活动多", emoji: "🔥" },
  { id: "小而精", label: "小而精", desc: "核心成员关系紧密，像家人", emoji: "🤝" },
  { id: "松散", label: "松散自由", desc: "想来就来，不强制打卡", emoji: "🌊" },
];

const depthOptions = [
  { id: "佛系", label: "佛系体验", desc: "每周1-3小时，感受氛围就好", emoji: "🌱" },
  { id: "积极", label: "积极参与", desc: "每周3-6小时，活动基本不落", emoji: "⚡" },
  { id: "全力", label: "全力投入", desc: "每周6小时+，愿意当核心骨干", emoji: "🔥" },
];

const activityOptions = [
  { id: "竞赛", label: "竞赛比赛型", desc: "打比赛、拿奖、挑战自我", emoji: "🏆" },
  { id: "学习", label: "学习分享型", desc: "讲座、工作坊、读书会", emoji: "📚" },
  { id: "表演", label: "表演展示型", desc: "演出、展览、作品发布", emoji: "🎭" },
  { id: "实践", label: "实践服务型", desc: "志愿者、支教、社会实践", emoji: "🤲" },
];

const TOTAL_STEPS = 6;

const stepMeta = [
  { accent: "#2B7DE9", label: "专业方向" },
  { accent: "#FF8A9C", label: "兴趣爱好" },
  { accent: "#F59E0B", label: "加入动机" },
  { accent: "#8B5CF6", label: "社团氛围" },
  { accent: "#10B981", label: "参与深度" },
  { accent: "#EC4899", label: "活动偏好" },
];

export default function QuizPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [major, setMajor] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [motivations, setMotivations] = useState<string[]>([]);
  const [vibe, setVibe] = useState("");
  const [depth, setDepth] = useState("");
  const [activity, setActivity] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleInterest = (id: string) => {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleMotivation = (id: string) => {
    setMotivations((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return prev;
      return [...prev, id];
    });
  };

  const canNext = () => {
    if (step === 0) return major !== "";
    if (step === 1) return interests.length > 0;
    if (step === 2) return motivations.length > 0;
    if (step === 3) return vibe !== "";
    if (step === 4) return depth !== "";
    if (step === 5) return activity !== "";
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    const answers: Record<string, string> = {
      专业方向: major,
      兴趣爱好: interests.join("、"),
      加入动机: motivations.join("、"),
      社团氛围偏好: vibe,
      参与深度和时间: depth,
      活动类型偏好: activity,
    };
    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers,
          studentInfo: {
            name: "匿名用户",
            studentId: `anon_${Date.now()}`,
            major,
            grade: "",
          },
        }),
      });
      const data = await res.json();
      sessionStorage.setItem("matchResult", JSON.stringify(data));
      router.push("/result");
    } catch {
      alert("匹配请求失败，请稍后重试");
      setLoading(false);
    }
  };

  const pct = Math.round(((step + 1) / TOTAL_STEPS) * 100);

  return (
    <div className="min-h-screen bg-[#f7f7f5] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-[#eee] p-6 md:p-10">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <span
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium text-white"
                style={{ backgroundColor: stepMeta[step].accent }}
              >
                {step + 1}/{TOTAL_STEPS} · {stepMeta[step].label}
              </span>
              <span className="text-sm text-[#999]">{pct}%</span>
            </div>
            <div className="h-2 bg-[#f0f0f0] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${pct}%`,
                  backgroundColor: stepMeta[step].accent,
                }}
              />
            </div>
          </div>

          {/* Q1: Major */}
          {step === 0 && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a1a] mb-2">
                  你的<span style={{ color: stepMeta[0].accent }}>专业方向</span>是？
                </h2>
                <p className="text-[#999] text-sm">仅供参考，帮助推荐更契合的社团</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {majorOptions.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMajor(m.id)}
                    className={`p-5 rounded-xl border-2 text-center transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] ${
                      major === m.id
                        ? "border-[#2B7DE9] bg-[#2B7DE9]/5 shadow-md"
                        : "border-[#eee] hover:border-[#2B7DE9]/40"
                    }`}
                  >
                    <div className="text-3xl mb-2">{m.emoji}</div>
                    <div className={`font-semibold ${major === m.id ? "text-[#2B7DE9]" : "text-[#444]"}`}>{m.label}</div>
                    {m.desc && <div className="text-xs text-[#999] mt-1">{m.desc}</div>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Q2: Interests */}
          {step === 1 && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a1a] mb-2">
                  你对哪些领域<span style={{ color: stepMeta[1].accent }}>感兴趣</span>？
                </h2>
                <p className="text-[#999] text-sm">至少选1个，可多选</p>
              </div>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {interestTags.map((tag) => {
                  const sel = interests.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      onClick={() => toggleInterest(tag.id)}
                      className={`p-4 rounded-xl border-2 text-center transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] ${
                        sel
                          ? "border-[#FF8A9C] bg-[#FF8A9C]/5 shadow-md"
                          : "border-[#eee] hover:border-[#FF8A9C]/40"
                      }`}
                    >
                      <div className="text-2xl mb-1">{tag.icon}</div>
                      <div className={`text-sm font-medium ${sel ? "text-[#FF8A9C]" : "text-[#555]"}`}>
                        {tag.name}
                      </div>
                      {sel && <div className="text-[#FF8A9C] text-xs mt-1">✓</div>}
                    </button>
                  );
                })}
              </div>
              {interests.length > 0 && (
                <p className="text-center text-sm text-[#999] mt-4">
                  已选 {interests.length} 个兴趣
                </p>
              )}
            </div>
          )}

          {/* Q3: Motivation */}
          {step === 2 && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a1a] mb-2">
                  加入社团，你最想<span style={{ color: stepMeta[2].accent }}>获得什么</span>？
                </h2>
                <p className="text-[#999] text-sm">最多选2个</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {motivationOptions.map((m) => {
                  const sel = motivations.includes(m.id);
                  return (
                    <button
                      key={m.id}
                      onClick={() => toggleMotivation(m.id)}
                      className={`p-6 rounded-xl border-2 text-left transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] flex items-center gap-4 ${
                        sel
                          ? "border-[#F59E0B] bg-[#F59E0B]/5 shadow-md"
                          : "border-[#eee] hover:border-[#F59E0B]/40"
                      }`}
                    >
                      <span className="text-3xl">{m.emoji}</span>
                      <div>
                        <div className={`font-semibold ${sel ? "text-[#D97706]" : "text-[#444]"}`}>{m.label}</div>
                        <div className="text-xs text-[#999]">{m.desc}</div>
                      </div>
                      {sel && <span className="ml-auto text-[#F59E0B]">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Q4: Vibe */}
          {step === 3 && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a1a] mb-2">
                  你喜欢什么<span style={{ color: stepMeta[3].accent }}>社团氛围</span>？
                </h2>
                <p className="text-[#999] text-sm">选择最适合你的风格</p>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {vibeOptions.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setVibe(v.id)}
                    className={`p-6 rounded-xl border-2 text-center transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] ${
                      vibe === v.id
                        ? "border-[#8B5CF6] bg-[#8B5CF6]/5 shadow-md"
                        : "border-[#eee] hover:border-[#8B5CF6]/40"
                    }`}
                  >
                    <div className="text-4xl mb-3">{v.emoji}</div>
                    <div className={`font-semibold text-lg mb-1 ${vibe === v.id ? "text-[#7C3AED]" : "text-[#444]"}`}>{v.label}</div>
                    <div className="text-xs text-[#999]">{v.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Q5: Depth + Time */}
          {step === 4 && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a1a] mb-2">
                  你期望怎样<span style={{ color: stepMeta[4].accent }}>参与社团</span>？
                </h2>
                <p className="text-[#999] text-sm">选择你的参与节奏</p>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {depthOptions.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setDepth(d.id)}
                    className={`p-6 rounded-xl border-2 text-center transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] ${
                      depth === d.id
                        ? "border-[#10B981] bg-[#10B981]/5 shadow-md"
                        : "border-[#eee] hover:border-[#10B981]/40"
                    }`}
                  >
                    <div className="text-4xl mb-3">{d.emoji}</div>
                    <div className={`font-semibold text-lg mb-1 ${depth === d.id ? "text-[#059669]" : "text-[#444]"}`}>{d.label}</div>
                    <div className="text-xs text-[#999]">{d.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Q6: Activity Type */}
          {step === 5 && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a1a] mb-2">
                  你偏好哪种<span style={{ color: stepMeta[5].accent }}>社团活动</span>？
                </h2>
                <p className="text-[#999] text-sm">选择最吸引你的活动类型</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {activityOptions.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setActivity(a.id)}
                    className={`p-6 rounded-xl border-2 text-left transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] flex items-center gap-4 ${
                      activity === a.id
                        ? "border-[#EC4899] bg-[#EC4899]/5 shadow-md"
                        : "border-[#eee] hover:border-[#EC4899]/40"
                    }`}
                  >
                    <span className="text-3xl">{a.emoji}</span>
                    <div>
                      <div className={`font-semibold ${activity === a.id ? "text-[#DB2777]" : "text-[#444]"}`}>{a.label}</div>
                      <div className="text-xs text-[#999]">{a.desc}</div>
                    </div>
                    {activity === a.id && <span className="ml-auto text-[#EC4899]">✓</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            {step > 0 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 border-2 border-[#ddd] text-[#666] rounded-xl font-medium hover:border-[#2B7DE9] hover:text-[#2B7DE9] hover:scale-105 active:scale-95 transition-all"
              >
                上一步
              </button>
            ) : (
              <div />
            )}
            {!loading ? (
              <button
                onClick={() => {
                  if (step < TOTAL_STEPS - 1) setStep(step + 1);
                  else handleSubmit();
                }}
                disabled={!canNext()}
                className="px-8 py-3 bg-[#2B7DE9] text-white rounded-xl font-semibold hover:bg-[#1a6dd6] hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:hover:scale-100"
              >
                {step === TOTAL_STEPS - 1 ? "查看匹配结果 ✨" : "下一步 →"}
              </button>
            ) : (
              <div className="text-center py-3">
                <div className="w-10 h-10 border-3 border-[#2B7DE9]/30 border-t-[#2B7DE9] rounded-full animate-spin mx-auto mb-2" />
                <p className="text-sm text-[#999]">AI正在为你匹配最佳社团...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
