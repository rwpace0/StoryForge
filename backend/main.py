from flask import request, jsonify
from flask_cors import CORS
from config import app, db
import os
import requests
import base64

# Stability AI configuration
STABILITY_API_KEY = ""
STABILITY_HOST = "https://api.stability.ai"
ENGINE_ID = "stable-diffusion-v1-6"  # Free tier engine

@app.route("/generate", methods=["POST"])
def generate_image():
    data = request.get_json()
    prompt = data.get("prompt")
    
    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400
    
    try:
        # Make request to Stability AI API
        response = requests.post(
            f"{STABILITY_HOST}/v1/generation/{ENGINE_ID}/text-to-image",
            headers={
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": f"Bearer {STABILITY_API_KEY}"
            },
            json={
                "text_prompts": [{"text": prompt}],
                "cfg_scale": 7,
                "height": 512,  # Free tier supports up to 512x512
                "width": 512,
                "samples": 1,
                "steps": 30,
            },
        )

        if response.status_code != 200:
            error_msg = response.json().get("message", "Image generation failed")
            return jsonify({"error": error_msg}), response.status_code

        # Process the response and extract image
        data = response.json()
        image_base64 = data["artifacts"][0]["base64"]
        
        # Convert to data URL for frontend display
        image_url = f"data:image/png;base64,{image_base64}"
        
        return jsonify({"image": image_url})

    except Exception as e:
        print(f"\nBACKEND ERROR: {str(e)}\n")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)