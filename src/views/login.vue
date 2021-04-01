<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center wrap>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Login form</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-alert class="error" v-if="loginMessage">
              {{ loginMessage }}
            </v-alert>
            <v-form v-model="valid">
              <v-text-field
                v-model="formData.name"
                prepend-icon="mdi-account-tie"
                name="login"
                :rules="[(v) => !!v || 'User Name is required']"
                label="Login"
                type="text"
              ></v-text-field>
              <v-text-field
                v-model="formData.password"
                id="password"
                prepend-icon="mdi-lock"
                name="password"
                :rules="[(v) => !!v || 'Password is required']"
                label="Password"
                type="password"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :disabled="!valid" @click="login()" color="primary"
              >Login
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex xs12>
        <img height="200" width="200" src="../assets/logo2.jpeg" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
const { ipcRenderer } = window.require("electron");
export default {
  name: "Login",
  data: () => ({ valid: false, formData: {}, loginMessage: "" }),
  methods: {
    login() {
      ipcRenderer.send("authenticate", this.formData);
    },
  },
  mounted() {
    localStorage.removeItem("user");
    ipcRenderer.on("authentication_event", (event, arg) => {
      if (arg.length > 0) {
         localStorage.setItem("user",arg[0].name);
        this.$router.push({
          name: "products",
        });
      } else {
        this.loginMessage = "Invalid User Name or Password";
      }
    });
  },
};
</script>

<style></style>
