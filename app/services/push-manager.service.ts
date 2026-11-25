export class PushManagerService {

    constructor(
        private readonly publicKey: string
    ) {}

/* -------------------------------------------------------------------------- */

    isSupported(): boolean {
        return (
            'serviceWorker' in navigator &&
            'PushManager' in window &&
            'Notification' in window
        );
    }
 /* -------------------------------------------------------------------------- */

    async requestPermission() {

        if (!this.isSupported()) throw new Error("Web Push non supporté");
        return await Notification.requestPermission();
    }

/* -------------------------------------------------------------------------- */

    async getRegistration() {
        return await navigator.serviceWorker.ready;
    }
    
/* -------------------------------------------------------------------------- */

    private urlBase64ToUint8Array(base64String: string): Uint8Array {

        const padding = '='.repeat((4 - base64String.length % 4) % 4);

        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);

        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }

        return outputArray;

    }

/* ----------------------------------------------------------------------------------- */

    async isSubscribed(): Promise<boolean> {
        const subscription = await this.getSubscription() ;
        return subscription !== null;
    }

/* ----------------------------------------------------------------------------------- */

    async isGranted(): Promise<boolean> {
        return Notification.permission == 'granted'
    }

/* ------------------------------------------------------------------------------------ */

    async getSubscription(): Promise<PushSubscription | null> {

        const registration = await navigator.serviceWorker.ready;
        return registration.pushManager.getSubscription();

    }
 
/* ------------------------------------------------------------------------------------ */

    async subscribe() :Promise<any>{ 


        if (!this.isSupported()) {
            throw new Error('Web Push non supporté');
        }

        if (Notification.permission !== 'granted') {
            throw new Error('Permission non accordée.');
        }

        const registration = await navigator.serviceWorker.ready;
        let subscription = await registration.pushManager.getSubscription();

        if(!subscription) {

            subscription = await registration.pushManager.subscribe({

                userVisibleOnly: true,
                applicationServerKey: this.urlBase64ToUint8Array(
                    this.publicKey
                ) as BufferSource

            });

        }

        const json = subscription.toJSON();

        return {

            endpoint: json.endpoint!,
            expirationTime: json.expirationTime ?? null,

            keys: {
                p256dh: json.keys!.p256dh,
                auth: json.keys!.auth,
            },
            userAgent: navigator.userAgent,
        };

   }

/* -------------------------------------------------------------------------------------- */
  
    async unsubscribe(): Promise<string | null> {

        const subscription =  await this.getSubscription()  ; 

        if (!subscription) { return null; }

        const endpoint = subscription.endpoint;

        const success = await subscription.unsubscribe();

        if (!success) {
            throw new Error('Impossible de supprimer la subscription.');
        }

        return endpoint;
    }

 
} 


