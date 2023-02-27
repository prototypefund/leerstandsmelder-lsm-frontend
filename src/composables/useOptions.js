export function useOptions() {
  return {
    optionBuildingType: [
      {
        title: "locations.building_type_options.residential",
        value: "residential",
      },
      {
        title: "locations.building_type_options.commercial",
        value: "commercial",
      },
      {
        title: "locations.building_type_options.industrial",
        value: "industrial",
      },
      {
        title: "locations.building_type_options.historical",
        value: "historical",
      },
      {
        title: "locations.building_type_options.public_work",
        value: "public_work",
      },
      {
        title: "locations.building_type_options.other",
        value: "other",
      },
    ],
    optionBuildingUsage: [
      {
        title: "locations.usage_options.living",
        value: "living",
      },
      {
        title: "locations.usage_options.business",
        value: "business",
      },
      {
        title: "locations.usage_options.other",
        value: "other",
      },
    ],
    optionBuildingPart: [
      {
        title: "locations.part_options.front",
        value: "front",
      },
      {
        title: "locations.part_options.back",
        value: "back",
      },
      {
        title: "locations.part_options.side",
        value: "side",
      },
    ],
    optionOwner: [
      {
        title: "locations.owner_options.private",
        value: "private",
      },
      {
        title: "locations.owner_options.business",
        value: "business",
      },
      {
        title: "locations.owner_options.public",
        value: "public",
      },
      {
        title: "locations.owner_options.city",
        value: "city",
      },
    ],

    // Annotations - status
    optionStatus: [
      {
        title: "comments.status_options.vacant",
        value: "vacant",
      },
      {
        title: "comments.status_options.demolished",
        value: "demolished",
      },
      {
        title: "comments.status_options.reconstruction",
        value: "reconstruction",
      },
      {
        title: "comments.status_options.rent",
        value: "rent",
      },
      {
        title: "comments.status_options.temporary",
        value: "temporary",
      },
      {
        title: "comments.status_options.construction",
        value: "construction",
      },
    ],
  };
}
