'use server'

import OpenAI from 'openai';
import mjml2html from 'mjml';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateEmail(prompt: string) {
  if (!prompt) return { error: 'Please enter a prompt' };

  try {
    // 1. نكلم الـ AI ونطلب منه MJML حصراً
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a Senior Email Developer.
          - Your goal is to write MJML code based on user requests.
          - Return ONLY the raw MJML code.
          - Do NOT use Markdown formatting (no \`\`\`xml).
          - Use professional colors (Blue/White/Gray) suitable for business.
          - Always include a CTA button.`
        },
        { role: "user", content: prompt },
      ],
      model: "gpt-3.5-turbo", // أو gpt-4o لو حسابك يسمح
    });

    let mjmlCode = completion.choices[0].message.content || '';

    // تنظيف الكود لو الـ AI غلط وحط علامات Markdown
    mjmlCode = mjmlCode.replace(/```xml/g, '').replace(/```/g, '');

    // 2. نحول الـ MJML لـ HTML حقيقي يشتغل في كل الإيميلات
    const { html, errors } = mjml2html(mjmlCode);

    if (errors.length > 0) {
      console.log('MJML Warnings:', errors);
    }

    return { success: true, html: html, mjml: mjmlCode };

  } catch (error) {
    console.error('Error:', error);
    return { error: 'Failed to generate email.' };
  }
}