import Component, { HTMLFragment } from '@biotope/element';
import styles from './styles.scss';

class BioWorld extends Component {
  public static componentName = 'bio-world';

  public render(): HTMLFragment {
    return this.html`
      <div class=${styles.container}>
        <p class=${styles.text}>Hello <slot /> World!<p>
      </div>
      ${this.createStyle(styles.default)}
    `;
  }
}

export { BioWorld };
