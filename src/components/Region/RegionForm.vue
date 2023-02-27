<template>
  <v-form @submit.prevent="onPublish(value.id)">
    <v-container>
      <v-row no-gutters>
        <v-col sm="12" md="12">
          <ListErrors :errors="errors" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="4">
          <h2 class="text-h2">
            {{ $t("regions.region") }}
          </h2>
          <h1 class="text-h1" style="word-wrap: break-word">
            {{ value.title }}
          </h1>
          <br />
          <br />
          <br />
          <v-text-field
            v-model="value.title"
            label="Title"
            :counter="80"
            required
          ></v-text-field>
          <v-switch v-model="value.published" label="Veröffentlicht" />
          <v-row no-gutters>
            <v-col md="24">
              <div class="mb-5"></div>
              <v-btn color="primary" @click.prevent="onPublish(value.id)"
                >Speichern</v-btn
              >

              <v-btn text @click="$emit('formClose')">Cancel</v-btn>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12" md="4">
          <v-expansion-panels v-model="panel_additional">
            <v-expansion-panel>
              <v-expansion-panel-title
                ><v-icon icon="mdi-map-marker"></v-icon>
                {{ $t("regions.settings") }}</v-expansion-panel-title
              >
              <v-expansion-panel-text>
                <v-row
                  ><v-col>{{ $t("regions.location_explain") }}</v-col>
                </v-row>

                <v-row>
                  <v-col cols="1"> <v-icon>mdi-map-marker</v-icon></v-col>
                  <v-col cols="10" offset="1">
                    <v-row>
                      <v-col cols="8" md="6">
                        <v-text-field
                          v-model="value.mapcenter_lat"
                          label="Latitude"
                          :counter="12"
                          variant="outlined"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="8" md="6">
                        <v-text-field
                          v-model="value.mapcenter_lon"
                          label="Longitued"
                          :counter="12"
                          variant="outlined"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <div class="text-caption">{{ $t("regions.zoom") }}</div>

                    <v-slider
                      v-model="value.zoom"
                      :min="1"
                      :max="20"
                      :step="1"
                      thumb-label
                    ></v-slider>

                    <v-card class="map-form">
                      <mgl-map
                        :map-style="mapStyleLink"
                        :zoom="mapzoom"
                        :center="mapcenter"
                        class="rounded-lg"
                        style="max-height: 500px"
                        @map:load="onLoad"
                      >
                        <mgl-navigation-control position="top-left" />

                        <mgl-scale-control position="bottom-left" />
                        <mgl-geolocation-control
                          position="top-left"
                          fit-bounds-options="{maxZoom:5}"
                        />
                      </mgl-map>
                      <v-row justify="center">
                        <v-overlay
                          v-model="overlay"
                          contained
                          :close-on-back="false"
                          :persistent="true"
                          class="justify-center map-overlay d-flex"
                          ><div
                            class="inner justify-center align-center d-flex"
                          >
                            <div class="spacer"></div>

                            <div
                              style="width: 400px; height: 60px"
                              class="d-flex justify-center align-center"
                            >
                              <v-btn
                                class="search-marker rounded-0 align-center justify-center"
                                icon="mdi-menu-down-outline"
                                variant="outlined"
                                color="background"
                                style="
                                  border-radius: 4px !important;
                                  border-width: 2px;
                                "
                              ></v-btn>
                            </div>
                            <div class="spacer"></div>
                          </div>
                        </v-overlay>
                      </v-row>
                    </v-card>
                  </v-col>
                </v-row>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>

        <v-col cols="12" md="4">
          <v-expansion-panels class="mb-6">
            <v-expansion-panel>
              <v-expansion-panel-title>
                <v-icon color="error" icon="mdi-text"> </v-icon>
                {{ $t("regions.description") }}
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                {{ $t("regions.subtitle_explain") }}
                <v-text-field
                  v-model="value.subtitle"
                  :label="$t('regions.subtitle')"
                  :counter="80"
                  required
                ></v-text-field>
                {{ $t("regions.description_explain") }}
                <v-textarea
                  v-model="value.text"
                  class="mt-6 rounded-sm"
                  :label="$t('regions.description')"
                  :counter="210"
                  variant="outlined"
                ></v-textarea>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
          <v-expansion-panels class="mb-6">
            <v-expansion-panel>
              <v-expansion-panel-title>
                <v-icon color="error" icon="mdi-text"> </v-icon>
                {{ $t("regions.moderations") }}
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                {{ $t("regions.hide_explain") }}
                <v-switch
                  v-model="value.hide"
                  :label="$t('regions.set_hide')"
                ></v-switch>
                <div v-if="value.hide">
                  {{ $t("regions.hide_message") }}
                  <v-textarea
                    v-model="value.hide_message"
                    class="mt-6 rounded-sm"
                    :label="$t('regions.hide_message')"
                    :counter="210"
                    variant="outlined"
                  ></v-textarea>
                </div>

                <v-switch
                  v-model="value.moderate"
                  :label="$t('regions.set_moderate')"
                ></v-switch>
                <div v-if="value.moderate">
                  {{ $t("regions.moderate_message") }}
                  <v-textarea
                    v-model="value.moderate_message"
                    class="mt-6 rounded-sm"
                    :label="$t('regions.moderate_message')"
                    :counter="210"
                    variant="outlined"
                  ></v-textarea>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>

          <v-expansion-panels class="mb-6">
            <v-expansion-panel>
              <v-expansion-panel-title>
                <v-icon color="error" icon="mdi-text"> </v-icon>
                {{ $t("regions.legal") }}
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                {{ $t("regions.legal_explain") }}
                <v-text-field
                  v-model="value.organisation"
                  :label="$t('regions.organisation')"
                  :counter="80"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="value.organisation_email"
                  :label="$t('regions.organisation_email')"
                  :counter="80"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="value.organisation_url"
                  :label="$t('regions.organisation_url')"
                  :counter="80"
                  required
                ></v-text-field>
                <v-textarea
                  v-model="value.organisation_address"
                  class="mt-6 rounded-sm"
                  :label="$t('regions.organisation_address')"
                  :counter="210"
                  variant="outlined"
                ></v-textarea>
                {{ $t("regions.organisation_legal_explain") }}
                <v-textarea
                  v-model="value.organisation_legal"
                  class="mt-6 rounded-sm"
                  :label="$t('regions.organisation_legal')"
                  :counter="210"
                  variant="outlined"
                ></v-textarea>
                {{ $t("regions.organisation_intro_explain") }}
                <v-textarea
                  v-model="value.organisation_intro"
                  class="mt-6 rounded-sm"
                  :label="$t('regions.organisation_intro')"
                  :counter="210"
                  variant="outlined"
                ></v-textarea>
                {{ $t("regions.organisation_meeting_explain") }}
                <v-textarea
                  v-model="value.organisation_meeting"
                  class="mt-6 rounded-sm"
                  :label="$t('regions.organisation_meeting')"
                  :counter="210"
                  variant="outlined"
                ></v-textarea>
              </v-expansion-panel-text>
            </v-expansion-panel> </v-expansion-panels
        ></v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
import { mapState } from "vuex";

import { useToast } from "vue-toastification";

import ListErrors from "@/components/ListErrors.vue";

import FormControlButtonList from "@/components/FormElements/FormControlButtonList.vue";

import { RepositoryFactory } from "@/utils/repositories/repositoryFactory";
const MapsRepository = RepositoryFactory.get("maps");

import {
  MglMap,
  MglNavigationControl,
  MglMarker,
  useMap,
} from "vue-maplibre-gl";

import { useMapHelpers } from "@/composables/useMapHelpers";

export default {
  name: "RegionForm",
  components: { ListErrors, FormControlButtonList },
  props: {
    modelValue: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  emits: ["update:modelValue", "formClose"],

  data() {
    return {
      errors: {},

      panel_additional: [0, 1],

      selectedFiles: undefined,
      progressInfos: [],
      message: "",

      updateList: 0, // increment to force update : poor mans reactivity // FIXME
      toast: null,
      local_map: null,
      overlay: true,
    };
  },
  created() {
    this.toast = useToast();

    const map = useMap();
    this.local_map = map;
    this.region = { ...this.value };
  },
  mounted() {},
  computed: {
    mapcenter: function () {
      return [this.value.mapcenter_lon, this.value.mapcenter_lat];
    },
    mapzoom: function () {
      return this.value.zoom;
    },
    value: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit("update:modelValue", value);
      },
    },
    mapStyleLink: function () {
      return useMapHelpers().mapStyleLink();
    },
  },

  methods: {
    onLoad(e) {
      this.local_map.map.on(
        "moveend",
        function (e) {
          const { lng, lat } = this.local_map.map.getCenter();
          this.value.mapcenter_lon = lng;
          this.value.mapcenter_lat = lat;
        }.bind(this)
      );
      this.local_map.map.on(
        "zoomend",
        function (e) {
          const zoom = this.local_map.map.getZoom();
          this.value.zoom = zoom;
        }.bind(this)
      );
    },

    onPublish(slug) {
      this.$store.dispatch("loader/show");

      if (slug) {
        MapsRepository.update(slug, this.value)
          .then((resp) => {
            this.$store.dispatch("loader/hide");

            this.toast.success(this.$t("regions.update_success"));

            this.$store.dispatch("regions/fetchRegions").then(() => {
              this.$emit("formClose");
            });
          })
          .catch((err) => {
            this.toast.error(this.$t("regions.update_error"));
            this.errors = err;
          });
      } else {
        MapsRepository.create(this.value)
          .then((resp) => {
            this.$store.dispatch("loader/hide");

            this.toast.success(this.$t("regions.create_success"));
            console.log("edit item", resp);
            this.$store.dispatch("regions/fetchRegions").then(() => {
              this.$emit("formClose");
            });
          })
          .catch((err) => {
            this.toast.error(this.$t("regions.create_error"));
            this.errors = err;
          });
      }
    },
  },
};
</script>
