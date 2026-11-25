    self.addEventListener('install', () => {
        console.log('[SW] Install');
        self.skipWaiting();
    });

    self.addEventListener('activate', (event) => {
        console.log('[SW] Activate');
        event.waitUntil(self.clients.claim());
    });

/* --------------------------------------------------------------------------- */


    self.addEventListener('push', (event) => {
 
        if (!event.data) return;

        const payload = event.data.json();

        event.waitUntil(

            self.registration.showNotification(
                payload.title,
                {

                    body: payload.body,

                    icon: payload.icon,

                    badge: payload.badge,

                    image: payload.image,

                    tag: payload.tag,

                    data: payload.data ,

                    // demande au navigateur d'utiliser le son
                    silent: false,

                }

            )

        );

    });

/* ------------------------------------------------------------------------------- */

        self.addEventListener('push', (event) => {

            console.log('[SW] Push reçu');

            console.log(event.data?.text());

        });

/* ------------------------------------------------------------------------------- */


 self.addEventListener('notificationclick', (event) => {

    event.notification.close();

    const url = event.notification.data?.url || "/";

    event.waitUntil(

        clients.matchAll({

            type: "window",

            includeUncontrolled: true

        }).then((clientList) => {

            for (const client of clientList) {

                if (client.url.includes(self.location.origin)) {

                    client.focus();

                    client.navigate(url);

                    return;

                }

            }

            return clients.openWindow(url);

        })

    );

});


/* ------------------------------------------------------------------------------- */
