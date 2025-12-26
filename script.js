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
    const width = canvas.width;
    const height = canvas.height;

    // Define ROI: lower-middle conjunctiva region
    const roiX = width * 0.25;
    const roiY = height * 0.55;
    const roiW = width * 0.5;
    const roiH = height * 0.25;

    const imageData = ctx.getImageData(roiX, roiY, roiW, roiH);
    const data = imageData.data;

    let redSum = 0;
    let greenSum = 0;
    let pixelCount = 0;

    for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];

        // Exclude highlights & shadows
        if (r > 30 && g > 30 && b > 30 && r < 240 && g < 240) {
            redSum += r;
            greenSum += g;
            pixelCount++;
        }
    }

    if (pixelCount === 0) {
        document.getElementById("result").innerText =
            "Unable to analyze image. Try another image.";
        return;
    }

    let avgRed = redSum / pixelCount;
    let avgGreen = greenSum / pixelCount;
    let redGreenRatio = avgRed / avgGreen;

    let diagnosis;
    if (redGreenRatio < 1.5) {
        diagnosis = "Anemia Likely (Pale Conjunctiva)";
    } else {
        diagnosis = "Normal (Adequate Conjunctival Redness)";
    }

    document.getElementById("result").innerText =
        `Red/Green Ratio: ${redGreenRatio.toFixed(2)} → ${diagnosis}`;
}
