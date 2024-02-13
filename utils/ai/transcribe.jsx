import axios from "axios";
import { Readable } from 'stream';
const FormData = require("form-data");

export async function transcribeAudio(audioBuffer) {
    try {
      console.log('Starting transcription process...');
      const  formData  =  new  FormData();
      console.log('FormData created:', formData);
      const  audioStream  =  bufferToStream(audioBuffer);
      console.log('Audio stream created:', audioStream);
      formData.append('file', audioStream, { filename: 'audio.wav', contentType: audioBuffer.mimetype });
      formData.append('model', 'whisper-1');
      formData.append('response_format', 'json');
      const  config  = {
        headers: {
          "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      };
      console.log('Config created:', config);
      // Call the OpenAI Whisper API to transcribe the audio
      console.log('Calling OpenAI Whisper API...');
      const  response  =  await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, config);
      console.log('Response received:', response);
      const  transcription  = response.data.text;
      console.log('Transcription:', transcription);
      return transcription;
    } catch (error) {
        console.error('Error during transcription:', error);
        throw error;
    }
}

// Convert a Buffer to a Readable Stream
const  bufferToStream  = (buffer) => {
  return  Readable.from(buffer);
}