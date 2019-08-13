import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

//引入hotcs.js转rem;
import '../node_modules/base_mixins/hotcss.min'

//解决click 300毫秒延迟;
import FastClick from "fastclick"
FastClick.attach(document.body);
//当使用FastClick 时，input框在ios上点击输入调取手机自带输入键盘不灵敏，有时候甚至点不出来。而安卓上完全没问题。这个原因是因为FastClick的点击穿透。解决方法：
FastClick.prototype.onTouchEnd = function(event) {
  if (
    event.target.hasAttribute("type") &&
    event.target.getAttribute("type") == "text"
  ) {
    event.preventDefault();
    return false;
  }
};


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
