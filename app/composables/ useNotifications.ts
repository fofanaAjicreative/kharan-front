export function useNotifications() {

const { $api } = useNuxtApp() ;

/* -------------------------------------------------------------------------------------------------- */

    const notifications = useState<SavedNotification[]>('saved_notifications', () => [])

    const loaded = useState<boolean>( 'notifications.loaded', () => false ) ;
    const loading = useState<boolean>( 'notifications.loading', () => false ) ;
    const hasMore = useState<boolean>( 'notifications.hasMore', () => true ) ;

    const badgeCountNotification = useState( 'notifications.badgeCount.notification', () => 0 ) ;
    const unreadCountNotification = useState( 'notifications.unreadCount.notification', () => 0 ) ;

    const badgeCountMessage = useState( 'notifications.badgeCount.message', () => 0 ) ;

    const page = useState( 'notifications.page', () => 1 ) ;
    const total = useState( 'notifications.total', () => 0 ) ;
    const per_page = 5 ;


/* ------------------------------------------------------------------------------------------------------- */

    async function load(refresh = false) {

        if(loading.value) return  ;

        loading.value = true ;

       try {

            if (refresh) {
                page.value = 1
                hasMore.value = true
            }

            const res :any = await $api('/saved_notifications/list', {
                query: {
                    page: page.value,
                    per_page : per_page,
                }
            })

           
            total.value = res.data.total

            
            // load more
               if(total.value<=per_page*page.value){
                  hasMore.value = false ;
               }

            if (refresh) {
                notifications.value = res.data.notifications
            } else {
                notifications.value.push( ...res.data.notifications )
            }

        } finally {
            
            loading.value = false ;
            loaded.value = true ;
        }

}
    
/* ---------------------------------------------------------------------------------------- */

 
   async function loadMore() {

        if (loading.value || !hasMore.value  ) return ;

        page.value++ 
        await load()

   }


/* ---------------------------------------------------------------------------------------- */


    /**
     * Ajouter une notification
     * (Socket.IO / Web Push)
     */
    function prepend(notification: SavedNotification) {

        console.log("notification:",notification);

        badgeCountNotification.value = badgeCountNotification.value+1 ;
 
        notifications.value.unshift(notification);
       
 
    }

/* ---------------------------------------------------------------------------------------- */

    async function markAsRead(id: string) {

        const notification = notifications.value.find(n => n.id === id)

        if (!notification)  return
        if (notification.status === NotificationStatus.READ) return

        // Sauvegarde pour rollback
        const previousStatus = notification.status

        // Mise à jour optimiste
        notification.status = NotificationStatus.READ

        try {

            await $api(`/saved_notifications/${id}/read`, {
                method: 'POST',
            })

        } catch (error) {
            // Rollback
            notification.status = previousStatus
            throw error
        }
        

    }

/* ------------------------------------------------------------------------------------------ */

    async function markAllAsRead() {


        const unreadNotifications = notifications.value.filter( n => n.status == NotificationStatus.UNREAD );

        if (!unreadNotifications.length) return;

        // Sauvegarde pour rollback
        const previousStates = unreadNotifications.map(notification => ({
            notification,
            status: notification.status,
        }));

        // Mise à jour optimiste
        unreadNotifications.forEach(notification => {
            notification.status = NotificationStatus.READ;
        });

        try {

            await $api('/saved_notifications/readall', {
                method: 'POST',
            });

        } catch (error) {

            // Rollback
            previousStates.forEach(item => {
                item.notification.status = item.status;
            });

            throw error;

        }


    }

/* ------------------------------------------------------------------------------------------ */

    async function remove(id: string) {

       const index = notifications.value.findIndex( n => n.id === id )
       if (index == -1) return

      const removed = notifications.value.splice(index,1)[0]!
 
        try {

            await $api(`/saved_notifications/${id}/delete`, {
                method: 'DELETE',
            })

        } catch (error) {
            notifications.value.splice(index, 0, removed)
            throw error
        }

    }
 
/* ---------------------------------------------------------------------------------------- */


    async function menuOpenedNotification() {

        // Évite les appels inutiles
        // if (badgeCountNotification.value === 0)  return ;

        // UX : le badge disparaît immédiatement
        badgeCountNotification.value = 0;

        try {
            $api('/saved_notifications/menu_opened', {
                method: 'POST',
            });
        } catch (error) {
            // En cas d'échec, on recharge la valeur réelle
            await loadSummaryNotification();
            throw error;
        }

  }

  /* ---------------------------------------------------------------------------------------- */


    async function menuOpenedMessage() {

        // Évite les appels inutiles
        if (badgeCountMessage.value === 0)  return ;

        // UX : le badge disparaît immédiatement
        badgeCountMessage.value = 0;

        try {
            $api('/saved_notifications/message_menu_opened', { method: 'POST'  });
        } catch (error) {
            // En cas d'échec, on recharge la valeur réelle
            await loadSummaryMessage();
            throw error;
        }

        navigateTo('/messagerie') ;

  }


/* ---------------------------------------------------------------------------------------- */


   async function loadSummaryNotification() {

        try {
            const res :any = await $api('/saved_notifications/summary');
            badgeCountNotification.value = res.data.badgeCount;
            unreadCountNotification.value = res.data.unreadCount;
        } catch (error) {
            throw error;
        }

   }

/* ---------------------------------------------------------------------------------------- */


   async function loadSummaryMessage() {

        try {
            const res :any = await $api('/saved_notifications/summary_message');
            badgeCountMessage.value = res.data.badgeCount;
         } catch (error) {
            throw error;
        }

   }

/* ---------------------------------------------------------------------------------------- */

    return {
        notifications,
        unreadCountNotification,
        badgeCountNotification,
        badgeCountMessage,
        loading,
        hasMore,
        loaded,
        page ,
        load,
        loadMore,
        prepend,
        markAsRead,
        markAllAsRead,
        remove,
        menuOpenedNotification ,
        menuOpenedMessage ,
        loadSummaryNotification,
        loadSummaryMessage
    }

}