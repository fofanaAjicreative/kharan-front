export function formatMonthYear(date: string | Date): string {

  if(!date){ return "Ajourd'hui" }
  const text = new Intl.DateTimeFormat('fr-FR', {
    month: 'long',
    year: 'numeric'
  }).format(new Date(date))

  return text.charAt(0).toUpperCase() + text.slice(1)
}

/* -------------------------------------------------------------- */

 export function formatDuration(
  start: string | Date,
  end?: string | Date
): string {
  const startDate = new Date(start)
  const endDate = end ? new Date(end) : new Date()

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return 'Date invalide'
  }

  if (endDate < startDate) {
    return 'Date future'
  }

  let years = endDate.getFullYear() - startDate.getFullYear()
  let months = endDate.getMonth() - startDate.getMonth()
  let days = endDate.getDate() - startDate.getDate()

  // 1. Ajustement des jours si le jour de fin est inférieur au jour de début
  if (days < 0) {
    months--
    // On prend le dernier jour du mois *précédent* pour connaître le nombre exact de jours du mois en cours
    const prevMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0)
    days += prevMonth.getDate()
  }

  // 2. Ajustement des mois si les mois sont négatifs
  if (months < 0) {
    years--
    months += 12
  }

  // 3. Correction de rattrapage si les jours dépassent le mois complet suite au décalage
  // (Empêche d'avoir par ex: 1 an 12 mois au lieu de 2 ans)
  if (months >= 12) {
    years++
    months -= 12
  }

  const parts: string[] = []

  if (years > 0) {
    parts.push(`${years} ${years === 1 ? 'an' : 'ans'}`)
  }

  if (months > 0) {
    parts.push(`${months} mois`)
  }

  if (years === 0 && months === 0) {
    if (days <= 0) return "Aujourd'hui"
    return `${days} ${days === 1 ? 'jour' : 'jours'}`
  }

  return parts.join(' ')
}



/* ------------------------------------------------------------------------------------------- */

export function formatDateFr( start: string | Date, ): string {

  
  const startDate = new Date(start)
    
    const date = new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric"
    }).format(startDate)

    const startTime = new Intl.DateTimeFormat("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).format(startDate) ;

    

  // Nettoyage des points éventuels et capitalisation
  const formattedDate = date
    .replace(/\./g, "")
    .split(" ")
    .map((word, index) =>
      index === 0 || index === 2
        ? word.charAt(0).toUpperCase() + word.slice(1)
        : word
    ).join(" ")

  return `${formattedDate} • ${startTime.replace(":", "H")}`
}
  
/* ------------------------------------------------------------------------------------ */

export function isToday(dateString :string) {
     const today = new Date();
      const todayStart = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      const todayEnd = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 1
      );
       
      const date = new Date(dateString);
      return date >= todayStart && date < todayEnd;
  }
/* ---------------------------------------------------------------------------- */


  export function getMessageDay(date: string | Date): string {

      const d = new Date(date)

      const today = new Date()
      const yesterday = new Date()
      yesterday.setDate(today.getDate() - 1)

      if (d.toDateString() === today.toDateString()) {
          return "Aujourd'hui"
      }

      if (d.toDateString() === yesterday.toDateString()) {
          return "Hier"
      }

      return new Intl.DateTimeFormat("fr-FR", {
          weekday: "long",
          day: "numeric",
          month: "long"
      }).format(d)

  }

/* ------------------------------------------------------------------------------------ */
 export function timeAgo(value: string | Date): string {
  
  if (!value) return '';

  // Sécurité si l'API renvoie une string ISO sans le 'Z' de l'UTC
  let date: Date;
  if (typeof value === 'string' && !value.endsWith('Z') && !value.includes('+') && !value.includes('GMT')) {
    date = new Date(`${value}Z`);
  } else {
    date = new Date(value);
  }

  // Vérification si la date est valide
  if (isNaN(date.getTime())) return '';

  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // Gestion des dates dans le futur ou très récentes (< 30 sec)
  if (seconds < 30) return 'à l\'instant';
  if (seconds < 60) return '1 min';

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} j`;

  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} sem`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} mois`;

  const years = Math.floor(days / 365);
  return `${years} an${years > 1 ? 's' : ''}`;
}

/* ------------------------------------------------------------------------ */


export function getFileIcon(mime: string) {

    if (mime.includes("pdf"))
        return "mdi-file-pdf-box"

    if (mime.includes("word"))
        return "mdi-file-word"

    if (mime.includes("excel"))
        return "mdi-file-excel"

    if (mime.includes("powerpoint"))
        return "mdi-file-powerpoint"

    if (mime.includes("zip"))
        return "mdi-folder-zip"

    if (mime.includes("image"))
        return "mdi-image"
    
    if (mime.includes("audio"))
        return "mdi-file-music"

    if (mime.includes("video"))
        return "mdi-video"

    return "mdi-file-document-outline"

}