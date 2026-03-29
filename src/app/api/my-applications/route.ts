import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");

    if (!studentId) {
      return NextResponse.json({ error: "请提供学号" }, { status: 400 });
    }

    const student = await prisma.student.findUnique({
      where: { studentId },
    });

    if (!student) {
      return NextResponse.json({ applications: [] });
    }

    const applications = await prisma.application.findMany({
      where: { studentId: student.id },
      include: { club: true },
      orderBy: { createdAt: "desc" },
    });

    const result = applications.map((app) => ({
      id: app.id,
      clubId: app.club.id,
      clubName: app.club.name,
      clubLogo: app.club.logo,
      clubCategory: app.club.category,
      status: app.status,
      intro: app.intro,
      createdAt: app.createdAt.toISOString(),
    }));

    return NextResponse.json({ applications: result, studentName: student.name });
  } catch (error) {
    console.error("My applications error:", error);
    return NextResponse.json({ error: "查询失败" }, { status: 500 });
  }
}
