import glob
import re

html_files = glob.glob(r'c:\Users\WINDOWS\travel\*.html')
patterns = [
    r'\s*<a\s+href="[^"]*optimization\.html"[^>]*>Lộ trình</a>',
    r'\s*<li><a\s+href="[^"]*optimization\.html"[^>]*>Lộ trình</a></li>',
    r'\s*<a\s+href="[^"]*optimization\.html"[^>]*class="[^"]*active[^"]*"[^>]*>Lộ trình</a>'
]

for file in html_files:
    try:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()

        new_content = content
        for pattern in patterns:
            new_content = re.sub(pattern, '', new_content)
            
        if new_content != content:
            with open(file, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f'Updated {file}')
    except Exception as e:
        pass
print("Finished updating navigation!")
