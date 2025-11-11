from flask import Flask, request, jsonify
from transformers import pipeline
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
# Load the model once when server starts
summarizer = pipeline("summarization", model="google/pegasus-cnn_dailymail")

@app.route('/summarize', methods=['POST'])
def summarize_text():
    data = request.get_json()
    text = data.get("text", "")

    if not text.strip():
        return jsonify({"error": "No text provided"}), 400

    # --- Step 1: Split by sentences instead of characters ---
    import re
    sentences = re.split(r'(?<=[.!?]) +', text)

    # --- Step 2: Group sentences into chunks (around 400–600 words each) ---
    chunks = []
    current_chunk = ""
    for sentence in sentences:
        if len(current_chunk.split()) + len(sentence.split()) <= 500:
            current_chunk += " " + sentence
        else:
            chunks.append(current_chunk.strip())
            current_chunk = sentence
    if current_chunk:
        chunks.append(current_chunk.strip())

    # --- Step 3: Summarize each chunk with a little sampling ---
    summaries = []
    for chunk in chunks:
        summary = summarizer(
            chunk,
            max_length=120,
            min_length=50,
            do_sample=True,        # adds variation
            temperature=0.8,       # slight creativity
        )
        summaries.append(summary[0]['summary_text'])

    # --- Step 4: Combine and summarize again (for coherence) ---
    combined = " ".join(summaries)
    final_summary = summarizer(
        combined,
        max_length=150,
        min_length=60,
        do_sample=True
    )[0]['summary_text']

    return jsonify({"summary": final_summary})


if __name__ == '__main__':
    app.run( port=5000)
