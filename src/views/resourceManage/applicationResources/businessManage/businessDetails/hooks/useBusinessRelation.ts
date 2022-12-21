import { ref } from 'vue';
type Key = string | number;
const selctParentChidrenMeus = ref('parent');
const parentInfoId = ref();
const selectChildren = ref<Key[]>([]);
const isRefresh = ref(false);
export const useBusinessRelation = () => {
  return {
    selctParentChidrenMeus,
    parentInfoId,
    selectChildren,
    isRefresh,
  };
};
