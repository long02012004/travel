import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

toggle_btn = """
            <!-- Mobile Menu Toggle -->
            <button class="mobile-menu-btn" id="mobile-menu-btn" aria-label="Toggle Menu">
                <i class="ph-bold ph-list"></i>
            </button>
"""

js_script = """
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const mobileMenuBtn = document.getElementById('mobile-menu-btn');
            const navLinks = document.querySelector('.nav-links');
            if (mobileMenuBtn && navLinks) {
                mobileMenuBtn.addEventListener('click', () => {
                    navLinks.classList.toggle('active');
                    const icon = mobileMenuBtn.querySelector('i');
                    if (navLinks.classList.contains('active')) {
                        icon.classList.remove('ph-list');
                        icon.classList.add('ph-x');
                    } else {
                        icon.classList.remove('ph-x');
                        icon.classList.add('ph-list');
                    }
                });
            }
        });
    </script>
"""

for f in html_files:
    if f == 'index.html': 
        continue # already manually done
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Check if mobile-menu-btn already exists
    if 'mobile-menu-btn' in content:
        continue
        
    # Inject button right before closing of header-container or nav-container
    if '</header>' in content:
        # Match the last </div> before </header>
        content = re.sub(r'(\s*</div>\s*</header>)', r'%s\1' % toggle_btn, content, count=1)
    
    # Inject script right before </body>
    if '</body>' in content:
        content = re.sub(r'(\s*</body>)', r'%s\1' % js_script, content, count=1)
        
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)

print(f"Processed {len(html_files)} files.")
