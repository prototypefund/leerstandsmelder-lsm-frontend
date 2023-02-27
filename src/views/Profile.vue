<!-- src/views/Profile.vue -->

<template>
  <div v-if="user">
    <v-container class="fill-height" fluid>
      <v-row>
        <v-col cols="12">
          <h1 class="text-h1">Hallo {{ user.nickname }}</h1>
          <v-divider></v-divider>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" lg="8" md="8">
          <v-form>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="user.email"
                  label="Email"
                  name="email"
                  prepend-icon="mdi-email"
                  type="text"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="user.nickname"
                  label="Name"
                  name="name"
                  prepend-icon="mdi-account"
                  type="text"
                  variant="outlined"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-switch
                  v-model="user.message_me"
                  flat
                  :label="$t('users.message_me')"
                ></v-switch>
              </v-col>
              <v-col cols="12">
                <v-switch
                  v-model="user.notify"
                  flat
                  :label="$t('users.notify')"
                ></v-switch>
              </v-col>
              <v-col cols="12">
                <v-switch
                  v-model="user.share_email"
                  flat
                  :label="$t('users.share_email')"
                ></v-switch>
              </v-col>
            </v-row>
            <v-row justify="end">
              <v-col class="d-flex justify-end"
                ><v-btn
                  color="primary"
                  size="large"
                  @click.stop.prevent="updateUser()"
                  >Save</v-btn
                >
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-btn color="primary" @click.stop.prevent="clearStorage()"
                  >Clear cache</v-btn
                >
              </v-col>
              <div class="flex-grow-1"></div>
              <v-col>
                <v-btn color @click.stop.prevent="logout()">Logout</v-btn>
              </v-col>
              <v-col>
                <v-btn color to="reset-password">{{
                  $t("users.pwd_change")
                }}</v-btn></v-col
              >
            </v-row>
          </v-form>
        </v-col>
        <v-col cols="12" md="4">
          <h4 class="text-h4">{{ $t("locations.my_locations") }}</h4>

          <v-card v-for="place in myPlaces" :key="place.id">
            <v-card-title class="text-h5">{{ place.title }}</v-card-title>
            <v-card-actions>
              <v-btn
                variant="outlined"
                :to="{ name: 'place-detail', params: { slug: place.id } }"
              >
                <v-icon icon="mdi-eye"></v-icon>
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                variant="outlined"
                :to="{ name: 'form-detail', params: { slug: place.id } }"
              >
                {{ $t("locations.edit") }}
              </v-btn></v-card-actions
            >
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { RepositoryFactory } from "@/utils/repositories/repositoryFactory";
const UserRepository = RepositoryFactory.get("users");
import { useToast } from "vue-toastification";
export default {
  name: "ProfileView",
  data() {
    return {
      toast: null,
    };
  },
  computed: {
    ...mapState("region", ["regionId", "regionData"]),
    ...mapState("regions", ["regions", "active"]),
    ...mapState("locations", ["locations"]),
    ...mapState("users", ["user"]),
    ...mapGetters("users", ["myPlaces"]),
  },
  created() {
    this.fetch();
    this.toast = useToast();
  },
  methods: {
    async fetch() {
      this.$store.dispatch("loader/show");
      await this.$store.dispatch("users/fetchUser").then((user) => {
        this.$store.dispatch("loader/hide");
        console.log("user", user);
        this.toast.success("User has been loaded");
      });
      await this.$store.dispatch("users/fetchPlaces").then((places) => {
        this.$store.dispatch("loader/hide");
        console.log("userPlaces", this.myPlaces);
        this.toast.success("Places have been loaded");
      });
    },
    async updateUser() {
      this.$store.dispatch("loader/show");
      await this.$store.dispatch("users/updateUser").then((user) => {
        this.$store.dispatch("loader/hide");
        this.toast.success("User has been updated");
        console.log("user", user);
      });
    },
    clearStorage() {
      localStorage.removeItem("lsm");
    },
    clearLocations() {
      this.$store.dispatch("locations/clear").then((response) => {
        console.log("locations-cleared", response);
        //this.$router.push("/");
      });
    },
    clearRegion() {
      this.$store.dispatch("region/clear").then((response) => {
        console.log("region-cleared", response);
        this.$root.activeRegion = {};
        this.$router.push("/");
      });
    },
    clearRegions() {
      this.$store.dispatch("regions/clear").then((response) => {
        console.log("regions-cleared", response);
        this.$root.activeRegion = {};
        window.location = "/";
      });
    },
    logout() {
      this.$store.dispatch("auth/logout").then(() => {
        this.$router.push("/login");
      });
    },
  },
};
</script>
