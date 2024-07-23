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
      { path: '/receive-mounts/create', component: () => import('pages/receive-mounts/FormPage.vue'), meta: { mode: 'create' }},
      { path: '/receive-mounts/:id', component: () => import('pages/receive-mounts/ViewPage.vue') },
      { path: '/receive-mounts', component: () => import('pages/receive-mounts/ListPage.vue') },
      { path: '/receive-items/create', component: () => import('pages/receive-items/FormPage.vue'), meta: { mode: 'create' }},
      { path: '/receive-items/:id', component: () => import('pages/receive-items/ViewPage.vue') },
      { path: '/receive-items', component: () => import('pages/receive-items/ListPage.vue') },
      { path: '/receive-orders/:id', component: () => import('pages/receive-orders/ViewPage.vue'), meta: { mode: 'edit' } },
      { path: '/receive-orders', component: () => import('pages/receive-orders/ListPage.vue') },

      { path: '/inventory/products/create', component: () => import('pages/products/FormPage.vue'), meta: { mode: 'create' }},
      { path: '/inventory/products/:id/edit', component: () => import('pages/products/FormPage.vue'), meta: { mode: 'edit' } },
      { path: '/inventory/products/:id', component: () => import('pages/products/ViewPage.vue') },
      { path: '/inventory/products', component: () => import('pages/products/ListPage.vue') },

      { path: '/setting/customers/create', component: () => import('pages/customers/FormPage.vue'), meta: { mode: 'create' }},
      { path: '/setting/customers/:id/edit', component: () => import('pages/customers/FormPage.vue'), meta: { mode: 'edit' } },
      { path: '/setting/customers/:id', component: () => import('pages/customers/ViewPage.vue') },
      { path: '/setting/customers', component: () => import('pages/customers/ListPage.vue') },

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
