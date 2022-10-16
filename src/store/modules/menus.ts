import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useSelectSubMenu = defineStore('selectSubMenu', () => {
  const selectSubMenu = ref<string[]>([]);

  return {
    selectSubMenu,
  };
});
