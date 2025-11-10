import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import joblib
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(BASE_DIR, "student_data.csv")
MODEL_PATH = os.path.join(BASE_DIR, "performance_model.pkl")

df = pd.read_csv(CSV_PATH)

X = df[["attendance_pct","assignments_avg","midterm","final"]]
y = df["pass"]

X_train,X_test,y_train,y_test = train_test_split(X,y,test_size=0.2,random_state=42)

model = RandomForestClassifier()
model.fit(X_train,y_train)

joblib.dump(model,"performance_model.pkl")

print("MODEL GENERATED ✅")
