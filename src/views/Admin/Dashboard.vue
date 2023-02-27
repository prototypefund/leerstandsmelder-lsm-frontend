<template>
  <v-container v-if="versions">
    <v-row>
      <v-col cols="12" md="8" offset-md="2">
        <h1 class="text-h1">Activty-Stream</h1>
        <v-timeline side="end">
          <v-timeline-item
            v-for="version in versions"
            :key="version.id"
            :dot-color="getColor(version)"
            :icon="getIcon(version)"
            size="small"
          >
            <v-card>
              <v-card-title :class="['text-h6', `bg-${getColor(version)}`]">
                {{ version.event }}
                <div class="text-subtitle-1">
                  {{ version.item_type }}: {{ version.item_id }}
                </div>
              </v-card-title>
              <v-card-text class="bg-white text--primary">
                <div class="text-subtitle-1">{{ version.created_at }}</div>
                <v-expansion-panels
                  v-if="version.object_changes"
                  class="mb-6"
                  style="max-width: 300px"
                  size="xs"
                >
                  <v-expansion-panel
                    v-for="(change, field, cindex) in version.object_changes"
                    :key="'change-' + version.id + '-' + cindex"
                  >
                    <v-expansion-panel-title>
                      <v-icon color="error" icon="mdi-text"> </v-icon>
                      {{ field }}
                    </v-expansion-panel-title>
                    <v-expansion-panel-text style="word-wrap: break-word">
                      <b style="word-wrap: break-word">{{ change[0] }}</b>
                      >
                      <b style="word-wrap: break-word">{{ change[1] }}</b>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  v-if="version.item_type == 'Place'"
                  :to="{
                    name: 'form-detail',
                    params: { slug: version.item_id },
                  }"
                  icon="mdi-marker"
                  variant="outlined"
                ></v-btn>
                <v-btn
                  v-if="version.user"
                  icon="mdi-account"
                  variant="outlined"
                  :label="version.user"
                ></v-btn>
              </v-card-actions>
            </v-card>
          </v-timeline-item>
        </v-timeline>
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
  name: "AdminDashboard",
  components: { PlaceForm },
  computed: {
    ...mapState("loader", ["loading"]),
  },
  created() {
    this.toast = useToast();
    this.fetchVersions();
  },
  data() {
    return {
      search: "",
      options: {
        sortBy: "created_at",
        sortDesc: "desc",
        page: 1,
        itemsPerPage: 10,
      },
      versions: [],
      total: {},
    };
  },
  watch: {},

  methods: {
    getColor(item) {
      let color = "primary";
      switch (item.item_type) {
        case "Place":
          color = "red-lighten-2";
          break;
        case "Annotation":
          color = "purple-lighten-2";
          break;
      }
      return color;
    },
    getIcon(item) {
      let icon = "mdi-close";
      switch (item.item_type) {
        case "Place":
          icon = "mdi-home";
          break;
        case "Annotation":
          icon = "mdi-text";
          break;
      }
      return icon;
    },
    async fetchVersions() {
      const { sortBy = [], sortDesc = [], page, itemsPerPage } = this.options;
      // let newSortBy = sortBy.map((item) => {
      //   if (item && item.value) {
      //     return item.value.substring(11);
      //   } else {
      //     return "";
      //   }
      // });

      console.log("sm", page, itemsPerPage);

      let items = [];
      AdminRepository.getVersions({
        query: this.search,
        sortBy: sortBy,
        sortDesc: sortDesc,
        page: page,
        itemsPerPage: itemsPerPage,
      }).then((result) => {
        console.log("fetchi", result);
        this.versions = result.data.map((x) => x.attributes);
        this.total = result.meta.total;
      });
    },
  },
};
</script>
<style></style>
