# GNG Fitness Website and Management System Prototype

A complete frontend-only presentation prototype built with HTML, CSS, and vanilla JavaScript.

## Demo flow

1. Open `index.html`.
2. Choose **Sign Up** to preview member onboarding, or **Login** to continue directly.
3. Choose Member, Coach, Staff, or Super Admin directly on the login page.
4. The prototype generates demo credentials automatically.
5. Select **Continue** to open the matching dashboard.
6. Use **Logout** to return to the prototype login page.

## Pages

- `index.html` — public gym website
- `signup.html` — prototype member registration
- `login.html` — mock login with integrated role preview and generated credentials
- `role-selection.html` — legacy standalone role-preview page (not used in the main flow)
- `member-dashboard.html` — member portal
- `coach-dashboard.html` — coaching workspace
- `staff-dashboard.html` — front desk workspace
- `admin-dashboard.html` — super admin management system

## Prototype behavior

- No backend, database, API, authentication server, or payment gateway is used.
- Dashboard data is static sample data.
- Signup stores non-sensitive demo profile fields temporarily in `localStorage`.
- Profile and payment images are previewed or named locally and are never uploaded.
- Buttons display simulated feedback and do not perform real business operations.

Open `index.html` directly in a modern browser. No build or installation step is required.
