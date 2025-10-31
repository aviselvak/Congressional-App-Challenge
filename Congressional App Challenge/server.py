# app.py
from transformers import pipeline
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow Chrome extension to access it

# Load model once at startup
emotion_model = pipeline("text-classification", model="j-hartmann/emotion-english-distilroberta-base")
print(emotion_model("Muslims are destroying our country. They account for almost all terrorism, contribute nothing, and are a majority of child rape cases."))
@app.route("/analyze", methods=["GET"])
def analyze():
    text = request.args.get("text", "")
    result = emotion_model(text)[0]
    score = 0
    if result["label"] == "NEUTRAL":
        score = 0
    else:
        score = 1

    return jsonify({
        "label": result["label"],
        "score": score
    })

if __name__ == "__main__":
    app.run(debug=True, port = 5001)
