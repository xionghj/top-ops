const addCluster = {
  title: '新增集群',
  name: 'addCluster',
  activeMenu: 'clusterManage',
  kind: 'menu',
  display: false,
  priority: '',
  icon: '',
  code: 'c35928fa6dcf26b9', // 父级code
  path: '/cmdb/addCluster',
  component: '/resourceManage/applicationResources/clusterManage/addCluster/index',
};
const clusterDetails = {
  title: '详情',
  name: 'clusterDetails',
  activeMenu: 'clusterManage', // 父级选中
  kind: 'menu',
  display: false,
  priority: '',
  icon: '',
  code: 'c35928fa6dcf26b9', // 父级code
  path: '/cmdb/clusterDetails',
  component: '/resourceManage/applicationResources/clusterManage/clusterDetails/index',
};
export default [addCluster, clusterDetails];
