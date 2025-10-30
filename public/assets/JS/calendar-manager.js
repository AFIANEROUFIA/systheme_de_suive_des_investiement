// Calendar Manager - Improved animations and functionality
class CalendarManager {
  constructor() {
    this.currentDate = new Date()
    this.selectedDates = []
    this.init()
  }

  init() {
    this.renderCalendar()
    this.attachEventListeners()
  }

  renderCalendar() {
    const year = this.currentDate.getFullYear()
    const month = this.currentDate.getMonth()

    // Update header
    const monthYearEl = document.getElementById("calendar-month-year")
    if (monthYearEl) {
      const monthNames = [
        "janvier",
        "février",
        "mars",
        "avril",
        "mai",
        "juin",
        "juillet",
        "août",
        "septembre",
        "octobre",
        "novembre",
        "décembre",
      ]
      monthYearEl.textContent = `${monthNames[month]} ${year}`
    }

    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const daysInPrevMonth = new Date(year, month, 0).getDate()

    const calendarGrid = document.getElementById("calendar-grid-compact")
    if (!calendarGrid) return

    calendarGrid.innerHTML = ""

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = document.createElement("div")
      day.className = "calendar-day other-month"
      day.textContent = daysInPrevMonth - i
      calendarGrid.appendChild(day)
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const day = document.createElement("div")
      day.className = "calendar-day"
      day.textContent = i

      const today = new Date()
      if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
        day.classList.add("today")
      }

      day.addEventListener("click", () => this.selectDate(i, month, year, day))
      calendarGrid.appendChild(day)
    }

    // Next month days
    const totalCells = calendarGrid.children.length
    const remainingCells = 42 - totalCells
    for (let i = 1; i <= remainingCells; i++) {
      const day = document.createElement("div")
      day.className = "calendar-day other-month"
      day.textContent = i
      calendarGrid.appendChild(day)
    }
  }

  selectDate(day, month, year, element) {
    // Remove previous selection
    document.querySelectorAll(".calendar-day.selected").forEach((el) => {
      el.classList.remove("selected")
    })

    // Add selection to clicked day
    element.classList.add("selected")
    this.selectedDates = [new Date(year, month, day)]

    // Trigger event
    this.onDateSelected(this.selectedDates[0])
  }

  onDateSelected(date) {
    // This can be overridden or used to trigger other actions
    console.log("Date selected:", date)
  }

  previousMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1)
    this.renderCalendar()
  }

  nextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1)
    this.renderCalendar()
  }

  attachEventListeners() {
    const prevBtn = document.getElementById("prev-month")
    const nextBtn = document.getElementById("next-month")

    if (prevBtn) {
      prevBtn.addEventListener("click", () => this.previousMonth())
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", () => this.nextMonth())
    }
  }
}

// Initialize calendar when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("calendar-grid-compact")) {
    new CalendarManager()
  }
})
