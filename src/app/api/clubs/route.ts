import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    const club = await prisma.club.findUnique({ where: { id: Number(id) } });
    if (!club) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(club);
  }

  const clubs = await prisma.club.findMany({ orderBy: { memberCount: "desc" } });
  return NextResponse.json(clubs);
}
