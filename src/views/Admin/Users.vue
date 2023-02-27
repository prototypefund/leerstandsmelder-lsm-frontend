<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            Users
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
            :items="users"
            :items-length="totalUsers"
            :items-per-page="10"
            :loading="loading"
            class="elevation-1"
            @update:options="options = $event"
          >
            <template #item.nickname="{ item }">
              {{ item.raw.nickname }}
            </template>
            <template #item.role_keys="{ item }">
              <v-chip
                v-for="(element, index) in item.raw.role_keys"
                :key="'marker-' + index"
                color="primary"
              >
                {{ mapRegion(element) }}
              </v-chip>
            </template>
            <template #item.created_at="{ item }">
              {{ $filters.formatDate(item.raw.created_at, "DD.MM.YYYY H:m") }}
            </template>
            <template #item.updated_at="{ item }">
              {{ $filters.formatDate(item.raw.updated_at, "DD.MM.YYYY H:m") }}
            </template>
            <template #item.last_sign_in_at="{ item }">
              {{
                $filters.formatDate(item.raw.last_sign_in_at, "DD.MM.YYYY H:m")
              }}
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

export default {
  name: "AdminUsers",
  computed: {
    ...mapState("loader", ["loading"]),
    ...mapState("region", ["regionData", "map"]),
    ...mapState("regions", ["regions", "active"]),
    ...mapState("locations", ["locations"]),
    ...mapGetters("locations", ["filteredLocations"]),
    ...mapState("place", ["place"]),
  },

  data() {
    return {
      search: "",
      awaitingSearch: false,
      totalUsers: 0,
      users: [],
      options: { sortDesc: "desc", itemsPerPage: 10 },
      headers: [
        {
          title: "Nickname",
          align: "start",
          sortable: false,
          key: "nickname",
        },
        { title: "Email", key: "email" },
        { title: "Role", sortable: false, key: "role_keys" },
        { title: "Created", key: "created_at" },
        { title: "Last login", key: "last_sign_in_at" },
        { title: "Updated", key: "updated_at" },
      ],
    };
  },
  watch: {
    options: {
      handler() {
        this.getDataFromApi();
      },
      deep: true,
    },
    search() {
      if (!this.awaitingSearch) {
        setTimeout(() => {
          this.getDataFromApi();
          this.awaitingSearch = false;
        }, 2000);
      }
      this.awaitingSearch = true;
    },
  },
  methods: {
    mapRegion(item) {
      if (item.substring(0, 14) == "moderator_map_") {
        return (
          "Moderator: " +
          this.regions.find((x) => x.id === item.substring(14)).title
        );
      }
      return item;
    },
    getDataFromApi() {
      this.$store.dispatch("loader/show");
      this.fetchUsers().then((data) => {
        this.users = data.items.map((x) => x.attributes);
        this.totalUsers = data.total;
        this.$store.dispatch("loader/hide");
      });
    },
    fetchUsers() {
      return new Promise((resolve, reject) => {
        const { sortBy = [], sortDesc = [], page, itemsPerPage } = this.options;
        let newSortBy = sortBy.map((item) => {
          if (item && item.value) {
            return item.value.substring(11);
          } else {
            return "";
          }
        });
        let newSortDesc = sortDesc.map((item) => {
          return item || item.value ? "desc" : "asc";
        });

        let items = [];
        AdminRepository.getUsers({
          query: this.search,
          sortBy: newSortBy,
          sortDesc: newSortDesc,
          page: page,
          itemsPerPage: itemsPerPage,
        }).then((result) => {
          items = result.data;
          const total = result.meta.total;

          resolve({
            items,
            total,
          });
        });
      });
    },
  },
};
</script>
