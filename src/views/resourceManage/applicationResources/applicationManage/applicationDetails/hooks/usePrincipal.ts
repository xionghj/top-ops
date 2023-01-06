import { ref } from 'vue';
const currentPrincipal = ref('devManage');
const isRefresh = ref(false);
// 应用-负责人
export const usePrincipal = () => {
  const refresh = () => {
    isRefresh.value = !isRefresh.value;
  };
  return {
    currentPrincipal,
    isRefresh,
    refresh,
  };
};
