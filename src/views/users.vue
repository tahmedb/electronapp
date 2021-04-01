<template>
  <v-layout wrap data-app>
    <v-flex xs12>
      <v-btn class="primary mr-4" @click="addUserDialog = true">
        Add User
      </v-btn>
    </v-flex>
    <v-flex xs12 class="mt-8">
      <v-data-table
        :headers="headers"
        :items="users"
        :items-per-page="5"
        class="elevation-1"
      ></v-data-table>
    </v-flex>
    <v-flex>
      <v-dialog
        :value="addUserDialog"
        transition="dialog-bottom-transition"
        max-width="600"
      >
        <v-card>
          <v-toolbar color="primary" dark>Add User</v-toolbar>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="formData.name"
                    label="User Name*"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="formData.password"
                    label="User Password*"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
            <small>*indicates required field</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue darken-1"
              text
              @click="addUserDialog = false"
            >
              Close
            </v-btn>
            <v-btn
              :disabled="!formData.name"
              color="blue darken-1"
              text
              @click="saveUser()"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-flex>
  </v-layout>
</template>

<script>
//const db = window.require("electron-db");
const { ipcRenderer } = window.require("electron");
export default {
  name: "Home",
  data: () => ({
    valid: false,
    addUserDialog: false,
    formData: {},
    headers: [
      {
        text: "Id",
        align: "start",
        sortable: false,
        value: "id",
      },
      { text: "Name", value: "name" },
      { text: "Password", value: "password" },
    ],
    users: [],
    entityName: "users",
  }),
  methods: {
    saveUser() {
      ipcRenderer.send("saveUser", this.formData);
      this.addUserDialog = false;
    },
  },
  mounted() {
    ipcRenderer.on("getUsers", (event, arg) => {
      this.formData = {};
      this.users = arg;
    });
    ipcRenderer.send("bringUsers");
  },
  components: {},
};
</script>
