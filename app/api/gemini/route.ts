import { NextResponse } from 'next/server';

export async function POST(req: { json: () => PromiseLike<{ prompt: any; }> | { prompt: any; }; }) {
  try {
    const { prompt } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'API Key not configured' }, { status: 500 });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
    
    const systemPrompt = "You are an expert in the Sufficiency Economy Philosophy (SEP) for civil servants. Analyze the user's problem and provide advice structured by the 3 Principles (Moderation, Reasonableness, Immunity). Use Thai language. Be polite (use ครับ). Format with Markdown. Use Bullet points.";

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `ช่วยวิเคราะห์และให้คำแนะนำในการแก้ปัญหาหรือปฏิบัติตนตามหลักเศรษฐกิจพอเพียง (3 ห่วง 2 เงื่อนไข) สำหรับสถานการณ์นี้: "${prompt}"` }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] }
      })
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    return NextResponse.json({ result: data.candidates[0].content.parts[0].text });

  } catch (error) {
    console.error('API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}