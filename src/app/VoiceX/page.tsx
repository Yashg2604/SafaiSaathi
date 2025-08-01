"use client";
import React, { useState, useRef, useEffect } from "react";
import { Mic, Square, Volume2 } from "lucide-react";

export default function VoiceX() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [responseText, setResponseText] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if ("speechSynthesis" in window) {
      const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus"
      });
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunks.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { 
          type: "audio/webm;codecs=opus" 
        });
        audioChunks.current = [];
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
        
        await processAudio(audioBlob);
      };

      mediaRecorderRef.current.start(100); // Collect data every 100ms
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");

      const response = await fetch("/api/voice-query", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setResponseText(data.responseText);
        setAudioUrl(data.audioUrl);
        
        // Use browser TTS with detected language
        speakText(data.responseText, data.languageCode);

        if (data.audioUrl) {
          setIsPlaying(true);
        }
      } else {
        throw new Error(data.error || "Processing failed");
      }
    } catch (error) {
      console.error("Error processing audio:", error);
      setResponseText("Sorry, there was an error processing your request. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const speakText = (text: string, lang = "en-IN") => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);

      // Pick the correct voice based on language
      const voice =
        voices.find((v) => v.lang === lang) ||
        voices.find((v) => v.lang.toLowerCase().includes(lang.split("-")[0])) ||
        voices.find((v) => v.lang.toLowerCase().includes("en"));

      if (voice) {
        utterance.voice = voice;
      }
      utterance.lang = voice?.lang || lang;

      utterance.rate = 1;
      utterance.pitch = 1;

      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);

      window.speechSynthesis.speak(utterance);
    } else {
      console.error("Speech synthesis not supported");
    }
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
  };

  const replayAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      // Replay TTS if audioRef isn't available
      speakText(responseText, "en-IN");
    }
  };

  return (
    <div 
      className="flex flex-col items-center justify-center overflow-y-scroll- min-h-screen bg-gradient-to-b from-green-50 to-teal-100 px-4 text-center"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          🎤 VoiceX Assistant
        </h1>
        <p className="text-lg text-gray-600">
          Mic me boliye, AI insights/answers ke liye!
        </p>
      </div>

      {/* Recording Button */}
      <div className={`relative flex items-center justify-center ${
        isRecording ? "animate-pulse-glow" : ""
      }`}>
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
          className={`flex items-center justify-center w-24 h-24 rounded-full shadow-xl transition-all duration-300 ${
            isRecording 
              ? "bg-red-500 hover:bg-red-600" 
              : isProcessing
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {isRecording ? (
            <Square className="text-white w-12 h-12" />
          ) : (
            <Mic className="text-white w-12 h-12" />
          )}
        </button>
      </div>

      {/* Status */}
      <div className="mt-6 h-8">
        {isRecording && (
          <p className="text-red-600 font-medium animate-pulse">
            🔴 Recording... Tap to stop
          </p>
        )}
        {isProcessing && (
          <p className="text-blue-600 font-medium">
            🧠 Processing your voice...
          </p>
        )}
        {isPlaying && (
          <p className="text-green-600 font-medium">
            🔊 Playing response...
          </p>
        )}
      </div>

      {/* Response */}
      {responseText && (
        <div className="mt-8 bg-white shadow-lg p-6 rounded-xl w-full max-w-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">AI Response:</h3>
            <button
              onClick={replayAudio}
              className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Volume2 className="w-4 h-4" />
              Replay
            </button>
          </div>
          
          <p className="text-gray-700 leading-relaxed text-left">
            {responseText}
          </p>
          
          {audioUrl && (
            <audio
              ref={audioRef}
              className="mt-4 w-full"
              controls
              autoPlay
              onEnded={handleAudioEnd}
              src={audioUrl}
            />
          )}
        </div>
      )}

      {/* Custom styles */}
      <style jsx>{`
        @keyframes pulse-glow {
          0% {
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.6);
          }
          70% {
            box-shadow: 0 0 0 25px rgba(34, 197, 94, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
          }
        }
        .animate-pulse-glow button {
          animation: pulse-glow 1.5s infinite;
        }
      `}</style>
    </div>
  );
}
