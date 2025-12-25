const imageUpload = document.getElementById("imageUpload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let img = new Image();

imageUpload.addEventListener("change", () => {
    const file = imageUpload.files[0];
    const reader = new FileReader();

    reader.onload = () => {
        img.src = reader.result;
    };
    reader.readAsDataURL(file);
});

img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
};

function analyzeImage() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    let redSum = 0;
    let pixelCount = 0;

    for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];

        // Ignore very dark pixels
        if (r + g + b > 100) {
            redSum += r;
            pixelCount++;
        }
    }

    let avgRed = redSum / pixelCount;

    let resultText;
    if (avgRed < 120) {
        resultText = "Anemia Likely (Low Red Intensity)";
    } else {
        resultText = "Normal (Adequate Red Intensity)";
    }

    document.getElementById("result").innerText =
        `Average Red Value: ${avgRed.toFixed(2)} → ${resultText}`;
}
