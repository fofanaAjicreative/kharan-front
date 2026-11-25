// composables/useStripeConnect.ts

import type { StripeConnectStatus } from "~/types/stripe-connect";

export const useStripeConnect = () => {
  
  const { $api } = useNuxtApp();

  const status = ref<StripeConnectStatus>( 'NOT_CONNECTED');

  const loading = ref(false);
  const loaded = ref(false);
  const submitting = ref(false);
  const error = ref<string | null>(null);


 /* ------------------------------------------------------------------------------------- */ 

  const fetchStatus = async () => {

        loading.value = true;
        error.value = null;

        try {

            const res = await $api( '/stripe-connect/status');
            status.value = res.data.status;

        }catch (e : any) {
        error.value = e.message || 'Impossible de récupérer le statut Stripe.';
        } finally {
            loading.value = false;
            loaded.value = true ;
        }

  };

   /* ------------------------------------------------------------------------------------- */ 

  const refreshStatus = async () => {

        loading.value = true;
        error.value = null;

        try {

            const res = await $api( '/stripe-connect/refresh',
                 {  method: 'POST' },
            );
            status.value = res.data.status;

        }catch (e : any) {
        error.value = e.message || 'Impossible de récupérer le statut Stripe.';
        } finally {
            loading.value = false;
        }

  };


 /* ------------------------------------------------------------------------------------- */ 

  const startOnboarding = async () => {


        submitting.value = true;
        error.value = null;

        try {
            const res = await $api('/stripe-connect/onboarding',
            {  method: 'POST' },
        );

            window.location.href = res.data.url;

        } catch (e : any) {
            error.value = e.message || 'Impossible de démarrer la configuration Stripe.';
        } finally {
            submitting.value = false;
        }
        

  };

 /* ------------------------------------------------------------------------------------- */ 

  return {
    status,
    loading,
    loaded,
    submitting,
    error,
    fetchStatus,
    refreshStatus,
    startOnboarding,
  };



};