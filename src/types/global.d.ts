export {};

declare global {
    interface Document {
        /**
         * https://developer.mozilla.org/en-US/docs/Web/API/Document/exitPictureInPicture
         */
        exitPictureInPicture(): void;
    }

    interface HTMLVideoElement {
        /**
         * https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/requestPictureInPicture
         */
        requestPictureInPicture(): void;
    }

    interface HTMLCanvasElement {
        /**
         * https://developer.mozilla.org/ja/docs/Web/API/HTMLCanvasElement/captureStream
         */
        captureStream(frameRate?: number): MediaStream;
    }
}
