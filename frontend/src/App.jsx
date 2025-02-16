import { useState, useEffect } from "react";
import "./App.css";

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
                    prompt: `Write the start of a detailed story about ${text} but do NOT finish the story. 
                    It has to be MINUMUM two paragraphs long.
                    It should not come to a conclusion and should be open-ended.
                    It should invoke creativity to the reader to continue the story. 
                    It should under no circumstances resemble a complete story, ensure that it only sparks inspiration for the reader to continue the story their own way.
                    The text generated must provide a foundation for a story to be built upon by the reader.
                    The text generated can never contain any sort of guidance for the prompt that isn't part of the story, such as listing any of the instructions given for story creation.
                    The text should resemble the beginnings of a long and drawn out story unless prompt states to do otherwise.
                    Include characters.`,
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
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h1>Voice-Powered AI Content Generator</h1>

            <button
                onClick={startListening}
                disabled={listening}
                style={{ padding: "10px", margin: "10px" }}
            >
                🎤 {listening ? "Listening..." : "Speak Prompt"}
            </button>

            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter your prompt here"
                style={{ width: "80%", height: "100px", padding: "10px", margin: "10px" }}
            />

            <button
                onClick={generateContent}
                disabled={!text || loading}
                style={{ padding: "10px", margin: "10px" }}
            >
                {loading ? "Generating..." : "Generate Content"}
            </button>

            {imageURL && (
                <div style={{ margin: "20px 0" }}>
                    <h2>Generated Image</h2>
                    <img
                        src={imageURL}
                        alt="AI Generated"
                        style={{ width: "300px", borderRadius: "8px" }}
                    />
                </div>
            )}

            {generatedText && (
                <div style={{
                    margin: "20px auto",
                    padding: "15px",
                    maxWidth: "800px",
                    textAlign: "left",
                    backgroundColor: "#f5f5f5",
                    borderRadius: "8px",
                    whiteSpace: "pre-line"
                }}>
                    <h2>Generated Story</h2>
                    <pre style={{
                        whiteSpace: "pre-wrap",
                        wordWrap: "break-word",
                        color: "#333",
                        fontSize: "16px"
                    }}>
                        {generatedText}
                    </pre>
                </div>
            )}
        </div>
    );
}

export default App;