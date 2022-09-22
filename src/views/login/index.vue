<template>
  <div class="login-box">
    <div class="login-content">
      <div class="login-title">DevOps</div>
      <a-form :model="state.formInline" name="basic" autocomplete="off" @finish="handleSubmit">
        <a-form-item name="username" :rules="[{ required: true, message: '请输入账号!' }]">
          <a-input v-model:value="state.formInline.username" size="large">
            <template #prefix>
              <UserOutlined class="site-form-item-icon" />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item name="password" :rules="[{ required: true, message: '请输入密码!' }]">
          <a-input-password v-model:value="state.formInline.password" size="large">
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
  import { useRoute, useRouter } from 'vue-router';
  import { message, Modal } from 'ant-design-vue';
  import { useUserStore } from '@/store/modules/user';
  import { to } from '@/utils/awaitTo';

  const route = useRoute();
  const router = useRouter();
  const userStore = useUserStore();
  const state = reactive({
    loading: false,
    captcha: '',
    formInline: {
      username: '',
      password: '',
    },
  });

  const handleSubmit = async () => {
    message.loading('登录中...', 0);
    state.loading = true;
    // params.password = md5(password)

    const [err] = await to(userStore.login(state.formInline));
    if (err) {
      Modal.error({
        title: () => '提示',
        content: () => err.message,
      });
    } else {
      message.success('登录成功！');
      setTimeout(() => router.replace((route.query.redirect as string) ?? '/'));
    }
    state.loading = false;
    message.destroy();
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
