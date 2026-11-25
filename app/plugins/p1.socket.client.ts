import { io, Socket } from "socket.io-client";

export default defineNuxtPlugin(() => {

  // 🛡️ TRÈS IMPORTANT : On ne l'initialise que dans le navigateur
  if (import.meta.server) return

  const config = useRuntimeConfig() ;

  const socket : Socket  = io(
     String(config.public.socketUrl), 
    {
      transports: ['websocket', 'polling'],
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
      forceNew: true ,
      withCredentials: true, // <--- INDISPENSABLE : force l'envoi des cookies httpOnly
    })



  return {
    provide: {
      socket
    }
  }


})