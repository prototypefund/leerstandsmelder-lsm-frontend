<template>
  <v-card v-if="article" class="ma-5">
    <v-card-title
      ><h2 class="text-h3">{{ article.title }}</h2></v-card-title
    >
    <v-card-text> {{ article.body }}</v-card-text>
  </v-card>
</template>
<script setup>
import { useStore } from "vuex";
import { computed } from "vue";

const store = useStore();
const article = computed(() => store.getters["news/article"]);

const emit = defineEmits(["selectNews"]);
</script>
