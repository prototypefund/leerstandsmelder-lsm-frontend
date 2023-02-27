<template>
  <v-container>
    <v-row no-gutters>
      <v-col sm="12" md="8">
        <NewsDetail />
      </v-col>
      <v-col cols="12" md="4">
        <v-container>
          <v-row>
            <v-col cols="12">
              <NewsList @select-news="newsSelect" />
            </v-col>
          </v-row>
        </v-container>
        <v-container>
          <v-row>
            <v-col cols="12" md="8">
              <v-btn stacked size="x-large" variant="outlined" to="form"
                >Leerstand melden ></v-btn
              >
            </v-col>
            <v-col cols="12" md="4">
              <v-btn
                v-if="isLoggedIn"
                size="x-large"
                stacked
                prepend-icon="mdi-account"
                variant="outlined"
                to="profile"
                >Profil</v-btn
              >
              <v-btn
                v-if="!isLoggedIn"
                size="x-large"
                stacked
                prepend-icon="mdi-account-plus"
                variant="outlined"
                to="register"
                >Anmelden</v-btn
              >
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import NewsList from "@/components/News/NewsList.vue";
import NewsDetail from "@/components/News/NewsDetail.vue";

export default {
  name: "NewsView",
  components: {
    NewsList,
    NewsDetail,
  },
  data() {
    return {};
  },
  created() {},
  computed: {},

  methods: {},
};
</script>
