const axios = require("axios");

module.exports = async function geocode(place) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`;

  const res = await axios.get(url, {
    headers: {
      "User-Agent": "wanderlust-app"
    }
  });

  if (!res.data.length) {
    throw new Error("Location not found");
  }

  return {
    lat: parseFloat(res.data[0].lat),
    lng: parseFloat(res.data[0].lon),
  };
};
