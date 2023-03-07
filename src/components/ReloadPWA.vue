<template>
  <div
    v-if="offlineReady || needRefresh"
    class="flex flex-wrap md:flex-nowrap bg-pink-900 text-white text-sm px-6 py-2 justify-between align-middle"
    role="alert"
  >
    <div class="message mt-1">
      <span v-if="offlineReady"> App ready to work offline </span>
      <span v-else>
        New content available, click on reload button to update.
      </span>
    </div>
    <div class="buttons flex align-middle mt-2 md:mt-0">
      <button
        v-if="needRefresh"
        class="w-full px-4 py-2 text-sm text-white leading-none transition-colors duration-150 bg-pink-900 border border-white rounded sm:w-auto active:bg-pink-600 hover:bg-pink-700 focus:outline-none focus:shadow-outline-purple mr-4"
        @click="updateServiceWorker()"
      >
        Reload
      </button>
      <button
        class="w-full px-4 py-2 text-sm text-white leading-none transition-colors duration-150 bg-pink-900 border border-white rounded sm:w-auto active:bg-pink-600 hover:bg-pink-700 focus:outline-none focus:shadow-outline-purple"
        @click="close"
      >
        Close
      </button>
    </div>
  </div>
  <div
    v-if="!offlineReady"
    class="flex flex-wrap md:flex-nowrap bg-pink-900 text-white text-sm px-6 py-2 justify-between align-middle"
    role="alert"
  >
    Not Offline ready
  </div>
  <div
    v-if="!needRefresh"
    class="flex flex-wrap md:flex-nowrap bg-pink-900 text-white text-sm px-6 py-2 justify-between align-middle"
    role="alert"
  >
    No refresh
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRegisterSW } from "virtual:pwa-register/vue";
const { updateServiceWorker } = useRegisterSW();

export default defineComponent({
  name: "ReloadPWA",
  setup() {
    const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW();
    const close = async () => {
      offlineReady.value = false;
      needRefresh.value = false;
    };
    return { offlineReady, needRefresh, updateServiceWorker, close };
  },
  methods: {},
});
</script>
