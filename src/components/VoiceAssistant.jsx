import React, { useState, useEffect } from "react";
import { FaMicrophone, FaStop } from "react-icons/fa";

function VoiceAssistant({ textToRead }) {
    const [isReading, setIsReading] = useState(false);
    const [voices, setVoices] = useState([]);

    // Load available voices
    useEffect(() => {
        const loadVoices = () => {
            let availableVoices = window.speechSynthesis.getVoices();
            if (availableVoices.length > 0) {
                const filteredVoices = availableVoices
                    .filter(voice =>
                        (voice.lang === "en-IN" || voice.lang === "hi-IN" || voice.lang === "mr-IN") &&
                        !voice.name.toLowerCase().includes("female")
                    )
                    .sort((a, b) => a.name.localeCompare(b.name));

                setVoices(filteredVoices);
                console.log("Loaded voices:", filteredVoices);
            }
        };

        // Handle mobile devices where voices might not load on time
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
        loadVoices();
    }, []);

    // Detect language
    const detectLanguage = (text) => {
        const hindiPattern = /[अ-ह]/;
        const marathiPattern = /[अ-ह]/;
        if (marathiPattern.test(text)) return "mr-IN";
        if (hindiPattern.test(text)) return "hi-IN";
        return "en-IN";
    };

    // Toggle reading function
    const toggleReading = () => {
        const synth = window.speechSynthesis;

        // Stop reading if currently speaking
        if (isReading) {
            synth.cancel();
            synth.pause();
            synth.resume();
            synth.cancel();
            setIsReading(false);
            return;
        }

        // Start reading if text is present
        if (textToRead) {
            // Load voices if not loaded
            if (voices.length === 0) {
                console.warn("Voices not loaded yet!");
                return;
            }

            const plainText = textToRead.replace(/<[^>]+>/g, "");
            const language = detectLanguage(plainText);

            const utterance = new SpeechSynthesisUtterance(plainText);
            utterance.lang = language;
            utterance.rate = 0.9;
            utterance.pitch = 1.0;

            const maleVoice = voices.find(voice => voice.lang === language) || voices[0];
            utterance.voice = maleVoice;

            utterance.onend = () => {
                setIsReading(false);
            };

            // Start speaking and update the state
            synth.speak(utterance);
            setIsReading(true);
        }
    };

    return (
        <button onClick={toggleReading} className={`voice-btn ${isReading ? "active" : ""}`}>
            {isReading ? <FaStop size={24} /> : <FaMicrophone size={24} />}
        </button>
    );
}

export default VoiceAssistant;
