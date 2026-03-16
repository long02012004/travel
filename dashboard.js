// dashboard.js - Handles rendering and interacting with trips on the dashboard

document.addEventListener('DOMContentLoaded', () => {
    // Show skeletons immediately
    renderSkeletons();
    
    // Simulate loading/initialization delay to show off skeletons
    setTimeout(() => {
        initializeDashboard();
        startCountdown(); // Start the dynamic countdown
        initMiniMap();    // Initialize the interactive map
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

    // 1. Initialize or Refresh Mock Data
    const existingTrips = JSON.parse(localStorage.getItem('userTrips'));
    const needsRefresh = !existingTrips || 
                         !existingTrips.some(t => t.preparationChecklist !== undefined) ||
                         existingTrips.length < 4;
    
    if (needsRefresh) {
        const mockTrips = [
            // Next trip (March 25, 2026)
            { 
                id: '1', 
                title: 'Khám phá Đà Nẵng', 
                dates: '25/03 - 30/03/2026', 
                locations: 8, 
                members: 4, 
                status: 'upcoming', 
                preparationChecklist: [
                    { id: 'step1', label: 'Vé máy bay', completed: true },
                    { id: 'step2', label: 'Khách sạn', completed: true },
                    { id: 'step3', label: 'Lịch trình', completed: false }
                ], 
                image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=800&auto=format&fit=crop', 
                timestamp: Date.now() - 100000 
            },
            // Trip in 3 weeks (April 10, 2026)
            { 
                id: '2', 
                title: 'Nghỉ dưỡng Hội An', 
                dates: '10/04 - 15/04/2026', 
                locations: 5, 
                members: 2, 
                status: 'upcoming', 
                preparationChecklist: [
                    { id: 'step1', label: 'Vé máy bay', completed: true },
                    { id: 'step2', label: 'Khách sạn', completed: false },
                    { id: 'step3', label: 'Lịch trình', completed: false }
                ], 
                image: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?q=80&w=800&auto=format&fit=crop', 
                timestamp: Date.now() - 200000 
            },
            // Past trip
            { 
                id: '3', 
                title: 'Mùa xuân Hà Nội', 
                dates: '01/03 - 05/03/2026', 
                locations: 12, 
                members: 3, 
                status: 'done', 
                preparationChecklist: [
                    { id: 'step1', label: 'Vé máy bay', completed: true },
                    { id: 'step2', label: 'Khách sạn', completed: true },
                    { id: 'step3', label: 'Lịch trình', completed: true }
                ], 
                image: 'https://images.unsplash.com/photo-1509030464402-dbad216ec7f1?q=80&w=800&auto=format&fit=crop', 
                timestamp: Date.now() - 300000 
            },
            // Future trip far away
            { 
                id: '4', 
                title: 'Phú Quốc Sunsets', 
                dates: '20/06 - 25/06/2026', 
                locations: 6, 
                members: 2, 
                status: 'upcoming', 
                preparationChecklist: [
                    { id: 'step1', label: 'Vé máy bay', completed: false },
                    { id: 'step2', label: 'Khách sạn', completed: false },
                    { id: 'step3', label: 'Lịch trình', completed: false }
                ], 
                image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=800&auto=format&fit=crop', 
                timestamp: Date.now() - 400000 
            }
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

        if (filteredTrips.length === 0) {
            // Creative Empty State
            html = `
            <div class="empty-state">
                <img src="images/empty_state.png" alt="No Trips" class="empty-illustration">
                <h2>Bắt đầu hành trình mới?</h2>
                <p>Thế giới có vô vàn điều kỳ diệu đang chờ bạn khám phá. Hãy bắt đầu bằng cách lên kế hoạch cho chuyến đi đầu tiên nhé!</p>
                <a href="planner.html" class="btn-cta-large">
                    <i class="ph-bold ph-plus"></i>
                    Tạo lịch trình ngay
                </a>
            </div>`;
            gridContainer.innerHTML = html;
            return;
        }

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

                    ${trip.status === 'upcoming' ? `
                    <div class="trip-preparation-checklist">
                        <div class="checklist-header">
                            <p class="checklist-title">Chuẩn bị chuyến đi</p>
                            <button class="add-item-btn" data-trip-id="${trip.id}" title="Thêm ghi chú mới">
                                <i class="ph-bold ph-plus"></i>
                            </button>
                        </div>
                        <div class="checklist-items">
                            ${(trip.preparationChecklist || []).map(item => `
                                <div class="checklist-item ${item.completed ? 'completed' : ''}" data-trip-id="${trip.id}" data-item-id="${item.id}">
                                    <div class="checkbox-wrapper">
                                        <i class="ph-bold ${item.completed ? 'ph-check-circle' : 'ph-circle'}"></i>
                                    </div>
                                    <span class="item-label">${item.label}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    ` : ''}

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

        // Attach Checklist Toggle Listeners
        document.querySelectorAll('.checklist-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const tripId = item.getAttribute('data-trip-id');
                const itemId = item.getAttribute('data-item-id');
                
                const tripIndex = allTrips.findIndex(t => t.id === tripId);
                if (tripIndex !== -1) {
                    const checklist = allTrips[tripIndex].preparationChecklist;
                    const itemIndex = checklist.findIndex(i => i.id === itemId);
                    if (itemIndex !== -1) {
                        checklist[itemIndex].completed = !checklist[itemIndex].completed;
                        localStorage.setItem('userTrips', JSON.stringify(allTrips));
                        renderTrips(); // Re-render to show changes
                    }
                }
            });
        });

        // Attach Add Checklist Item Listeners
        document.querySelectorAll('.add-item-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tripId = btn.getAttribute('data-trip-id');
                const newLabel = prompt('Nhập nội dung ghi chú mới:');
                
                if (newLabel && newLabel.trim() !== '') {
                    const tripIndex = allTrips.findIndex(t => t.id === tripId);
                    if (tripIndex !== -1) {
                        const newItem = {
                            id: 'custom-' + Date.now(),
                            label: newLabel.trim(),
                            completed: false
                        };
                        
                        // Ensure preparationChecklist exists
                        if (!allTrips[tripIndex].preparationChecklist) {
                            allTrips[tripIndex].preparationChecklist = [];
                        }
                        
                        allTrips[tripIndex].preparationChecklist.push(newItem);
                        localStorage.setItem('userTrips', JSON.stringify(allTrips));
                        renderTrips();
                    }
                }
            });
        });

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

// --- Countdown Management ---
let countdownInterval;

// Robust date parsing: '25/03 - 30/03/2026' -> Date object
function getStartDate(dateStr) {
    if (!dateStr) return new Date();
    const parts = dateStr.split('-');
    const firstPart = parts[0].trim(); // e.g. "25/03"
    
    // Extract year from the whole string
    const yearMatch = dateStr.match(/\d{4}/);
    const year = yearMatch ? yearMatch[0] : new Date().getFullYear();
    
    const dayMonth = firstPart.split('/');
    if (dayMonth.length < 2) return new Date();
    
    return new Date(`${dayMonth[1]}/${dayMonth[0]}/${year}`);
}

function startCountdown() {
    const update = () => {
        const allTrips = JSON.parse(localStorage.getItem('userTrips')) || [];
        const upcomingTrips = allTrips
            .filter(t => t.status === 'upcoming')
            .sort((a, b) => getStartDate(a.dates) - getStartDate(b.dates));

        const countdownWidget = document.getElementById('countdownWidget');
        if (upcomingTrips.length === 0 || !countdownWidget) {
            if (countdownWidget) countdownWidget.style.display = 'none';
            return;
        }

        const nextTrip = upcomingTrips[0];
        const targetDate = getStartDate(nextTrip.dates);
        const now = new Date();
        const diff = targetDate - now;

        if (diff <= 0) {
            countdownWidget.style.display = 'none';
            return;
        }

        countdownWidget.style.display = 'flex';
        document.getElementById('nextTripInfo').textContent = `Đến với: ${nextTrip.title}`;
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    };

    update();
    countdownInterval = setInterval(update, 1000);
}

// --- Mini Map Management ---
function initMiniMap() {
    const mapContainer = document.getElementById('miniMap');
    if (!mapContainer) return;

    // Initialize map with focus on Da Nang
    const map = L.map('miniMap', {
        zoomControl: false,
        attributionControl: false
    }).setView([16.0544, 108.2022], 12); // Detailed focus on Da Nang

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    // Mock coordinates for demo
    const locationCoords = {
        'Khám phá Đà Nẵng': [16.047079, 108.206230],
        'Mùa thu Hà Nội': [21.028511, 105.804817],
        'Nghỉ dưỡng Phú Quốc': [10.289879, 103.984020],
        'Tour ẩm thực Sài Gòn': [10.762622, 106.660172]
    };

    const allTrips = JSON.parse(localStorage.getItem('userTrips')) || [];
    const markers = [];

    allTrips.forEach(trip => {
        const coords = locationCoords[trip.title] || [16.0, 108.0];
        
        const markerIcon = L.divIcon({
            className: 'mini-map-marker-wrap',
            html: `<div class="mini-map-marker"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });

        const marker = L.marker(coords, { icon: markerIcon }).addTo(map);
        marker.bindPopup(`<b>${trip.title}</b><br>${trip.dates}`);
        markers.push(marker);
    });

    if (markers.length > 0) {
        const group = new L.featureGroup(markers);
        // Fit bounds with more padding to keep the perspective clear
        map.fitBounds(group.getBounds().pad(0.5));
    }
}
