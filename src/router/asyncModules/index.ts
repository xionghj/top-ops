// import { resourceManage } from './resourceManage';
// import { developEfficiency } from './developEfficiency';
import infrastructure from './resourceManage/infrastructure/index';
import applicationResources from './resourceManage/applicationResources/index';
const asyncRouterMap = [...infrastructure, ...applicationResources];

export default asyncRouterMap;
