// router/index.ts
import type { NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw } from 'vue-router';
import { createRouter, createWebHistory } from 'vue-router';
import AdminPanel from '@/pages/AdminPanel.vue';
import AdminUsers from '@/pages/AdminUsers.vue';
import AdminEvents from '@/pages/AdminEvents.vue';
import AdminComments from '@/pages/AdminComments.vue';
import AdminLogs from '@/pages/AdminLogs.vue';

// Enum с именами маршрутов
export enum RouteNames {
  HOME = 'Home',
  EVENT_DETAILS = 'EventDetails',
  AUTH = 'Auth',
  PROFILE = 'Profile',
  PROFILE_SETTINGS = 'ProfileSettings',
  PROFILE_GROUPS = 'ProfileGroups',
  MY_EVENTS = 'MyEvents',
  EVENT_CREATE = 'EventCreate',
  EVENT_EDIT = 'EventEdit',
  NOT_FOUND = 'NotFound',
  ADMIN = 'Admin',
  ADMIN_USERS = 'AdminUsers',
  ADMIN_EVENTS = 'AdminEvents',
  ADMIN_COMMENTS = 'AdminComments',
  ADMIN_LOGS = 'AdminLogs'
}

// Функция проверки авторизации
const isAuthenticated = (): boolean => {
  // Замените на реальную логику проверки авторизации
  return localStorage.getItem('authToken') !== null;
};

// Навигационный guard с типизацией
const requireAuth = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): void => {
  if (isAuthenticated()) {
    next();
  } else {
    next({ name: RouteNames.AUTH });
  }
};

// Типизация маршрутов (опционально, для большей строгости)
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: { name: RouteNames.HOME }
  },
  {
    path: '/home',
    name: RouteNames.HOME,
    component: () => import('@/pages/SearchResultsPage.vue')
  },
  {
    path: '/event/:id',
    name: RouteNames.EVENT_DETAILS,
    component: () => import('@/pages/EventPage.vue'),
    props: true
  },
  {
    path: '/auth',
    name: RouteNames.AUTH,
    component: () => import('@/pages/SignInPage.vue')
  },
  {
    path: '/profile',
    name: RouteNames.PROFILE,
    component: () => import('@/pages/profilePage/ProfilePage.vue')
  },
  // {
  //   path: '/profile',
  //   name: RouteNames.PROFILE,
  //   component: () => import('@/pages/ProfilePage.vue'),
  //   beforeEnter: requireAuth,
  //   redirect: { name: RouteNames.PROFILE_SETTINGS },
  //   children: [
  //     {
  //       path: 'settings',
  //       name: RouteNames.PROFILE_SETTINGS,
  //       component: () => import('@/pages/profile/ProfileSettingsPage.vue'),
  //     },
  //     {
  //       path: 'groups',
  //       name: RouteNames.PROFILE_GROUPS,
  //       component: () => import('@/pages/profile/ProfileGroupsPage.vue'),
  //     },
  //     {
  //       path: 'my-events',
  //       name: RouteNames.MY_EVENTS,
  //       component: () => import('@/pages/profile/MyEventsPage.vue'),
  //     },
  //   ],
  // },
  {
    path: '/event/create',
    name: RouteNames.EVENT_CREATE,
    component: () => import('@/pages/EventCreationPage.vue'),
    beforeEnter: requireAuth
  },
  {
    path: '/event/edit/:id',
    name: RouteNames.EVENT_EDIT,
    component: () => import('@/pages/EventCreationPage.vue'),
    props: true,
    beforeEnter: requireAuth
  },
  {
    path: '/admin',
    name: RouteNames.ADMIN,
    component: AdminPanel,
    redirect: { name: RouteNames.ADMIN_USERS },
    children: [
      {
        path: 'users',
        name: RouteNames.ADMIN_USERS,
        component: AdminUsers
      },
      {
        path: 'events',
        name: RouteNames.ADMIN_EVENTS,
        component: AdminEvents
      },
      {
        path: 'comments',
        name: RouteNames.ADMIN_COMMENTS,
        component: AdminComments
      },
      {
        path: 'logs',
        name: RouteNames.ADMIN_LOGS,
        component: AdminLogs
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: RouteNames.NOT_FOUND,
    component: () => import('@/pages/NotFoundPage.vue')
  }
];

// Создание роутера
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
