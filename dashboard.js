// dashboard.js - Handles rendering and interacting with trips on the dashboard

document.addEventListener('DOMContentLoaded', () => {
    // Show skeletons immediately
    renderSkeletons();
    
    // Simulate loading/initialization delay to show off skeletons
    setTimeout(() => {
        initializeDashboard();
    }, 1000);
});

// --- Render Skeletons ---
function renderSkeletons() {
    const tripGrid = document.getElementById('tripGrid'); // Changed from .trip-grid to #tripGrid
    if (!tripGrid) return;

    let skeletonHtml = '';
    // Show 3 skeleton cards by default
    for (let i = 0; i < 3; i++) {
        skeletonHtml += `
        <div class="trip-card sleek-glass skeleton-card">
            <div class="card-visual skeleton skeleton-visual"></div>
            <div class="card-info">
                <div class="card-header-main">
                    <div class="skeleton skeleton-title"></div>
                    <div class="skeleton skeleton-date"></div>
                </div>
                <div class="card-meta-row">
                    <div class="skeleton skeleton-capsule"></div>
                    <div class="skeleton skeleton-capsule"></div>
                </div>
                <div class="card-footer-actions">
                    <div class="main-actions">
                        <div class="skeleton skeleton-btn"></div>
                        <div class="skeleton skeleton-btn"></div>
                    </div>
                    <div class="skeleton skeleton-btn"></div>
                </div>
            </div>
        </div>`;
    }
    
    // Add the "Add New" placeholder even during skeleton load
    skeletonHtml += `
    <div class="trip-card add-new">
        <div class="add-new-content">
            <i class="ph-bold ph-plus"></i>
            <span>Đang tải...</span>
        </div>
    </div>`;

    tripGrid.innerHTML = skeletonHtml;
}

// --- Initialize Dashboard ---
function initializeDashboard() {
    const gridContainer = document.getElementById('tripGrid');
    const searchInput = document.getElementById('searchInput');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

    // A. Theme Management
    const initTheme = () => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            if (themeIcon) themeIcon.className = 'ph-bold ph-sun';
        }
    };

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            
            if (themeIcon) {
                themeIcon.className = isDark ? 'ph-bold ph-sun' : 'ph-bold ph-moon';
            }
        });
    }

    initTheme();

    // 1. Initialize Mock Data if none exists
    if (!localStorage.getItem('userTrips')) {
        const mockTrips = [
            { id: '1', title: 'Khám phá Đà Nẵng', dates: '15/10 - 20/10/2023', locations: 8, members: 4, status: 'upcoming', image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=800&auto=format&fit=crop', timestamp: Date.now() - 100000 },
            { id: '2', title: 'Mùa thu Hà Nội', dates: '05/11 - 08/11/2023', locations: 5, members: 2, status: 'upcoming', image: 'https://images.unsplash.com/photo-1555921015-5532091f6026?q=80&w=800&auto=format&fit=crop', timestamp: Date.now() - 200000 },
            { id: '3', title: 'Nghỉ dưỡng Phú Quốc', dates: '22/12 - 26/12/2023', locations: 12, members: 6, status: 'done', image: 'https://images.unsplash.com/photo-1544413660-299165566b1d?q=80&w=800&auto=format&fit=crop', timestamp: Date.now() - 300000 },
            { id: '4', title: 'Tour ẩm thực Sài Gòn', dates: '10/01 - 12/01/2024', locations: 6, members: 3, status: 'done', image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=800&auto=format&fit=crop', timestamp: Date.now() - 400000 }
        ];
        localStorage.setItem('userTrips', JSON.stringify(mockTrips));
    }

    // 2. State Management
    let allTrips = JSON.parse(localStorage.getItem('userTrips')) || [];
    let currentFilter = 'all'; // all | upcoming | done
    let searchQuery = '';

    // 3. Render Function
    const renderTrips = () => {
        // Filter Data
        let filteredTrips = allTrips.filter(trip => {
            const matchesSearch = trip.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFilter = currentFilter === 'all' || trip.status === currentFilter;
            return matchesSearch && matchesFilter;
        });

        // Sort by timestamp descending (newest first)
        filteredTrips.sort((a, b) => b.timestamp - a.timestamp);

        // Build HTML
        let html = '';
        filteredTrips.forEach((trip, index) => {
            const statusIcon = trip.status === 'upcoming' ? 'ph-clock' : 'ph-check-circle';
            const statusText = trip.status === 'upcoming' ? 'Sắp tới' : 'Hoàn thành';
            const delay = index * 0.1;
            
            html += `
            <div class="trip-card sleek-glass" data-id="${trip.id}" style="animation-delay: ${delay}s">
                <div class="card-visual">
                    <img src="${trip.image}" alt="${trip.title}">
                    <div class="card-overlay">
                        <div class="status-tag ${trip.status}">
                            <i class="ph-fill ${statusIcon}"></i> ${statusText}
                        </div>
                    </div>
                </div>
                <div class="card-info">
                    <div class="card-header-main">
                        <h3 class="trip-title">${trip.title}</h3>
                        <p class="trip-date">${trip.dates}</p>
                    </div>
                    <div class="card-meta-row">
                        <div class="meta-capsule">
                            <i class="ph-bold ph-map-pin"></i> ${trip.locations} điểm
                        </div>
                        <div class="meta-capsule">
                            <i class="ph-bold ph-users"></i> ${trip.members} khách
                        </div>
                    </div>
                    <div class="card-footer-actions">
                        <div class="main-actions">
                            <a href="itinerary.html" class="btn-sleek primary" title="Xem chi tiết">
                                <i class="ph-bold ph-eye"></i>
                            </a>
                            <button class="btn-sleek" title="Chỉnh sửa">
                                <i class="ph-bold ph-pencil-simple-line"></i>
                            </button>
                        </div>
                        <button class="btn-sleek danger delete delete-trip-btn" data-id="${trip.id}" title="Xóa lịch trình">
                            <i class="ph-bold ph-trash"></i>
                        </button>
                    </div>
                </div>
            </div>`;
        });

        // Always show the Add New card at the end
        html += `
        <a href="planner.html" style="text-decoration:none;">
            <div class="trip-card add-new">
                <div class="add-icon">
                    <i class="ph-bold ph-plus"></i>
                </div>
                <h3>Thêm lịch trình mới</h3>
                <p>Lên kế hoạch cho hành trình tiếp theo của bạn.</p>
            </div>
        </a>`;

        gridContainer.innerHTML = html;

        // Attach Delete Listeners
        document.querySelectorAll('.delete-trip-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idToDelete = e.currentTarget.getAttribute('data-id');
                if (confirm('Bạn có chắc chắn muốn xóa lịch trình này không?')) {
                    allTrips = allTrips.filter(t => t.id !== idToDelete);
                    localStorage.setItem('userTrips', JSON.stringify(allTrips));
                    renderTrips();
                }
            });
        });
    };

    // 4. Attach Events
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            renderTrips();
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active to current
            e.target.classList.add('active');
            
            // Map text to filter state
            const text = e.target.textContent.trim().toLowerCase();
            if (text === 'tất cả') currentFilter = 'all';
            else if (text === 'sắp tới') currentFilter = 'upcoming';
            else if (text === 'đã xong') currentFilter = 'done';
            else currentFilter = 'all';

            renderTrips();
        });
    });

    if (gridContainer) {
        renderTrips();
    }
}
