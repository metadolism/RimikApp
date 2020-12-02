import Vue from 'vue';
import VueRouter from 'vue-router';
// import fp from '@/mixins/fp';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Forgot from '../views/Forgot.vue';
import Dashboard from '../views/dashboard/Dashboard.vue';
import Admins from '../views/dashboard/Admins.vue';
import Students from '../views/dashboard/Students.vue';
import Reports from '../views/dashboard/Reports.vue';
import Discounts from '../views/dashboard/Discounts.vue';
import VideoUpload from '../views/dashboard/VideoUpload.vue';
import Feedbacks from '../views/dashboard/Feedbacks.vue';
import SendNotify from '../views/dashboard/SendNotify.vue';
import Faq from '../views/dashboard/Faq.vue';
import Profile from '../views/dashboard/Profile.vue';
import SetNewPassword from '../views/SetNewPassword.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/Login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/Forgot',
    name: 'Forgot',
    component: Forgot,
  },
  {
    path: '/SetNewPassword',
    name: 'SetNewPassword',
    component: SetNewPassword,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
  },
  {
    path: '/admins',
    name: 'Admins',
    component: Admins,
  },
  {
    path: '/teachers',
    name: 'Teachers',
    component: () => import(/* webpackChunkName: "about" */ '../views/dashboard/Teachers.vue'),
  },
  {
    path: '/discounts',
    name: 'Discounts',
    component: Discounts,
  },
  {
    path: '/grades',
    name: 'Grades',
    component: () => import(/* webpackChunkName: "about" */ '../views/dashboard/Grades.vue'),
  },
  {
    path: '/lessons',
    name: 'Lessons',
    component: () => import(/* webpackChunkName: "about" */ '../views/dashboard/Lessons.vue'),
  },
  {
    path: '/reports',
    name: 'Reports',
    component: Reports,
  },
  {
    path: '/students',
    name: 'Students',
    component: Students,
  },
  {
    path: '/courses',
    name: 'Courses',
    component: () => import(/* webpackChunkName: "about" */ '../views/dashboard/Courses.vue'),
  },
  {
    path: '/videoUpload',
    name: 'VideoUpload',
    component: VideoUpload,
  },
  {
    path: '/sendNotify',
    name: 'SendNotify',
    component: SendNotify,
  },
  {
    path: '/feedbacks',
    name: 'Feedbacks',
    component: Feedbacks,
  },
  {
    path: '/access',
    name: 'Access',
    component: () => import(/* webpackChunkName: "about" */ '../views/dashboard/Access.vue'),
  },
  {
    path: '/faq',
    name: 'Faq',
    component: Faq,
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/', '/home'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('user');
  // fp.methods.fpGenerator();
  // trying to access a restricted page + not logged in
  // redirect to login page
  if (to.path.includes('login') && loggedIn) {
    next('/dashboard');
  } else if (authRequired && !loggedIn) {
    next('/login');
  } else {
    next();
  }
});

export default router;
