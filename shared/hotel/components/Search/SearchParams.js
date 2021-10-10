// default data for filter elements
export const priceInit = {
  0: '$0',
  100: '$100',
};

export const calenderItem = {
  separator: '-',
  format: 'MM-DD-YYYY',
  locale: 'en',
};

export const getAmenities = {
  id: 1,
  name: 'Amenities',
  identifier: 'amenities',
  options: [
    { label: 'Wi-Fi Availability', value: 'wifi_availabitity' },
    { label: 'Parking Availability', value: 'parking_availabitity' },
    { label: 'Pool Availability', value: 'pool_availabitity' },
    { label: 'Air Conditioning', value: 'air_condition' },
    { label: 'Extra Bed Facility', value: 'extra_bed_facility' },
  ],
};

export const getPropertyType = {
  id: 2,
  name: 'Property Type',
  identifier: 'property-type',
  options: [
    { label: 'Villa', value: 'villa' },
    { label: 'Hotel', value: 'hotel' },
    { label: 'Resort', value: 'resort' },
    { label: 'Cottage', value: 'cottage' },
    { label: 'Duplex', value: 'duplex' },
    { label: 'Landscape', value: 'landscape' },
  ],
};
