export const useDate = () => {

  const { getUserTimeZone } = useAuth()

 
/* ---------------------------------------------------------------------- */


 function formatReservationDuration( start: string | Date, end: string | Date ): string {

  const startDate = new Date(start);
  const endDate = new Date(end);

  // timeZone
  const timeZone =  getUserTimeZone()

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone //  Force l'affichage sur la timezone cible
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: timeZone //  Force l'affichage sur la timezone cible
  };

  const date = new Intl.DateTimeFormat("fr-FR", dateOptions).format(startDate);
  const startTime = new Intl.DateTimeFormat("fr-FR", timeOptions).format(startDate);
  const endTime = new Intl.DateTimeFormat("fr-FR", timeOptions).format(endDate);

  const formattedDate = date
    .replace(/\./g, "")
    .split(" ")
    .map((word, index) =>
      index === 0 || index === 2
        ? word.charAt(0).toUpperCase() + word.slice(1)
        : word
    )
    .join(" ");

  return `${formattedDate} • ${startTime}-${endTime}`;
}


/* ---------------------------------------------------------------------- */


 function formatDateTime( start: string): string {

  if(!start){ return ''}
  
  const startDate = new Date(start);
 
  // timeZone
  const timeZone =  getUserTimeZone()

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone //  Force l'affichage sur la timezone cible
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: timeZone //  Force l'affichage sur la timezone cible
  };

  const date = new Intl.DateTimeFormat("fr-FR", dateOptions).format(startDate);
  const startTime = new Intl.DateTimeFormat("fr-FR", timeOptions).format(startDate);
 
  const formattedDate = date
    .replace(/\./g, "")
    .split(" ")
    .map((word, index) =>
      index === 0 || index === 2
        ? word.charAt(0).toUpperCase() + word.slice(1)
        : word
    )
    .join(" ");

  return `${formattedDate} • ${startTime}`;
}

/* ---------------------------------------------------------------------- */


 function formatDate( start: string): string {

  if(!start){ return ''}
  
  const startDate = new Date(start);
 
  // timeZone
  const timeZone =  getUserTimeZone()

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone //  Force l'affichage sur la timezone cible
  };
 
  const date = new Intl.DateTimeFormat("fr-FR", dateOptions).format(startDate);
   
  const formattedDate = date
    .replace(/\./g, "")
    .split(" ")
    .map((word, index) =>
      index === 0 || index === 2
        ? word.charAt(0).toUpperCase() + word.slice(1)
        : word
    )
    .join(" ");

  return `${formattedDate}`;
}
/* ---------------------------------------------------------------------- */


 function formatReservationTime( start: string | Date, end: string | Date ): string {

  const startDate = new Date(start);
  const endDate = new Date(end);

  // timeZone
  const timeZone =  getUserTimeZone()

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone //  Force l'affichage sur la timezone cible
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone //  Force l'affichage sur la timezone cible
  };

  const date = new Intl.DateTimeFormat("fr-FR", dateOptions).format(startDate);
  const startTime = new Intl.DateTimeFormat("fr-FR", timeOptions).format(startDate);
  const endTime = new Intl.DateTimeFormat("fr-FR", timeOptions).format(endDate);

  const formattedDate = date
    .replace(/\./g, "")
    .split(" ")
    .map((word, index) =>
      index === 0 || index === 2
        ? word.charAt(0).toUpperCase() + word.slice(1)
        : word
    )
    .join(" ");

  return `${startTime}-${endTime}`;
}


/* -------------------------------------------------------------------- */

  return {
    formatReservationDuration,
    formatReservationTime,
    formatDateTime,formatDate     
  }
  
}