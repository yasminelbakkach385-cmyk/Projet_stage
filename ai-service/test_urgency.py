import requests

url = "http://localhost:5000/detect-urgency"

# Test 1 : phrase urgente en français
texte1 = "Il y a un câble électrique dénudé qui traîne, c'est très dangereux"
response1 = requests.post(url, json={"texte": texte1})
print("Test 1 - FR urgent (devrait être True) :", response1.json())

# Test 2 : phrase normale en français
texte2 = "Le parc n'est pas très bien entretenu ces derniers temps"
response2 = requests.post(url, json={"texte": texte2})
print("Test 2 - FR normal (devrait être False) :", response2.json())

# Test 3 : phrase urgente en arabe classique (fuite de gaz dangereuse)
texte3 = "يوجد تسرب خطير للغاز في المنزل ويجب التدخل فورا"
response3 = requests.post(url, json={"texte": texte3})
print("Test 3 - AR urgent (devrait être True) :", response3.json())

# Test 4 : phrase normale en arabe classique
texte4 = "الحديقة العامة ليست في حالة جيدة منذ فترة طويلة"
response4 = requests.post(url, json={"texte": texte4})
print("Test 4 - AR normal (devrait être False) :", response4.json())