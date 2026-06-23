import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout/index.vue'
// 主页layout
import NewLayout from '@/layout/NewLayout.vue'
// 智能体layout
import NewLayoutAgent from '@/layout/NewLayoutAgent.vue'
// 空白layout
import BlankLayout from '@/layout/BlankLayout.vue'
import { wrap } from 'lodash'

/**
 * Note: 路由配置项
 *
 * hidden: true                     // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true                 // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                  // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                  // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                  // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect             // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'               // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * query: '{"id": 1, "name": "ry"}' // 访问路由的默认传递参数
 * roles: ['admin', 'common']       // 访问路由的角色权限
 * permissions: ['a:a:a', 'b:b:b']  // 访问路由的菜单权限
 * meta : {
    noCache: true                   // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    title: 'title'                  // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'                // 设置该路由的图标，对应路径src/assets/icons/svg
    breadcrumb: false               // 如果设置为false，则不会在breadcrumb面包屑中显示
    activeMenu: '/system/user'      // 当路由设置了该属性，则会高亮相对应的侧边栏。
  }
 */

const getFakeStaticRoute = () => {
  return [
    {
      path: '',
      component: NewLayout,
      redirect: 'index',
      // meta: { title: '首页', icon: 'main-page' },
      children: [
        {
          path: 'index',
          component: () => import('@/views/index'),
          name: 'index',
          meta: { title: '首页', icon: 'menu-home', affix: true }
        }
      ]
    },
    {
      path: '/knowledgeLibrary',
      component: NewLayout,
      redirect: '/knowledgeLibrary/professional/biological',
      meta: { title: '知识库', icon: 'menu-kg' },
      children: [
        {
          path: 'professional',
          redirect: '/knowledgeLibrary/professional/biological',
          component: { render: h => h('router-view') },
          name: 'Professional',
          meta: { title: '专有知识库', icon: '' },
          children: [
            {
              path: 'biological',
              component: () => import('@/views/custom/kBase/index'),
              name: 'biological',
              meta: { title: '生物样本知识库', icon: '', affix: false,typeLevel2: 'biological_sample' }
            },
            {
              path: 'clinicalKnowledge',
              component: () => import('@/views/custom/clinicalKnowledge/index'),
              name: 'ClinicalKnowledge',
              meta: { title: '临床知识库', icon: '', affix: false }
            }
          ]
        },
        {
          path: 'free',
          meta: { title: '自有知识库', icon: ''  },
          component: { render: h => h('router-view') },
          redirect: '/knowledgeLibrary/free/sop',
          children: [
            {
              path: 'sop',
              component: () => import('@/views/custom/kBase/index'),
              name: 'sop',
              meta: { title: '质量管理体系文件', icon: '', affix: false,typeLevel2: 'sop' }
            },
            {
              path: 'process',
              component: () => import('@/views/custom/kBase/index'),
              name: 'process',
              meta: { title: '科室运行过程文件', icon: '', affix: false,typeLevel2: 'process' }
            },
            {
              path: 'paper',
              component: () => import('@/views/custom/kBase/index'),
              name: 'paper',
              meta: { title: '文献库', icon: '', affix: false,typeLevel2: 'paper' }
            },
            {
              path: 'other',
              component: () => import('@/views/custom/kBase/index'),
              name: 'other',
              meta: { title: '其它', icon: '', affix: false,typeLevel2: 'other' }
            },
          ]
        }
      ]
    },
    {
      path: '/agentMapping',
      component: NewLayout,
      redirect: 'index',
      // meta: { title: '知识图谱', icon: 'menu-map' },
      children: [
        {
          path: 'index',
          component: () => import('@/views/custom/agent/agentMapping/index'),
          name: 'agentMapping',
          meta: { title: '知识图谱', icon: 'menu-map', affix: false }
        }
      ]
    },
    // {
    //   path: '',
    //   component: NewLayout,
    //   redirect: 'mainPage',
    //   // hidden: true,
    //   children: [
    //     {
    //       path: 'mainPage',
    //       component: () => import('@/views/mainPage/index'),
    //       name: 'MainPage',
    //       meta: { title: 'AI问答', icon: 'main-page', affix: false }
    //     }
    //   ]
    // },
    {
      path: '/knowledgeBase',
      component: NewLayout,
      redirect: 'medicalLiteratureKnowledgeBase',
      hidden: true,
      meta: { title: '知识库', icon: 'private-knowledge-database', affix: true },
      children: [
        {
          path: 'medicalLiteratureKnowledgeBase',
          component: () => import('@/views/custom/medicalLiteratureKnowledgeBase/index'),
          name: 'MedicalLiteratureKnowledgeBase',
          meta: { title: '医学文献知识库', icon: '', affix: false }
        },
        {
          path: '/knowledgeBase/bookDetail',
          hidden: true,
          component: () => import('@/views/custom/medicalLiteratureKnowledgeBase/bookDetail'),
          name: 'BookDetail',
          meta: { title: '医学文献详请', icon: '', affix: false }
        },
        {
          path: '/knowledgeBase/clinicalKnowledge',
          component: () => import('@/views/custom/clinicalKnowledge/index'),
          name: 'ClinicalKnowledge',
          meta: { title: '临床知识库', icon: '', affix: false }
        },
        {
          path: '/knowledgeBase/customKnowledgeBase',
          component: () => import('@/views/custom/privateKnowledgeDatabase/index'),
          name: 'CustomKnowledgeBase',
          meta: { title: '自定义知识库', icon: '', affix: false }
        },
        {
          path: '/knowledgeBase/docDivision',
          hidden: true,
          component: () => import('@/views/custom/privateKnowledgeDatabase/docDivision.vue'),
          name: 'DocDivision',
          meta: { title: '文档分块', icon: '', affix: false }
        },
        {
          path: '/knowledgeBase/hitTest',
          hidden: true,
          component: () => import('@/views/custom/privateKnowledgeDatabase/hitTest.vue'),
          name: 'HitTest',
          meta: { title: '命中测试', icon: '', affix: false }
        },
        {
          path: '/knowledgeBase/upload',
          hidden: true,
          component: () => import('@/views/custom/privateKnowledgeDatabase/upload.vue'),
          name: 'Upload',
          meta: { title: '文档上传', icon: '', affix: false }
        },
        {
          path: '/knowledgeBase/knowledgeDocList',
          hidden: true,
          component: () => import('@/views/custom/privateKnowledgeDatabase/knowledgeDocList.vue'),
          name: 'KnowledgeDocList',
          meta: { title: '知识库文档', icon: '', affix: false }
        },
        {
          path: '/knowledgeBase/knowledgeDetail',
          hidden: true,
          component: () => import('@/views/custom/privateKnowledgeDatabase/knowledgeDetail'),
          name: 'KnowledgeDetail',
          meta: { title: '知识详请', icon: '', affix: false }
        }
      ]
    },
    {
      path: '/aiHelper',
      component: NewLayout,
      redirect: 'entry',
      meta: { title: 'AI智办助手', icon: 'auxiliary-work', affix: false },
      hidden:true,
      children: [
        {
          path: 'entry',
          hidden: true,
          component: () => import('@/views/custom/aiHelper/entry/index'),
          name: 'AiHelper',
          meta: { title: '入口', icon: '', affix: false }
        },
        // {
        //   path: '/agent',
        //   component: NewLayoutAgent,
        //   redirect: 'agent',
        //   children: [
        //     {
        //       path: 'agentMain',
        //       component: () => import('@/views/custom/agent/agentMain/index'),
        //       name: 'agentMain',
        //       meta: { title: '质量管理智能体', wrap: false, icon: '', affix: false }
        //     }
        //   ]
        // },
        {
          path: 'voiceRecognition',
          component: () => import('@/views/custom/aiHelper/voiceRecognition/index'),
          name: 'VoiceRecognition',
          meta: { title: '语音识别', icon: '', affix: false }
        },
        {
          path: 'noteHelper',
          component: () => import('@/views/custom/aiHelper/noteHelper/index'),
          name: 'NoteHelper',
          meta: { title: '笔记助手', icon: '', affix: false }
        },
        {
          path: 'generalTranslation',
          component: () => import('@/views/custom/aiHelper/generalTranslation/index'),
          name: 'GeneralTranslation',
          meta: { title: '通用翻译', icon: '', affix: false }
        },
        {
          path: 'generalTranslationDetail',
          component: () => import('@/views/custom/aiHelper/generalTranslation/detail'),
          name: 'GeneralTranslationDetail',
          meta: { title: '通用翻译详情', icon: '', affix: false },
          hidden: true
        },
        {
          path: 'workReport',
          component: () => import('@/views/custom/aiHelper/workReport/index'),
          name: 'WorkReport',
          meta: { title: '工作报告', icon: '', affix: false }
        },
        {
          path: 'scienceArticle',
          component: () => import('@/views/custom/aiHelper/scienceArticle/index'),
          name: 'ScienceArticle',
          meta: { title: '科普文章', icon: '', affix: false }
        },
        {
          path: 'academicCourseware',
          component: () => import('@/views/custom/aiHelper/academicCourseware/index'),
          name: 'AcademicCourseware',
          meta: { title: '学术课件', icon: '', affix: false }
        }
      ]
    },
    {
      path: '/agent',
      component: NewLayout,
      meta: { title: '质量管理智能体', icon: 'menu-agent', affix: false },
      redirect: 'agentMain',
      children: [
         {
              path: 'agentMain',
              component: () => import('@/views/custom/agent/agentMain/index'),
              name: 'agentMain',
              meta: { title: '智能问答',  icon: '', affix: false }
        },
        {
          path: 'agentFileManage',
          component: () => import('@/views/custom/agent/agentFileManage/index'),
          name: 'agentFileManage',
          hidden: true,
          meta: { title: '文件管理', icon: '', affix: false }
        },
        {
          path: 'agentFileRead',
          component: () => import('@/views/custom/agent/agentFileRead/index'),
          name: 'agentFileRead',
          meta: { title: '解析应用', icon: '', affix: false }
        },
        {
          path: 'agentZoom',
          component: () => import('@/views/custom/agent/agentZoom/index'),
          name: 'agentZoom',
          hidden: true,
          meta: { title: '条款速查', icon: '', affix: false }
        },
        {
          path: 'qualityAnalysis',
          component: () => import('@/views/custom/agent/qualityAnalysis/index'),
          name: 'qualityAnalysis',
           hidden: true,
          meta: { title: '质控分析', icon: '', affix: false }
        },
        {
          path: 'qualityAnalysisDetail',
          component: () => import('@/views/custom/agent/qualityAnalysis/detail'),
          name: 'qualityAnalysisDetail',
           hidden: true,
          meta: { title: '质控分析详情', icon: '', affix: false }
        },
        {
          path: 'qualityAnalysisPreview',
          component: () => import('@/views/custom/agent/qualityAnalysis/preview'),
          name: 'qualityAnalysisPreview',
           hidden: true,
          meta: { title: '质控分析查看', icon: '', affix: false }
        },
        {
          path: 'qualityAnalysisList',
          component: () => import('@/views/custom/agent/qualityAnalysis/list'),
          name: 'qualityAnalysisList',
          meta: { title: '质控分析', icon: '', affix: false }
        },
        {
          path: 'qualityAnalysisIllegal',
          component: () => import('@/views/custom/agent/qualityAnalysis/illegal'),
          hidden: true,
          name: 'qualityAnalysisIllegal',
          meta: { title: '改进建议', icon: '', affix: false }
        }
      ]
    },
    {
      path: '/medicalResearch',
      component: NewLayout,
      redirect: 'scienceHelper',
      meta: { title: '科研辅助', icon: 'medical-research', affix: false },
      hidden:true,
      children: [
        {
          path: 'scienceHelper',
          hidden: true,
          component: () => import('@/views/custom/scienceHelper/entry/index'),
          name: 'ScienceHelperEntry',
          meta: { title: '科研辅助入口', icon: '', affix: false }
        },
        {
          path: 'docReader',
          component: () => import('@/views/custom/scienceHelper/docReader/index'),
          name: 'DocReader',
          meta: { title: '文献阅读', icon: '', affix: false }
        },
        {
          path: 'projectApplication',
          component: () => import('@/views/custom/scienceHelper/projectApplication/index'),
          name: 'ProjectApplication',
          meta: { title: '项目申报辅助编写', icon: '', affix: false }
        },
        {
          path: 'medicalReviewAi',
          component: () => import('@/views/custom/scienceHelper/medicalReviewAi/index'),
          name: 'MedicalReviewAi',
          meta: { title: '医学综述AI辅助生成', icon: '', affix: false }
        },
        {
          path: 'aiWrite',
          component: () => import('@/views/custom/scienceHelper/aiWrite/index'),
          name: 'AiWrite',
          meta: { title: 'AI辅助写作', icon: '', affix: false }
        }
      ]
    },
    {
      path: '/filePreview/:fileUrl(.*)',
      hidden: true,
      component: () => import('@/components/filePreview/index.vue'),
      meta: { title: '文件预览', icon: '', affix: false }
    },
    {
      path: '/sysManagement',
      component: NewLayout,
      redirect: 'sysTask',
      meta: { title: '系统管理', icon: 'menu-setting' },
      children: [
        {
          path: 'sysTask',
          component: () => import('@/views/custom/sys/task/index'),
          name: 'sysTask',
          meta: { title: '任务管理', icon: '', affix: false }
        },
        {
          path: 'sysCalendar',
          component: () => import('@/views/custom/sys/calendar/index'),
          name: 'sysCalendar',
          meta: { title: '工作日历', icon: '', affix: false }
        }
      ]
    },
    // {
    //   path: '',
    //   component: NewLayout,
    //   redirect: 'commonChat',
    //   children: [
    //     {
    //       path: '/commonChat',
    //       component: () => import('@/views/custom/chat/commonChat'),
    //       name: 'commonChat',
    //       hidden: true,
    //       meta: { title: '', icon: '', affix: false }
    //     }
    //   ]
    // }
  ]
}

// 公共路由
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect')
      }
    ]
  },
  {
    path: '/login',
    // component: () => import('@/views/login'),
    component: () => import('@/views/newLogin'),
    hidden: true
  },
  {
    path: '/register',
    component: () => import('@/views/register'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error/401'),
    hidden: true
  },
  ...getFakeStaticRoute(),
  // {
  //   path: '',
  //   component: NewLayout,
  //   redirect: '/index',
  // },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'profile',
        component: () => import('@/views/system/user/profile/index'),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user' }
      }
    ]
  }
]

// 动态路由，基于用户权限动态去加载
export const dynamicRoutes = [
  {
    path: '/system/user-auth',
    component: Layout,
    hidden: true,
    permissions: ['system:user:edit'],
    children: [
      {
        path: 'role/:userId(\\d+)',
        component: () => import('@/views/system/user/authRole'),
        name: 'AuthRole',
        meta: { title: '分配角色', activeMenu: '/system/user' }
      }
    ]
  },
  {
    path: '/system/role-auth',
    component: Layout,
    hidden: true,
    permissions: ['system:role:edit'],
    children: [
      {
        path: 'user/:roleId(\\d+)',
        component: () => import('@/views/system/role/authUser'),
        name: 'AuthUser',
        meta: { title: '分配用户', activeMenu: '/system/role' }
      }
    ]
  },
  {
    path: '/system/dict-data',
    component: Layout,
    hidden: true,
    permissions: ['system:dict:list'],
    children: [
      {
        path: 'index/:dictId(\\d+)',
        component: () => import('@/views/system/dict/data'),
        name: 'Data',
        meta: { title: '字典数据', activeMenu: '/system/dict' }
      }
    ]
  },
  {
    path: '/monitor/job-log',
    component: Layout,
    hidden: true,
    permissions: ['monitor:job:list'],
    children: [
      {
        path: 'index/:jobId(\\d+)',
        component: () => import('@/views/monitor/job/log'),
        name: 'JobLog',
        meta: { title: '调度日志', activeMenu: '/monitor/job' }
      }
    ]
  },
  {
    path: '/tool/gen-edit',
    component: Layout,
    hidden: true,
    permissions: ['tool:gen:edit'],
    children: [
      {
        path: 'index/:tableId(\\d+)',
        component: () => import('@/views/tool/gen/editTable'),
        name: 'GenEdit',
        meta: { title: '修改生成配置', activeMenu: '/tool/gen' }
      }
    ]
  }
]

// 防止连续点击多次路由报错
const routerPush = Router.prototype.push
const routerReplace = Router.prototype.replace
// push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(err => err)
}
// replace
Router.prototype.replace = function push(location) {
  return routerReplace.call(this, location).catch(err => err)
}

export default new Router({
  mode: 'history', // 去掉url中的#
  base: '/new-aio-machine',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
