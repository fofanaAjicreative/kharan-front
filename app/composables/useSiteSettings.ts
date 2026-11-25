
import type { SiteSettings } from '~/types/site-settings'
import { defaultSiteSettings } from '~/types/site-settings'

export const useSiteSettings = () => {


  const { $api } = useNuxtApp() ;
  const settings = useState<SiteSettings>( 'site-settings', () => structuredClone(defaultSiteSettings) ) ;
  const initialized = useState<boolean>( 'site-settings-initialized', () => false ) ;


/* --------------------------------------------------------------------------------------- */


  const loadSettings = async () => {
 
      if(initialized.value) { return  }

      try {

        const res :any = await $api('/site_settings') ;
        settings.value = res.data.settings ;

      }catch(error) {
        console.log(error);
      }finally {
        initialized.value = true
      }
  }
  

/* ----------------------------------------------------------------------------------------- */


  const setSettings = (data: any) => {
    settings.value = data
  }


 /* ---------------------------------------------------------------------------------------- */

 

  return {
    settings,
    loadSettings,
    setSettings,
  }

}
