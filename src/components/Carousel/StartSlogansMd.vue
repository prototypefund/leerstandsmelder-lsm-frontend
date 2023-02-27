<template>
  <v-carousel
    cycle
    show-arrows="hover"
    hide-delimiters
    height="400"
    interval="10000"
  >
    <v-carousel-item>
      <v-sheet height="100%" tile color="transparent ">
        <div class="d-flex fill-height justify-center align-center">
          <transparenz-md />
        </div>
      </v-sheet>
    </v-carousel-item>
    <v-carousel-item>
      <v-sheet height="100%" tile color="transparent ">
        <div class="d-flex fill-height justify-center align-center">
          <doof-md />
        </div>
      </v-sheet>
    </v-carousel-item>
    <v-carousel-item>
      <v-sheet height="100%" tile color="transparent ">
        <div class="d-flex fill-height justify-center align-center">
          <stillstand-md />
        </div>
      </v-sheet>
    </v-carousel-item>
    <v-carousel-item>
      <v-sheet height="100%" tile color="transparent ">
        <div class="d-flex fill-height justify-center align-center">
          <eigentum-md />
        </div>
      </v-sheet>
    </v-carousel-item>
  </v-carousel>
</template>
<script>
import TransparenzMd from "@/assets/content/parols/transparenz.md";
import EigentumMd from "@/assets/content/parols/eigentum.md";
import StillstandMd from "@/assets/content/parols/stillstand.md";
import DoofMd from "@/assets/content/parols/voll_doof.md";

export default {
  name: "HomeView",
  components: {
    TransparenzMd,
    EigentumMd,
    StillstandMd,
    DoofMd,
  },
};
</script>
