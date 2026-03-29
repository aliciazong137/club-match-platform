"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useWishlist } from "@/components/WishlistContext";

interface MatchItem { clubName:string; clubId:number; score:number; reason:string; category:string; logo:string; matchPoints?:string[]; gains?:string[]; cautions?:string[]; }

export default function ResultPage() {
  const [results, setResults] = useState<MatchItem[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [persona, setPersona] = useState("");
  const [loaded, setLoaded] = useState(false);
  const { addToWishlist, isInWishlist, isFull } = useWishlist();

  useEffect(() => {
    const data = sessionStorage.getItem("matchResult");
    if (data) {
      const parsed = JSON.parse(data);
      setResults(parsed.matches || []);
      setTags(parsed.tags || []);
      setPersona(parsed.persona || "");
    }
    setLoaded(true);
  }, []);

  if (!loaded) return null;
  if (results.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-6">🔍</div>
        <h1 className="text-2xl font-bold text-[#4A4A4A] mb-4">暂无匹配结果</h1>
        <p className="text-[#888] mb-8">请先完成智能匹配问卷</p>
        <Link href="/quiz" className="px-6 py-3 btn-macaron rounded-full">去做问卷</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 right-10 w-64 h-64 bg-[#FFB5BA]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-[#A8D8FF]/20 rounded-full blur-3xl" />
      </div>
      <div className="max-w-3xl mx-auto px-4 py-12 relative">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[#FFE4B5]/30 text-[#D4A85A] px-6 py-3 rounded-full text-sm font-medium mb-6">✨ 匹配完成</div>
          <h1 className="text-4xl font-bold text-[#4A4A4A] mb-3">你的<span className="text-gradient">专属推荐</span></h1>
          {persona && <div className="macaron-card rounded-2xl p-4 mt-4 text-sm text-[#666]">{persona}</div>}
          {tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {tags.map(tag => <span key={tag} className="px-3 py-1 bg-[#FFB5BA]/20 text-[#FF8A9C] rounded-full text-sm">{tag}</span>)}
            </div>
          )}
        </div>

        <div className="space-y-6">
          {results.map((item, idx) => (
            <div key={idx} className="macaron-card rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-500">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFB5BA]/20 to-[#E6C6FF]/20 flex items-center justify-center text-3xl">{item.logo || "🎯"}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-bold text-[#4A4A4A]">{item.clubName}</h3>
                      <span className="text-xs px-2 py-0.5 bg-[#F5F5F5] text-[#888] rounded-full">{item.category}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex-1 h-2.5 bg-[#F5F5F5] rounded-full overflow-hidden max-w-[200px]">
                        <div className="h-full rounded-full transition-all progress-rainbow" style={{width:`${item.score}%`}} />
                      </div>
                      <span className="text-sm font-bold" style={{color: item.score>=80?"#FF8A9C":item.score>=60?"#9B7CB6":"#888"}}>{item.score}% 匹配</span>
                    </div>
                    <p className="text-[#666] text-sm mb-3">{item.reason}</p>
                    {item.matchPoints && item.matchPoints.length > 0 && (
                      <div className="bg-[#B8E6B8]/10 rounded-xl p-3 mb-2">
                        <div className="text-xs font-medium text-[#6CB46C] mb-1">为什么适合你</div>
                        {item.matchPoints.map((p,i) => <div key={i} className="text-xs text-[#666]">· {p}</div>)}
                      </div>
                    )}
                    <div className="flex gap-2 mt-3 flex-wrap">
                      <Link href={`/clubs/${item.clubId}`} className="text-sm px-4 py-2 rounded-full border border-[#E6C6FF]/50 text-[#9B7CB6] hover:bg-[#E6C6FF]/10 transition">查看详情</Link>
                      <Link href={`/apply/${item.clubId}`} className="text-sm px-4 py-2 rounded-full text-white font-medium" style={{background:"linear-gradient(135deg, #FFB5BA, #E6C6FF)"}}>立即报名</Link>
                      <button
                        onClick={() => addToWishlist({ clubId: item.clubId, clubName: item.clubName, logo: item.logo, category: item.category })}
                        disabled={isInWishlist(item.clubId)||isFull()}
                        className={`text-sm px-4 py-2 rounded-full border transition ${isInWishlist(item.clubId) ? "border-[#B8E6B8] text-[#6CB46C] bg-[#B8E6B8]/10" : isFull() ? "border-[#e0e0e0] text-[#bbb] bg-[#f0f0f0] cursor-not-allowed" : "border-[#FFE4B5] text-[#D4A85A] hover:bg-[#FFE4B5]/10"}`}
                      >
                        {isInWishlist(item.clubId) ? "✓ 已加入意向单" : isFull() ? "已满3个" : "📋 加入意向单"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4 justify-center pt-10">
          <Link href="/quiz" className="px-8 py-3 border-2 border-[#E6C6FF] text-[#9B7CB6] rounded-xl font-semibold hover:bg-[#E6C6FF]/10 transition">重新匹配</Link>
          <Link href="/clubs" className="px-8 py-3 btn-macaron-blue rounded-xl font-semibold">浏览更多社团</Link>
        </div>
      </div>
    </div>
  );
}
