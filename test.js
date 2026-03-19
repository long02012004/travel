// Test JavaScript syntax
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded");

  // Test map initialization
  try {
    const map = L.map("map", {
      zoomControl: false,
    }).setView([16.047079, 108.20623], 11);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    console.log("Map initialized successfully");
  } catch (error) {
    console.error("Map initialization error:", error);
  }
});
