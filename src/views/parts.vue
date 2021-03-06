<template>
  <v-layout wrap data-app>
    <v-flex xs12>
      <v-btn class="primary mr-4" @click="addPartDialog = true">
        Add Parts Stock
      </v-btn>
      <v-btn class="success mr-4" @click="exportToExcel">
        Export To Excel
      </v-btn>
    </v-flex>
    <v-flex xs12>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
      ></v-text-field>
    </v-flex>
    <v-flex xs12 class="mt-8">
      <v-data-table
        :headers="headers"
        :items="parts"
        :items-per-page="15"
        :search="search"
        @current-items="getFiltered"
        class="elevation-1"
      >
        <template v-slot:item.create_date="{ item }">
          <span>{{ new Date(item.create_date).toLocaleString() }}</span>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn icon @click="updateStock(item)">
            <v-icon small class="mr-2"> mdi-pencil </v-icon>
          </v-btn>
          <v-btn icon @click="getPartHistory(item)">
            <v-icon small class="mr-2"> mdi-history </v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-flex>
    <v-flex>
      <v-dialog
        :value="addPartDialog"
        transition="dialog-bottom-transition"
        max-width="600"
      >
        <v-card>
          <v-toolbar color="primary" dark
            >{{ formData.id ? "Update" : "Add" }} Part</v-toolbar
          >
          <v-card-text>
            <v-form ref="form" v-model="valid">
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-select
                      :rules="rule"
                      v-model="formData.category"
                      :items="categories"
                      label="Category"
                    ></v-select>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      :rules="rule"
                      v-model="formData.name"
                      label="Part Name*"
                      :disabled="!!formData.id"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" v-if="formData.id">
                    <v-text-field
                      :rules="rule"
                      v-model="formData.update_stock"
                      label="Update Stock Quantity*"
                      type="number"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" v-else>
                    <v-text-field
                      :rules="rule"
                      v-model="formData.stock"
                      label="Stock Quantity*"
                      type="number"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      :rules="rule"
                      v-model="formData.gate_pass"
                      label="Gate Pass Number*"
                      type="text"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
            <small>*indicates required field</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="addPartDialog = false">
              Close
            </v-btn>
            <v-btn
              :disabled="!valid"
              color="blue darken-1"
              text
              @click="savePart()"
            >
              {{ formData.id ? "Update" : "Save" }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog
        :value="partHistoryDialog"
        transition="dialog-bottom-transition"
        max-width="600"
      >
        <v-card>
          <v-toolbar color="primary" dark>Part History</v-toolbar>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-btn class="success mr-4" @click="exportHistoryToExcel">
                    Export To Excel
                  </v-btn>
                </v-col>
                <v-col cols="12">
                  <v-data-table
                    :headers="history_headers"
                    :items="history_parts"
                    :items-per-page="5"
                    class="elevation-1"
                  >
                    <template v-slot:item.create_date="{ item }">
                      <span>{{
                        new Date(item.create_date).toLocaleString()
                      }}</span>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue darken-1"
              text
              @click="partHistoryDialog = false"
            >
              Close
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

// 1. category parts -done
// 2. validate form - done
// 3. export part history#
// 4. excel file add category column -done
// 5. formate excel time -done

export default {
  name: "Home",
  data: () => ({
    //part history
    rule: [(v) => !!v || "Field is required"],
    categories: [],
    partHistoryDialog: false,
    history_headers: [
      {
        text: "Id",
        align: "start",
        sortable: false,
        value: "id",
      },
      { text: "Name", value: "name" },
      { text: "Stock", value: "stock" },
      { text: "Gate Pass", value: "gate_pass" },
      { text: "Date Added", value: "create_date" },
    ],
    history_parts: [],
    //
    valid: false,
    addPartDialog: false,
    formData: {},
    headers: [
      {
        text: "Id",
        align: "start",
        value: "id",
      },
      { text: "Name", value: "name" },
      { text: "Stock", value: "stock" },
      { text: "Category", value: "category" },
      { text: "Gate Pass Number", value: "gate_pass" },
      { text: "Date Added", value: "create_date" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    parts: [],
    selectedParts: [],
    entityName: "parts",
    search: null,
  }),
  methods: {
    exportHistoryToExcel(){
      ipcRenderer.send(
        "exportPartsHistoryExcel",
        this.history_parts
      );
    },
    getFiltered(e) {
      this.selectedParts = e;
    },
    exportToExcel() {
      ipcRenderer.send(
        "exportPartsExcel",
        this.selectedParts.length > 0 ? this.selectedParts : this.parts
      );
    },
    getPartHistory(item) {
      this.partHistoryDialog = true;
      this.formData = item;
      ipcRenderer.send("bringPartsHistory", item.id);
    },
    updateStock(item) {
      this.addPartDialog = true;
      this.formData = item;
    },
    savePart() {
      if (this.formData.id) {
        ipcRenderer.send("updatePart", this.formData);
      } else {
        this.formData.create_date = new Date();
        ipcRenderer.send("savePart", this.formData);
      }
      this.addPartDialog = false;
    },
  },
  mounted() {
    ipcRenderer.on("getParts", (event, arg) => {
      this.formData = {};
      this.parts = arg.sort((a,b)=>b.id-a.id);
    });
    ipcRenderer.on("getPartsHistory", (event, arg) => {
      this.history_parts = arg;
    });
    ipcRenderer.on("getCategories", (event, arg) => {
      this.categories = arg.map((x) => x.name);
    });
    ipcRenderer.on("partResult", (event, arg) => {
      if (arg == true) {
        alert("Part Saved");
      } else if (arg == false) {
        alert("Part Already Exist");
      } else {
        alert("something went wrong");
      }
    });
    ipcRenderer.send("bringParts");
    ipcRenderer.send("bringCategories");
  }, 
  components: {},
};
</script>



