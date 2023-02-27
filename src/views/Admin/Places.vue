<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card v-if="regionData && locations">
          <v-card-title>
            {{ $t("locations.location_plural") }}
            <v-spacer></v-spacer>
            <v-text-field
              v-model.lazy="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>

          <v-data-table
            :headers="headers"
            :items="adminPlaces"
            :loading="loading"
            :search="search"
            class="elevation-1"
          >
            <template #item.created_at="{ item }">
              {{ $filters.formatDate(item.raw.created_at, "DD.MM.YYYY H:m") }}
            </template>
            <template #item.updated_at="{ item }">
              {{ $filters.formatDate(item.raw.updated_at, "DD.MM.YYYY H:m") }}
            </template>
            <template #item.actions="{ item }">
              <v-icon size="small" class="me-2" @click="editItem(item.raw)">
                mdi-pencil
              </v-icon>
              <v-icon size="small" @click="deleteItem(item.raw)">
                mdi-delete
              </v-icon>
            </template>

            <template #top>
              <v-toolbar color="transparent">
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" class="edit-dialog">
                  <v-row no-gutters
                    ><v-col class="d-flex justify-end">
                      <v-btn
                        variant="outlined"
                        icon="mdi-close"
                        size="small"
                        class="rounded-xl ml-3"
                        @click="close"
                      ></v-btn> </v-col
                  ></v-row>

                  <template #activator="{ props }">
                    <v-btn variant="outlined" v-bind="props"> New Item </v-btn>
                  </template>
                  <PlaceForm @form-update-and-close="closeUpdate()" />
                </v-dialog>
                <v-dialog v-model="dialogDelete" max-width="500px">
                  <v-card>
                    <v-card-title class="text-h5"
                      >Are you sure you want to delete this item?</v-card-title
                    >
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="blue-darken-1"
                        variant="text"
                        @click="closeDelete"
                        >Cancel</v-btn
                      >
                      <v-btn
                        color="blue-darken-1"
                        variant="text"
                        @click="deleteItemConfirm"
                        >OK</v-btn
                      >
                      <v-spacer></v-spacer>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapState, mapGetters } from "vuex";

import { RepositoryFactory } from "@/utils/repositories/repositoryFactory";
const AdminRepository = RepositoryFactory.get("admin");

import PlaceForm from "@/components/Place/PlaceForm.vue";
import { useToast } from "vue-toastification";

export default {
  name: "AdminPlaces",
  components: { PlaceForm },
  computed: {
    ...mapState("loader", ["loading"]),
    ...mapState("region", ["regionData", "map"]),
    ...mapState("regions", ["regions", "active"]),
    ...mapState("locations", ["locations"]),
    ...mapGetters("locations", ["filteredLocations"]),
    ...mapState("place", ["place"]),
  },
  created() {
    this.toast = useToast();
    this.adminPlaces = this.filteredLocations.map((i) => i.properties);
  },
  data() {
    return {
      search: "",
      awaitingSearch: false,
      totalUsers: 0,
      adminPlaces: [],
      options: { itemsPerPage: 10 },
      headers: [
        {
          title: "Title",
          align: "start",
          sortable: false,
          key: "title",
        },
        { title: "Gebäude", key: "buildingType" },
        { title: "City", key: "city" },
        { title: "Created", key: "created_at" },

        { title: "Updated", key: "updated_at" },
        { title: "", key: "actions", sortable: false },
      ],
      dialog: false,
      dialogDelete: false,

      editedIndex: -1,
      editedItem: {},
      defaultItem: {},
    };
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    filteredLocations(val) {
      this.adminPlaces = this.filteredLocations.map((i) => i.properties);
    },
  },

  methods: {
    transformedFilteredLocations() {
      console.log("lalaItems");
      let items = this.filteredLocations.map((i) => i.properties);
      console.log("lalaItems", items);
      return items;
    },
    mapRegion(item) {
      if (item.substring(0, 14) == "moderator_map_") {
        return (
          "Moderator: " +
          this.regions.find((x) => x.id === item.substring(14)).title
        );
      }
      return item;
    },
    editItem(item) {
      console.log("edit item", item);
      this.$store
        .dispatch("place/fetchPlaceAdmin", item.id)
        .then((data) => {
          //this.$store.dispatch("loader/hide");

          //this.editedIndex = this.filteredLocations.indexOf(item);
          //this.editedItem = Object.assign({}, item);
          this.dialog = true;

          this.$router
            .push({
              name: "admin_locations",
              params: { slug: data.id },
              replace: true,
            })
            .then((result) => {
              console.log("router result", result);
              //return false;
            })
            .catch((err) => {
              console.log("router catch", err);
            });

          this.toast.success("Place has been loaded");
        })
        .catch((error) => {
          // hideDetail();
          //this.$store.dispatch("loader/hide");
          this.toast.error("Place error: " + error);
        });
    },

    deleteItem(item) {
      this.editedIndex = this.filteredLocations.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.filteredLocations.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeUpdate() {
      console.log("closeUpdate");
      this.$store.dispatch("locations/fetchLocations").then(() => {
        this.close();
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(
          this.filteredLocations[this.editedIndex],
          this.editedItem
        );
      } else {
        this.filteredLocations.push(this.editedItem);
      }
      this.close();
    },
  },
};
</script>
<style>
.edit-dialog .v-overlay__scrim {
  background-color: white;
  opacity: 1;
}
</style>
