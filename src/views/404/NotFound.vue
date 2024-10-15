<script lang="ts" setup></script>

<template>
  <div class="not-found">
    <div class="title">404 Not Found</div>

    <div class="not-found-main">
      <h1>找不到了</h1>
      <p>您要查找的页面可能已被删除或暂时不可用</p>
      <n-button type="warning" size="large" @click="$router.replace('/login')"> 回到主页 </n-button>
    </div>
    <div class="not-found-icon">
      <img src="@/assets/images/404.png" alt="" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.not-found {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: 40px;
  width: 100vw;
  height: 100vh;

  .title {
    position: absolute;
    top: 20px;
    left: 40px;
    font-size: 24px;
    font-weight: 600;
    color: #333;
  }

  .not-found-main {
    flex: 1;
    h1 {
      font-size: 48px;
      font-weight: 700;
      color: #333;
    }

    p {
      margin: 30px 0;
      font-size: 18px;
      color: #333;
    }
  }

  .not-found-icon {
    flex: 1;
    margin-left: 20px;
    img {
      height: 80vh;
    }
  }
}
</style>
