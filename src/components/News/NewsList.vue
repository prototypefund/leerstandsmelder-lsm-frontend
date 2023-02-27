<template>
  <v-card>
    <v-toolbar>
      <v-toolbar-title class="text-h4">
        {{ $t("news.new_articles") }}
      </v-toolbar-title>
    </v-toolbar>

    <v-list v-if="news">
      <div v-for="item in news" :key="item.id">
        <v-list-item
          append-icon="mdi-chevron-right"
          class="pa-2"
          @click="newsSelect(item)"
        >
          <div class="d-inline-block">
            <div class="text-grey">
              <v-icon icon="mdi-home-remove-outline"></v-icon
              >{{ $filters.formatDate(item.created_at, "DD.MM.YYYY") }}
            </div>

            <h6 class="text-h6 overflow-x-hidden">
              {{ $filters.subString(item.title, 35) }}
            </h6>
            <div></div>
          </div>
        </v-list-item>
        <v-divider
          color="surface-invert"
          thickness="2px"
          class="ma-2"
          style="opacity: 0.6"
        ></v-divider>
      </div>
    </v-list>
  </v-card>
</template>
<script setup>
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { computed } from "vue";

const store = useStore();
const router = useRouter();
const news = computed(() => store.getters["news/news"]);
const emit = defineEmits(["selectNews"]);

const newsSelect = (data) => {
  store.dispatch("news/select", data.id).then(() => {
    router
      .push({
        name: "article",
        params: { slug: data.slug },
        replace: true,
      })
      .then((result) => {
        // console.log("router result", result);
      })
      .catch((err) => {
        console.log("router catch", err);
      });
  });
};
</script>
