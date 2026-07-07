(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const toast = (title, message = "This action is simulated for the frontend prototype.") => {
    let el = $(".toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      document.body.appendChild(el);
    }
    el.innerHTML = `<strong>${title}</strong><span>${message}</span>`;
    el.classList.add("show");
    clearTimeout(window.__gngToast);
    window.__gngToast = setTimeout(() => el.classList.remove("show"), 2800);
  };

  const header = $(".public-header");
  if (header) {
    const syncHeader = () => header.classList.toggle("scrolled", window.scrollY > 24);
    syncHeader();
    window.addEventListener("scroll", syncHeader, { passive: true });
  }

  const navToggle = $(".nav-toggle");
  const publicLinks = $(".public-links");
  const aboutDropdown = $(".nav-dropdown");
  const aboutDropdownToggle = $(".nav-dropdown-toggle");
  const closeAboutDropdown = () => {
    aboutDropdown?.classList.remove("open");
    aboutDropdownToggle?.setAttribute("aria-expanded", "false");
  };
  if (navToggle && publicLinks) {
    const setPublicNavigationOpen = open => {
      publicLinks.classList.toggle("open", open);
      document.body.classList.toggle("nav-open", open);
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
      navToggle.innerHTML = `<iconify-icon icon="lucide:${open ? "x" : "menu"}"></iconify-icon>`;
      if (!open) closeAboutDropdown();
    };
    navToggle.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      setPublicNavigationOpen(!publicLinks.classList.contains("open"));
    });
    publicLinks.addEventListener("click", event => {
      const selectedLink = event.target.closest("a");
      if (selectedLink) {
        selectedLink.blur();
        setPublicNavigationOpen(false);
      }
    });
    document.addEventListener("click", event => {
      if (publicLinks.classList.contains("open") && !publicLinks.contains(event.target) && !navToggle.contains(event.target)) {
        setPublicNavigationOpen(false);
      }
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && publicLinks.classList.contains("open")) {
        setPublicNavigationOpen(false);
        navToggle.focus();
      }
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 1120) {
        setPublicNavigationOpen(false);
      }
    });
  }

  if (aboutDropdown && aboutDropdownToggle) {
    aboutDropdownToggle.addEventListener("click", event => {
      event.stopPropagation();
      $$(".nav-dropdown.open").forEach(dropdown => {
        if (dropdown !== aboutDropdown) {
          dropdown.classList.remove("open");
          $(".nav-dropdown-toggle", dropdown)?.setAttribute("aria-expanded", "false");
        }
      });
      const open = aboutDropdown.classList.toggle("open");
      aboutDropdownToggle.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("click", event => {
      if (!aboutDropdown.contains(event.target)) closeAboutDropdown();
    });
  }

  const faqItems = $$(".faq-grid details");
  faqItems.forEach(item => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;
      faqItems.forEach(otherItem => {
        if (otherItem !== item) otherItem.open = false;
      });
    });
  });

  $$('[data-password-toggle]').forEach(button => {
    button.addEventListener("click", () => {
      const input = document.getElementById(button.dataset.passwordToggle);
      if (!input) return;
      const visible = input.type === "text";
      input.type = visible ? "password" : "text";
      button.innerHTML = `<iconify-icon icon="lucide:${visible ? "eye" : "eye-off"}"></iconify-icon>`;
      button.setAttribute("aria-label", visible ? "Show password" : "Hide password");
    });
  });

  const signupForm = $("#signup-form");
  if (signupForm) {
    const photo = $("#profile-image");
    const preview = $("#profile-preview");
    photo?.addEventListener("change", () => {
      const file = photo.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = event => preview.innerHTML = `<img src="${event.target.result}" alt="Selected profile preview">`;
      reader.readAsDataURL(file);
    });
    signupForm.addEventListener("submit", event => {
      event.preventDefault();
      const password = $("#signup-password")?.value;
      const confirmation = $("#confirm-password")?.value;
      if (password !== confirmation) {
        toast("Passwords do not match", "Please enter the same password in both fields.");
        return;
      }
      const data = Object.fromEntries(new FormData(signupForm).entries());
      delete data.password;
      delete data.confirmPassword;
      delete data.profileImage;
      localStorage.setItem("gngPrototypeMember", JSON.stringify(data));
      $("#signup-success")?.classList.add("show");
      signupForm.reset();
      if (preview) preview.innerHTML = '<iconify-icon icon="lucide:user-round"></iconify-icon>';
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    });
  }

  const loginForm = $("#login-form");
  if (loginForm) {
    const roleButtons = $$('[data-login-role]', loginForm);
    const emailInput = $("#login-email");
    const passwordInput = $("#login-password");
    const loginButton = $("#prototype-login-button");
    let selectedDashboard = "";

    const randomDigits = () => Math.floor(1000 + Math.random() * 9000);
    roleButtons.forEach(button => {
      button.addEventListener("click", () => {
        const role = button.dataset.loginRole;
        selectedDashboard = button.dataset.dashboard;
        roleButtons.forEach(item => {
          const active = item === button;
          item.classList.toggle("active", active);
          item.setAttribute("aria-pressed", String(active));
        });
        emailInput.value = `${role}.${randomDigits()}@gngfitness.demo`;
        passwordInput.value = `GNG-${role.toUpperCase()}-${randomDigits()}!`;
        loginButton.disabled = false;
        loginButton.innerHTML = `Continue as ${button.textContent.trim()} <iconify-icon icon="lucide:arrow-right"></iconify-icon>`;
      });
    });

    loginForm.addEventListener("submit", event => {
      event.preventDefault();
      if (!selectedDashboard) {
        toast("Select a prototype role", "Choose Member, Coach, Staff, or Super Admin to generate demo credentials.");
        return;
      }
      const email = emailInput?.value || "demo@gngfitness.ph";
      if ($("#remember-me")?.checked) localStorage.setItem("gngPrototypeEmail", email);
      window.location.href = selectedDashboard;
    });
  }

  const sidebar = $(".dashboard-sidebar");
  const sidebarToggle = $(".sidebar-toggle");
  if (sidebar && sidebarToggle) {
    const setSidebarOpen = open => {
      sidebar.classList.toggle("open", open);
      document.body.classList.toggle("sidebar-open", open);
      sidebarToggle.setAttribute("aria-expanded", String(open));
      sidebarToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    };
    sidebarToggle.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      setSidebarOpen(!sidebar.classList.contains("open"));
    });
    document.addEventListener("click", event => {
      if (window.innerWidth <= 1100 && sidebar.classList.contains("open") && !sidebar.contains(event.target) && !sidebarToggle.contains(event.target)) {
        setSidebarOpen(false);
      }
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && sidebar.classList.contains("open")) {
        setSidebarOpen(false);
        sidebarToggle.focus();
      }
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 1100) {
        setSidebarOpen(false);
      }
    });
  }

  const tabButtons = $$('[data-tab]');
  const panels = $$('[data-panel]');
  const title = $("#dashboard-page-title");
  const activateTab = id => {
    const button = tabButtons.find(item => item.dataset.tab === id);
    const panel = panels.find(item => item.dataset.panel === id);
    if (!button || !panel) return;
    tabButtons.forEach(item => item.classList.toggle("active", item === button));
    panels.forEach(item => item.classList.toggle("active", item === panel));
    if (title) title.textContent = button.dataset.title || button.textContent.trim();
    history.replaceState(null, "", `#${id}`);
    sidebar?.classList.remove("open");
    document.body.classList.remove("sidebar-open");
    sidebarToggle?.setAttribute("aria-expanded", "false");
    sidebarToggle?.setAttribute("aria-label", "Open navigation");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  tabButtons.forEach(button => button.addEventListener("click", () => activateTab(button.dataset.tab)));
  if (tabButtons.length) {
    const initial = location.hash.slice(1);
    activateTab(tabButtons.some(button => button.dataset.tab === initial) ? initial : tabButtons[0].dataset.tab);
  }

  $$('[data-demo-action]').forEach(button => {
    button.addEventListener("click", () => toast(button.dataset.demoAction || "Prototype action"));
  });

  $$('[data-status-action]').forEach(button => {
    button.addEventListener("click", () => {
      const row = button.closest("tr");
      const badge = row?.querySelector("[data-status]");
      const status = button.dataset.statusAction;
      if (badge) {
        badge.textContent = status;
        badge.className = `badge ${status === "Verified" || status === "Approved" ? "success" : "danger"}`;
        badge.dataset.status = "";
      }
      toast(`Payment ${status.toLowerCase()}`, "The queue was updated locally for this demo session.");
    });
  });

  $$('[data-table-search]').forEach(input => {
    input.addEventListener("input", () => {
      const table = document.getElementById(input.dataset.tableSearch);
      const term = input.value.toLowerCase().trim();
      $$('tbody tr', table).forEach(row => row.hidden = !row.textContent.toLowerCase().includes(term));
    });
  });

  $$('[data-table-filter]').forEach(select => {
    select.addEventListener("change", () => {
      const table = document.getElementById(select.dataset.tableFilter);
      const value = select.value.toLowerCase();
      $$('tbody tr', table).forEach(row => row.hidden = value !== "all" && !row.textContent.toLowerCase().includes(value));
    });
  });

  $$('[data-mock-form]').forEach(form => {
    form.addEventListener("submit", event => {
      event.preventDefault();
      toast(form.dataset.success || "Saved successfully. Prototype only.");
      if (form.dataset.reset !== "false") form.reset();
    });
  });

  $$('[data-open-modal]').forEach(button => {
    button.addEventListener("click", () => document.getElementById(button.dataset.openModal)?.showModal());
  });
  $$('[data-close-modal]').forEach(button => {
    button.addEventListener("click", () => button.closest("dialog")?.close());
  });

  $$('[data-staff-payment]').forEach(button => {
    button.addEventListener("click", () => {
      const badge = button.closest("tr")?.querySelector("[data-staff-status]");
      if (badge) {
        badge.textContent = "Received by Staff";
        badge.className = "badge info";
        badge.dataset.staffStatus = "";
      }
      toast("Payment marked as Received by Staff", "Final verification remains with Super Admin.");
    });
  });

  const healthForm = $("#health-assessment-form");
  if (healthForm) {
    healthForm.addEventListener("change", () => {
      const count = $$('input:checked', healthForm).length;
      const result = $("#health-result");
      const label = $("#health-result-label");
      result.className = `result-card ${count >= 3 ? "danger" : count ? "warning" : ""}`;
      label.textContent = count >= 3 ? "Medical Clearance Required" : count ? "Proceed with Caution" : "Fit to Workout";
    });
  }

  const bodyForm = $("#body-assessment-form");
  if (bodyForm) {
    bodyForm.addEventListener("input", () => {
      const height = Number($("#body-height")?.value) / 100;
      const weight = Number($("#body-weight")?.value);
      const bmi = height && weight ? (weight / (height * height)).toFixed(1) : "24.1";
      if ($("#bmi-value")) $("#bmi-value").textContent = bmi;
    });
  }

  $$('input[type="file"][data-file-label]').forEach(input => {
    input.addEventListener("change", () => {
      const target = document.getElementById(input.dataset.fileLabel);
      if (target) target.textContent = input.files?.[0]?.name || "No file selected";
      toast("File selected", "The file remains on this device and is not uploaded anywhere.");
    });
  });

  window.GNGPrototype = { toast, activateTab };
})();
