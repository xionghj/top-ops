export const PARENT_LAYOUT_NAME = 'ParentLayout';

/**
 * @description: default layout
 */
export const LAYOUT = () => import('@/layout/index.vue');

/**
 * @description: parent-layout
 */
export const getParentLayout = (_name?: string) => {
  return () =>
    new Promise((resolve) => {
      resolve({
        name: PARENT_LAYOUT_NAME,
      });
    });
};
