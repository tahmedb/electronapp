<template>
<v-app>
  <!-- Must have the app property -->
  <v-app-bar class="primary" app>
     <img height="50" width="50" src="./assets/logo2.jpeg">
    <div id="nav">
      <router-link to="/">Issuance Form</router-link>|
      <router-link to="/categories">Category</router-link> |
      <router-link to="/parts">Parts</router-link> 
    </div>
  </v-app-bar>
  <v-main class="mt-8">
   <router-view/>
  </v-main>
</v-app>

</template>
<script>
export default {
  mounted(){
    document.title = 'Inventory Management System';
  }
}
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
