export const addEngineRoom = {
  title: '新增机房',
  name: 'addEngineRoom',
  activeMenu: 'IbcManage', // 父级选中
  kind: 'menu',
  display: false,
  priority: '',
  icon: '',
  code: 'd2eb72dddea853a5', // 父级code
  path: '/cmdb/addEngineRoom',
  component: '/resourceManage/infrastructure/idcManage/addEngineRoom/index',
};
export const engineRoomDetails = {
  title: '详情',
  name: 'engineRoomDetails',
  activeMenu: 'IbcManage', // 父级选中
  kind: 'menu',
  display: false,
  priority: '',
  icon: '',
  code: 'd2eb72dddea853a5', // 父级code
  path: '/cmdb/engineRoomDetails',
  component: '/resourceManage/infrastructure/idcManage/engineRoomDetails/index',
};

export default [addEngineRoom, engineRoomDetails];
