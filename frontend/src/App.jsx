import { useState, useEffect } from "react";
import "./App.css";
import './index.css';

function App() {
    const [text, setText] = useState("");
    const [imageURL, setImageURL] = useState("");
    const [generatedText, setGeneratedText] = useState("");
    const [loading, setLoading] = useState(false);
    const [listening, setListening] = useState(false);

    const startListening = () => {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = "en-US";
        recognition.start();
        setListening(true);

        recognition.onresult = (event) => {
            const speechText = event.results[0][0].transcript;
            setText(speechText);
            setListening(false);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error detected: " + event);
            setListening(false);
        };
    };

    const generateContent = async () => {
        try {
            setLoading(true);
            const response = await fetch("http://localhost:5000/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt: `Write the opening of a story about ${text} with these requirements:
                        1. Minimum 2 paragraphs
                        2. Introduce characters
                        3. Open-ended, no conclusion
                        4. Spark reader's creativity
                        5. Never mention instructions
  
                        Story context: ${text}
  
                        Actual story beginning:`
}),
            });

            // First get raw text
            const responseText = await response.text();

            // Handle HTTP errors first
            if (!response.ok) {
                try {
                    const errorData = JSON.parse(responseText);
                    throw new Error(errorData.error || "Generation failed");
                } catch {
                    throw new Error(responseText || "Unknown error occurred");
                }
            }

            const data = JSON.parse(responseText);
            setImageURL(data.image);
            setGeneratedText(data.text);

        } catch (error) {
            console.error("Fetch error:", error);
            alert(`Generation failed: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="story-container">
            <h1 className="story-title">Forge your Story</h1>
    
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", marginBottom: "40px" }}>
                <button
                    className="vintage-button"
                    onClick={startListening}
                    disabled={listening}
                >
                    {listening ? "🔴 Listening..." : "🎤 Speak Your Prompt"}
                </button>
    
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter your story prompt here..."
                    style={{ 
                        width: "80%",
                        minHeight: "100px",
                        padding: "20px",
                        border: "2px solid #6b5840",
                        borderRadius: "5px",
                        background: "rgba(255, 248, 231, 0.9)",
                        fontFamily: "'Crimson Text', serif",
                        fontSize: "1.1rem",
                        color: "#3d2f2f",
                        resize: "vertical"
                    }}
                />
    
                <button
                    className="vintage-button"
                    onClick={generateContent}
                    disabled={!text || loading}
                >
                    {loading ? "⚒️ Forging Story..." : "📖 Generate Introduction"}
                </button>
            </div>
    
            {imageURL && (
                <div style={{ 
                    margin: "2rem 0",
                    padding: "20px",
                    background: "rgba(255, 248, 231, 0.9)",
                    border: "2px solid #6b5840",
                    borderRadius: "5px",
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                    textAlign: "center"
                }}>
                    <h2>Enchanted Illustration</h2>
                    <img
                        src={imageURL}
                        alt="AI Generated"
                        style={{ 
                            width: "400px", 
                            borderRadius: "8px",
                            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)"
                        }}
                    />
                </div>
            )}
    
            {generatedText && (
                <div style={{ 
                    margin: "2rem auto",
                    padding: "2rem",
                    background: "rgba(255, 248, 231, 0.9)",
                    border: "2px solid #6b5840",
                    borderRadius: "5px",
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                    width: "90%",
                    maxWidth: "800px"
                }}>
                    <h2>Story Beginnings</h2>
                    <pre className="story-text" style={{  // 👈 Added inline styles
                        whiteSpace: "pre-wrap",
                        wordWrap: "break-word",
                        overflowX: "hidden",
                        maxHeight: "600px",
                        overflowY: "auto",
                        padding: "10px",
                        margin: 0
                    }}>
                        {generatedText}
                    </pre>
                </div>
            )}
        </div>
    );
}

export default App;