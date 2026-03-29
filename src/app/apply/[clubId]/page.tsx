"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useWishlist } from "@/components/WishlistContext";

interface Club { id:number; name:string; logo:string; category:string; memberCount:number; requirements:string; }

export default function ApplyPage() {
  const params = useParams();
  const clubId = params.clubId as string;
  const [club, setClub] = useState<Club|null>(null);
  const [form, setForm] = useState({name:"",studentId:"",phone:"",intro:""});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { addToWishlist } = useWishlist();

  useEffect(()=>{fetch(`/api/clubs?id=${clubId}`).then(r=>r.json()).then(setClub);}, [clubId]);

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    if(!form.name||!form.studentId){alert("请填写姓名和学号");return;}
    setLoading(true);
    try {
      const res = await fetch("/api/apply",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...form,clubId:Number(clubId)})});
      if(res.ok) setSubmitted(true); else alert("报名失败");
    } catch { alert("网络错误"); }
    finally { setLoading(false); }
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="text-7xl mb-6">🎉</div>
        <h1 className="text-3xl font-bold text-[#4A4A4A] mb-3">报名成功！</h1>
        <p className="text-[#888] mb-8">已成功提交{club?.name||"社团"}的报名申请，请耐心等待审核 ✨</p>
        <div className="flex gap-4 justify-center">
          <Link href="/clubs" className="px-6 py-3 border-2 border-[#E6C6FF] text-[#9B7CB6] rounded-full font-semibold hover:bg-[#E6C6FF]/10 transition">浏览更多社团</Link>
          <Link href="/quiz" className="px-6 py-3 btn-macaron rounded-full font-semibold">继续智能匹配</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden py-12 px-4">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#FFB5BA]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-[#A8D8FF]/20 rounded-full blur-3xl" />
      </div>
      <div className="max-w-xl mx-auto relative">
        <Link href={`/clubs/${clubId}`} className="text-[#888] hover:text-[#FF8A9C] text-sm mb-6 inline-block transition">← 返回社团详情</Link>
        <div className="macaron-card rounded-3xl p-8">
          {/* Confirmation hint */}
          {club && (
            <div className="bg-[#FFE4B5]/10 border border-[#FFE4B5]/30 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{club.logo||"🎯"}</span>
                <div><div className="font-semibold text-[#4A4A4A]">{club.name}</div><div className="text-xs text-[#888]">{club.category} · {club.memberCount}人</div></div>
              </div>
              {club.requirements && <p className="text-xs text-[#D4A85A]">📌 招新要求：{club.requirements}</p>}
            </div>
          )}

          <h1 className="text-xl font-bold text-[#4A4A4A] mb-1">申请加入{club?.name||"社团"}</h1>
          <p className="text-sm text-[#888] mb-6">填写以下信息完成报名</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[{l:"姓名 *",k:"name",p:"请输入姓名",t:"text"},{l:"学号 *",k:"studentId",p:"请输入学号",t:"text"},{l:"联系电话",k:"phone",p:"请输入手机号",t:"tel"}].map(f=>(
              <div key={f.k}>
                <label className="block text-sm font-medium text-[#666] mb-1">{f.l}</label>
                <input type={f.t} value={form[f.k as keyof typeof form]} onChange={e=>setForm({...form,[f.k]:e.target.value})} className="w-full px-4 py-3 border border-[#E6C6FF]/30 rounded-xl focus:ring-2 focus:ring-[#FFB5BA]/30 focus:outline-none bg-white/70" placeholder={f.p}/>
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-[#666] mb-1">自我介绍</label>
              <textarea value={form.intro} onChange={e=>setForm({...form,intro:e.target.value})} rows={4} className="w-full px-4 py-3 border border-[#E6C6FF]/30 rounded-xl focus:ring-2 focus:ring-[#FFB5BA]/30 focus:outline-none bg-white/70 resize-none" placeholder="简单介绍一下自己..." />
            </div>
            <button type="submit" disabled={loading} className="w-full py-4 btn-macaron rounded-xl font-semibold text-lg disabled:opacity-50 mt-4">{loading?"提交中...":"提交报名 🎉"}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
