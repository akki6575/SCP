from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import sys

# Load the pre-trained CNN model
model = load_model('path_to_your_cnn_model.h5')

def detect_damage(img_path):
    img = image.load_img(img_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array /= 255.0

    prediction = model.predict(img_array)
    if prediction[0][0] > 0.5:
        return "Damaged"
    else:
        return "Not Damaged"

if __name__ == "__main__":
    img_path = sys.argv[1]
    result = detect_damage(img_path)
    print(result)
