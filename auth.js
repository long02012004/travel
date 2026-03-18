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

    // --- 3. Global User UI Update ---
    const updateUserUI = () => {
        const currentUserStr = localStorage.getItem('currentUser');
        const headerActions = document.querySelector('.header-actions');
        
        if (currentUserStr) {
            const currentUser = JSON.parse(currentUserStr);
            const firstName = currentUser.fullname.split(' ').pop();

            // 1. Update all name displays
            document.querySelectorAll('.user-name').forEach(el => el.textContent = firstName);
            document.querySelectorAll('.user-display-name').forEach(el => el.textContent = currentUser.fullname);
            document.querySelectorAll('.user-email').forEach(el => el.textContent = currentUser.email);

            // 2. Specific case for Dashboard Sidebar where we want full name
            const sidebarName = document.querySelector('.sidebar .user-name');
            if (sidebarName) sidebarName.textContent = currentUser.fullname;

            // 3. Ensure dropdown is visible and login buttons are hidden (if they exist in the same container)
            const userDropdown = document.querySelector('.user-dropdown');
            if (userDropdown) userDropdown.style.display = 'inline-block';
            
            // Hide any landing page login buttons if we are logged in
            const loginBtns = document.querySelectorAll('.login-btn, .cta-btn, .btn-secondary, .btn-primary');
            // Only hide those that are specifically for login/register in the header
            if (headerActions) {
                 headerActions.querySelectorAll('a[href="login.html"], a[href="register.html"]').forEach(btn => btn.style.display = 'none');
            }
        } else {
            // Not logged in
            const userDropdown = document.querySelector('.user-dropdown');
            
            // If we are on a landing page or public page, show login buttons instead of dropdown
            const currentPath = window.location.pathname;
            const isProtectedPage = currentPath.includes('dashboard.html') || currentPath.includes('planner.html') || currentPath.includes('profile.html');

            if (!isProtectedPage && userDropdown && headerActions) {
                userDropdown.style.display = 'none';
                
                // If login buttons aren't there, we might want to add them or they might be hidden
                headerActions.querySelectorAll('a[href="login.html"], a[href="register.html"]').forEach(btn => btn.style.display = 'flex');
                
                // If header-actions is empty except for the hidden dropdown, add default buttons
                if (headerActions.children.length <= 1 && !headerActions.querySelector('a[href="login.html"]')) {
                    headerActions.innerHTML += `
                        <a href="login.html" class="btn btn-secondary" style="padding: 8px 16px; font-size: 0.9rem;">Đăng nhập</a>
                        <a href="register.html" class="btn btn-primary" style="padding: 8px 16px; font-size: 0.9rem;">Đăng ký</a>
                    `;
                }
            }
        }
    };

    updateUserUI();

    // --- 4. Page Protection & Redirects ---
    const currentPath = window.location.pathname;
    const isProtectedPage = currentPath.includes('dashboard.html') || 
                           currentPath.includes('planner.html') || 
                           currentPath.includes('profile.html') ||
                           currentPath.includes('admin.html');
    const isAuthPage = currentPath.includes('login.html') || currentPath.includes('register.html');
    const currentUserStr = localStorage.getItem('currentUser');

    if (isProtectedPage && !currentUserStr) {
        alert('Vui lòng đăng nhập để truy cập trang này!');
        window.location.href = 'login.html';
        return;
    }

    if (isAuthPage && currentUserStr) {
        window.location.href = 'index.html';
    }

    // --- 5. Global Logout ---
    document.addEventListener('click', (e) => {
        if (e.target.closest('.logout-item') || e.target.closest('#logoutBtn') || e.target.closest('.btn-logout')) {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            alert('Đã đăng xuất thành công!');
            window.location.href = 'index.html';
        }
    });
});
