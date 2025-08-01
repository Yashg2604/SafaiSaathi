import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json(
        { success: false, error: 'No audio file provided' },
        { status: 400 }
      );
    }

    console.log(`🎤 Received audio: ${audioFile.name}, size: ${audioFile.size}`);

    // Step 1: Transcribe using Sarvam REST API
    const transcription = await transcribeAudio(audioFile);
    if (!transcription) {
      return NextResponse.json(
        { success: false, error: 'Transcription failed' },
        { status: 500 }
      );
    }

    console.log('📝 Transcript:', transcription);

    // Step 2: Generate AI response using Gemini
    const { text: aiResponse, languageCode } = await generateResponse(transcription);

    // Step 3: Generate fallback audio via Gemini TTS
    const audioUrl = await generateAudio(aiResponse, languageCode);

    return NextResponse.json({
      success: true,
      transcription,
      responseText: aiResponse,
      languageCode,
      audioUrl
    });
  } catch (error) {
    console.error('❌ Voice query error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function transcribeAudio(audioFile: File): Promise<string | null> {
  try {
    const arrayBuffer = await audioFile.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: 'audio/wav' });

    const form = new FormData();
    form.append('file', blob, 'audio.wav');
    form.append('model', 'saarika:v2.5');
    form.append('language_code', 'unknown');

    console.log('🚀 Sending to Sarvam ASR...');
    const res = await fetch('https://api.sarvam.ai/speech-to-text', {
      method: 'POST',
      headers: {
        'api-subscription-key': process.env.SARVAM_API_KEY!,
      },
      body: form,
    });

    if (!res.ok) {
      console.error('Sarvam API error:', await res.text());
      return null;
    }

    const result = await res.json();
    console.log('✅ ASR Result:', result);

    return result.transcript || null;
  } catch (err) {
    console.error('❌ Transcription error:', err);
    return null;
  }
}

async function generateResponse(query: string): Promise<{ text: string, languageCode: string }> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const prompt = `You are VoiceX, a helpful AI assistant. Respond naturally:\n\nUser: ${query}`;

    const result = await model.generateContent(prompt);
    const text =
      result.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I'm sorry, I couldn't process that.";

    // Naive language detection based on script
    let languageCode = "en-IN";
    if (/[ऀ-ॿ]/.test(text)) languageCode = "hi-IN";
    else if (/[਀-੿]/.test(text)) languageCode = "pa-IN";

    return { text, languageCode };
  } catch (err) {
    console.error('❌ Gemini error:', err);
    return { text: "I'm sorry, I couldn't process your request right now. Please try again.", languageCode: "en-IN" };
  }
}

async function generateAudio(text: string, languageCode: string): Promise<string | null> {
  try {
    // Use Gemini's audio generation endpoint if available
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: `Convert this to speech in ${languageCode}: ${text}` }]}],
      generationConfig: { responseMimeType: "audio/mp3" }
    });

    const audioBase64 = result.response?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (audioBase64) {
      return `data:audio/mp3;base64,${audioBase64}`;
    }
    return null;
  } catch (err) {
    console.error("❌ Gemini TTS error:", err);
    return null;
  }
}
