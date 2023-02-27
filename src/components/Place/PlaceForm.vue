<template>
  <v-form class="place-form" @submit.prevent="onPublish(place.id)">
    <v-container>
      <v-row>
        <v-col cols="12" md="4">
          <span class="small">{{ place.id }}</span>
          <h2 class="text-h2">
            {{ $t("locations.location") }}
          </h2>
          <h1 class="text-h1" style="word-wrap: break-word">
            {{ place.title }}
          </h1>
          <br />
          <br />
          <br />
          <v-text-field
            v-model="place.title"
            :label="$t('locations.title')"
            :counter="80"
            required
          ></v-text-field>

          <v-switch
            v-model="place.published"
            :label="$t('locations.published')"
          />
          <div v-if="isAdmin">
            <v-switch
              v-model="place.featured"
              :label="$t('locations.featured')"
            />
          </div>

          <v-text-field
            v-model="place.vacant_since"
            :label="$t('locations.empty_for')"
            prepend-icon="mdi-calendar-account"
            type="date"
          ></v-text-field>

          <v-row no-gutters>
            <v-col>
              <div class="mb-5"></div>
              <v-btn
                color="primary"
                @click.prevent="onPublish(place.id)"
                class="full"
              >
                <v-icon icon="mdi-home"></v-icon>
                {{ $t("actions.submit") }}</v-btn
              >
              <v-btn
                v-if="displayForm"
                color="primary"
                @click.prevent="onPreview(place.id)"
                variant="outlined"
              >
                <v-icon icon="mdi-eye"></v-icon>
                {{ $t("actions.preview") }}</v-btn
              >
              <v-btn
                v-if="!displayForm"
                color="primary"
                variant="outlined"
                @click.prevent="onPreview(place.id)"
              >
                <v-icon icon="mdi-eye-off"></v-icon>
                {{ $t("actions.preview") }}</v-btn
              >

              <v-btn variant="outlined" @click="reset()">{{
                $t("actions.abort")
              }}</v-btn>
            </v-col>
          </v-row>
        </v-col>

        <v-col
          v-if="displayForm"
          cols="12"
          md="4"
          transition="scroll-y-transition"
          leave-absolute="true"
        >
          <PlaceSearch edit-place="true" />
          <v-expansion-panels
            v-model="panel_additional"
            size="small"
            class="panel-small"
          >
            <v-expansion-panel>
              <v-expansion-panel-title
                ><v-icon icon="mdi-map-marker"> </v-icon
              ></v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-row>
                  <v-col cols="12">
                    <v-switch
                      v-model="place.sensitive"
                      label="Sensitive place"
                    ></v-switch>
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col cols="1"> <v-icon>mdi-map-marker</v-icon></v-col>
                  <v-col cols="10" offset="1">
                    <v-row>
                      <v-col cols="8" md="6">
                        <v-text-field
                          v-model="place.lat"
                          label="Latitude"
                          :counter="12"
                          variant="outlined"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="8" md="6">
                        <v-text-field
                          v-model="place.lon"
                          label="Longitued"
                          :counter="12"
                          variant="outlined"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="8">
                    <v-text-field
                      v-model="place.road"
                      label="Strasse"
                      :counter="80"
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="place.house_number"
                      label="Nr."
                      :counter="80"
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="place.zip"
                      label="Plz"
                      :counter="8"
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="8">
                    <v-text-field
                      v-model="place.city"
                      label="Stadt"
                      :counter="80"
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="place.borough"
                      label="Bezirk"
                      :counter="80"
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="place.suburb"
                      label="Stadtteil"
                      :counter="80"
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="8">
                    <v-text-field
                      v-model="place.country"
                      label="Land"
                      :counter="80"
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="place.country_code"
                      label="Land"
                      :counter="2"
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>

        <v-col
          v-if="displayForm"
          cols="12"
          md="4"
          transition="scroll-y-transition"
          leave-absolute="true"
        >
          <v-expansion-panels class="mb-6">
            <v-expansion-panel>
              <v-expansion-panel-title>
                <v-icon icon="mdi-home-plus"> </v-icon>
                {{ $t("locations.building") }}
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div class="text-h6">{{ $t("locations.building_type") }}</div>
                {{ $t("locations.building_type_explain") }}
                <FormControlButtonList
                  :value="place.building_type"
                  field="building_type"
                  :options="optionBuildingType"
                  @select-value="setFieldValue"
                />
                <hr />
                <div class="text-h6">{{ $t("locations.degree") }}</div>
                <v-radio-group v-model="place.degree" inline>
                  <v-radio
                    :label="$t('locations.degree_options.partial')"
                    value="partial"
                  ></v-radio>
                  <v-radio
                    :label="$t('locations.degree_options.complete')"
                    value="complete"
                  ></v-radio>
                </v-radio-group>
                <hr />
                <div class="text-h6">{{ $t("locations.usage") }}</div>
                {{ $t("locations.usage_explain") }}
                <FormControlButtonList
                  :value="place.building_usage"
                  field="building_usage"
                  :options="optionBuildingUsage"
                  @select-value="setFieldValue"
                />
                <hr />
                <div class="text-h6">{{ $t("locations.part") }}</div>
                {{ $t("locations.part_explain") }}
                <FormControlButtonList
                  :value="place.building_part"
                  field="building_part"
                  :options="optionBuildingPart"
                  @select-value="setFieldValue"
                />
                <hr />
                <div class="text-h6">{{ $t("locations.epoche") }}</div>
                {{ $t("locations.epoche_explain") }}
                <v-radio-group
                  v-model="place.building_epoche"
                  inline
                  variant="outlined"
                >
                  <v-radio
                    :label="$t('locations.epoche_options.old')"
                    value="old"
                    variant="outlined"
                  ></v-radio>
                  <v-radio
                    :label="$t('locations.epoche_options.new')"
                    value="new"
                  ></v-radio>
                </v-radio-group>
                <hr />
                <div class="text-h6">{{ $t("locations.floors") }}</div>
                {{ $t("locations.floors_explain") }}
                <v-select
                  v-model="place.building_floors"
                  :label="$t('locations.floors_label')"
                  :items="[1, 2, 3, 4, 5, 6]"
                  variant="outlined"
                  style="width: 230px"
                ></v-select>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>

          <v-expansion-panels class="mb-6">
            <v-expansion-panel>
              <v-expansion-panel-title>
                <v-icon icon="mdi-home-account"> </v-icon>
                {{ $t("locations.owner") }}
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                {{ $t("locations.owner_explain") }}
                <FormControlButtonList
                  :value="place.owner"
                  field="owner"
                  :single="true"
                  :options="optionOwner"
                  @select-value="setFieldValue"
                />
                <div v-if="isNotPrivat">
                  <hr />
                  <div class="text-h6">{{ $t("locations.owner_company") }}</div>
                  {{ $t("locations.owner_company_explain") }}
                  <v-textarea
                    v-model="place.owner_company"
                    class="mt-6 rounded-sm"
                    :label="$t('locations.owner_company_label')"
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
                <v-icon icon="mdi-text"> </v-icon>
                {{ $t("locations.description") }}
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                {{ $t("locations.description_explain") }}
                <v-textarea
                  v-model="place.text"
                  class="mt-6 rounded-sm"
                  :label="$t('locations.description')"
                  :counter="210"
                  variant="outlined"
                ></v-textarea>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
          <v-expansion-panels class="mb-6">
            <v-expansion-panel>
              <v-expansion-panel-title>
                <v-icon icon="mdi-image"> </v-icon>
                {{ $t("locations.images") }}
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                {{ $t("actions.choose_images") }}
                <v-divider></v-divider>
                <div v-if="progressInfos">
                  <div
                    v-for="(progressInfo, index) in progressInfos"
                    :key="index"
                    class="mb-2"
                  >
                    <span>{{ progressInfo.fileName }}</span>
                    <v-progress-linear
                      v-model="progressInfo.percentage"
                      color="light-blue"
                      height="25"
                      reactive
                    >
                      <strong>{{ progressInfo.percentage }} %</strong>
                    </v-progress-linear>
                  </div>
                </div>

                <v-row no-gutters justify="center" align="center">
                  <v-col cols="8">
                    <v-file-input
                      v-model="selectedFiles"
                      accept="image/*"
                      multiple
                      show-size
                      :label="$t('actions.choose_image')"
                    ></v-file-input>
                  </v-col>

                  <v-col cols="4" class="pl-2">
                    <v-btn variant="outlined" @click="uploadFiles">
                      <v-icon right dark>mdi-cloud-upload</v-icon>
                      {{ $t("actions.upload") }}
                    </v-btn>
                  </v-col>
                </v-row>

                <v-alert
                  v-if="message"
                  border="left"
                  color="teal"
                  outlined
                  class="multi-line"
                >
                  {{ message }}
                </v-alert>

                <div v-if="images && images.length > 0" class="mx-auto">
                  <v-list>
                    <v-list-subheader
                      >List of Images: {{ images.length }}</v-list-subheader
                    >

                    <v-list-item
                      v-for="limage in images"
                      :key="limage.id"
                      rounded="xl"
                      style="margin-bottom: 15px"
                    >
                      <v-list-item-title>
                        <v-row>
                          <v-col cols="6"
                            ><v-img
                              :src="limage.image_url || limage.url"
                              :alt="limage.name"
                              width="200px"
                            />
                            <p>{{ limage.title }}</p></v-col
                          >
                          <v-col cols="6"
                            ><v-btn class="mt-12" @click="editImage(limage)">
                              <v-icon icon="mdi-marker"></v-icon> </v-btn
                            ><v-btn
                              class="mt-12"
                              label="delete"
                              @click="deleteImage(limage)"
                            >
                              <v-icon icon="mdi-delete-empty"></v-icon> </v-btn
                          ></v-col>
                        </v-row>
                      </v-list-item-title>
                      <v-divider></v-divider>
                    </v-list-item>
                  </v-list>
                </div>
                <v-overlay
                  v-model="overlay"
                  contained
                  class="edit-dialog align-center justify-center"
                  rounded="xl"
                >
                  <v-btn
                    variant="outlined"
                    class="align-self-end justify-self-end"
                    @click="overlay = false"
                  >
                    <v-icon icon="mdi-close"></v-icon>
                  </v-btn>
                  <ImageForm
                    v-model="image"
                    @form-close="closeImageForm()"
                  ></ImageForm>
                </v-overlay>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
          <v-expansion-panels v-if="place.versions" class="mb-6">
            <v-expansion-panel>
              <v-expansion-panel-title>
                <v-icon icon="mdi-timeline-question"> </v-icon>
                {{ $t("locations.versions") }}
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                {{ $t("locations.versions_explain") }}
                <v-timeline align-top dense style="word-wrap: break-word">
                  <v-timeline-item
                    v-for="(version, index) in place.versions"
                    :key="'version-' + index"
                    color="red"
                    small
                  >
                    <div>
                      <div class="font-weight-normal">
                        <strong>{{
                          $filters.formatDate(
                            version.created_at,
                            "DD.MM.YYYY H:m:s"
                          )
                        }}</strong>
                        <span v-if="version.whodunnit"
                          >@ {{ version.whodunnit }}</span
                        >
                      </div>
                      <div>
                        <b>{{ version.event }}</b>
                        <v-expansion-panels
                          v-if="version.changeset"
                          class="mb-6"
                        >
                          <v-expansion-panel
                            v-for="(change, field, cindex) in version.changeset"
                            :key="'change-' + index + '-' + cindex"
                          >
                            <v-expansion-panel-title>
                              <v-icon color="error" icon="mdi-text"> </v-icon>
                              {{ field }}
                            </v-expansion-panel-title>
                            <v-expansion-panel-text
                              style="word-wrap: break-word"
                            >
                              <b style="word-wrap: break-word">{{
                                change[0]
                              }}</b>
                              >
                              <b style="word-wrap: break-word">{{
                                change[1]
                              }}</b>
                            </v-expansion-panel-text>
                          </v-expansion-panel>
                        </v-expansion-panels>
                      </div>
                    </div>
                  </v-timeline-item>
                </v-timeline>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
        <v-col
          v-if="!displayForm"
          cols="12"
          md="8"
          transition="scroll-y-transition"
          leave-absolute="true"
        >
          <PlaceDetail />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="4"> </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import PlaceSearch from "./PlaceSearch.vue";
import PlaceDetail from "./PlaceDetail.vue";
import ImageForm from "../Image/ImageForm.vue";
import { useToast } from "vue-toastification";

import { useFieldArray } from "@/composables/useFieldArray";
import { useOptions } from "@/composables/useOptions";

import FormControlButtonList from "@/components/FormElements/FormControlButtonList.vue";

export default {
  name: "PlaceForm",
  components: {
    PlaceSearch,
    PlaceDetail,
    FormControlButtonList,
    ImageForm,
  },
  props: {},
  emits: ["formUpdateAndClose", "formPreview", "updateRoute"],

  data() {
    return {
      tagInput: null,
      inProgress: false,
      errors: {},

      descriptionLimit: 60,
      panel_additional: [1],

      selectedFiles: undefined,
      progressInfos: [],
      message: "",
      overlay: false,

      updateList: 0, // increment to force update : poor mans reactivity // FIXME
      toast: null,
      displayForm: true,
      optionBuildingType: useOptions().optionBuildingType,
      optionBuildingUsage: useOptions().optionBuildingUsage,
      optionBuildingPart: useOptions().optionBuildingPart,
      optionOwner: useOptions().optionOwner,
    };
  },
  created() {
    this.toast = useToast();
  },
  mounted() {},
  computed: {
    ...mapState("region", ["regionId", "regionData", "map"]),
    ...mapState("regions", ["regions", "active"]),
    ...mapState("locations", ["locations"]),
    ...mapState("place", ["place", "status"]),
    ...mapGetters("place", ["images"]),
    ...mapGetters("auth", ["isLoggedIn", "isAdmin"]),

    isNotPrivat: function () {
      return this.place.owner != "private";
    },
  },
  watch: {},
  methods: {
    editImage(image) {
      this.overlay = true;
      this.image = image;
    },
    uploadFiles() {
      this.message = "";
      console.log("uploadFiles", this.selectedFiles);
      for (let i = 0; i < this.selectedFiles.length; i++) {
        this.upload(i, this.selectedFiles[i]);
      }
    },

    upload(idx, file) {
      this.progressInfos[idx] = { percentage: 0, fileName: file.name };
      console.log("upload", this.progressInfos);
      this.$store
        .dispatch("place/upload", {
          file: file,
          event: function (event) {
            console.log("progress", event);
            this.progressInfos[idx].percentage = Math.round(
              (100 * event.loaded) / event.total
            );
          }.bind(this),
        })
        .then((response) => {
          if (response.id) {
            this.$store.dispatch("place/fetchImages").then(() => {
              this.toast.success("Image has been uploaded");
              this.progressInfos[idx].percentage = 100;
              setTimeout(() => {
                this.progressInfos = [];
                this.updateList += 1;
                return true;
              }, 3000);
            });
          }
        })
        .catch((error) => {
          console.log("store upload catch", error);
          this.progressInfos[idx].percentage = 0;
          this.message = "Could not upload the file:" + file.name;
          this.toast.error("Image error: " + error);
        });
    },
    onPublish(slug) {
      let status = this.$store.getters["place/status"];

      let action =
        status == "loaded" ? "place/updatePlace" : "place/createPlace";
      console.log("onPub", status, this.status);

      this.$store.dispatch("loader/show");
      this.$store
        .dispatch(action)
        .then(({ data }) => {
          this.$store.dispatch("loader/hide");

          this.$emit("formUpdateAndClose");
          if (this.status == "loaded") {
            this.toast.success(this.$t("messages.locations.update_success"));
          } else {
            this.$emit("updateRoute");
            this.toast.success(this.$t("messages.locations.create_success"));
          }
        })
        .catch(({ response }) => {
          this.$store.dispatch("loader/hide");
          console.log("errors", response);
          if (response.data) {
            if (response.data.errors) {
              this.errors = response.data.errors;
            } else {
              for (const [field, error] of Object.entries(response.data)) {
                console.log(`${field}: ${error}`);
                this.errors = this.$t("locations." + field) + ": " + error;
              }

              // response.data.forEach((error) => {
              //   this.errors = error[0];
              // });
            }
          }

          this.toast.error("Place error: " + this.errors);
        });
    },
    onPreview(slug) {
      this.displayForm = !this.displayForm;
    },

    closeImageForm() {
      this.overlay = false;
    },

    async deleteImage(image) {
      try {
        this.$store.dispatch("place/deleteImage", image).then(({ data }) => {
          this.$store.dispatch("place/fetchImages");
          this.toast.success("Image has been deleted");
        });
      } catch (error) {
        this.toast.error("Image could not be deleted");
        console.log("error in delete", error);
      }
    },
    setFieldValue(val, fieldName, single) {
      const { place } = useFieldArray({
        value: val,
        fieldName: fieldName,
        object: this.place,
        single: single,
      });

      this.place = place;
    },

    reset() {
      console.log("TODO: reset function in componts/Place/PlaceForm");
    },
  },
};
</script>
<style>
/* #searchlist .v-menu__content.v-autocomplete__content {
  top: -30px !important;
} */

.panel-small {
  width: 150px;
}
.panel-small .v-expansion-panel .v-expansion-panel--active {
  width: 100%;
}
.edit-dialog .v-overlay__scrim {
  background-color: white;
  opacity: 1;
}
</style>
