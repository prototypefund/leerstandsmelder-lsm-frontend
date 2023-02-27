<template>
  <v-container v-if="myPlaces" fluid>
    <v-data-iterator
      v-model:items-per-page="itemsPerPage"
      v-model:page="page"
      :items="myPlaces"
      :search="search"
      :sort-by="sortBy.toLowerCase()"
      :sort-desc="sortDesc"
      hide-default-footer
    >
      <template #header>
        <v-toolbar dark color="primary lighten-3" class="mb-1">
          <v-text-field
            v-model="search"
            clearable
            flat
            solo-inverted
            hide-details
            prepend-inner-icon="mdi-magnify"
            label="Search"
          ></v-text-field>
          <template v-if="$vuetify.breakpoint.mdAndUp">
            <v-spacer></v-spacer>
            <v-select
              v-model="sortBy"
              flat
              solo-inverted
              hide-details
              :items="translatedKeys"
              prepend-inner-icon="mdi-magnify"
              label="Sort by"
            ></v-select>
            <v-spacer></v-spacer>
            <v-btn-toggle v-model="sortDesc" mandatory>
              <v-btn large depressed color="primary" :value="false">
                <v-icon>mdi-chevron-up</v-icon>
              </v-btn>
              <v-btn large depressed color="primary" :value="true">
                <v-icon>mdi-chevron-down</v-icon>
              </v-btn>
            </v-btn-toggle>
          </template>
        </v-toolbar>
      </template>

      <template #default="props">
        <v-row>
          <v-col
            v-for="item in props.items"
            :key="item.name"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card>
              <v-card-title class="subheading font-weight-bold">
                {{ item.title }}
              </v-card-title>

              <v-divider></v-divider>

              <v-list dense>
                <v-list-item v-for="(key, index) in filteredKeys" :key="index">
                  <v-list-item-title :class="{ 'red--text': sortBy === key }">
                    {{ translateField(key) }}:
                  </v-list-item-title>
                  <v-list-item-title
                    class="align-end"
                    :class="{ 'red--text': sortBy === key }"
                  >
                    {{ translateField(item[key.toLowerCase()]) }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </template>

      <template #footer>
        <v-row class="mt-2" align="center" justify="center">
          <span class="grey--text">Items per page</span>
          <v-menu offset-y>
            <template #activator="{ on, attrs }">
              <v-btn
                dark
                text
                color="primary"
                class="ml-2"
                v-bind="attrs"
                v-on="on"
              >
                {{ itemsPerPage }}
                <v-icon>mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(number, index) in itemsPerPageArray"
                :key="index"
                @click="updateItemsPerPage(number)"
              >
                <v-list-item-title>{{ number }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-spacer></v-spacer>

          <span class="mr-4 grey--text">
            Page {{ page }} of {{ numberOfPages }}
          </span>
          <v-btn
            fab
            dark
            color="primary darken-3"
            class="mr-1"
            @click="formerPage"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn
            fab
            dark
            color="primary darken-3"
            class="ml-1"
            @click="nextPage"
          >
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-row>
      </template>
    </v-data-iterator>
  </v-container>
</template>

<script>
//import Vue from "vue";
import { mapState, mapGetters } from "vuex";
import { useToast } from "vue-toastification";

export default {
  data() {
    return {
      itemsPerPageArray: [4, 8, 12],
      search: "",
      filter: {},
      sortDesc: false,
      page: 1,
      itemsPerPage: 12,
      sortBy: "name",
      keys: [
        "teaser",
        "buildingType",
        "owner",
        "created_at",
        "updated_at",
        "city",
      ],
      toast: null,
    };
  },
  computed: {
    ...mapState("region", ["regionData", "map"]),
    ...mapState("place", ["place"]),
    ...mapGetters("users", ["myPlaces"]),

    translatedKeys() {
      var transi = this.keys.map((k) => {
        const val = {};
        val["value"] = k;
        val["text"] = this.translateField(k);
        return val;
      });
      console.log("generate", transi);
      return transi;
    },
    numberOfPages() {
      if (this.myPlaces.length > 0) {
        return Math.ceil(this.myPlaces.length / this.itemsPerPage);
      } else {
        return 0;
      }
    },
    filteredKeys() {
      return this.keys.filter((key) => key !== "Name");
    },
  },
  mounted() {
    this.toast = useToast();
    this.fetch();
  },
  methods: {
    async fetch() {
      this.$store.dispatch("loader/show");
      await this.$store.dispatch("users/fetchPlaces").then((places) => {
        this.$store.dispatch("loader/hide");
        console.log("userPlaces", this.myPlaces);
        this.toast.success("Places have been loaded");
      });
    },
    nextPage() {
      if (this.page + 1 <= this.numberOfPages) this.page += 1;
    },
    formerPage() {
      if (this.page - 1 >= 1) this.page -= 1;
    },
    updateItemsPerPage(number) {
      this.itemsPerPage = number;
    },
    translateField(key) {
      if (key != "" && key != null) {
        var tKey = this.$filter("locationField")(key);
        var tVal = this.$t(tKey);
        return tKey != tVal ? tVal : key;
      } else {
        return key;
      }
    },
  },
};
</script>
