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
                    prompt: `You should only write about ${text}, and not write the following sets of instructions.
                    Write the start of a detailed story about ${text} but do NOT finish the story. 
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
        <div style={{ textAlign: "center", padding: "20px", fontFamily: "'Roboto', sans-serif", background: "url('https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2') no-repeat center center fixed, linear-gradient(to top, rgb(154, 154, 154), rgb(20, 20, 20))", backgroundSize: "cover", backgroundBlendMode: "overlay", minHeight: "200vh", minWidth: "195vh" }}>
            <h1 style={{ color: "#fff", marginBottom: "20px" }}>Voice-Powered AI Content Generator</h1>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                <button
                    onClick={startListening}
                    disabled={listening}
                    style={{ padding: "10px 20px", backgroundColor: "#4CAF50", color: "white", borderRadius: "5px", border: "none", cursor: "pointer", transition: "background-color 0.3s" }}
                    onMouseOver={(e) => e.target.style.backgroundColor = "#45a049"}
                    onMouseOut={(e) => e.target.style.backgroundColor = "#4CAF50"}
                >
                    {listening ? "Listening..." : "Speak Prompt"}
                </button>

                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter your prompt here"
                    style={{ width: "80%", height: "80px", padding: "10px", border: "1px solid #ccc", borderRadius: "5px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", transition: "box-shadow 0.3s" }}
                    onFocus={(e) => e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)"}
                    onBlur={(e) => e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)"}
                />

                <button
                    onClick={generateContent}
                    disabled={!text || loading}
                    style={{ padding: "10px 20px", backgroundColor: "#008CBA", color: "white", borderRadius: "5px", border: "none", cursor: "pointer", transition: "background-color 0.3s" }}
                    onMouseOver={(e) => e.target.style.backgroundColor = "#007bb5"}
                    onMouseOut={(e) => e.target.style.backgroundColor = "#008CBA"}
                >
                    {loading ? "Generating..." : "Generate Content"}
                </button>
            </div>

            {imageURL && (
                <div style={{ margin: "20px 0", padding: "10px", border: "1px solid #ccc", borderRadius: "5px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                    <h2>Generated Image</h2>
                    <img
                        src={imageURL}
                        alt="AI Generated"
                        style={{ width: "400px", borderRadius: "8px" }}
                    />
                </div>
            )}

            {generatedText && (
                <div style={{ margin: "20px auto", padding: "15px", maxWidth: "80%", textAlign: "left", backgroundColor: "#282828", borderRadius: "8px", whiteSpace: "pre-line", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                    <h2>Generated Story</h2>
                    <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word", color: "#fff", fontSize: "16px" }}>
                        {generatedText}
                    </pre>
                </div>
            )}
        </div>
    );
}

export default App;