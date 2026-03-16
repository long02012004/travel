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

    const generateBtn = document.getElementById('generateBtn');
    
    if (generateBtn) {
        generateBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link behavior
            
            const destInput = document.getElementById('plan-destination');
            const datesInput = document.getElementById('plan-dates');
            const membersSelect = document.getElementById('plan-members');
            
            const destination = destInput ? destInput.value.trim() : '';
            const dates = datesInput && datesInput.value.trim() !== '' ? datesInput.value.trim() : 'Ngày chưa xác định';
            
            // Basic Validation
            if (!destination) {
                alert('Vui lòng nhập điểm đến bạn mong muốn!');
                if (destInput) destInput.focus();
                return;
            }

            // Extract Members Count vaguely
            let paramMembers = 2; // default
            if (membersSelect) {
                const val = membersSelect.options[membersSelect.selectedIndex].text;
                if (val.includes('Solo')) paramMembers = 1;
                else if (val.includes('Cặp đôi')) paramMembers = 2;
                else if (val.includes('Nhóm')) paramMembers = 4;
            }

            // Simulate AI Loading State
            const originalContent = generateBtn.innerHTML;
            generateBtn.innerHTML = `<i class="ph-bold ph-spinner ph-spin" style="animation: spin 1s linear infinite;"></i> Đang tạo lịch trình bằng AI...`;
            generateBtn.style.pointerEvents = 'none'; // Disable button
            generateBtn.style.opacity = '0.8';

            // Add basic spin keyframe dynamically if not present
            if (!document.getElementById('spinner-styles')) {
                const style = document.createElement('style');
                style.id = 'spinner-styles';
                style.textContent = `@keyframes spin { 100% { transform: rotate(360deg); } }`;
                document.head.appendChild(style);
            }

            // Fake API Call Delay (2.5 seconds)
            setTimeout(() => {
                // Create New Trip Object
                const newTrip = {
                    id: 'trip_' + Date.now(),
                    title: `Khám phá ${destination}`,
                    dates: dates,
                    locations: Math.floor(Math.random() * 8) + 4, // Random 4-11 spots
                    members: paramMembers,
                    status: 'upcoming',
                    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop', // default beach image
                    timestamp: Date.now()
                };

                // Save to LocalStorage
                const existingTrips = JSON.parse(localStorage.getItem('userTrips')) || [];
                existingTrips.push(newTrip);
                localStorage.setItem('userTrips', JSON.stringify(existingTrips));

                // Success Feedback and Redirect
                generateBtn.innerHTML = `<i class="ph-bold ph-check-circle"></i> Hoàn tất!`;
                generateBtn.style.backgroundColor = '#10b981'; // Green
                
                setTimeout(() => {
                    window.location.href = 'itinerary.html';
                }, 500);

            }, 2500);
        });
    }
});
