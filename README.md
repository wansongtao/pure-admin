# admin-pure

使用`vue3`、`vite5`、`ts`、`NaiveUi`开发的极简后台管理系统。仅包含基础功能: 登录、菜单管理、角色管理、用户管理。

后端项目地址：[pure-admin-backend](https://github.com/wansongtao/pure-admin-backend)。

## 功能亮点

- 动态路由；
- 按钮级权限控制；
- 支持缓存历史查询条件，刷新网站不丢失当前查询条件，点击浏览器回退按钮回到上一个查询条件；
- axios封装，内置重复请求解决方案、双token无感刷新登录、错误重试、内置错误优先的请求方法；
- 支持明亮、暗黑两种主题模式，自动跟随系统主题变化；
- 提供svg图标转换脚本，自动处理单色图标。

## 预览

### 登录页

![登录页](./docs/login.png)

### 菜单管理

![菜单](./docs/menu.png)
![添加菜单](./docs/menu-add.png)

### 角色管理

![角色](./docs/role.png)
![添加角色](./docs/role-add.png)

### 用户管理

![用户管理](./docs/user.png)
![添加用户](./docs/user-add.png)

### 个人中心

![个人中心](./docs/profile.png)

## 快速开始

### 先决条件

- [Node.js](https://nodejs.org/en/) >= 18.0.0
- [pnpm](https://pnpm.io/zh/) >= 6.0.0

### 克隆项目

```sh
git clone https://github.com/wansongtao/pure-admin.git
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

[MIT](./LICENSE)
