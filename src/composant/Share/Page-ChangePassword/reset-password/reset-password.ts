import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../../../Backend/Services/user.service';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../../../../Backend/Services/theme.service';


@Component({
  selector: 'app-reset-password',
  standalone:true,
  imports:[
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl:'./reset-password.html',
  styleUrl:'./reset-password.css',
})
export class ResetPassword {



  // ==============================
  // 📧 EMAIL
  // ==============================

  email:string = '';




  // ==============================
  // 🔑 RESET KEY
  // ==============================

  resetPasswordKey:string = '';

  showResetKey=false;



  // ==============================
  // 🔐 PASSWORD
  // ==============================

  nouveauPassword:string='';

  confirmationPassword:string='';


  showPassword=false;

  showConfirmPassword=false;




  // ==============================
  // ⚙️ ETAT
  // ==============================

  loading=false;

  etape:number=1;


  message='';

  error='';



  // ==============================
  // 🔔 TOAST
  // ==============================

  showSuccessToast=false;

  showErrorToast=false;





  constructor(
    private userService:UserService,
    public themeService:ThemeService
  ){}





  // ======================================================
  // 🔔 TOAST SUCCESS
  // ======================================================

  successToast(msg:string){


    this.message=msg;

    this.showSuccessToast=true;


    setTimeout(()=>{

      this.showSuccessToast=false;

    },4000);


  }





  // ======================================================
  // 🔔 TOAST ERROR
  // ======================================================

  errorToast(msg:string){


    this.error=msg;

    this.showErrorToast=true;


    setTimeout(()=>{

      this.showErrorToast=false;

    },4000);


  }







  // ======================================================
  // 📧 ETAPE 1
  // ENVOYER CLE RESET
  // ======================================================

  envoyerLienReset(){


    this.message='';
    this.error='';



    if(!this.email){


      this.errorToast(
        "Veuillez entrer votre adresse mail"
      );


      return;

    }




    this.loading=true;



    console.log(
      "📧 Recherche utilisateur :",
      this.email
    );





    this.userService
    .getUserByEmail(this.email)

    .subscribe({



      next:(user)=>{


        console.log(
          "✅ Utilisateur trouvé :",
          user
        );




        this.userService
        .sendResetPassword(this.email)

        .subscribe({



          next:(response)=>{


            console.log(
              "📨 Mail envoyé :",
              response
            );


            this.loading=false;


            this.etape=2;



            this.successToast(
              "Une clé de réinitialisation a été envoyée"
            );


          },




          error:(err)=>{


            console.error(
              err
            );


            this.loading=false;


            this.errorToast(
              "Erreur pendant l'envoi de la clé"
            );


          }



        });



      },





      error:()=>{


        this.loading=false;


        this.errorToast(
          "Aucun compte trouvé avec cette adresse mail"
        );


      }



    });



  }










  // ======================================================
  // 🔑 ETAPE 2
  // VERIFICATION CLE
  // ======================================================


  verifierCle(){


    console.clear();


    console.log(
      "🔑 Vérification clé reset"
    );



    this.message='';

    this.error='';





    if(!this.resetPasswordKey){


      this.errorToast(
        "Veuillez entrer votre clé de réinitialisation"
      );


      return;

    }




    this.loading=true;




    const body={


      email:this.email,


      resetPasswordKey:this.resetPasswordKey


    };




    console.log(
      "📦 Données envoyées :",
      body
    );





    this.userService
    .verifyResetKey(body)

    .subscribe({



      next:(response)=>{


        console.log(
          "✅ Clé valide :",
          response
        );



        this.loading=false;


        this.etape=3;



        this.successToast(
          "Clé validée"
        );



      },





      error:(err)=>{


        console.error(
          "❌ Erreur clé :",
          err
        );


        this.loading=false;


        this.errorToast(
          "Clé incorrecte ou expirée"
        );



      }



    });



  }









  // ======================================================
  // 🔐 ETAPE 3
  // MODIFICATION PASSWORD
  // ======================================================


  modifierPassword(){



    console.clear();



    console.log(
      "🔐 Modification password"
    );



    this.message='';

    this.error='';





    if(!this.nouveauPassword){


      this.errorToast(
        "Veuillez entrer un nouveau mot de passe"
      );


      return;

    }







    if(
      this.nouveauPassword !==
      this.confirmationPassword
    ){


      this.errorToast(
        "Les mots de passe ne correspondent pas"
      );


      return;

    }






    this.loading=true;




    const data={


      email:this.email,


      resetPasswordKey:this.resetPasswordKey,


      password:this.nouveauPassword


    };





    console.log(
      "📦 DATA RESET PASSWORD",
      data
    );






    this.userService
    .resetPassword(data)

    .subscribe({



      next:(response)=>{


        console.log(
          "✅ Password modifié :",
          response
        );



        this.loading=false;



        this.successToast(
          "Mot de passe modifié avec succès"
        );





        setTimeout(()=>{


          window.location.href='/connexion';


        },4000);



      },





      error:(err)=>{


        console.error(
          "❌ Reset password erreur",
          err
        );



        this.loading=false;




        this.errorToast(

          err.error?.message ||

          "Impossible de modifier le mot de passe"

        );



      }




    });



  }





}