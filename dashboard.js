// dashboard.js - Handles rendering and interacting with trips on the dashboard

document.addEventListener('DOMContentLoaded', () => {
    // Show skeletons immediately
    renderSkeletons();
    
    // Simulate loading/initialization delay to show off skeletons
    setTimeout(() => {
        initializeDashboard();
        startClock();      // Start real-time digital clock
        startCountdown();  // Start trip countdown with progress bar
        initMiniMap();     // Initialize the interactive map
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

    // Theme is now handled by theme.js universally

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
                lat: 16.0471, lng: 108.2062,
                locations: 8, 
                members: 4, 
                status: 'upcoming', 
                daysCount: 6,
                activitiesCount: 15,
                hotelsCount: 2,
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
                lat: 15.8801, lng: 108.3380,
                locations: 5, 
                members: 2, 
                status: 'upcoming', 
                daysCount: 6,
                activitiesCount: 12,
                hotelsCount: 2,
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
                lat: 21.0285, lng: 105.8542,
                locations: 12, 
                members: 3, 
                status: 'done', 
                daysCount: 5,
                activitiesCount: 10,
                hotelsCount: 2,
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
                lat: 10.2899, lng: 103.9840,
                locations: 6, 
                members: 2, 
                status: 'upcoming', 
                daysCount: 6,
                activitiesCount: 18,
                hotelsCount: 3,
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

                    <!-- Trip Stats Row -->
                    <div class="trip-stats-row">
                        <div class="stat-item">
                            <i class="ph-fill ph-calendar-check"></i>
                            <span>${trip.daysCount || 3} ngày</span>
                        </div>
                        <div class="stat-item">
                            <i class="ph-fill ph-list-checks"></i>
                            <span>${trip.activitiesCount || 5} hoạt động</span>
                        </div>
                        <div class="stat-item">
                            <i class="ph-fill ph-bed"></i>
                            <span>${trip.hotelsCount || 2} khách sạn</span>
                        </div>
                    </div>

                    <div class="trip-preparation-checklist">
                        <div class="checklist-header">
                            <p class="checklist-title">Chuẩn bị chuyến đi</p>
                            <button class="add-item-btn" data-trip-id="${trip.id}" title="Thêm ghi chú mới">
                                <i class="ph-bold ph-plus"></i>
                            </button>
                        </div>
                        <div class="checklist-items">
                            ${(() => {
                                // Default items if missing
                                const checklist = trip.preparationChecklist || [
                                    { id: 'step1', label: 'Vé máy bay', completed: false },
                                    { id: 'step2', label: 'Khách sạn', completed: false },
                                    { id: 'step3', label: 'Lịch trình', completed: false }
                                ];
                                return checklist.map(item => `
                                    <div class="checklist-item ${item.completed ? 'completed' : ''}" data-trip-id="${trip.id}" data-item-id="${item.id}">
                                        <div class="checkbox-wrapper">
                                            <i class="ph-bold ${item.completed ? 'ph-check-circle' : 'ph-circle'}"></i>
                                        </div>
                                        <span class="item-label">${item.label}</span>
                                    </div>
                                `).join('');
                            })()}
                        </div>
                    </div>

                    <div class="card-footer-actions">
                        <div class="main-actions">
                            <a href="itinerary.html" class="btn-sleek primary" title="Xem chi tiết">
                                <i class="ph-bold ph-eye"></i>
                            </a>
                            <button class="btn-sleek edit-trip-btn" title="Chỉnh sửa">
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
                    // Ensure preparationChecklist exists before toggling
                    if (!allTrips[tripIndex].preparationChecklist) {
                        allTrips[tripIndex].preparationChecklist = [
                            { id: 'step1', label: 'Vé máy bay', completed: false },
                            { id: 'step2', label: 'Khách sạn', completed: false },
                            { id: 'step3', label: 'Lịch trình', completed: false }
                        ];
                    }
                    
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

        // Attach Edit Redirect Listeners
        document.querySelectorAll('.edit-trip-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tripId = btn.closest('.trip-card').getAttribute('data-id');
                window.location.href = `planner.html?editId=${tripId}`;
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
    
    // Create date as DD/MM/YYYY
    const d = parseInt(dayMonth[0]);
    const m = parseInt(dayMonth[1]) - 1; // JS months are 0-11
    return new Date(year, m, d);
}

// --- Real-time Clock Station ---
function startClock() {
    const station = document.getElementById('dashboardClockWidget');
    if (station) {
        // Subtle Parallax Effect
        station.addEventListener('mousemove', (e) => {
            const rect = station.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const moveX = (x - centerX) / 40;
            const moveY = (y - centerY) / 20;
            
            station.style.transform = `translateY(-5px) perspective(1000px) rotateX(${-moveY}deg) rotateY(${moveX}deg)`;
        });
        
        station.addEventListener('mouseleave', () => {
            station.style.transform = `translateY(0) rotateX(0) rotateY(0)`;
        });
    }

    const update = () => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getHours() >= 0 ? now.getMinutes() : 0).padStart(2, '0'); // Safety
        const seconds = String(now.getSeconds()).padStart(2, '0');

        // Update Clock
        const hEl = document.getElementById('clockHours');
        const mEl = document.getElementById('clockMinutes');
        const sEl = document.getElementById('clockSeconds');
        
        if (hEl) hEl.textContent = hours;
        if (mEl) mEl.textContent = minutes;
        if (sEl) sEl.textContent = seconds;

        // Update Greeting & Icon
        const hour = now.getHours();
        const gText = document.getElementById('greetingText');
        const gIcon = document.getElementById('greetingIcon');
        
        if (gText && gIcon) {
            if (hour >= 5 && hour < 12) {
                gText.textContent = 'Chào buổi sáng,';
                gIcon.className = 'ph-fill ph-sun';
                gIcon.style.color = '#fbbf24';
            } else if (hour >= 12 && hour < 18) {
                gText.textContent = 'Chào buổi chiều,';
                gIcon.className = 'ph-fill ph-cloud-sun';
                gIcon.style.color = '#f97316';
            } else {
                gText.textContent = 'Chào buổi tối,';
                gIcon.className = 'ph-fill ph-moon-stars';
                gIcon.style.color = '#818cf8';
            }
        }

        // Update Date String
        const dateEl = document.getElementById('currentDate');
        if (dateEl) {
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            dateEl.textContent = now.toLocaleDateString('vi-VN', options);
        }
    };
    
    update();
    setInterval(update, 1000);
}

function startCountdown() {
    const update = () => {
        const allTrips = JSON.parse(localStorage.getItem('userTrips')) || [];
        const upcomingTrips = allTrips
            .filter(t => t.status === 'upcoming')
            .sort((a, b) => getStartDate(a.dates) - getStartDate(b.dates));

        const clockWidget = document.getElementById('dashboardClockWidget');
        if (!clockWidget) return;

        // Clock is always visible now
        clockWidget.style.display = 'flex';

        const tripSection = clockWidget.querySelector('.station-right');
        if (upcomingTrips.length === 0) {
            if (tripSection) tripSection.style.display = 'none';
            return;
        }

        if (tripSection) tripSection.style.display = 'block';

        const nextTrip = upcomingTrips[0];
        const targetDate = getStartDate(nextTrip.dates);
        const now = new Date();
        const diff = targetDate - now;

        document.getElementById('nextTripName').textContent = nextTrip.title;

        if (diff <= 0) {
            // Trip has started
            document.getElementById('miniDays').textContent = '00';
            document.getElementById('miniHours').textContent = '00';
            document.getElementById('miniMinutes').textContent = '00';
            document.getElementById('miniSeconds').textContent = '00';
            document.getElementById('tripProgressBar').style.width = '100%';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('miniDays').textContent = String(days).padStart(2, '0');
        document.getElementById('miniHours').textContent = String(hours).padStart(2, '0');
        document.getElementById('miniMinutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('miniSeconds').textContent = String(seconds).padStart(2, '0');

        // Progress bar simulation: 
        // We'll say the trip preparation starts 30 days before
        const totalDuration = 30 * 24 * 60 * 60 * 1000;
        const progress = Math.max(0, Math.min(100, (1 - (diff / totalDuration)) * 100));
        document.getElementById('tripProgressBar').style.width = `${progress}%`;
    };

    update();
    countdownInterval = setInterval(update, 1000);
}

// --- Mini Map Management ---
function initMiniMap() {
    const mapContainer = document.getElementById('miniMap');
    if (!mapContainer) return;

    // Use a more beautiful tile layer (CartoDB Positron is very clean)
    const map = L.map('miniMap', {
        zoomControl: false,
        attributionControl: false
    }).setView([16.0471, 108.2062], 12);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);

    const allTrips = JSON.parse(localStorage.getItem('userTrips')) || [];
    const markers = [];

    allTrips.forEach(trip => {
        // Use coordinates from trip object if they exist, otherwise fallback
        const lat = trip.lat || 16.0;
        const lng = trip.lng || 108.0;
        
        const markerIcon = L.divIcon({
            className: 'mini-map-marker-wrap',
            html: `<div class="mini-map-marker active">
                     <i class="ph-fill ph-map-pin"></i>
                   </div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 30]
        });

        const marker = L.marker([lat, lng], { icon: markerIcon }).addTo(map);
        
        const popupContent = `
            <div class="map-popup">
                <div class="popup-img" style="background-image: url('${trip.image}')"></div>
                <div class="popup-info">
                    <h5>${trip.title}</h5>
                    <p><i class="ph ph-calendar"></i> ${trip.dates}</p>
                    <div class="popup-status ${trip.status}">${trip.status === 'upcoming' ? 'Sắp tới' : 'Đã xong'}</div>
                </div>
            </div>
        `;
        
        marker.bindPopup(popupContent, {
            maxWidth: 220,
            className: 'custom-glass-popup'
        });
        markers.push(marker);
    });

    if (markers.length > 0) {
        const group = new L.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.3));
    }
}
