from flask import Flask, request, jsonify, send_from_directory
import pandas as pd
from flask_cors import CORS
import os

# Init Flask
app = Flask(__name__, static_folder="web", static_url_path="", template_folder="web")
CORS(app)

# ✅ Load the dataset
DATA_PATH = "dataset/tourism_dataset.csv"
df = pd.read_csv(DATA_PATH)

@app.route("/")
def home():
    return app.send_static_file("index.html")

@app.route("/get_options")
def get_options():
    print("Serving dropdown options...")
    countries = sorted(df["Country"].dropna().unique().tolist())
    categories = sorted(df["Category"].dropna().unique().tolist())
    ratings = sorted(df["Rating"].dropna().round(1).unique().tolist())
    return jsonify({
        "countries": countries,
        "categories": categories,
        "ratings": ratings
    })

@app.route("/recommend", methods=["POST"])
def recommend():
    country = request.form.get("country")
    category = request.form.get("category")
    rating = float(request.form.get("rating") or 0)
    accommodation = request.form.get("accommodation")

    filtered = df.copy()
    if country:
        filtered = filtered[filtered["Country"] == country]
    if category:
        filtered = filtered[filtered["Category"] == category]
    if accommodation:
        filtered = filtered[filtered["Accommodation_Available"] == accommodation]
    filtered = filtered[filtered["Rating"] >= rating]

    top = filtered.sort_values(by=["Rating", "Visitors"], ascending=False).head(5)
    return jsonify(top.to_dict(orient="records"))

if __name__ == "__main__":
    app.run(debug=True)
