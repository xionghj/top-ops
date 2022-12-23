import { ref } from 'vue';
const isShowAddBusinessDialog = ref(false);
const currentBusinessId = ref();
const isRefresh = ref(false);
// 应用管理-业务管理
export const useBusinessDialog = () => {
  const showAddBusinessDialogChange = () => {
    isShowAddBusinessDialog.value = !isShowAddBusinessDialog.value;
  };
  const closeAddBusinessDialogChange = () => {
    isShowAddBusinessDialog.value = false;
  };
  const refresh = () => {
    isRefresh.value = !isRefresh.value;
  };
  return {
    isShowAddBusinessDialog,
    currentBusinessId,
    isRefresh,
    refresh,
    showAddBusinessDialogChange,
    closeAddBusinessDialogChange,
  };
};
