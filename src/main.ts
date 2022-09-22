import { createApp } from 'vue';
import router from './router';
import { setupStore } from '@/store';

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

// 引入 less
import './styles/index.less';
import App from './App.vue';

const app = createApp(App);
setupStore(app);
app.use(Antd);
app.use(router);
app.mount('#app');
