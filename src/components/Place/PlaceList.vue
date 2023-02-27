<template>
  <v-card>
    <v-toolbar>
      <v-toolbar-title class="text-h4">
        {{ $t("locations.new_locations") }}
      </v-toolbar-title>
    </v-toolbar>

    <v-list>
      <div
        v-for="item in filteredLocations.slice(0, 5)"
        :key="item.properties.id"
      >
        <v-list-item
          append-icon="mdi-chevron-right"
          class="pa-2"
          @click="$emit('selectPlace', item)"
          ><v-avatar
            v-if="item.properties.image_url == ''"
            color="surface-variant"
            class="ma-1"
          ></v-avatar>
          <v-avatar
            v-if="item.properties.image_url != ''"
            color="surface-variant"
            class="ma-5"
          >
            <v-img
              :src="item.properties.image_url"
              :alt="item.properties.title"
            ></v-img
          ></v-avatar>
          <div class="d-inline-block">
            <p class="text-caption break-words">
              {{
                $filters.formatDate(item.properties.created_at, "DD.MM.YYYY")
              }}
            </p>
            <h6 class="text-h6 overflow-x-hidden">
              {{ $filters.subString(item.properties.title, 13) }}
            </h6>
            <div>
              <div class="text-grey">
                <v-icon icon="mdi-home-remove"></v-icon
                >{{
                  $filters.formatDate(item.properties.created_at, "DD.MM.YYYY")
                }}
                <v-icon icon="mdi-account-remove"></v-icon>Öffentli.
              </div>
            </div>
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

import { computed } from "vue";

const store = useStore();

const filteredLocations = computed(
  () => store.getters["locations/filteredLocations"]
);

//const status = computed(() => store.getters["place/status"]);

const emit = defineEmits(["selectPlace"]);
</script>
