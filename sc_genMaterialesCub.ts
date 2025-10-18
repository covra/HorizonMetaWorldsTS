import { CodeBlockEvents, Component, Entity, Player, PropTypes, Vec3 } from 'horizon/core';

class sc_genMaterialesCub extends Component<typeof sc_genMaterialesCub>{
  //intervalo de spawn, asset y offset de posicion
  static propsDefinition = {
    timeIntervaloSpawn: { type: PropTypes.Number, default: 1000},
    assetASpawnear: { type: PropTypes.Asset},
    offsetSpawnPos: { type: PropTypes.Vec3, default: new Vec3(0,0,0)},
    visualRef: { type: PropTypes.Entity}
  };

  public IsIntrigger: boolean | undefined;

  public IntervaloModuloAsync: number | undefined;

  preStart() {
    //Conecta la deteccion del trigger
    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerEnterTrigger, this.OnPlayerEnterTrigger.bind(this));
    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerExitTrigger,this.PlayerExitTrigger.bind(this));
    //Ini privates
    
  }

  start() {
    this.IsIntrigger = false;
    this.IntervaloModuloAsync = 0;
  }

  OnPlayerEnterTrigger(player: Player) {
    //Avisa de que esta dentro
    this.IsIntrigger = true;
    // Add code here that you want to run when a player enters the trigger.
    // For more details and examples go to:
    // https://developers.meta.com/horizon-worlds/learn/documentation/code-blocks-and-gizmos/use-the-trigger-zone
    console.log(`Player ${player.name.get()} entered trigger.`);
    //Cuando entra y, mientras esta dentro, spawnea asset en el  intervalo de spawn
    let spawnTrgPos = this.entity.position.get();
    let spawnPos = spawnTrgPos;
    let randomx = new Vec3(0,0,0);
    let resultx = 0;
    this.IntervaloModuloAsync = this.async.setInterval(()=>{
      if (this.IsIntrigger == true){
        spawnPos.add(this.props.offsetSpawnPos);
        //resultx = Math.random();
        randomx.z = Math.random();;
        randomx.add(spawnPos);
        this.world.spawnAsset(this.props.assetASpawnear!, randomx, this.entity.rotation.get())
        console.log(randomx.z.toString());
      }
      
    }, this.props.timeIntervaloSpawn);
  }

  PlayerExitTrigger(player: Player) {
    //Avisa de que esta fuera
    console.log(`Player ${player.name.get()} exit trigger.`);
    //setea las condiciones
    this.IsIntrigger = false;
    this.async.clearInterval(this.IntervaloModuloAsync!);
  }
}
Component.register(sc_genMaterialesCub);
