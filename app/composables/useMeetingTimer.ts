 
    interface TimerOptions {
        start: string | Date
        end: string | Date
        graceMinutes?: number
    }

export function useReservationTimer(options: TimerOptions) {


  // timeZone
  const { getUserTimeZone } = useAuth()
  const timeZone =  getUserTimeZone() 

  const now = ref(Date.now())
  const graceMs = (options.graceMinutes ?? 10) * 60_000

  let interval: ReturnType<typeof setInterval> | undefined

  const startAt = new Date(options.start).getTime()
  const endAt = new Date(options.end).getTime()
  const closeAt = endAt + graceMs

  const phase = computed(() => {
    if (now.value < startAt) return 'waiting'
    if (now.value < endAt) return 'running'
    if (now.value < closeAt) return 'grace'
    return 'finished'
  })

  const remainingMs = computed(() => {
    if (phase.value === 'waiting') return startAt - now.value
    if (phase.value === 'running') return endAt - now.value
    if (phase.value === 'grace') return closeAt - now.value
    return 0
  })

  const minutes = computed(() =>
    Math.floor(remainingMs.value / 60_000)
  )

  const seconds = computed(() =>
    Math.floor((remainingMs.value % 60_000) / 1000)
  )

  const formattedTime = computed(() =>
    `${String(minutes.value).padStart(2, '0')}:${String(seconds.value).padStart(2, '0')}`
  )

  const isFiveMinuteWarning = computed(() => 
    {
        return (phase.value === 'running' && remainingMs.value <= 5 * 60_000)
    })


 const isTenMinuteWarning = computed(() => 
    {
        return (phase.value === 'running' && remainingMs.value <= 10 * 60_000)
    })

/* ------------------------------------------------------------------------ */

  const endTimeLabel = computed(() =>
        new Intl.DateTimeFormat('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone : timeZone 
        }).format(endAt)
  )

  const durationMinutes = Math.round((endAt - startAt) / 60_000)


/* ------------------------------------------------------------------------ */

  onMounted(() => {

    now.value = Date.now()

    interval = setInterval(() => {
      now.value = Date.now()
    }, 1000)


  })

/* ------------------------------------------------------------------------ */

  onUnmounted(() => {

    if (interval) clearInterval(interval) ;

  })

/* ------------------------------------------------------------------------ */

  return {
    phase,
    remainingMs,
    formattedTime,
    isFiveMinuteWarning,
    isTenMinuteWarning,
    endTimeLabel,
    durationMinutes,
    graceMinutes: options.graceMinutes ?? 10
  }


}
