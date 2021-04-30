import { Logger } from './lib/Logger';
import { Message, MessageType } from './model/Message';

const logger = new Logger('[NicoPIP] ');

interface VideoSource {
    mainVideo: HTMLVideoElement;
    commentCanvas: HTMLCanvasElement;
}

function getSourceFromNicoVideoPage(): VideoSource | undefined {
    const mainVideo = document.querySelector<HTMLVideoElement>('#VideoPlayer video');
    if (mainVideo === null) {
        return undefined;
    }

    const commentCanvas = document.querySelector<HTMLCanvasElement>('#CommentRenderer canvas');
    if (commentCanvas === null) {
        return undefined;
    }

    return { mainVideo, commentCanvas };
}

function getSourceFromNicoLivePage(): VideoSource | undefined {
    const mainVideo = document.querySelector<HTMLVideoElement>('[class^="___video-layer___"] video');
    if (mainVideo === null) {
        return undefined;
    }

    const commentCanvas = document.querySelector<HTMLCanvasElement>('[class^="___comment-layer___"] canvas');
    if (commentCanvas === null) {
        return undefined;
    }

    return { mainVideo, commentCanvas };
}

function assertNotNullish<T>(value: T | null | undefined): T {
    if (value === null || value === undefined) {
        throw new Error('Assertion Error');
    }
    return value;
}

class NicoPIPClient {
    private static instance: NicoPIPClient | null = null;
    private readonly mainVideo: HTMLVideoElement;
    private readonly commentCanvas: HTMLCanvasElement;
    private readonly outputCanvas: HTMLCanvasElement;
    private readonly outputCanvasContext: CanvasRenderingContext2D;
    private readonly outputVideo: HTMLVideoElement;
    private isRunningInPIP = false;

    constructor(mainVideo: HTMLVideoElement, commentCanvas: HTMLCanvasElement) {
        this.mainVideo = mainVideo;
        this.commentCanvas = commentCanvas;

        this.outputCanvas = document.createElement('canvas');
        this.outputCanvas.width = mainVideo.videoWidth;
        this.outputCanvas.height = mainVideo.videoHeight;
        this.outputCanvasContext = assertNotNullish(this.outputCanvas.getContext('2d'));

        this.outputVideo = document.createElement('video');
        this.outputVideo.autoplay = true;
        this.outputVideo.muted = true;
        this.outputVideo.height = this.outputCanvas.height;
        this.outputVideo.width = this.outputCanvas.width;
        this.outputVideo.srcObject = this.outputCanvas.captureStream(60);
        this.outputVideo.style.position = 'fixed';
        this.outputVideo.style.top = '0';
        this.outputVideo.style.left = '0';
        this.outputVideo.style.opacity = '0';
        this.outputVideo.style.pointerEvents = 'none';
        this.outputVideo.controls = true;
        this.outputVideo.addEventListener('leavepictureinpicture', this.onAfterLeavePIP);
    }

    static getInstance() {
        if (!this.instance) {
            const videoSource = getSourceFromNicoVideoPage() ?? getSourceFromNicoLivePage();
            if (videoSource === undefined) {
                logger.warn('Failed to find videoSource');
            } else {
                const { mainVideo, commentCanvas } = videoSource;
                this.instance = new NicoPIPClient(mainVideo, commentCanvas);
            }
        }

        return this.instance;
    }

    toggle() {
        if (this.isRunningInPIP) {
            this.stop();
        } else {
            void this.start();
        }
    }

    async start() {
        this.isRunningInPIP = true;
        this.mainLoop();

        document.body.appendChild(this.outputVideo);
        await this.outputVideo.play();

        this.mainVideo.style.visibility = 'hidden';
        this.commentCanvas.style.visibility = 'hidden';
        this.outputVideo.requestPictureInPicture();
    }

    stop() {
        document.exitPictureInPicture();
        this.onAfterLeavePIP();
    }

    private onAfterLeavePIP = () => {
        this.mainVideo.style.visibility = '';
        this.commentCanvas.style.visibility = '';

        this.outputVideo.pause();
        document.body.removeChild(this.outputVideo);

        this.isRunningInPIP = false;
    };

    private mainLoop = () => {
        if (!this.isRunningInPIP) return;

        this.outputCanvasContext.drawImage(
            this.mainVideo,
            0,
            0,
            this.mainVideo.videoWidth,
            this.mainVideo.videoHeight,
            0,
            0,
            this.outputCanvas.width,
            this.outputCanvas.height
        );
        this.outputCanvasContext.drawImage(
            this.commentCanvas,
            0,
            0,
            this.commentCanvas.width,
            this.commentCanvas.height,
            0,
            0,
            this.outputCanvas.width,
            this.outputCanvas.height
        );
        requestAnimationFrame(this.mainLoop);
    };
}

chrome.runtime.onMessage.addListener((message: Message, sender: chrome.runtime.MessageSender) => {
    if (sender.tab !== undefined) return;

    switch (message.type) {
        case MessageType.TOGGLE_PIP: {
            NicoPIPClient.getInstance()?.toggle();
            break;
        }
    }
});

chrome.runtime.sendMessage({
    type: MessageType.ACTIVATE_BROWSER_ACTION,
});
