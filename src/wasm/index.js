const InitFFCodecReq = 0;
const CloseFFDecodeReq = 1;
const StartDecodeReq = 2;
const AudioPCMFrameRsp = 3;
const VideoRGBFrameRsp = 4;
const OnMessageEvent = 5;
const StartDecodeEndRsp = 6;
const InitFFCodecRsp = 7;
const MediaInfoRsp = 8;
const StopDecodeReq = 9;
const StopDecodeRsp = 10;

const readFrame = (
  worker,
  videoFile,
  outputWidth,
  outputHeight,
  readFrameList,
  callback
) => {
  // 初始化：传入 videoFile、outputWidth、outputHeiight
  worker.postMessage({
    what: InitFFCodecReq,
    isDebug: 0,
    fileSize: -1,
    fileData: null,
    file: videoFile,
    disableType: 1,
    outScaleWidth: outputWidth,
    outScaleHeight: outputHeight,
    isAddBlack: 0,
    outFps: 15,
    ffthreadCount: 1,
    outVideoFormat: -1
  });

  // 监听消息
  worker.onmessage = function (response) {
    const data = response.data;
    switch (data.what) {
      case VideoRGBFrameRsp:
        // 获取返回参数
        var rgbBuffers = data.data;
        var videoPts = data.timestamp;
        var rgbSize = data.size;
        var videoWidth = data.width;
        var videoHeight = data.height;

        // 创建一个 RGBA 的容器
        var imageData = new ImageData(rgbBuffers, videoWidth, videoHeight);

        // 返回 imageData
        callback(imageData);
        break;
      case OnMessageEvent:
        break;
      case StartDecodeEndRsp:
        break;
      case InitFFCodecRsp:
        worker.postMessage({
          what: StartDecodeReq,
          startTimeMs: 0,
          endTimeMs: -1,
          rangeFrameCounts: readFrameList
        });
        break;
      case StopDecodeRsp:
        break;
      case MediaInfoRsp:
        break;
    }
  };
};

export default { readFrame };
