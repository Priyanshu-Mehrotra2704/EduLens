from flask import Flask, request, jsonify
from flask_cors import CORS
from pypdf import PdfReader
from openai import OpenAI

app = Flask(__name__)
CORS(app)

client = OpenAI(api_key="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")


# Convert PDF → Text
def pdf_to_text(pdf_file):
    reader = PdfReader(pdf_file)
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    return text


@app.route("/summarize_pdf", methods=["POST"])
def summarize_pdf():
    # 1. Check if PDF uploaded
    if "file" not in request.files:
        return jsonify({"error": "Please upload a PDF file"}), 400

    pdf = request.files["file"]

    # 2. Extract text from PDF
    text = pdf_to_text(pdf)

    if not text.strip():
        return jsonify({"error": "No readable text in PDF"}), 400

    # 3. Ask OpenAI to summarize the text
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "user", "content": f"Summarize this text:\n\n{text}"}
        ]
    )

    summary = response.choices[0].message.content

    # 4. Return summary
    return jsonify({"summary": summary})


if __name__ == "__main__":
    app.run(port=5000)
