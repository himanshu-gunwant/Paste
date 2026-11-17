import os
from PIL import Image, ImageDraw

artifact_dir = r"C:\Users\Himanshu\.gemini\antigravity\brain\442066e3-867e-4328-978a-7daa3d22e048"
workspace_dir = r"D:\Personal\paste"

def render_logo(size):
    scale = 4
    S = size * scale
    img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
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

    stroke_w = int(S * (2.6 / 32.0))
    r = stroke_w / 2

    c_x1 = int(S * (8.5 / 32.0))
    c_y1 = int(S * (9.5 / 32.0))
    c_x2 = int(S * (15.0 / 32.0))
    c_y2 = int(S * (16.0 / 32.0))
    c_x3 = int(S * (8.5 / 32.0))
    c_y3 = int(S * (22.5 / 32.0))

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

img_512 = render_logo(512)
img_1024 = render_logo(1024)

# SVG with 512x512 viewBox
svg_content = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" fill="none">
  <rect width="512" height="512" rx="112" fill="#141414" />
  <rect x="8" y="8" width="496" height="496" rx="104" stroke="#ffffff" stroke-opacity="0.16" stroke-width="16" />
  <polyline points="136 152 240 256 136 360" stroke="#ffffff" stroke-width="41.6" stroke-linecap="round" stroke-linejoin="round" />
  <line x1="272" y1="360" x2="392" y2="360" stroke="#ffffff" stroke-width="41.6" stroke-linecap="round" />
</svg>"""

# Save in workspace
img_512.save(os.path.join(workspace_dir, "paste-logo-512.png"))
img_1024.save(os.path.join(workspace_dir, "paste-logo-1024.png"))
with open(os.path.join(workspace_dir, "paste-logo.svg"), "w", encoding="utf-8") as f:
    f.write(svg_content)

# Save in artifact directory for embedding
os.makedirs(artifact_dir, exist_ok=True)
img_512.save(os.path.join(artifact_dir, "paste-logo-512.png"))
img_1024.save(os.path.join(artifact_dir, "paste-logo-1024.png"))
with open(os.path.join(artifact_dir, "paste-logo.svg"), "w", encoding="utf-8") as f:
    f.write(svg_content)

print("Export completed successfully!")
