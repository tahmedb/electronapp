<template>
  <v-layout wrap data-app>
    <v-flex xs12>
      <v-btn class="primary mr-4" @click="addCategoryDialog = true">
        Add Category
      </v-btn>
    </v-flex>
    <v-flex xs12 class="mt-8">
      <v-data-table
        :headers="headers"
        :items="categories"
        :items-per-page="15"
        class="elevation-1"
      ></v-data-table>
    </v-flex>
    <v-flex>
      <v-dialog
        :value="addCategoryDialog"
        transition="dialog-bottom-transition"
        max-width="600"
      >
        <v-card>
          <v-toolbar color="primary" dark>Add Category</v-toolbar>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="formData.name"
                    label="Category Name*"
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
              @click="addCategoryDialog = false"
            >
              Close
            </v-btn>
            <v-btn
              :disabled="!formData.name"
              color="blue darken-1"
              text
              @click="saveCategory()"
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
    addCategoryDialog: false,
    formData: {},
    headers: [
      {
        text: "Id",
        align: "start",
        sortable: false,
        value: "id",
      },
      { text: "Name", value: "name" },
    ],
    categories: [],
    entityName: "categories",
  }),
  methods: {
    saveCategory() {
      ipcRenderer.send("saveCategory", this.formData);
      this.addCategoryDialog = false;
    },
  },
  mounted() {
    ipcRenderer.on("getCategories", (event, arg) => {
      this.formData = {};
      this.categories = arg.sort((a,b)=>b.id-a.id);
    });
    ipcRenderer.send("bringCategories");
  },
  components: {},
};
</script>
