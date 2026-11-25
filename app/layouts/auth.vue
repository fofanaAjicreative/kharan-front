<script setup lang="ts" >
 useHead({
  titleTemplate: (title) => title ? `${title} | Kharan` : 'Kharan'
})

   
</script>

 <template>

   <v-app>
    <v-main>
      
      <div class="main_content"> 
       
       <!-- left  -->
      <div class="left_side">

            <!-- HEADER : en haut -->
            <div class="left_header">
                <!-- logo -->
              <!-- <KharanLogo
                    :color="'rgba(255, 255, 255, 0.7)'"
                    :weight="900"
                  /> -->
              <!-- logo -->
            </div>

            <!-- CONTENU : au centre -->
            <div class="left_content">
                <h1> Trouvez le coach idéal ou développez
                   votre activité grâce à notre plateforme. </h1>
                <p> Kharan est une plateforme qui met en relation 
                  les coachs et les personnes souhaitant être coachées. </p>
            </div>

            <!-- FOOTER : en bas -->
            <div class="left_footer">
              © 2026 KHARAN. Tous droits réservés.
            </div>
            
      </div>

       <!-- right -->
      <div class="right_side">
             <div class="right_side_content">
              
                <div class="form_content">
                      <slot/>
                </div>
                    
            </div>

      </div>

    </div>
         
      
    </v-main>
  </v-app>
 
</template>

<style scoped lang="scss">

     .main_content{
         display: flex ;
         height: 100vh;
      }

      .left_side{
        width: 45%;
        
      }


      .right_side{
         width: 55%;
      }


 

      .right_side_content{
        display: flex ;
        flex-direction: column;
        justify-content: center;
        height: 100% ;
        padding: 0px 40px ;
      }


      .form_content{
        display: flex ;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100% ;
        max-width: 500px;
        margin: auto ;
       
        height: 100% ;
        justify-content: center;
        
      }


 

    @media (max-width: 960px) {
      
      .right_side_content{
        padding: 0px 25px ;
      }
      
    }


    /* ------------------------------- left_side -------------------------------- */


    .left_side {
        width: 45%;
        min-height: 100vh;
        position: relative;

        display: flex;
        flex-direction: column;
        justify-content: space-between;

        padding: clamp(24px, 4vw, 48px);

        background-image:
          linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.45) 0%,
            rgba(0, 0, 0, 0.20) 35%,
            rgba(0, 0, 0, 0.45) 100%
          ),
          url('@/assets/images/coach.png');

        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;

        color: #fff;
        overflow: hidden;
        box-sizing: border-box;
      }



          
      @media (max-width:1024px) {

        .left_side{
            display: none;
        }

        .right_side{
          width: 100%;
        }

      }
      
      /* Header */
 
      

      /* Contenu central */
      .left_content {
        position: relative;
        z-index: 1;

        width: 100%;
        max-width: 520px;

        margin-top: auto;
        margin-bottom: auto;
      }

      .left_content h1 {
        margin: 0;
        font-size: clamp(28px, 3.2vw, 38px);
        font-weight: 800;
        line-height: 1.2;
        letter-spacing: -0.04em;

        text-shadow: 0 2px 12px rgba(0, 0, 0, 0.35);
      }

      .left_content h1 span {
        display: block;
        color: #ffbf00;
      }


      .left_content p {
        margin-top: 20px;
        max-width: 460px;

        font-size: clamp(14px, 1.3vw, 16px);
        line-height: 1.6;
        color: rgba(255, 255, 255, 0.85);

        text-shadow: 0 1px 8px rgba(0, 0, 0, 0.4);
      }


      /* Footer */
      .left_footer {

        position: relative;
        z-index: 1;

        font-size: 14px;
        color: rgba(255, 255, 255, 0.7);
        
      }

    /* ------------------------------- /left_side -------------------------------- */



</style>

<style>

    .form_title{
        font-size: 24px ;
        font-weight: bold ;
        margin: 10px 0px ;
    }

    .form_description{
        font-size: 16px ;
        margin: 0px 0px 40px 0px ;
        line-height: normal;
    }


    /* ----------------- customize vuetify ------------------------------- */

    .v-messages__message{
      font-size: 12px ;
      text-align: left !important;
    }

    .v-alert__content{
      text-align: left !important;
      font-size: 14px;
    }





   
 


</style>
