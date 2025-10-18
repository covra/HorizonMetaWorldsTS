import { CodeBlockEvents, Component, Entity, Player, PropTypes, Asset, ParticleGizmo, AudioGizmo } from 'horizon/core';
import {sc_attachPlatformVisible} from './sc_attachPlatformVisible';
import {cuiscriptdelguismoui} from './cuiscriptdelguismoui';

 //LDefinicion tipo obj de lista barredora
type objLista = {
    jugador?: Player;
    spawned?: boolean;
    barredora?:
      {
        visualBarredora?: Entity;
        phyBarredora?: Entity;
      }
};

//Clase  acciones del trigger cuando player entra y pick barredora
class scTRG_pickBarredora extends Component<typeof scTRG_pickBarredora>{
  static propsDefinition = {
    barredoraVis: { type: PropTypes.Asset },
    barredoraPhy: { type: PropTypes.Asset },
    visualFxAros: { type: PropTypes.Entity},
    visualFxPuff: { type: PropTypes.Entity},
    spawnSFX: { type: PropTypes.Entity},
    cuiHUD: { type: PropTypes.Entity}
  };


 public listaBarredoras: objLista[] = [];

 static isBusy: boolean = false;


  preStart() {
    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerEnterTrigger, this.OnPlayerEnterTrigger.bind(this));
    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerExitTrigger, this.OnPlayerExitTrigger.bind(this));
  }

  start() {

  }

  OnPlayerEnterTrigger(player: Player) {
    if (!scTRG_pickBarredora.isBusy) {

      scTRG_pickBarredora.isBusy = true;
      console.log(`Player ${player.name.get()} entered trigger. Spawning Barredora...`);

      //Chequea si anteriormente tenia barredora
      const estaPlayerEnLista = this.listaBarredoras.find(
      item => item.jugador === player 
      )
      if (estaPlayerEnLista) {
        for (const item of this.listaBarredoras) {
          if (item.spawned === false || item.spawned == null || typeof item.spawned === "undefined") {
            this.SpawnUniqueBarredoraPerPlayer(player);
          }
        }
      } else {
        this.SpawnUniqueBarredoraPerPlayer(player);
      }
      
    }
    
    
  }
  
  //Spawmea y add a la lista una nueva barredora unica para cada player
   SpawnUniqueBarredoraPerPlayer (player: Player){
    //Spawn de las barredoras
    this.world.spawnAsset(this.props.barredoraVis!, player.position.get(), player.rotation.get()).then ((barreVIs) => {
      if (barreVIs) {
        this.world.spawnAsset(this.props.barredoraPhy!, player.position.get(), player.rotation.get()).then ((barrePhy) => {
          if (barrePhy) {
            
            //Creando el objeto para la lista de barredoras
            let newBarrePlayer: objLista = 
              {
              jugador: player, 
              spawned: true,
              barredora:
                {
                  visualBarredora: barreVIs[0],
                  phyBarredora: barrePhy[0]
                }
              }            
  
            // Add to a lista de barredoras y players
            this.listaBarredoras.push(newBarrePlayer);
            scTRG_pickBarredora.isBusy = false;
  
            //Manejo del vfx? van tarde
            this.props.visualFxAros?.as(ParticleGizmo).stop();
            this.props.visualFxPuff?.as(ParticleGizmo).play();
            this.props.spawnSFX?.as(AudioGizmo).play();
  
            //Mandadoa  local? aun no se
            this.props.visualFxAros?.owner.set(player);
            this.props.visualFxPuff?.owner.set(player);
            this.props.spawnSFX?.owner.set(player);

            //ESTO hace que funcione el attacch, pero no se si a TODOS 
            barreVIs[0].owner.set(player);
            barrePhy[0].owner.set(player);

            barrePhy[0].visible.set(false);

            //Arranca el attacheo?
            const scAttach = barreVIs[0].getComponents(sc_attachPlatformVisible)[0];
            if (scAttach) {
              scAttach.chequeandoPlayers(player);
            }

            //Avisa al boton que aparezca?
            if (this.props.cuiHUD) {
              const scuiBtn = this.props.cuiHUD.getComponents(cuiscriptdelguismoui)[0];
              scuiBtn.showButtonLeavePusher();
            }

          }
        })
      
      }
      
    });
  
  }
  
  //Player sale de la zona de spawm
  OnPlayerExitTrigger(player: Player) {
    scTRG_pickBarredora.isBusy = false;
  }

  //Notifica que ha soltado la barredora
  public playerLeavesBarredora(playerIn: Player, barreVis: Entity, barrePhy: Entity) {
    const estaPlayerEnLista = this.listaBarredoras.find(
      item => item.jugador === playerIn 
    )
    if (estaPlayerEnLista) {
      for (const item of this.listaBarredoras) {
        if (item.jugador === playerIn) {
          item.spawned == false;
        }
      }
    }
  }
 

}


Component.register(scTRG_pickBarredora);
