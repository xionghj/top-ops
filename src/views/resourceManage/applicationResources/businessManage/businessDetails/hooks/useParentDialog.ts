import { ref } from 'vue';
export const useParentDialog = () => {
  const showAddParentDialog = ref(false);
  const showAddParentDialogChange = () => {
    showAddParentDialog.value = !showAddParentDialog.value;
    console.log('触发了', showAddParentDialog.value);
  };
  const closeAddParentDialogChange = () => {
    showAddParentDialog.value = false;
    console.log('触发了1111', showAddParentDialog.value);
  };
  return {
    showAddParentDialog,
    showAddParentDialogChange,
    closeAddParentDialogChange,
  };
};
