<template>
  <PlaceForm @update-route="setRouteDetails()" />
  <v-container v-if="isAdmin">
    <v-row>
      <v-col cols="12" md="4">
        <v-card class="mb-10 pa-5" outlined>
          <pre>{{ place }}</pre>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import PlaceForm from "@/components/Place/PlaceForm.vue";
import PlaceDetail from "@/components/Place/PlaceDetail.vue";
import { RepositoryFactory } from "../utils/repositories/repositoryFactory";
import { useToast } from "vue-toastification";

// const StateCircle = () =>
// import(/* webpackChunkName: "StateCircle" */ "./StateCircle.vue");

//import { mapGetters } from 'vuex';

export default {
  name: "FormView",
  components: { PlaceForm, PlaceDetail },
  computed: {
    ...mapState("region", ["regionId", "regionData", "map"]),
    ...mapState("regions", ["regions", "active"]),
    ...mapState("locations", ["locations"]),
    ...mapState("place", ["place"]),
    ...mapGetters("auth", ["isLoggedIn", "isAdmin"]),
  },
  watch: {
    // eslint-disable-next-line
  },
  created: function () {
    this.toast = useToast();
    this.init();
  },
  data() {
    return {
      panel: [],
      valid: false,
      lazy: false,
      stepper: 0,
      tickLabels: {
        0: "Location",
        1: "Attributes",
        2: "Preview",
      },
      element: { buildingType: ["wohn", "one"] },
      toast: null,
    };
  },
  methods: {
    async init() {
      if (this.$route.params.slug) {
        this.$store
          .dispatch("place/fetchPlace", this.$route.params.slug)
          .then(({ request }) => {
            this.toast.success(this.$t("locations.load_success"));
          })
          .catch((error) => {
            this.$store.dispatch("loader/hide");
            this.toast.error("Place error: " + error);
          });
      } else {
        console.log("init without");
        this.$store.dispatch("loader/show");
        this.$store
          .dispatch("region/setMap", this.regionData)
          .then(({ data }) => {
            console.log("init setMap", data);
            this.$store.dispatch("place/reset").then(() => {
              console.log("place resetinit without", this.place);
              this.place = {};
              this.$store.dispatch("loader/hide");
            });
          });
      }
    },
    setRouteDetails() {
      this.$router
        .push({
          name: "form-detail",
          params: { slug: this.place.id },
        })
        .catch(() => {});
    },
  },
};
</script>

<style>
.fly-right {
  position: absolute;
  right: 10px;
  top: 10px;
}

.v-color-picker__dot {
  border: 1px solid black;
}

.pick .v-color-picker__sliders,
.pick .v-color-picker__edit,
.pick .v-color-picker__canvas {
  display: none;
}

.v-list-item__title,
.v-list-item__subtitle {
  white-space: normal;
}
.higher {
  height: auto;
}
</style>
