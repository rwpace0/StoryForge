from flask import request, jsonify
from flask_cors import CORS
from config import app, db
import os
import requests
import base64
from transformers import pipeline

# Stability AI configuration
STABILITY_API_KEY = ""
STABILITY_HOST = "https://api.stability.ai"
ENGINE_ID = "stable-diffusion-v1-6"  # Free tier engine
HF_TOKEN = ""
HF_API = "https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct"


@app.route("/generate", methods=["POST"])
def generate_image():
    if not STABILITY_API_KEY or not HF_TOKEN:
            return jsonify({"error": "API keys not found"}), 500

    data = request.get_json()
    prompt = data.get("prompt")
    
    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400
    
    try:
        # Make request to Stability AI API
        image_response = requests.post(
            f"{STABILITY_HOST}/v1/generation/{ENGINE_ID}/text-to-image",
            headers={
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": f"Bearer {STABILITY_API_KEY}"
            },
            json={
                "text_prompts": [{"text": prompt}],
                "cfg_scale": 7,
                "height": 512,  # Free tier 512x512
                "width": 512,
                "samples": 1,
                "steps": 30,
            },
        )

        if image_response.status_code != 200:
            return jsonify({"error": "Image generation failed"}), image_response.status_code

        text_response = requests.post(
            "https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct",
            headers={"Authorization": f"Bearer {HF_TOKEN}"},
            json={
                "inputs": prompt,
                "parameters": {
                    "max_new_tokens": 800,
                    "temperature": 0.9,  # More creativity (0-1)
                    "repetition_penalty": 1.5,  # Reduce repetition
                    "do_sample": True,
                    "top_k": 50,
                    "top_p": 0.95
                }
            }
        )
        
        print("Text generation response:", text_response.status_code, text_response.text)

        if text_response.status_code != 200:
            return jsonify({"error": "Text generation failed"}), text_response.status_code

        # Process the response and extract image
        image_data = image_response.json()
        image_base64 = image_data["artifacts"][0]["base64"]
        image_url = f"data:image/png;base64,{image_base64}"
        
        text_data = text_response.json()
        if isinstance(text_data, list) and len(text_data) > 0:
            generated_text = text_data[0].get("generated_text", "")
            if prompt in generated_text:
                generated_text = generated_text.replace(prompt, "").strip()
        # Clean up the response
            sentences = generated_text.split(".")  # Get first 5 sentences
            paragraphs = []
            current_paragraph = ""

            for i, sentence in enumerate(sentences):
                current_paragraph += sentence + "."
                if (i+1) % 5 == 0: # Every 5 sentence 1 paragraph
                    paragraphs.append(current_paragraph)
                    current_paragraph = ""
            # Add remaining sentences as the last paragraph
            if current_paragraph:
                paragraphs.append(current_paragraph.strip())
            
            generated_text = "\n\n".join(paragraphs[:3])
        else:
            generated_text = "Failed to generate text."
        
        

        return jsonify({
            "image": image_url,
            "text": generated_text
            })

    except Exception as e:
        print(f"\nBACKEND ERROR: {str(e)}\n")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)