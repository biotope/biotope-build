import Component, { HTMLFragment } from '@biotope/element';
import styles from './bio-hello.scss';
import testSvg from './test-svg.svg';
import testPng from './test-image.png';
import testJpg from './test-image.jpg';

export class BioHello extends Component {
  public static componentName = 'bio-hello';

  protected styles = styles;

  private exampleSvg = this.createRaw(testSvg);

  public render(): HTMLFragment {
    return this.html`
      <div class="bio-hello--container">
        <p class="bio-hello--text">Hello <slot /> World!</p>
        <div class="bio-hello--image-container">
          <div class="bio-hello--image">
            ${this.exampleSvg}
          </div>
          <img class="bio-hello--image" src=${testPng} />
          <img class="bio-hello--image" src=${testJpg} />
        </div>
      </div>
    `;
  }
}
