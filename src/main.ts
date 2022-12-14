import { createApp } from 'vue';
import { setupRouter } from './router';
import { setupStore } from '@/store';

// 引入 less
import './styles/index.less';

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

import App from './App.vue';

const app = createApp(App);
app.use(Antd);
async function setupApp() {
  setupStore(app);
  // 挂载路由
  await setupRouter(app);

  app.mount('#app');
}
setupApp();
