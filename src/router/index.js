import Vue from 'vue'
import Router from 'vue-router'
import axios from 'axios';
import ElmentUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import Header from '@/components/Header'
import Login from '@/components/Login.vue'
import Welcome from '@/components/Welcome.vue'
import NoAuth from '@/components/NoAuth.vue'
import add_project from '@/components/process_manage/add_project'
import apply_project from '@/components/process_manage/apply_project'
import approve_manage from '@/components/process_manage/approve_manage'
import project_detail from '@/components/process_manage/project_detail'
import file_project from '@/components/process_manage/file_project'
import file_project_submit_files from '@/components/process_manage/file_project_submit_files'
import audit_file from '@/components/process_manage/audit_file'
import audit_file_detail from '@/components/process_manage/audit_file_detail'
import configure_library from '@/components/process_manage/configure_library'
import manage_project from '@/components/project_manage/manage_project'
import manage_authority from '@/components/project_manage/manage_authority'
import manage_personinfo from '@/components/project_manage/manage_personinfo'
import manage_personinfo_modify from '@/components/project_manage/manage_personinfo_modify'
import manage_proinfo from '@/components/project_manage/manage_proinfo'
import manage_proinfo_modify from '@/components/project_manage/manage_proinfo_modify'
import manage_functions from '@/components/project_manage/manage_functions'
import manage_functions_import_excel from '@/components/project_manage/manage_functions_import_excel'
import checkWorkTime from '@/components/workTime_manage/checkWorkTime'
import applyWorkTime from '@/components/workTime_manage/applyWorkTime'

import manage_facility from '@/components/others_manage/manage_facility'
import facility from '@/components/others_manage/facility'
import facility_modify from '@/components/others_manage/facility_modify'

import manage_risk from '@/components/others_manage/manage_risk'
import risk from '@/components/others_manage/risk'
import risk_modify from '@/components/others_manage/risk_modify'

import problem from '@/components/others_manage/problem'
import manage_problem from '@/components/others_manage/manage_problem'
import problem_modify from '@/components/others_manage/problem_modify'



Vue.use(Router);
Vue.use(ElmentUI);
Vue.prototype.$http = axios
// 配置请求的跟路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

//在 request 拦截器实现token
axios.interceptors.request.use(config => {
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须 return config
  return config
})

export default new Router({
  routes: [{
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      component: Header,
      redirect: '/welcome',
      children: [{
          path: '/welcome',
          component: Welcome
        },
        {
          path: '/no_auth',
          component: NoAuth
        },
        {
          path: '/configure_library',
          component: configure_library
        },
        {
          path: '/add_project',
          component: add_project
        },
        {
          path: '/apply_project',
          component: apply_project
        },
        {
          path: '/manage_authority',
          component: manage_authority
        },
        {
          path: '/manage_functions',
          component: manage_functions
        },
        {
          path: '/manage_functions_import_excel',
          component: manage_functions_import_excel
        },
        {
          path: '/manage_personinfo',
          component: manage_personinfo
        },
        {
          path: '/manage_proinfo',
          component: manage_proinfo
        },
        {
          path: '/manage_proinfo_modify',
          component: manage_proinfo_modify
        },
        {
          path: '/manage_personinfo_modify',
          component: manage_personinfo_modify
        },
        {
          path: '/approve_manage',
          component: approve_manage
        },
        {
          path: '/project_detail',
          component: project_detail
        },
        {
          path: '/file_project',
          component: file_project
        },
        {
          path: '/file_project_submit_files',
          component: file_project_submit_files
        },
        {
          path: '/audit_file',
          component: audit_file
        },
        {
          path: '/audit_file_detail',
          component: audit_file_detail
        },
        {
          path: '/manage_project',
          component: manage_project
        },
        {
          path: '/checkWorkTime',
          component: checkWorkTime
        },
        {
          path: '/applyWorkTime',
          component: applyWorkTime
        },
        {
          path: '/manage_facility',
          component: manage_facility
        },
        {
          path: '/facility',
          component: facility
        },
        {
          path: '/facility_modify',
          component: facility_modify
        },

        {
          path: '/manage_risk',
          component: manage_risk
        },
        {
          path: '/risk',
          component: risk
        },
        {
          path: '/risk_modify',
          component: risk_modify
        },

        {
          path: '/manage_problem',
          component: manage_problem
        },
        {
          path: '/problem',
          component: problem
        },
        {
          path: '/problem_modify',
          component: problem_modify
        },
      ]
    }
  ]
})
