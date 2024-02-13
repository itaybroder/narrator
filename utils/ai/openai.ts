import OpenAI from "openai";
import fs from "fs";
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function gezzerAnswers(
  prompt: string,
) {
  let prompt_template = `
    Your name is Gezzer. you work at GEZZER productions, you are a 3d carrot, that can talk, and you are sarcastic funny and sharp.
    you must answer in short sentences, and you must answer in a way that makes sense. you love PLAY FORTNITE. and very good at it 
  ${prompt}`;

  console.log(prompt_template);

  const stream = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-0125",
    messages: [{ role: "user", content: prompt_template }],
    stream: true,
  });

  return stream;
}

export async function transcribeAudio(audioBuffer: Buffer) {
  try {
     
    const tmpFilePath = '/tmp/audioBuffer.wav';
    fs.writeFileSync(tmpFilePath, audioBuffer);
    const stream = fs.createReadStream(tmpFilePath);

    const transcription = await openai.audio.transcriptions.create({
      file: stream,
      model: "whisper-1",
    });

    return transcription.text;
  } catch (error) {
    console.error("Error in transcribeAudio: ", error);
    throw error;
  }
}
