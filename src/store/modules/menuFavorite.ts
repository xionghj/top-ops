import { defineStore } from 'pinia';
import { getMenuFavoriteList, getMenuFavoriteIdList } from '@/api/system/menu';

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
        console.log('获取菜单收藏列表', favoriteList, favoriteIdList);
      } catch (error) {
        return Promise.reject(error);
      }
    },
  },
});
