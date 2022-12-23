const addApplication = {
  title: '新增业务',
  name: 'addApplication',
  activeMenu: 'applicationManage',
  kind: 'menu',
  display: false,
  priority: '',
  icon: '',
  code: 'c35928fa6dcf26b9', // 父级code
  path: '/cmdb/addApplication',
  component: '/resourceManage/applicationResources/applicationManage/addApplication/index',
};
const applicationDetails = {
  title: '详情',
  name: 'applicationDetails',
  activeMenu: 'applicationManage', // 父级选中
  kind: 'menu',
  display: false,
  priority: '',
  icon: '',
  code: 'c35928fa6dcf26b9', // 父级code
  path: '/cmdb/applicationDetails',
  component: '/resourceManage/applicationResources/applicationManage/applicationDetails/index',
};
export default [addApplication, applicationDetails];
