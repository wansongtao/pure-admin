<script lang="ts" setup>
const version = __APP_VERSION__
</script>

<template>
  <footer class="footer">
    {{ version }}
  </footer>
</template>

<style lang="scss" scoped>
.footer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  font-size: 12px;
  text-align: center;
  color: #777c81;
}
</style>
