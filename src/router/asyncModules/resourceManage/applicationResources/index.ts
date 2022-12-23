import businessManage from './businessManage/index';
import applicationManage from './applicationManage/index';
import clusterManage from './clusterManage/index';
const applicationResources = [...businessManage, ...applicationManage, ...clusterManage];

export default applicationResources;
