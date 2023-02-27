<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            {{ $t("regions.region_plural") }}
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              :label="$t('locations.search')"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table
            v-model:sort-by="sortBy"
            multi-sort
            :headers="headers"
            :items="regions"
            :search="search"
          >
            <template #item.created_at="{ item }">
              {{ $filters.formatDate(item.raw.created_at, "DD.MM.YYYY") }}
            </template>
            <template #item.updated_at="{ item }">
              {{ $filters.formatDate(item.raw.updated_at, "DD.MM.YYYY") }}
            </template>
            <template #item.locations="{ item }">
              <v-chip color="primary">{{ item.raw.locations }}</v-chip>
            </template>

            <template #item.actions="{ item }">
              <v-icon size="small" class="me-2" @click="editItem(item.raw)">
                mdi-pencil
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
                    <v-btn variant="outlined" v-bind="props">
                      {{ $t("regions.create_regions") }}
                    </v-btn>
                  </template>
                  <RegionForm v-model="region" @form-close="close()" />
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
const MapsRepository = RepositoryFactory.get("maps");

import RegionForm from "@/components/Region/RegionForm.vue";
import { useToast } from "vue-toastification";

export default {
  name: "AdminRegions",
  components: { RegionForm },
  computed: {
    ...mapState("regions", ["regions", "active"]),
  },
  created() {
    this.toast = useToast();
    this.region = this.defaultItem;
  },
  data() {
    return {
      search: "",
      headers: [
        {
          title: this.$t("regions.region"),
          align: "start",
          key: "title",
        },
        { title: this.$t("regions.latitude"), key: "mapcenter_lat" },
        { title: this.$t("regions.longitude"), key: "mapcenter_lon" },
        { title: this.$t("regions.zoom"), key: "zoom" },
        { title: this.$t("regions.created"), key: "created_at" },
        { title: this.$t("regions.updated"), key: "updated_at" },
        { title: this.$t("regions.count"), key: "locations" },
        { title: "", key: "actions", sortable: false },
      ],
      region: {},
      dialog: false,

      editedIndex: -1,

      defaultItem: {
        title: "",
        zoom: 5,
        mapcenter_lat: 52,
        mapcenter_lon: 9,
      },
      sortBy: [{ key: "title", order: "asc" }],
    };
  },
  methods: {
    editItem(item) {
      MapsRepository.getMap(item.id)
        .then((resp) => {
          console.log("edit item", resp);
          this.region = resp.map;
          this.dialog = true;
          this.toast.success(this.$t("regions.load_success"));
        })
        .catch((err) => {
          this.toast.error(this.$t("errors.region.no_data"));
        });
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.region = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
  },
};
</script>
<style lang="scss">
body {
  background-color: rgb(var(--v-theme-primary)) !important;
}
</style>
