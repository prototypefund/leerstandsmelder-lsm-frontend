<template>
  <v-row v-if="comments && comments.length > 0">
    <v-col cols="12">
      <v-container class="d-flex justify-start">
        <!--h3 class="text-h3">{{ $t("comments.all") }}</h3 -->

        <v-timeline align-top dense side="end" class="comments">
          <v-timeline-item
            v-for="(comment, index) in comments"
            :key="'comment-' + index"
            small
          >
            <v-alert :title="getStatus(comment)">
              <div class="font-weight-normal">
                <strong>{{
                  $filters.formatDate(comment.created_at, "DD.MM.YYYY")
                }}</strong>
                <span v-if="comment.user"> @ {{ comment.user.nickname }}</span>
              </div>
              <div class="text-body-1">
                <b>{{ comment.title }}</b>
                <span v-html="comment.text"></span>
              </div>
              <v-list>
                <v-list-item
                  v-for="limage in comment.images"
                  :key="limage.id"
                  rounded="xl"
                  style="margin-bottom: 15px"
                >
                  <v-list-item-title>
                    <v-row>
                      <v-col cols="6"
                        ><v-img
                          :src="limage.image_url || limage.url"
                          :alt="limage.name"
                          width="200px"
                        />
                        <p>{{ limage.title }}</p></v-col
                      >
                    </v-row>
                  </v-list-item-title>
                  <v-divider></v-divider>
                </v-list-item>
              </v-list>
            </v-alert>
          </v-timeline-item>
        </v-timeline>
      </v-container>
    </v-col>
  </v-row>
</template>
<script>
import { mapState, mapGetters } from "vuex";

export default {
  name: "CommentTimeline",

  data() {
    return {};
  },
  computed: {
    ...mapState("place", ["place", "comments"]),
    ...mapGetters("region", ["map_status_entries"]),
  },
  methods: {
    getColorFromStatus(comment) {
      switch (comment.status) {
        case "temporary":
          return "primary-lighten-2";
        case "vacant":
          return "primary";
        case "demolished":
          return "primary-darken-2";
        case "reconstruction":
          return "primary-darken-1";
        case "rent":
          return "primary-lighten-1";
        case "construction":
          return "primary-darken-3";
        case "":
          return "pink";
      }
    },
    getStatus(comment) {
      if (comment.status != "" && this.map_status_entries.length > 0) {
        let label_element = this.map_status_entries.filter(
          (x) => x.value == comment.status
        );
        let label = "";
        if (label_element[0] && label_element[0].title) {
          label = label_element[0].title;
        }

        if (label != "" && label != undefined) {
          return label;
        } else {
          return this.$t("comments.status_options." + comment.status);
        }
      } else {
        return "";
      }
    },
  },
};
</script>
