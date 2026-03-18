/**
 * Shared App Logic (app.js)
 * Handles UI interactions for Explore, Destination, and Itinerary pages.
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Explore Page - Search & Category Filtering logic removed (now in explore.js)


    // 2. Favorite (Heart) Toggle Logic
    const saveButtons = document.querySelectorAll('.btn-save-place, .btn-icon-circle');
    saveButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); 
            e.stopPropagation();

            const icon = btn.querySelector('i');
            if (icon && icon.classList.contains('ph-heart')) {
                const isSaved = icon.classList.contains('saved');
                if (isSaved) {
                    icon.style.color = '#e2e8f0'; 
                    icon.classList.remove('saved');
                } else {
                    icon.style.color = '#ef4444'; 
                    icon.classList.add('saved');
                }
            }
        });
    });

    // 3. Itinerary Day Tabs Logic
    const itineraryTabs = document.querySelectorAll('.iti-tab');
    if (itineraryTabs.length > 0) {
        itineraryTabs.forEach((tab, index) => {
            tab.addEventListener('click', () => {
                itineraryTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                const timeline = document.querySelector('.iti-timeline');
                if(timeline) {
                   timeline.style.opacity = '0';
                   setTimeout(() => { 
                       // Mock change of content
                       if (index === 1) { // Day 2
                           const firstEventTitle = timeline.querySelector('.event-title');
                           if(firstEventTitle) firstEventTitle.textContent = "Cà Phê Cheo Veooo";
                       } else if (index === 2) { // Day 3
                           const firstEventTitle = timeline.querySelector('.event-title');
                           if(firstEventTitle) firstEventTitle.textContent = "Hồ Tuy Sa";
                       } else { // Day 1
                           const firstEventTitle = timeline.querySelector('.event-title');
                           if(firstEventTitle) firstEventTitle.textContent = "Bánh Căn Lệ";
                       }
                       timeline.style.opacity = '1'; 
                   }, 300);
                }
            });
        });
    }

    // 4. Booking & Action Simulation (Destination Page)
    const bookingBtn = document.querySelector('.btn-sm'); // Booking button in service card
    if (bookingBtn && !bookingBtn.classList.contains('btn-outline')) {
        bookingBtn.addEventListener('click', () => {
             const originalText = bookingBtn.innerText;
             bookingBtn.innerText = "Đang xử lý...";
             setTimeout(() => {
                 alert("Cảm ơn anh/chị! Yêu cầu đặt dịch vụ đã được gửi đi thành công.");
                 bookingBtn.innerText = originalText;
             }, 1000);
        });
    }

    // 5. AI Route Optimization Interaction
    const optimizeBtn = document.querySelector('.btn-opt-primary');
    const saveItiBtn = document.querySelector('.btn-opt-success');
    const mapLoading = document.querySelector('.map-loading-indicator');

    if (optimizeBtn && mapLoading) {
        optimizeBtn.addEventListener('click', () => {
            mapLoading.style.display = 'flex';
            optimizeBtn.disabled = true;
            optimizeBtn.innerHTML = '<i class="ph-bold ph-spinner-gap spin"></i> Optimizing...';

            setTimeout(() => {
                mapLoading.style.display = 'none';
                optimizeBtn.disabled = false;
                optimizeBtn.innerHTML = '<i class="ph-bold ph-lightning"></i> Optimize Route';
                alert('AI đã tối ưu hóa lộ trình ngắn nhất cho bạn! Tiết kiệm được thêm 15 phút di chuyển.');
            }, 3000);
        });
    }

    if (saveItiBtn) {
        saveItiBtn.addEventListener('click', () => {
            saveItiBtn.innerHTML = '<i class="ph-bold ph-circle-notch spin"></i> Saving...';
            setTimeout(() => {
                alert('Lịch trình đã được lưu vào "Lịch trình của tôi"!');
                window.location.href = 'dashboard.html';
            }, 1000);
        });
    }
});

