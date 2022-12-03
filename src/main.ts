import { createApp } from 'vue';
// import Antd from 'ant-design-vue';
import { setupRouter } from './router';
import App from './App.vue';
import { setupStore } from '@/store';

// 引入 less
import './styles/index.less';
import 'virtual:svg-icons-register';

import 'ant-design-vue/dist/antd.css';
import './styles/public.less';
import { setupCustomComponents } from '@/plugins';

const app = createApp(App);
function setupPlugins() {
  // 注册全局自定义组件,如：<svg-icon />
  setupCustomComponents(app);
}
// app.use(Antd);
async function setupApp() {
  setupStore(app);
  // 挂载路由
  await setupRouter(app);

  app.mount('#app');
}
setupPlugins();

setupApp();
