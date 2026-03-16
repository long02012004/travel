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

    // --- 1. Registration Logic ---
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const fullname = document.getElementById('fullname').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const termsChecked = document.getElementById('terms').checked;

            if (!fullname || !email || !password || !confirmPassword) {
                alert('Vui lòng điền đầy đủ thông tin!');
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

            alert('Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập...');
            window.location.href = 'login.html';
        });
    }

    // --- 2. Login Logic ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;

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

    // --- 3. Protected Pages Logic (Dashboard/Planner) ---
    const currentPath = window.location.pathname;
    const isProtectedPage = currentPath.includes('dashboard.html') || currentPath.includes('planner.html');
    const isAuthPage = currentPath.includes('login.html') || currentPath.includes('register.html');

    // Check current session
    const currentUserStr = localStorage.getItem('currentUser');

    if (isProtectedPage) {
        if (!currentUserStr) {
            // Not logged in! Redirect to login
            alert('Vui lòng đăng nhập để truy cập trang này!');
            window.location.href = 'login.html';
            return;
        }

        const currentUser = JSON.parse(currentUserStr);

        // Update User Profile UI where applicable
        const userNameDisplays = document.querySelectorAll('.user-name, .user-name-display');
        const userEmailDisplays = document.querySelectorAll('.user-email, .user-email-display');

        userNameDisplays.forEach(el => el.textContent = currentUser.fullname);
        userEmailDisplays.forEach(el => el.textContent = currentUser.email);

        // Setup Logout functionality (finding any element with id='logoutBtn' or class='btn-logout')
        const logoutBtns = document.querySelectorAll('.btn-logout, #logoutBtn');
        logoutBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('currentUser');
                alert('Đã đăng xuất thành công!');
                window.location.href = 'login.html';
            });
        });

    } else if (isAuthPage) {
        // If already logged in and trying to reach login/register, redirect to dashboard
        if (currentUserStr) {
            window.location.href = 'dashboard.html';
        }
    }

    // --- 4. Landing Page Logic (index.html) ---
    const isIndexPage = currentPath.endsWith('index.html') || currentPath === '/' || currentPath.endsWith('\\');
    if (isIndexPage && currentUserStr) {
        const currentUser = JSON.parse(currentUserStr);
        // Replace login button in header
        const navLinksHtml = document.querySelector('.nav-links');
        const loginBtnHtml = document.querySelector('.login-btn');
        const headerContainer = document.querySelector('.nav-container');

        if (headerContainer && loginBtnHtml) {
            const userControls = document.createElement('div');
            userControls.style.display = 'flex';
            userControls.style.alignItems = 'center';
            userControls.style.gap = '16px';

            // Extract first name
            const firstName = currentUser.fullname.split(' ').pop();

            userControls.innerHTML = `
                <span style="font-weight: 600; color: var(--text-dark);">Hi, ${firstName}</span>
                <a href="dashboard.html" class="btn btn-primary" style="padding: 10px 24px; text-decoration: none;">Dashboard</a>
                <a href="#" id="indexLogoutBtn" style="color: var(--text-gray); font-size: 0.9rem; text-decoration: none; font-weight: 600;">Đăng xuất</a>
             `;

            // Remove old login button
            loginBtnHtml.remove();
            headerContainer.appendChild(userControls);

            document.getElementById('indexLogoutBtn').addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('currentUser');
                window.location.reload();
            });
        }
    }
});
