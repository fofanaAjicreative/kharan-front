export function UseDataService(){



  const { $api } = useNuxtApp()

 
  //------------------------------------------------------------------------------------------

        async function getCategories() {
          return $api(`/categories`,{ method: 'GET' })  
        }

  //------------------------------------------------------------------------------------------

      async function getServicesPrices() {
        return $api(`/services_prices`,{
          method: 'GET',
        })
      }


  //------------------------------------------------------------------------------------------

      async function getChallenges() {
 
        return $api(`/challenges`,{
          method: 'GET',
        })
  
      }

  
  //------------------------------------------------------------------------------------------

    return {
      getCategories ,
      getChallenges ,
      getServicesPrices
    }

//------------------------------------------------------------------------------------------
 

}