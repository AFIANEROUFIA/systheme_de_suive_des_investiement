import { Chart } from "@/components/ui/chart"
document.addEventListener("DOMContentLoaded", async () => {
  let charts = {}

  // Fetch data from API
  async function fetchStatistics() {
    try {
      const year = document.getElementById("stats-year")?.value || new Date().getFullYear()
      const response = await fetch(`api/statistics/get_all.php?year=${year}`)
      const data = await response.json()
      return data.success ? data : null
    } catch (error) {
      console.error("Error fetching statistics:", error)
      return null
    }
  }

  // Update KPI cards with animation
  function updateKPICards(data) {
    if (!data) return

    const animateValue = (element, target) => {
      let current = 0
      const increment = target / 30
      const timer = setInterval(() => {
        current += increment
        if (current >= target) {
          element.textContent = target
          clearInterval(timer)
        } else {
          element.textContent = Math.floor(current)
        }
      }, 30)
    }

    const totalProjectsEl = document.getElementById("totalProjects")
    if (totalProjectsEl) {
      animateValue(totalProjectsEl, data.totalProjects || 0)
    }

    const budgetEl = document.getElementById("totalBudget")
    if (budgetEl) {
      const budget = ((data.totalBudget || 0) / 1000000).toFixed(1)
      budgetEl.textContent = budget + "M"
    }

    const completionEl = document.getElementById("completionRate")
    if (completionEl) {
      const rate = data.completionRate || 0
      completionEl.textContent = rate + "%"
    }

    const delayedEl = document.getElementById("delayedProjects")
    if (delayedEl) {
      animateValue(delayedEl, data.delayedProjects || 0)
    }

    document.getElementById("projectsTrend").textContent = data.projectsTrend || "0%"
    document.getElementById("budgetTrend").textContent = data.budgetTrend || "0%"
    document.getElementById("completionTrend").textContent = data.completionTrend || "0%"
    document.getElementById("activeProjectsCount").textContent = data.activeProjects || 0
  }

  // Destroy existing charts
  function destroyCharts() {
    Object.values(charts).forEach((chart) => {
      if (chart) chart.destroy()
    })
    charts = {}
  }

  // Initialize charts using global Chart object from CDN
  function initializeCharts(data) {
    if (!data || typeof Chart === "undefined") {
      console.warn("Chart.js not loaded or data missing")
      return
    }

    destroyCharts()

    // Monthly Progress Chart
    const monthlyCtx = document.getElementById("monthlyProgressChart")
    if (monthlyCtx) {
      charts.monthly = new Chart(monthlyCtx, {
        type: "bar",
        data: {
          labels: data.months || [],
          datasets: [
            {
              label: "Planifié",
              data: data.plannedData || [],
              backgroundColor: "#2d5a4f",
              borderRadius: 8,
              borderSkipped: false,
            },
            {
              label: "Réalisé",
              data: data.completedData || [],
              backgroundColor: "#d4af37",
              borderRadius: 8,
              borderSkipped: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              display: true,
              position: "top",
              labels: {
                usePointStyle: true,
                padding: 15,
                color: "#e8eaed",
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1,
                color: "#e8eaed",
              },
              grid: {
                color: "rgba(232, 234, 237, 0.1)",
              },
            },
            x: {
              ticks: {
                color: "#e8eaed",
              },
              grid: {
                color: "rgba(232, 234, 237, 0.1)",
              },
            },
          },
        },
      })
    }

    // Location Distribution Chart
    const locationCtx = document.getElementById("locationDistributionChart")
    if (locationCtx) {
      charts.location = new Chart(locationCtx, {
        type: "doughnut",
        data: {
          labels: data.dairas || [],
          datasets: [
            {
              data: data.dairaData || [],
              backgroundColor: ["#2d5a4f", "#4a8b7f", "#d4af37", "#1a3a32", "#6ba89f"],
              borderColor: "#1a2332",
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                padding: 15,
                color: "#e8eaed",
              },
            },
          },
        },
      })
    }

    // Project Types Chart
    const typesCtx = document.getElementById("projectTypesChart")
    if (typesCtx) {
      charts.types = new Chart(typesCtx, {
        type: "pie",
        data: {
          labels: data.types || [],
          datasets: [
            {
              data: data.typeData || [],
              backgroundColor: ["#2d5a4f", "#4a8b7f", "#d4af37", "#1a3a32"],
              borderColor: "#1a2332",
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                color: "#e8eaed",
              },
            },
          },
        },
      })
    }

    // Project Status Chart
    const statusCtx = document.getElementById("projectStatusChart")
    if (statusCtx) {
      charts.status = new Chart(statusCtx, {
        type: "doughnut",
        data: {
          labels: data.statusLabels || [],
          datasets: [
            {
              data: data.statusData || [],
              backgroundColor: ["#facc15", "#2d5a4f", "#4ade80"],
              borderColor: "#1a2332",
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                color: "#e8eaed",
              },
            },
          },
        },
      })
    }

    // Budget Chart
    const budgetCtx = document.getElementById("budgetChart")
    if (budgetCtx) {
      charts.budget = new Chart(budgetCtx, {
        type: "bar",
        data: {
          labels: ["Budget", "Dépenses"],
          datasets: [
            {
              label: "Montant (Millions DA)",
              data: [((data.totalBudget || 0) / 1000000).toFixed(1), ((data.totalSpent || 0) / 1000000).toFixed(1)],
              backgroundColor: ["#2d5a4f", "#d4af37"],
              borderRadius: 8,
              borderSkipped: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                color: "#e8eaed",
              },
              grid: {
                color: "rgba(232, 234, 237, 0.1)",
              },
            },
            x: {
              ticks: {
                color: "#e8eaed",
              },
              grid: {
                color: "rgba(232, 234, 237, 0.1)",
              },
            },
          },
        },
      })
    }
  }

  // Load initial data
  const stats = await fetchStatistics()
  updateKPICards(stats)
  initializeCharts(stats)

  // Year filter change
  const yearSelect = document.getElementById("stats-year")
  if (yearSelect) {
    yearSelect.addEventListener("change", async () => {
      const newStats = await fetchStatistics()
      updateKPICards(newStats)
      initializeCharts(newStats)
    })
  }

  // Export functionality
  const exportBtn = document.getElementById("export-btn")
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      const year = document.getElementById("stats-year")?.value || new Date().getFullYear()
      window.location.href = `api/statistics/export.php?year=${year}&format=pdf`
    })
  }

  // Print functionality
  const printBtn = document.getElementById("print-btn")
  if (printBtn) {
    printBtn.addEventListener("click", () => {
      window.print()
    })
  }
})

