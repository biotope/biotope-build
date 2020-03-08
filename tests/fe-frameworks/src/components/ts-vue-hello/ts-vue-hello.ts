import Vue from 'vue';
import { Component, Provide } from 'vue-property-decorator';
import styleInject from 'style-inject';
import template from './template.vue';
import style from './ts-vue-hello.scss';

styleInject(style.default);

@Component({ ...template })
export class TsVueHello extends Vue {
  @Provide() public style = style;

  @Provide() public text = PLACEHOLDERS.TS_VUE;
}
