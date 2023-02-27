<template>
  <v-container class="pr-0 pl-0 pt-0">
    <v-row>
      <v-col cols="12" md="8" class="pr-1">
        <v-btn
          stacked
          class="call_action"
          color="primary"
          size="x-large"
          variant="outlined"
          to="form"
          >{{ $t("locations.create_new") }} ></v-btn
        >
      </v-col>
      <v-col cols="12" md="4" class="pl-1">
        <v-btn
          v-if="isLoggedIn"
          size="x-large"
          stacked
          color="surface-invert"
          prepend-icon="mdi-account"
          variant="outlined"
          to="profile"
          >{{ $t("users.profile") }}</v-btn
        >
        <v-btn
          v-if="!isLoggedIn"
          size="x-large"
          stacked
          color="surface-invert"
          prepend-icon="mdi-account-plus"
          variant="outlined"
          to="register"
          >{{ $t("users.register_process") }}</v-btn
        >
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  name: "ActionButtons",
  props: {},
  emits: [],

  data() {
    return {};
  },
  computed: {
    ...mapGetters("auth", ["isLoggedIn"]),
  },
  methods: {},
};
</script>
