<template>
  <v-snackbar v-model="snackbar">
    {{ text }}
    <template #action="{ attrs }">
      <v-btn text v-bind="attrs" @click="snackbar = false"> Close </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  name: "Snackbar",
  data: () => ({
    snackbar: false,
    text: "You opened the snackbar!",
  }),
};
</script>
