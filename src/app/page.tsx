import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f7f7f5]">
      {/* Hero - wide 21:9 banner with characters on sides, text in center */}
      <section className="relative px-4 pt-4 pb-6">
        <div className="max-w-6xl mx-auto relative" style={{ aspectRatio: '21/9' }}>
          {/* Banner background image */}
          <Image
            src="/images/hero-banner.jpg"
            alt=""
            fill
            className="object-cover object-center"
            priority
          />
          {/* Text content in the center blank area */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a1a1a] mb-3 leading-tight whitespace-nowrap">
              少一点冲动，多一点匹配
            </h1>
            <p className="text-[#555] text-sm md:text-base mb-5">
              按兴趣选，按动机找——告别无聊，赚学分、交朋友全搞定
            </p>
            <Link
              href="/quiz"
              className="inline-block px-10 py-3.5 bg-[#2B7DE9] text-white text-lg font-semibold rounded-full hover:bg-[#1a6dd6] hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#2B7DE9]/25"
            >
              立即开始匹配
            </Link>
            <p className="text-xs text-[#999] mt-2.5">3分钟找到适合你的社团</p>

            {/* Stats row */}
            <div className="flex items-center justify-center gap-5 mt-5 px-8 py-3 bg-white/40 backdrop-blur-md rounded-full border border-white/60 shadow-sm">
              <div className="flex items-center gap-2 text-[#2B7DE9] font-semibold text-base">
                <span className="text-xl">🏠</span> 40+ 社团
              </div>
              <div className="w-1.5 h-1.5 bg-[#ccc] rounded-full" />
              <div className="flex items-center gap-2 text-[#2B7DE9] font-semibold text-base">
                <span className="text-xl">👥</span> 2000+ 社员
              </div>
              <div className="w-1.5 h-1.5 bg-[#ccc] rounded-full" />
              <div className="flex items-center gap-2 text-[#2B7DE9] font-semibold text-base">
                <span className="text-xl">⭐</span> 98% 满意度
              </div>
            </div>
          </div>
        </div>

        {/* Three entry buttons */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <a
            href="#ai-chat"
            className="flex items-center gap-4 px-6 py-5 rounded-2xl border-2 border-transparent hover:scale-[1.03] active:scale-[0.97] transition-all duration-200 group text-white shadow-lg"
            style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
          >
            <span className="text-3xl">💬</span>
            <div className="flex-1">
              <div className="font-bold text-base flex items-center gap-2">
                和 AI 聊聊
                <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold leading-none">HOT</span>
              </div>
              <div className="text-xs text-white/80 mt-0.5">不确定选什么？先问 AI</div>
            </div>
            <span className="text-white/80 text-lg group-hover:translate-x-1 transition-transform">→</span>
          </a>

          <Link
            href="/clubs"
            className="flex items-center gap-4 px-6 py-5 bg-white border-2 border-[#ddd] rounded-2xl hover:border-[#2B7DE9] hover:bg-[#2B7DE9]/5 hover:scale-[1.03] active:scale-[0.97] transition-all duration-200 group"
          >
            <span className="text-3xl">🔍</span>
            <div className="flex-1">
              <div className="font-bold text-[#1a1a1a] text-base">直接逛社团</div>
              <div className="text-xs text-[#888] mt-0.5">浏览全部社团，自主探索</div>
            </div>
            <span className="text-[#888] group-hover:text-[#2B7DE9] text-lg group-hover:translate-x-1 transition-all">→</span>
          </Link>

          <Link
            href="/personality"
            className="flex items-center gap-4 px-6 py-5 bg-white border-2 border-[#ddd] rounded-2xl hover:border-[#2B7DE9] hover:bg-[#2B7DE9]/5 hover:scale-[1.03] active:scale-[0.97] transition-all duration-200 group"
          >
            <span className="text-3xl">🧠</span>
            <div className="flex-1">
              <div className="font-bold text-[#1a1a1a] text-base flex items-center gap-2">
                社团人格测试
                <span className="bg-[#2B7DE9] text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold leading-none">NEW</span>
              </div>
              <div className="text-xs text-[#888] mt-0.5">4道题，发现你的社团人格</div>
            </div>
            <span className="text-[#888] group-hover:text-[#2B7DE9] text-lg group-hover:translate-x-1 transition-all">→</span>
          </Link>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-4xl mx-auto border-t border-[#eee]" />

      {/* Feature cards */}
      <section className="px-4 py-12">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: "🔍",
              title: "精准匹配",
              desc: "按兴趣、动机、时间精准推荐，不浪费你的每一分钟",
            },
            {
              icon: "🏅",
              title: "真实需求",
              desc: "支持筛选「赚学分」「轻松参与」「丰富履历」等真实动机社团",
            },
            {
              icon: "🤝",
              title: "轻松加入",
              desc: "直接对接社团招新负责人，跳过繁琐流程，快速入社",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="border border-[#eee] rounded-2xl p-8 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-4xl mb-5">{f.icon}</div>
              <h3 className="font-bold text-xl text-[#1a1a1a] mb-3">
                {f.title}
              </h3>
              <p className="text-sm text-[#666] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Personality test banner */}
      <section className="px-4 pb-12">
        <div className="max-w-4xl mx-auto border border-[#eee] rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center gap-6 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer hover:shadow-lg">
          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 text-[#2B7DE9] text-sm font-medium mb-3">
              🧠 社团人格测试
              <span className="bg-[#2B7DE9] text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold leading-none">NEW</span>
            </div>
            <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">
              你是哪种社团人格？
            </h2>
            <p className="text-[#666] text-sm mb-5 leading-relaxed">
              4道趣味题目，发现你的社团人格类型，获取专属社团推荐
            </p>
            <div className="flex flex-wrap gap-2 mb-5">
              {["🎨 艺术创造者", "💻 科技探索者", "⚡ 运动达人", "🎭 舞台之星", "💝 温暖传递者"].map(
                (label, i) => (
                  <span
                    key={i}
                    className="text-xs px-3 py-1.5 bg-[#f5f5f5] rounded-full text-[#555]"
                  >
                    {label}
                  </span>
                )
              )}
            </div>
            <Link
              href="/personality"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#2B7DE9] text-white text-sm font-semibold rounded-full hover:bg-[#1a6dd6] hover:scale-105 active:scale-95 transition-all"
            >
              开始测试 →
            </Link>
          </div>
          <div className="flex gap-2.5">
            {[
              { emoji: "🎨", label: "艺术型", bg: "#F0EAFF" },
              { emoji: "💻", label: "科技型", bg: "#E8F4FF" },
              { emoji: "⚽", label: "运动型", bg: "#E8F8E8" },
              { emoji: "🎭", label: "表演型", bg: "#FFE8EA" },
            ].map((type, i) => (
              <div
                key={i}
                className="text-center hover:scale-110 hover:-translate-y-1 transition-all cursor-pointer"
              >
                <div
                  className="w-14 h-[72px] rounded-xl flex flex-col items-center justify-center mb-1.5"
                  style={{ backgroundColor: type.bg }}
                >
                  <span className="text-xl mb-0.5">{type.emoji}</span>
                  <span className="text-[10px] text-[#555] font-medium">
                    {type.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-4 py-8 border-t border-[#eee]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-[#999]">
          <p>&copy; 2026 Pick Me - 校园社团匹配平台</p>
          <div className="flex items-center gap-5">
            <span className="hover:text-[#2B7DE9] cursor-pointer transition-colors">
              使用指南
            </span>
            <span className="hover:text-[#2B7DE9] cursor-pointer transition-colors">
              常见问题
            </span>
            <span className="hover:text-[#2B7DE9] cursor-pointer transition-colors">
              联系我们
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
