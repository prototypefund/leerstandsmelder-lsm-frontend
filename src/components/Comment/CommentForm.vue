<template>
  <v-card class="comment-form">
    <v-container>
      <h3 class="text-h3">{{ $t("comments.new_comment") }}</h3>
      <p>{{ $t("comments.new_comment_explain") }}</p>

      <v-form v-if="isLoggedIn" @submit.prevent="onPublish(comment.id)">
        <v-row>
          <v-col cols="12" md="12">
            <FormControlButtonList
              :value="comment.status"
              field="status"
              :single="true"
              :options="optionStatus"
              @select-value="setFieldValue"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col sm="12">
            {{ $t("comments.additional_information") }}
            <v-textarea
              ref="text"
              v-model="comment.text"
              class="mt-6 rounded-sm"
              :label="$t('comments.comment_text')"
              variant="outlined"
            ></v-textarea>
          </v-col>
          <v-col cols="4" offset="4" class="text-center">
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

            <v-file-input
              v-model="selectedFiles"
              accept="image/*"
              multiple
              show-size
              :label="$t('actions.choose_image')"
              prepend-icon="mdi-camera-plus-outline"
            ></v-file-input>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="text-end">
            <v-btn
              append-icon="mdi-send"
              variant="text"
              @click.prevent="onPublish(comment.id)"
              >{{ $t("actions.submit") }}</v-btn
            >
          </v-col>
        </v-row>
      </v-form>
      <v-banner v-if="!isLoggedIn">
        {{ $t("comments.new_comment_login") }}
        <router-link to="login" class="call">{{
          $t("users.login")
        }}</router-link>
      </v-banner>
    </v-container>
  </v-card>
</template>

<script>
import { mapState, mapGetters } from "vuex";

import { useToast } from "vue-toastification";

import { useFieldArray } from "@/composables/useFieldArray";
import { useOptions } from "@/composables/useOptions";
import { useRules } from "../../composables/useRules";

import FormControlButtonList from "@/components/FormElements/FormControlButtonList.vue";

export default {
  name: "CommentForm",
  components: { FormControlButtonList },
  props: {},

  data() {
    return {
      errors: {},
      rules: useRules(),
      optionStatus: useOptions().optionStatus,
      selectedFiles: [],
      progressInfos: [],
      message: "",
      overlay: false,
      toast: null,
    };
  },
  computed: {
    ...mapState("place", ["place"]),
    ...mapState("comment", ["comment"]),
    ...mapGetters("region", ["map_status_entries"]),
    ...mapGetters("auth", ["isLoggedIn"]),
  },
  created() {
    this.toast = useToast();
    this.optionStatus = this.map_status_entries;
  },
  watch: {},
  methods: {
    setFieldValue(val, fieldName, single) {
      const { comment } = useFieldArray({
        value: val,
        fieldName: fieldName,
        object: this.comment,
        single: single,
      });
      this.comment = comment;
    },
    onPublish(slug) {
      this.formHasErrors = false;
      // ["title", "text"].forEach((f) => {
      //   if (!this.comment[f]) this.formHasErrors = true;

      //   this.$refs[f].validate(true);
      // });
      // if (this.formHasErrors) {
      //   return;
      // }
      this.$store.dispatch("loader/show");

      this.$store
        .dispatch("comment/createComment")
        .then((data) => {
          // upload images
          this.uploadFiles();
          this.$store.dispatch("loader/hide");
          this.$store.dispatch("place/fetchPlace", this.place.id);
          this.toast.success("Comment has been created");
          this.$store.dispatch("comment/reset");
        })
        .catch((response) => {
          this.$store.dispatch("loader/hide");
          console.log("errors", response);
          if (response.data) {
            if (response.data.errors) {
              this.errors = response.data.errors;
            } else {
              for (const [field, error] of Object.entries(response.data)) {
                console.log(`${field}: ${error}`);
                this.errors = this.$t("comments." + field) + ": " + error;
              }
            }
          }
          this.toast.error("Comment error: " + this.errors);
        });
    },

    uploadFiles() {
      this.message = "";
      if (this.selectedFiles.length) {
        for (let i = 0; i < this.selectedFiles.length; i++) {
          this.upload(i, this.selectedFiles[i]);
        }
      }
    },

    upload(idx, file) {
      this.progressInfos[idx] = { percentage: 0, fileName: file.name };
      this.$store
        .dispatch("comment/upload", {
          file: file,
          event: function (event) {
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
                this.selectedFiles = [];
                return true;
              }, 3000);
            });
          }
        })
        .catch((error) => {
          this.progressInfos[idx].percentage = 0;
          this.message = "Could not upload the file:" + file.name;
          this.toast.error("Image error: " + error);
        });
    },
  },
};
</script>
<style></style>
