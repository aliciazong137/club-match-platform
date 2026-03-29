"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface AppRecord {
  id: number;
  clubId: number;
  clubName: string;
  clubLogo: string;
  clubCategory: string;
  status: string;
  intro: string;
  createdAt: string;
}

const statusMap: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "待审核", color: "#D97706", bg: "#FFF8E1" },
  reviewing: { label: "审核中", color: "#2563EB", bg: "#EFF6FF" },
  approved: { label: "已通过", color: "#16A34A", bg: "#F0FDF4" },
  rejected: { label: "未通过", color: "#DC2626", bg: "#FEF2F2" },
};

export default function MyApplicationsPage() {
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [apps, setApps] = useState<AppRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem("myStudentId");
    if (saved) {
      setStudentId(saved);
      doSearch(saved);
    }
  }, []);

  const doSearch = async (id: string) => {
    if (!id.trim()) return;
    setLoading(true);
    setSearched(true);
    sessionStorage.setItem("myStudentId", id.trim());
    try {
      const res = await fetch(`/api/my-applications?studentId=${encodeURIComponent(id.trim())}`);
      const data = await res.json();
      setApps(data.applications || []);
      setStudentName(data.studentName || "");
    } catch {
      setApps([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-[#f7f7f5] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-2">我的报名</h1>
        <p className="text-sm text-[#888] mb-6">输入报名时使用的学号，查看所有社团报名进度</p>

        {/* Search bar */}
        <div className="flex gap-3 mb-8">
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && doSearch(studentId)}
            placeholder="请输入你的学号"
            className="flex-1 px-4 py-3 bg-white border-2 border-[#eee] rounded-xl text-sm focus:outline-none focus:border-[#2B7DE9] transition"
          />
          <button
            onClick={() => doSearch(studentId)}
            disabled={!studentId.trim() || loading}
            className="px-6 py-3 bg-[#2B7DE9] text-white rounded-xl font-medium text-sm hover:bg-[#1a6dd6] hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:hover:scale-100"
          >
            {loading ? "查询中..." : "查询"}
          </button>
        </div>

        {/* Results */}
        {searched && !loading && (
          <>
            {studentName && (
              <p className="text-sm text-[#555] mb-4">
                {studentName}同学，你共报名了 <span className="font-bold text-[#2B7DE9]">{apps.length}</span> 个社团
              </p>
            )}

            {apps.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">📭</div>
                <p className="text-[#888] mb-2">还没有报名记录</p>
                <p className="text-sm text-[#aaa] mb-6">去看看有哪些社团适合你吧</p>
                <Link
                  href="/clubs"
                  className="inline-block px-6 py-3 bg-[#2B7DE9] text-white rounded-xl font-medium text-sm hover:bg-[#1a6dd6] hover:scale-105 active:scale-95 transition-all"
                >
                  探索社团
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {apps.map((app) => {
                  const s = statusMap[app.status] || statusMap.pending;
                  return (
                    <div key={app.id} className="bg-white rounded-2xl border border-[#eee] p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4">
                        <span className="text-3xl">{app.clubLogo}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-[#1a1a1a] truncate">{app.clubName}</span>
                            <span
                              className="text-xs px-2.5 py-1 rounded-full font-medium shrink-0"
                              style={{ color: s.color, backgroundColor: s.bg }}
                            >
                              {s.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-[#999]">
                            <span>{app.clubCategory}</span>
                            <span>{formatDate(app.createdAt)}</span>
                          </div>
                        </div>
                        <Link
                          href={`/clubs/${app.clubId}`}
                          className="text-xs px-3 py-1.5 border border-[#eee] rounded-full text-[#888] hover:border-[#2B7DE9] hover:text-[#2B7DE9] transition shrink-0"
                        >
                          查看社团
                        </Link>
                      </div>
                      {app.intro && (
                        <div className="mt-3 pt-3 border-t border-[#f5f5f5]">
                          <p className="text-xs text-[#999] line-clamp-2">{app.intro}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
