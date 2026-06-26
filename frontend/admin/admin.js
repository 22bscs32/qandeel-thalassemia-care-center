const API_URL = "http://localhost:5000/api";

async function loadStats() {
  const res = await fetch(`${API_URL}/stats`);
  const data = await res.json();

  document.getElementById("donorsCount").innerText = data.donors;
  document.getElementById("patientsCount").innerText = data.patients;
  document.getElementById("volunteersCount").innerText = data.volunteers;
  document.getElementById("donationsCount").innerText = data.donations;

  document.getElementById("donorsAnalytics").innerText = data.donors;
  document.getElementById("patientsAnalytics").innerText = data.patients;
  document.getElementById("volunteersAnalytics").innerText = data.volunteers;
  document.getElementById("donationsAnalytics").innerText = data.donations;

  const maxValue = Math.max(
    data.donors,
    data.patients,
    data.volunteers,
    data.donations,
    1
  );

  document.getElementById("donorsBar").style.width =
    (data.donors / maxValue) * 100 + "%";

  document.getElementById("patientsBar").style.width =
    (data.patients / maxValue) * 100 + "%";

  document.getElementById("volunteersBar").style.width =
    (data.volunteers / maxValue) * 100 + "%";

  document.getElementById("donationsBar").style.width =
    (data.donations / maxValue) * 100 + "%";
}

function showSection(sectionId) {
  document.querySelectorAll(".admin-section").forEach(section => {
    section.classList.add("hidden");
  });

  document.getElementById(sectionId).classList.remove("hidden");

  if (sectionId === "donors") loadDonors();
  if (sectionId === "patients") loadPatients();
  if (sectionId === "volunteers") loadVolunteers();
  if (sectionId === "donations") loadDonations();
  if (sectionId === "events") loadEvents();
  if (sectionId === "successStories") loadSuccessStories();
  if (sectionId === "gallery") loadGallery();
  if (sectionId === "contacts") loadContacts();
}

async function deleteRecord(type, id) {
  if (!confirm("Are you sure you want to delete this record?")) return;

  const res = await fetch(`${API_URL}/${type}/${id}`, { method: "DELETE" });
  const result = await res.json();

  alert(result.message);
  loadStats();

  if (type === "donors") loadDonors();
  if (type === "patients") loadPatients();
  if (type === "volunteers") loadVolunteers();
  if (type === "donations") loadDonations();
  if (type === "events") loadEvents();
  if (type === "success-stories") loadSuccessStories();
  if (type === "gallery") loadGallery();
  if (type === "contact") loadContacts();
}

async function loadDonors() {
  const res = await fetch(`${API_URL}/donors`);
  const data = await res.json();

  const search = document.getElementById("donorSearch")?.value.toLowerCase() || "";

  const filteredData = data.filter(donor =>
    donor.fullName.toLowerCase().includes(search) ||
    donor.bloodGroup.toLowerCase().includes(search) ||
    donor.phone.toLowerCase().includes(search) ||
    donor.city.toLowerCase().includes(search)
  );

  document.getElementById("donorsTable").innerHTML = `
    <tr>
      <th>Name</th>
      <th>Blood Group</th>
      <th>Phone</th>
      <th>City</th>
      <th>Action</th>
    </tr>
    ${filteredData.map(donor => `
      <tr>
        <td>${donor.fullName}</td>
        <td>${donor.bloodGroup}</td>
        <td>${donor.phone}</td>
        <td>${donor.city}</td>
        <td><button onclick="deleteRecord('donors', '${donor._id}')">Delete</button></td>
      </tr>
    `).join("")}
  `;
}

async function loadPatients() {
  const res = await fetch(`${API_URL}/patients`);
  const data = await res.json();

  const search = document.getElementById("patientSearch")?.value.toLowerCase() || "";

  const filteredData = data.filter(patient =>
    patient.patientName.toLowerCase().includes(search) ||
    patient.bloodGroup.toLowerCase().includes(search) ||
    patient.guardianName.toLowerCase().includes(search) ||
    patient.phone.toLowerCase().includes(search) ||
    patient.city.toLowerCase().includes(search) ||
    (patient.treatmentStatus || "").toLowerCase().includes(search)
  );

  document.getElementById("patientsTable").innerHTML = `
    <tr>
      <th>Name</th>
      <th>Age</th>
      <th>Blood Group</th>
      <th>Guardian</th>
      <th>Phone</th>
      <th>City</th>
      <th>Status</th>
      <th>Hospital</th>
      <th>Doctor</th>
      <th>Date</th>
      <th>Completed</th>
      <th>Update</th>
      <th>Delete</th>
    </tr>

    ${filteredData.map(patient => `
      <tr>
        <td>${patient.patientName}</td>
        <td>${patient.age}</td>
        <td>${patient.bloodGroup}</td>
        <td>${patient.guardianName}</td>
        <td>${patient.phone}</td>
        <td>${patient.city}</td>

        <td>
          <select id="status-${patient._id}">
            <option ${patient.treatmentStatus === "Registered" ? "selected" : ""}>Registered</option>
            <option ${patient.treatmentStatus === "Under Treatment" ? "selected" : ""}>Under Treatment</option>
            <option ${patient.treatmentStatus === "Karachi Visit Scheduled" ? "selected" : ""}>Karachi Visit Scheduled</option>
            <option ${patient.treatmentStatus === "Treatment Completed" ? "selected" : ""}>Treatment Completed</option>
            <option ${patient.treatmentStatus === "Follow-up Required" ? "selected" : ""}>Follow-up Required</option>
          </select>
        </td>

        <td><input type="text" id="hospital-${patient._id}" value="${patient.hospitalName || ""}"></td>
        <td><input type="text" id="doctor-${patient._id}" value="${patient.doctorName || ""}"></td>
        <td><input type="date" id="date-${patient._id}" value="${patient.treatmentDate || ""}"></td>

        <td>
          <select id="completed-${patient._id}">
            <option ${patient.treatmentCompleted === "No" ? "selected" : ""}>No</option>
            <option ${patient.treatmentCompleted === "Yes" ? "selected" : ""}>Yes</option>
          </select>
        </td>

        <td><button onclick="updateTreatment('${patient._id}')">Update</button></td>
        <td><button onclick="deleteRecord('patients', '${patient._id}')">Delete</button></td>
      </tr>
    `).join("")}
  `;
}

async function updateTreatment(id) {
  const treatmentData = {
    treatmentStatus: document.getElementById(`status-${id}`).value,
    hospitalName: document.getElementById(`hospital-${id}`).value,
    doctorName: document.getElementById(`doctor-${id}`).value,
    treatmentDate: document.getElementById(`date-${id}`).value,
    treatmentCompleted: document.getElementById(`completed-${id}`).value
  };

  const res = await fetch(`${API_URL}/patients/${id}/treatment`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(treatmentData)
  });

  const result = await res.json();
  alert(result.message);
  loadPatients();
}

async function loadVolunteers() {
  const res = await fetch(`${API_URL}/volunteers`);
  const data = await res.json();

  const search = document.getElementById("volunteerSearch")?.value.toLowerCase() || "";

  const filteredData = data.filter(volunteer =>
    volunteer.fullName.toLowerCase().includes(search) ||
    volunteer.phone.toLowerCase().includes(search) ||
    (volunteer.email || "").toLowerCase().includes(search) ||
    volunteer.city.toLowerCase().includes(search) ||
    volunteer.role.toLowerCase().includes(search)
  );

  document.getElementById("volunteersTable").innerHTML = `
    <tr>
      <th>Name</th>
      <th>Phone</th>
      <th>Email</th>
      <th>City</th>
      <th>Role</th>
      <th>Action</th>
    </tr>
    ${filteredData.map(volunteer => `
      <tr>
        <td>${volunteer.fullName}</td>
        <td>${volunteer.phone}</td>
        <td>${volunteer.email || ""}</td>
        <td>${volunteer.city}</td>
        <td>${volunteer.role}</td>
        <td><button onclick="deleteRecord('volunteers', '${volunteer._id}')">Delete</button></td>
      </tr>
    `).join("")}
  `;
}

async function loadDonations() {
  const res = await fetch(`${API_URL}/donations`);
  const data = await res.json();

  const search = document.getElementById("donationSearch")?.value.toLowerCase() || "";

  const filteredData = data.filter(donation =>
    donation.fullName.toLowerCase().includes(search) ||
    donation.phone.toLowerCase().includes(search) ||
    String(donation.amount).includes(search) ||
    donation.donationType.toLowerCase().includes(search) ||
    (donation.message || "").toLowerCase().includes(search)
  );

  document.getElementById("donationsTable").innerHTML = `
    <tr>
      <th>Name</th>
      <th>Phone</th>
      <th>Amount</th>
      <th>Type</th>
      <th>Message</th>
      <th>Action</th>
    </tr>
    ${filteredData.map(donation => `
      <tr>
        <td>${donation.fullName}</td>
        <td>${donation.phone}</td>
        <td>${donation.amount}</td>
        <td>${donation.donationType}</td>
        <td>${donation.message || ""}</td>
        <td><button onclick="deleteRecord('donations', '${donation._id}')">Delete</button></td>
      </tr>
    `).join("")}
  `;
}

async function loadEvents() {
  const res = await fetch(`${API_URL}/events`);
  const data = await res.json();

  document.getElementById("eventsTable").innerHTML = `
    <tr>
      <th>Title</th>
      <th>Date</th>
      <th>Location</th>
      <th>Image</th>
      <th>Action</th>
    </tr>
    ${data.map(event => `
      <tr>
        <td>${event.title}</td>
        <td>${event.date}</td>
        <td>${event.location}</td>
        <td>${event.image || ""}</td>
        <td><button onclick="deleteRecord('events', '${event._id}')">Delete</button></td>
      </tr>
    `).join("")}
  `;
}

async function loadSuccessStories() {
  const res = await fetch(`${API_URL}/success-stories`);
  const data = await res.json();

  document.getElementById("successStoriesTable").innerHTML = `
    <tr>
      <th>Patient Name</th>
      <th>Age</th>
      <th>City</th>
      <th>Status</th>
      <th>Action</th>
    </tr>

    ${data.map(story => `
      <tr>
        <td>${story.patientName}</td>
        <td>${story.age}</td>
        <td>${story.city}</td>
        <td>${story.status}</td>
        <td>
          <button onclick="deleteRecord('success-stories', '${story._id}')">
            Delete
          </button>
        </td>
      </tr>
    `).join("")}
  `;
}

async function loadGallery() {
  const res = await fetch(`${API_URL}/gallery`);
  const data = await res.json();

  document.getElementById("galleryTable").innerHTML = `
    <tr>
      <th>Title</th>
      <th>Type</th>
      <th>Description</th>
      <th>Action</th>
    </tr>
    ${data.map(item => `
      <tr>
        <td>${item.title}</td>
        <td>${item.fileType}</td>
        <td>${item.description}</td>
        <td><button onclick="deleteRecord('gallery', '${item._id}')">Delete</button></td>
      </tr>
    `).join("")}
  `;
}

async function loadContacts() {
  const res = await fetch(`${API_URL}/contact`);
  const data = await res.json();

  const search = document.getElementById("contactSearch")?.value.toLowerCase() || "";

  const filteredData = data.filter(contact =>
    contact.fullName.toLowerCase().includes(search) ||
    contact.email.toLowerCase().includes(search) ||
    (contact.phone || "").toLowerCase().includes(search) ||
    contact.message.toLowerCase().includes(search)
  );

  document.getElementById("contactsTable").innerHTML = `
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Phone</th>
      <th>Message</th>
      <th>Action</th>
    </tr>
    ${filteredData.map(contact => `
      <tr>
        <td>${contact.fullName}</td>
        <td>${contact.email}</td>
        <td>${contact.phone || ""}</td>
        <td>${contact.message}</td>
        <td><button onclick="deleteRecord('contact', '${contact._id}')">Delete</button></td>
      </tr>
    `).join("")}
  `;
}

function logout() {
  localStorage.removeItem("adminLoggedIn");
  window.location.href = "login.html";
}

loadStats();

window.addEventListener("DOMContentLoaded", () => {
  const eventForm = document.getElementById("eventForm");

  if (eventForm) {
    eventForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData();
      formData.append("title", document.getElementById("eventTitle").value);
      formData.append("date", document.getElementById("eventDate").value);
      formData.append("location", document.getElementById("eventLocation").value);
      formData.append("description", document.getElementById("eventDescription").value);

      const imageFile = document.getElementById("eventImage").files[0];

      if (imageFile) formData.append("image", imageFile);

      const res = await fetch(`${API_URL}/events`, {
        method: "POST",
        body: formData
      });

      const result = await res.json();
      alert(result.message);
      eventForm.reset();
      loadEvents();
    });
  }

  const successStoryForm = document.getElementById("successStoryForm");

  if (successStoryForm) {
    successStoryForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData();

      formData.append("patientName", document.getElementById("storyPatientName").value);
      formData.append("age", document.getElementById("storyAge").value);
      formData.append("city", document.getElementById("storyCity").value);
      formData.append("status", document.getElementById("storyStatus").value);
      formData.append("story", document.getElementById("storyText").value);

      const imageFile = document.getElementById("storyImage").files[0];

      if (imageFile) formData.append("image", imageFile);

      const res = await fetch(`${API_URL}/success-stories`, {
        method: "POST",
        body: formData
      });

      const result = await res.json();
      alert(result.message);
      successStoryForm.reset();
      loadSuccessStories();
    });
  }

  const galleryForm = document.getElementById("galleryForm");

  if (galleryForm) {
    galleryForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData();
      formData.append("title", document.getElementById("galleryTitle").value);
      formData.append("description", document.getElementById("galleryDescription").value);

      const mediaFile = document.getElementById("galleryMedia").files[0];

      if (mediaFile) formData.append("media", mediaFile);

      const res = await fetch(`${API_URL}/gallery`, {
        method: "POST",
        body: formData
      });

      const result = await res.json();
      alert(result.message);
      galleryForm.reset();
      loadGallery();
    });
  }
});

function exportTable(tableId, fileName) {
  const table = document.getElementById(tableId);
  let csv = [];

  for (let row of table.rows) {
    let rowData = [];

    for (let cell of row.cells) {
      let text = cell.innerText.replace(/,/g, " ");
      rowData.push(text);
    }

    csv.push(rowData.join(","));
  }

  const csvFile = new Blob([csv.join("\n")], {
    type: "text/csv"
  });

  const downloadLink = document.createElement("a");
  downloadLink.download = fileName;
  downloadLink.href = window.URL.createObjectURL(csvFile);
  downloadLink.click();
}



