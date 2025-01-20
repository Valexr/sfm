let canvas = null;

const drawVisualizer = ({ bufferLength, dataArray }) => {
    let barHeight;
    const barWidth = canvas.width / 2 / bufferLength;
    let firstX = 0;
    let secondX = bufferLength * barWidth;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];
        const red = (i * barHeight) / 10;
        const green = i * 4;
        const blue = barHeight / 4 - 12;
        ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
        ctx.fillRect(
            canvas.width / 2 - firstX,
            canvas.height - barHeight,
            barWidth,
            barHeight
        );
        firstX += barWidth;
        ctx.fillRect(secondX, canvas.height - barHeight, barWidth, barHeight);
        secondX += barWidth;
    }
};

onmessage = function (e) {
    console.log("Worker: Message received from main script");
    const { bufferLength, dataArray, OffscreenCanvas } = e.data;
    if (!canvas && OffscreenCanvas) {
        canvas = OffscreenCanvas;
    } else {
        drawVisualizer({ bufferLength, dataArray });
    }
};