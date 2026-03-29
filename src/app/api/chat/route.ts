import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { chatWithAI } from "@/lib/claude";

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    // Get clubs context with IDs
    const clubs = await prisma.club.findMany();
    const clubsContext = clubs
      .map(
        (c) =>
          `[ID:${c.id}] ${c.name}（${c.category}，${c.logo}）：${c.description} | 标签：${c.tags} | 人数：${c.memberCount} | 团费：${c.fee}`
      )
      .join("\n");

    const reply = await chatWithAI(message, clubsContext);
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({
      reply: JSON.stringify({ text: "抱歉，我暂时无法回答，请稍后再试～", clubs: [] }),
    });
  }
}
