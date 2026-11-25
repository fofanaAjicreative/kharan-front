
export const useMeetingStatus = (
    start_date: MaybeRefOrGetter<string | Date>,
    end_date: MaybeRefOrGetter<string | Date>,
    meeting_url: MaybeRefOrGetter<string | null>,
    reservation_id: MaybeRefOrGetter<string | null>,
) => {

  const {  isCoach, isClient  } = useAuth();

   // Horloge réactive globale
  const now = ref(new Date());
  let timer: ReturnType<typeof setInterval> | null = null;


  // Extraction réactive des valeurs (gère les refs et les objets classiques)
 

  const startTime = computed(() => new Date(toValue(start_date)).getTime() )
  const endTime = computed(() => new Date(toValue(end_date)).getTime() )
  const meetingUrl = computed(() => toValue(meeting_url) ) ;
  const reservationId = computed(() => toValue(reservation_id) ) ;

  // Différence en minutes par rapport au début
  const minutesUntilStart = computed(() => {
    if (!startTime.value) return Infinity;
    const start = new Date(startTime.value).getTime();
    return (start - now.value.getTime()) / (1000 * 60);
  });

  // Indique si la séance est complètement terminée
  const isFinished = computed(() => {
    if (!endTime.value) return false;
    const end = new Date(endTime.value).getTime();
    return now.value.getTime() > end;
  });

  // Condition principale : peut rejoindre si <= 10 min avant le début ET non terminée
  const canJoin = computed(() => {
    return minutesUntilStart.value <= 10 && !isFinished.value;
  });

  // Indique si la séance est encore dans le futur (> 10 min)
  const isUpcoming = computed(() => {
    return minutesUntilStart.value > 10;
  });


  // Indique si la séance a commencé
  const isStarted = computed(() => {

    if (!startTime.value) return Infinity;
    const start = new Date(startTime.value).getTime();

    return (start - now.value.getTime())<0
 
  });

/* ------------------------------------------------------------------------- */

  // Compte à rebours formaté (ex: "04m 12s" ou "2h 15m")
  const timeRemainingText = computed(() => {
    if (canJoin.value) return 'En cours / Imminent';
    if (isFinished.value) return 'Terminée';

    const diffMs = new Date(startTime.value).getTime() - now.value.getTime();
    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;

    if (hours > 0) {
      return `Dans ${hours}h ${mins.toString().padStart(2, '0')}m`;
    }
    return `Dans ${mins} min`;
  });

/* ------------------------------------------------------------------------- */

  // Action pour ouvrir la visioconférence
  const joinMeeting = () => {

    if(isCoach.value){
      navigateTo(`/espace-coach/meeting/${reservationId.value}`)
    }else if(isClient.value){
      navigateTo(`/espace-client/meeting/${reservationId.value}`)
    }

    
  };

 /* ------------------------------------------------------------------------- */ 

  onMounted(() => {
     timer = setInterval(() => {
      now.value = new Date();
    }, 10000);
  });

  onUnmounted(() => {
     if (timer) clearInterval(timer);
  });


 /* ------------------------------------------------------------------------- */ 

  return {
    canJoin,
    isUpcoming,
    isFinished,
    isStarted,
    minutesUntilStart,
    timeRemainingText,
    joinMeeting,
  };


};