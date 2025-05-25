// Données des projets d'électrification
const projectsData = [
  {
    code: "ELEC-2024-05-123",
    title: "Électrification rurale Oued Zenati",
    location: "Oued Zenati",
    type: "Puits profond",
    status: "En cours",
    position: { lat: 36.32, lng: 7.1667 },
  },
  {
    code: "ELEC-2024-04-089",
    title: "Électrification étable agricole Héliopolis",
    location: "Héliopolis",
    type: "Étable agricole",
    status: "En attente",
    position: { lat: 36.5033, lng: 7.445 },
  },
  {
    code: "ELEC-2024-03-045",
    title: "Électrification forage Bouchegouf",
    location: "Bouchegouf",
    type: "Forage",
    status: "Terminé",
    position: { lat: 36.4572, lng: 7.7233 },
  },
  {
    code: "ELEC-2024-02-078",
    title: "Électrification entrepôt agricole Guelma",
    location: "Guelma",
    type: "Entrepôt",
    status: "Terminé",
    position: { lat: 36.4621, lng: 7.4261 },
  },
  {
    code: "ELEC-2024-01-112",
    title: "Électrification puits Aïn Makhlouf",
    location: "Aïn Makhlouf",
    type: "Puits profond",
    status: "En cours",
    position: { lat: 36.2333, lng: 7.2167 },
  },
]

// Fonction pour initialiser la carte Google Maps
function initMap() {
  console.log("Initialisation de la carte Google Maps...")

  // Vérifier si l'API Google Maps est chargée
  if (!window.google || !window.google.maps) {
    console.error("L'API Google Maps n'est pas chargée")
    showMapError()
    return
  }

  // Vérifier si le conteneur de carte existe
  const mapContainer = document.getElementById("map-container")
  if (!mapContainer) {
    console.error("Le conteneur de carte n'existe pas")
    return
  }

  try {
    // Coordonnées centrées sur Guelma
    const guelma = { lat: 36.4621, lng: 7.4261 }

    // Créer la carte
    const map = new google.maps.Map(mapContainer, {
      zoom: 10,
      center: guelma,
      mapTypeId: "terrain",
      gestureHandling: "cooperative",
    })

    // Ajouter les marqueurs pour chaque projet
    projectsData.forEach((project) => {
      // Déterminer la couleur du marqueur en fonction du statut
      let markerColor
      switch (project.status) {
        case "En cours":
          markerColor = "#28a745" // vert
          break
        case "En attente":
          markerColor = "#fd7e14" // orange
          break
        case "Terminé":
          markerColor = "#2d4f4f" // teal foncé
          break
        default:
          markerColor = "#007bff" // bleu par défaut
      }

      // Créer le marqueur
      const marker = new google.maps.Marker({
        position: project.position,
        map: map,
        title: `${project.title} - ${project.code}`,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: markerColor,
          fillOpacity: 1,
          strokeWeight: 1,
          strokeColor: "#ffffff",
          scale: 10,
        },
        animation: google.maps.Animation.DROP,
      })

      // Ajouter une fenêtre d'info au clic sur le marqueur
      const infoWindow = new google.maps.InfoWindow({
        content: `
                    <div style="padding: 10px; max-width: 300px;">
                        <h4 style="margin-top: 0; color: #2d4f4f;">${project.title}</h4>
                        <p><strong>Code:</strong> ${project.code}</p>
                        <p><strong>Localisation:</strong> ${project.location}</p>
                        <p><strong>Type:</strong> ${project.type}</p>
                        <p><strong>Statut:</strong> <span style="color: ${markerColor}; font-weight: bold;">${project.status}</span></p>
                    </div>
                `,
      })

      marker.addListener("click", () => {
        infoWindow.open(map, marker)
      })
    })

    // Ajouter une légende à la carte
    const legend = document.createElement("div")
    legend.style.backgroundColor = "white"
    legend.style.padding = "10px"
    legend.style.margin = "10px"
    legend.style.borderRadius = "5px"
    legend.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)"

    legend.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 8px;">Légende</div>
            <div style="display: flex; align-items: center; margin-bottom: 5px;">
                <div style="width: 12px; height: 12px; background-color: #28a745; border-radius: 50%; margin-right: 8px;"></div>
                <span>En cours</span>
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 5px;">
                <div style="width: 12px; height: 12px; background-color: #fd7e14; border-radius: 50%; margin-right: 8px;"></div>
                <span>En attente</span>
            </div>
            <div style="display: flex; align-items: center;">
                <div style="width: 12px; height: 12px; background-color: #2d4f4f; border-radius: 50%; margin-right: 8px;"></div>
                <span>Terminé</span>
            </div>
        `

    // Positionner la légende en bas à gauche
    map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(legend)

    console.log("Carte Google Maps initialisée avec succès")
  } catch (error) {
    console.error("Erreur lors de l'initialisation de la carte:", error)
    showMapError()
  }
}

// Fonction pour afficher une erreur si la carte ne peut pas être chargée
function showMapError() {
  const mapContainer = document.getElementById("map-container")
  if (mapContainer) {
    mapContainer.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; background-color: #f8f9fa;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #fd7e14; margin-bottom: 1rem;"></i>
                <p style="font-size: 1.2rem; margin-bottom: 1rem;">Impossible de charger Google Maps</p>
                <button onclick="loadGoogleMaps()" class="btn btn-primary" style="padding: 0.5rem 1rem; background-color: #2d4f4f; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    <i class="fas fa-sync-alt"></i> Réessayer
                </button>
            </div>
        `
  }
}

// Fonction pour charger l'API Google Maps
function loadGoogleMaps() {
  console.log("Chargement de l'API Google Maps...")

  // Supprimer l'ancien script s'il existe
  const oldScript = document.getElementById("google-maps-script")
  if (oldScript) {
    oldScript.remove()
  }

  // Créer un nouveau script
  const script = document.createElement("script")
  script.id = "google-maps-script"
  script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyALlweVB5knN_mcAs2e1mbun2duMoS4-7I&callback=initMap"
  script.async = true
  script.defer = true

  // Gérer les erreurs de chargement
  script.onerror = () => {
    console.error("Erreur de chargement de l'API Google Maps")
    showMapError()
  }

  // Ajouter le script au document
  document.head.appendChild(script)
}

// Fonction appelée lorsque le bouton de carte est cliqué
function showMap() {
  const mapModal = document.getElementById("map-modal")
  if (mapModal) {
    mapModal.classList.add("show")

    // Charger Google Maps si ce n'est pas déjà fait
    if (!window.google || !window.google.maps) {
      loadGoogleMaps()
    } else {
      // Si l'API est déjà chargée, initialiser la carte
      initMap()
    }
  }
}

// Exporter les fonctions pour les utiliser dans electrification.js
window.showMap = showMap
window.initMap = initMap
window.loadGoogleMaps = loadGoogleMaps
