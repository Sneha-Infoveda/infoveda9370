import React, { useEffect, useRef } from "react";
import VoiceAssistant from "./VoiceAssistant";  // Import VoiceAssistant component
import "./ChatContainer.css";

const ChatContainer = ({ chatHistory, isGenerating, sendMessage }) => {
    const chatContainerRef = useRef(null);

    // Auto-scroll to the bottom when chat history or isGenerating changes.
    useEffect(() => {
        if (chatContainerRef.current) {
            setTimeout(() => {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }, 100);
        }
    }, [chatHistory, isGenerating]);

    // If no messages, do not render the chat container.
    if (!chatHistory || chatHistory.length === 0) return null;

    return (
        <div className="chat-container" ref={chatContainerRef}>
            {chatHistory.map((chat, index) => (
                <div key={index} className={`chat-message ${chat.isUser ? "user" : "bot"}`}>
                    <p className="message-sender">{chat.isUser ? "Seeker" : "ChatVeda"}</p>
                    <div className="message-bubble">
                        <div dangerouslySetInnerHTML={{ __html: chat.text }} />
                        {/* Add the Voice Assistant button only for bot responses */}
                        {!chat.isUser && (
                            <VoiceAssistant textToRead={chat.text.replace(/<[^>]+>/g, "")} />
                        )}
                    </div>
                    {/* Render follow-up questions (if any) */}
                    {!chat.isUser && chat.followUpQuestions && chat.followUpQuestions.length > 0 && (
                        <div className="followup-questions">
                            <p>Follow-up Questions:</p>
                            {chat.followUpQuestions.map((q, i) => (
                                <button key={i} onClick={() => sendMessage(q)}>
                                    {q}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            ))}

            {/* Show a generating message when waiting on the API/response */}
            {isGenerating && (
                <div className="chat-message bot">
                    <p className="message-sender">ChatVeda</p>
                    <div className="message-bubble">Generating answer, please wait...</div>
                </div>
            )}
        </div>
    );
};

export default ChatContainer;
