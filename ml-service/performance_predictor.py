from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

app = Flask(__name__)

# -------------------------------
# STEP 1: Create sample dataset
# -------------------------------
np.random.seed(42)
data = pd.DataFrame({
    "attendance": np.random.randint(60, 100, 100),
    "assignments_completed": np.random.randint(10, 20, 100),
    "total_assignments": np.random.randint(15, 20, 100),
    "previous_score": np.random.randint(50, 95, 100),
    "engagement_hours": np.random.randint(5, 25, 100),
})

# Performance score (target) — simulated
data["performance_score"] = (
    0.3 * data["previous_score"]
    + 0.25 * data["attendance"]
    + 0.2 * (data["assignments_completed"] / data["total_assignments"]) * 100
    + 0.25 * data["engagement_hours"]
    + np.random.randn(100) * 3  # noise
)

# -------------------------------
# STEP 2: Train model
# -------------------------------
X = data.drop(columns=["performance_score"])
y = data["performance_score"]

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_scaled, y)

# -------------------------------
# STEP 3: API Endpoint
# -------------------------------
@app.route('/predict_performance', methods=['POST'])
def predict_performance():
    data = request.get_json()

    try:
        attendance = data["attendance"]
        assignments_completed = data["assignments_completed"]
        total_assignments = data["total_assignments"]
        previous_score = data["previous_score"]
        engagement_hours = data["engagement_hours"]
    except KeyError:
        return jsonify({"error": "Missing input fields"}), 400

    # Prepare input
    X_input = np.array([[attendance, assignments_completed, total_assignments, previous_score, engagement_hours]])
    X_input_scaled = scaler.transform(X_input)
    prediction = model.predict(X_input_scaled)[0]

    # Confidence logic (mock)
    confidence = np.clip(100 - abs(prediction - previous_score), 60, 95)

    return jsonify({
        "predicted_score": round(prediction, 2),
        "confidence": round(confidence, 2)
    })

if __name__ == '__main__':
    app.run(debug=True)
