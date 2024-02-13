import axios from "axios";
const apiKey = process.env.ELVENLABS_API_KEY;
const voiceID = process.env.DEFAULT_VOICE_ID;

const stability = 0.5;
const similarityBoost = 0.75;

const modelId = "eleven_turbo_v2";

export const generateVoiceStream = async (text: string, voiceId = voiceID) => {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream?optimize_streaming_latency=4`;
  const headers = {
    accept: "*/*",
    "xi-api-key": apiKey,
    "Content-Type": "application/json",
  };
  const data = {
    text: text,
    model_id: modelId,
    voice_settings: {
      stability: stability,
      similarity_boost: similarityBoost,
    },
  };

  try {
    const audioResponse = await axios.post(url, data, {
      headers: headers,
      responseType: "stream",
    });

    return audioResponse.data; // This returns the stream
  } catch (error) {
    throw error;
  }
};
