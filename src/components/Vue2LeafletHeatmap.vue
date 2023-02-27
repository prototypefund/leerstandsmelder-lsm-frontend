<template>
  <div style="display: none">
    <slot v-if="ready"></slot>
  </div>
</template>

<script>
// const L = window.L;

// import { findRealParent, propsBinder } from "@vue-leaflet/vue-leaflet";
// import { DomEvent } from "leaflet";
// import "leaflet.heat";

// const props = {
//   latLng: {
//     type: Array,
//     default: () => [],
//     custom: false,
//   },
//   minOpacity: {
//     type: Number,
//     custom: true,
//     default: 0.05,
//   },
//   maxZoom: {
//     type: Number,
//     custom: true,
//     default: 18,
//   },
//   radius: {
//     type: Number,
//     custom: true,
//     default: 25,
//   },
//   blur: {
//     type: Number,
//     custom: true,
//     default: 15,
//   },
//   max: {
//     type: Number,
//     custom: true,
//     default: 1.0,
//   },
//   visible: {
//     type: Boolean,
//     custom: true,
//     default: true,
//   },
//   gradient: {
//     type: Object,
//     custom: true,
//     default() {
//       return {
//         0.4: "#FFDA47",
//         0.6: "#EFB300",
//         0.7: "#E58A40",
//         0.8: "#C3423F",
//         1.0: "#8E1D1D",
//       };
//     },
//   },
// };
// export default {
//   name: "LHeatmap",
//   props,
//   data() {
//     return {
//       ready: false,
//       mapObject: {},
//       options: {},
//     };
//   },
//   watch: {
//     latLng(newVal, oldVal) {
//       if (newVal != oldVal) {
//         this.mapObject.setLatLngs(newVal);
//       }
//     },
//   },
//   mounted() {
//     const options = {};
//     if (this.minOpacity) {
//       options.minOpacity = this.minOpacity;
//     }
//     if (this.maxZoom) {
//       options.maxZoom = this.maxZoom;
//     }
//     if (this.radius) {
//       options.radius = this.radius;
//     }
//     if (this.blur) {
//       options.blur = this.blur;
//     }
//     if (this.max) {
//       options.max = this.max;
//     }
//     if (this.gradient) {
//       options.gradient = this.gradient;
//     }

//     this.mapObject = L.heatLayer(this.latLng, options);
//     DomEvent.on(this.mapObject, this.$listeners);
//     propsBinder(this, this.mapObject, props);
//     this.ready = true;
//     this.parentContainer = findRealParent(this.$parent);
//     this.parentContainer.addLayer(this, !this.visible);
//   },
//   beforeDestroy() {
//     this.parentContainer.removeLayer(this);
//   },
//   methods: {
//     setMinOpacity(newVal) {
//       this.mapObject.setOptions({ minOpacity: newVal });
//     },
//     setMaxZoom(newVal) {
//       this.mapObject.setOptions({ maxZoom: newVal });
//     },
//     setRadius(newVal) {
//       this.mapObject.setOptions({ radius: newVal });
//     },
//     setBlur(newVal) {
//       this.mapObject.setOptions({ blur: newVal });
//     },
//     setMax(newVal) {
//       this.mapObject.setOptions({ max: newVal });
//     },
//     setGradient(newVal) {
//       this.mapObject.setOptions({ gradient: newVal });
//     },
//     setVisible(newVal, oldVal) {
//       if (newVal === oldVal) return;
//       if (newVal) {
//         this.parentContainer.addLayer(this);
//       } else {
//         this.parentContainer.removeLayer(this);
//       }
//     },
//     addLatLng(value) {
//       this.mapObject.addLatLng(value);
//     },
//     setLatLngs(value) {
//       this.mapObject.setLatLngs(value);
//     },
//     redraw() {
//       this.mapObject.redraw();
//     },
//   },
// };
</script>

<style></style>
