"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

// Extend Window interface for SpeechRecognition
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
    length: number;
  };
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  onresult: (event: SpeechRecognitionEvent) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

interface ExtendedWindow extends Window {
  SpeechRecognition?: { new (): SpeechRecognition };
  webkitSpeechRecognition?: { new (): SpeechRecognition };
}

export default function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const extWindow = window as unknown as ExtendedWindow;
      const SpeechRecognition = extWindow.SpeechRecognition || extWindow.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          let currentTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

  const processCommand = useCallback(async (text: string) => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: text }),
      });

      const data = await res.json();
      
      if (data.path) {
        setTranscript(`Navigating to ${data.path}...`);
        setTimeout(() => {
          setShowTooltip(false);
          setTranscript("");
          router.push(data.path);
        }, 1000);
      } else {
        setTranscript("Didn't understand that command.");
        setTimeout(() => {
          setShowTooltip(false);
          setTranscript("");
        }, 2000);
      }
    } catch (error) {
      console.error(error);
      setTranscript("Error processing command.");
      setTimeout(() => setShowTooltip(false), 2000);
    } finally {
      setIsProcessing(false);
    }
  }, [router]);

  // Process the transcript when listening stops and we have text
  useEffect(() => {
    if (!isListening && transcript.trim() && !isProcessing) {
      processCommand(transcript);
    }
  }, [isListening, transcript, isProcessing, processCommand]);
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Voice recognition is not supported in this browser. Try Chrome.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setTranscript("");
      setShowTooltip(true);
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {/* Tooltip / Transcript */}
      <div 
        className={`bg-surface border border-primary/20 backdrop-blur-xl p-4 rounded-2xl shadow-2xl transition-all duration-300 max-w-xs origin-bottom-right ${
          showTooltip || isProcessing ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"
        }`}
      >
        <p className="text-white text-sm">
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-primary" /> Thinking...
            </span>
          ) : transcript ? (
            `"${transcript}"`
          ) : (
            "Listening... Say 'Go to Roadmap' or 'Show me Playbooks'"
          )}
        </p>
      </div>

      {/* Mic Button */}
      <button
        onClick={toggleListening}
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
          isListening 
            ? "bg-red-500 hover:bg-red-600 shadow-red-500/40 animate-pulse" 
            : "bg-surface border border-white/10 hover:border-primary/50 text-white hover:text-primary"
        }`}
      >
        {isListening ? <Mic className="w-6 h-6 text-white" /> : <MicOff className="w-6 h-6" />}
      </button>
    </div>
  );
}
