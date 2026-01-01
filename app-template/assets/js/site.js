(function () {
  const body = document.body;
  const toggleBtn = document.getElementById("apSidebarToggle");
  const storageKey = "apSidebarCollapsed";

  function setCollapsed(isCollapsed) {
    body.classList.toggle("ap-sidebar-collapsed", isCollapsed);
    try {
      localStorage.setItem(storageKey, isCollapsed ? "1" : "0");
    } catch (e) {}
    initTooltips();
  }

  // Restore (desktop only)
  if (window.matchMedia("(min-width: 992px)").matches) {
    let saved = "0";
    try {
      saved = localStorage.getItem(storageKey) || "0";
    } catch (e) {}
    setCollapsed(saved === "1");
  }

  if (toggleBtn) {
    toggleBtn.addEventListener("click", function () {
      setCollapsed(!body.classList.contains("ap-sidebar-collapsed"));
    });
  }

  // Active nav
  const path = (
    location.pathname.split("/").pop() || "index.html"
  ).toLowerCase();
  document.querySelectorAll("[data-ap-nav] a.nav-link[href]").forEach((a) => {
    const href = (a.getAttribute("href") || "").toLowerCase().split("/").pop();
    if (href === path) a.classList.add("active");
  });

  function initTooltips() {
    if (typeof bootstrap === "undefined") return;

    const shouldEnable =
      window.matchMedia("(min-width: 992px)").matches &&
      body.classList.contains("ap-sidebar-collapsed");

    // Dispose existing
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((el) => {
      const inst = bootstrap.Tooltip.getInstance(el);
      if (inst) inst.dispose();
      el.removeAttribute("data-bs-toggle");
      el.removeAttribute("data-bs-placement");
    });

    if (!shouldEnable) return;

    document.querySelectorAll("[data-ap-tooltip]").forEach((el) => {
      el.setAttribute("data-bs-toggle", "tooltip");
      el.setAttribute("data-bs-placement", "left");
      new bootstrap.Tooltip(el);
    });
  }

  initTooltips();
  window.addEventListener("resize", initTooltips);
})();
// Multiple files counter
document
  .getElementById("multipleFiles")
  ?.addEventListener("change", function (e) {
    const count = e.target.files.length;
    const countEl = document.getElementById("filesCount");
    if (count > 0) {
      countEl.textContent = `تم اختيار ${count} ملف`;
      countEl.className = "form-text text-success";
    } else {
      countEl.textContent = "";
    }
  });

// Range slider color update
document.querySelectorAll(".ap-range-navy").forEach(function (range) {
  function updateRangeColor() {
    const value = ((range.value - range.min) / (range.max - range.min)) * 100;
    range.style.setProperty("--value", value + "%");
  }
  range.addEventListener("input", updateRangeColor);
  updateRangeColor(); // Initialize
});

// Toast Notifications
function showToast(type) {
  if (typeof bootstrap === "undefined") return;

  const toastContainer = document.getElementById("toastContainer");
  if (!toastContainer) return;

  const toastId = "toast-" + Date.now();
  const toastMessages = {
    success: { title: "نجاح!", message: "تمت العملية بنجاح.", icon: "check-circle" },
    error: { title: "خطأ!", message: "حدث خطأ أثناء العملية.", icon: "x-circle" },
    warning: { title: "تحذير!", message: "يرجى الانتباه لهذا التحذير.", icon: "exclamation-triangle" },
    info: { title: "معلومة", message: "هذه رسالة معلوماتية.", icon: "info-circle" },
  };

  const toastConfig = toastMessages[type] || toastMessages.info;
  const bgClass = type === "success" ? "bg-success" : type === "error" ? "bg-danger" : type === "warning" ? "bg-warning" : "bg-info";

  const toastHTML = `
    <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header ${bgClass} text-white">
        <i class="bi bi-${toastConfig.icon} me-2"></i>
        <strong class="me-auto">${toastConfig.title}</strong>
        <small>الآن</small>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body">
        ${toastConfig.message}
      </div>
    </div>
  `;

  toastContainer.insertAdjacentHTML("beforeend", toastHTML);

  const toastElement = document.getElementById(toastId);
  const bsToast = new bootstrap.Toast(toastElement, { delay: 3000 });
  bsToast.show();

  toastElement.addEventListener("hidden.bs.toast", function () {
    toastElement.remove();
  });
}

// Make showToast available globally
window.showToast = showToast;

// Wizard Modal functionality
let currentWizardStep = 1;
const totalSteps = 3;

function changeStep(direction) {
  currentWizardStep += direction;

  if (currentWizardStep < 1) currentWizardStep = 1;
  if (currentWizardStep > totalSteps) currentWizardStep = totalSteps;

  updateWizardUI();
}

function updateWizardUI() {
  // Hide all steps
  document.querySelectorAll(".wizard-step").forEach((step) => {
    step.classList.add("d-none");
  });

  // Show current step
  const currentStepEl = document.getElementById("step" + currentWizardStep);
  if (currentStepEl) {
    currentStepEl.classList.remove("d-none");
  }

  // Update progress
  const progressBar = document.getElementById("wizardProgress");
  const currentStepText = document.getElementById("currentStep");
  if (progressBar) {
    progressBar.style.width = ((currentWizardStep / totalSteps) * 100) + "%";
  }
  if (currentStepText) {
    currentStepText.textContent = currentWizardStep;
  }

  // Update buttons
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const finishBtn = document.getElementById("finishBtn");

  if (prevBtn) {
    prevBtn.style.display = currentWizardStep === 1 ? "none" : "inline-block";
  }

  if (nextBtn && finishBtn) {
    if (currentWizardStep === totalSteps) {
      nextBtn.classList.add("d-none");
      finishBtn.classList.remove("d-none");
      updateReviewData();
    } else {
      nextBtn.classList.remove("d-none");
      finishBtn.classList.add("d-none");
    }
  }
}

function updateReviewData() {
  const projectName = document.getElementById("projectName")?.value || "-";
  const projectDesc = document.getElementById("projectDesc")?.value || "-";
  const projectType = document.getElementById("projectType");
  const projectTypeText = projectType ? projectType.options[projectType.selectedIndex].text : "-";

  const reviewProjectName = document.getElementById("reviewProjectName");
  const reviewProjectDesc = document.getElementById("reviewProjectDesc");
  const reviewProjectType = document.getElementById("reviewProjectType");

  if (reviewProjectName) reviewProjectName.textContent = projectName;
  if (reviewProjectDesc) reviewProjectDesc.textContent = projectDesc;
  if (reviewProjectType) reviewProjectType.textContent = projectTypeText;
}

function finishWizard() {
  // Close modal
  const wizardModal = document.getElementById("wizardModal");
  if (wizardModal && typeof bootstrap !== "undefined") {
    const modalInstance = bootstrap.Modal.getInstance(wizardModal);
    if (modalInstance) {
      modalInstance.hide();
    }
  }

  // Show success toast
  setTimeout(() => {
    showToast("success");
  }, 300);

  // Reset wizard
  setTimeout(() => {
    currentWizardStep = 1;
    updateWizardUI();
    // Clear form
    const projectName = document.getElementById("projectName");
    const projectDesc = document.getElementById("projectDesc");
    const projectType = document.getElementById("projectType");
    if (projectName) projectName.value = "";
    if (projectDesc) projectDesc.value = "";
    if (projectType) projectType.selectedIndex = 0;
  }, 500);
}

// Reset wizard when modal is opened
document.addEventListener("DOMContentLoaded", function () {
  const wizardModal = document.getElementById("wizardModal");
  if (wizardModal) {
    wizardModal.addEventListener("show.bs.modal", function () {
      currentWizardStep = 1;
      updateWizardUI();
    });
  }
});

// Make functions globally available
window.changeStep = changeStep;
window.finishWizard = finishWizard;

// Pagination Table Example
const usersData = [
  { id: 1, name: "أحمد محمد", email: "ahmed@example.com", role: "مدير", status: "نشط" },
  { id: 2, name: "فاطمة علي", email: "fatima@example.com", role: "موظف", status: "نشط" },
  { id: 3, name: "محمود حسن", email: "mahmoud@example.com", role: "مستخدم", status: "غير نشط" },
  { id: 4, name: "سارة خالد", email: "sara@example.com", role: "موظف", status: "نشط" },
  { id: 5, name: "عمر يوسف", email: "omar@example.com", role: "مستخدم", status: "نشط" },
  { id: 6, name: "نور الدين", email: "nour@example.com", role: "مدير", status: "نشط" },
  { id: 7, name: "ليلى أحمد", email: "laila@example.com", role: "موظف", status: "غير نشط" },
  { id: 8, name: "ياسر عبدالله", email: "yasser@example.com", role: "مستخدم", status: "نشط" },
  { id: 9, name: "هدى سعيد", email: "huda@example.com", role: "موظف", status: "نشط" },
  { id: 10, name: "طارق محمود", email: "tarek@example.com", role: "مستخدم", status: "نشط" },
  { id: 11, name: "منى عبدالعزيز", email: "mona@example.com", role: "مدير", status: "نشط" },
  { id: 12, name: "خالد إبراهيم", email: "khaled@example.com", role: "موظف", status: "نشط" },
  { id: 13, name: "ريم فهد", email: "reem@example.com", role: "مستخدم", status: "غير نشط" },
  { id: 14, name: "سعيد عمر", email: "saeed@example.com", role: "موظف", status: "نشط" },
  { id: 15, name: "دينا سالم", email: "dina@example.com", role: "مستخدم", status: "نشط" },
  { id: 16, name: "وليد حسين", email: "waleed@example.com", role: "مدير", status: "نشط" },
  { id: 17, name: "رنا صالح", email: "rana@example.com", role: "موظف", status: "نشط" },
  { id: 18, name: "ماجد علي", email: "majed@example.com", role: "مستخدم", status: "نشط" },
  { id: 19, name: "نادية أحمد", email: "nadia@example.com", role: "موظف", status: "غير نشط" },
  { id: 20, name: "كريم محمد", email: "kareem@example.com", role: "مستخدم", status: "نشط" },
  { id: 21, name: "لمى حسن", email: "lama@example.com", role: "مدير", status: "نشط" },
  { id: 22, name: "زياد خالد", email: "ziad@example.com", role: "موظف", status: "نشط" },
  { id: 23, name: "سلمى يوسف", email: "salma@example.com", role: "مستخدم", status: "نشط" },
  { id: 24, name: "فيصل عبدالله", email: "faisal@example.com", role: "موظف", status: "نشط" },
  { id: 25, name: "ندى سعيد", email: "nada@example.com", role: "مستخدم", status: "غير نشط" },
  { id: 26, name: "حسام محمود", email: "hussam@example.com", role: "مدير", status: "نشط" },
  { id: 27, name: "شيماء عبدالعزيز", email: "shimaa@example.com", role: "موظف", status: "نشط" },
  { id: 28, name: "بلال إبراهيم", email: "bilal@example.com", role: "مستخدم", status: "نشط" },
  { id: 29, name: "هبة فهد", email: "heba@example.com", role: "موظف", status: "نشط" },
  { id: 30, name: "رامي عمر", email: "rami@example.com", role: "مستخدم", status: "نشط" },
  { id: 31, name: "إيمان سالم", email: "iman@example.com", role: "مدير", status: "غير نشط" },
  { id: 32, name: "عادل حسين", email: "adel@example.com", role: "موظف", status: "نشط" },
  { id: 33, name: "جميلة صالح", email: "jamila@example.com", role: "مستخدم", status: "نشط" },
  { id: 34, name: "أمير علي", email: "amir@example.com", role: "موظف", status: "نشط" },
  { id: 35, name: "سمية أحمد", email: "somaya@example.com", role: "مستخدم", status: "نشط" },
  { id: 36, name: "غسان محمد", email: "ghassan@example.com", role: "مدير", status: "نشط" },
  { id: 37, name: "روان حسن", email: "rawan@example.com", role: "موظف", status: "نشط" },
  { id: 38, name: "صلاح خالد", email: "salah@example.com", role: "مستخدم", status: "غير نشط" },
  { id: 39, name: "حنان يوسف", email: "hanan@example.com", role: "موظف", status: "نشط" },
  { id: 40, name: "جاسم عبدالله", email: "jasem@example.com", role: "مستخدم", status: "نشط" },
  { id: 41, name: "سميرة سعيد", email: "samira@example.com", role: "مدير", status: "نشط" },
  { id: 42, name: "نبيل محمود", email: "nabil@example.com", role: "موظف", status: "نشط" },
  { id: 43, name: "رشا عبدالعزيز", email: "rasha@example.com", role: "مستخدم", status: "نشط" },
  { id: 44, name: "طلال إبراهيم", email: "talal@example.com", role: "موظف", status: "نشط" },
  { id: 45, name: "عبير فهد", email: "abeer@example.com", role: "مستخدم", status: "غير نشط" },
  { id: 46, name: "ناصر عمر", email: "nasser@example.com", role: "مدير", status: "نشط" },
  { id: 47, name: "بسمة سالم", email: "basma@example.com", role: "موظف", status: "نشط" },
  { id: 48, name: "علاء حسين", email: "alaa@example.com", role: "مستخدم", status: "نشط" },
  { id: 49, name: "وفاء صالح", email: "wafaa@example.com", role: "موظف", status: "نشط" },
  { id: 50, name: "مراد علي", email: "murad@example.com", role: "مستخدم", status: "نشط" },
];

let currentPage = 1;
const itemsPerPage = 5;
const totalPages = Math.ceil(usersData.length / itemsPerPage);

function renderTable(page) {
  const tableBody = document.getElementById("paginatedTableBody");
  if (!tableBody) return;

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageData = usersData.slice(startIndex, endIndex);

  tableBody.innerHTML = "";
  pageData.forEach((user) => {
    const statusClass = user.status === "نشط" ? "success" : "secondary";
    const row = `
      <tr>
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.role}</td>
        <td><span class="badge bg-${statusClass}">${user.status}</span></td>
      </tr>
    `;
    tableBody.insertAdjacentHTML("beforeend", row);
  });

  updatePageInfo(startIndex + 1, Math.min(endIndex, usersData.length));
  renderPagination();
}

function updatePageInfo(start, end) {
  const pageInfo = document.getElementById("pageInfo");
  if (pageInfo) {
    pageInfo.textContent = `عرض ${start}-${end} من ${usersData.length} مستخدم`;
  }
}

function renderPagination() {
  const pagination = document.getElementById("tablePagination");
  if (!pagination) return;

  let paginationHTML = "";

  // Previous button
  paginationHTML += `
    <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
      <a class="page-link" href="#" onclick="changePage(${currentPage - 1}); return false;">
        السابق
      </a>
    </li>
  `;

  // Page numbers
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  // First page + ellipsis
  if (startPage > 1) {
    paginationHTML += `
      <li class="page-item">
        <a class="page-link" href="#" onclick="changePage(1); return false;">1</a>
      </li>
    `;
    if (startPage > 2) {
      paginationHTML += `<li class="page-item disabled"><a class="page-link" href="#">...</a></li>`;
    }
  }

  // Page numbers
  for (let i = startPage; i <= endPage; i++) {
    paginationHTML += `
      <li class="page-item ${i === currentPage ? "active" : ""}">
        <a class="page-link" href="#" onclick="changePage(${i}); return false;">${i}</a>
      </li>
    `;
  }

  // Ellipsis + last page
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      paginationHTML += `<li class="page-item disabled"><a class="page-link" href="#">...</a></li>`;
    }
    paginationHTML += `
      <li class="page-item">
        <a class="page-link" href="#" onclick="changePage(${totalPages}); return false;">${totalPages}</a>
      </li>
    `;
  }

  // Next button
  paginationHTML += `
    <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
      <a class="page-link" href="#" onclick="changePage(${currentPage + 1}); return false;">
        التالي
      </a>
    </li>
  `;

  pagination.innerHTML = paginationHTML;
}

function changePage(page) {
  if (page < 1 || page > totalPages) return;
  currentPage = page;
  renderTable(currentPage);
}

// Initialize pagination on page load
document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("paginatedTableBody")) {
    renderTable(currentPage);
  }
});

// Make changePage available globally
window.changePage = changePage;

// Icons Page - Search and Copy Functionality
function filterIcons() {
  const searchValue = document.getElementById("iconSearch")?.value.toLowerCase() || "";
  const iconItems = document.querySelectorAll(".icon-item");

  iconItems.forEach((item) => {
    const iconName = item.getAttribute("data-icon").toLowerCase();
    if (iconName.includes(searchValue)) {
      item.style.display = "";
    } else {
      item.style.display = "none";
    }
  });
}

function copyIconName(iconName) {
  // Copy to clipboard
  navigator.clipboard.writeText(iconName).then(() => {
    showIconToast(iconName);
  }).catch(() => {
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = iconName;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    showIconToast(iconName);
  });
}

function showIconToast(iconName) {
  if (typeof bootstrap === "undefined") return;

  const toastContainer = document.getElementById("iconToastContainer");
  if (!toastContainer) return;

  const toastId = "icon-toast-" + Date.now();

  const toastHTML = `
    <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header bg-success text-white">
        <i class="bi bi-check-circle me-2"></i>
        <strong class="me-auto">تم النسخ!</strong>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body">
        تم نسخ <strong>${iconName}</strong> إلى الحافظة
      </div>
    </div>
  `;

  toastContainer.insertAdjacentHTML("beforeend", toastHTML);

  const toastElement = document.getElementById(toastId);
  const bsToast = new bootstrap.Toast(toastElement, { delay: 2000 });
  bsToast.show();

  toastElement.addEventListener("hidden.bs.toast", function () {
    toastElement.remove();
  });
}

// Make functions globally available
window.filterIcons = filterIcons;
window.copyIconName = copyIconName;

// Alerts Page - Toast Notifications
function showAlertToast(type) {
  if (typeof bootstrap === "undefined") return;

  const toastContainer = document.getElementById("alertToastContainer");
  if (!toastContainer) return;

  const toastId = "alert-toast-" + Date.now();

  const toastMessages = {
    success: { title: "نجاح!", message: "تمت العملية بنجاح.", icon: "check-circle" },
    error: { title: "خطأ!", message: "حدث خطأ أثناء العملية.", icon: "x-circle" },
    warning: { title: "تحذير!", message: "يرجى الانتباه لهذا التحذير.", icon: "exclamation-triangle" },
    info: { title: "معلومة", message: "هذه رسالة معلوماتية.", icon: "info-circle" },
  };

  const toastConfig = toastMessages[type] || toastMessages.info;
  const bgClass = type === "success" ? "bg-success" : type === "error" ? "bg-danger" : type === "warning" ? "bg-warning" : "bg-info";

  const toastHTML = `
    <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header ${bgClass} text-white">
        <i class="bi bi-${toastConfig.icon} me-2"></i>
        <strong class="me-auto">${toastConfig.title}</strong>
        <small>الآن</small>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body">
        ${toastConfig.message}
      </div>
    </div>
  `;

  toastContainer.insertAdjacentHTML("beforeend", toastHTML);

  const toastElement = document.getElementById(toastId);
  const bsToast = new bootstrap.Toast(toastElement, { delay: 3000 });
  bsToast.show();

  toastElement.addEventListener("hidden.bs.toast", function () {
    toastElement.remove();
  });
}

// Alerts Page - Dynamic Alert Generator
function showDynamicAlert() {
  const alertType = document.getElementById("alertType")?.value || "success";
  const alertText = document.getElementById("alertText")?.value || "هذا مثال على التنبيه";
  const isDismissible = document.getElementById("alertDismissible")?.checked || false;
  const hasIcon = document.getElementById("alertIcon")?.checked || false;
  const container = document.getElementById("dynamicAlertContainer");

  if (!container) return;

  // Icon mapping
  const iconMap = {
    primary: "info-circle-fill",
    secondary: "dash-circle-fill",
    success: "check-circle-fill",
    danger: "x-circle-fill",
    warning: "exclamation-triangle-fill",
    info: "info-circle-fill"
  };

  const icon = hasIcon ? `<i class="bi bi-${iconMap[alertType]} me-2"></i>` : "";
  const dismissibleClass = isDismissible ? "alert-dismissible fade show" : "";
  const dismissButton = isDismissible ? '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' : "";

  const alertHTML = `
    <div class="alert alert-${alertType} ${dismissibleClass}" role="alert">
      ${icon}${alertText}
      ${dismissButton}
    </div>
  `;

  container.innerHTML = alertHTML;
}

// Make functions globally available
window.showAlertToast = showAlertToast;
window.showDynamicAlert = showDynamicAlert;
