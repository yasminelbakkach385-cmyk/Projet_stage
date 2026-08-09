import requests

url = "http://localhost:5000/summarize"

texte1 = "Il y a un énorme nid de poule devant chez moi depuis plusieurs semaines. Les voitures sont obligées de faire un détour dangereux pour l'éviter. Plusieurs pneus ont déjà été crevés à cause de ce trou. J'ai déjà signalé ce problème deux fois sans aucune réaction de la mairie."
response1 = requests.post(url, json={"texte": texte1})
print("Test 1 - FR :")
print(response1.json())
print()

texte2 = "توجد حفرة كبيرة أمام منزلي منذ عدة أسابيع. السيارات مضطرة للانحراف بشكل خطير لتجنبها. تعرضت عدة إطارات للتلف بسبب هذه الحفرة. لقد أبلغت  الجماعة مرتين دون أي استجابة."
response2 = requests.post(url, json={"texte": texte2})
print("Test 2 - AR :")
print(response2.json())