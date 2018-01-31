import { Injectable } from '@angular/core';

import { AngularFire } from 'angularfire2';
import { Storage } from '@ionic/storage';
import { Platform } from "ionic-angular";

@Injectable()
export class UsuarioService {

  clave:string = null;

  constructor( private af: AngularFire,
               private storage:Storage,
               private platform:Platform) {}


  verifica_usuario( clave:string ){

    clave = clave.toLowerCase();

    let promesa = new Promise( (resolve, reject)=>{

      this.af.database.list('/usuarios/'+clave )
            .subscribe( data =>{

              if( data.length === 0 ){
                // clave no es correcta
                resolve(false);

              }else{
                // la clave es válida
                this.clave = clave;
                this.guardar_storage();
                resolve(true);
              }


            })


    })
    .catch( error=> console.log( "Error en promesa Service: " + JSON.stringify(error) ) );


    return promesa;


  }


  guardar_storage(){

    let promesa = new Promise( ( resolve, reject )=>{

      if(  this.platform.is("cordova")  ){
        // dispositivo
        this.storage.set('clave', this.clave );

      }else{
        // escritorio
        console.log("Clave en guardar storage " , this.clave);
        if( this.clave ){
          localStorage.setItem("clave", this.clave);
        }else{
          localStorage.removeItem("clave");
          console.log("Clave borrada");
        }

        console.log("Clave LocalStorage? ", this.clave);

      }



    });

    return promesa;

  }


  cargar_storage(){

    let promesa = new Promise( (resolve,reject)=>{

      if( this.platform.is("cordova") ){
        // dispositivo

        this.storage.ready()
            .then( ()=>{
              // leer del storage
              this.storage.get("clave").then( clave=>{
                this.clave = clave;
                resolve();
              });

            });


      }else{
        // escritorio
        this.clave = localStorage.getItem("clave");
        resolve();
      }


    });


    return promesa;



  }


  borrar_usuario(){
    this.clave = null;
    this.guardar_storage();
  }


}
