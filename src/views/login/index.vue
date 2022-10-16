<template>
  <div class="login-box">
    <div class="bg-overlay" />
    <div class="flex flex-col bg-white z-[1] w-80 rounded p-8 md:w-[28rem]">
      <div class="flex flex-col items-center">
        <div class="text-lg font-medium mb-2 text-[#405189]">Welcome Back !</div>
        <div class="mb-6 text-[#878a99]">Sign in to continue to DevOps.</div>
      </div>
      <a-form :model="state.formInline" name="basic" autocomplete="off" @finish="handleSubmit">
        <div class="mb-2 text-[#212529] font-medium">Username</div>
        <a-form-item name="username" :rules="[{ required: true, message: 'Enter username!' }]">
          <a-input
            v-model:value="state.formInline.username"
            size="large"
            placeholder="Enter username"
          />
        </a-form-item>
        <div class="mb-2 text-[#212529] font-medium">Password</div>
        <a-form-item name="password" :rules="[{ required: true, message: 'Enter password!' }]">
          <a-input-password
            v-model:value="state.formInline.password"
            size="large"
            placeholder="Enter password"
          />
        </a-form-item>

        <a-form-item>
          <a-button class="w-full mt-4" type="primary" html-type="submit" size="large"
            >登录</a-button
          >
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>
<script setup lang="ts">
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
<style lang="postcss" scoped></style>
<style lang="less" scoped>
  .login-box {
    display: flex;
    width: 100vw;
    height: 100vh;
    padding-top: 200px;
    background-size: 100%;
    flex-direction: column;
    align-items: center;
    background: linear-gradient(-45deg, #0d6efd 50%, #198754);
    // background: linear-gradient(-45deg, #4791ff 50%, #4a47f7);
    // background-image: linear-gradient(to right, #fbc2eb, #a6c1ee);

    .bg-overlay {
      position: absolute;
      height: 100%;
      width: 100%;
      right: 0;
      bottom: 0;
      left: 0;
      top: 0;
      background-image: url(@/assets/images/cover-pattern.png);
      background-position: 50%;
      background-size: cover;
      opacity: 1;
      background-color: transparent;
    }
  }
</style>
