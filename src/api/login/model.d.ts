declare namespace API {
  /** 登录参数 */
  type LoginParams = {
    captchaId: string;
    password: string;
    username: string;
    verifyCode: string;
  };

  /** 登录成功结果 */
  type LoginResult = {
    token: string;
  };

  /** 获取菜单树 */
  type PermMenu = {
    menus: Menu[];
    perms: string[];
  };
}
