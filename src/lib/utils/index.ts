export async function downloadImage(
    imageSrc: string,
    nameOfDownload = 'my-image.png',
) {
    const response = await fetch(imageSrc);

    const blobImage = await response.blob();

    const href = URL.createObjectURL(blobImage);

    const anchorElement = document.createElement('a');
    anchorElement.href = href;
    anchorElement.download = nameOfDownload;

    document.body.appendChild(anchorElement);
    anchorElement.click();

    document.body.removeChild(anchorElement);
    window.URL.revokeObjectURL(href);
}

async function getStream(url: string) {
    const res = await fetch(url);
    const txt = await res.text();
    const [stream] = txt.match(/http.+/) || [];
    return stream || ''
}

export function match(channel: Record<string, any>, query: Record<string, any>) {
    return Object.entries(query).every(([key, val]) => channel[key] === val)
}

export async function getJSON<T>(url: string): Promise<T> {
    const res = await fetch(url);
    return await res.json();
}

export function imgColor(src: string) {
    const context = document.createElement("canvas").getContext("2d");
    const img = new Image();
    Object.assign(img, { src, crossOrigin: '' });

    console.log(img)

    if (context && img.complete) {
        context.imageSmoothingEnabled = true;
        context.drawImage(img, 0, 0, 1, 1);
        const i = context.getImageData(0, 0, 1, 1).data;

        const rgba = `rgba(${i[0]},${i[1]},${i[2]},${i[3]})`;
        // OR
        const HEX =
            "#" +
            ((1 << 24) + (i[0] << 16) + (i[1] << 8) + i[2])
                .toString(16)
                .slice(1);
        console.log(rgba, HEX);

        // document.body.style.backgroundColor = HEX;
    }
}


export function imageBrightness(src: string, callback: (brightness: number) => void) {
    const img = document.createElement("img");
    img.src = src;
    img.style.display = "none";
    img.crossOrigin = "anonymous"

    let colorSum = 0;

    img.onload = function () {
        const canvas = document.createElement("canvas");

        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        if (ctx) {
            ctx.drawImage(img, 0, 0);

            const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);

            let r, g, b, avg;

            for (let x = 0; x < data.length; x += 4) {
                r = data[x];
                g = data[x + 1];
                b = data[x + 2];

                avg = Math.floor((r + g + b) / 3);
                colorSum += avg;
            }

            const brightness = Math.floor(colorSum / (width * height));
            callback(brightness);
        }
    }
}