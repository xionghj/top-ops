import type { App } from 'vue';

import { SvgIcon } from '@/components/basic/svg-icon';
import { IconFont } from '@/components/basic/iconfont';
import Breadcrumb from '@/components/basic/Breadcrumb/index.vue';

/**
 * 全局注册自定义组件
 * @param app
 */
export function setupCustomComponents(app: App) {
  app.component(SvgIcon.name, SvgIcon);
  app.component(IconFont.name, IconFont);
  app.component('Breadcrumb', Breadcrumb);
}
