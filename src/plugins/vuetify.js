import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);
const darkTheme = localStorage.getItem('theme') === 'dark';
console.log('theme',darkTheme)
export default new Vuetify({
    dark:darkTheme,
    options: {customProperties: true},
});
