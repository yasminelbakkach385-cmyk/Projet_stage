import re

stop_words_fr = [
    "le", "la", "les", "un", "une", "des", "de", "du", "au", "aux",
    "et", "ou", "est", "sont", "a", "ont", "en", "dans", "sur", "sous",
    "pour", "par", "avec", "sans", "ce", "cette", "ces", "il", "elle",
    "je", "tu", "nous", "vous", "ils", "elles", "que", "qui", "ne", "pas",
    "plus", "depuis", "très", "trop", "mon", "ma", "mes", "son", "sa", "ses",
    "notre", "nos", "votre", "vos", "leur", "leurs", "être", "avoir",
    "se", "s", "l", "d", "n", "à", "aussi", "comme", "chaque", "tout",
    "toute", "tous", "toutes", "y", "on", "ni", "car", "donc", "c"
]

stop_words_ar = [
    "في", "من", "إلى", "على", "عن", "مع", "هذا", "هذه", "ذلك", "تلك",
    "الذي", "التي", "الذين", "و", "أو", "ثم", "كان", "كانت", "يكون",
    "هو", "هي", "أنا", "أنت", "نحن", "هم", "هن", "لا", "ما", "لم",
    "لن", "قد", "كل", "بعض", "غير", "بين", "عند", "منذ", "حتى",
    "إن", "أن", "لكن", "كما", "أيضا", "جدا", "فقط", "هناك", "هنا"
]

stop_words = stop_words_fr + stop_words_ar

def decouper_en_phrases(texte):
    phrases = re.split(r'(?<=[.!?]) +', texte.strip())
    return [p for p in phrases if len(p) > 0]

def resumer_texte(texte, nombre_phrases=2):
    phrases = decouper_en_phrases(texte)

    if len(phrases) <= nombre_phrases:
        return texte

    mots = re.findall(r'\b\w+\b', texte.lower())
    mots_utiles = [m for m in mots if m not in stop_words]

    frequence = {}
    for mot in mots_utiles:
        frequence[mot] = frequence.get(mot, 0) + 1

    scores = []
    for phrase in phrases:
        mots_phrase = re.findall(r'\b\w+\b', phrase.lower())
        score = sum(frequence.get(mot, 0) for mot in mots_phrase)
        scores.append((score, phrase))

    meilleures = sorted(scores, key=lambda x: x[0], reverse=True)[:nombre_phrases]
    phrases_gardees = [phrase for score, phrase in meilleures]

    resume = [p for p in phrases if p in phrases_gardees]

    return " ".join(resume)