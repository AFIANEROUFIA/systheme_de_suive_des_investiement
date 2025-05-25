document.addEventListener("DOMContentLoaded", () => {
    // Gestion des clics sur les éléments du menu
    const navItems = document.querySelectorAll(".nav-item")
  
    navItems.forEach((item) => {
      item.addEventListener("click", function () {
        // Retirer la classe active de tous les éléments
        navItems.forEach((navItem) => {
          navItem.classList.remove("active")
        })
  
        // Ajouter la classe active à l'élément cliqué
        this.classList.add("active")
  
        // Animation au clic - change background to match main background
        this.style.backgroundColor = "var(--mint-bg)"
        this.style.color = "var(--dark-teal)"
  
        // Animate the transition
        this.style.transform = "scale(0.98)"
        setTimeout(() => {
          this.style.transform = "scale(1)"
        }, 100)
  
        // Reset other menu items
        navItems.forEach((navItem) => {
          if (navItem !== this) {
            navItem.style.backgroundColor = ""
            navItem.style.color = ""
          }
        })
      })
    })
  
    // Animation aléatoire des utilisateurs actifs
    const usersCount = document.querySelector(".users-count")
    let currentUsers = 24
  
    function updateUsersCount() {
      const randomChange = Math.floor(Math.random() * 3) - 1 // -1, 0 ou 1
      currentUsers = Math.max(10, currentUsers + randomChange)
      usersCount.textContent = currentUsers
  
      // Animation
      usersCount.style.transform = "scale(1.1)"
      usersCount.style.color = "#D4AF37"
      setTimeout(() => {
        usersCount.style.transform = "scale(1)"
        usersCount.style.color = ""
      }, 300)
    }
  
    setInterval(updateUsersCount, 5000)
  
    // Create SVG Donut Chart
    const budgetDonutChart = document.getElementById("budgetDonutChart")
    if (budgetDonutChart) {
      const data = [
        { label: "Irrigation", value: 35, color: "#2D4F4F" },
        { label: "Électrification", value: 25, color: "#3A6363" },
        { label: "Équipement", value: 20, color: "#5C8D8D" },
        { label: "Formation", value: 15, color: "#D4AF37" },
        { label: "Autres", value: 5, color: "#F0D77B" },
      ]
  
      createDonutChart(budgetDonutChart, data)
      createLegend(document.getElementById("budgetChartLegend"), data)
    }
  
    // Create SVG Line Chart
    const statusLineChart = document.getElementById("statusLineChart")
    if (statusLineChart) {
      const data = {
        labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"],
        datasets: [
          {
            label: "Projets Terminés",
            data: [4, 6, 8, 7, 9, 15],
            color: "#D4AF37",
          },
          {
            label: "Projets En Cours",
            data: [2, 4, 5, 8, 6, 8],
            color: "#5C8D8D",
          },
        ],
      }
  
      createLineChart(statusLineChart, data)
    }
  
    // Animation des cartes de statistiques
    const statCards = document.querySelectorAll(".stat-card")
    statCards.forEach((card, index) => {
      setTimeout(() => {
        card.style.opacity = "1"
        card.style.transform = "translateY(0)"
      }, index * 200)
    })
  
    // Add Algeria map to sidebar if it doesn't exist
    const menu = document.querySelector(".menu")
    if (!document.querySelector(".algeria-map") && menu) {
      const algeriaMap = document.createElement("div")
      algeriaMap.className = "algeria-map"
  
      // Insert before active users
      const activeUsers = document.querySelector(".active-users")
      if (activeUsers) {
        menu.insertBefore(algeriaMap, activeUsers)
      } else {
        menu.appendChild(algeriaMap)
      }
    }
  
    // Add cart badge update
    const cartBadge = document.querySelector(".cart-badge")
    if (cartBadge) {
      let count = 3
      cartBadge.textContent = count
  
      document.querySelector(".cart-icon").addEventListener("click", () => {
        count++
        cartBadge.textContent = count
        cartBadge.style.transform = "scale(1.3)"
        setTimeout(() => {
          cartBadge.style.transform = "scale(1)"
        }, 300)
      })
    }
  
    // Function to create a donut chart
    function createDonutChart(container, data) {
      const width = container.clientWidth
      const height = 350 // Increased height
      const radius = (Math.min(width, height) / 2) * 0.8
      const innerRadius = radius * 0.6
  
      const total = data.reduce((sum, item) => sum + item.value, 0)
      let startAngle = 0
  
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
      svg.setAttribute("width", width)
      svg.setAttribute("height", height)
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`)
  
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g")
      g.setAttribute("transform", `translate(${width / 2}, ${height / 2})`)
  
      // Add tooltip functionality
      const tooltip = document.getElementById("budgetChartTooltip")
      const tooltipTitle = tooltip.querySelector(".tooltip-title")
      const tooltipValue = tooltip.querySelector(".tooltip-value")
      const tooltipDesc = tooltip.querySelector(".tooltip-desc")
  
      // Descriptions for each segment
      const descriptions = [
        "Budget alloué à l'irrigation des terres agricoles",
        "Budget alloué à l'électrification des zones rurales",
        "Budget alloué à l'achat d'équipement agricole",
        "Budget alloué à la formation des agriculteurs",
        "Budget alloué à divers projets mineurs",
      ]
  
      data.forEach((item, index) => {
        const angle = (item.value / total) * 2 * Math.PI
        const endAngle = startAngle + angle
  
        const largeArcFlag = angle > Math.PI ? 1 : 0
  
        const x1 = radius * Math.cos(startAngle - Math.PI / 2)
        const y1 = radius * Math.sin(startAngle - Math.PI / 2)
  
        const x2 = radius * Math.cos(endAngle - Math.PI / 2)
        const y2 = radius * Math.sin(endAngle - Math.PI / 2)
  
        const xi1 = innerRadius * Math.cos(startAngle - Math.PI / 2)
        const yi1 = innerRadius * Math.sin(startAngle - Math.PI / 2)
  
        const xi2 = innerRadius * Math.cos(endAngle - Math.PI / 2)
        const yi2 = innerRadius * Math.sin(endAngle - Math.PI / 2)
  
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path")
        path.setAttribute(
          "d",
          `
          M ${x1} ${y1}
          A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
          L ${xi2} ${yi2}
          A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${xi1} ${yi1}
          Z
        `,
        )
        path.setAttribute("fill", item.color)
        path.setAttribute("class", "donut-segment")
        path.setAttribute("data-index", index)
        path.style.animationDelay = `${index * 0.1}s`
        path.style.cursor = "pointer"
  
        // Add click event to show tooltip
        path.addEventListener("click", function () {
          // Remove active class from all segments
          document.querySelectorAll(".donut-segment").forEach((segment) => {
            segment.classList.remove("active")
          })
  
          // Add active class to clicked segment
          this.classList.add("active")
  
          // Update tooltip content
          tooltipTitle.textContent = item.label
          tooltipValue.textContent = `${item.value}%`
          tooltipDesc.textContent = descriptions[index]
  
          // Show tooltip
          tooltip.classList.add("visible")
  
          // Hide tooltip after 5 seconds
          setTimeout(() => {
            tooltip.classList.remove("visible")
            this.classList.remove("active")
          }, 5000)
        })
  
        g.appendChild(path)
  
        startAngle = endAngle
      })
  
      // Add center text
      const centerText = document.createElementNS("http://www.w3.org/2000/svg", "text")
      centerText.setAttribute("text-anchor", "middle")
      centerText.setAttribute("dy", "0.35em")
      centerText.setAttribute("font-size", "16")
      centerText.setAttribute("fill", "#333")
      centerText.textContent = "Budget Total"
  
      const centerValue = document.createElementNS("http://www.w3.org/2000/svg", "text")
      centerValue.setAttribute("text-anchor", "middle")
      centerValue.setAttribute("dy", "1.5em")
      centerValue.setAttribute("font-size", "20")
      centerValue.setAttribute("font-weight", "bold")
      centerValue.setAttribute("fill", "var(--gold)")
      centerValue.textContent = "850M DA"
  
      g.appendChild(centerText)
      g.appendChild(centerValue)
  
      svg.appendChild(g)
      container.appendChild(svg)
    }
  
    // Function to create a legend
    function createLegend(container, data) {
      const legend = document.createElement("div")
      legend.className = "chart-legend"
  
      data.forEach((item, index) => {
        const legendItem = document.createElement("div")
        legendItem.className = "legend-item"
        legendItem.setAttribute("data-index", index)
  
        const colorBox = document.createElement("div")
        colorBox.className = "legend-color"
        colorBox.style.backgroundColor = item.color
  
        const label = document.createElement("span")
        label.textContent = `${item.label} (${item.value}%)`
  
        legendItem.appendChild(colorBox)
        legendItem.appendChild(label)
        legend.appendChild(legendItem)
  
        // Add click event to highlight corresponding segment
        legendItem.addEventListener("click", function () {
          const index = this.getAttribute("data-index")
          const segment = document.querySelector(`.donut-segment[data-index="${index}"]`)
  
          // Trigger click on the corresponding segment
          if (segment) {
            segment.dispatchEvent(new Event("click"))
          }
  
          // Toggle active class on legend item
          document.querySelectorAll(".legend-item").forEach((item) => {
            item.classList.remove("active")
          })
          this.classList.add("active")
        })
      })
  
      container.appendChild(legend)
    }
  
    // Function to create a line chart
    function createLineChart(container, data) {
      const width = container.clientWidth
      const height = 350 // Increased height
      const padding = 40
  
      const chartWidth = width - 2 * padding
      const chartHeight = height - 2 * padding
  
      // Find max value for scaling
      let maxValue = 0
      data.datasets.forEach((dataset) => {
        const localMax = Math.max(...dataset.data)
        maxValue = Math.max(maxValue, localMax)
      })
  
      // Add some padding to the max value
      maxValue = maxValue * 1.1
  
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
      svg.setAttribute("width", width)
      svg.setAttribute("height", height)
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`)
  
      // Add grid lines
      const gridGroup = document.createElementNS("http://www.w3.org/2000/svg", "g")
  
      // Horizontal grid lines
      for (let i = 0; i <= 5; i++) {
        const y = height - padding - (i / 5) * chartHeight
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line")
        line.setAttribute("x1", padding)
        line.setAttribute("y1", y)
        line.setAttribute("x2", width - padding)
        line.setAttribute("y2", y)
        line.setAttribute("stroke", "rgba(0, 0, 0, 0.05)")
        line.setAttribute("stroke-width", "1")
        gridGroup.appendChild(line)
  
        // Add y-axis labels
        const label = document.createElementNS("http://www.w3.org/2000/svg", "text")
        label.setAttribute("x", padding - 10)
        label.setAttribute("y", y + 5)
        label.setAttribute("text-anchor", "end")
        label.setAttribute("font-size", "10")
        label.setAttribute("fill", "#666")
        label.textContent = Math.round((maxValue * i) / 5)
        gridGroup.appendChild(label)
      }
  
      // X-axis labels
      data.labels.forEach((label, index) => {
        const x = padding + (index / (data.labels.length - 1)) * chartWidth
        const labelElement = document.createElementNS("http://www.w3.org/2000/svg", "text")
        labelElement.setAttribute("x", x)
        labelElement.setAttribute("y", height - padding + 20)
        labelElement.setAttribute("text-anchor", "middle")
        labelElement.setAttribute("font-size", "10")
        labelElement.setAttribute("fill", "#666")
        labelElement.textContent = label
        gridGroup.appendChild(labelElement)
      })
  
      svg.appendChild(gridGroup)
  
      // Add tooltip functionality
      const tooltip = document.getElementById("statusChartTooltip")
      const tooltipTitle = tooltip.querySelector(".tooltip-title")
      const tooltipValue = tooltip.querySelector(".tooltip-value")
      const tooltipDesc = tooltip.querySelector(".tooltip-desc")
  
      // Draw each dataset
      data.datasets.forEach((dataset, datasetIndex) => {
        const points = dataset.data.map((value, index) => {
          const x = padding + (index / (data.labels.length - 1)) * chartWidth
          const y = height - padding - (value / maxValue) * chartHeight
          return { x, y, value, label: data.labels[index] }
        })
  
        // Draw area
        const areaPath = document.createElementNS("http://www.w3.org/2000/svg", "path")
        let areaD = `M ${points[0].x} ${points[0].y}`
  
        for (let i = 1; i < points.length; i++) {
          const xc = (points[i].x + points[i - 1].x) / 2
          const yc = (points[i].y + points[i - 1].y) / 2
          areaD += ` Q ${points[i - 1].x} ${points[i - 1].y}, ${xc} ${yc}`
        }
  
        areaD += ` L ${points[points.length - 1].x} ${points[points.length - 1].y}`
        areaD += ` L ${points[points.length - 1].x} ${height - padding}`
        areaD += ` L ${points[0].x} ${height - padding}`
        areaD += ` Z`
  
        areaPath.setAttribute("d", areaD)
        areaPath.setAttribute("fill", `${dataset.color}20`)
        svg.appendChild(areaPath)
  
        // Draw line
        const linePath = document.createElementNS("http://www.w3.org/2000/svg", "path")
        let d = `M ${points[0].x} ${points[0].y}`
  
        for (let i = 1; i < points.length; i++) {
          const xc = (points[i].x + points[i - 1].x) / 2
          const yc = (points[i].y + points[i - 1].y) / 2
          d += ` Q ${points[i - 1].x} ${points[i - 1].y}, ${xc} ${yc}`
        }
  
        linePath.setAttribute("d", d)
        linePath.setAttribute("fill", "none")
        linePath.setAttribute("stroke", dataset.color)
        linePath.setAttribute("stroke-width", "2")
        linePath.setAttribute("class", "line-path")
        linePath.style.animationDelay = `${datasetIndex * 0.3}s`
        svg.appendChild(linePath)
  
        // Draw points with interactive tooltips
        points.forEach((point, index) => {
          const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle")
          circle.setAttribute("cx", point.x)
          circle.setAttribute("cy", point.y)
          circle.setAttribute("r", "4")
          circle.setAttribute("fill", dataset.color)
          circle.setAttribute("stroke", "#fff")
          circle.setAttribute("stroke-width", "2")
          circle.setAttribute("class", "chart-point")
          circle.setAttribute("data-month", point.label)
          circle.setAttribute("data-value", point.value)
          circle.setAttribute("data-dataset", datasetIndex)
  
          // Add click event to show tooltip
          circle.addEventListener("click", function () {
            // Remove active class from all points
            document.querySelectorAll(".chart-point").forEach((point) => {
              point.classList.remove("active")
            })
  
            // Add active class to clicked point
            this.classList.add("active")
  
            const month = this.getAttribute("data-month")
            const datasetIndex = Number.parseInt(this.getAttribute("data-dataset"))
            const value = this.getAttribute("data-value")
  
            // Get values for both datasets at this month
            const monthIndex = data.labels.indexOf(month)
            const completedValue = data.datasets[0].data[monthIndex]
            const inProgressValue = data.datasets[1].data[monthIndex]
  
            // Update tooltip content
            tooltipTitle.textContent = month
            tooltipValue.textContent = `${completedValue} projets terminés`
            tooltipDesc.textContent = `${inProgressValue} projets en cours`
  
            // Show tooltip
            tooltip.classList.add("visible")
  
            // Hide tooltip after 5 seconds
            setTimeout(() => {
              tooltip.classList.remove("visible")
              this.classList.remove("active")
            }, 5000)
          })
  
          svg.appendChild(circle)
        })
      })
  
      // Add legend
      const legendGroup = document.createElementNS("http://www.w3.org/2000/svg", "g")
      legendGroup.setAttribute("transform", `translate(${padding}, ${padding / 2})`)
  
      data.datasets.forEach((dataset, index) => {
        const legendItem = document.createElementNS("http://www.w3.org/2000/svg", "g")
        legendItem.setAttribute("transform", `translate(${index * 120}, 0)`)
  
        const legendColor = document.createElementNS("http://www.w3.org/2000/svg", "rect")
        legendColor.setAttribute("width", "10")
        legendColor.setAttribute("height", "10")
        legendColor.setAttribute("fill", dataset.color)
        legendItem.appendChild(legendColor)
  
        const legendText = document.createElementNS("http://www.w3.org/2000/svg", "text")
        legendText.setAttribute("x", "15")
        legendText.setAttribute("y", "9")
        legendText.setAttribute("font-size", "10")
        legendText.setAttribute("fill", "#333")
        legendText.textContent = dataset.label
        legendItem.appendChild(legendText)
  
        legendGroup.appendChild(legendItem)
      })
  
      svg.appendChild(legendGroup)
  
      container.appendChild(svg)
    }
  
    // Add animation to agriculture cards
    document.addEventListener("DOMContentLoaded", () => {
      // Existing code...
  
      // Add click animations to agriculture cards
      const agricultureCards = document.querySelectorAll(".agriculture-card")
      agricultureCards.forEach((card) => {
        card.addEventListener("click", function () {
          this.style.transform = "scale(0.95)"
          setTimeout(() => {
            this.style.transform = ""
  
            // Create and show a popup with more details
            const info = this.querySelector(".agriculture-info h3").textContent
            const price = this.querySelector(".agriculture-price").textContent
  
            const popup = document.createElement("div")
            popup.className = "agriculture-popup"
            popup.innerHTML = `
              <div class="popup-content">
                <h3>${info}</h3>
                <p>Détails supplémentaires sur ${info.toLowerCase()}</p>
                <div class="popup-stat">
                  <span>Quantité:</span>
                  <strong>${price}</strong>
                </div>
                <div class="popup-stat">
                  <span>Région:</span>
                  <strong>Guelma</strong>
                </div>
                <div class="popup-stat">
                  <span>Budget alloué:</span>
                  <strong>120M DA</strong>
                </div>
                <button class="popup-close">Fermer</button>
              </div>
            `
  
            document.body.appendChild(popup)
  
            // Animation for popup
            setTimeout(() => {
              popup.style.opacity = "1"
            }, 10)
  
            // Close popup on button click
            popup.querySelector(".popup-close").addEventListener("click", () => {
              popup.style.opacity = "0"
              setTimeout(() => {
                document.body.removeChild(popup)
              }, 300)
            })
          }, 200)
        })
      })
    })
  
    // Add this CSS to the document for the popup
    const style = document.createElement("style")
    style.textContent = `
      .agriculture-popup {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      
      .popup-content {
        background-color: white;
        border-radius: 16px;
        padding: 2rem;
        max-width: 400px;
        width: 90%;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        position: relative;
        transform: translateY(0);
        animation: popupEnter 0.5s ease;
      }
      
      @keyframes popupEnter {
        from {
          transform: translateY(50px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
      
      .popup-content h3 {
        color: var(--dark-teal);
        margin-bottom: 1rem;
        font-size: 1.5rem;
      }
      
      .popup-content p {
        color: #666;
        margin-bottom: 1.5rem;
      }
      
      .popup-stat {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 0;
        border-bottom: 1px solid #eee;
      }
      
      .popup-stat:last-of-type {
        margin-bottom: 1.5rem;
      }
      
      .popup-stat span {
        color: #666;
      }
      
      .popup-stat strong {
        color: var(--gold);
        font-weight: 600;
      }
      
      .popup-close {
        background-color: var(--dark-teal);
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.2s ease;
        width: 100%;
      }
      
      .popup-close:hover {
        background-color: var(--medium-teal);
      }
    `
    document.head.appendChild(style)
  })
  