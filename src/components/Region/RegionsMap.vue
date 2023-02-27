<template>
  <v-row>
    <v-col v-if="regions" cols="12">
      <v-card>
        <mgl-map
          :map-style="mapStyleLink"
          :zoom="mapzoom"
          :center="mapcenter"
          class="rounded-lg"
          :style="setDefaultStyle"
          @map:load="loadedMap"
        >
          <!--mgl-geo-json-source source-id="geojson" :data="geoJsonRegions.data">
            <mgl-heatmap-layer
              layer-id="geojson"
              :paint="geoJsonRegions.paint"
            />
          </mgl-geo-json-source-->
          <mgl-geo-json-source
            source-id="geojson-region"
            :data="geoJsonRegions.data"
          >
            <!--mgl-circle-layer
              layer-id="geojson"
              :paint="geoJsonRegions.paint"
            /-->
            <!--mgl-circle-layer
              layer-id="geojson2"
              :paint="geoJsonRegions.paint2"
            /-->
          </mgl-geo-json-source>
        </mgl-map>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import { mapState, mapGetters } from "vuex";

import { useMapHelpers } from "@/composables/useMapHelpers";
import { useToast } from "vue-toastification";

import {
  Map,
  NavigationControl,
  Marker,
  Popup,
  LineLayout,
  LinePaint,
  MapLayerMouseEvent,
  LngLat,
} from "maplibre-gl";

import {
  MglMap,
  MglNavigationControl,
  MglMarker,
  useMap,
} from "vue-maplibre-gl";

export default {
  name: "RegionsMap",
  components: {},
  data() {
    return { toast: null };
  },
  props: {
    maxHeight: {
      type: String,
      default: "500px",
    },
  },
  created() {
    //this.geoJsonSource = this.jsonSource;
    this.toast = useToast();
  },
  computed: {
    ...mapState("region", ["regionId", "regionData"]),
    ...mapState("regions", ["regions", "active"]),
    //...mapGetters("regions", ["geoJsonRegions"]),
    //...mapState("locations", ["locations"]),
    geoJsonSource: function () {
      return {
        show: true,
        data: {
          type: "FeatureCollection",
          features: this.filteredLocations,
        },
        paint: {},
      };
    },

    geoJsonRegions: function () {
      console.log("geoJsonRegions", this.regions);
      let collection = [];
      collection = this.regions.map((x) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [x.mapcenter_lon, x.mapcenter_lat],
        },
        properties: {
          id: x.id,
          titel: x.title,
        },
      }));
      console.log("geoJsonRegions", collection);
      return {
        show: true,
        data: {
          type: "FeatureCollection",
          features: collection,
        },
        paint: {
          "circle-color": "#FF0000",
          // Make circles larger as the user zooms from z12 to z22.
          "circle-radius": 6,
          "circle-opacity": 0.9,
        },
        paint2: {
          "circle-color": "#0000FF",
          // Make circles larger as the user zooms from z12 to z22.
          "circle-radius": 8,
          "circle-opacity": 0.6,
        },
      };
    },
    mapcenter: function () {
      //return [this.regionData.mapcenter_lon, this.regionData.mapcenter_lat];
      return [9.769042968752615, 51.13962147768274];
    },
    mapzoom: function () {
      //return this.regionData.zoom;
      return 5;
    },
    mapStyleLink: function () {
      return useMapHelpers().mapStyleLink();
    },
  },

  methods: {
    setDefaultStyle() {
      return "max-height: " + this.maxHeight;
    },
    loadedMap() {
      const map = useMap();
      this.local_map = map;
      console.log("loadedMap", this.local_map);
      // add markers to map
      this.geoJsonRegions.data.features.forEach(
        function (marker) {
          var el = document.createElement("div");
          el.className = "marker";
          el.setAttribute("data-title", marker.properties.titel);

          el.addEventListener(
            "click",
            function () {
              this.selectRegion({ id: marker.properties.id });
            }.bind(this)
          );

          // add marker to map
          new Marker(el, { offset: [0, -30 / 2] })
            .setLngLat(marker.geometry.coordinates)
            .addTo(this.local_map.map);
        }.bind(this)
      );
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
      this.$store.dispatch("region/fetchRegion", region.id).then((data) => {
        this.$store.dispatch("loader/hide");
        this.toast.success("Region laoded: " + data.title);
      });
    },
  },
};
</script>
<style lang="scss"></style>
