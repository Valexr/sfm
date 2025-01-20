<script lang="ts" module>
    import { played } from "$lib/channels";
</script>

<script lang="ts">
    let { audio, quality } = $props();

    function visualiser(
        canvas: HTMLCanvasElement,
        audio: HTMLAudioElement,
        drawer = 0,
    ) {
        const canvasCtx = canvas.getContext("2d");

        function update(audio: HTMLAudioElement) {
            const audioContext = new AudioContext();
            const analyser = audioContext.createAnalyser();
            analyser.connect(audioContext.destination);
            // analyser.smoothingTimeConstant = 0.75;
            analyser.fftSize = 128; //circleSegments * 32;
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            const audioSource = audioContext.createMediaElementSource(audio);
            audioSource.connect(analyser);

            // analyser.getByteTimeDomainData(dataArray);
            console.log(audio, bufferLength, canvas.width / bufferLength);

            audio.onplay = () => draw();
            audio.onpause = () => cancelAnimationFrame(drawer);

            function draw() {
                drawer = requestAnimationFrame(draw);
                analyser.getByteFrequencyData(dataArray);

                canvasCtx?.clearRect(0, 0, canvas.width, canvas.height);

                const barWidth = Math.trunc(canvas.width / bufferLength);
                let barHeight;
                let x = 0;

                for (let i = 0; i < bufferLength; i++) {
                    barHeight = dataArray[i];

                    canvasCtx.fillStyle = "white";
                    // "rgb(" + (barHeight + 100) + ",50,50)";
                    canvasCtx?.fillRect(
                        x,
                        canvas.height - barHeight / 2,
                        barWidth,
                        barHeight / 2,
                    );

                    x += barWidth;
                }
            }
        }

        return { update, destroy: () => cancelAnimationFrame(drawer) };
    }
</script>

<canvas use:visualiser={audio}></canvas>

<style>
    canvas {
        width: 100%;
        height: 300px;
        border: 1px solid black;
    }
</style>
