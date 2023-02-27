<template>
  <v-container>
    <v-form @submit.prevent="onPublish(value)">
      <v-row>
        <v-col sm="12" md="12">
          <ListErrors :errors="errors" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-img
            :src="value.image_url || value.url"
            :alt="value.title"
            width="200px"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-text-field
            ref="title"
            v-model="value.title"
            :label="$t('image.title')"
            :counter="80"
            :rules="[rules.required]"
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col md="24">
          <div class="mb-5"></div>
          <v-btn color="primary" @click.prevent="onPublish(value)">
            <v-icon icon="mdi-content-save"></v-icon
            >{{ $t("actions.submit") }}</v-btn
          >

          <v-btn text @click.prevent="close()">
            <v-icon icon="mdi-close"></v-icon>
            {{ $t("actions.abort") }}</v-btn
          >
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import { mapState } from "vuex";

import ListErrors from "@/components/ListErrors.vue";
import { useToast } from "vue-toastification";

export default {
  name: "ImageForm",
  components: {
    ListErrors,
  },
  props: {
    modelValue: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  emits: ["update:modelValue", "formClose", "handleDelete"],
  data() {
    return {
      errors: {},
      rules: {
        required: (value) => !!value || "Required.",
        counter: (value) => value.length <= 20 || "Max 20 characters",
      },
    };
  },
  computed: {
    value: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit("update:modelValue", value);
      },
    },
  },
  methods: {
    onPublish(image) {
      let toast = useToast();
      this.$store.dispatch("loader/show");

      this.$store
        .dispatch("place/updateImage", image)
        .then(({ data }) => {
          this.$store.dispatch("loader/hide");

          toast.success(this.$t("messages.images.save_success"));
          this.$store.dispatch("place/fetchImages");
          this.$emit("formClose");
        })
        .catch(({ response }) => {
          this.$store.dispatch("loader/hide");
          this.errors = response.data;
          toast.error("Image error: " + this.errors);
        });
    },
    close() {
      this.$emit("formClose");
    },
  },
};
</script>
<style></style>
