<template>
  <v-container>
    <div v-if="!regionData || !locations">
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
              >
                <v-list-item-title>
                  <v-list-item-title
                    >{{ item.title }}
                    <v-chip>{{ item.locations }}</v-chip>
                  </v-list-item-title>
                </v-list-item-title>
                <v-list-item-action> </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <div v-if="regionData && locations && datedLocations" class="pa-2">
      <v-row>
        <v-col>
          <v-card class="pl-10 pr-10 pb-10 pt-5 elevation-5">
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <h2 class="text-h2">{{ regionData.title }}</h2>

                <v-list
                  ><v-list-item>
                    <template #prepend>
                      <v-icon>mdi-home-city</v-icon>
                    </template>
                    <v-list-item-subtitle
                      >{{ datedLocations.length }}
                      {{ $t("locations.location_plural") }}
                      (dated)
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <template #prepend>
                      <v-icon>mdi-home-analytics</v-icon>
                    </template>
                    <v-list-item-subtitle
                      >{{ filteredLocations.length }}
                      {{ $t("locations.location_plural") }}
                      (filtered)
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <template #prepend>
                      <v-icon>mdi-home</v-icon>
                    </template>
                    <v-list-item-subtitle>
                      {{ countDemolished }} abgerissen</v-list-item-subtitle
                    >
                  </v-list-item>
                  <v-list-item
                    v-if="regionData.mapcenter_lat && regionData.mapcenter_lon"
                  >
                    <template #prepend>
                      <v-icon>mdi-map-marker</v-icon>
                    </template>
                    <v-list-item-subtitle
                      >{{ parseFloat(regionData.mapcenter_lat).toFixed(2) }} x
                      {{
                        parseFloat(regionData.mapcenter_lon).toFixed(2)
                      }}</v-list-item-subtitle
                    >
                  </v-list-item>
                  <v-list-item>
                    <template #prepend>
                      <v-icon>mdi-magnify-plus</v-icon>
                    </template>
                    <v-list-item-subtitle
                      >{{ regionData.zoom }}
                      {{ $t("regions.zoom") }}</v-list-item-subtitle
                    >
                  </v-list-item>
                  <v-list-item>
                    <template #prepend>
                      <v-icon>mdi-timeline-plus</v-icon>
                    </template>
                    <v-list-item-subtitle
                      >{{ $t("regions.created") }}:
                      {{
                        $filters.formatDate(
                          regionData.created_at,
                          "DD.MM.YYYY "
                        )
                      }}
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <template #prepend>
                      <v-icon>mdi-map-marker</v-icon>
                    </template>
                    <v-list-item-subtitle>
                      <v-switch v-model="mapOptions.show_markers"></v-switch>
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col
                v-if="
                  regionData.mapcenter_lat &&
                  regionData.mapcenter_lon &&
                  locations &&
                  filteredLocations
                "
                cols="12"
                sm="6"
                md="8"
              >
                <RegionMap max-height="800px" />
                <!--mgl-map
                  :map-style="mapStyleLink"
                  :zoom="mapzoom"
                  :center="mapcenter"
                  class="rounded-lg"
                  @map:load="onLoad"
                >
                  <mgl-frame-rate-control position="top-left" />
                  <mgl-navigation-control position="top-left" />

                  <mgl-fullscreen-control position="top-left" />

                  <mgl-scale-control position="bottom-left" />

                  <mgl-geo-json-source
                    source-id="geojson"
                    :data="geoJsonSource.data"
                  >
                    <mgl-heatmap-layer
                      layer-id="geojson"
                      :paint="geoJsonSource.paint"
                    />
                  </mgl-geo-json-source>
                </mgl-map -->
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col><DateFilter /> </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6">
          <v-card color="white" class="pt-5 elevation-10">
            <apexchart
              type="bar"
              :series="[{ name: 'by month', data: groupedCreated.series }]"
              :options="{
                chart: {
                  id: 'locations-by-month-created',
                },
                colors: colorPalette,
                xaxis: {
                  categories: groupedCreated.labels,
                },
              }"
            ></apexchart>

            <v-card-text>
              <h4 class="text-h4">Locations created by month</h4>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6">
          <v-card color="white" class="pt-5 elevation-10">
            <apexchart
              class
              type="bar"
              :series="[{ name: 'by month', data: groupedUpdated.series }]"
              :options="{
                chart: {
                  id: 'locations-by-month-updated',
                },
                colors: colorPalette,
                xaxis: {
                  categories: groupedUpdated.labels,
                },
              }"
            ></apexchart>

            <v-card-text>
              <h4 class="text-h4">Locations updated by month</h4>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6">
          <v-card color="white" class="pt-5 elevation-10">
            <apexchart
              class
              type="pie"
              :series="groupedUser.series"
              :options="{
                chart: {
                  id: 'locations-by-user',
                  type: 'pie',
                },
                colors: colorPalette,
                labels: groupedUser.labels,
              }"
            ></apexchart>
            <v-card-text>
              <h4 class="text-h4">Locations by user</h4>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6">
          <v-card color="white" class="pt-5 elevation-10">
            <apexchart
              type="pie"
              :series="groupedPostcode.series"
              :options="{
                chart: {
                  id: 'locations-by-user',
                  type: 'pie',
                },
                colors: colorPalette,
                labels: groupedPostcode.labels,
              }"
            ></apexchart>
            <v-card-text>
              <h4 class="text-h4">Locations by postcode</h4>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6">
          <v-card color="white" class="pt-5 elevation-10">
            <apexchart
              type="bar"
              :series="[{ name: 'by type', data: groupedType.series }]"
              :options="{
                chart: {
                  id: 'locations-by-type-updated',
                },
                colors: colorPalette,
                xaxis: {
                  categories: groupedType.labels,
                },
              }"
            ></apexchart>
            <v-card-text>
              <h4 class="text-h4">LM by type</h4>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6">
          <v-card color="white" class="pt-5 elevation-10">
            <apexchart
              type="bar"
              :series="[{ name: 'by type', data: groupedOwner.series }]"
              :options="{
                chart: {
                  id: 'locations-by-type-updated',
                },
                colors: colorPalette,
                xaxis: {
                  categories: groupedOwner.labels,
                },
              }"
            ></apexchart>
            <v-card-text>
              <h4 class="text-h4">Locations by owner</h4>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import moment from "moment";
import grouper from "../utils/grouper.js";
import DateFilter from "@/components/DateFilter.vue";
import RegionMap from "@/components/Region/RegionMap.vue";

import { useMapHelpers } from "@/composables/useMapHelpers";

// helper function to get the month name from an item
const monthCreated = (item) =>
  moment(item.properties.created_at, "YYYY-MM-DD").format("YYYY");

const monthUpdated = (item) =>
  moment(item.properties.updated_at, "YYYY-MM-DD").format("YYYY");

const countOccurrences = (arr, val) =>
  arr.reduce((a, v) => (v === val ? a + 1 : a), 0);

export default {
  name: "Chart",
  computed: {
    ...mapState("region", ["regionId", "regionData"]),
    ...mapState("regions", ["regions", "active"]),
    ...mapState("locations", ["locations"]),
    ...mapGetters("locations", [
      "locations",
      "filteredLocations",
      "datedLocations",
    ]),

    fieldCount: function (field_name, field_value) {
      return countOccurrences(this.datedLocations, field_name, field_value);
    },

    groupedType: function () {
      return grouper.groupByField(
        "properties.buildingType",
        this.filteredLocations,
        5
      );
    },
    groupedCreated: function () {
      return grouper.groupByField(monthCreated, this.filteredLocations, 0);
    },
    groupedUpdated: function () {
      return grouper.groupByField(monthUpdated, this.filteredLocations, 0);
    },
    groupedUser: function () {
      return grouper.groupByField(
        "properties.user_id",
        this.filteredLocations,
        5
      );
    },
    groupedOwner: function () {
      return grouper.groupByField(
        "properties.owner",
        this.filteredLocations,
        5
      );
    },
    groupedPostcode: function () {
      return grouper.groupByField("properties.zip", this.filteredLocations, 5);
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
  components: {
    DateFilter,
    RegionMap,
  },

  data() {
    return {
      circle: {
        radius: 14,
        color: "transparent",
        fillcolor: "rgba(242, 71, 38, 1)",
        fillopacity: 0.85,
      },
      mapOptions: {
        zoom: 10,
        min_zoom: 2,
        show_markers: false,
      },

      colorPalette: [
        "#FF336A",
        "#00D8B6",
        "#008FFB",
        "#FEB019",
        "#FF4560",
        "#775DD0",
      ],
    };
  },
  created() {
    //if (this.isLoggedIn())
    this.init();
  },
  methods: {
    isLoggedIn() {
      return this.$store.getters["auth/isLoggedIn"];
    },
    isLoading() {
      return this.$store.getters["loader/loading"];
    },
    async init() {},
    handleMapClick(e) {
      // toggleModal
      console.log("onclick");
      console.log(e.target.options.id);
      console.log(e.target.options.title);

      if (e.target.options.title) {
        // set all state to false
        for (let i = 0; i < this.data.layer.places.length; i++) {
          this.$set(this.data.layer.places[i], "state", false);
        }
        console.log(
          "Clicked place: " + this.data.layer.places[e.target.options.id].title
        );
        console.log(
          "Clicked place ID: " + this.data.layer.places[e.target.options.id].id
        );
        this.data.layer.places[e.target.options.id].state =
          !this.data.layer.places[e.target.options.id].state;
      }
    },
  },
};
</script>
