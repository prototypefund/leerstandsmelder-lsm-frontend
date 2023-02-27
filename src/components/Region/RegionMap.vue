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
          <mgl-geo-json-source
            source-id="geojson-region"
            :data="geoJsonSource.data"
          >
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
    return { toast: null, local_map: null, markerList: [] };
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
    const map = useMap();
    this.local_map = map;
  },
  computed: {
    ...mapState("region", ["regionId", "regionData"]),
    ...mapGetters("region", ["regionUrl"]),
    ...mapState("regions", ["regions", "active"]),
    ...mapGetters("locations", ["filteredLocations"]),
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

  watch: {
    geoJsonSource: function (newJson) {
      //console.log("watch geojson", newJson);
      if (newJson.data.features.length > 0) {
        this.renderMarkers(newJson);
      }
    },
    filteredLocations: function (newFiltered) {
      //console.log("watch filtered", newFiltered);
    },
  },

  methods: {
    renderMarkers(jsonData, clearAll = true) {
      // add markers to map
      if (clearAll) {
        if (this.markerList) {
          for (var i = this.markerList.length - 1; i >= 0; i--) {
            this.markerList[i].remove();
          }
        }
      }
      //console.log("renderMarker", jsonData.data.features);
      jsonData.data.features.forEach(
        function (marker) {
          // create a DOM element for the marker
          var el = document.createElement("div");
          el.className = this.renderClassnames("marker", marker.properties);
          if (marker.properties.thumb_url) {
            el.style.backgroundImage =
              "url(" + marker.properties.thumb_url + ")";
          }
          el.setAttribute("data-title", marker.properties.title);

          el.style.width = "30px";
          el.style.height = "30px";

          el.addEventListener(
            "click",
            function () {
              this.$store.dispatch("place/selectPlace", {
                region: this.regionUrl,
                slug: marker.properties.id,
              });
            }.bind(this)
          );

          // add marker to map
          //
          let mark = new Marker(el, { offset: [0, -30 / 2] })
            .setLngLat(marker.geometry.coordinates)
            .addTo(this.local_map.map);
          this.markerList.push(mark);
        }.bind(this)
      );
    },
    renderClassnames(default_class, item) {
      let classes = [default_class];
      if (item.owner && !Array.isArray(item.owner)) {
        classes.push("own_" + item.owner);
      }
      if (item.building_type && Array.isArray(item.building_type)) {
        let bt_classes = item.building_type.map((el) => {
          let btc = "bt_" + el.toLowerCase();
          classes.push(btc);
        });
        //console.log("item bt" + item.title, bt_classes, item.building_type);
      }
      return classes.join(" ");
    },
    setDefaultStyle() {
      return "max-height: " + this.maxHeight;
    },
    loadedMap() {
      console.log("loadedMap", this.local_map, this.geoJsonSource);
      this.renderMarkers(this.geoJsonSource);
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
