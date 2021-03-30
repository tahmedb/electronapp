import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);
const darkTheme = localStorage.getItem('theme') === 'dark';
export default new Vuetify({
    dark:darkTheme
});
