import hostManage from './hostManage';
import rackManage from './rackManage';
import ibcManage from './ibcManage';
const infrastructure = [...hostManage, ...rackManage, ...ibcManage];

export default infrastructure;
