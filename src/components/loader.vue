<template>
  <div style="z-index: 13121312">
    <v-overlay
      :value="visible"
      opacity="0.8"
      style="z-index: 15555"
    ></v-overlay>
    <v-progress-linear
      :active="visible"
      :indeterminate="visible"
      absolute
      top
      color="primary accent-8"
      height="6"
    ></v-progress-linear>
  </div>
</template>

<script>
export default {
  name: "Loader",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
