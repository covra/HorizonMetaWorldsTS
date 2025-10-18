import * as hz from 'horizon/core';

import {onTrgEnterLocal} from './TRG_localEvent';

import {OnTrgEnterBroadcastLocal} from './TRG_localEvent';

class LOCALEVENT_recibidor extends hz.Component<typeof LOCALEVENT_recibidor> {
  static propsDefinition = {
    targetEv: { type: hz.PropTypes.Entity}
  };

  private colorIn = new hz.Color(0.5,1,0.1);
  // color: "rgba(61, 255, 2, 0.8)",
  private colorOut = new hz.Color(0.1,1,0.5);
  // color: "rgba(255, 2, 78, 0.8)",

  preStart(): void {

  }

  start() {

    //Conecta el evento local enviado a entidades unicas
    this.connectLocalEvent(this.entity, onTrgEnterLocal, (data) =>{
      this.manejaElEventoLocal(data.playerIn, data.estaIn);
    });

    //Conecta el evento local enviado al mundo local
    this.connectLocalBroadcastEvent(OnTrgEnterBroadcastLocal, (data) => {
      this.manejaElEventoLocalBroadcast (data.estaIn);
    });
  }

  // Evento Local nominal
  manejaElEventoLocal(playerIn: hz.Player, estaIn: boolean) {
    //console.log('SCLOCALEV > Recibido...',' estaIn?: ', estaIn);
     
    if (estaIn) {
      this.entity.color.set(new hz.Color(0,1,0));
    } else {
      this.entity.color.set(new hz.Color(1,0,1));
    }

  }

  //Evento local Broadcast
  manejaElEventoLocalBroadcast (estaIn: boolean) {
    const localPlayer = this.world.getLocalPlayer();
    const v3Ref = new hz.Vec3(1,1,0);
    const quatRot = hz.Quaternion.fromVec3(v3Ref);
    if (estaIn) {
      this.entity.rotateRelativeToPlayer(localPlayer,1,quatRot);
      this.entity.lookAt(v3Ref);
    } else {
      this.entity.rotateRelativeToPlayer(localPlayer,3,quatRot);
      this.entity.lookAt(v3Ref.cross(v3Ref));
    }
  }


}
hz.Component.register(LOCALEVENT_recibidor);
