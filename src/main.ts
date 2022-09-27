import { createApp } from 'vue';
import router from './router';
import { setupStore } from '@/store';

// 引入 less
import './styles/index.less';

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

import App from './App.vue';

const app = createApp(App);
setupStore(app);
app.use(Antd);
app.use(router);
app.mount('#app');
