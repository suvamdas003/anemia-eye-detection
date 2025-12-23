let model;
const imageInput = document.getElementById('imageUpload');
const preview = document.getElementById('preview');

imageInput.addEventListener('change', () => {
    const file = imageInput.files[0];
    const reader = new FileReader();

    reader.onload = () => {
        preview.src = reader.result;
    };
    reader.readAsDataURL(file);
});

async function loadModel() {
    model = await tf.loadLayersModel('model/model.json');
    console.log("Model loaded");
}
loadModel();

async function predict() {
    if (!preview.src) {
        alert("Upload an image first");
        return;
    }

    const tensor = tf.browser
        .fromPixels(preview)
        .resizeNearestNeighbor([224, 224])
        .toFloat()
        .div(255.0)
        .expandDims();

    const prediction = model.predict(tensor);
    const value = prediction.dataSync()[0];

    if (value > 0.5) {
        document.getElementById("result").innerText =
            "Result: Anemia Likely";
    } else {
        document.getElementById("result").innerText =
            "Result: Normal Hemoglobin Level";
    }
}
