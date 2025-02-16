import { useState, useEffect } from "react";
import "./App.css";


function App() {
    const [text, setText] = useState("");
    const [imageURL, setImageURL] = useState("");
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

    const generateImage = async () => {
        try {
            setLoading(true);
            const response = await fetch("http://localhost:5000/generate", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ prompt: text }),
            });
            
            const rawResponse = await response.text();       
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = JSON.parse(rawResponse);

            if (data.image) {
                setImageURL(data.image);
            } else if (data.error) {
                alert(data.error);
            }
        } catch (error) {
            console.error("Fetch error:", error);
            alert(`Generation failed: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };


    return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Voice-Powered AI Image Generator</h1>
      <button onClick={startListening} disabled={listening} style={{ padding: "10px" }}>
        🎤 {listening ? "Listening..." : "Speak"}
      </button>
      <p>Transcribed Prompt: {text}</p>
      <button 
            onClick={generateImage} 
            disabled={!text || loading} 
            style={{ padding: "10px" }}
        >
            {loading ? "Generating..." : "Generate Image"}
        </button>
      {imageURL && <img src={imageURL} alt="AI Generated" style={{ marginTop: "20px", width: "300px" }} />}
    </div>
    );
};

export default App;