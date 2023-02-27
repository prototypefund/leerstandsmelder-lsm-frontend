<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card class="pl-10 pr-10 pb-10 pt-5 elevation-5">
          <!--VueShowdown :markdown="mdContent" /-->
        </v-card>
      </v-col></v-row
    ></v-container
  >
</template>
<script>
import { mapState } from "vuex";

//import errorMessageDE from "@/assets/md/404_de.md";
//import errorMessageEN from "@/assets/md/404_en.md";

export default {
  name: "SiteView",

  components: {},
  data() {
    return {
      mdContent: "",
    };
  },
  computed: {
    ...mapState("site", ["language"]),
  },
  created() {
    //if (this.isLoggedIn())
    this.init();
    this.$watch(
      () => this.$route.params,
      (toParams, previousParams) => {
        // react to route changes...
        this.loadMdContent();
      }
    );
  },
  methods: {
    async init() {
      if (this.$route.params.slug) {
        console.log("URL", this.language);
        this.loadMdContent();
      }
    },
    loadMdContent() {
      // eslint-disable
      import(`@/assets/md/${this.$route.params.slug}_${this.language}.md`)
        .then((module) => {
          console.log("import", module.default);
          this.mdContent = module.default;
        })
        .catch((error) => {
          if (this.language == "de") {
            this.mdContent = ""; //errorMessageDE;
          } else {
            this.mdContent = ""; //errorMessageEN;
          }
        });
    },
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
