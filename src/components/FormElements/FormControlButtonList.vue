<template>
  <div class="form-button-list">
    <div
      v-for="option in options"
      :key="option.id"
      class="mb-2 mr-2 text-xs-center d-inline-block"
    >
      <v-btn
        :variant="checkStyle(option.value)"
        size="large"
        :class="{ selected: value === option.value }"
        @click="selectValue(option.value)"
        >{{ $t(option.title) }}</v-btn
      >
    </div>
  </div>
</template>
<script>
export default {
  name: "FormControlButtonList",
  props: {
    value: {
      type: String,
      default() {
        return "";
      },
    },
    field: {
      type: String,
      default: "",
    },
    options: {
      type: Array,
      default() {
        return [];
      },
    },
    single: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["select-value"],
  data() {
    return {};
  },
  methods: {
    selectValue: function (value) {
      this.$emit("select-value", value, this.field, this.single);
    },
    checkStyle: function (opt_val) {
      console.log("check", this.value, opt_val);
      if (
        this.value == opt_val ||
        (Array.isArray(this.value) && this.value.includes(opt_val))
      ) {
        return "tonal";
      } else {
        return "outlined";
      }
    },
  },
};
</script>
<style scoped lang="scss">
.form-button-list {
  .v-btn {
    color: var(--v-theme-surface) !important;
    text-transform: none;
  }
}
</style>
