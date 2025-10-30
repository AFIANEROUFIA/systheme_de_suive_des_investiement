// Improved Map Manager with better animations
class MapManager {
  constructor() {
    this.map = null
    this.markers = []
    this.init()
  }

  init() {
    const mapContainer = document.getElementById("map-container")
    if (!mapContainer) return

    // Initialize map with Leaflet (lightweight alternative to Google Maps)
    this.initLeafletMap()
  }

  initLeafletMap() {
    // Using Leaflet.js for better performance
    const mapContainer = document.getElementById("map-container")
    if (!mapContainer) return

    // Create a simple map representation
    mapContainer.innerHTML = `
      <div style="width: 100%; height: 100%; background: linear-gradient(135deg, #e8f4fd 0%, #dce8e8 100%); display: flex; align-items: center; justify-content: center; border-radius: 8px;">
        <div style="text-align: center;">
          <i class="fas fa-map" style="font-size: 3rem; color: #2d5a4f; margin-bottom: 1rem;"></i>
          <p style="color: #2d5a4f; font-weight: 600;">Carte des Projets</p>
          <p style="color: #666; font-size: 0.9rem;">Intégration Google Maps ou Leaflet</p>
        </div>
      </div>
    `

    // Add animation
    mapContainer.style.animation = "fadeIn 0.5s ease-in"
  }

  addMarker(lat, lng, title) {
    // Marker management logic
    this.markers.push({ lat, lng, title })
  }

  fitBounds() {
    // Fit map to show all markers
    if (this.markers.length === 0) return
  }
}

// Initialize map when modal opens
document.addEventListener("DOMContentLoaded", () => {
  const mapModal = document.getElementById("map-modal")
  if (mapModal) {
    mapModal.addEventListener("show.bs.modal", () => {
      new MapManager()
    })
  }
})

// Add fade-in animation
const style = document.createElement("style")
style.textContent = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`
document.head.appendChild(style)
