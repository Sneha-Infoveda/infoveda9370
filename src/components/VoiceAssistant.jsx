import React, { useState, useEffect } from "react";
import { FaVolumeUp, FaStop } from "react-icons/fa";  // Changed icon to speaker

function VoiceAssistant({ textToRead }) {
    const [isReading, setIsReading] = useState(false);
    const [voices, setVoices] = useState([]);
    const synth = window.speechSynthesis;

    // Load available voices (fixed)
    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = synth.getVoices();
            if (availableVoices.length > 0) {
                const filteredVoices = availableVoices
                    .filter(voice => voice.lang === "en-IN")
                    .sort((a, b) => a.name.localeCompare(b.name));
                setVoices(filteredVoices);
                console.log("Loaded voices:", filteredVoices);
            }
        };

        // Load voices initially
        loadVoices();

        // Attach the event listener only once
        if (synth.onvoiceschanged !== undefined) {
            synth.onvoiceschanged = loadVoices;
        }
    }, []);

    // Clean and format the text for better pronunciation
    const cleanText = (text) => {
        return text
            .replace(/<[^>]+>/g, "")         // Remove HTML tags
            .replace(/[\/\\#@*~^_`|<>{}[\]()]/g, "") // Remove unnecessary symbols
            .replace(/(\r\n|\n|\r)/gm, " ")  // Replace line breaks with spaces
            .replace(/[.,!?:;]+/g, ".");     // Normalize punctuation to full stops
    };

    // Toggle reading function
    const toggleReading = () => {
        if (isReading) {
            synth.cancel(); // Stop speaking
            setIsReading(false);
            return;
        }

        if (textToRead) {
            const plainText = cleanText(textToRead);

            const utterance = new SpeechSynthesisUtterance(plainText);
            utterance.lang = "en-IN";  // Set language to Indian English
            utterance.rate = 0.95;     // Slightly slower for better clarity
            utterance.pitch = 1.0;

            const indianVoice = voices.find(voice => voice.lang === "en-IN") || voices[0];
            utterance.voice = indianVoice;

            utterance.onend = () => {
                setIsReading(false);
            };

            synth.speak(utterance);
            setIsReading(true);
        }
    };

    return (
        <button onClick={toggleReading} className={`voice-btn ${isReading ? "active" : ""}`}>
            {isReading ? <FaStop size={24} /> : <FaVolumeUp size={24} />}  {/* Changed to speaker icon */}
        </button>
    );
}

export default VoiceAssistant;
