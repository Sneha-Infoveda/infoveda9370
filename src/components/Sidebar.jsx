import React from 'react';
import { FiMenu, FiX } from 'react-icons/fi'; // FiX is a close icon

const Sidebar = ({ setQuery, isOpen, setIsOpen }) => {
    const questions = [
        "What are the four Vedas?",
        "Dharma, Karma and Moksha?",
        "What are the stages of life?",
        "How many Puranas?",
        "Concept and types of Vimanas?",
        "Types of Weapons in Atharvaved?",
        "Astrology and its key concepts?",
        "Metallurgy as per Vedas?",
        "Astronomy as per Vedas?",
        "Dharma in Puranas?",
        "Concept of ‘Shunya’ or Zero?",
        "Rituals and its significance?",
        "Geometrical concepts in Vedas?",
        "Puranas and kingship?"
    ];

    // Function to handle question click and close sidebar
    const handleQuestionClick = (question) => {
        setQuery(question);
        setIsOpen(false);  // Close sidebar after selecting a question
    };

    return (
        <div className={`side-panel ${isOpen ? 'open' : 'closed'}`}>
            {/* Toggle Button */}
            <div className="toggle-button" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </div>

            {/* Sidebar Content */}
            {isOpen && (
                <>
                    <div className="logo-container">
                        <h2 className="chatveda-text">ChatVeda AI</h2>
                    </div>

                    <ul className="conversation-list">
                        {questions.map((question, index) => (
                            <li 
                                key={index} 
                                onClick={()  =>{
                                    setQuery(question); 
                                    setIsOpen(false);
                                }}
                                className='clickable-item'
                            >
                                {question}
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default Sidebar;
