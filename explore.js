/**
 * Explore Page Specific Logic (explore.js)
 */

document.addEventListener('DOMContentLoaded', () => {

    const searchInput = document.querySelector('.header-search input');
    const categoryTabs = document.querySelectorAll('.category-tab');
    const placeCards = document.querySelectorAll('.place-card');
    const saveButtons = document.querySelectorAll('.btn-save-place');

    // 1. Filtering Logic
    const filterExplore = () => {
        const query = searchInput ? searchInput.value.toLowerCase() : '';
        const activeTab = document.querySelector('.category-tab.active');
        const activeCategory = activeTab ? activeTab.getAttribute('data-category') : 'all';

        placeCards.forEach(card => {
            const name = card.querySelector('.place-name').textContent.toLowerCase();
            const category = card.getAttribute('data-category');
            
            const matchesSearch = name.includes(query);
            const matchesCategory = activeCategory === 'all' || category === activeCategory;

            if (matchesSearch && matchesCategory) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.5s ease forwards';
            } else {
                card.style.display = 'none';
            }
        });
    };

    // Event Listeners for search
    if (searchInput) {
        searchInput.addEventListener('input', filterExplore);
    }

    // Event Listeners for categories
    if (categoryTabs.length > 0) {
        categoryTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                categoryTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                filterExplore();
            });
        });
    }

    // 2. Favorite Toggle
    saveButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const icon = btn.querySelector('i');
            const isSaved = icon.classList.contains('saved');

            if (isSaved) {
                icon.classList.remove('saved');
                icon.style.color = '#cbd5e1';
            } else {
                icon.classList.add('saved');
                icon.style.color = '#ef4444';
                // Small pop animation
                btn.style.transform = 'scale(1.3)';
                setTimeout(() => {
                    btn.style.transform = 'scale(1.1)';
                }, 200);
            }
        });
    });

    // 3. Load More Simulation
    const loadMoreBtn = document.querySelector('.btn-load-more');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            loadMoreBtn.innerHTML = '<i class="ph-bold ph-circle-notch spin"></i> Đang tải...';
            setTimeout(() => {
                loadMoreBtn.innerHTML = 'Xem thêm kết quả <i class="ph-bold ph-arrow-counter-clockwise"></i>';
                alert('Dữ liệu các địa điểm tiếp theo đang được cập nhật!');
            }, 1500);
        });
    }
});
