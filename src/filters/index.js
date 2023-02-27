import moment from "moment";
import store from "@/store";

const filters = {
  formatDate(value, format = "YYYY-MM-DD") {
    let lang = store.getters["site/language"];
    if (lang == "de" && format == "YYYY-MM-DD") {
      format = "DD.MM.YYYY";
    }
    if (value) {
      return moment(String(value)).format(format);
    }
  },
  subString(string, length = "5") {
    let len = string.length;
    return string.substring(0, length) + (len > length ? "..." : "");
  },
  camelCaseToSnakeCase(string) {
    var returni = string
      .split(/\.?(?=[A-Z])/)
      .join("_")
      .toLowerCase();
    return returni;
  },
  locationField(string) {
    var ccField = this.$filters.camelCaseToSnakeCase(string);
    var translated =
      (ccField.substring(0, 9) == "locations" ? "" : "locations.") + ccField;
    return translated;
  },
};
export default filters;
