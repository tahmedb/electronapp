<template>
<v-app>
  <!-- Must have the app property -->
  <v-app-bar v-if="authenticated" class="primary" app>
     <img height="50" width="50" src="./assets/logo2.jpeg">
    <div id="nav">
      <router-link to="/">Issuance Form</router-link>|
      <router-link to="/categories">Category</router-link> |
      <router-link to="/parts">Parts</router-link> |
      <router-link @click="logout" to="/login">Logout</router-link> 
    </div>
  </v-app-bar>
  <v-main class="mt-8">
   <router-view/>
  </v-main>
</v-app>

</template>
<script>
export default {
  data:()=>({
    authenticated:false
  }),
   methods:{
     logout(){
       localStorage.removeItem('user')
     },
   },
  mounted(){
    document.title = 'Inventory Management System';
  },
  watch:{
    '$route'(){
      setTimeout(() => {
        //console.log('sdf',this.authenticated)
        this.authenticated =localStorage.getItem('user') != null;
      }, 200);        
    }
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
