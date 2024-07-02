import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  },
  {
    path: '/common',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/inventory/products/create', component: () => import('pages/products/FormPage.vue'), meta: { mode: 'create' }},
      { path: '/inventory/products/:id/edit', component: () => import('pages/products/FormPage.vue'), meta: { mode: 'edit' } },
      { path: '/inventory/products/:id', component: () => import('src/pages/products/ViewPage.vue') },
      { path: '/inventory/products', component: () => import('src/pages/products/ListPage.vue') },

      { path: '/setting/customers/create', component: () => import('src/pages/customers/FormPage.vue'), meta: { mode: 'create' }},
      { path: '/setting/customers/:id/edit', component: () => import('src/pages/customers/FormPage.vue'), meta: { mode: 'edit' } },
      { path: '/setting/customers/:id', component: () => import('src/pages/customers/ViewPage.vue') },
      { path: '/setting/customers', component: () => import('src/pages/customers/ListPage.vue') },

      { path: '/income/sales-orders/create', component: () => import('pages/sales-orders/FormPage.vue'), meta: { mode: 'create' }},
      { path: '/income/sales-orders/:id/edit', component: () => import('pages/sales-orders/FormPage.vue'), meta: { mode: 'edit' } },
      { path: '/income/sales-orders/:id', component: () => import('pages/sales-orders/ViewPage.vue') },
      { path: '/income/sales-orders', component: () => import('pages/sales-orders/ListPage.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/undercontraction',
    component: () => import('pages/UnderContraction.vue'),
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
