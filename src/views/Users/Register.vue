<template>
  <v-container v-if="!token" class="fill-height" fluid>
    <v-row align="center" class="justify-center">
      <v-col cols="12" md="4" class="align-center">
        <v-form
          ref="form"
          v-model="valid"
          :lazy-validation="lazy"
          @submit.prevent="register"
        >
          <v-row>
            <v-col>
              <h2 class="text-h2 text-center">{{ $t("users.register") }}</h2>
              <p class="text-center">
                {{ $t("users.register_process_explain") }}
              </p>
              <p class="text-center">
                <router-link to="login" class="call">{{
                  $t("users.login")
                }}</router-link>
              </p>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12"
              ><v-text-field
                id="nickname"
                v-model="nickname"
                :label="$t('users.username')"
                name="name"
                prepend-icon="mdi-account"
                type="text"
                :rules="nameRules"
                required
                variant="outlined"
              ></v-text-field
            ></v-col>
            <v-col cols="12">
              <v-text-field
                v-model="email"
                :label="$t('users.email')"
                name="email"
                prepend-icon="mdi-email"
                type="text"
                :rules="emailRules"
                required
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                id="password"
                v-model="password"
                :label="$t('users.password')"
                name="password"
                prepend-icon="mdi-lock"
                type="password"
                :rules="passwordRules"
                required
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                id="password-confirm"
                v-model="password_confirmation"
                :label="$t('users.password_confirm')"
                name="password-confirm"
                prepend-icon="mdi-lock"
                type="password"
                :rules="passwordConfirmationRules"
                required
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="8" offset="2">
              <v-checkbox
                v-model="accept_terms"
                :rules="acceptTermsRules"
                required
              >
                <template #label>
                  <router-link to="dsgvo"
                    >{{ $t("users.accept_terms") }}
                  </router-link>
                </template>
              </v-checkbox>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <div class="text-center">
                <v-btn type="submit" class="action">{{
                  $t("users.signup")
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
  name: "RegisterView",
  data: () => ({
    valid: false,
    lazy: false,
    nickname: "",
    nameRules: [
      (v) => !!v || "Name is required",
      (v) => (v && v.length <= 30) || "Name must be less than 30 characters",
    ],

    email: "",
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    password: "",
    passwordRules: [
      (v) => !!v || "Password is required",
      (v) => (v && v.length >= 6) || "Password must be more than 6 characters",
    ],
    password_confirmation: "",
    accept_terms: false,
    acceptTermsRules: [(v) => !!v || "You must agree to continue!"],
    token: false,
  }),
  computed: {
    passwordConfirmationRules() {
      return [
        () =>
          this.password === this.password_confirmation ||
          "Passwords must match",
        (v) => !!v || "Confirmation password is required",
      ];
    },
  },
  created() {
    // if (this.$route.params.token && this.$route.params.email) {
    //   this.token = this.$route.params.token;
    //   this.email = this.$route.params.email;
    //   this.confirmToken();
    // }
  },
  methods: {
    // TODO: ggf. if we want confirmation without backend urls
    // confirmToken() {
    //   let data = { confirmation_token: this.token, email: this.email };
    //   console.log("send confirmation", data);
    //   this.$store
    //     .dispatch("auth/confirm", data)
    //     .then((resp) => {
    //       console.log("response confirmation", resp);
    //       this.$toast.success(
    //         "You have been succesfully registered. Please login in to your account."
    //       );
    //       this.$router.push("/login");
    //     })
    //     .catch((err) => {
    //       console.log("conformError", err);
    //       var message =
    //         "Error during registration. Please contact the support.";
    //       this.$toast.error(message);
    //     });
    // },
    register: function () {
      if (this.$refs.form.validate()) {
        let data = {
          nickname: this.nickname,
          email: this.email,
          password: this.password,
          password_confirmation: this.password_confirmation,
          accept_terms: this.accept_terms,
          confirm_success_url: import.meta.env.VITE_API_URL + "/login",
        };
        let toast = useToast();
        this.$store
          .dispatch("auth/register", data)
          .then(() => {
            toast.success(
              "You have been registered. Check your email for a verification link."
            );
            this.$router.push("/");
          })
          .catch((err) => {
            console.log(err);
            var message =
              err || "Error during registration. Please contact the support.";
            toast.error(message);
          });
      }
    },
  },
};
</script>
