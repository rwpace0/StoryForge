from flask import request, jsonify
from flask_cors import CORS
from openai import OpenAI
from config import app, db

client = OpenAI(api_key = "")
# post request to generate image
@app.route("/generate", methods=["POST"])
def generate_image():


    # getting prompt from frontend using request.get_json() function
    data = request.get_json()
    prompt = data.get("prompt")
    
    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400
    
    try:
        response = client.images.generate(
            prompt=prompt,
            n=1,
            size="256x256"
        )
        return jsonify({"image": response.data[0].url}) #response["data"][0]["url"] extracts the url of the image
    

    except Exception as e: #catches any errors that occur
        print(f"\nBACKEND ERROR: {str(e)}\n")
        return jsonify({"Generation error": str(e)}), 500 #send a json error message to the frontend



if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True)