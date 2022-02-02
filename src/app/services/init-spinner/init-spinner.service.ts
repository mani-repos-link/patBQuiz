import {Injectable, Renderer2, RendererFactory2} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InitSpinnerService {

  private render!: Renderer2;
  private spinnerContainerDOM!: HTMLElement;
  private spinnerDOM: any;
  private spinnerTextDOM: any;

  constructor(private rendererFactory2: RendererFactory2) {
    this.render = this.rendererFactory2.createRenderer(null, null);
    this.initTemporarySpinnerStyle();
    this.initSpinnerContainer();
  }

  private initSpinnerContainer() {
    this.spinnerContainerDOM = this.render.createElement('div');
    this.spinnerContainerDOM.classList.add('app-init-spinner-container');

    this.spinnerTextDOM = this.render.createElement('div');
    this.spinnerTextDOM.style = 'font-size:1.8rem; margin-top:6px;color:#ccc;';
    this.spinnerTextDOM.innerText = 'Loading...';

    this.spinnerDOM = this.render.createElement('div');
    this.spinnerDOM.classList.add('app-init-spinner');

    this.spinnerContainerDOM.append(this.spinnerDOM);
    this.spinnerContainerDOM.append(this.spinnerTextDOM);
  }

  private initTemporarySpinnerStyle() {
    const styleCont = this.getSpinnerContainerStyle();
    const styleSpinner = this.getSpinnerStyle();
    const spinningAnim = this.getSpinningAnimationKeyframe();
    const styleTag = this.render.createElement('style');
    document.head.append(styleTag);
    styleTag.type = 'text/css';
    styleTag.innerHTML = styleCont + '\n' + styleSpinner + '\n' + spinningAnim;
  }

  public showSpinner(text: string = 'loading...') {
    if (this.spinnerContainerDOM == null) {
      this.initSpinnerContainer();
    }
    this.spinnerTextDOM.innerText = text;
    document.body.append(this.spinnerContainerDOM);
  }

  public hideSpinner() {
    if (this.spinnerContainerDOM == null) {
      this.initSpinnerContainer();
    }
    document.body.removeChild(this.spinnerContainerDOM);
  }

  private getSpinnerContainerStyle(): string {
    return (
      '.app-init-spinner-container {' +
      'overflow:hidden;' +
      'position:fixed;' +
      'top: 0;' +
      'width:100%;' +
      'height: 100%;' +
      'display:flex;' +
      'z-index: 9991;' +
      'justify-content:center;' +
      'align-items:center;' +
      'background-color:#2c2c2ca6;' +
      'flex-flow:column;' +
      '} '
    );
  }

  private getSpinnerStyle(): string {
    return (
      '.app-init-spinner{' +
      'pointer-events:none;' +
      'width:6rem;height:6rem;' +
      'border:0.4em solid #cfcfcf;' +
      'border-top-color: #007be4;' +
      'border-radius:50%;' +
      'animation:app-init-loading-spin-anim 1s linear infinite;' +
      '} '
    );
  }

  private getSpinningAnimationKeyframe(): string {
    return '@keyframes app-init-loading-spin-anim {100% {transform: rotate(360deg);}}';
  }

}
