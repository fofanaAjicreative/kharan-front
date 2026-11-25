export const useApi = () => {

  const config = useRuntimeConfig()
   return {
    apiBaseUrl: config.public.apiBaseUrl,
   }
}