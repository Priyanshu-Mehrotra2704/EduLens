import pandas as pd
import joblib
import os
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.pipeline import Pipeline

# always base dir of THIS file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(BASE_DIR, "student_data.csv")
MODEL_PATH = os.path.join(BASE_DIR, "performance_model.pkl")


def train_model():
    df = pd.read_csv(CSV_PATH)

    X = df[['attendance_pct','assignments_avg','midterm','final']]
    y = df['pass']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=21)

    model = RandomForestClassifier( n_estimators=500)
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Model accuracy: {accuracy*100:.2f}%")




    joblib.dump(model, MODEL_PATH)
    print("model trained & saved ✅")

train_model()
# # if model not exists → auto train
# if not os.path.exists(MODEL_PATH):
#     print("model file not found… training first time…")
#     train_model()

# model = joblib.load(MODEL_PATH)


# @app.route('/predict_performance', methods=['POST'])
# def predict():
#     data = request.get_json()
#     df = pd.DataFrame([data])
#     prediction = model.predict(df)[0]
#     return jsonify({"predicted_performance": int(prediction)})


# if __name__ == "__main__":
#     app.run(port=5002)




# REG no: 12510702 Password: Tc@&2580