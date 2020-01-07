import Component, { HTMLFragment } from '@biotope/element';
import styles from './styles.scss';
import testSvg from './test-svg.svg';
import testPng from './test-image.png';
import testJpg from './test-image.jpg';
import testJson from './test-info.json';

export class BioWorld extends Component {
  public static componentName = 'bio-world';

  private exampleSvg = this.createRaw(testSvg);

  public render(): HTMLFragment {
    console.log('imported json:', testJson);

    return this.html`
      <div class=${styles.container}>
        <p class=${styles.text}>Hello <slot /> World!<p>
        <div class=${styles.image}>
          ${this.exampleSvg}
        </div>
        <img class=${styles.image} src=${testPng} />
        <img class=${styles.image} src=${testJpg} />
      </div>
      ${this.createStyle(styles.default)}
    `;
  }
}
