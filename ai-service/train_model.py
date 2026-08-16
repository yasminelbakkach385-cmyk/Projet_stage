from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.metrics import classification_report
import joblib

from dataset import data

# Liste de mots français très courants à ignorer (stop words)
stop_words_fr = [
    "le", "la", "les", "un", "une", "des", "de", "du", "au", "aux",
    "et", "ou", "est", "sont", "a", "ont", "en", "dans", "sur", "sous",
    "pour", "par", "avec", "sans", "ce", "cette", "ces", "il", "elle",
    "je", "tu", "nous", "vous", "ils", "elles", "que", "qui", "ne", "pas",
    "plus", "depuis", "très", "trop", "mon", "ma", "mes", "son", "sa", "ses",
    "notre", "nos", "votre", "vos", "leur", "leurs", "être", "avoir",
    "se", "s", "l", "d", "n", "à", "aussi", "comme", "chaque", "tout",
    "toute", "tous", "toutes", "y", "on", "ni", "car", "donc"
]

# Séparer les textes et les catégories
textes = [texte for texte, categorie in data]
categories = [categorie for texte, categorie in data]

# Transformer le texte en nombres (vectorisation TF-IDF), en ignorant les mots courants
vectorizer = TfidfVectorizer(stop_words=stop_words_fr, ngram_range=(1, 2))
X = vectorizer.fit_transform(textes)
y = categories

# Séparer les données en entraînement (80%) et test (20%)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Créer et entraîner le modèle SVM (Support Vector Machine)
model = SVC(kernel="linear", probability=True)
model.fit(X_train, y_train)

# Évaluer le modèle sur les données de test
y_pred = model.predict(X_test)
print("=== Résultats de l'évaluation (SVM) ===")
print(classification_report(y_test, y_pred, zero_division=0))

# Sauvegarder le modèle et le vectorizer pour les réutiliser plus tard
joblib.dump(model, "modele_classification.pkl")
joblib.dump(vectorizer, "vectorizer.pkl")

print("Modèle entraîné et sauvegardé avec succès !")