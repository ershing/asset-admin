import Main from '@/components/main'
import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/register',
    name: 'register',
    meta: {
      title: 'Register - 注册',
      hideInMenu: true
    },
    component: () => import('@/view/register/index.vue')
  },  
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true,
          icon: 'md-home'
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },
  {
    path: '/asset',
    name: '资产管理',
    component: Main,
    meta: {
      hideInBread: true,
      icon: 'logo-usd',
      title: '资产管理'      
    },
    children: [
      {
        path: 'edit',
        name: '资产列表',
        meta: {
          icon: 'ios-card',
          title: '资产列表'
        },
        component: () => import('@/view/asset-edit')
      },
      {
        path: 'module-classify',
        name: '资产模块分类',
        meta: {
          icon: 'ios-paper-outline',
          title: '资产模块分类'
        },
        component: () => import('@/view/asset-classify')
      },
      {
        path: 'spending-classify',
        name: '支出大项分类',
        meta: {
          icon: 'md-paper',
          title: '支出大项分类'
        },
        component: () => import('@/view/spending-classify')
      }            
    ]
  },
  {
    path: '/charge',
    name: '记账管理',
    component: Main,
    meta: {
      hideInBread: true,
      icon: 'ios-create',
      title: '记账管理'
    },
    children: [
      {
        path: 'list',
        name: '记账列表',
        meta: {
          icon: 'md-create',
          title: '记账列表'
        },  
        component: () => import('@/view/charge-list')
      },
      {
        path: 'regular',
        name: '记账计划',
        meta: {
          icon: 'md-clipboard',
          title: '记账计划'
        },
        component: () => import('@/view/regular-charge')
      },
      {
        path: 'edit',
        name: '未来账单',
        meta: {
          icon: 'md-clock',
          title: '未来账单'
        },
        component: () => import('@/view/future-charge')
      }      
    ]
  },
  {
    path: '/chart',
    name: '统计图表',
    component: Main,
    meta: {
      hideInBread: true,
      icon: 'md-options',
      title: '统计图表'
    },
    children: [
      {
        path: 'asset-proportion',
        name: '资产概览',
        meta: {
          icon: 'ios-pie',
          title: '资产概览'
        },
        component: () => import('@/view/asset-proportion')
      },
      {
        path: 'overview',
        name: '收支概览',
        meta: {
          icon: 'ios-podium',
          title: '收支概览'
        },  
        component: () => import('@/view/chart-overview')
      }
    ]
  }  
]
