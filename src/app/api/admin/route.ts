import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const applications = await prisma.application.findMany({
    include: { student: true, club: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(applications);
}

export async function PUT(request: Request) {
  const { id, status } = await request.json();
  await prisma.application.update({
    where: { id },
    data: { status },
  });
  return NextResponse.json({ success: true });
}
