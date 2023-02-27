<template>
  <v-card class="place-detail">
    <v-row v-if="images && images.length > 0" no-gutters class="image-row">
      <v-col class="d-flex justify-start">
        <v-img
          v-for="(image, index) in images"
          :key="'image-' + index"
          :src="image.image_url"
          aspect-ratio="1"
          cover
          max-height="250"
          max-width="400"
          class="grey lighten-2"
          @click="showFullscreenImage(index)"
        >
          <template #placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular
                indeterminate
                color="grey lighten-5"
              ></v-progress-circular>
            </v-row>
          </template>
        </v-img>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" fullscreen class="image-dialog">
      <div class="d-flex justify-end py-4">
        <v-btn icon="mdi-close" @click="dialog = false"></v-btn>
      </div>
      <v-carousel v-model="selectedItem" class="image-carousel">
        <v-carousel-item
          v-for="(image, i) in images"
          :key="'slide-' + i"
          :src="image.image_url"
        ></v-carousel-item>
      </v-carousel>
    </v-dialog>

    <v-divider v-if="images && images.length > 0"></v-divider>
    <v-row no-gutters>
      <v-col cols="12" md="8" class="divider">
        <v-card-subtitle class="pt-4 text-h6" v-if="!place.sensitive">
          <v-icon icon="mdi-map-marker" size="small"></v-icon>
          <span class="me-1"
            >{{ place.road }}, {{ place.zip }} {{ place.city }}</span
          >
        </v-card-subtitle>
        <v-card-title
          ><h2 class="text-h2">{{ place.title }}</h2></v-card-title
        >

        <v-card-text>
          <div class="my-4 text-body-1">
            {{ place.text }}
          </div>
        </v-card-text>
      </v-col>
      <v-col cols="12" md="4">
        <v-list
          subheader
          one-line
          :class="
            $vuetify.display.smAndDown ? 'sm attributes' : 'lg attributes'
          "
        >
          <v-list-item v-if="place.since">
            <v-list-item-title>
              <v-icon icon="mdi-home-export-outline"></v-icon
              >{{ $t("locations.empty_for") }}</v-list-item-title
            >
            <v-list-item-subtitle class="d-flex justify-center">{{
              $filters.formatDate(place.since)
            }}</v-list-item-subtitle>
          </v-list-item>
          <v-list-item v-if="place.building_type">
            <v-list-item-title>
              <v-icon icon="mdi-home-plus-outline"></v-icon
              >{{ $t("locations.building_type") }}</v-list-item-title
            >
            <v-list-item-subtitle class="d-flex justify-center"
              ><v-chip
                v-for="(key, i) in place.building_type"
                :key="'type-' + i"
                class="text-truncat"
              >
                {{ $t("locations.building_type_options." + key) }}
              </v-chip></v-list-item-subtitle
            >
          </v-list-item>
          <v-list-item v-if="place.degree">
            <v-list-item-title>{{ $t("locations.degree") }}</v-list-item-title>
            <v-list-item-subtitle class="d-flex justify-center">{{
              $t("locations.degree_options." + place.degree)
            }}</v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-title
              ><v-icon icon="mdi-home-lightbulb-outline"></v-icon
              >{{ $t("locations.usage") }}</v-list-item-title
            >
            <v-list-item-subtitle class="d-flex justify-center">
              <v-chip
                v-for="(key, i) in place.building_usage"
                :key="'usage-' + i"
              >
                {{ $t("locations.usage_options." + key) }}
              </v-chip>
            </v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-title
              ><v-icon icon="mdi-home-group"></v-icon
              >{{ $t("locations.part") }}</v-list-item-title
            >
            <v-list-item-subtitle class="d-flex justify-center"
              ><v-chip
                v-for="(key, i) in place.building_part"
                :key="'part-' + i"
              >
                {{ $t("locations.part_options." + key) }}
              </v-chip></v-list-item-subtitle
            >
          </v-list-item>
          <v-list-item v-if="place.owner">
            <v-list-item-title
              ><v-icon icon="mdi-account-outline"></v-icon
              >{{ $t("locations.owner") }}</v-list-item-title
            >
            <v-list-item-subtitle class="d-flex justify-center"
              ><v-chip>
                {{ $t("locations.owner_options." + place.owner) }}
              </v-chip></v-list-item-subtitle
            >
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>

    <v-card-actions>
      <v-row no-gutters>
        <v-col cols="12" md="6"
          ><v-list-item class="w-100 text-body-1">
            <template #prepend>
              <v-icon class="me-1" icon="mdi-star"></v-icon>
            </template>

            <v-list-item-title
              >{{ $t("locations.reported_by") }}
              <b>{{ place.user.nickname }}</b>
              {{ $t("locations.reported_at") }}
              {{ $filters.formatDate(place.created_at) }}</v-list-item-title
            >

            <template #append>
              <div class="justify-self-end">
                <!--v-icon class="me-1" icon="mdi-heart"></v-icon>
                <span class="subheading me-2">256</span>
                <span class="me-1">·</span>
                <v-icon class="me-1" icon="mdi-share-variant"></v-icon>
                <span class="subheading">45</span-->
              </div>
            </template>
          </v-list-item></v-col
        >
        <v-col cols="12" md="6" class="bg-circle"></v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>
<script>
import { mapState } from "vuex";

export default {
  name: "PlaceDetail",

  data() {
    return {
      selectedItem: undefined,
      carousel_item: 0,
      dialog: false,
    };
  },
  computed: {
    ...mapState("place", ["place", "images", "comments"]),
  },
  methods: {
    showFullscreenImage(index) {
      this.selectedItem = index;
      this.dialog = true;
    },
  },
};
</script>
