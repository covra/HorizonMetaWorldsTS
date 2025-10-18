import { CodeBlockEvents, Component, Entity, Player, PlayerInput, PropTypes, ButtonPlacement, ButtonIcon, PlayerControls, PlayerInputAction } from 'horizon/core';
import { Binding, Text, UIComponent, UINode, View } from 'horizon/ui';

class transferOwnershipLocalServer extends Component<typeof transferOwnershipLocalServer>{
  static propsDefinition = {
    selfGuizmo: { type: PropTypes.Entity},
    otroGuizmo2: { type: PropTypes.Entity},
    trgSource: { type: PropTypes.Entity},
    customInputEntity: { type: PropTypes.Entity}
  };

  preStart() {
    this.connectCodeBlockEvent(this.entity, CodeBlockEvents.OnPlayerEnterTrigger, this.OnPlayerEnterTrigger.bind(this));

  }

  start() {

  }

  OnPlayerEnterTrigger(player: Player) {
    // Add code here that you want to run when a player enters the trigger.
    // For more details and examples go to:
    // https://developers.meta.com/horizon-worlds/learn/documentation/code-blocks-and-gizmos/use-the-trigger-zone
    console.log(`Player ${player.name.get()} entered trigger.`);    
    this.entity.visible.set(true)

    //Asignacion de owner (cliente) local al player
    this.async.setTimeout(()=>{
      this.entity.owner.set(player);
      if (this.props.selfGuizmo && this.props.otroGuizmo2 && this.props.customInputEntity) {
        this.props.selfGuizmo.owner.set(player);
        this.props.otroGuizmo2.owner.set(player);
        this.props.customInputEntity.owner.set(player);
      }
      
    },100);
    
    
  }

}
Component.register(transferOwnershipLocalServer);


//Clase custom input
class customInputTest extends Component<typeof customInputTest>{
  static propsDefinition: {};

  // Defines a variable for holding a player input action.
  input?: PlayerInput;
  start(): void {
    this.async.setTimeout(()=>{
      const estePlayer = this.entity.owner.get();
      if (estePlayer !== this.world.getServerPlayer()) {
        const options = {preferredButtonPlacement: ButtonPlacement.Center};
          if (PlayerControls.isInputActionSupported(PlayerInputAction.Jump)) {
            // Set player input to the jump action, set the on-screen button
            // icon to the jump icon, and set the button placement to center.
            // third parameter is the disposableObject, which is set to "this".
            this.input = PlayerControls.connectLocalInput(
              PlayerInputAction.Jump,
              ButtonIcon.Jump,
              this,
              options,
            );

            // Register to receive the jump action when the player presses the spacebar.
            this.input.registerCallback((action, pressed) => {
              // Set spacebar to the jump action.
              const keyName = PlayerControls.getPlatformKeyNames(action)[0];
              console.log('Action pressed callback', action, keyName, pressed);
            });
          }



      }
    },1000);
  }
}
Component.register(customInputTest)

//clase ui
class uitestTransfer extends UIComponent <typeof uitestTransfer> {
  static propsDefinition = {};
  private bindText1 = new Binding<string>('DeviceType');

start(): void {
      this.async.setTimeout(()=>{
      const estePlayer = this.entity.owner.get();
      //Eliminamos el error de cuando carga la version de este script en el server (donde no hay representacion fisica del player)
      if (estePlayer !== this.world.getServerPlayer()) {
        const typeDevice = estePlayer.deviceType.get();
        const strDType = typeDevice.toString();
        this.bindText1.set(strDType);
        console.log('FORWARD del playerlocal: ',estePlayer.forward.get());
      }
    },1000);
}

initializeUI(): UINode{
  return View({
    children:[
    Text({
      text: this.bindText1,
      style: {
        height: 200,
        width: 400,
        backgroundColor: 'blue'
      }
    })
  ],
    style:{
      height: 300,
      width: 600,
      backgroundColor: 'green',
      alignContent: 'space-between'
    }
  });
}

}

UIComponent.register(uitestTransfer)
