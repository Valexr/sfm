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

        document.body.style.backgroundColor = HEX;
    }
}