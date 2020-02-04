<template>
  <div class="my-vue-class">{{ text }}</div>
</template>

<script>
import { answer } from 'question';

export default {
  data() {
    return {
      text: `Hello SFC World! ${answer}`,
    };
  }
}
</script>

<style lang="scss">
@import './example';

.my-vue-class {
  color: $sass-variable-color;
}
</style>
