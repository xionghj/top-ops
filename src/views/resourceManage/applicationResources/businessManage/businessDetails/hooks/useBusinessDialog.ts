import { ref } from 'vue';
const showAddBusinessDialog = ref(false);
// 操作类型
const operationType = ref('parent');
export const useBusinessDialog = () => {
  const showAddBusinessDialogChange = (type: string) => {
    operationType.value = type;
    showAddBusinessDialog.value = !showAddBusinessDialog.value;
  };
  const closeAddBusinessDialogChange = () => {
    showAddBusinessDialog.value = false;
  };
  return {
    showAddBusinessDialog,
    operationType,
    showAddBusinessDialogChange,
    closeAddBusinessDialogChange,
  };
};
