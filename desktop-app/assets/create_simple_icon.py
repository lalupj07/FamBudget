from PIL import Image, ImageDraw, ImageFont
import os

# Create a 512x512 image with transparent background
size = (512, 512)
img = Image.new('RGBA', size, (0, 0, 0, 255))  # Black background
draw = ImageDraw.Draw(img)

# Draw house outline (teal/cyan)
house_points = [(180, 180), (256, 120), (332, 180), (332, 320), (180, 320)]
draw.polygon(house_points, outline=(0, 229, 255, 255), width=6)

# Draw chimney
draw.rectangle([300, 140, 320, 180], outline=(0, 229, 255, 255), width=4)

# Draw heart shape (orange/amber)
heart_points = []
# Simplified heart shape using basic shapes
draw.ellipse([200, 180, 240, 220], fill=(255, 107, 53, 255))  # Left part
draw.ellipse([240, 180, 280, 220], fill=(255, 107, 53, 255))  # Right part
draw.polygon([(220, 220), (260, 220), (240, 260)], fill=(255, 107, 53, 255))  # Bottom point

# Draw piggy bank (light blue)
draw.ellipse([221, 215, 291, 265], fill=(129, 212, 250, 255))
draw.ellipse([226, 220, 286, 250], fill=(179, 229, 252, 255))

# Draw piggy bank features
draw.ellipse([243, 230, 249, 236], fill=(21, 101, 192, 255))  # Left eye
draw.ellipse([263, 230, 269, 236], fill=(21, 101, 192, 255))  # Right eye
draw.ellipse([248, 245, 264, 251], fill=(21, 101, 192, 255))  # Nose

# Draw coin (gold)
draw.ellipse([244, 188, 268, 212], fill=(255, 215, 0, 255))

# Try to add dollar sign (simplified)
try:
    font = ImageFont.truetype("arial.ttf", 16)
except:
    font = ImageFont.load_default()

draw.text((252, 196), "$", fill=(0, 0, 0, 255), font=font, anchor="mm")

# Save as PNG
img.save('icon.png', 'PNG')
print("Icon created successfully!")
