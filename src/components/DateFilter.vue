<template>
  <v-card>
    <v-card-title>
      <h2 class="text-h2">Filter</h2>
    </v-card-title>
    <v-card-content v-if="regionData">
      <v-container>
        <v-row>
          <v-col cols="12">
            <h3 class="text-h3">Legende</h3>
          </v-col>
          <v-col cols="2">
            <v-radio-group v-model="filterField">
              <template v-slot:label>
                <div>Sortierung nach Building type</div>
              </template>
              <v-radio value="building_type">
                <template v-slot:label>
                  <div>
                    {{ $t("locations.building_type") }}
                  </div>
                </template>
              </v-radio>
            </v-radio-group>
          </v-col>
          <v-col cols="10">
            <FormControlButtonList
              :value="filterField.building_type"
              field="building_type"
              :options="optionBuildingType"
              @select-value="setFieldValue"
            />
          </v-col>
          <v-col cols="2">
            <v-radio-group v-model="filterField">
              <v-radio value="owner">
                <template v-slot:label>
                  <div>
                    {{ $t("locations.owner") }}
                  </div>
                </template>
              </v-radio>
            </v-radio-group>
          </v-col>
          <v-col cols="10">
            <FormControlButtonList
              :value="filterField"
              field="building_owner"
              :options="optionOwner"
              @select-value="setFieldValue"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <h3 class="text-h3">Date range</h3>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              v-model="UiStartDate"
              label="Start date"
              prepend-icon="mdi-calendar-account"
              type="date"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              v-model="UiEndDate"
              label="End date"
              prepend-icon="mdi-calendar-account"
              type="date"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-list>
              <v-list-item two-line>
                <v-list-item-title>
                  <v-list-item-title> Datumsfeld </v-list-item-title>
                  <v-list-item-subtitle>
                    <v-radio-group v-model="UiDateField">
                      <v-radio
                        v-for="n in availableDateFields"
                        :key="n"
                        :label="`Field: ${n}`"
                        :value="n"
                      ></v-radio>
                    </v-radio-group>
                  </v-list-item-subtitle>
                </v-list-item-title>
              </v-list-item>
              <!--v-list-item two-line>
                <v-list-item-title>
                  <v-list-item-title>Meldung aktiv? </v-list-item-title>
                  <v-list-item-subtitle>
                    <v-switch
                      v-model="hiddenFieldSet"
                      label="Versteckte Leerstände anzeigen"
                    ></v-switch>
                  </v-list-item-subtitle>
                </v-list-item-title>
              </v-list-item-->
            </v-list>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-range-slider
              v-model="rangeDate"
              :hint="rangeHint"
              :max="maxDate"
              :min="minDate"
            ></v-range-slider>
          </v-col>
        </v-row>
      </v-container>
    </v-card-content>
  </v-card>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import moment from "moment";
import grouper from "@/utils/grouper.js";

import FormControlButtonList from "@/components/FormElements/FormControlButtonList.vue";

import { useOptions } from "@/composables/useOptions";
import { useFieldArray } from "@/composables/useFieldArray";

const countOccurrences = (arr, val) =>
  arr.reduce((a, v) => (v === val ? a + 1 : a), 0);

export default {
  name: "DateFilter",
  components: { FormControlButtonList },
  props: {},
  data() {
    return {
      optionBuildingType: useOptions().optionBuildingType,
      optionOwner: useOptions().optionOwner,
      filterField: { building_type: ["industrial"] },
      menuStartDate: false,
      menuEndDate: false,
      defaultStartDate: "2010-01",

      defaultEndDate:
        new Date().getFullYear() + "-" + (new Date().getMonth() + 1),

      availableDateFields: ["created_at", "updated_at"],

      hiddenFieldSet: false,
      circle: {
        radius: 4,
        color: "transparent",
        fillColor: "rgba(242, 71, 38, 1)",
        fillOpacity: 0.61,
      },
    };
  },
  created() {
    this.$store.dispatch("locations/setDateFilter", {
      startDate: moment(this.regionData.created_at).format("YYYY-MM"),
      endDate: this.defaultEndDate,
      dateField: this.dateField,
    });
  },
  watch: {
    regionData: function (newRegion, oldRegion) {
      this.$store.dispatch("locations/setDateFilter", {
        startDate: moment(this.regionData.created_at).format("YYYY-MM"),
        endDate: this.defaultEndDate,
        dateField: this.dateField,
      });
    },
    filterField: function (newFilter) {
      console.log("filterField", newFilter);
    },
  },
  computed: {
    ...mapState("locations", [
      "locations",
      "startDate",
      "endDate",
      "dateField",
      "filterField",
      "filterValue",
    ]),
    ...mapGetters("locations", ["filteredLocations"]),
    ...mapState("region", ["regionId", "regionData"]),

    maxDate: function () {
      return moment(this.defaultEndDate).unix();
    },
    minDate: function () {
      return moment(this.defaultStartDate).unix();
    },
    rangeHint: function () {
      return "Locations in Range: " + this.filteredLocations.length;
    },
    UiStartDate: {
      get() {
        let formated = moment(this.startDate).format("YYYY-MM-DD");
        return formated;
      },
      set(value) {
        this.$store.dispatch("locations/setStartDate", value);
      },
    },
    UiEndDate: {
      get() {
        let formated = moment(this.endDate).format("YYYY-MM-DD");
        return formated;
      },
      set(value) {
        this.$store.dispatch("locations/setEndDate", value);
      },
    },

    UiDateField: {
      get() {
        return this.dateField;
      },
      set(field) {
        this.$store.dispatch("locations/setDateField", field);
      },
    },

    rangeDate: {
      get() {
        var range = [
          moment(this.startDate).unix(),
          moment(this.endDate).unix(),
        ];
        return range;
      },
      set(newDate) {
        let startDate = moment.unix(newDate[0]).format("YYYY-MM");
        let endDate = moment.unix(newDate[1]).format("YYYY-MM");
        let payload = {
          startDate: startDate,
          endDate: endDate,
          dateField: this.dateField,
        };
        this.$store.dispatch("locations/setDateFilter", payload);
      },
    },

    fieldCount: function (field_name, field_value) {
      return countOccurrences(this.filteredLocations, field_name, field_value);
    },
  },
  methods: {
    setFieldValue(val, fieldName, single) {
      this.filterField.value = useFieldArray({
        value: val,
        fieldName: fieldName,
        object: this.filterField,
        single: single,
      });
      console.log("fitttt", this.filterField);
      //this.filterField = [...filter, ...this.filterField];
    },
  },
};
</script>
