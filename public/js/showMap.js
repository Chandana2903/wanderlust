document.addEventListener("DOMContentLoaded", function () {
  if (typeof L === "undefined") return;

  const mapDiv = document.getElementById("map");
  if (!mapDiv) return;

  const geometry = JSON.parse(mapDiv.dataset.geometry || "null");
  const locationText = mapDiv.dataset.location || "";

  if (!geometry || !geometry.coordinates) return;

  const lng = geometry.coordinates[0];
  const lat = geometry.coordinates[1];

  const map = L.map("map").setView([lat, lng], 14);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap",
  }).addTo(map);

  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(locationText)
    .openPopup();
});
