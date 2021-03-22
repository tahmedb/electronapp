<template>
  <v-layout row data-app>
    <v-flex xs12>
      <v-btn class="primary mr-4" @click="addProductDialog = true">
        Add Product
      </v-btn>
    </v-flex>
    <v-flex xs12>
       <v-card>
    <v-card-title>
    
      <v-flex xs6>
          <v-menu
        ref="menu"
        v-model="menu"
        :close-on-content-click="false"
        :return-value.sync="from_date"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="from_date"
            label="Picker in menu"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="from_date"
          no-title
          scrollable
        >
          <v-spacer></v-spacer>
          <v-btn
            text
            color="primary"
            @click="menu = false"
          >
            Cancel
          </v-btn>
          <v-btn
            text
            color="primary"
            @click="$refs.menu.save(date)"
          >
            OK
          </v-btn>
        </v-date-picker>
      </v-menu></v-flex>
    <v-flex xs6>
       <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-flex>
     
    </v-card-title>
    <v-data-table
        :headers="headers"
        :items="finalProducts"
        :items-per-page="5"
        :search="search"
        group-by="category"
        class="elevation-1"
      >
      <template v-slot:item.create_date="{ item }">
    <span>{{ new Date(item.create_date).toLocaleString() }}</span>
  </template>
      </v-data-table>
  </v-card>
     
    </v-flex>
    <v-flex>
      <v-dialog
        :value="addProductDialog"
        transition="dialog-bottom-transition"
        max-width="600"
      >
        <v-card>
          <v-toolbar color="primary" dark>Add Product</v-toolbar>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-select v-model="formData.category" :items="categories" label="Category"></v-select>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="formData.name"
                    label="Product Name*"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="formData.line"
                    label="Line*"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="formData.machine"
                    label="Machine Name*"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="formData.part_name"
                    label="Part Name*"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="formData.quantity"
                    label="Quantity *"
                    type="number"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
            <small>*indicates required field</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="addProductDialog = false">
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
    menu:false,
    from_date:null,
    search:'',
    valid: false,
    addProductDialog: false,
    formData: { name: "", line: "", machine: "", part_name: "", quantity: 0 },
    headers: [
      {
        text: "Id",
        align: "start",
        sortable: false,
        value: "id",
      },
      { text: "Name", value: "name" },
      { text: "Line", value: "line" },
      { text: "Machine No.", value: "machine" },
      { text: "Part Name", value: "part_name" },
      { text: "Qty", value: "quantity" },
      { text: "Category", value: "category" },
      { text: "Create Date", value: "create_date" },
    ],
    products: [],
    categories: [],
    entityName: "products",
  }),
  methods: {
    getAllCategories() {
      db.getAll("categories", (succ, data) => {
        this.categories = data.map((x) => x.name);
        console.log("data", data);
        // succ - boolean, tells if the call is successful
        // data - array of objects that represents the rows.
      });
    },
    getAllProducts() {
      db.getAll(this.entityName, (succ, data) => {
        this.products = data || [];
        console.log("data", data);
        // succ - boolean, tells if the call is successful
        // data - array of objects that represents the rows.
      });
    },
    saveCategory() {
      this.formData.create_date = new Date();
      db.insertTableContent(this.entityName, this.formData, (succ, msg) => {
        // succ - boolean, tells if the call is successful
        if (succ) {
          this.addProductDialog = false;
          this.getAllProducts();
          this.formData = {};
        } else alert(msg);
        console.log("Success: " + succ);
        console.log("Message: " + msg);
      });
    },
  },
  computed:{
    finalProducts(){
      if(this.from_date)
        return this.products.filter(x=>x.create_date >= this.from_date);
      return this.products;
    }
  },
  mounted() {
    this.getAllCategories();
    this.getAllProducts();
  },
  components: {},
};
</script>
