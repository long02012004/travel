// planner.js - Handles the Trip Planner AI Generation flow

document.addEventListener('DOMContentLoaded', () => {
    // Check for URL parameters to auto-fill
    const urlParams = new URLSearchParams(window.location.search);
    const urlDest = urlParams.get('dest');
    const urlDates = urlParams.get('dates');

    if (urlDest) {
        const destInput = document.getElementById('plan-destination');
        if (destInput) destInput.value = urlDest;
    }

    if (urlDates) {
        const datesInput = document.getElementById('plan-dates');
        if (datesInput) {
            datesInput.value = urlDates;
        }
    }

    const urlGuests = urlParams.get('guests');
    if (urlGuests) {
        const membersSelect = document.getElementById('plan-members');
        if (membersSelect) {
            const count = parseInt(urlGuests);
            if (count === 1) membersSelect.value = 'Solo';
            else if (count === 2) membersSelect.value = 'Cặp đôi';
            else membersSelect.value = 'Gia đình / Nhóm bạn';
        }
    }

    const editId = urlParams.get('editId');
    let isEditMode = false;
    let tripToEdit = null;

    if (editId) {
        const existingTrips = JSON.parse(localStorage.getItem('userTrips')) || [];
        tripToEdit = existingTrips.find(t => t.id === editId);
        if (tripToEdit) {
            isEditMode = true;
            
            // Pre-fill form
            const destInput = document.getElementById('plan-destination');
            if (destInput) destInput.value = tripToEdit.title.replace('Khám phá ', '');
            
            const datesInput = document.getElementById('plan-dates');
            if (datesInput) datesInput.value = tripToEdit.dates;
            
            const membersSelect = document.getElementById('plan-members');
            if (membersSelect) {
                if (tripToEdit.members === 1) membersSelect.value = 'Solo';
                else if (tripToEdit.members === 2) membersSelect.value = 'Cặp đôi';
                else membersSelect.value = 'Gia đình / Nhóm bạn';
            }

            // Update Page Title and Button
            const introTitle = document.querySelector('.planner-intro h1');
            if (introTitle) introTitle.textContent = 'Chỉnh sửa lịch trình của bạn';
            
            const genBtnLabel = document.getElementById('generateBtn');
            if (genBtnLabel) {
                genBtnLabel.innerHTML = '<i class="ph-fill ph-check-circle"></i> Update Trip Details';
            }
        }
    }

    const generateBtn = document.getElementById('generateBtn');
    
    if (generateBtn) {
        generateBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const destInput = document.getElementById('plan-destination');
            const datesInput = document.getElementById('plan-dates');
            const membersSelect = document.getElementById('plan-members');
            
            const destination = destInput ? destInput.value.trim() : '';
            const dates = datesInput && datesInput.value.trim() !== '' ? datesInput.value.trim() : 'Ngày chưa xác định';
            
            // Calculate Day Count and proportional stats
            let daysCount = 3;
            let activitiesCount = 5;
            let hotelsCount = 2;

            if (dates && dates.includes(' to ')) {
                try {
                    const parts = dates.split(' to ');
                    const [d1, m1, y1] = parts[0].split('/').map(Number);
                    const [d2, m2, y2] = parts[1].split('/').map(Number);
                    const start = new Date(y1, m1 - 1, d1);
                    const end = new Date(y2, m2 - 1, d2);
                    const diffTime = Math.abs(end - start);
                    daysCount = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                    
                    // Logic: 2-3 activities per day, 1 hotel every 2-3 days
                    activitiesCount = daysCount * (Math.floor(Math.random() * 2) + 2);
                    hotelsCount = Math.max(1, Math.ceil(daysCount / 2.5));
                } catch (err) {
                    console.error('Error parsing dates:', err);
                }
            }

            if (!destination) {
                alert('Vui lòng nhập điểm đến bạn mong muốn!');
                if (destInput) destInput.focus();
                return;
            }

            let paramMembers = 2;
            if (membersSelect) {
                const val = membersSelect.value;
                if (val.includes('Solo')) paramMembers = 1;
                else if (val.includes('Cặp đôi')) paramMembers = 2;
                else paramMembers = 4;
            }

            const originalContent = generateBtn.innerHTML;
            generateBtn.innerHTML = `<i class="ph-bold ph-spinner ph-spin" style="animation: spin 1s linear infinite;"></i> ${isEditMode ? 'Đang cập nhật...' : 'Đang tạo lịch trình bằng AI...'}`;
            generateBtn.style.pointerEvents = 'none';
            generateBtn.style.opacity = '0.8';

            if (!document.getElementById('spinner-styles')) {
                const style = document.createElement('style');
                style.id = 'spinner-styles';
                style.textContent = `@keyframes spin { 100% { transform: rotate(360deg); } }`;
                document.head.appendChild(style);
            }

            setTimeout(() => {
                const existingTrips = JSON.parse(localStorage.getItem('userTrips')) || [];
                
                if (isEditMode) {
                    const tripIndex = existingTrips.findIndex(t => t.id === editId);
                    if (tripIndex !== -1) {
                        existingTrips[tripIndex] = {
                            ...existingTrips[tripIndex],
                            title: `Khám phá ${destination}`,
                            dates: dates,
                            members: paramMembers,
                            daysCount: daysCount,
                            activitiesCount: activitiesCount,
                            hotelsCount: hotelsCount,
                            timestamp: Date.now()
                        };
                    }
                } else {
                    const newTrip = {
                        id: 'trip_' + Date.now(),
                        title: `Khám phá ${destination}`,
                        dates: dates,
                        locations: Math.floor(Math.random() * 8) + 4,
                        daysCount: daysCount,
                        activitiesCount: activitiesCount,
                        hotelsCount: hotelsCount,
                        members: paramMembers,
                        status: 'upcoming',
                        preparationChecklist: [
                            { id: 'step1', label: 'Vé máy bay', completed: false },
                            { id: 'step2', label: 'Khách sạn', completed: false },
                            { id: 'step3', label: 'Lịch trình', completed: false }
                        ],
                        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
                        timestamp: Date.now()
                    };
                    existingTrips.push(newTrip);
                }

                localStorage.setItem('userTrips', JSON.stringify(existingTrips));

                generateBtn.innerHTML = `<i class="ph-bold ph-check-circle"></i> ${isEditMode ? 'Đã cập nhật!' : 'Hoàn tất!'}`;
                generateBtn.style.backgroundColor = '#10b981';
                
                setTimeout(() => {
                    window.location.href = isEditMode ? 'dashboard.html' : 'itinerary.html';
                }, 500);

            }, 2000);
        });
    }
});
