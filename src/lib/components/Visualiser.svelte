<script lang="ts" module>
    import { played } from "$lib/channels";
</script>

<script lang="ts">
    let { audio = $bindable<HTMLAudioElement>(), quality } = $props();

    function visualiser(canvas: HTMLCanvasElement) {
        const audio = new Audio($played.playlists[quality].src);
        const canvasCtx = canvas.getContext("2d");
        const audioContext = new AudioContext();
        const audioGain = audioContext.createGain();
        // audio.play();

        const source = audioContext.createMediaElementSource(audio);
        const analyser = audioContext.createAnalyser();

        // Connect the source node and analyser to the audio destination
        source.connect(analyser);
        source.connect(audioGain);
        analyser.connect(audioContext.destination);
        analyser.fftSize = 128;
        const bufferLength = analyser.frequencyBinCount;

        let freq;

        audio.addEventListener("canplay", function (e) {
            console.log("SomaFM", "got canplay");
            freq = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteTimeDomainData(freq);
            // analyser.getByteFrequencyData(freq);
            console.log(freq);
            audio.play();
            draw();
        });

        // const dataArray = new Uint8Array(bufferLength);
        // // analyser.getByteTimeDomainData(dataArray);
        // console.log(audio, dataArray);
        // Start playing the audio

        function draw() {
            const drawVisual = requestAnimationFrame(draw);
            analyser.getByteFrequencyData(freq);

            canvasCtx?.clearRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                barHeight = freq[i];
                console.log(barHeight);

                canvasCtx.fillStyle = "rgb(" + (barHeight + 100) + ",50,50)";
                canvasCtx?.fillRect(
                    x,
                    canvas.height - barHeight / 2,
                    barWidth,
                    barHeight / 2,
                );

                x += barWidth + 1;
            }
        }

        // Kick-off the drawing
    }
</script>

<canvas id="visualizer" use:visualiser></canvas>

<style>
    canvas {
        width: 100%;
        height: 300px;
        border: 1px solid black;
    }
</style>
