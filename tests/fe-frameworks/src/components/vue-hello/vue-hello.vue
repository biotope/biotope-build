<template>
  <div>
    <span>{{ text }}</span>
    <span class="vue-success">{{ okText }}</span>
  </div>
</template>

<script>
import { okText } from './external-dependency';

export default {
  data() {
    return {
      text: PLACEHOLDERS.VUE_SFC,
      okText,
    };
  }
}
</script>

<style lang="scss">
// FIXME: class names are not converted - use BEM to be safe
.vue-success {
  color: green; // FIXME: cannot use $COLORS_SUCCESS variable here
}

// FIXME: class names are not converted - use BEM to be safe
.vue-fail {
  color: red; // FIXME: cannot use $COLORS_FAIL variable here
}
</style>
