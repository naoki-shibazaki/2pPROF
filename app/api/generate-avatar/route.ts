import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { imageBase64 } = await req.json()
    if (!imageBase64) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    // Step 1: GPT-4o で人物の特徴を取得
    const visionRes = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: { url: imageBase64, detail: 'low' },
            },
            {
              type: 'text',
              text: 'Describe this person\'s appearance briefly for a pixel art chibi character: hair color and style, skin tone, eye color, notable features, outfit colors. Keep it under 60 words.',
            },
          ],
        },
      ],
      max_tokens: 150,
    })

    const description = visionRes.choices[0].message.content ?? 'a person'

    // Step 2: DALL-E 3 でドット絵キャラ生成
    const imgRes = await openai.images.generate({
      model: 'dall-e-3',
      prompt: `Pixel art chibi character portrait, cute and adorable, 16-bit retro RPG game style, ${description}. Centered face and upper body, synthwave cyberpunk color palette, thick black pixel outlines, flat shading, no background, clean sprite style. High quality pixel art.`,
      n: 1,
      size: '1024x1024',
      response_format: 'b64_json',
    })

    const b64 = imgRes.data[0].b64_json
    if (!b64) {
      return NextResponse.json({ error: 'Image generation failed' }, { status: 500 })
    }

    return NextResponse.json({ imageBase64: `data:image/png;base64,${b64}` })
  } catch (err) {
    console.error(err)
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
