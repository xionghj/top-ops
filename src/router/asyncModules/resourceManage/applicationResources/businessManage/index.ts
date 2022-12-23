const addBusiness = {
  title: '新增业务',
  name: 'addBusiness',
  activeMenu: 'BusinessManage',
  kind: 'menu',
  display: false,
  priority: '',
  icon: '',
  code: 'c35928fa6dcf26b9', // 父级code
  path: '/cmdb/addBusiness',
  component: '/resourceManage/applicationResources/businessManage/addBusiness/index',
};
const businessDetails = {
  title: '详情',
  name: 'businessDetails',
  activeMenu: 'BusinessManage', // 父级选中
  kind: 'menu',
  display: false,
  priority: '',
  icon: '',
  code: 'c35928fa6dcf26b9', // 父级code
  path: '/cmdb/businessDetails',
  component: '/resourceManage/applicationResources/businessManage/businessDetails/index',
};
export default [addBusiness, businessDetails];
