import { defineStore } from 'pinia';
import {
  getMenuFavoriteList,
  getMenuFavoriteIdList,
  setMenuFavoriteOrder,
} from '@/api/system/menu';

interface MenuFavoriteState {
  menuFavoriteList: API.MenuFavoriteListItem[];
  menuFavoriteIdList: string[];
}
// 菜单收藏Store
export const useMenuFavoriteStore = defineStore({
  id: 'menu-favorite',
  state: (): MenuFavoriteState => ({
    menuFavoriteList: [], // 菜单收藏列表
    menuFavoriteIdList: [], // 菜单收藏ID列表
  }),
  getters: {},
  actions: {
    // 获取菜单收藏列表
    async getMenuFavoriteList() {
      try {
        const favoriteIdList = await getMenuFavoriteIdList();
        const favoriteList = await getMenuFavoriteList();
        this.menuFavoriteList = favoriteList;
        this.menuFavoriteIdList = favoriteIdList;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    // 设置菜单顺序
    async setMenuFavoriteListOrder(oldIndex: number, newIndex: number) {
      const columns = this.menuFavoriteIdList;
      columns.splice(newIndex, 0, columns.splice(oldIndex, 1)[0]);
      try {
        const params = {
          related_ids: columns,
        };
        await setMenuFavoriteOrder(params);
        await this.getMenuFavoriteList();
      } catch (error) {
        return Promise.reject(error);
      }
    },
  },
});
