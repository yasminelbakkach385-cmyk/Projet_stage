import requests

url = "http://localhost:5000/classify"
texte = "Il y a un gros nid de poule devant chez moi"

response = requests.post(url, json={"texte": texte})
print(response.json())