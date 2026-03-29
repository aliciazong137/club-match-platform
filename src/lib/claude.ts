import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export async function extractInterestTags(answers: Record<string, string>): Promise<string[]> {
  const prompt = `你是一个高校社团招新顾问。根据以下学生的问卷回答，提取出5-10个兴趣标签（如：编程、摄影、篮球、辩论、公益等）。
同时考虑学生的专业背景、加入动机、氛围偏好、参与深度和活动类型偏好来丰富标签。

学生回答：
${Object.entries(answers).map(([q, a]) => `${q}：${a}`).join("\n")}

请只返回JSON数组格式的标签列表，例如：["编程","摄影","音乐","竞赛","社交"]
不要返回其他任何内容。`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 300,
    messages: [{ role: "user", content: prompt }],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";
  try {
    const match = text.match(/\[.*\]/s);
    return match ? JSON.parse(match[0]) : [];
  } catch {
    return [];
  }
}

export async function generateMatchReasons(
  studentTags: string[],
  clubs: { name: string; tags: string[]; description: string }[],
  studentAnswers?: Record<string, string>
): Promise<{ clubName: string; score: number; reason: string }[]> {
  const extraContext = studentAnswers
    ? `\n\n学生详细画像：
- 专业方向：${studentAnswers["专业方向"] || "未知"}
- 加入动机：${studentAnswers["加入动机"] || "未知"}
- 氛围偏好：${studentAnswers["社团氛围偏好"] || "未知"}
- 参与深度：${studentAnswers["参与深度和时间"] || "未知"}
- 活动偏好：${studentAnswers["活动类型偏好"] || "未知"}`
    : "";

  const prompt = `你是一个高校社团招新顾问。根据学生的兴趣标签、个人画像和社团信息，为每个社团生成匹配度评分和推荐理由。

学生兴趣标签：${JSON.stringify(studentTags)}${extraContext}

社团列表：
${clubs.map((c) => `- ${c.name}（标签：${c.tags.join("、")}）：${c.description}`).join("\n")}

评分时请综合考虑：兴趣匹配度（最重要）、动机契合度、氛围匹配度、参与深度适配、活动类型吻合度。专业方向仅作参考。

请返回JSON数组，每项包含 clubName、score(0-100整数)、reason(一句话推荐理由)。
按score从高到低排序，只返回前5个最匹配的社团。
格式示例：[{"clubName":"编程社","score":95,"reason":"你对编程的热情与编程社的技术氛围非常契合"}]
只返回JSON，不要其他内容。`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 800,
    messages: [{ role: "user", content: prompt }],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";
  try {
    const match = text.match(/\[.*\]/s);
    return match ? JSON.parse(match[0]) : [];
  } catch {
    return [];
  }
}

export async function chatWithAI(
  userMessage: string,
  clubsContext: string
): Promise<string> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 600,
    system: `你是高校社团招新助手「团团」。回复要求：
1. 说话简短亲切，像朋友聊天，每次回复不超过2句话
2. 绝对不要用 ** - ## 等markdown符号，纯文字回复
3. 只要回复涉及具体社团，就必须在clubs数组中列出，让用户能直接点击查看和报名
4. 回复必须是JSON格式：{"text":"简短回复","clubs":[{"id":社团ID,"name":"社团名","logo":"emoji","fee":"团费信息"}]}
5. 如果不涉及具体社团，clubs返回空数组[]
6. 不要在text里重复列举社团名字和费用，把具体信息放在clubs数组里，text只说总结性的话
7. 不要问太多问题，用户说一个关键词就直接推荐

社团列表：
${clubsContext}

示例：
用户：哪些社团要团费
回复：{"text":"大部分社团都免费哦！有些需要器材或场地的会收一点费用，都花在刀刃上～","clubs":[{"id":28,"name":"街舞社","logo":"💃","fee":"80元/学期"},{"id":32,"name":"机器人创新工坊","logo":"🤖","fee":"80元/学期"},{"id":14,"name":"星辰摄影协会","logo":"📸","fee":"60元/学期"},{"id":47,"name":"电竞社","logo":"🎮","fee":"60元/学期"}]}

用户：我喜欢编程
回复：{"text":"编程爱好者来啦！这几个社团超适合你～","clubs":[{"id":13,"name":"代码创想社","logo":"💻","fee":"50元/学期"},{"id":32,"name":"机器人创新工坊","logo":"🤖","fee":"80元/学期"}]}

用户：有免费的社团吗
回复：{"text":"免费的社团超多的！这些都不用交团费～","clubs":[{"id":15,"name":"风华辩论社","logo":"⚖️","fee":"免费"},{"id":16,"name":"绿芽志愿者协会","logo":"🌱","fee":"免费"},{"id":33,"name":"读书会","logo":"📚","fee":"免费"}]}

用户：你好
回复：{"text":"嗨！我是团团，告诉我你喜欢什么，我帮你找最合适的社团～","clubs":[]}`,
    messages: [{ role: "user", content: userMessage }],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";
  // Ensure valid JSON response
  try {
    const match = text.match(/\{.*\}/s);
    if (match) {
      JSON.parse(match[0]); // validate
      return match[0];
    }
  } catch {}
  return JSON.stringify({ text: text.replace(/[*#\-]/g, "").trim(), clubs: [] });
}
