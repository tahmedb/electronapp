<template>
  <v-layout row data-app>
    <v-flex xs12>
      <v-btn class="primary mr-4" @click="addCategoryDialog = true">
        Add Category
      </v-btn>
    </v-flex>
    <v-flex xs12>
      <v-data-table
        :headers="headers"
        :items="categories"
        :items-per-page="5"
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
const db = window.require("electron-db");

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
    categories: [
      {
        name: "Frozen Yogurt",
        id: 159,
      },
    ],
    entityName: "categories",
  }),
  methods: {
    getAllCategories() {
      db.getAll(this.entityName, (succ, data) => {
        this.categories = data || [];
        console.log("data", data);
        // succ - boolean, tells if the call is successful
        // data - array of objects that represents the rows.
      });
    },
    saveCategory() {
      db.insertTableContent(this.entityName, this.formData, (succ, msg) => {
        // succ - boolean, tells if the call is successful
        if (succ) {
          this.addCategoryDialog = false;
          this.getAllCategories();
          this.formData = {}
        } else alert(msg);
        console.log("Success: " + succ);
        console.log("Message: " + msg);
      });
    },
  },
  mounted() {
    this.getAllCategories();
  },
  components: {},
};
</script>
