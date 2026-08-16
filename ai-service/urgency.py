# Liste de mots-clés signalant une urgence potentielle (français)
mots_urgence_fr = [
    "danger", "dangereux", "urgent", "risque", "électrocution",
    "fuite de gaz", "gaz", "câble électrique", "effondrement",
    "effondré", "incendie", "feu", "blessé", "blessée",
    "accident", "explosion", "toxique", "électrique dénudé",
    "risque de mort", "vie en danger", "menace", "grave",
    "immédiat", "immédiatement", "s'effondre", "risque d'accident"
]

# Liste de mots-clés signalant une urgence potentielle (arabe)
mots_urgence_ar = [
    "خطر", "خطير", "عاجل", "مستعجل", "صعقة كهربائية",
    "تسرب الغاز", "غاز", "سلك كهربائي", "انهيار",
    "انهار", "حريق", "نار", "جريح", "جرحى",
    "حادث", "انفجار", "سام", "خطر الموت",
    "حياة في خطر", "تهديد", "خطير جدا", "فورا", "حالا"
]

mots_urgence = mots_urgence_fr + mots_urgence_ar

def detecter_urgence(texte):
    """
    Analyse un texte (français ou arabe) et retourne True 
    si un mot-clé d'urgence est détecté.
    """
    texte_minuscule = texte.lower()
    mots_detectes = []

    for mot in mots_urgence:
        if mot in texte_minuscule:
            mots_detectes.append(mot)

    est_urgent = len(mots_detectes) > 0

    return {
        "urgent": est_urgent,
        "mots_detectes": mots_detectes
    }