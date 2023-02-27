<template>
  <v-sheet
    v-if="regionData && locations && filteredLocations"
    class="map rounded-lg"
  >
    <v-btn
      to="form"
      position="fixed"
      stacked
      size="x-large"
      variant="outlined"
      style="z-index: 2233; bottom: 40px; left: 20px"
      class="floating_btn call_action"
      >{{ $t("locations.create_new") }} ></v-btn
    >
    <mgl-map
      :map-style="mapHelper.mapStyleLink()"
      :zoom="mapzoom"
      :center="mapcenter"
      class="rounded-lg"
      @map:load="onLoad"
    >
      <mgl-frame-rate-control position="top-left" />
      <mgl-navigation-control position="top-left" />

      <mgl-fullscreen-control position="top-left" />

      <mgl-scale-control position="bottom-left" />
      <mgl-geolocation-control position="top-left" />
      <!--mgl-geo-json-source source-id="geojson" :data="geoJsonSource.data">
        <mgl-circle-layer layer-id="geojson" :paint="geoJsonSource.paint" />
      </mgl-geo-json-source-->
      <!--mgl-marker
        v-for="(lplace, index) in this.filteredLocations"
        :key="'marker-' + index"
        :coordinates="[lplace.lon, lplace.lat]"
        :id="index"
        ><div>element</div></mgl-marker
      -->
    </mgl-map>
  </v-sheet>

  <v-dialog
    v-model="overlay"
    class="align-right justify-end"
    location="top right"
    scroll-strategy="block"
    scrollable
    transition="dialog-bottom-transition"
    overflow-y-auto
  >
    <template #activator="{ props }">
      <v-btn
        position="absolute"
        style="right: -5px; top: 120px"
        color="primary"
        v-bind="props"
      >
        <v-icon v-if="place_status != 'initial'">mdi-home</v-icon>
        <v-icon v-if="place_status == 'initial'"
          >mdi-format-list-bulleted</v-icon
        >
      </v-btn>
    </template>
    <v-container>
      <v-row class="align-right justify-end">
        <v-col
          id="place_offset"
          cols="12"
          sm="8"
          xs="12"
          class="modal-background"
        >
          <v-btn
            icon
            variant="outlined"
            class="modal-close"
            @click="overlay = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <div v-if="place_status != 'initial'">
            <PlaceDetail ref="compdetail" />
            <CommentTimeline />
            <CommentForm />
          </div>

          <PlaceList
            v-if="place_status == 'initial'"
            @select-place="placeSelectFly"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-dialog>
  <v-dialog
    v-model="overlay_filter"
    class="align-right justify-end"
    location="top right"
    scroll-strategy="block"
    scrollable
    transition="dialog-right-transition"
    overflow-y-auto
  >
    <template #activator="{ props }">
      <v-btn
        position="absolute"
        style="right: -5px; top: 160px"
        color="primary"
        v-bind="props"
      >
        <v-icon>mdi-filter</v-icon>
      </v-btn>
    </template>
    <v-container>
      <v-row class="align-right justify-end">
        <v-col cols="12" offset="2" sm="8" xs="12" class="modal-background">
          <DateFilter />
        </v-col>
      </v-row>
    </v-container>
  </v-dialog>
</template>
<script>
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import {
  ref,
  toRef,
  watch,
  shallowRef,
  onMounted,
  onUnmounted,
  markRaw,
  computed,
} from "vue";
import {
  MglMap,
  MglNavigationControl,
  MglMarker,
  useMap,
} from "vue-maplibre-gl";
import {
  Map,
  NavigationControl,
  Marker,
  Popup,
  LineLayout,
  LinePaint,
  MapLayerMouseEvent,
} from "maplibre-gl";

import PlaceForm from "@/components/Place/PlaceForm.vue";
import PlaceDetail from "@/components/Place/PlaceDetail.vue";
import CommentTimeline from "@/components/Comment/CommentTimeline.vue";
import CommentForm from "@/components/Comment/CommentForm.vue";

import PlaceList from "@/components/Place/PlaceList.vue";
import DateFilter from "@/components/DateFilter.vue";

import { useMapHelpers } from "@/composables/useMapHelpers";

export default {
  name: "MapView",
  components: {
    MglMap,
    MglNavigationControl,
    MglMarker,
    PlaceForm,
    PlaceDetail,
    CommentTimeline,
    CommentForm,
    PlaceList,
    DateFilter,
  },
  setup() {
    console.log("setup");

    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const toast = useToast();

    const mapHelper = useMapHelpers();

    const compdetail = ref(null);

    store.dispatch("loader/show");

    const lang = computed(() => store.getters["site/language"]);
    const regionId = computed(() => store.getters["region/getregionId"]);
    const regionData = computed(() => store.getters["region/getregionData"]);
    const regionUrl = computed(() => store.getters["region/regionUrl"]);
    const regionMap = computed(() => store.getters["region/getregionMap"]);
    const locations = computed(() => store.getters["locations/getLocations"]);
    const filteredLocations = computed(
      () => store.getters["locations/filteredLocations"]
    );
    const place = computed(() => store.getters["place/place"]);
    const place_status = computed(() => store.getters["place/status"]);

    const mapcenter = computed(() => [
      regionData.value.mapcenter_lon,
      regionData.value.mapcenter_lat,
    ]);

    const mapzoom = computed(() => regionData.value.zoom);

    const loaded = ref(0);
    const overlay = ref(false);
    const overlay_filter = ref(false);

    const status = ref("index"); // index | filter | edit | show

    const geoJsonSource = computed(() => {
      return {
        show: ref(true),
        data: {
          type: "FeatureCollection",
          features: filteredLocations.value,
        },
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
            base: 1.45,
            stops: [
              [12, 2],
              [22, 180],
            ],
          },
          "circle-opacity": 0.4,
        },
      };
    });
    const mapInstance = useMap();

    var mapFlying = false;

    watch(geoJsonSource, async (newJson) => {
      if (newJson.data.features.length > 0) {
        renderMarkers(newJson);
      }
    });

    function renderMarkers(jsonData) {
      jsonData.data.features.forEach(function (marker) {
        console.log("loadedMapFunc2", marker, regionUrl);
        // create a DOM element for the marker
        var el = document.createElement("div");
        el.className = "marker";
        if (marker.properties.thumb_url) {
          el.style.backgroundImage = "url(" + marker.properties.thumb_url + ")";
        }
        el.setAttribute("data-title", marker.properties.title);

        el.style.width = "30px";
        el.style.height = "30px";

        el.addEventListener("click", function () {
          placeSelectFly(marker);
        });

        // add marker to map
        new Marker(el, { offset: [0, -30 / 2] })
          .setLngLat(marker.geometry.coordinates)
          .addTo(mapInstance.map);
      });
    }

    watch(toRef(mapInstance, "isLoaded"), () => {
      console.log("IS LOADED", mapInstance.map, geoJsonSource),
        {
          immediate: true,
        };

      mapInstance.map.on("flystart", function () {
        mapFlying = true;
      });
      mapInstance.map.on("flyend", function () {
        mapFlying = false;
      });

      mapInstance.map.on("moveend", function (e) {
        if (mapFlying) {
          let padding = {};
          let lwidth = 300;
          if (
            compdetail.value &&
            compdetail.value.$el &&
            compdetail.value.$el.nextElementSibling &&
            compdetail.value.$el.nextElementSibling.offsetWidth
          ) {
            lwidth = compdetail.value.$el.nextElementSibling.offsetWidth;
          }
          padding["right"] = lwidth;
          mapInstance.map.easeTo({
            padding: padding,
            duration: 1000,
          });
          mapInstance.map.fire("flyend");
        }
      });

      mapInstance.map.on("click", "geojson", function (e) {
        placeSelectFly(e.features[0]);
      });

      mapInstance.map.on("mouseenter", "geojson", () => {
        mapInstance.map.getCanvas().style.cursor = "pointer";
      });

      mapInstance.map.on("mouseleave", "geojson", function () {
        mapInstance.map.getCanvas().style.cursor = "";
      });

      store.dispatch("loader/hide");
    });
    watch(
      toRef(mapInstance, "isMounted"),
      (v) => console.log("IS MOUNTED", v),
      {
        immediate: true,
      }
    );

    function placeSelectFly(item) {
      mapInstance.map.fire("flystart");

      mapInstance.map.flyTo({
        // These options control the ending camera position: centered at
        // the target, at zoom level 9, and north up.
        center: item.geometry.coordinates,
        zoom: 15,
        bearing: 0,

        // These options control the flight curve, making it move
        // slowly and zoom out almost completely before starting
        // to pan.
        speed: 0.5, // make the flying slow
        curve: 1, // change the speed at which it zooms out

        // This can be any easing function: it takes a number between
        // 0 and 1 and returns another number between 0 and 1.
        easing: function (t) {
          return t;
        },

        // this animation is considered essential with respect to prefers-reduced-motion
        essential: false,
      });
      console.log("click", item, item.properties);

      setPlaceClick(item, item.properties);
    }

    function setPlaceClick(index, lplace) {
      //console.log("setPlaceClick", lplace, place);
      if (place.value != lplace) {
        store.dispatch("loader/show");
        store
          .dispatch("place/fetchPlace", lplace.id)
          .then((data) => {
            store.dispatch("loader/hide");
            showDetail();
            // router
            //   .push({
            //     name: "map-show",
            //     params: { slug: data.id },
            //     replace: true,
            //   })
            //   .then((result) => {
            //     console.log("router result", result);
            //     //return false;
            //   })
            //   .catch((err) => {
            //     console.log("router catch", err);
            //   });

            toast.success("Place has been loaded");
          })
          .catch((error) => {
            // hideDetail();
            store.dispatch("loader/hide");
            toast.error("Place error: " + error);
          });
      }
    }

    function showDetail() {
      status.value = "detail";
      overlay.value = true;

      // store.dispatch("loader/show");
      // store.dispatch("region/setMap", place).then(({ data }) => {
      //   store.dispatch("loader/hide");
      // });
    }

    function hideDetail() {
      console.log("hide detail");
      status.value = "index";
      overlay.value = false;

      store.dispatch("loader/show");
      store.dispatch("region/setMap", regionData).then(({ data }) => {
        store.dispatch("place/reset");
        store.dispatch("loader/hide");
      });
    }

    // async function init() {
    //   console.log("init called", regionData, lang);
    //   if (route.params.slug) {
    //     store
    //       .dispatch("place/fetchPlace", route.params.slug)
    //       .then(({ request }) => {
    //         toast.success("Place has been loaded");
    //         showDetail();
    //       })
    //       .catch((error) => {
    //         hideDetail();
    //         store.dispatch("loader/hide");
    //         toast.error("Place error: " + error);
    //       });
    //   } else {
    //     store.dispatch("loader/show");
    //     store.dispatch("region/setMap", regionData).then(({ data }) => {
    //       store.dispatch("loader/hide");
    //     });
    //   }
    // }

    function updateModal(status) {
      console.log("updated", status);
    }

    onMounted(() => {
      //init();
      console.log("MOUNTED AGAIN", compdetail.value);
    });

    return {
      mapHelper,
      compdetail,
      mapInstance,
      regionData,
      regionMap,
      locations,
      filteredLocations,
      place,
      place_status,
      mapcenter,
      mapzoom,
      overlay,
      overlay_filter,
      status,
      geoJsonSource,
      loaded,
      placeSelectFly,
      setPlaceClick,
      renderMarkers,
    };
  },
  watch: {
    showPlace: function (newState, oldState) {
      if (newState != oldState) {
        if (newState === false) {
          this.$store.dispatch("place/resetStatePlace");
          this.$router.push({
            name: "map",
          });
        }
      }
    },
    overlay: function (newState, oldState) {
      console.log("overlay changed", newState, oldState);
      if (!newState) {
        // overlay closed
        var padding = {};
        padding["right"] = 0;
        //TODO: make click work
        this.mapInstance.map.easeTo({
          padding: padding,
          duration: 1000,
        });
        this.$store.dispatch("place/resetStatePlace");
      }
    },
  },
  created() {
    //this.init();
  },
  mounted: function () {},
  methods: {
    onLoad(e) {
      this.renderMarkers(this.geoJsonSource);
    },
    onMouseenter(e) {
      console.log("EVENT", e.type, e.lngLat);
    },
    showForm() {
      this.status = "edit";
    },
    hideForm() {
      this.status = "detail";
    },
    showDetail() {
      this.status = "detail";
      //TODO: scroll to detail
      this.$store.dispatch("loader/show");
      this.$store.dispatch("region/setMap", this.place).then(({ data }) => {
        this.$store.dispatch("loader/hide");
      });
    },
    hideDetail() {
      this.status = "index";
      this.$store.dispatch("loader/show");
      this.$store
        .dispatch("region/setMap", this.regionData)
        .then(({ data }) => {
          this.$store.dispatch("loader/hide");
        });
    },
    showIndex() {
      this.status = "index";
    },
    hideIndex() {
      this.status = "";
    },
    showFilter() {
      this.status = "filter";
    },
    hideFilter() {
      this.status = "index";
    },
    isLoggedIn() {
      return this.$store.getters["auth/isLoggedIn"];
    },
    isLoading() {
      return this.$store.getters["loader/loading"];
    },
    async init() {
      if (this.$route.params.slug) {
        this.$store
          .dispatch("place/fetchPlace", this.$route.params.slug)
          .then(({ request }) => {
            this.$toast.success("Place has been loaded");
            this.showDetail();
          })
          .catch((error) => {
            this.hideDetail();
            this.$store.dispatch("loader/hide");
            this.$toast.error("Place error: " + error);
          });
      } else {
        this.$store.dispatch("loader/show");
        this.$store
          .dispatch("region/setMap", this.regionData)
          .then(({ data }) => {
            this.$store.dispatch("loader/hide");
          });
      }
    },
  },
};
</script>
