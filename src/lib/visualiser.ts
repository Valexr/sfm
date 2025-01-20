export function visualiser(
    canvas: HTMLCanvasElement,
    audio: HTMLAudioElement,
    drawer = 0,
) {
    // const ctx = canvas.getContext("2d");
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();

    const worker = new Worker(new URL("../worker.js", import.meta.url));
    console.log(worker)

    analyser.connect(audioContext.destination);
    analyser.smoothingTimeConstant = 0.75;
    analyser.fftSize = 128; //circleSegments * 32;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    if (audio instanceof HTMLAudioElement) update(audio);

    function update(audio: HTMLAudioElement) {
        const audioSource = audioContext.createMediaElementSource(audio);
        audioSource.connect(analyser);

        audio.onplay = () => {
            console.log(canvas)
            try {
                const OffscreenCanvas = canvas?.transferControlToOffscreen()
                worker.postMessage({ OffscreenCanvas }, [OffscreenCanvas]);
            } catch (error) {
                console.error(error)
            }
            draw();
        }
        audio.onpause = () => cancelAnimationFrame(drawer);
    }

    return { update, destroy: () => cancelAnimationFrame(drawer) };

    function draw() {
        // const barWidth = canvas.width / bufferLength;
        // let barHeight = 0;
        // let x = 0;

        drawer = requestAnimationFrame(draw);

        analyser.getByteFrequencyData(dataArray);
        // analyser.getByteTimeDomainData(dataArray);
        worker.postMessage({ bufferLength, dataArray }, {});

        // if (ctx) {
        //     ctx.clearRect(0, 0, canvas.width, canvas.height);

        //     for (let i = 0; i < bufferLength; i++) {
        //         barHeight = dataArray[i];

        //         ctx.fillStyle = "white";
        //         ctx.fillRect(
        //             x,
        //             canvas.height - barHeight,
        //             barWidth,
        //             barHeight,
        //         );

        //         x += barWidth + 3;
        //     }
        // }
    }
}