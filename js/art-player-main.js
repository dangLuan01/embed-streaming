document.addEventListener("DOMContentLoaded", (event) => {
    window.player = new Artplayer({
        container: '#container',
        url: url,
        autoplay: false,
        autoSize: false,
        loop: false,
        mutex: true,
        setting: true,
        pip: true,
        flip: false,
        lock: true,
        fastForward: true,
        playbackRate: true,
        aspectRatio: true,
        theme: '#00b3ff',
        fullscreen: true,
        fullscreenWeb: false,
        miniProgressBar: true,
        autoOrientation: true,
        subtitleOffset: true,
        airplay: false,
        moreVideoAttr: {
            crossOrigin: 'anonymous',
        },
        whitelist: ['*'],
        customType: {
            m3u8: function (video, url) {
                if (Hls.isSupported()) {
                    if (window.player.hls) window.player.hls.destroy();
                    const hls = new Hls({
                       
                        lowLatencyMode: false,        
                        maxBufferLength: 12,          
                        backBufferLength: 6,          
                        maxBufferHole: 0.5,           
                        maxFragLookUpTolerance: 0.2,  
                        fragLoadingMaxRetry: 3,       
                        fragLoadingTimeOut: 8000,     
                        enableWorker: true,          
                        startPosition: -1,           
                        autoStartLoad: true,         
                    });

                    hls.loadSource(url);
                    hls.attachMedia(video);
                    window.player.hls = hls;
                    window.player.on('destroy', () => hls.destroy());

                    let lastSeekTime = 0;
                    window.player.on('seek', (time) => {
                        const diff = Math.abs(time - lastSeekTime);
                        if (diff > 1) {
                            hls.stopLoad();
                            hls.startLoad(time);
                            lastSeekTime = time;
                        }
                    });
                    hls.on(Hls.Events.BUFFER_STALLED_ERROR, () => {
                        hls.startLoad(window.player.currentTime);
                    });
                } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = url;
                } else {
                    window.player.notice.show = 'Unsupported playback format: m3u8';
                }
            },
        },
    });
    
    window.player.controls.add({
        name: 'backward',
        position: 'right',
        html: `
        <svg width="24" height="24" viewBox="0 0 396 430" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g fill="currentColor">
                <path d="M237.342 26.3129C243.281 20.3742 243.281 10.7449 237.342 4.80589C231.403 -1.13321 221.773 -1.13321 215.835 4.80589L178.779 41.8615C178.72 41.9187 178.661 41.9765 178.603 42.0348C175.633 45.0044 174.148 48.8971 174.149 52.7894C174.148 56.6821 175.633 60.5748 178.603 63.5444C178.661 63.6027 178.72 63.6605 178.779 63.7178L215.835 100.773C221.773 106.713 231.403 106.713 237.342 100.773C243.281 94.8342 243.281 85.205 237.342 79.2663L225.235 67.1593C254.972 72.106 283 85.0372 306.208 104.807C336.452 130.57 356.532 166.263 362.848 205.487C369.165 244.711 361.305 284.903 340.677 318.858C320.05 352.813 288.003 378.312 250.282 390.783C212.56 403.255 171.63 401.885 134.828 386.919C98.0256 371.951 67.7562 344.366 49.4459 309.108C31.1355 273.849 25.9816 233.222 34.9071 194.508C43.8326 155.794 66.2547 121.524 98.1538 97.8413C104.898 92.8343 106.306 83.3091 101.299 76.5649C96.2924 69.8212 86.7666 68.4135 80.0229 73.4199C42.3199 101.412 15.8181 141.916 5.26888 187.674C-5.28085 233.432 0.811443 281.452 22.4528 323.125C44.0947 364.8 79.8708 397.403 123.37 415.093C166.868 432.784 215.246 434.403 259.83 419.662C304.414 404.921 342.292 374.783 366.672 334.65C391.052 294.517 400.343 247.012 392.877 200.651C385.412 154.291 361.679 112.104 325.932 81.653C297.666 57.5743 263.349 42.0784 227.007 36.6477L237.342 26.3129Z">
                </path>
                <path d="M150.883 149.325C150.883 131.568 129.676 122.388 116.729 134.54L90.9877 158.701C84.8635 164.449 84.5588 174.073 90.3069 180.197C96.055 186.321 105.68 186.626 111.803 180.878L120.467 172.746V312.954C120.467 321.354 127.276 328.162 135.675 328.162C144.074 328.162 150.883 321.354 150.883 312.954V149.325Z">
                </path>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M190.579 187.772C190.579 159.154 213.779 135.953 242.398 135.953C271.016 135.953 294.217 159.154 294.217 187.772V276.358C294.217 304.976 271.016 328.176 242.398 328.176C213.779 328.176 190.579 304.976 190.579 276.358V187.772ZM263.801 187.772V276.358C263.801 288.178 254.218 297.761 242.398 297.761C230.577 297.761 220.995 288.178 220.995 276.358V187.772C220.995 175.952 230.577 166.369 242.398 166.369C254.218 166.369 263.801 175.952 263.801 187.772Z">
                </path>
            </g>
        </svg>`,
        tooltip: 'Forward 10 second',
        click: function () {
            window.player.seek = Math.max(window.player.currentTime - 5, 0);
        },
    });

    window.player.controls.add({
        name: 'forward',
        position: 'right',
        html: `
        <svg width="24" height="24" viewBox="0 0 396 430" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g fill="currentColor">
                <path d="M158.267 26.3129C152.327 20.3742 152.327 10.7449 158.267 4.80589C164.206 -1.13321 173.835 -1.13321 179.774 4.80589L216.829 41.8615C216.889 41.9187 216.947 41.9765 217.005 42.0348C219.975 45.0044 221.46 48.8971 221.46 52.7894C221.46 56.6821 219.975 60.5748 217.005 63.5444C216.947 63.6027 216.889 63.6605 216.829 63.7178L179.774 100.773C173.835 106.713 164.206 106.713 158.267 100.773C152.327 94.8342 152.327 85.205 158.267 79.2663L170.374 67.1593C140.637 72.106 112.608 85.0372 89.4001 104.807C59.1561 130.57 39.0766 166.263 32.7602 205.487C26.4439 244.711 34.3038 284.903 54.9314 318.858C75.5589 352.813 107.605 378.312 145.327 390.783C183.048 403.255 223.978 401.885 260.781 386.919C297.583 371.951 327.852 344.366 346.163 309.108C364.473 273.849 369.627 233.222 360.701 194.508C351.776 155.794 329.354 121.524 297.455 97.8413C290.711 92.8343 289.303 83.3091 294.31 76.5649C299.316 69.8212 308.842 68.4135 315.585 73.4199C353.288 101.412 379.79 141.916 390.34 187.674C400.889 233.432 394.797 281.452 373.156 323.125C351.514 364.8 315.738 397.403 272.239 415.093C228.74 432.784 180.363 434.403 135.778 419.662C91.1941 404.921 53.3168 374.783 28.9365 334.65C4.55614 294.517 -4.73438 247.012 2.73119 200.651C10.1968 154.291 33.9297 112.104 69.6765 81.653C97.9424 57.5743 132.259 42.0784 168.601 36.6477L158.267 26.3129Z">
                </path>
                <path d="M150.883 149.325C150.883 131.568 129.676 122.388 116.729 134.54L90.9877 158.701C84.8635 164.449 84.5588 174.073 90.3069 180.197C96.055 186.321 105.68 186.626 111.803 180.878L120.467 172.746V312.954C120.467 321.354 127.276 328.162 135.675 328.162C144.074 328.162 150.883 321.354 150.883 312.954V149.325Z">
                </path>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M190.579 187.772C190.579 159.154 213.779 135.953 242.398 135.953C271.016 135.953 294.217 159.154 294.217 187.772V276.358C294.217 304.976 271.016 328.176 242.398 328.176C213.779 328.176 190.579 304.976 190.579 276.358V187.772ZM263.801 187.772V276.358C263.801 288.178 254.218 297.761 242.398 297.761C230.577 297.761 220.995 288.178 220.995 276.358V187.772C220.995 175.952 230.577 166.369 242.398 166.369C254.218 166.369 263.801 175.952 263.801 187.772Z">
                </path>
            </g>
        </svg>`,
        tooltip: 'Seek 10 second',
        click: function () {
            window.player.seek = Math.min(window.player.currentTime + 5, window.player.duration);
        },
    });

    window.video_hash = resumeKey;
    if(window.video_hash == '') window.video_hash = location.href.split('/').slice(-2).shift();
    window.player.on('video:progress', (event) => {
        if (!window.player.currentTime) { return }
        localStorage.setItem(window.video_hash, window.player.currentTime)
    })
    window.player.on('ready', () => {
        window.player.contextmenu.remove('version')

        var progress = parseFloat(localStorage.getItem(window.video_hash))
        if (isNaN(progress)) {
            progress = 0
        }
        window.player.seek = progress
    })

});
