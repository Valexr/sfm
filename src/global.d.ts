declare module '*.svg' {
    const content: any;
    export default content;
}

interface ChannelType {
    id: "7soul",
    title: "Seven Inch Soul",
    description: "Vintage soul tracks from the original 45 RPM vinyl.",
    dj: "Dion Watts Garcia",
    djmail: "dion@somafm.com",
    genre: "oldies",
    image: string,
    // largeimage: "https://api.somafm.com/logos/256/7soul256.png",
    // xlimage: string,
    twitter: "",
    updated: "1396144686",
    playlists: Array<Playlist>,
    preroll: [],
    listeners: "60",
    lastPlaying: "Yvonne Fair And The James Brown Band - Tell Me Why",
    src: string,
    song: SongType,
    bg: string
}

interface Playlist {
    url: string,
    src: string
    format: "mp3" | "aac" | "aacp",
    quality: "highest" | "high" | "low",
    title: string
}

interface SongType {
    album: string;
    albumArt: string;
    artist: string;
    title: string;
    date: string
    url: string;
    time: string
}


interface RecordType {
    "id": 15016,
    "prefix": "record",
    "title": "Record",
    "tooltip": "Танцевальный мейнстрим",
    "sort": 0,
    "bg_color": null,
    "bg_image": "https://www.radiorecord.ru/upload/iblock/fd8/record_new.jpeg",
    "bg_image_mobile": "https://www.radiorecord.ru/upload/iblock/74d/record_new.jpeg",
    "svg_outline": "<svg width=\"200\" height=\"200\" viewBox=\"0 0 200 200\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\r\n<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M187.818 71.1672C188.257 72.1242 187.878 73.2574 186.953 73.7589C185.267 74.6722 183.524 75.6071 181.735 76.5673C160.246 88.0954 131.98 103.26 114.524 128.197C114.15 128.732 113.539 129.05 112.886 129.05H87.1142C86.4585 129.05 85.8444 128.729 85.4707 128.19C77.7205 117.015 65.3106 106.503 51.9051 97.2008C38.5262 87.9173 24.304 79.9388 13.0408 73.7816C12.1172 73.2767 11.743 72.1424 12.1849 71.1871C12.6267 70.2318 13.7334 69.7824 14.7162 70.1593C23.6792 73.5962 31.1085 76.7827 38.4383 79.9265C51.4406 85.5033 64.1299 90.9459 84.5127 97.4141L92.0119 90.5243C92.381 90.1852 92.8639 89.9971 93.365 89.9971H106.379C106.886 89.9971 107.374 90.1897 107.745 90.5361L114.989 97.3085C135.506 90.871 148.295 85.4384 161.402 79.8709C168.785 76.7348 176.268 73.556 185.29 70.1306C186.274 69.757 187.38 70.2102 187.818 71.1672ZM155.764 86.5986C144.575 91.2818 132.482 96.0537 115.069 101.474C114.382 101.688 113.634 101.517 113.109 101.026L105.59 93.9971H94.1443L86.3666 101.143C85.84 101.627 85.095 101.792 84.4129 101.578C65.79 95.714 53.3028 90.6182 41.4716 85.5785C45.7103 88.2171 49.987 91.0011 54.1855 93.9144C67.3932 103.079 79.9698 113.618 88.1515 125.05H111.851C123.648 108.566 139.97 96.2891 155.764 86.5986ZM90.3659 105.714C90.3659 101.041 94.7349 97.4072 99.6671 97.4072H99.6927L99.718 97.4073C102.232 97.4392 104.514 98.301 106.201 99.7601L106.221 99.7771C107.937 101.301 109.019 103.431 109.019 105.845C109.019 108.424 107.764 111.727 105.901 114.197L105.892 114.207C104.481 116.052 102.347 117.959 99.7027 118.039C99.6823 118.04 99.6619 118.04 99.6415 118.04H99.4621C99.4522 118.04 99.4423 118.04 99.4324 118.04C99.4206 118.04 99.4088 118.04 99.397 118.039C96.8711 117.957 94.841 116.177 93.5104 114.407C91.6841 111.997 90.4929 108.808 90.3683 106.285C90.3674 106.267 90.3668 106.248 90.3664 106.229C90.3661 106.215 90.3659 106.201 90.3659 106.187V105.714ZM99.6671 101.407C96.4527 101.407 94.3659 103.712 94.3659 105.714V106.133C94.4598 107.76 95.3138 110.165 96.7007 111.994L96.7062 112.001C97.7708 113.419 98.8019 114.005 99.5019 114.04H99.6044C100.391 114.004 101.523 113.334 102.711 111.783C104.176 109.839 105.019 107.364 105.019 105.845C105.019 104.689 104.517 103.617 103.575 102.777C102.652 101.983 101.304 101.43 99.6793 101.407H99.6671Z\" fill=\"white\"/>\r\n</svg>\r\n",
    "svg_fill": "<svg width=\"200\" height=\"200\" viewBox=\"0 0 200 200\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\r\n<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M185.913 73.0637C185.698 72.5827 185.146 72.3517 184.653 72.5337C175.876 75.7837 168.441 78.8597 161.251 81.8347C147.866 87.3727 135.216 92.6067 114.563 98.9007L106.984 92.0177C106.8 91.8507 106.561 91.7587 106.313 91.7577L93.439 91.7377H93.438C93.191 91.7377 92.954 91.8287 92.771 91.9937L84.944 99.0127C64.486 92.7127 51.971 87.4807 38.726 81.9427C31.55 78.9427 24.13 75.8407 15.351 72.5637C14.862 72.3797 14.307 72.6087 14.09 73.0887C13.874 73.5687 14.067 74.1347 14.531 74.3817C41.959 89.0167 71.954 106.726 86.46 127.106C86.648 127.369 86.951 127.526 87.274 127.526H112.72C113.042 127.526 113.345 127.371 113.532 127.109C130.924 102.884 159.412 87.9887 180.213 77.1117C182.02 76.1667 183.775 75.2487 185.467 74.3547C185.933 74.1107 186.128 73.5447 185.913 73.0637ZM103.488 112.356C102.247 113.969 100.884 114.878 99.678 114.915C99.657 114.915 99.596 114.915 99.575 114.917L99.515 114.921C98.381 114.897 97.125 114.067 95.978 112.584C94.583 110.782 93.58 108.295 93.484 106.445C93.484 106.413 93.483 106.365 93.48 106.333C93.468 106.211 93.462 106.089 93.462 105.966C93.462 103.217 96.306 100.896 99.709 100.896C99.733 100.896 99.756 100.895 99.78 100.893C101.475 100.913 103.042 101.462 104.197 102.444C105.332 103.407 105.957 104.697 105.957 106.075C105.957 107.884 104.941 110.467 103.488 112.356Z\" fill=\"white\"/>\r\n</svg>\r\n",
    "pdf_outline": "https://www.radiorecord.ru/upload/iblock/457/rr_main_outline.pdf",
    "pdf_fill": "https://www.radiorecord.ru/upload/iblock/24d/rr_main_filled.pdf",
    "short_title": "Record",
    "icon_gray": "https://www.radiorecord.ru/upload/stations_images/record_image600_gray_outline.png?a=6d293ddf306896f83b4b52b40791c45e",
    "icon_fill_colored": "https://www.radiorecord.ru/upload/stations_images/record_image600_colored_fill.png?a=6d293ddf306896f83b4b52b40791c45e",
    "icon_fill_white": "https://www.radiorecord.ru/upload/stations_images/record_image600_white_fill.png?a=6d293ddf306896f83b4b52b40791c45e",
    "new": false,
    "new_date": null,
    "stream_64": "https://radiorecord.hostingradio.ru/rr_main64.aacp",
    "stream_128": "https://radiorecord.hostingradio.ru/rr_main96.aacp",
    "stream_320": "https://radiorecord.hostingradio.ru/rr_main96.aacp",
    "stream_hls": "https://hls-01-radiorecord.hostingradio.ru/record/playlist.m3u8",
    "genre": [
        {
            "id": 280,
            "name": "HOUSE",
            "detail_picture": null,
            "picture": null,
            "svg": null,
            "pdf": null
        },
        {
            "id": 283,
            "name": "POP",
            "detail_picture": null,
            "picture": null,
            "svg": null,
            "pdf": null
        }
    ],
    "detail_page_url": "/station/record",
    "shareUrl": "https://radiorecord.ru/station/record",
    "mark": null,
    "updated": "09.11.2022 07:48:12"
}