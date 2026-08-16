import requests

url = "http://localhost:5000/classify"

# Test 1
texte1 = "Les poubelles n'ont pas été ramassées depuis deux semaines, ça déborde partout"
response1 = requests.post(url, json={"texte": texte1})
print("Test 1 (devrait être clair) :")
print(response1.json())
print()

# Test 2
texte2 = "Bonjour, j'ai un problème"
response2 = requests.post(url, json={"texte": texte2})
print("Test 2 (devrait être non déterminé) :")
print(response2.json())
print()

# Test 3
texte3 = "Il y a un souci avec la lumière dans ma rue"
response3 = requests.post(url, json={"texte": texte3})
print("Test 3 (à observer) :")
print(response3.json())
print()

# Test 4
texte4 = "Il y a un problème général dans le quartier, ça ne va pas du tout"
response4 = requests.post(url, json={"texte": texte4})
print("Test 4 (ambiguïté réelle) :")
print(response4.json())