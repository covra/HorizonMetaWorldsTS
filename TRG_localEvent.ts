import { CodeBlockEvents, Component, Entity, LocalEvent, Player, PropTypes } from 'horizon/core';

export const onTrgEnterLocal = new LocalEvent <{playerIn: Player, estaIn: boolean}>('onTrgEnterLocal');

export const OnTrgEnterBroadcastLocal = new LocalEvent <{estaIn: boolean}> ('OnTrgEnterBroadcastLocal');

class TRG_localEvent extends Component<typeof TRG_localEvent>{
  static propsDefinition = {
    targetEv: { type: PropTypes.Entity}
  };

  private  TIMEOUTEVENT = 1500

  preStart() {
    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerEnterTrigger, this.OnPlayerEnterTrigger.bind(this));
    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerExitTrigger, this.OnPlayerExitTrigger.bind(this));
  }

  start() {
    //Pasa 1s , setea el owner del trigger y lanza el localevento
    this.async.setTimeout(()=>{
      const localPlayer = this.world.getLocalPlayer();
      this.entity.owner.set(localPlayer);
      console.log('TRG> localPlayer: ', localPlayer.id, '  // this script owner: ', this.entity.owner.get().id, '   // server owner: ', this.world.getServerPlayer().id );

    },1000);
  }
  
  OnPlayerEnterTrigger(player: Player) {
    //console.log(`TRG> Player ${player.name.get()} entered trigger.`);
    this.handleLocalEvent(player, true);
    this.async.setTimeout(()=>{
      this.handleLocalEventBroadcast(true);  
    },this.TIMEOUTEVENT)
  }
  
  OnPlayerExitTrigger(player: Player) {
    //console.log(`TRG> Player ${player.name.get()} exit trigger.`);
    this.handleLocalEvent(player, false);
    this.async.setTimeout(()=>{
      this.handleLocalEventBroadcast(false);  
    },this.TIMEOUTEVENT)
  }
  
  private handleLocalEvent (player: Player, bisIn: boolean){
    //Send event a entidad conocida local(FUNCIONA)
    this.sendLocalEvent(this.props.targetEv!, onTrgEnterLocal, {playerIn: player, estaIn: bisIn});
    //console.log('TRG> enviado evento local: ', onTrgEnterLocal);

    
  }
  
  private handleLocalEventBroadcast (bisIn: boolean) {
    //Send event al mundo local
    this.sendLocalBroadcastEvent(OnTrgEnterBroadcastLocal, {estaIn: bisIn});

  }

}
Component.register(TRG_localEvent);
