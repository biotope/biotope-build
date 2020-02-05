<template>
  <div>
    <span>{{ text }}</span>
    <span v-bind:class="{ [style.vueSuccess]: true }">OK</span>
  </div>
</template>
