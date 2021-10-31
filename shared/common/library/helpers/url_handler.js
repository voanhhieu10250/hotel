export function createUrl(urlData) {
  const keys = Object.keys(urlData);
  let search = '?';
  keys.forEach(key => {
    if (urlData[key] !== null && urlData[key] !== '') {
      search += `${key}=${urlData[key]}&`;
    }
  });
  return search.substring(0, search.length - 1);
}

export function getUrl(location) {
  // const location = location;
  const data =
    process.browser && location.search
      ? location.search.slice(location.search.indexOf('?') + 1).split('&')
      : [];
  const urlData = {};
  data.forEach(data => {
    try {
      data = data.split('=');
      const dataVal = decodeURIComponent(data[1]);
      urlData[data[0]] = dataVal;
    } catch (e) {}
  });
  return urlData;
}
export function setStateToUrl(state) {
  let urlData = {};
  for (const key in state) {
    if (state.hasOwnProperty(key)) {
      switch (key) {
        case 'date_range':
          let data = Object.values(state[key]);
          if (data[0] === null && data[1] === null) {
            data = '';
          }
          urlData[key] = data && data.length ? data.join() : null;
          break;
        case 'amenities':
          // console.log(state[key]);

          if (state[key] && state[key].length) {
            state[key].forEach(value => {
              if (value === 'wifi_availabitity')
                urlData['wifiAvailability'] = true;
              if (value === 'parking_availabitity')
                urlData['parkingAvailability'] = true;
              if (value === 'pool_availabitity')
                urlData['poolAvailability'] = true;
              if (value === 'air_condition') urlData['airCondition'] = true;
              if (value === 'extra_bed_facility')
                urlData['extraBedFacility'] = true;
            });
          }
          break;
        case 'room':
          if (state[key]) {
            urlData['bedRoom'] = state[key] ? state[key] : 0;
          } else {
            urlData['bedRoom'] = '';
          }
          break;
        case 'guest':
          if (state[key]) {
            urlData['guestRoom'] = state[key] ? state[key] : 0;
          } else {
            urlData['guestRoom'] = '';
          }
          break;
        case 'property':
          urlData[key] =
            state[key] && state[key].length ? state[key].join() : null;
          break;
        case 'price':
          if (state[key] && state[key].length) {
            urlData['lowPrice'] = state[key][0];
            urlData['highPrice'] = state[key][1];
          } else urlData[key] = null;
          break;
        case 'location':
          // if (state[key] && state[key].lat) {
          //   urlData[`${key}_lat`] = state[key].lat;
          // }
          // if (state[key] && state[key].lng) {
          //   urlData[`${key}_lng`] = state[key].lng;
          // }
          if (state[key] && state[key].city) {
            urlData['city'] = state[key].city;
          }
          break;
        case 'reset':
          urlData = state[key];
          break;

        default:
          urlData[key] = state[key];
          break;
      }
    }
  }
  return createUrl(urlData);
}

export function getStateFromUrl(location) {
  const urlData = getUrl(location);
  const state = {};
  for (const key in urlData) {
    if (urlData.hasOwnProperty(key)) {
      switch (key) {
        // case 'text':
        //   state[key] =
        //     urlData[key] && urlData[key] !== 'null' ? urlData[key] : '';
        //   break;
        // case 'categories':
        //   state[key] =
        //     urlData[key] && urlData[key] !== 'null'
        //       ? urlData[key].split(',')
        //       : [];
        //   break;

        case 'date_range':
          const date = urlData[key] ? urlData[key] : null;
          if (date) {
            let splitDate = date ? date.split(',') : null;
            let setStartDate = splitDate ? splitDate[0] : null;
            let setEndDate = splitDate ? splitDate[1] : null;
            state[key] = date
              ? { setStartDate: setStartDate, setEndDate: setEndDate }
              : null;
          }
          break;

        case 'amenities':
          state[key] =
            urlData[key] && urlData[key] !== 'null'
              ? urlData[key].split(',')
              : [];
          break;

        case 'room':
          if (urlData[key]) {
            state[key] = urlData[key] ? urlData[key] : 0;
          } else {
            state[key] = '';
          }

          break;

        case 'guest':
          if (urlData[key]) {
            state[key] = urlData[key] ? urlData[key] : 0;
          } else {
            state[key] = '';
          }
          break;

        case 'property':
          state[key] =
            urlData[key] && urlData[key] !== 'null'
              ? urlData[key].split(',')
              : [];
          break;

        case 'price':
          const defaultPrice = {
            min: 0,
            max: 100,
            defaultMin: 0,
            defaultMax: 100,
          };
          const price = urlData[key] ? urlData[key].split(',') : defaultPrice;
          if (price) {
            let min, max;
            min = price ? Number(price[0]) : 0;
            max = price ? Number(price[1]) : 100;
            if (min > 0 || max < 100) {
              state[key] = {
                min: min,
                max: max,
                defaultMin: 0,
                defaultMax: 100,
              };
            } else {
              state[key] = '';
            }
          }
          break;

        // case 'radius':
        //   state[key] = Number(urlData[key]);
        //   break;

        // case 'condition':
        //   state[key] = urlData[key] && urlData[key] == 'true' ? true : false;
        //   break;

        // case 'isNegotiable':
        //   state[key] = urlData[key] && urlData[key] == 'true' ? true : false;
        //   break;

        case 'location_lat':
          if (urlData['location_lat']) {
            state['location'] = {};
            state['location']['lat'] = Number(urlData[key]);
          } else {
            state['location'] = null;
          }
          break;

        case 'location_lng':
          if (urlData[key]) {
            state['location']['lng'] = Number(urlData[key]);
          }
          break;

        // case 'sorting_field':
        //   if (urlData[key]) {
        //     state['sorting'] = {};
        //     state['sorting']['field'] = urlData[key];
        //   }
        //   break;

        // case 'sorting_type':
        //   if (urlData[key]) {
        //     state['sorting']['type'] = urlData[key];
        //   }
        //   break;

        case 'page':
          if (urlData[key]) {
            state['page'] = Number(urlData[key]);
          }
          break;

        case 'limit':
          if (urlData[key]) {
            state['limit'] = Number(urlData[key]);
          }
          break;

        default:
          state[key] = urlData[key];
          break;
      }
    }
  }
  return state;
}
