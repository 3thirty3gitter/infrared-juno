import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const useVoiceAssistant = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState(null);
    const recognitionRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false; // Stop after one sentence
            recognitionRef.current.interimResults = true; // Show typing effect
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onstart = () => {
                setIsListening(true);
                setError(null);
            };

            recognitionRef.current.onresult = (event) => {
                let intermTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcriptPart = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        setTranscript(transcriptPart);
                        handleCommand(transcriptPart);
                    } else {
                        intermTranscript += transcriptPart;
                        setTranscript(intermTranscript);
                    }
                }
            };

            recognitionRef.current.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                setError(event.error);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        } else {
            setError("Browser not supported");
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    const startListening = () => {
        if (recognitionRef.current) {
            setTranscript('');
            try {
                recognitionRef.current.start();
            } catch (e) {
                console.error("Already started", e);
            }
        } else {
            alert("Voice features not supported on this device/browser.");
        }
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    };

    const handleCommand = (command) => {
        const lowerCmd = command.toLowerCase().trim();
        console.log("Voice Command:", lowerCmd);

        // Logic for handling commands
        // 1. "Where is [item]?" or "Find [item]"
        if (lowerCmd.includes('where is') || lowerCmd.includes('find') || lowerCmd.includes('search for')) {
            const query = lowerCmd
                .replace('where is', '')
                .replace('find', '')
                .replace('search for', '')
                .replace('my', '') // "Where is MY drill" -> "drill"
                .trim();

            if (query) {
                navigate(`/dashboard?q=${encodeURIComponent(query)}`);
            }
        }
        // 2. "Show me [tub]" or "Go to [tub]"
        else if (lowerCmd.includes('show me') || lowerCmd.includes('go to')) {
            const query = lowerCmd
                .replace('show me', '')
                .replace('go to', '')
                .trim();
            // For tubs, we might need a search page generally, or redirect to Tubs list with filter
            navigate(`/tubs?q=${encodeURIComponent(query)}`);
        }
        // 3. Fallback: Just search whatever they said
        else {
            navigate(`/dashboard?q=${encodeURIComponent(lowerCmd)}`);
        }
    };

    return {
        isListening,
        transcript,
        error,
        startListening,
        stopListening
    };
};

export default useVoiceAssistant;
