let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();
const today = new Date();
let events = [];
let editingEvent = null;
let selectedDayInMonth = null;

function createMonthCalendar() {
  const monthCalendar = document.getElementById("month-calendar");
  monthCalendar.innerHTML = "";

  // Tạo tiêu đề tháng
  const header = document.createElement("div");
  header.className = "header";

  const monthTitle = document.createElement("div");
  monthTitle.className = "month-title";
  monthTitle.textContent = `${getMonthName(currentMonth)} ${currentYear}`;

  // Danh sách chọn tháng
  const monthList = document.createElement("div");
  monthList.className = "month-list";

  const months = [
      "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
      "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
  ];

  months.forEach((m, index) => {
      const monthItem = document.createElement("div");
      monthItem.textContent = m;
      monthItem.onclick = () => {
          currentMonth = index;
          createMonthCalendar();
      };
      monthList.appendChild(monthItem);
  });

  monthTitle.appendChild(monthList);
  header.appendChild(monthTitle);

  // Nút chuyển tháng
  const navContainer = document.createElement("div");

  const prevButton = document.createElement("button");
  prevButton.className = "nav-button";
  prevButton.textContent = "<";
  prevButton.onclick = () => changeMonth(-1);
  navContainer.appendChild(prevButton);

  const nextButton = document.createElement("button");
  nextButton.className = "nav-button";
  nextButton.textContent = ">";
  nextButton.onclick = () => changeMonth(1);
  navContainer.appendChild(nextButton);

  header.appendChild(navContainer);
  monthCalendar.appendChild(header);

  // Tiêu đề ngày trong tuần (Bắt đầu từ Thứ Hai)
  const days = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
  const calendarGrid = document.createElement("div");
  calendarGrid.className = "calendar";

  // Hàng tiêu đề (thứ)
  days.forEach((day) => {
      const dayHeader = document.createElement("div");
      dayHeader.className = "day-header";
      dayHeader.textContent = day;
      calendarGrid.appendChild(dayHeader);
  });

  // Lấy thông tin tháng hiện tại
  const date = new Date(currentYear, currentMonth, 1);
  const firstDayIndex = (date.getDay() + 6) % 7; // Định nghĩa lại để thứ Hai là ngày đầu tiên
  const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();

  // **CỐ ĐỊNH LỖI LỆCH CỘT** - Thêm ô trống vào đầu hàng đầu tiên
  for (let i = 0; i < firstDayIndex; i++) {
      const emptyDiv = document.createElement("div");
      emptyDiv.className = "empty-day";
      calendarGrid.appendChild(emptyDiv);
  }

  // Thêm ngày vào lịch
  for (let day = 1; day <= lastDay; day++) {
      const dayDiv = document.createElement("div");
      dayDiv.className = "day";
      dayDiv.textContent = day;

      const currentDate = new Date(currentYear, currentMonth, day);

      // Đánh dấu ngày hôm nay
      if (currentDate.toDateString() === today.toDateString()) {
          dayDiv.classList.add("today");
      }

      dayDiv.onclick = () => selectDate(day, dayDiv);
      calendarGrid.appendChild(dayDiv);
  }

  monthCalendar.appendChild(calendarGrid);
}

function getMonthName(monthIndex) {
  const months = [
      "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
      "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
  ];
  return months[monthIndex];
}

function changeMonth(direction) {
  currentMonth += direction;

  if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
  } else if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
  }

  createMonthCalendar();
}

function getMonthName(monthIndex) {
  const months = [
      "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
      "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
  ];
  return months[monthIndex];
}

function changeMonth(direction) {
  currentMonth += direction;

  if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
  } else if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
  }

  createMonthCalendar();
}
function getMonthName(monthIndex) {
  const months = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];
  return months[monthIndex];
}

function changeMonth(direction) {
  currentMonth += direction;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  } else if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  createMonthCalendar();
}

function createWeekCalendar(startDate) {
  const calendar = document.getElementById("calendar");
  calendar.innerHTML = "";

  const days = ["THỨ 2", "THỨ 3", "THỨ 4", "THỨ 5", "THỨ 6", "THỨ 7", "CHỦ NHẬT"];
  const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, "0")}:00`);

  // Xác định ngày đầu tuần (Bắt đầu từ Thứ Hai)
  const firstDayOfWeek = new Date(startDate);
  firstDayOfWeek.setDate(startDate.getDate() - ((startDate.getDay() + 6) % 7));

  // Hàng tiêu đề - Hiển thị thứ và ngày
  const headerRow = document.createElement("div");
  headerRow.className = "calendar-row header-row";
  calendar.appendChild(headerRow);

  // Ô trống đầu tiên (cột giờ)
  const emptyHeader = document.createElement("div");
  emptyHeader.className = "calendar-header time-column";
  headerRow.appendChild(emptyHeader);

  // Tạo cột ngày trong tuần
  days.forEach((day, index) => {
      const dayHeader = document.createElement("div");
      dayHeader.className = "calendar-header";
      const currentDate = new Date(firstDayOfWeek);
      currentDate.setDate(firstDayOfWeek.getDate() + index);
      dayHeader.textContent = `${day}\n${currentDate.getDate()}/${currentDate.getMonth() + 1}`;
      dayHeader.onclick = () => showEventPopup(currentDate);
      headerRow.appendChild(dayHeader);
  });

  // Tạo lưới theo giờ
  hours.forEach((hour) => {
      const row = document.createElement("div");
      row.className = "calendar-row";

      // Cột thời gian
      const timeCell = document.createElement("div");
      timeCell.className = "calendar-time";
      timeCell.textContent = hour;
      row.appendChild(timeCell);

      // Cột cho từng ngày
      days.forEach((_, index) => {
          const cell = document.createElement("div");
          cell.className = "calendar-cell";
          cell.setAttribute("data-hour", hour);
          cell.setAttribute("data-day", index);
          cell.addEventListener("click", (e) => addQuickEvent(e, firstDayOfWeek));
          row.appendChild(cell);
      });

      calendar.appendChild(row);
  });

  // Hiển thị sự kiện
  renderEvents(firstDayOfWeek);
}

// Thêm sự kiện nhanh khi click vào ô trống
function addQuickEvent(e, startDate) {
  const cell = e.target;
  const hour = cell.getAttribute("data-hour");
  const dayIndex = parseInt(cell.getAttribute("data-day"));
  const eventDate = new Date(startDate);
  eventDate.setDate(startDate.getDate() + dayIndex);

  showEventPopup(eventDate, hour);
}

function renderEvents(startDate) {
  document.querySelectorAll(".calendar-cell").forEach(cell => cell.innerHTML = ""); // Xóa nội dung cũ

  events.forEach(event => {
      const eventDate = new Date(event.date);
      const dayIndex = Math.floor((eventDate - startDate) / (1000 * 60 * 60 * 24));

      if (dayIndex >= 0 && dayIndex < 7) {
          const startHour = parseInt(event.start.split(":")[0]);
          const endHour = parseInt(event.end.split(":")[0]);
          const duration = endHour - startHour;

          const targetCell = document.querySelector(`.calendar-row:nth-child(${startHour + 2}) .calendar-cell[data-day="${dayIndex}"]`);
          if (targetCell) {
              const eventEl = document.createElement("div");
              eventEl.className = "event";
              eventEl.textContent = `${event.name}`;
              eventEl.style.backgroundColor = event.color === "blue" ? "#66B2FF" : "#D1A6E0";
              eventEl.style.height = `${duration * 60}px`; // Độ dài dựa theo thời gian
              eventEl.onclick = () => showEditEventPopup(event);
              eventEl.draggable = true;
              eventEl.ondragstart = (e) => dragStart(e, event);
              eventEl.ondrop = (e) => dropEvent(e, event);
              eventEl.ondragover = (e) => e.preventDefault();
              targetCell.appendChild(eventEl);
          }
      }
  });
}

function showEventDetails(event) {
  const detailsPopup = document.getElementById("event-details-popup");
  document.getElementById("details-name").textContent = event.name;
  document.getElementById("details-date").textContent = event.date;
  document.getElementById("details-time").textContent = `${event.start} - ${event.end}`;
  document.getElementById("details-color").style.backgroundColor = event.color;

  detailsPopup.style.display = "block";
}

// Đóng popup chi tiết
function closeEventDetails() {
  document.getElementById("event-details-popup").style.display = "none";
}
// Kéo thả sự kiện để thay đổi thời gian
function dragStart(e, event) {
  e.dataTransfer.setData("text/plain", JSON.stringify(event));
}

function dropEvent(e, event) {
  e.preventDefault();
  const cell = e.target.closest(".calendar-cell");
  if (!cell) return;

  const newHour = cell.getAttribute("data-hour");
  event.start = newHour;
  event.end = `${parseInt(newHour.split(":")[0]) + 1}:00`;
  
  renderEvents(new Date(event.date));
}

// Hiển thị popup thêm sự kiện
function showEventPopup(targetDate, hour = "08:00") {
  const overlay = document.getElementById("overlay");
  const popup = document.getElementById("event-popup");
  overlay.style.display = "block";
  popup.style.display = "block";

  document.getElementById("event-date").value = targetDate.toISOString().substring(0, 10);
  document.getElementById("event-start").value = hour;
  document.getElementById("event-end").value = (parseInt(hour.split(":")[0]) + 1) + ":00";
}

// Đóng popup
function closeEventPopup() {
  document.getElementById("overlay").style.display = "none";
  document.getElementById("event-popup").style.display = "none";
  editingEvent = null;
}

// Thêm mới sự kiện
function addNewEvent(event) {
  event.preventDefault();
  const name = document.getElementById("event-name").value;
  const date = document.getElementById("event-date").value;
  const start = document.getElementById("event-start").value;
  const end = document.getElementById("event-end").value;
  const color = document.querySelector('input[name="color"]:checked').value;

  events.push({ name, date, start, end, color });
  closeEventPopup();
  createWeekCalendar(new Date(date));
}