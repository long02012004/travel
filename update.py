import re

# Read the file
with open(r'c:\Users\WINDOWS\travel\optimization.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace opt-header
header_pattern = re.compile(r'<div class=\"opt-header\">.*?</div>\s*</div>\s*</div>', re.DOTALL)
new_header = """<div class="opt-header" style="margin-bottom: 24px;">
        <div class="opt-title-row">
          <div class="opt-title-info">
            <h1 class="opt-title" style="font-size: 2.2rem; margin-bottom: 8px;">Khám Phá Địa Điểm Nổi Bật</h1>
            <p class="opt-subtitle" style="font-size: 1.1rem; max-width: 800px; line-height: 1.5;">
              Khám phá vẻ đẹp bất tận của các danh lam thắng cảnh và di sản văn hóa đặc sắc trên khắp bản đồ du lịch lý tưởng của bạn.
            </p>
          </div>
        </div>
      </div>"""
html = header_pattern.sub(new_header, html, count=1)

# Replace Content Grid
grid_pattern = re.compile(r'<!-- Content Grid -->.*?<!-- Add Place Modal -->', re.DOTALL)
new_grid = """<!-- Explore Layout -->
      <div class="explore-layout" style="display: grid; grid-template-columns: 450px 1fr; gap: 24px; min-height: 700px; margin-bottom: 40px;">
        
        <!-- Left Column: Famous Places -->
        <div class="opt-card famous-places-card" style="display: flex; flex-direction: column; height: 100%; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid rgba(0,0,0,0.05); overflow: hidden;">
          <div class="opt-card-header split" style="padding: 24px; border-bottom: 1px solid #f8fafc; background: #fff;">
            <div class="header-left">
              <i class="ph-fill ph-star" style="color: #f59e0b; font-size: 1.5rem;"></i>
              <h3 style="font-size: 1.25rem; font-weight: 700; margin: 0;">Gợi ý địa điểm</h3>
            </div>
          </div>

          <div id="famousPlacesList" class="famous-places-list" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; padding: 24px; overflow-y: auto; flex: 1; background: #f8fafc;">
            <div class="loading-box" style="grid-column: 1 / -1; text-align: center; padding: 40px 20px;">
              <i class="ph-bold ph-circle-notch spin" style="font-size: 2rem; color: #0ea5e9; margin-bottom: 12px;"></i>
              <span style="display: block; color: var(--app-text-gray);">Đang tải các địa điểm...</span>
            </div>
          </div>
        </div>

        <!-- Right Column: Interactive Map -->
        <div class="opt-card map-analysis-card" style="display: flex; flex-direction: column; height: 100%; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid rgba(0,0,0,0.05); overflow: hidden;">
          <div class="opt-card-header split" style="padding: 24px; border-bottom: 1px solid #f1f5f9; background: #fff; z-index: 10;">
            <div class="header-left">
              <i class="ph-fill ph-map-pin" style="color: #10b981; font-size: 1.5rem;"></i>
              <h3 style="font-size: 1.25rem; font-weight: 700; margin: 0;">Bản đồ tương tác</h3>
            </div>
            <div class="card-header-actions">
              <button class="btn-icon-tiny" title="Toàn màn hình">
                <i class="ph-bold ph-corners-out"></i>
              </button>
            </div>
          </div>
          <div class="map-analysis-viewport" style="flex: 1; position: relative;">
            <div id="mapOpt" style="width: 100%; height: 100%;"></div>
          </div>
        </div>
      </div>
    </main>
    
    <!-- Marker removed -->"""
html = grid_pattern.sub(new_grid, html, count=1)

# Remove the rest of the modal
modal_pattern = re.compile(r'<div id="addPlaceModal".*?</div>\s*</div>\s*</div>\s*<footer', re.DOTALL)
html = modal_pattern.sub('<footer', html, count=1)

# Replace Script
script_pattern = re.compile(r'document\.addEventListener\("DOMContentLoaded", \(\) => \{.+?\}\);\s*</script>', re.DOTALL)
new_script = """document.addEventListener("DOMContentLoaded", () => {
        // Init Map
        const defaultCoords = [16.0470, 108.2062]; // Center at Da Nang
        window.map = L.map('mapOpt', {
            zoomControl: true,
            attributionControl: false
        }).setView(defaultCoords, 6);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(window.map);

        window.map.zoomControl.setPosition('bottomright');

        async function fetchFamousPlaces() {
            const listContainer = document.getElementById('famousPlacesList');
            if (!listContainer) return;

            try {
                // Mock API Data
                const data = [
                    { name: "Hồ Hoàn Kiếm", addr: "Thủ đô Hà Nội", lat: 21.0285, lng: 105.8522, img: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?q=80&w=400&auto=format&fit=crop" },
                    { name: "Vịnh Hạ Long", addr: "Quảng Ninh", lat: 20.9101, lng: 107.1839, img: "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=400&auto=format&fit=crop" },
                    { name: "Phố cổ Hội An", addr: "Quảng Nam", lat: 15.8801, lng: 108.3380, img: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=400&auto=format&fit=crop" },
                    { name: "Bà Nà Hills", addr: "Đà Nẵng", lat: 15.9950, lng: 107.9876, img: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=400&auto=format&fit=crop" },
                    { name: "Mù Cang Chải", addr: "Yên Bái", lat: 21.8480, lng: 104.0906, img: "https://images.unsplash.com/photo-1577909339077-0a4ff4af243b?q=80&w=400&auto=format&fit=crop" },
                    { name: "Đảo Ngọc Phú Quốc", addr: "Kiên Giang", lat: 10.2899, lng: 103.9840, img: "https://images.unsplash.com/photo-1559530462-843818617887?q=80&w=400&auto=format&fit=crop" },
                    { name: "Tràng An", addr: "Ninh Bình", lat: 20.2520, lng: 105.9080, img: "https://images.unsplash.com/photo-1620023363065-ec18c8e1da48?q=80&w=400&auto=format&fit=crop" },
                    { name: "Đà Lạt", addr: "Lâm Đồng", lat: 11.9404, lng: 108.4384, img: "https://images.unsplash.com/photo-1596409849504-20d00a4ebd03?q=80&w=400&auto=format&fit=crop" }
                ];
                
                await new Promise(resolve => setTimeout(resolve, 800));
                renderFamousPlaces(data);
                
                // Add tiny markers globally
                const markersGrp = L.featureGroup().addTo(window.map);

                data.forEach(place => {
                    const icon = L.divIcon({
                        className: 'opt-marker-wrap',
                        html: `<div style="background:#0ea5e9; width: 12px; height: 12px; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>`,
                        iconSize: [12, 12],
                        iconAnchor: [6, 6]
                    });
                    
                    const marker = L.marker([place.lat, place.lng], { icon: icon }).addTo(markersGrp);
                    marker.bindPopup(`<b>${place.name}</b>`);
                });
                
                window.map.fitBounds(markersGrp.getBounds(), { padding: [50, 50] });

            } catch (error) {
                console.error("Error fetching places:", error);
                listContainer.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; color: #ef4444; padding: 20px;"><p>Không thể tải danh sách địa điểm</p></div>`;
            }
        }

        function renderFamousPlaces(places) {
            const listContainer = document.getElementById('famousPlacesList');
            listContainer.innerHTML = ''; 

            places.forEach((place) => {
                const item = document.createElement('div');
                item.className = 'famous-place-item';
                // Hình vuông (aspect-ratio: 1/1)
                item.style.cssText = 'aspect-ratio: 1 / 1; border-radius: 16px; overflow: hidden; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); background: #fff; position: relative; box-shadow: 0 4px 15px rgba(0,0,0,0.06); display: flex; flex-direction: column;';
                
                item.innerHTML = `
                    <div style="flex: 1; overflow: hidden; position: relative;">
                        <img src="${place.img}" alt="${place.name}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);" class="place-img">
                        <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%); padding: 30px 16px 16px; color: white;">
                            <h4 style="margin: 0 0 4px 0; font-size: 1.15rem; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.4); line-height: 1.3;">${place.name}</h4>
                            <p style="margin: 0; font-size: 0.85rem; opacity: 0.9; display: flex; align-items: center; gap: 4px; font-weight: 500;"><i class="ph-fill ph-map-pin"></i> ${place.addr}</p>
                        </div>
                    </div>
                `;

                item.addEventListener('mouseenter', () => {
                   if (!item.classList.contains('active-place')) {
                       item.style.boxShadow = '0 12px 24px rgba(0,0,0,0.12)';
                       item.style.transform = 'translateY(-4px)';
                       item.querySelector('.place-img').style.transform = 'scale(1.1)';
                   }
                });
                item.addEventListener('mouseleave', () => {
                   if (!item.classList.contains('active-place')) {
                       item.style.boxShadow = '0 4px 15px rgba(0,0,0,0.06)';
                       item.style.transform = 'translateY(0)';
                       item.querySelector('.place-img').style.transform = 'scale(1)';
                   }
                });

                item.addEventListener('click', () => {
                    document.querySelectorAll('.famous-place-item').forEach(el => {
                        el.classList.remove('active-place');
                        el.style.boxShadow = '0 4px 15px rgba(0,0,0,0.06)';
                        el.style.transform = 'translateY(0)';
                        el.style.border = 'none';
                        el.querySelector('.place-img').style.transform = 'scale(1)';
                    });
                    
                    item.classList.add('active-place');
                    item.style.border = '3px solid #0ea5e9';
                    item.style.boxShadow = '0 12px 24px rgba(14, 165, 233, 0.25)';
                    item.style.transform = 'translateY(-4px)';
                    item.querySelector('.place-img').style.transform = 'scale(1.1)';

                    window.map.flyTo([place.lat, place.lng], 13, { duration: 1.5 });
                    
                    if (window.famousPlaceMarker) {
                        window.map.removeLayer(window.famousPlaceMarker);
                    }
                    
                    const icon = L.divIcon({
                        className: 'opt-marker-wrap',
                        html: `<div class="pulse-anim" style="background:#f59e0b; border: 2px solid #fff; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border-radius: 50%;">
                                 <i class="ph-bold ph-star" style="color:white; font-size:22px;"></i>
                               </div>`,
                        iconSize: [44, 44],
                        iconAnchor: [22, 44]
                    });
                    
                    window.famousPlaceMarker = L.marker([place.lat, place.lng], { icon: icon, zIndexOffset: 1000 }).addTo(window.map);
                    
                    if (!document.getElementById('pulse-anim-style')) {
                        const style = document.createElement('style');
                        style.id = 'pulse-anim-style';
                        style.innerHTML = `
                            @keyframes markerPulse {
                                0% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.6); }
                                70% { box-shadow: 0 0 0 15px rgba(245, 158, 11, 0); }
                                100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
                            }
                            .pulse-anim { animation: markerPulse 2s infinite; }
                        `;
                        document.head.appendChild(style);
                    }
                    
                    window.famousPlaceMarker.bindPopup(`
                        <div style="text-align:center; padding: 4px;">
                            <img src="${place.img}" style="width:100%; height:120px; object-fit:cover; border-radius:8px; margin-bottom:8px;">
                            <h3 style="margin:0 0 4px; font-size:1.1rem;">${place.name}</h3>
                            <p style="margin:0; color:#666; font-size:0.85rem;"><i class="ph-fill ph-map-pin"></i> ${place.addr}</p>
                            <a href="explore.html" style="text-decoration:none;">
                                <button style="margin-top:12px; width:100%; padding:8px; border-radius:6px; font-size:0.85rem; background:#0ea5e9; color:#fff; border:none; cursor:pointer;" onmouseover="this.style.background='#0284c7'" onmouseout="this.style.background='#0ea5e9'">Khám phá thêm</button>
                            </a>
                        </div>
                    `, { minWidth: 220 }).openPopup();
                });

                listContainer.appendChild(item);
            });
        }
        
        // Initial fetch
        fetchFamousPlaces();
      });
    </script>"""
html = script_pattern.sub(new_script, html, count=1)

with open(r'c:\Users\WINDOWS\travel\optimization.html', 'w', encoding='utf-8') as f:
    f.write(html)
