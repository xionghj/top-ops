import { createApp } from 'vue';
import router from './router';

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

// 引入 less
import './styles/index.less';
import App from './App.vue';

createApp(App).use(Antd).use(router).mount('#app');
