<template>
  <v-menu overflow-y-scroll left top style="z-index: 22222">
    <template #activator="{ props }">
      <v-btn
        id="regionBtn"
        color="primary"
        v-bind="props"
        variant="outlined"
        :small="$vuetify.display.mobile"
        class="d-inline ml-4"
      >
        <span v-if="regionData" class="d-none d-md-block">{{
          regionData.title
        }}</span>
        <span v-if="!regionData" class="d-none d-md-block">Region wählen</span>
        <v-icon>mdi-chevron-down</v-icon>
      </v-btn>
    </template>

    <v-list
      id="regionList"
      v-model:selected="selection"
      nav
      dense
      subheader
      one-line
      style="overflow-y: auto; max-height: 100vh"
    >
      <v-list-subheader>{{ $t("regions.region_plural") }}</v-list-subheader>

      <template #activator>
        <v-list-item-title>Title</v-list-item-title>
      </template>
      <v-list-item
        v-for="(item, i) in regions"
        :key="`item-${i}`"
        :value="item.id"
        active-class="teal--text text--darken-4"
        :selected="regionData.id == item.id"
      >
        <template #prepend>
          <v-icon class="grey lighten-1" dark> mdi-home-city </v-icon>
        </template>

        <v-list-item-title
          >{{ item.title }} <v-chip>{{ item.locations }}</v-chip>
        </v-list-item-title>
        <template v-slot:append>
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
  </v-menu>
</template>
<script>
import { mapState, mapGetters, useStore } from "vuex";

import { useDisplay } from "vuetify";

export default {
  name: "RegionSelect",
  components: {},
  data: () => ({
    activeRegion: null,
    selection: null,
  }),
  computed: {
    ...mapState("region", ["regionId", "regionData"]),
    ...mapState("regions", ["regions", "active"]),
  },
  watch: {
    selection: function (newState, oldState) {
      if (newState != oldState) {
        console.log("watch selection", newState[0], oldState);
        if (newState[0] != this.regionId) {
          this.$store.dispatch("region/fetchRegion", newState[0]).then(() => {
            console.log("resolve region/fetchRegion", this.regionId);
          });
        }
      }
    },
  },
  created() {
    const { width, mobile, name } = useDisplay();
  },
  methods: {
    setActive: function (region) {
      this.$store.dispatch("loader/show");
      this.$store.dispatch("region/fetchRegion", region).then(() => {
        this.$store.dispatch("loader/hide");
      });
    },
    deselect: function () {
      this.$store.dispatch("region/clear").then(() => {
        this.activeRegion = null;
      });
    },
  },
};
</script>
