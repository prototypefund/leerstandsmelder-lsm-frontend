<template>
  <v-container>
    <v-row>
      <v-col offset-md="2" cols="12" md="8">
        <h1 class="text-h1">Styleguide</h1>
        <div>
          <h2 class="text-h2">Typography</h2>
          <v-card v-for="[name, cls] in classes" :key="name" class="my-4">
            <div :class="[cls, 'pa-2']">{{ name }}</div>
            <div class="text-caption pa-2 bg-grey-lighten-4">
              <div class="text-grey">Class</div>
              <div class="font-weight-medium">{{ cls }}</div>
            </div>
          </v-card>
        </div>
        <div>
          <h2 class="text-h2">Typography</h2>
          <v-card>
            <v-card-text>
              <p>
                PLAIN PARAGRAPH: Lorem ipsum dolor sit amet, consectetur
                adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo
                consequat.
              </p>
              <p class="text-body-1">
                text-body-1: Lorem ipsum dolor sit amet, consectetur adipiscing
                elit, sed do eiusmod tempor incididunt ut labore et dolore magna
                aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <p class="text-body-2">
                text-body-2: Lorem ipsum dolor sit amet, consectetur adipiscing
                elit, sed do eiusmod tempor incididunt ut labore et dolore magna
                aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <h1>Test H1</h1>
            </v-card-text>
          </v-card>

          <h2 class="text-h2">Button</h2>
          <v-card>
            <v-card-text>
              <v-btn>Button "default"</v-btn>
              <v-btn variant="outlined">Button "outlined"</v-btn>
              <v-btn size="x-large">Button "x-large"</v-btn>
              <v-btn size="x-large" class="call">Button "Call"</v-btn>
            </v-card-text>
          </v-card>
        </div>
      </v-col>
    </v-row></v-container
  >
</template>
<script>
export default {
  data: () => ({
    classes: [
      ["Heading 1", "text-h1"],
      ["Heading 2", "text-h2"],
      ["Heading 3", "text-h3"],
      ["Heading 4", "text-h4"],
      ["Heading 5", "text-h5"],
      ["Heading 6", "text-h6"],
      ["Subtitle 1", "text-subtitle-1"],
      ["Subtitle 2", "text-subtitle-2"],
      ["Body 1", "text-body-1"],
      ["Body 2", "text-body-2"],
      ["Button", "text-button"],
      ["Caption", "text-caption"],
      ["Overline", "text-overline"],
    ],
  }),
};
</script>
