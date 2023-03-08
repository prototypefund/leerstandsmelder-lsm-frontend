<template>
  <v-dialog
    v-if="needRefresh"
    v-model="dialog"
    location="bottom center"
    class="start-prompt"
  >
    <v-container>
      <v-row class="align-right justify-center">
        <v-col cols="12" md="6" sm="8" xs="12" class="modal-background">
          <v-card>
            <v-card-text>
              <div class="text-h5">
                <span v-if="needRefresh">
                  New content available, click on reload button to update.
                </span>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn
                v-if="needRefresh"
                class="action-primary"
                color="primary"
                variant="outlined"
                @click="UpdateAndClose()"
              >
                Reload
              </v-btn>
              <v-btn color="primary" variant="outlined" @click="close">
                Close
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-dialog>
  <!-- v-icon v-if="offlineReady" icon="mdi-information"></v-icon-->
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRegisterSW } from "virtual:pwa-register/vue";
const { updateServiceWorker } = useRegisterSW();

export default defineComponent({
  name: "ReloadPWA",
  setup() {
    const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW();
    const close = async () => {
      offlineReady.value = false;
      needRefresh.value = false;
      dialog.value = false;
    };
    const UpdateAndClose = async () => {
      updateServiceWorker();
      offlineReady.value = false;
      needRefresh.value = false;
      dialog.value = false;
    };
    const dialog = ref(offlineReady || needRefresh);
    return {
      offlineReady,
      needRefresh,
      updateServiceWorker,
      close,
      dialog,
      UpdateAndClose,
    };
  },
  methods: {},
});
</script>
