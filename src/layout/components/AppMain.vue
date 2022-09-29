<template>
  <div class="app-main">
    <div style="height: auto">
      <router-view />
    </div>
  </div>
</template>
<style scoped>
  .app-main {
    /* min-height: calc(100% - 50px); */
    background-color: #f0f2f5;
    flex-grow: 1;
    overflow: auto;
    padding: 12px;
  }
</style>
