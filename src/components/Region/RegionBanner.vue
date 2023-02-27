<template>
  <v-card class="pa-5 mb-0">
    <h2 class="text-h3">{{ regionData.title }}</h2>

    <v-list
      ><v-list-item>
        <template #prepend>
          <v-icon>mdi-home</v-icon>
        </template>

        <v-list-item-subtitle
          >{{ locations.features.length }}
          {{ $t("locations.location_plural") }}</v-list-item-subtitle
        >
      </v-list-item>
    </v-list>

    <div v-if="regionData.organisation">
      <h4 class="text-h5">
        {{
          $t("regions.organisation_home_intro", {
            lsm_name: regionData.title,
          })
        }}
      </h4>
      <h3 class="text-h4">
        {{ regionData.organisation }}
      </h3>
      <p v-if="regionData.organisation_address" style="white-space: pre">
        {{ regionData.organisation_address }}
      </p>
    </div>
  </v-card>
</template>
<script>
import { mapState, mapGetters } from "vuex";

export default {
  name: "RegionDetail",
  props: {},
  emits: [],

  data() {
    return {};
  },
  computed: {
    ...mapState("region", ["regionId", "regionData"]),
    ...mapState("regions", ["regions", "active"]),
    ...mapGetters("locations", [
      "locations",
      "filteredLocations",
      "datedLocations",
    ]),
  },
  methods: {},
};
</script>
