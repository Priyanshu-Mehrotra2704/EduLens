from flask import Flask, request, jsonify
import pandas as pd
import joblib
import os
from flask_cors import CORS



app = Flask(__name__)
CORS(app)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR,"performance_model.pkl")

if not os.path.exists(MODEL_PATH):
    print("model file not found… training first time…")

model = joblib.load(MODEL_PATH)


@app.route('/predict_performance', methods=['POST'])
def predict():
    data = request.get_json()
    df = pd.DataFrame([data])
    prediction = model.predict(df)[0]
    return jsonify({"predicted_performance": int(prediction)})
if __name__ == "__main__":
    app.run(port=5000)