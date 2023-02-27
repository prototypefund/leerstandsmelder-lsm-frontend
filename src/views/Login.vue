<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" class="justify-center">
      <v-col cols="12" md="4">
        <v-form @submit.stop.prevent="login('local')">
          <v-row>
            <v-col>
              <h2 class="text-h2 text-center">{{ $t("users.login") }}</h2>
              <p class="text-center">
                {{ $t("users.login_process_explain") }}
              </p>
              <p class="text-center">
                <router-link to="register" class="call">{{
                  $t("users.register")
                }}</router-link>
              </p>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12"
              ><v-text-field
                v-model="email"
                :label="$t('users.username')"
                name="login"
                prepend-icon="mdi-email"
                type="text"
                variant="outlined"
                clearable
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                id="password"
                v-model="password"
                :label="$t('users.password')"
                name="password"
                prepend-icon="mdi-lock"
                variant="outlined"
                type="password"
                clearable
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <p class="text-center">
                <router-link to="forgot-password">{{
                  $t("users.forgot")
                }}</router-link>
              </p>
              <div class="text-center">
                <v-btn type="submit" class="action">{{
                  $t("users.login")
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
      email: "",
      password: "",
    };
  },
  methods: {
    login: function (type) {
      let email = this.email;
      let password = this.password;
      const toast = useToast();
      this.$store
        .dispatch("auth/login", { email, password, type })
        .then((response) => {
          toast.success(this.$t("successes.user.login"));
          this.$router.push(this.$route.query.redirect || "/");
        })
        .catch((err) => {
          console.log("login error", err);
          var error = err.data.errors[0];
          console.log("login error", error);
          toast.error(error);
        });
    },
  },
};
</script>
