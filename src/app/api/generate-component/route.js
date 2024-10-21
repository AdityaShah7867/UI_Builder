import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyDgi7Mi1ikaWrkicXnL_zZj9iOCnwlu3lg');

export async function POST(req) {
  const { prompt } = await req.json();

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(`
      You are an expert UI/UX designer and front-end developer tasked with creating professional, modern, and responsive HTML components.

      Generate an HTML component based on this description: ${prompt}

      Follow these guidelines:
      1. Use semantic HTML5 elements where appropriate (e.g., header, nav, main, footer).
      2. Implement responsive design principles using flexbox or CSS grid.
      3. Follow accessibility best practices (WCAG 2.1 guidelines).
      4. Use modern CSS techniques for styling, including custom properties (CSS variables) for theming.
      5. Incorporate subtle animations or transitions for enhanced user experience.
      6. Ensure the design is clean, minimalist, and follows current market trends.
      7. Use a color scheme that's professional and easy on the eyes (e.g., neutral colors with accent colors for important elements).
      8. Include appropriate aria labels and roles for accessibility.
      9. Optimize for performance by using efficient CSS selectors and minimal inline styles.
      10. Ensure the component is easily integrable into popular frameworks like React, Vue, or Angular.

      Provide only the HTML and CSS code without any explanation or markdown formatting. Include internal CSS styles within a <style> tag.
    `);

    const generatedHtml = result.response.text().trim();

    return NextResponse.json({ html: generatedHtml });
  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json({ error: 'Failed to generate component' }, { status: 500 });
  }
}
