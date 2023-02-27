<template>
  <v-container>
    <v-row no-gutters>
      <v-col cols="12" sm="12" md="12">
        <StartSlogans />
      </v-col>
      <v-col cols="12" md="8">
        <v-container class="pt-0 pb-0">
          <v-row v-if="!regionData">
            <v-col>
              <v-card class="pa-5">
                <h2 class="text-h2">Hallo Leerstand!</h2>

                <p>
                  Bitte wähle einen Region aus für die der Leerstand angezeigt
                  werden soll:
                  <RegionSelect />
                </p>
              </v-card>
            </v-col>
          </v-row>
          <v-row v-if="regionData && locations && locations.features">
            <v-col>
              <RegionDetail />
            </v-col>
          </v-row>
        </v-container>

        <v-container>
          <RegionsMap max-height="800px" />
        </v-container>
      </v-col>

      <v-col cols="12" md="4">
        <ActionButtons />
        <v-container class="pa-0">
          <v-row>
            <v-col cols="12">
              <NewsList />
            </v-col>
          </v-row>
        </v-container>

        <v-container
          v-if="regionData && locations && locations.features"
          class="pa-0"
        >
          <!--v-row>
            <v-col
              v-if="regionData.mapcenter_lat && regionData.mapcenter_lon"
              cols="12"
            >
              <v-card>
                <mgl-map
                  :map-style="mapStyleLink"
                  :zoom="mapzoom"
                  :center="mapcenter"
                  class="rounded-lg"
                  style="max-height: 500px"
                >
                  <mgl-geo-json-source
                    source-id="geojson"
                    :data="geoJsonSource.data"
                  >
                    <mgl-heatmap-layer layer-id="geojson" />
                  </mgl-geo-json-source>
                </mgl-map>
              </v-card>
            </v-col>
          </v-row-->

          <v-row>
            <v-col>
              <PlaceList @select-place="placeSelect" />
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapGetters } from "vuex";

import StartSlogans from "@/components/Carousel/StartSlogans.vue";

import RegionDetail from "@/components/Region/RegionBanner.vue";
import RegionSelect from "@/components/Region/RegionSelect.vue";
import PlaceList from "@/components/Place/PlaceList.vue";
import NewsList from "@/components/News/NewsList.vue";
import RegionsMap from "@/components/Region/RegionsMap.vue";
import ActionButtons from "@/components/Buttons/ActionButtons.vue";

import { useMapHelpers } from "@/composables/useMapHelpers";

export default {
  name: "HomeView",
  components: {
    StartSlogans,
    RegionDetail,
    RegionSelect,
    PlaceList,
    NewsList,
    RegionsMap,
    ActionButtons,
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
    //...mapState("locations", ["locations"]),
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
      // console.log("selectPlace", data.properties);
      this.$router
        .push({
          name: "place-detail",
          params: { slug: data.properties.id },
        })
        .then((result) => {
          console.log("router result", result);
          //return false;
        })
        .catch((err) => {
          console.log("router catch", err);
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
