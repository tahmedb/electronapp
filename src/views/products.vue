<template>
  <v-layout wrap data-app>
    <v-flex xs12>
      <v-btn class="primary mr-4" @click="addProductDialog = true">
        Issuance Form
      </v-btn>
      <v-btn class="success mr-4" @click="exportToExcel">
        Export To Excel
      </v-btn>
    </v-flex>
    <v-flex xs12 class="mt-8">
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
                  label="Date From"
                  prepend-icon="mdi-calendar"
                  readonly
                  clearable
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="from_date" no-title scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="menu = false">
                  Cancel
                </v-btn>
                <v-btn text color="primary" @click="$refs.menu.save(from_date)">
                  OK
                </v-btn>
              </v-date-picker>
            </v-menu></v-flex
          >
          <v-flex xs6>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
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
          @current-items="getFiltered"
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
          <v-toolbar color="primary" dark>Issue</v-toolbar>
          <v-form ref="form" v-model="valid" >
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-select
                     :rules="rule"
                      v-model="formData.category"
                      :items="categories"
                      label="Category"
                      @change="getCategoryParts"
                    ></v-select>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                    :rules="rule"
                      v-model="formData.name"
                      label="Reciever Name*"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                    :rules="rule"
                      v-model="formData.line"
                      label="Line Number*"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                    :rules="rule"
                      v-model="formData.machine"
                      label="Machine Name*"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-autocomplete
                    :rules="rule"
                      v-model="formData.part_name"
                      :items="parts"
                      label="Part Name"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                    :rules="rule"
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
          </v-form>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="addProductDialog = false">
              Close
            </v-btn>
            <v-btn
              :disabled="!valid||!formData.name"
              color="blue darken-1"
              text
              @click="saveProduct()"
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
    rule:[v => !!v || 'Field is required'],
    menu: false,
    from_date: null,
    search: "",
    valid: false,
    addProductDialog: false,
    selectedProducts: [],
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
    parts: [],
    entityName: "products",
  }),
  methods: {
    getCategoryParts(category){      
      ipcRenderer.send(
        "bringCategoryParts",
        {category}
      );
    },
    join(t, a, s) {
      function format(m) {
        let f = new Intl.DateTimeFormat("en", m);
        if (m.month) return f.format(t) < 10 ? "0" + f.format(t) : f.format(t);
        return f.format(t);
      }
      return a.map(format).join(s);
    },
    getFiltered(e) {
      this.selectedProducts = e;
    },
    exportToExcel() {
      ipcRenderer.send(
        "exportExcel",
        this.selectedProducts.length > 0 ? this.selectedProducts : this.products
      );
    },
    saveProduct() {
      this.formData.create_date = new Date();
      ipcRenderer.send("saveProducts", this.formData);
      this.addProductDialog = false;
    },
  },
  computed: {
    finalProducts() {
      if (this.from_date)
        return this.products.filter((x) => x.create_date >= this.from_date);
      return this.products;
    },
  },
  mounted() {
    this.from_date = this.join(
      new Date(),
      [{ year: "numeric" }, { month: "numeric" }, { day: "numeric" }],
      "-"
    );
    ipcRenderer.on("getCategories", (event, arg) => {
      this.categories = arg.map((x) => x.name);
    });
    ipcRenderer.on("getProducts", (event, arg) => {
      this.formData = {};
      this.products = arg || [];
    });
    ipcRenderer.on("getCategoryParts", (event, arg) => {
      this.parts = (arg||[]).map((x) => x.name);
    });
    ipcRenderer.send("bringParts");
    ipcRenderer.send("bringCategories");
    ipcRenderer.send("bringProducts");
  },
  components: {},
};
</script>
