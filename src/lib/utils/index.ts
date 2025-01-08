async function downloadImage(
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