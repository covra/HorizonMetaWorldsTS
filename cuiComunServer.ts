import { Text, UIComponent, UINode, View, Binding } from 'horizon/ui';

class cuiComunServer extends UIComponent<typeof cuiComunServer> {
  protected panelHeight: number = 300;
  protected panelWidth: number = 500;

  static propsDefinition = {};


  private numeroPasos = new Binding<string>('0');

  initializeUI(): UINode {
    let testPasos = 0;
    this.async.setInterval(()=>{
      testPasos ++; 
      this.numeroPasos.set(testPasos.toString());
    },1000);

    const borderLine = 5;
    let panelHTitle = (this.panelHeight / 2) - (2 *(borderLine + 1.1));
    let panelWTitle = this.panelWidth - (2 *(borderLine + 1.1));

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
            width: panelWTitle,
            borderColor: 'white',
            borderWidth: borderLine,
            borderRadius: 5,
          }
        }),
      ],
      style: {
        backgroundColor: 'black',
        height: this.panelHeight,
        width: this.panelWidth,
        alignContent: 'center',
        alignItems: 'center'
      }
    });
  }
}
UIComponent.register(cuiComunServer);
