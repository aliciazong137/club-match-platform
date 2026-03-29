"use client";
import { useEffect, useState } from "react";

interface Application { id:number; status:string; intro:string; createdAt:string; student:{name:string;studentId:string;major:string;grade:string}; club:{name:string;logo:string}; }
interface Club { id:number; name:string; logo:string; memberCount:number; category:string; }

const statusMap:Record<string,{text:string;color:string}> = {
  pending:{text:"待审核",color:"bg-[#FFE4B5] text-[#D4A85A]"},
  reviewing:{text:"审核中",color:"bg-[#A8D8FF] text-[#5BA3D0]"},
  approved:{text:"已通过",color:"bg-[#B8E6B8] text-[#6CB46C]"},
  rejected:{text:"未通过",color:"bg-[#FFB5BA] text-[#FF8A9C]"},
};

export default function AdminPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [tab, setTab] = useState<"apps"|"clubs">("apps");
  const [loading, setLoading] = useState(true);

  useEffect(()=>{Promise.all([fetch("/api/admin").then(r=>r.json()),fetch("/api/clubs").then(r=>r.json())]).then(([a,c])=>{setApps(a);setClubs(c);setLoading(false);});}, []);

  const updateStatus = async (id:number, status:string) => {
    await fetch("/api/admin",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({id,status})});
    setApps(prev=>prev.map(a=>a.id===id?{...a,status}:a));
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-[#E6C6FF]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-[#A8D8FF]/20 rounded-full blur-3xl" />
      </div>
      <div className="max-w-5xl mx-auto px-4 py-12 relative">
        <h1 className="text-4xl font-bold text-[#4A4A4A] mb-8">管理<span className="text-gradient">后台</span></h1>
        <div className="flex gap-2 mb-6">
          <button onClick={()=>setTab("apps")} className={`px-5 py-2.5 rounded-full text-sm font-medium transition ${tab==="apps"?"bg-[#FFB5BA] text-white shadow-lg":"bg-white/70 text-[#666] border border-[#E6C6FF]/30"}`}>报名管理 ({apps.length})</button>
          <button onClick={()=>setTab("clubs")} className={`px-5 py-2.5 rounded-full text-sm font-medium transition ${tab==="clubs"?"bg-[#A8D8FF] text-white shadow-lg":"bg-white/70 text-[#666] border border-[#E6C6FF]/30"}`}>社团总览 ({clubs.length})</button>
        </div>

        {loading ? <div className="text-center py-20 text-[#888]">加载中...</div> : tab==="apps" ? (
          apps.length===0 ? <div className="text-center py-20 text-[#888]">暂无报名申请</div> : (
            <div className="space-y-4">
              {apps.map(app=>(
                <div key={app.id} className="macaron-card rounded-xl p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{app.club.logo}</span>
                      <div>
                        <div className="font-semibold text-[#4A4A4A]">{app.student.name} <span className="text-[#888] font-normal text-sm">({app.student.studentId})</span></div>
                        <div className="text-sm text-[#888]">申请 {app.club.name}{app.student.major&&` · ${app.student.major}`}</div>
                      </div>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full ${statusMap[app.status]?.color||"bg-[#F5F5F5]"}`}>{statusMap[app.status]?.text||app.status}</span>
                  </div>
                  {app.intro && <p className="mt-3 text-sm text-[#666] bg-white/50 rounded-lg p-3">{app.intro}</p>}
                  <div className="mt-3 flex gap-2 justify-end">
                    <button onClick={()=>updateStatus(app.id,"approved")} className="px-4 py-1.5 text-sm bg-[#B8E6B8] text-[#4A4A4A] rounded-full hover:opacity-80 transition font-medium">通过</button>
                    <button onClick={()=>updateStatus(app.id,"rejected")} className="px-4 py-1.5 text-sm bg-[#FFB5BA] text-[#4A4A4A] rounded-full hover:opacity-80 transition font-medium">拒绝</button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {clubs.map(club=>(
              <div key={club.id} className="macaron-card rounded-xl p-5">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{club.logo}</span>
                  <div>
                    <div className="font-semibold text-[#4A4A4A]">{club.name}</div>
                    <div className="text-sm text-[#888]">{club.category} · {club.memberCount}人</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
