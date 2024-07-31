# admin-pure

使用`vue3`、`vite5`、`ts`、`Ant Design Vue4`开发的极简后台管理系统。仅包含基础功能: 登录、菜单管理、角色管理、用户管理。

## 功能亮点

- 动态路由；
- 按钮级权限控制；
- 支持缓存历史查询条件，刷新网站不丢失当前查询条件，点击浏览器回退按钮回到上一个查询条件；
- axios封装，内置重复请求解决方案、内置错误优先的请求方法；
- 支持明亮、暗黑两种主题模式，自动跟随系统主题变化；
- 提供跨组件通信方案`EventBus`；
- excel生成与导出方案；
- ant-design-vue的table组件二次封装，提供更友好的类型提示等；
- `usePageRequest`hooks，可用于快速简单地发送分页请求等；
- `useIdleDetection`hooks，可用于检测用户是否处于空闲状态。

## 预览

### 登录页

![登录页](./docs/login.png)

### 菜单管理

![菜单](./docs/menu.png)
![添加菜单](./docs/menu-add.png)

### 角色管理

![角色](./docs/role.png)

### 用户管理

![用户管理](./docs/user.png)

## 快速开始

### 先决条件

- [Node.js](https://nodejs.org/en/) >= 18.0.0
- [pnpm](https://pnpm.io/zh/) >= 6.0.0

### 克隆项目

```sh
git clone https://github.com/wansongtao/admin-pure.git
```

### 安装依赖

```sh
pnpm install
```

### 本地开发

```sh
pnpm dev
```

### 生产构建

```sh
pnpm build
```

## 许可协议

基于 [MIT](./LICENSE) 许可协议进行开源。
