from flask import Flask, request, jsonify
import joblib
from urgency import detecter_urgence
from summarizer import resumer_texte

app = Flask(__name__)

# Charger le modèle et le vectorizer entraînés au démarrage du service
model = joblib.load("modele_classification.pkl")
vectorizer = joblib.load("vectorizer.pkl")

# Seuil minimum de confiance pour proposer une catégorie
SEUIL_CONFIANCE = 0.35

@app.route("/")
def home():
    return "Le service IA fonctionne bien !"

@app.route("/classify", methods=["POST"])
def classify():
    data = request.get_json()

    if not data or "texte" not in data:
        return jsonify({"erreur": "Le champ 'texte' est requis"}), 400

    texte = data["texte"]
    texte_vectorise = vectorizer.transform([texte])

    # Récupérer les probabilités pour chaque catégorie
    probabilites = model.predict_proba(texte_vectorise)[0]
    categories_possibles = model.classes_

    # Trouver la meilleure catégorie et son score
    meilleur_index = probabilites.argmax()
    meilleure_categorie = categories_possibles[meilleur_index]
    meilleur_score = probabilites[meilleur_index]

    if meilleur_score < SEUIL_CONFIANCE:
        return jsonify({
            "texte": texte,
            "categorie": None,
            "confiance": round(float(meilleur_score), 2),
            "message": "Catégorie non déterminée"
        })

    return jsonify({
        "texte": texte,
        "categorie": meilleure_categorie,
        "confiance": round(float(meilleur_score), 2)
    })

@app.route("/detect-urgency", methods=["POST"])
def detect_urgency():
    data = request.get_json()

    if not data or "texte" not in data:
        return jsonify({"erreur": "Le champ 'texte' est requis"}), 400

    texte = data["texte"]
    resultat = detecter_urgence(texte)

    return jsonify({
        "texte": texte,
        "urgent": resultat["urgent"],
        "mots_detectes": resultat["mots_detectes"]
    })

@app.route("/summarize", methods=["POST"])
def summarize():
    data = request.get_json()

    if not data or "texte" not in data:
        return jsonify({"erreur": "Le champ 'texte' est requis"}), 400

    texte = data["texte"]
    resume = resumer_texte(texte)

    return jsonify({
        "texte_original": texte,
        "resume": resume
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)