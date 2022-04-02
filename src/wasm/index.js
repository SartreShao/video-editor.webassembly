import Mapping from "@/map";

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

/**
 * 视频读帧函数
 * @param {*} worker 必须传入 public/readFrame-lib/readFrameWorker.js
 * @param {*} videoFile 传入需要解析的视频文件
 * @param {*} outputWidth 输出视频的宽度
 * @param {*} outputHeight 输出视频的高度
 * @param {*} readFrameList 需要阅读的帧数，请用 "200, 300, 44444" 这样子的数组传入
 * @param {*} isReadFrameBusy 读帧函数当前处于什么状态
 * @param {*} callback 回调函数：会返回图片的 blob 地址
 */
const readFrame = (
  worker,
  videoFile,
  outputWidth,
  outputHeight,
  readFrameList,
  isReadFrameBusy,
  currentReadFrameVideoIndex,
  callback
) => {
  isReadFrameBusy.value = true;

  // console.log(
  //   "execute readFrame file",
  //   currentReadFrameVideoIndex.value,
  //   videoFile.name,
  //   readFrameList
  // );
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
        var timestamp = data.timestamp;
        var rgbSize = data.size;
        var videoWidth = data.width;
        var videoHeight = data.height;

        // 创建一个 RGBA 的容器
        var imageData = new ImageData(rgbBuffers, videoWidth, videoHeight);

        var canvas = new OffscreenCanvas(videoWidth, videoHeight);

        var context = canvas.getContext("2d");

        context.putImageData(imageData, 0, 0, 0, 0, videoWidth, videoHeight);

        var videoIndex = currentReadFrameVideoIndex.value;

        // console.log(
        //   `读帧成功 pre：
        //   key:${videoIndex},
        //   currentKey:${currentReadFrameVideoIndex.value}
        //   file:${videoFile.name},
        //   frame:${Mapping.ms2Frame(timestamp, 30)},
        //   imageData:${imageData}`
        // );

        // // 返回 imageData
        // var blob = await canvas.convertToBlob();
        // var blobUrl = URL.createObjectURL(blob);

        // console.log(
        //   `读帧成功 after
        //   key:${videoIndex},
        //   currentKey:${currentReadFrameVideoIndex.value}
        //   file:${videoFile.name},
        //   frame:${Mapping.ms2Frame(timestamp, 30)},
        //   imageData:${imageData},
        //   blobUrl:${blobUrl},`
        // );

        canvas
          .convertToBlob()
          .then(blob =>
            callback(
              URL.createObjectURL(blob),
              Mapping.ms2Frame(timestamp, 30),
              videoIndex
            )
          );
        break;
      case OnMessageEvent:
        // console.log("fuck OnMessageEvent", data);
        break;
      case StartDecodeEndRsp:
        // console.log("fuck StartDecodeEndRsp", data);
        isReadFrameBusy.value = false;
        break;
      case InitFFCodecRsp:
        // console.log("fuck InitFFCodecRsp", data);
        worker.postMessage({
          what: StartDecodeReq,
          startTimeMs: 0,
          endTimeMs: -1,
          rangeFrameCounts: readFrameList
        });
        break;
      case StopDecodeRsp:
        // console.log("fuck StopDecodeRsp", data);
        break;
      case MediaInfoRsp:
        // console.log("fuck MediaInfoRsp", data);
        break;
    }
  };
};

export default { readFrame };
