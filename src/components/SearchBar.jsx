import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ query, setQuery, setChatHistory, language, setLanguage, setIsGenerating }) => {
    const [loading, setLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false); // Track recording state

    const handleSearch = async () => {
        // Ensure query is defined and not just whitespace
        if (!query || !query.trim()) return;
        setLoading(true);
        setIsGenerating(true);  // Show "Generating answer..." in ChatContainer

        // Add user message to chat history
        setChatHistory(prevChat => [
            ...prevChat,
            { text: query, isUser: true }
        ]);

        try {
            const res = await fetch("https://chatveda.onrender.com/get_answer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question: query, language }) // Send selected language
            });

            const data = await res.json();

            // Add bot response to chat history
            setChatHistory(prevChat => [
                ...prevChat,
                { text: data.response, isUser: false, followUpQuestions: data.follow_up_questions || [] }
            ]);

            setQuery(""); // Clear input field after sending
        } catch (error) {
            console.error("Error fetching response:", error);
        } finally {
            setLoading(false);
            setIsGenerating(false);  // Hide "Generating answer..." when response arrives
        }
    };

    // Trigger search on Enter key press
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    // Handle voice input using Web Speech API
    const handleVoiceInput = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert('Sorry, your browser does not support speech recognition.');
            return;
        }

        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = language === "hi" ? "hi-IN" : language === "mr" ? "mr-IN" : "en-US";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setIsRecording(true);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setQuery(transcript);
            handleSearch();  // Automatically search after recording
            setIsRecording(false);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            setIsRecording(false);
        };

        recognition.onend = () => {
            setIsRecording(false);
        };

        recognition.start();
    };

    return (
        <div className="search-bar">
            <input 
                type="text"
                value={query || ""}  // Default to empty string if query is undefined
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress} // Detect Enter key
                placeholder="Ask anything..."
                disabled={loading}
            />

            {/* Voice Input Button */}
            <button 
                onClick={handleVoiceInput} 
                className={`voice-button ${isRecording ? 'recording' : ''}`}
                title={isRecording ? "Recording..." : "Click to speak"}
            >
                {isRecording ? (
                    <i className="fas fa-microphone-slash"></i>
                ) : (
                    <i className="fas fa-microphone"></i>
                )}
            </button>

            {/* Search Button */}
            <button onClick={handleSearch} disabled={loading}>
                {loading ? ". . ." : <i className="fas fa-paper-plane"></i>}
            </button>

            {/* Language Selection Dropdown */}
            <select
                id="language-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
            >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="mr">Marathi</option>
            </select>
        </div>
    );
};

export default SearchBar;
