<template>
  <v-carousel
    cycle
    height="auto"
    show-arrows="hover"
    hide-delimiters
    interval="10000"
    :class="$vuetify.display.smAndDown ? 'sm-carousel' : 'lg-carousel'"
  >
    <v-carousel-item>
      <v-sheet height="100%" tile color="transparent ">
        <div class="d-flex fill-height justify-center align-center">
          <Eigentum />
        </div>
      </v-sheet>
    </v-carousel-item>
    <v-carousel-item>
      <v-sheet height="100%" tile color="transparent ">
        <div class="d-flex fill-height justify-center align-center">
          <FlexibleZwischennutzung />
        </div>
      </v-sheet>
    </v-carousel-item>
    <v-carousel-item>
      <v-sheet height="100%" tile color="transparent ">
        <div class="d-flex fill-height justify-center align-center">
          <LeerstandzuWohnraum />
        </div>
      </v-sheet>
    </v-carousel-item>
    <v-carousel-item>
      <v-sheet height="100%" tile color="transparent ">
        <div class="d-flex fill-height justify-center align-center">
          <Leerstand />
        </div>
      </v-sheet>
    </v-carousel-item>
    <v-carousel-item>
      <v-sheet height="100%" tile color="transparent ">
        <div class="d-flex fill-height justify-center align-center">
          <SpekulativerLeerstand />
        </div>
      </v-sheet>
    </v-carousel-item>
    <v-carousel-item>
      <v-sheet height="100%" tile color="transparent ">
        <div class="d-flex fill-height justify-center align-center">
          <Transparenz />
        </div>
      </v-sheet>
    </v-carousel-item>
    <v-carousel-item>
      <v-sheet height="100%" tile color="transparent ">
        <div class="d-flex fill-height justify-center align-center">
          <WieViel />
        </div>
      </v-sheet>
    </v-carousel-item>
  </v-carousel>
</template>
<script>
import Eigentum from "@/assets/content/slogans/SVG/Eigentum.svg?component";
import FlexibleZwischennutzung from "@/assets/content/slogans/SVG/Flexible-Zwischennutzung.svg?component";
import LeerstandzuWohnraum from "@/assets/content/slogans/SVG/Leerstand-zu-Wohnraum.svg?component";
import Leerstand from "@/assets/content/slogans/SVG/Leerstand.svg?component";
import SpekulativerLeerstand from "@/assets/content/slogans/SVG/Spekulativer-Leerstand.svg?component";
import Transparenz from "@/assets/content/slogans/SVG/Transparenz.svg?component";
import WieViel from "@/assets/content/slogans/SVG/Wie-viel.svg?component";

export default {
  name: "HomeView",
  components: {
    Eigentum,
    FlexibleZwischennutzung,
    LeerstandzuWohnraum,
    Leerstand,
    SpekulativerLeerstand,
    Transparenz,
    WieViel,
  },
};
</script>
