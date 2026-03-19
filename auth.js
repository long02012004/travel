// auth.js - Simulate Backend Authentication using LocalStorage

document.addEventListener('DOMContentLoaded', () => {

    // --- Utility: Get Users ---
    const getUsers = () => {
        return JSON.parse(localStorage.getItem('tripPlannerUsers')) || [];
    };

    // --- Utility: Save Users ---
    const saveUsers = (users) => {
        localStorage.setItem('tripPlannerUsers', JSON.stringify(users));
    };

    // =============================================
    // --- 1. Registration Logic ---
    // =============================================
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // IDs match login.html: reg-fullname, reg-email, reg-password, reg-confirm
            const fullname = document.getElementById('reg-fullname').value.trim();
            const email = document.getElementById('reg-email').value.trim();
            const password = document.getElementById('reg-password').value;
            const confirmPassword = document.getElementById('reg-confirm').value;
            const termsChecked = document.getElementById('terms').checked;

            if (!fullname || !email || !password || !confirmPassword) {
                alert('Vui lòng điền đầy đủ thông tin!');
                return;
            }

            if (password.length < 6) {
                alert('Mật khẩu phải có ít nhất 6 ký tự!');
                return;
            }

            if (password !== confirmPassword) {
                alert('Mật khẩu xác nhận không khớp!');
                return;
            }

            if (!termsChecked) {
                alert('Bạn phải đồng ý với Điều khoản và Chính sách bảo mật!');
                return;
            }

            let users = getUsers();

            // Check if email exists
            const existingUser = users.find(u => u.email === email);
            if (existingUser) {
                alert('Email này đã được đăng ký!');
                return;
            }

            // Create new user (In a real app, passwords MUST be hashed)
            const newUser = {
                id: Date.now().toString(),
                fullname: fullname,
                email: email,
                password: password,
                createdAt: new Date().toISOString()
            };

            users.push(newUser);
            saveUsers(users);

            alert('Đăng ký thành công! Đang chuyển sang trang đăng nhập...');

            // Switch back to login form (both forms are on same page)
            const authContainer = document.getElementById('authContainer');
            if (authContainer) {
                authContainer.classList.remove('is-signup');
                document.title = 'Đăng nhập | AI Travel Planner';
            }
        });
    }

    // =============================================
    // --- 2. Login Logic ---
    // =============================================
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // IDs match login.html: login-email, login-password
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;

            if (!email || !password) {
                alert('Vui lòng nhập Email và Mật khẩu!');
                return;
            }

            let users = getUsers();
            // Validate credentials
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                // Success - Save session
                localStorage.setItem('currentUser', JSON.stringify({
                    id: user.id,
                    fullname: user.fullname,
                    email: user.email
                }));

                alert('Đăng nhập thành công!');
                window.location.href = 'index.html';
            } else {
                alert('Email hoặc mật khẩu không chính xác!');
            }
        });
    }

    // =============================================
    // --- 3. Auth Page Form Switching ---
    // =============================================
    const authContainer = document.getElementById('authContainer');
    const toRegister = document.getElementById('toRegister');
    const toLogin = document.getElementById('toLogin');

    if (toRegister && authContainer) {
        toRegister.addEventListener('click', () => {
            authContainer.classList.add('is-signup');
            document.title = 'Đăng ký | AI Travel Planner';
        });
    }
    if (toLogin && authContainer) {
        toLogin.addEventListener('click', () => {
            authContainer.classList.remove('is-signup');
            document.title = 'Đăng nhập | AI Travel Planner';
        });
    }

    // =============================================
    // --- 4. Global User UI Update ---
    // =============================================
    const updateUserUI = () => {
        const currentUserStr = localStorage.getItem('currentUser');
        const authContainer = document.querySelector('.nav-actions, .header-actions');

        if (currentUserStr) {
            const currentUser = JSON.parse(currentUserStr);
            const firstName = currentUser.fullname.split(' ').pop();

            // Update all name/email display elements
            document.querySelectorAll('.user-name').forEach(el => el.textContent = firstName);
            document.querySelectorAll('.user-display-name').forEach(el => el.textContent = currentUser.fullname);
            document.querySelectorAll('.user-email').forEach(el => el.textContent = currentUser.email);

            // Specific case for Dashboard Sidebar — show full name
            const sidebarName = document.querySelector('.sidebar .user-name');
            if (sidebarName) sidebarName.textContent = currentUser.fullname;

            // Show user dropdown, hide login/register buttons
            const userDropdown = document.querySelector('.user-dropdown');
            if (userDropdown) userDropdown.style.display = 'inline-block';

            if (authContainer) {
                authContainer.querySelectorAll('a[href="login.html"], a[href*="login.html?mode=register"]').forEach(btn => btn.style.display = 'none');
            }
        } else {
            // Not logged in
            const userDropdown = document.querySelector('.user-dropdown');
            const currentPath = window.location.pathname;
            const isProtectedPage = currentPath.includes('dashboard.html') ||
                                    currentPath.includes('planner.html') ||
                                    currentPath.includes('profile.html') ||
                                    currentPath.includes('admin.html');

            if (!isProtectedPage && authContainer) {
                if (userDropdown) userDropdown.style.display = 'none';
                
                // Show login/register buttons if they exist
                authContainer.querySelectorAll('a[href="login.html"], a[href*="login.html?mode=register"]').forEach(btn => btn.style.display = 'flex');

                // If auth container has no login button yet, add them (only if we are NOT on auth page)
                if (!isAuthPage && !authContainer.querySelector('a[href="login.html"]')) {
                    authContainer.innerHTML += `
                        <a href="login.html" class="btn btn-secondary" style="padding: 8px 16px; font-size: 0.9rem;">Đăng nhập</a>
                        <a href="login.html?mode=register" class="btn btn-primary" style="padding: 8px 16px; font-size: 0.9rem;">Đăng ký</a>
                    `;
                }
            }
        }
    };

    updateUserUI();

    // =============================================
    // --- 5. Page Protection & Redirects ---
    // =============================================
    const currentPath = window.location.pathname;
    const isProtectedPage = currentPath.includes('dashboard.html') ||
                            currentPath.includes('planner.html') ||
                            currentPath.includes('profile.html') ||
                            currentPath.includes('admin.html');
    const isAuthPage = currentPath.includes('login.html');
    const currentUserStr = localStorage.getItem('currentUser');

    if (isProtectedPage && !currentUserStr) {
        alert('Vui lòng đăng nhập để truy cập trang này!');
        window.location.href = 'login.html';
        return;
    }

    if (isAuthPage && currentUserStr) {
        window.location.href = 'index.html';
        return;
    }

    // Handle initial mode (login or register)
    if (isAuthPage && !currentUserStr) {
        const urlParams = new URLSearchParams(window.location.search);
        const mode = urlParams.get('mode');
        const authContainer = document.getElementById('authContainer');

        if (mode === 'register' && authContainer) {
            authContainer.classList.add('is-signup');
            document.title = 'Đăng ký | AI Travel Planner';
        }
    }

    // =============================================
    // --- 6. Password Visibility Toggle ---
    // =============================================
    const eyeIcons = document.querySelectorAll('.eye-icon');
    eyeIcons.forEach(icon => {
        icon.addEventListener('click', function () {
            const input = this.parentElement.querySelector('input');
            if (input) {
                if (input.type === 'password') {
                    input.type = 'text';
                    this.classList.replace('ph-eye', 'ph-eye-slash');
                } else {
                    input.type = 'password';
                    this.classList.replace('ph-eye-slash', 'ph-eye');
                }
            }
        });
    });

    // =============================================
    // --- 7. Global Logout Handler ---
    // =============================================
    document.addEventListener('click', (e) => {
        if (e.target.closest('.logout-item') || e.target.closest('#logoutBtn') || e.target.closest('.btn-logout')) {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            alert('Đã đăng xuất thành công!');
            window.location.href = 'index.html';
        }
    });
});
