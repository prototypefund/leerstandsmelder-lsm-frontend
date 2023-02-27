<template>
  <v-container fill-height>
    <v-row>
      <v-col cols="12" lg="6">
        <PlaceSearch load-place="fetch" />
      </v-col>
      <v-col cols="12" lg="6">
        <PlaceDetail />
        <CommentForm />
        <CommentTimeline />
      </v-col>
    </v-row>
    <v-row class="d-none">
      <v-col cols="12" md="4">
        <v-card class="mb-10 pa-5" outlined>
          <pre>{{ place }}</pre>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from "vuex";

import PlaceDetail from "@/components/Place/PlaceDetail.vue";
import PlaceSearch from "@/components/Place/PlaceSearch.vue";
import CommentTimeline from "@/components/Comment/CommentTimeline.vue";
import CommentForm from "@/components/Comment/CommentForm.vue";

import { useToast } from "vue-toastification";

export default {
  name: "PlaceView",
  components: { PlaceDetail, PlaceSearch, CommentTimeline, CommentForm },
  computed: {
    ...mapState("place", ["place"]),
    ...mapState("comment", ["comment"]),
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
      toast: null,
    };
  },
  methods: {
    async fetch(id) {
      this.$store.dispatch("loader/show");
      this.$store
        .dispatch("place/fetchPlace", id)
        .then(({ request }) => {
          this.toast.success(this.$t("locations.load_success"));
          this.$store.dispatch("loader/hide");
        })
        .catch((error) => {
          this.$store.dispatch("loader/hide");
          this.toast.error("Place error: " + error);
        });
    },
    async init() {
      if (this.$route.params.region) {
        if (
          !this.regionData ||
          this.regionData.slug != this.$route.params.region
        ) {
          this.$store
            .dispatch("region/fetchRegion", this.$route.params.region)
            .then(() => {});
        }
      }
      if (this.$route.params.slug) {
        this.fetch(this.$route.params.slug);
      } else {
        this.toast.error("Place error: Nothing here");
      }
    },
  },
};
</script>

<style></style>
