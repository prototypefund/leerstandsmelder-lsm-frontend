<template>
  <v-container class="fill-height" fluid>
    <v-row class="justify-center">
      <v-col cols="12" md="4" class="align-center">
        <v-form
          ref="form"
          v-model="valid"
          :lazy-validation="lazy"
          @submit.prevent="request"
        >
          <v-row>
            <v-col>
              <h2 class="text-h2 text-center">{{ $t("users.forgot") }}</h2>
              <p class="text-center">{{ $t("users.forgot_enter_email") }}</p>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="email"
                :label="$t('users.enter_email')"
                name="login"
                prepend-icon="mdi-email"
                type="text"
                :rules="emailRules"
                variant="outlined"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <div class="text-center">
                <v-btn type="submit" class="action">{{
                  $t("users.request_password")
                }}</v-btn>
              </div>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useToast } from "vue-toastification";

export default {
  data() {
    return {
      valid: false,
      lazy: false,
      email: "",
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
    };
  },
  methods: {
    async request() {
      if (this.$refs.form.validate()) {
        let email = { email: this.email };
        this.$store.dispatch("loader/show");
        let toast = useToast();
        await this.$store
          .dispatch("users/newPassword", email)
          .then((data) => {
            this.$store.dispatch("loader/hide");
            toast.success(
              "Password request received. An email will be send to you."
            );
            console.log("response", data);
          })
          .catch((err) => {
            var message = "An error occured. Please contact the support team.";
            console.log("catch", err);
            switch (err.response.statusCode) {
              case 401:
                message = "E-Mail not verift. Please contact the support team.";
                break;
              default:
                message = "An error occured. Please contact the support team.";
            }
            toast.error(message);
          });
      }
    },
  },
};
</script>
