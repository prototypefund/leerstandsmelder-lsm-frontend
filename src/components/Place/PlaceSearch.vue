<template>
  <v-card class="map-form">
    <div class="d-flex search-wrap justify-center align-center">
      <v-autocomplete
        v-model:search="search"
        :items="items"
        :loading="isLoading"
        color="white"
        clearable
        hide-selected
        hide-no-data
        item-title="place_name"
        :label="place.place_name"
        :placeholder="$t('search.start_typing')"
        prepend-icon="mdi-home"
        :return-object="true"
        style="min-width: 400px; max-width: 400px"
        solo
        @update:model-value="onChangeAutoComplete"
      >
        <template #no-data>{{ $t("search.nothing_found") }}</template>

        <template #item="{ props, item }">
          <v-list-item
            v-bind="props"
            prepend-item="mdi-home"
            :title="item?.raw?.place_name"
            style="pointer-events: auto"
          ></v-list-item>
        </template>
      </v-autocomplete>
    </div>
    <mgl-map
      :map-style="mapStyleLink"
      :zoom="mapzoom"
      :center="mapcenter"
      class="rounded-lg"
      style="max-height: 800px"
      @map:load="onLoad"
    >
      <mgl-navigation-control position="top-left" />

      <mgl-scale-control position="bottom-left" />
      <mgl-geolocation-control
        position="top-left"
        fit-bounds-options="{maxZoom:5}"
      />
      <mgl-geo-json-source source-id="geojson" :data="geoJsonSource.data">
        <mgl-circle-layer layer-id="geojson" :paint="geoJsonSource.paint" />
      </mgl-geo-json-source>
    </mgl-map>
    <v-row justify="center">
      <v-overlay
        v-model="overlay"
        contained
        :close-on-back="false"
        :persistent="true"
        class="justify-center map-overlay d-flex"
        ><div class="inner justify-center align-center d-flex">
          <div class="spacer"></div>

          <div
            style="width: 400px; height: 60px"
            class="d-flex justify-center align-center"
          >
            <v-btn
              class="search-marker rounded-0 align-center justify-center"
              icon="mdi-menu-down-outline"
              color="primary"
              style="
                background-color: white;
                border-radius: 4px !important;
                border-width: 2px;
                color: black;
                opacity: 0.5;
              "
            ></v-btn>
          </div>
          <div class="spacer"></div>
        </div>
      </v-overlay>
    </v-row>
  </v-card>
</template>
<script>
import { mapState } from "vuex";
import { useMapHelpers } from "@/composables/useMapHelpers";
import { ref } from "vue";

import { MglMap, MglNavigationControl, useMap } from "vue-maplibre-gl";

export default {
  name: "PlaceSearch",
  emits: ["loadPlace"],
  data() {
    return {
      entries: [],
      isLoading: false,
      select: "",
      search: "",
      items: [],
      searchterm: "",
      key: import.meta.env.VITE_GEOAPIFY_KEY || "PaXrIoKsfUWHFOBI2EMp",
      overlay: true,
      local_map: null,
      searching: null,
    };
  },
  props: {
    editPlace: {
      type: Boolean,
      default: false,
    },
  },

  created() {
    const map = useMap();
    this.local_map = map;
    //this.geoJsonSource = this.jsonSource;
  },
  computed: {
    ...mapState("region", ["regionId", "regionData", "map"]),
    ...mapState("regions", ["regions", "active"]),
    ...mapState("locations", ["locations", "filteredLocations"]),
    ...mapState("place", ["place"]),
    ...mapState("site", ["language"]),

    geoJsonSource: function () {
      //console.log("compute geojson", this.locations);
      return {
        show: ref(true),
        data: this.locations,
        paint: {
          "circle-color": [
            "match",
            ["get", "owner"],
            "locations.owner_options.private",
            "#00FF00",
            "locations.owner_options.public",
            "#FFFF00",
            "#FF0000",
          ],
          // Make circles larger as the user zooms from z12 to z22.
          "circle-radius": {
            base: 1.55,
            stops: [
              [12, 2],
              [22, 180],
            ],
          },
          "circle-opacity": 0.4,
        },
      };
    },
    mapcenter: function () {
      if (this.place.lon > 0 && this.place.lat > 0) {
        return [this.place.lon, this.place.lat];
      } else {
        return [this.regionData.mapcenter_lon, this.regionData.mapcenter_lat];
      }
    },

    mapzoom: function () {
      return this.regionData.zoom + 4;
    },
    mapStyleLink: function () {
      return useMapHelpers().mapStyleLink();
    },
  },
  methods: {
    onLoad(e) {
      this.local_map.map.addSource("search-results", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });
      this.local_map.map.addLayer({
        id: "point-result",
        type: "circle",
        source: "search-results",
        paint: {
          "circle-radius": 8,
          "circle-color": "#B42222",
          "circle-opacity": 0.5,
        },
        filter: ["==", "$type", "Point"],
      });
      //console.log("OnLoad MAP", this.locations);
      this.local_map.map.addSource("geo-results", {
        type: "geojson",
        data: this.locations,
      });
      this.local_map.map.addLayer({
        id: "geo-result",
        type: "circle",
        source: "geo-results",
        paint: {
          "circle-radius": 8,
          "circle-color": "#003300",
          "circle-opacity": 0.8,
        },
        filter: ["==", "$type", "Point"],
      });

      this.local_map.map.on(
        "click",
        "geo-result",
        function (e) {
          let pid = e.features[0].properties.id;
          console.log("geo-result", e.features[0].properties.id);
          //this.$emit("loadPlace", pid);
          this.$store.dispatch("loader/show");
          this.$store
            .dispatch("place/fetchPlace", pid)
            .then((data) => {
              this.$store.dispatch("loader/hide");

              this.$router
                .push({
                  name: "place-detail",
                  params: { slug: pid },
                  replace: true,
                })
                .then((result) => {
                  console.log("router result", result);
                  //return false;
                })
                .catch((err) => {
                  console.log("router catch", err);
                });
            })
            .catch((error) => {
              // hideDetail();
              this.$store.dispatch("loader/hide");
            });
        }.bind(this)
      );

      this.local_map.map.on(
        "mouseenter",
        "geo-result",
        function () {
          this.local_map.map.getCanvas().style.cursor = "pointer";
        }.bind(this)
      );

      this.local_map.map.on(
        "mouseleave",
        "geo-result",
        function () {
          this.local_map.map.getCanvas().style.cursor = "";
        }.bind(this)
      );

      // this.local_map.map.getSource("geojson").setData({
      //   type: "FeatureCollection",
      //   features: this.locations.value,
      // });

      this.local_map.map.on(
        "moveend",
        function (e) {
          if (this.editPlace) {
            const { lng, lat } = this.local_map.map.getCenter();
            let precision = 4;
            console.log(
              "moveEnd",
              this.roundToX(lng, precision),
              this.roundToX(lat, precision),
              this.roundToX(this.place.lon, precision),
              this.roundToX(this.place.lat, precision)
            );
            if (
              this.roundToX(this.place.lon, precision) !=
                this.roundToX(lng, precision) ||
              this.roundToX(this.place.lat, precision) !=
                this.roundToX(lat, precision)
            ) {
              this.place.lon = lng;
              this.place.lat = lat;
              //TODO: reverse geocode

              // if (this.loading) {
              //   return;
              // }
              this.reverseGeocode(this.place).then((data) =>
                this.onChangeMoveEnd(data.features[0])
              );
            }
          }
        }.bind(this)
      );
    },

    round_numbers(num) {
      return Math.round((parseFloat(num) + Number.EPSILON) * 100) / 100;
    },

    roundToX(num, decimals) {
      return +(Math.round(num + "e" + decimals) + "e-" + decimals);
    },

    onChangeAutoComplete(val) {
      console.log("onChangeAutoComplete", {
        type: "FeatureCollection",
        features: val,
      });
      let payload = val;
      if (payload) {
        payload["zoom"] = 16;
        this.local_map.map.getSource("search-results").setData({
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: { name: val.place_name },
              geometry: {
                type: "Point",
                coordinates: [val.lon, val.lat],
              },
            },
          ],
        });

        console.log("FlyTo", [val.lon, val.lat] || val.center);
        this.local_map.map.flyTo({
          center: [val.lon, val.lat] || val.center,
          zoom: 16,
        });
        // }
        //this.$store.dispatch("region/setEditMap", val);
        if (this.editPlace) {
          this.$store.dispatch("place/setPlaceFromLookup", { place: val });
        }
        this.loading = false;
      }
    },
    onChangeMoveEnd(val) {
      console.log("onChangeMoveEnd", val);
      let payload = val;
      if (payload) {
        payload["zoom"] = 28;
        this.local_map.map.getSource("search-results").setData({
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: { name: val.place_name },
              geometry: {
                type: "Point",
                coordinates: [val.lon, val.lat],
              },
            },
          ],
        });
        this.$store
          .dispatch("place/setPlaceFromLookup", { place: val })
          .then(() => {
            this.loading = false;
          });
      }
    },
    async querySelections(v) {
      // Simulated ajax query
      this.loading = true;
      const results = await this.forwardGeocode({ query: v });

      console.log("autocompleter", v, results);

      this.count = results.features.count;
      this.items = results.features;

      console.log("autocompl", this.items);
    },

    async searchPlace(place, key) {
      const response = await fetch(
        `https://api.maptiler.com/geocoding/${place}.json?key=${key}`
      );
      const metadata = await response.json();
      return metadata;
    },

    async forwardGeocode(config) {
      const features = [];
      try {
        // let request =
        //   "https://nominatim.openstreetmap.org/search?q=" +
        //   config.query +
        //   "&format=geojson&polygon_geojson=1&addressdetails=1";
        let request =
          "https://api.geoapify.com/v1/geocode/autocomplete?text=" +
          config.query +
          "&lang=" +
          this.language +
          "&format=json&apiKey=" +
          this.key;
        const response = await fetch(request);
        const geojson = await response.json();
        for (let feature of geojson.results) {
          let center = [0, 0];
          if (feature.bbox) {
            center = [
              feature.bbox[0] + (feature.bbox[2] - feature.bbox[0]) / 2,
              feature.bbox[1] + (feature.bbox[3] - feature.bbox[1]) / 2,
            ];
          } else {
            center = [feature.lon, feature.lat];
          }

          let point = {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: center,
            },
            //place_name: feature.properties.display_name,
            place_name: feature.formatted,
            properties: {},
            text: feature.formatted,
            place_type: feature.result_type || ["place"],
            center: center,
          };
          let merged = { ...point, ...feature };
          console.log("forwardGeocode push point", merged);
          features.push(merged);
        }
      } catch (e) {
        console.error(`Failed to forwardGeocode with error: ${e}`);
      }

      return {
        features: features,
      };
    },
    async reverseGeocode(config) {
      const features = [];
      try {
        // let request =
        //   "https://nominatim.openstreetmap.org/search?q=" +
        //   config.query +
        //   "&format=geojson&polygon_geojson=1&addressdetails=1";
        //https://api.geoapify.com/v1/geocode/reverse?lat=52.547723593697555&lon=13.427401809691332&format=json&apiKey=YOUR_API_KEY
        let request =
          "https://api.geoapify.com/v1/geocode/reverse?lat=" +
          config.lat +
          "&lon=" +
          config.lon +
          "&lang=" +
          this.language +
          "&format=json&apiKey=" +
          this.key;
        const response = await fetch(request);
        const geojson = await response.json();
        for (let feature of geojson.results) {
          let center = [0, 0];
          if (feature.bbox) {
            center = [
              feature.bbox[0] + (feature.bbox[2] - feature.bbox[0]) / 2,
              feature.bbox[1] + (feature.bbox[3] - feature.bbox[1]) / 2,
            ];
          } else {
            center = [feature.lon, feature.lat];
          }

          let point = {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: center,
            },
            //place_name: feature.properties.display_name,
            place_name: feature.formatted,
            //properties: feature.properties,
            text: feature.formatted,
            place_type: feature.result_type || ["place"],
            center: center,
          };
          let merged = { ...point, ...feature };
          console.log("reverseGeocode: push point", merged);
          features.push(merged);
        }
      } catch (e) {
        console.error(`Failed to reverseGeocode with error: ${e}`);
      }

      return {
        features: features,
      };
    },
  },
  watch: {
    search(newVal, oldVal) {
      console.log("search", newVal, oldVal, this.select, this.search);
      if (this.searching) {
        clearTimeout(this.searching);
      }

      this.searching = setTimeout(
        function () {
          if (
            newVal &&
            newVal !== this.select &&
            newVal != oldVal &&
            newVal.length > 4
          ) {
            this.querySelections(newVal);
          }
        }.bind(this),
        500
      );
    },
  },
};
</script>
