# detect_damage.py
import cv2
import numpy as np
import sys

# Load YOLO model
def load_yolo():
    net = cv2.dnn.readNet("yolov3.weights", "yolov3.cfg")
    layer_names = net.getLayerNames()
    output_layers = [layer_names[i[0] - 1] for i in net.getUnconnectedOutLayers()]
    return net, output_layers

# Process image and detect objects
def detect_objects(img_path):
    net, output_layers = load_yolo()
    
    # Load image
    img = cv2.imread(img_path)
    height, width, channels = img.shape
    
    # Prepare the image for YOLO
    blob = cv2.dnn.blobFromImage(img, 0.00392, (416, 416), (0, 0, 0), True, crop=False)
    net.setInput(blob)
    outs = net.forward(output_layers)
    
    # Post-processing to extract bounding boxes and confidence scores
    class_ids = []
    confidences = []
    boxes = []
    for out in outs:
        for detection in out:
            for obj in detection:
                scores = obj[5:]
                class_id = np.argmax(scores)
                confidence = scores[class_id]
                if confidence > 0.5:
                    center_x = int(obj[0] * width)
                    center_y = int(obj[1] * height)
                    w = int(obj[2] * width)
                    h = int(obj[3] * height)
                    x = int(center_x - w / 2)
                    y = int(center_y - h / 2)
                    boxes.append([x, y, w, h])
                    confidences.append(float(confidence))
                    class_ids.append(class_id)
    
    # Apply non-max suppression
    indexes = cv2.dnn.NMSBoxes(boxes, confidences, 0.5, 0.4)
    
    # Draw bounding boxes on the image
    for i in indexes:
        x, y, w, h = boxes[i[0]]
        cv2.rectangle(img, (x, y), (x + w, y + h), (0, 255, 0), 2)
    
    # Save the processed image
    output_path = "uploads/processed_" + img_path.split('/')[-1]
    cv2.imwrite(output_path, img)
    return output_path

if __name__ == "__main__":
    img_path = sys.argv[1]
    output_image_path = detect_objects(img_path)
    print(output_image_path)
