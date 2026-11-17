import os
from PIL import Image, ImageDraw

svg_content = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
  <rect width="32" height="32" rx="7" fill="#141414" />
  <rect x="0.5" y="0.5" width="31" height="31" rx="6.5" stroke="#ffffff" stroke-opacity="0.16" stroke-width="1" />
  <polyline points="8.5 9.5 15 16 8.5 22.5" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" />
  <line x1="17" y1="22.5" x2="24.5" y2="22.5" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" />
</svg>"""

# 1. Write SVGs
svg_paths = [
    'src/app/icon.svg',
    'public/icon.svg',
    'public/favicon.svg',
]

for p in svg_paths:
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, 'w', encoding='utf-8') as f:
        f.write(svg_content)
print('SVGs written successfully')

# 2. Render pixel-perfect PNGs and ICOs with supersampling
def render_logo(size):
    scale = 8
    S = size * scale
    img = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Squircle radius: 7 / 32 = 0.21875
    radius = int(S * 0.21875)
    bg_color = (20, 20, 20, 255)
    border_color = (255, 255, 255, 41)
    border_width = max(1, int(S * (1.0 / 32.0)))

    draw.rounded_rectangle(
        [0, 0, S - 1, S - 1],
        radius=radius,
        fill=bg_color,
        outline=border_color,
        width=border_width
    )

    # Coordinates scaled from 32x32 SVG
    stroke_w = int(S * (2.6 / 32.0))
    r = stroke_w / 2

    # Chevron points: (8.5, 9.5), (15, 16), (8.5, 22.5)
    c_x1 = int(S * (8.5 / 32.0))
    c_y1 = int(S * (9.5 / 32.0))
    c_x2 = int(S * (15.0 / 32.0))
    c_y2 = int(S * (16.0 / 32.0))
    c_x3 = int(S * (8.5 / 32.0))
    c_y3 = int(S * (22.5 / 32.0))

    # Underscore: (17, 22.5) -> (24.5, 22.5)
    u_x1 = int(S * (17.0 / 32.0))
    u_x2 = int(S * (24.5 / 32.0))
    u_y  = int(S * (22.5 / 32.0))

    white = (255, 255, 255, 255)

    draw.line([(c_x1, c_y1), (c_x2, c_y2)], fill=white, width=stroke_w)
    draw.line([(c_x2, c_y2), (c_x3, c_y3)], fill=white, width=stroke_w)
    draw.line([(u_x1, u_y), (u_x2, u_y)], fill=white, width=stroke_w)

    for (px, py) in [(c_x1, c_y1), (c_x2, c_y2), (c_x3, c_y3), (u_x1, u_y), (u_x2, u_y)]:
        draw.ellipse([px - r, py - r, px + r, py + r], fill=white)

    return img.resize((size, size), Image.Resampling.LANCZOS)

sizes = [16, 32, 48, 64, 180, 512]
rendered = {s: render_logo(s) for s in sizes}

# Save multi-size ICO
ico_targets = ['src/app/favicon.ico', 'public/favicon.ico']
for p in ico_targets:
    os.makedirs(os.path.dirname(p), exist_ok=True)
    rendered[32].save(p, format='ICO', sizes=[(16, 16), (32, 32), (48, 48)])
print('Favicon ICOs saved')

# Save PNGs
rendered[180].save('src/app/apple-icon.png')
rendered[180].save('public/apple-icon.png')
rendered[32].save('src/app/icon.png')
rendered[32].save('public/icon.png')
rendered[512].save('public/icon-512.png')

# Cleanup temporary test files if in root
for t in ['../test_icon_32.png', '../test_favicon.ico', '../test_apple_icon.png']:
    if os.path.exists(t):
        os.remove(t)

print('All favicon, icon, and apple-icon files successfully generated!')
