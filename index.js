let bookings = {
  مسبق: [
    { name: "محمد أحمد", date: "2024-10-01", phone: "0501234567", bloodType: "A-"  },
    { name: "جودت علي حسن", date: "2024-10-02", phone: "0507654324" ,bloodType: "B-"},
    { name: "يوسف العلي", date: "2024-10-04", phone: "0507654326",bloodType: "O+" },
    { name: "محمود الاسماعيل", date: "2024-10-06", phone: "0507654321",bloodType: "AB-" },
    { name: "فادي الراجي", date: "2024-10-08", phone: "0506755432" ,bloodType: "B-"},
  ],
  انتظار: [
    { name: "فاطمة الزهراء", date: "2024-10-04", phone: "0509876543",bloodType: "A+" },
    { name: "سمير يوسف", date: "2024-10-04", phone: "0501112222",bloodType: "O+" },
    { name: "ريم الشيخ", date: "2024-10-04", phone: "0501112222" ,bloodType: "AB+"},
    { name: "سمير يوسف", date: "2024-10-04", phone: "0501112222", bloodType: "B-"},
  ],
  طوارئ: [
    { name: "عائشة سعيد", date: "2024-10-05", phone: "0502223333",bloodType: "O+" },
    { name: "مريم الجسن", date: "2024-10-05", phone: "0502223333",bloodType: "O+" },
  ],
};

function updateCounts() {
  document.getElementById("bookedCount").innerText = bookings["مسبق"].length;
  document.getElementById("waitingCount").innerText = bookings["انتظار"].length;
  document.getElementById("emergencyCount").innerText = bookings["طوارئ"].length;
}

function saveBooking() {
  const name = document.getElementById("patientName").value;
  const date = document.getElementById("bookingDate").value;
  const type = document.getElementById("bookingType").value;
  const phone = document.getElementById("phoneNumber").value;
  const bloodType = document.getElementById("bloodType").value;

  bookings[type].push({ name, date, phone, bloodType });
  updateCounts();
  $("#bookingModal").modal("hide");
  document.getElementById("bookingForm").reset();

  alert("تم إضافة الحجز بنجاح!");
}

function showSection(type) {
  const patientsSection = document.getElementById("patients-section");
  const patientsTitle = document.getElementById("patients-title");
  const patientsContent = document.getElementById("patients-content");

  patientsTitle.innerText = `حالات الحجز (${type})`;
  patientsContent.innerHTML = bookings[type]
    .map(
      (booking, index) => `
      <div class="patient-item">
        <span class="patient-details">${booking.name} - ${booking.bloodType} - ${booking.date} - ${booking.phone}</span>
        <div class="btn-container">
          <button class="btn btn-danger btn-sm" onclick="cancelBooking('${type}', ${index})">إلغاء</button>
          ${
            type === "انتظار"
              ? `<button class="btn btn-success btn-sm" onclick="moveToProcessing(${index})">نقل إلى معالجة</button>`
              : ""
          }
        </div>
      </div>
    `
    )
    .join("");
  patientsSection.classList.remove("hidden");
}

function moveToProcessing(index) {
  const patient = bookings["انتظار"].splice(index, 1)[0];
  bookings["مسبق"].push(patient);
  updateCounts();
  showSection("انتظار"); 
  showSection("مسبق"); 
}

function cancelBooking(type, index) {
  bookings[type].splice(index, 1);
  updateCounts();
  showSection(type);
}
function validateForm() {
  const name = document.getElementById("patientName").value;
  const date = document.getElementById("bookingDate").value;
  const phone = document.getElementById("phoneNumber").value;
  let valid = true;

  document.getElementById("nameError").innerText = "";
  document.getElementById("dateError").innerText = "";
  document.getElementById("phoneError").innerText = "";

  // التحقق من أن حقل الاسم ليس فارغًا ويحتوي فقط على أحرف
  const namePattern = /^[\u0600-\u06FFa-zA-Z\s]+$/; // يقبل الأحرف العربية والإنجليزية فقط
  if (name.trim() === "") {
    document.getElementById("nameError").innerText = "يجب إدخال اسم المريض.";
    valid = false;
  } else if (!namePattern.test(name)) {
    document.getElementById("nameError").innerText = "يجب أن يحتوي الاسم على أحرف فقط بدون أرقام أو رموز.";
    valid = false;
  }

  if (date.trim() === "") {
    document.getElementById("dateError").innerText = "يجب إدخال تاريخ الحجز.";
    valid = false;
  }

  const phonePattern = /^[0-9]{10}$/;
  if (!phonePattern.test(phone)) {
    document.getElementById("phoneError").innerText = "رقم الهاتف يجب أن يتكون من 10 أرقام.";
    valid = false;
  }

  return valid;
}


function generateMonthlyReport() {
  const reportContent = document.getElementById("reportContent");
  const reportData = `
      <div class="report-card">
          <h5 class="text-center">تقارير الشهر</h5>
          <p><strong>عدد حالات الحجز المسبق:</strong> ${bookings["مسبق"].length}</p>
      </div>
      <div class="report-card">
          <p><strong>عدد حالات الانتظار:</strong> ${bookings["انتظار"].length}</p>
      </div>
      <div class="report-card">
          <p><strong>عدد حالات الطوارئ:</strong> ${bookings["طوارئ"].length}</p>
      </div>
  `;
  reportContent.innerHTML = reportData;
  reportContent.classList.remove("hidden");
}

function handleFormSubmission() {
  if (validateForm()) {
    saveBooking();
  }
  return false; // Prevent default form submission
}

function renderBookingChart() {
  const ctx = document.getElementById("bookingChart").getContext("2d");
  const bookedCount = parseInt(document.getElementById("bookedCount").innerText) || 0;
  const waitingCount = parseInt(document.getElementById("waitingCount").innerText) || 0;
  const emergencyCount = parseInt(document.getElementById("emergencyCount").innerText) || 0;

  const bookingChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["حالات الحجز المسبق", "حالات الانتظار", "حالات الطوارئ"],
      datasets: [
        {
          label: "عدد الحالات",
          data: [bookedCount, waitingCount, emergencyCount],
          backgroundColor: ["rgba(75, 192, 192, 0.2)", "rgba(255, 206, 86, 0.2)", "rgba(255, 99, 132, 0.2)"],
          borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 206, 86, 1)", "rgba(255, 99, 132, 1)"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

window.onload = function() {
  updateCounts();
  renderBookingChart();
};
