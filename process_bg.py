import os
from rembg import remove

mascots_dir = "src/assets/mascots"
images = ["bao.png", "hai.png", "hung.png", "mieu.png", "ngoc.png", "vang.png"]

for img_name in images:
    img_path = os.path.join(mascots_dir, img_name)
    print(f"Processing {img_name}...")
    try:
        with open(img_path, 'rb') as f:
            input_data = f.read()
        
        output_data = remove(input_data)
        
        with open(img_path, 'wb') as f:
            f.write(output_data)
        print(f"Successfully processed and overwritten {img_name}")
    except Exception as e:
        print(f"Failed processing {img_name}: {e}")
