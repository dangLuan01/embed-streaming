var isSafari = navigator.vendor && navigator.vendor.indexOf('Apple') > -1 &&
    navigator.userAgent &&
    navigator.userAgent.indexOf('CriOS') == -1 &&
    navigator.userAgent.indexOf('FxiOS') == -1;

function getUuidFromHash() {
    return location.hash.substring(1); 
}

var results = [];

function getData() {
    const url = "https//streamingapi.xoailac.top/streaming/subtitles/" + getUuidFromHash();
    
    return fetch(url)
        .then(response => response.json())
        .then(result => {
            results = result.data[0];
        })
        .catch(err => console.error(err));
}

function toTracks() {
    if (!results) {
        return
    }
    
    return results.map(item => ({
        file: "https://streamingapi.xoailac.top/streaming/subtitles/"
              + item.video_uuid + "/" + item.uuid,
        label: item.languages,
        kind: "captions"
    }));
}

var link = 'https://streamingapi.xoailac.top/streaming/playlist/' + getUuidFromHash() + '/master.m3u8';
var playerInstance = jwplayer('jwplayer');
function setupVideo() {
    playerInstance.setup({
        key: "ITWMv7t88JGzI0xPwW8I0+LveiXX9SWbfdmt0ArUSyc=",
        width: '100%',
        height: '100%',
        playlist: [
            {
                sources: [
                    {
                        file: link,
                    },
                ],
                tracks: toTracks()
            }
        ],
        // logo: {
        //     "file": "/logo.png",
        //     "hide": "false",
        //     "position": "bottom-right"
        // },
        
        playbackRateControls: true,
        playbackRates: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2],
        mute: false,
        startparam: 'start',
        preload: 'auto',
        autostart: false,
        volume: 100,
        hlsjsConfig: {
            forceHLS: isSafari,
        }
    
    });
    setUpVideoEvent();
}
this.setUpVideoEvent = function () {
    playerInstance.on("ready", function () {
        const playerContainer = playerInstance.getContainer();
        const fixedTimeline = document.createElement("div");
        fixedTimeline.className = "jw-fixed-progress";
        const fixedBuffer = document.createElement("div");
        fixedBuffer.className = "jw-fixed-buffer-bar";
        const fixedBar = document.createElement("div");
        fixedBar.className = "jw-fixed-progress-bar";
        fixedTimeline.appendChild(fixedBuffer);
        fixedTimeline.appendChild(fixedBar);
        playerContainer.appendChild(fixedTimeline);
        
        // --- Forward 10s ---
        const buttonContainer = playerContainer.querySelector(".jw-button-container");
        const rewindContainer = playerContainer.querySelector(".jw-display-icon-rewind");
        const forwardContainer = rewindContainer.cloneNode(true);
        const forwardDisplayButton = forwardContainer.querySelector(".jw-icon-rewind");
        forwardDisplayButton.style.transform = "scaleX(-1)";
        forwardDisplayButton.ariaLabel = "Forward 10 Seconds";
        const nextContainer = playerContainer.querySelector(".jw-display-icon-next");
        nextContainer.parentNode.insertBefore(forwardContainer, nextContainer);
        playerContainer.querySelector(".jw-display-icon-next").style.display = "none";
        const rewindControlBarButton = buttonContainer.querySelector(".jw-icon-rewind");
        const forwardControlBarButton = rewindControlBarButton.cloneNode(true);
        forwardControlBarButton.style.transform = "scaleX(-1)";
        forwardControlBarButton.ariaLabel = "Forward 10 Seconds";
        rewindControlBarButton.parentNode.insertBefore(
            forwardControlBarButton,
            rewindControlBarButton.nextElementSibling
        );
        [forwardDisplayButton, forwardControlBarButton].forEach((button) => {
            button.onclick = () => {
                playerInstance.seek(playerInstance.getPosition() + 10);
            };
        });
        setInterval(() => {
            const duration = playerInstance.getDuration();
            const position = playerInstance.getPosition();
            const buffer = playerInstance.getBuffer();
            if (duration > 0) {
                const progress = (position / duration) * 100;
                fixedBar.style.width = `${progress}%`;
            }
            fixedBuffer.style.width = `${buffer}%`;
        }, 500);
        function isControlBarVisible() {
            const controlBar =
                playerContainer.querySelector(".jw-controlbar") ||
                playerContainer.querySelector(".jw-controls") ||
                playerContainer.querySelector(".jw-button-container") || null;
            if (!controlBar) return false;
            const cs = window.getComputedStyle(controlBar);
            if (cs.display === "none" || cs.visibility === "hidden" || cs.opacity === "0") {
                return false;
            }
            if (controlBar.offsetParent === null) return false;
            const rect = controlBar.getBoundingClientRect();
            if (rect.width === 0 && rect.height === 0) return false;
            return true;
        }
        function updateFixedTimelineVisibility() {
            const state = (typeof playerInstance.getState === "function") ? playerInstance.getState() : null;
            const controlsVisible = isControlBarVisible();
            const shouldShow = (state !== "paused" && state !== "idle" && !controlsVisible);
            if (shouldShow) {
                fixedTimeline.style.opacity = "1";
                fixedTimeline.style.pointerEvents = "none";
            } else {
                fixedTimeline.style.opacity = "0";
                fixedTimeline.style.pointerEvents = "none";
            }
        }
        if (playerInstance && typeof playerInstance.on === "function") {
            playerInstance.on("play", updateFixedTimelineVisibility);
            playerInstance.on("pause", updateFixedTimelineVisibility);
            playerInstance.on("controls", function (e) {
                updateFixedTimelineVisibility();
            });
        }
        const mo = new MutationObserver(function () {
            if (window._fixedTimelineDebounce) clearTimeout(window._fixedTimelineDebounce);
            window._fixedTimelineDebounce = setTimeout(() => {
                updateFixedTimelineVisibility();
            }, 50);
        });
        mo.observe(playerContainer, { attributes: true, childList: true, subtree: true });
        setTimeout(updateFixedTimelineVisibility, 100);
    })
    .on("error", function (message) {
        var time = playerInstance.getPosition();
        if (time > 8 && (manualSeek == false)) timeToSeek = time;
        if (reloadTimes < 5) {
            reloadTimes++;
            if (message["message"] == "Error loading media: File could not be played") {
                setTimeout(function () {
                    jQuery("#jwplayer").find(".jw-title-primary").text("Có chút vấn đề khi load phim. Đang thử lại...").show();
                }, 100);
            }
            setTimeout(function () {
                playerInstance.remove();
                setupVideo();
            }, 2000);
        } else {
            if (message["message"] == "Error loading media: File could not be played") {
                setTimeout(function () {
                    jQuery("#jwplayer").find(".jw-title-primary").text("Có chút vấn đề khi load phim").show();
                    jQuery("#jwplayer").find(".jw-title-secondary").text("Chạy lại trang (ấn F5)").show();
                }, 100);
            }
        }
    })
}
//setupVideo();

getData().then(() => {
    setupVideo();
})