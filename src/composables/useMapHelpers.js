import store from "@/store";

export function useMapHelpers() {
  const geoapify_key =
    import.meta.env.VITE_GEOAPIFY_KEY || "xxx_geoapify_key_missing_xxx";
  const maptiler_key =
    import.meta.env.VITE_MAPTILER_KEY || "xxx_maptiler_key_missing_xxx";
  const maptiler_map_light =
    import.meta.env.VITE_MAPTILER_MAP_LIGHT ||
    "xxx_maptiler_map_light_missing_xxx";
  const maptiler_map_dark =
    import.meta.env.VITE_MAPTILER_MAP_DARK ||
    "xxx_maptiler_map_dark_missing_xxx";

  function mapStyleLink() {
    let theme = store.getters["site/themeColor"];
    let maptiler_map = "";
    if (theme == "lsmDarkTheme") {
      maptiler_map = maptiler_map_dark;
    } else {
      maptiler_map = maptiler_map_light;
    }
    return (
      "https://api.maptiler.com/maps/" +
      maptiler_map +
      "/style.json?key=" +
      maptiler_key
    );
  }

  return {
    geoapify_key,
    maptiler_key,
    maptiler_map_light,
    maptiler_map_dark,
    mapStyleLink,
  };
}
