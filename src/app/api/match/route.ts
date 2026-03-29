import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { extractInterestTags, generateMatchReasons } from "@/lib/claude";

export async function POST(request: Request) {
  try {
    const { answers, studentInfo } = await request.json();

    // Create or find student
    let student = await prisma.student.findUnique({
      where: { studentId: studentInfo.studentId },
    });
    if (!student) {
      student = await prisma.student.create({
        data: {
          name: studentInfo.name,
          studentId: studentInfo.studentId,
          major: studentInfo.major || "",
          grade: studentInfo.grade || "",
        },
      });
    }

    // Save quiz response
    const quizResponse = await prisma.quizResponse.create({
      data: {
        studentId: student.id,
        answers: JSON.stringify(answers),
      },
    });

    // Extract tags with Claude AI
    const tags = await extractInterestTags(answers);

    // Update quiz response with extracted tags
    await prisma.quizResponse.update({
      where: { id: quizResponse.id },
      data: { extractedTags: JSON.stringify(tags) },
    });

    // Get all clubs
    const clubs = await prisma.club.findMany();
    const clubsForMatch = clubs.map((c) => ({
      name: c.name,
      tags: JSON.parse(c.tags) as string[],
      description: c.description,
    }));

    // Generate match results with Claude AI
    const matchResults = await generateMatchReasons(tags, clubsForMatch, answers);

    // Save match results and build response
    const matches = [];
    for (const result of matchResults) {
      const club = clubs.find((c) => c.name === result.clubName);
      if (club) {
        await prisma.matchResult.create({
          data: {
            studentId: student.id,
            clubId: club.id,
            score: result.score,
            reason: result.reason,
          },
        });
        matches.push({
          clubName: club.name,
          clubId: club.id,
          score: result.score,
          reason: result.reason,
          category: club.category,
          logo: club.logo,
        });
      }
    }

    // Generate persona summary
    const persona = `你偏好${tags.slice(0, 3).join("、")}类活动，适合${matchResults.length > 0 && matchResults[0].score > 70 ? "深度参与型" : "轻度体验型"}社团。`;

    return NextResponse.json({ tags, matches, persona });
  } catch (error) {
    console.error("Match error:", error);
    return NextResponse.json(
      { error: "匹配服务暂时不可用，请稍后重试" },
      { status: 500 }
    );
  }
}
