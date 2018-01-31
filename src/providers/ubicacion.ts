import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';

import { AngularFire, FirebaseObjectObservable } from 'angularfire2';

import { UsuarioService } from "./usuario";

@Injectable()
export class UbicacionService {

  usuario: FirebaseObjectObservable<any[]>;
  private watch:any;

  constructor( private geolocation:Geolocation,
               private af: AngularFire,
               private _us: UsuarioService ) {
    console.log('Hello Ubicacion Provider');

    if( !this._us.clave ){
      return;
    }

    //this.usuario = this.af.database.object("/usuarios/" + this._us.clave );
    this.usuario = this.af.database.object("/usuarios/" + this._us.clave );

  }


  iniciar_localizacion(){

    this.watch = this.geolocation.watchPosition()
                    .subscribe((data) => {
                       // data can be a set of coordinates, or an error (if an error occurred).
                       // data.coords.latitude
                       // data.coords.longitude
                      //  console.log(data);
                      if( !this._us.clave ){
                        return;
                      }

                       this.usuario.update({ lat: data.coords.latitude, lng: data.coords.longitude  });
                       //this.usuario.update({ lat: -3.992177, lng: -79.203537});

                      });

  }

  detener_watch(){
    this.watch.unsubscribe();
  }

}
