import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      meta: {
	      title: '首页'
	  },
    component: Home
      //component: () => import(/* webpackChunkName: "Home" */'./views/Home.vue')
    }
  ]
})
