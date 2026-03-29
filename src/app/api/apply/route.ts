import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { name, studentId, phone, intro, clubId } = await request.json();

    // Create or find student
    let student = await prisma.student.findUnique({
      where: { studentId },
    });
    if (!student) {
      student = await prisma.student.create({
        data: { name, studentId, phone: phone || "" },
      });
    }

    // Create application
    const application = await prisma.application.create({
      data: {
        studentId: student.id,
        clubId,
        intro: intro || "",
        status: "pending",
      },
    });

    return NextResponse.json({ success: true, id: application.id });
  } catch (error) {
    console.error("Apply error:", error);
    return NextResponse.json({ error: "报名失败" }, { status: 500 });
  }
}
