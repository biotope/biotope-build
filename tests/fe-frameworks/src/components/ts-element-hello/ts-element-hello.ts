import '@webcomponents/webcomponentsjs/webcomponents-bundle';
import Component, { HTMLFragment } from '@biotope/element';
import style from './ts-element-hello.scss';

export class TsElementHello extends Component {
  public static componentName = 'ts-element-hello';

  protected styles = style.default;

  public render(): HTMLFragment {
    return this.html`
      <div>
        <span>${PLACEHOLDERS.TS_ELEMENT}</span>
        <span className=${style.elementSuccess}>OK</span>
      </div>
    `;
  }
}
