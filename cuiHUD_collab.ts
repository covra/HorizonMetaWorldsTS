import { Vec3 } from 'horizon/core';
import { Text, UIComponent, UINode, View, Binding, AnimatedBinding, Animation } from 'horizon/ui';

class cuiHUD_collab extends UIComponent<typeof cuiHUD_collab> {
  protected panelHeight: number = 300;
  protected panelWidth: number = 500;

  static propsDefinition = {};

  private numeroPasos = new Binding<string>('0');
  private numeroPasosNumber = 0;
  private isEnModoLocal = new Boolean (false);
  private DIST_PASO = 0.2;

  start(): void {
    
  }

  initializeUI(): UINode {
    const borderLine = 5;
    let panelHTitle = (this.panelHeight / 2) - (2 *(borderLine + 1.1));
    let panelWTitle = this.panelWidth - (2 *(borderLine + 1.1));

    const anim = new AnimatedBinding(panelHTitle);
    anim.set(Animation.timing(panelHTitle / 2));

    let oldPos = new Vec3(0,0,0);
    let currentPos = new Vec3(0,0,0);

    this.async.setInterval(()=>{
      if(this.entity.owner.get() !== this.world.getServerPlayer() ) {
        //console.log(this.entity.owner.get().forward.get());
        this.isEnModoLocal = true;
        if (this.isEnModoLocal) {
          currentPos = this.entity.owner.get().position.get();
          let newDist = currentPos.distance(oldPos);
          oldPos = currentPos;
          let nuevosPasos = Math.ceil(newDist / this.DIST_PASO);
          this.numeroPasosNumber = this.numeroPasosNumber + nuevosPasos;
          this.numeroPasos.set(this.numeroPasosNumber.toString());
        }
      }
    },150);


    return View({
      children: [
        Text({
          text: 'Pasiquios Auto',
          style: {
            fontSize: 30,
            textAlign: 'center',
            textAlignVertical: 'center',
            height: panelHTitle,
            width: panelWTitle,
            borderColor: 'white',
            borderWidth: borderLine,
            borderRadius: 5,
          }
        }),
        Text({
          text: this.numeroPasos,
          style:{
            fontSize: 40,
            textAlign: 'center',
            textAlignVertical: 'center',
            height: panelHTitle,
            width: anim,
            borderColor: 'white',
            borderWidth: borderLine,
            borderRadius: 5,
          }
        }),
      ],
      style: {
        backgroundColor: 'red',
        height: this.panelHeight,
        width: this.panelWidth,
        alignContent: 'center',
        alignItems: 'center'
      }
    });
  }
}
UIComponent.register(cuiHUD_collab);
