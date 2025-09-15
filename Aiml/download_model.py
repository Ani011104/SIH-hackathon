import urllib.request

url = "https://github.com/ultralytics/assets/releases/download/v8.3.0/yolo11m-pose.pt"
urllib.request.urlretrieve(url, "yolo11m-pose.pt")
print("Downloaded yolo11m-pose.pt")
