<template>
  <v-container class="fill-height" fluid>
    <v-row class="justify-center">
      <v-col cols="12" md="4" class="align-center">
        <v-form
          v-if="token"
          ref="form"
          v-model="valid"
          :lazy-validation="lazy"
          @submit.prevent="request"
        >
          <v-row>
            <v-col>
              <h2 class="text-h2 text-center">{{ $t("users.pwd_change") }}</h2>
              <p class="text-center">{{ $t("users.reset") }}</p>
              <p class="text-center">{{ $t("users.enter_new_password") }}</p>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                id="password"
                v-model="password"
                :label="$t('users.password')"
                name="password"
                prepend-icon="mdi-lock"
                type="password"
                :rules="passwordRules"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                id="password_confirmation"
                v-model="password_confirmation"
                :label="$t('users.password_confirmation')"
                name="password_confirmation"
                prepend-icon="mdi-lock"
                type="password"
                :rules="passwordRules"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <div class="text-center">
                <v-btn type="submit" class="action">{{
                  $t("users.password_submit")
                }}</v-btn>
              </div>
            </v-col>
          </v-row>
        </v-form>

        <v-card v-if="!token" class="elevation-12">
          <v-card-text><h2 class="text-h2">Nothing here</h2></v-card-text>
        </v-card>
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
      password: "",
      password_confirmation: "",
      passwordRules: [(v) => !!v || "Password is required"],
      token: "",
    };
  },
  created() {
    this.token =
      this.$route.query.reset_password_token ||
      this.$store.getters["auth/getToken"];

    //this.validateToken();

    localStorage.setItem("reset_password_token", this.token);
    localStorage.setItem("uid", "admin@domain.org");
    localStorage.setItem("client", "admin@domain.org");
    console.log("mountes", this.token);
  },
  methods: {
    async request() {
      if (this.$refs.form.validate()) {
        let password = {
          password: this.password,
          password_confirmation: this.password_confirmation,
          "access-token": this.token,
          token: this.token,
          reset_password_token: this.token,
        };
        let toast = useToast();
        this.$store.dispatch("loader/show");
        await this.$store
          .dispatch("users/updatePassword", password)
          .then((data) => {
            this.$store.dispatch("loader/hide");
            toast.success("Password has been updated.");
            setTimeout(
              function () {
                this.$router.push("/login");
              }.bind(this),
              2000
            );
          })
          .catch((err) => {
            var message = "An error occured. Please contact the support team.";
            console.log("catch", err);
            toast.error(message);
          });
      }
    },
  },
};
</script>
