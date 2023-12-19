import Vue from 'vue';
import LoadingComponent from './loading.vue';

const Loading = {
  install(Vue) {
    const LoadingConstructor = Vue.extend(LoadingComponent);
    const instance = new LoadingConstructor();

    instance.$mount(document.createElement('div'));
    document.body.appendChild(instance.$el);

    Vue.prototype.$loading = {
      show() {
        instance.show();
      },
      hide() {
        instance.hide();
      },
    };
  },
};

export default Loading;
