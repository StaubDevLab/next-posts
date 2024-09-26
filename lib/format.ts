export function formatDate(dateString:string) {
  console.log(dateString)
  // Créer un objet Date à partir de la chaîne d'entrée
  const date = new Date(dateString);

  // Extraire les composants de la date
  const day = date.getUTCDate().toString().padStart(2, '0');
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Les mois commencent à 0
  const year = date.getUTCFullYear();
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');

  // Retourner la date formatée
  return `${day}/${month}/${year} à ${hours}h${minutes}`;
}
