<template>
  <v-layout wrap data-app>
    <v-flex xs12>
      <v-btn class="primary mr-4" @click="addPartDialog = true">
        Add Parts Stock
      </v-btn>
    </v-flex>
    <v-flex xs12 class="mt-8">
      <v-data-table
        :headers="headers"
        :items="parts"
        :items-per-page="5"
        class="elevation-1"
      ></v-data-table>
    </v-flex>
    <v-flex>
      <v-dialog
        :value="addPartDialog"
        transition="dialog-bottom-transition"
        max-width="600"
      >
        <v-card>
          <v-toolbar color="primary" dark>Add Part</v-toolbar>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="formData.name"
                    label="Part Name*"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="formData.stock"
                    label="Stock Quantity*"
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
            <v-btn
              color="blue darken-1"
              text
              @click="addPartDialog = false"
            >
              Close
            </v-btn>
            <v-btn
              :disabled="!formData.name"
              color="blue darken-1"
              text
              @click="savePart()"
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
    addPartDialog: false,
    formData: {},
    headers: [
      {
        text: "Id",
        align: "start",
        sortable: false,
        value: "id",
      },
      { text: "Name", value: "name" },
      { text: "Stock", value: "stock" },
    ],
    parts: [],
    entityName: "parts",
  }),
  methods: {
    savePart() {
      ipcRenderer.send("savePart", this.formData);
      this.addPartDialog = false;
    },
  },
  mounted() {
    ipcRenderer.on("getParts", (event, arg) => {
      this.formData = {};
      this.parts = arg;
    });
    ipcRenderer.send("bringParts");
  },
  components: {},
};
</script>
