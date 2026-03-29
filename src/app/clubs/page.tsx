"use client";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useWishlist } from "@/components/WishlistContext";

interface Club { id:number; name:string; category:string; description:string; tags:string; logo:string; memberCount:number; }
const categories = ["全部","学术科技","文体艺术","公益志愿","创新创业"];

function ClubListContent() {
  const searchParams = useSearchParams();
  const catParam = searchParams.get("category") || "";
  const [clubs, setClubs] = useState<Club[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(catParam);
  const [loading, setLoading] = useState(true);
  const { addToWishlist, isInWishlist, isFull } = useWishlist();

  useEffect(() => { fetch("/api/clubs").then(r=>r.json()).then(d=>{setClubs(d);setLoading(false);}); }, []);

  const filtered = clubs.filter(c => {
    const mc = !category || category==="全部" || c.category===category;
    const ms = !search || c.name.includes(search) || c.description.includes(search) || c.tags.includes(search);
    return mc && ms;
  });

  return (
    <div className="min-h-screen relative overflow-hidden pb-20">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-72 h-72 bg-[#FFB5BA]/20 rounded-full blur-3xl" />
        <div className="absolute top-40 right-0 w-96 h-96 bg-[#A8D8FF]/20 rounded-full blur-3xl" />
      </div>

      <div className="relative glass border-b border-white/60">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#FFB5BA]/20 text-[#FF8A9C] px-4 py-2 rounded-full text-sm font-medium mb-4">✨ 探索无限可能</div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#4A4A4A] mb-2">探索<span className="text-[#A8D8FF]">社团</span></h1>
              <p className="text-[#888] text-lg">发现志同道合的伙伴 💫</p>
            </div>
            <div className="relative w-full md:w-96">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999]">🔍</span>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="搜索社团名称、标签..." className="w-full pl-12 h-14 bg-white/70 backdrop-blur-xl border border-[#E6C6FF]/30 rounded-2xl focus:border-[#FFB5BA] focus:ring-[#FFB5BA]/20 focus:outline-none focus:ring-2 text-[#4A4A4A] placeholder:text-[#999]" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 relative">
        <div className="flex flex-wrap gap-3 mb-10">
          {categories.map(cat=>(
            <button key={cat} onClick={()=>setCategory(cat==="全部"?"":cat)} className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${(!category&&cat==="全部")||cat===category?"bg-[#FFB5BA] text-white shadow-lg":"bg-white/70 text-[#666] border border-[#E6C6FF]/30 hover:bg-[#FFB5BA]/10"}`}>{cat}</button>
          ))}
        </div>

        {loading ? <div className="text-center py-20 text-[#888]">加载中...</div> : filtered.length===0 ? (
          <div className="text-center py-20"><div className="text-5xl mb-4">🔍</div><h3 className="text-2xl font-bold text-[#4A4A4A] mb-3">未找到相关社团</h3><p className="text-[#888]">换个关键词试试 🔍</p></div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(club => {
              const tags = JSON.parse(club.tags||"[]") as string[];
              return (
                <div key={club.id} className="macaron-card rounded-2xl overflow-hidden group hover:scale-105 transition-all duration-500">
                  <div className="relative h-32 overflow-hidden bg-gradient-to-br from-[#FFB5BA]/20 to-[#A8D8FF]/20 flex items-center justify-center">
                    <span className="text-5xl group-hover:scale-110 transition-transform duration-500">{club.logo||"🎯"}</span>
                    <div className="absolute top-3 right-3"><span className="bg-[#B8E6B8] text-[#4A4A4A] text-xs px-3 py-1 rounded-full font-medium shadow-lg">招新中</span></div>
                    <div className="absolute top-3 left-3"><span className="bg-white/90 text-[#FF8A9C] text-xs px-3 py-1 rounded-full shadow-lg">{club.category}</span></div>
                  </div>
                  <div className="p-5">
                    <Link href={`/clubs/${club.id}`}><h3 className="font-bold text-lg text-[#4A4A4A] mb-2 group-hover:text-[#FF8A9C] transition-colors cursor-pointer">{club.name}</h3></Link>
                    <p className="text-sm text-[#888] line-clamp-2 mb-3">{club.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {tags.slice(0,3).map(t=><span key={t} className="text-xs px-2.5 py-1 bg-[#F5F5F5] text-[#888] rounded-full">{t}</span>)}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-[#F0F0F0]">
                      <span className="text-sm text-[#888]">👥 {club.memberCount}人</span>
                      <div className="flex gap-2">
                        <button onClick={()=>addToWishlist({clubId:club.id,clubName:club.name,logo:club.logo,category:club.category})} disabled={isInWishlist(club.id)||isFull()} className={`text-xs px-3 py-1.5 rounded-full transition ${isInWishlist(club.id)?"bg-[#B8E6B8]/20 text-[#6CB46C]":isFull()?"bg-[#f0f0f0] text-[#bbb] cursor-not-allowed":"bg-[#FFE4B5]/20 text-[#D4A85A] hover:bg-[#FFE4B5]/30"}`}>
                          {isInWishlist(club.id)?"✓ 已添加":isFull()?"已满3个":"📋 意向"}
                        </button>
                        <Link href={`/clubs/${club.id}`} className="text-xs px-3 py-1.5 rounded-full text-[#5BA3D0] bg-[#A8D8FF]/20 hover:bg-[#A8D8FF]/30 transition">详情 →</Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ClubsPage() {
  return <Suspense fallback={<div className="text-center py-20 text-[#888]">加载中...</div>}><ClubListContent/></Suspense>;
}
