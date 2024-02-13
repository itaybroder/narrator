import { NextRequest, NextResponse } from "next/server";
// import { transcribeAudio } from "@/utils/ai/transcribe";
import { generateVoiceStream } from "@/utils/ai/elvenlabs";
import { gezzerAnswers, transcribeAudio } from "@/utils/ai/openai";
import { Buffer } from "buffer";

async function getFormData(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get("file") as unknown as File;
 
  return { file };
}
async function transcribe(file: File) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  let transcription;
  try {
    transcription = await transcribeAudio(buffer);
  } catch (error) {
    throw new Error("Transcription failed");
  }
  return transcription;
}

async function generateAudioStream(
  chatCompletion: string,
  language: string,
  voice_id: string
) {
    let audioStream;
    if (chatCompletion == null) {
        throw new Error("Chat completion failed");
    }
    audioStream = await generateVoiceStream(chatCompletion, voice_id);

  return audioStream;
}

export async function POST(request: NextRequest) {
  try {
    const { file } = await getFormData(request);

    if (!file) {
      return NextResponse.json({ success: false });
    }
 
    const transcription = await transcribe(file);
    console.log("Transcription: " + transcription);
   

    const chatCompletionStream = await gezzerAnswers(transcription);

    const voice_id = "yoZ06aMxZJJ28mfd3POQ";
    const language = "en";

    const stream = generateCombinedAudioStream(
    chatCompletionStream as unknown as AsyncIterableIterator<any>,
    language,
    voice_id
    );

    return new NextResponse(stream, {
      headers: {
        AiResponse: "test",
        UserQuestion: "test",
      },
    });
  } catch (error: any) {
    console.log(error);
    return new NextResponse("ERROR from server", { status: 500 });
  }
}
function generateCombinedAudioStream(
  chatCompletionStream: AsyncIterableIterator<any>,
  language: string,
  voiceId: string
): ReadableStream<Uint8Array> {
  let sentence = "";

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      for await (const part of chatCompletionStream) {
        const content: string = part.choices[0]?.delta?.content || "";
        sentence += content;

        if (
          content.endsWith(".") ||
          content.endsWith("\n") ||
          content.endsWith("!")
        ) {
          console.log(`Processing sentence: "${sentence}"`);

          // Generate the audio stream for the current sentence
          const audioStream = await generateAudioStream(
            sentence,
            language,
            voiceId
          );

          // Accumulate audio data
          let chunks = [];
          for await (const chunk of audioStream) {
            chunks.push(chunk);
          }

          // Combine all chunks into a single buffer
          let combinedBuffer = new Uint8Array(
            chunks.reduce((acc, val) => acc.concat(Array.from(val)), [])
          );

          // Enqueue the combined buffer
          console.log("Sending complete audio stream for sentence...");
          console.log("Sending complete audio stream for sentence...");
          const dataToSend = {
            audio: Array.from(combinedBuffer),
            sentence: sentence,
          };
          controller.enqueue(
            new TextEncoder().encode(JSON.stringify(dataToSend))
          );
          //   controller.enqueue(combinedBuffer);

          console.log(
            "Finished processing and sending audio stream for sentence."
          );
          sentence = ""; // Reset sentence for the next iteration
        }
      }
      controller.close();
    },
  });
}
