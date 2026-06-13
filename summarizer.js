require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");
const OpenAI = require("openai");

const ai = new GoogleGenAI({ apiKey: process.env.google_api_key });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function summarizeText(text) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: "You are a highly skilled summarizer. Provide a clear, concise summary that captures the key points of the given text. Keep the summary focused and avoid unnecessary details." },
            { text: `Please summarize the following text:\n\n${text}` }
          ]
        }
      ],
      config: { temperature: 0.3 }
    });
    return response.text;
  } catch (googleError) {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a highly skilled summarizer. Provide a clear, concise summary that captures the key points of the given text. Keep the summary focused and avoid unnecessary details.",
        },
        {
          role: "user",
          content: `Please summarize the following text:\n\n${text}`,
        },
      ],
      temperature: 0.3,
    });
    return response.choices[0].message.content;
  }
}

const sampleText = `
The Industrial Revolution, which began in Britain in the late 18th century, marked a major turning point in human history. It was a period of profound technological, socioeconomic, and cultural change. Key innovations such as the steam engine, the spinning jenny, and the power loom revolutionized manufacturing and transportation. Industries shifted from manual labor and animal-powered methods to machine-based manufacturing. This led to rapid urbanization as people moved from rural areas to cities in search of work in factories. While the Industrial Revolution brought about economic growth and improved living standards over time, it also introduced significant challenges including poor working conditions, child labor, and environmental pollution. The effects of this era are still felt today, shaping modern industrial economies and labor practices around the world.
`;

async function main() {
  try {
    console.log("Generating summary...\n");
    const summary = await summarizeText(sampleText);
    console.log("=== Summary ===\n");
    console.log(summary);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main();
