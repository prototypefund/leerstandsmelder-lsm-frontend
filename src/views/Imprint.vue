<template>
  <v-container>
    <v-row no-gutters>
      <v-col cols="12" md="4">
        <v-container>
          <v-row>
            <v-col cols="12" md="8">
              <v-btn
                stacked
                class="call"
                size="x-large"
                variant="outlined"
                to="form"
                >Leerstand melden ></v-btn
              >
            </v-col>
            <v-col cols="12" md="4">
              <v-btn
                v-if="isLoggedIn"
                size="x-large"
                stacked
                prepend-icon="mdi-account"
                variant="outlined"
                to="profile"
                >Profil</v-btn
              >
              <v-btn
                v-if="!isLoggedIn"
                size="x-large"
                stacked
                prepend-icon="mdi-account-plus"
                variant="outlined"
                to="register"
                >Anmelden</v-btn
              >
            </v-col>
          </v-row>
        </v-container>
        <v-container v-if="!regionData">
          <v-row>
            <v-col>
              <v-card class="pl-10 pr-10 pb-10 pt-5 elevation-5">
                <h2 class="text-h2">Hallo Leerstand!</h2>
                <p>Daten aus den einzelnen Regionen</p>
                <v-list nav dense subheader one-line>
                  <v-list-item
                    v-for="(item, i) in regions"
                    :key="`item-${i}`"
                    :value="item"
                    active-class="teal--text text--darken-4"
                    @click="selectRegion(item)"
                  >
                    <v-list-item-title
                      >{{ item.title }}
                      <v-chip>{{ item.locations }}</v-chip>
                    </v-list-item-title>
                    <template #append>
                      <v-btn
                        v-if="regionData.id != item.id"
                        color="grey-lighten-1"
                        icon="mdi-chevron-right"
                        variant="text"
                      ></v-btn>
                      <v-btn
                        v-if="regionData.id == item.id"
                        color="grey-lighten-1"
                        icon="mdi-close"
                        variant="text"
                        @click.stop="deselect"
                      ></v-btn>
                    </template>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
        <v-container
          v-if="regionData && locations && locations.features"
          class="pa-2"
        >
          <v-row>
            <v-col cols="12">
              <NewsList />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <PlaceList @select-place="placeSelect" />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <RegionDetail />
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";

import RegionDetail from "@/components/Region/RegionBanner.vue";
import PlaceList from "@/components/Place/PlaceList.vue";
import NewsList from "@/components/News/NewsList.vue";
import RegionMap from "@/components/Region/RegionMap.vue";

import { useMapHelpers } from "@/composables/useMapHelpers";

export default {
  name: "RegionView",
  components: {
    RegionDetail,
    PlaceList,
    NewsList,
    RegionMap,
  },
  data() {
    return {};
  },
  created() {
    this.init();
  },
  computed: {
    ...mapState("region", ["regionId", "regionData"]),
    ...mapState("regions", ["regions", "active"]),
    ...mapActions("place", ["selectPlace"]),
    ...mapGetters("locations", ["locations", "filteredLocations"]),
    ...mapGetters("auth", ["isLoggedIn"]),

    geoJsonSource: function () {
      console.log("geoJsonSource", this.filteredLocations);
      return {
        show: true,
        data: {
          type: "FeatureCollection",
          features: this.filteredLocations,
        },
        paint: {},
      };
    },
    mapcenter: function () {
      return [this.regionData.mapcenter_lon, this.regionData.mapcenter_lat];
    },
    mapzoom: function () {
      return this.regionData.zoom;
    },
    mapStyleLink: function () {
      return useMapHelpers().mapStyleLink();
    },
  },

  methods: {
    async init() {
      if (this.$route.params.region) {
        console.log("params", this.$route.params.region);
        if (
          !this.regionData ||
          this.regionData.title != this.$route.params.region
        ) {
          this.selectRegion({ id: this.$route.params.region });
        }
        //this.fetch(this.$route.params.slug);
      }
    },
    placeSelect(data) {
      this.$store.dispatch("place/selectPlace", {
        region: this.$route.params.region,
        slug: data.properties.id,
      });
    },
    selectRegion(region) {
      this.$store.dispatch("loader/show");
      this.$store.dispatch("region/fetchRegion", region.id).then(() => {
        this.$store.dispatch("loader/hide");
      });
    },
  },
};
</script>
