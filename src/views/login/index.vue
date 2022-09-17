<template>
  <div class="login-box">
    <div class="login-content">
      <div class="login-title">Ops</div>
      <a-form :model="formState" name="basic" autocomplete="off" @finish="onFinish">
        <a-form-item name="username" :rules="[{ required: true, message: '请输入账号!' }]">
          <a-input v-model:value="formState.username" size="large">
            <template #prefix>
              <UserOutlined class="site-form-item-icon" />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item name="password" :rules="[{ required: true, message: '请输入密码!' }]">
          <a-input-password v-model:value="formState.password" size="large">
            <template #prefix>
              <LockOutlined class="site-form-item-icon" />
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item>
          <a-button class="login-button" type="primary" html-type="submit" size="large">登录</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
  import { reactive } from 'vue';
  interface FormState {
    username: string;
    password: string;
  }
  const formState = reactive<FormState>({
    username: '',
    password: '',
  });
  const onFinish = (values: any) => {
    console.log('Success:', values);
  };
</script>
<style lang="less" scoped>
  .login-box {
    display: flex;
    width: 100vw;
    height: 100vh;
    padding-top: 240px;
    background-size: 100%;
    flex-direction: column;
    align-items: center;
    // background-image: linear-gradient(to right, #fbc2eb, #a6c1ee);

    .login-content {
      display: flex;
      flex-direction: column;
      background-color: #fff;
      width: 460px;
      border-radius: 12px;
      padding: 20px 50px;

      .login-title {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 30px;
      }

      .login-button {
        width: 100%;
        margin-top: 10px;
      }
    }
  }
</style>
