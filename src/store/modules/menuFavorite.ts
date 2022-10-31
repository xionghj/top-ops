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

export const useMenuFavoriteStore = defineStore({
  id: 'menu-favorite',
  state: (): MenuFavoriteState => ({
    menuFavoriteList: [],
    menuFavoriteIdList: [],
  }),
  getters: {
    // getMenuFavoriteList(): string [] {
    //   return this.menuFavoriteList;
    // },
  },
  actions: {
    // 获取菜单收藏列表
    async getMenuFavoriteList() {
      try {
        const favoriteList = await getMenuFavoriteList();
        const favoriteIdList = await getMenuFavoriteIdList();
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
