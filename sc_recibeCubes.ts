import { CodeBlockEvents, Component, Entity, Player, PropTypes, TextGizmo, ParticleGizmo, VFXParameter, VFXParameterType } from 'horizon/core';

class sc_recibeCubes extends Component<typeof sc_recibeCubes>{
  static propsDefinition = {
    labelTxtLava: { type: PropTypes.Entity},
    vfxParam: { type: PropTypes.Entity},
  };

  public contadorLava: number = 10;


//Funcion de peticion de paremetros de un VFX
  async printParameters ()  {
      // 1. Await the result of the asynchronous method
      const parameters = await this.props.vfxParam?.as(ParticleGizmo).getVFXParameters();

    // 2. Check if parameters is a valid array before trying to iterate
    if (Array.isArray(parameters)) {
      console.log('Numero de elementos de parametros: ',parameters.length.toString());
      parameters.forEach((vfxParam: VFXParameter<VFXParameterType>) => {
        console.log(vfxParam.name + ", " + vfxParam.type);
      });
    } else {
      // Optional: Log a message if no parameters were returned (e.g., if it returned undefined)
      console.log("No VFX parameters were found or returned.");
      // Example output:
      // Opacity, number
      // Trail Active, boolean  
    }
  }

  preStart() {
    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnEntityEnterTrigger, this.OnEntityEnterTrigger.bind(this));
    //this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnEntityEnterTrigger, this.OnEntityEnterTrigger => this.OnEntityEnterTrigger()
  }


  start() {

   //this.printParameters();
   this.props.labelTxtLava?.as(TextGizmo).text.set(this.contadorLava.toString());
  }

  OnEntityEnterTrigger(cubeInTrg: Entity) {
    // Add code here that you want to run when an entity enters the trigger.
    // The entity will need to have a Gameplay Tag that matches the tag your
    // trigger is configured to detect.
    console.log(`Entity ${cubeInTrg.name.get()} entered trigger`);
    //Incrementa el valor del contador
    this.contadorLava = this.contadorLava - 1;
    if (this.contadorLava === 0) {

    } else {
      this.props.labelTxtLava?.as(TextGizmo).text.set(this.contadorLava.toString());
      //Modifica la cantidad en el gizmo text
      this.props.vfxParam?.as(ParticleGizmo).play();
      this.world.deleteAsset(cubeInTrg);

    }
  }
}
Component.register(sc_recibeCubes);
