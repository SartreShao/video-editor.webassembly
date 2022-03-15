/* eslint-disable no-undef */
self.Module = {
  onRuntimeInitialized: function () {
    onWasmLoaded();
  }
};
const MOUNT_DIR = "/working";
self.importScripts("libffmedia.js");
self.importScripts("constants.js");

function WebFFDecoder() {
  this.videoCallback = null;
  this.audioCallback = null;
  this.messageCallback = null;
  this.requestCallback = null;
  this.initCallback = null;
  this.wasmLoaded = false;
  this.rsp = null;
  this.tmpReqQue = [];
  this.cacheBuffer = null;
  this.clipStartTimeMs = 0;
  this.clipEndTimeMs = -1;
  this.isInitOk = 0;
  this.isSendDataOk = 0;
  this.isOpenCodecOk = 0;
  this.isDebug = 0;
}

// 字母字符串转byte数组
function stringToBytes(str) {
  var ch,
    st,
    re = [];
  for (var i = 0; i < str.length; i++) {
    ch = str.charCodeAt(i); // get char
    st = []; // set up "stack"
    do {
      st.push(ch & 0xff); // push byte to stack
      ch = ch >> 8; // shift value down by 1 byte
    } while (ch);
    // add stack contents to result
    // done because chars have "wrong" endianness
    re = re.concat(st.reverse());
  }
  // return an array of bytes
  return re;
}

/**
 * 初始化底层缓存
 * @param file_size 填写文件大小即可，单位 kb
 */

/**
 * 初始化 ffmpeg for web 解码器
 * @param url 媒体资源
 * @param outScaleWidth 支持缩放视频的宽，保持原始的话传入 -1
 * @param outScaleHeight 支持缩放视频的高，保持原始的话传入 -1
 * @param outVideoFormat 0:yuv420p 2:rgb 3:bgr  默认传入 -1 返回 rgb
 */
WebFFDecoder.prototype.initFFmpegDecoder = function (
  isDebug,
  ffthreadCount,
  file,
  fileSize,
  fileData,
  disType,
  outScaleWidth,
  outScaleHeight,
  isAddBlack,
  outVideoFormat,
  outFps
) {
  this.isDebug = isDebug;
  let buf_len = -1;
  if (fileSize > 0) {
    this.cacheBuffer = Module._malloc(fileSize);
    var typedArray = new Uint8Array(fileData);
    buf_len = typedArray.length;
    Module.HEAPU8.set(typedArray, this.cacheBuffer);
  }
  let ps_file_path = null;
  let tempPath = null;
  if (file != null) {
    // 创建并挂载 FS 工作目录.
    if (!FS.analyzePath(MOUNT_DIR).exists) {
      FS.mkdir(MOUNT_DIR);
      // console.info("web initFFmpegDecoder mkdir");
    }
    FS.mount(WORKERFS, { files: [file] }, MOUNT_DIR);
    // console.info(
    //   "web initFFmpegDecoder mount initFFDecoder",
    //   `${MOUNT_DIR}/${file.name}`
    // );
    tempPath = `${MOUNT_DIR}/${file.name}`;
    let urlTmp = intArrayFromString(tempPath).concat(0); // add '\0'
    ps_file_path = Module._malloc(urlTmp.length); // 用声明的c函数分配内存
    Module.HEAPU8.set(urlTmp, ps_file_path); //复制url内容

    // let filename = stringToBytes(`${MOUNT_DIR}/${file.name}`)
    // ps_file_path = Module._malloc(filename.length);//通过emscripten分配C/C++中的堆内存
    // if (ps_file_path === null) {
    //     return;
    // }
    // var aKeyData = Module.HEAPU8.subarray(ps_file_path, ps_file_path + filename.length);//堆内存绑定到视图对象
    // aKeyData.set(new Uint8Array(filename));
  }
  if (this.isDebug == 1) {
    console.info(
      "disType=" +
        disType +
        "fileSize=" +
        fileSize +
        " videoCallback=" +
        this.videoCallback +
        " audioCallback=" +
        this.audioCallback +
        " messageCallback=" +
        this.messageCallback +
        " initCallback=" +
        this.initCallback
    );
  }
  let ret = Module._initFFDecoder(
    isDebug,
    ffthreadCount,
    buf_len,
    ps_file_path,
    this.cacheBuffer,
    disType,
    outScaleWidth,
    outScaleHeight,
    isAddBlack,
    outVideoFormat,
    outFps,
    this.videoCallback,
    this.audioCallback,
    this.requestCallback,
    this.messageCallback,
    this.initCallback
  );
  if (this.cacheBuffer != null) {
    Module._free(this.cacheBuffer);
    this.cacheBuffer = null;
  }
  if (ps_file_path != null) {
    Module._free(ps_file_path);
    ps_file_path = null;
  }
  if (ret < 0) {
    console.error("initFFmpegDecoder fatal！ret=" + ret);
  } else {
    let rsp = {
      what: InitFFCodecRsp,
      path: tempPath,
      id: ret
    };
    rsp = Object.assign(this.rsp, rsp);
    self.postMessage(rsp);
  }
};

/**
 * 开始裁剪 单位毫秒，同步函数解码完成即退出
 * @param {*} startTimeMs 开始裁剪的值
 * @param {*} endTimeMs  停止裁剪的值
 */
WebFFDecoder.prototype.startClip = function (
  startTimeMs,
  endTimeMs,
  rangeFrameCounts
) {
  this.clipStartTimeMs = startTimeMs;
  this.clipEndTimeMs = endTimeMs;
  let ret = 0;
  if (rangeFrameCounts != null) {
    // let strs = stringToBytes(rangeFrameCounts)
    // let str = Module._malloc(strs.length);//通过emscripten分配C/C++中的堆内存
    // if (str === null) {
    //     return;
    // }
    // var strData = Module.HEAPU8.subarray(str, str + strs.length);//堆内存绑定到视图对象
    // strData.set(new Uint8Array(strs));

    let frame_str = intArrayFromString(rangeFrameCounts).concat(0); // add '\0'
    let str = Module._malloc(frame_str.length); // 用声明的c函数分配内存
    Module.HEAPU8.set(frame_str, str); //复制url内容

    ret = Module._startDecode(startTimeMs, endTimeMs, -1, str);

    Module._free(str);
    str = null;
  } else {
    ret = Module._startDecode(startTimeMs, endTimeMs, -1, null);
  }

  if (ret < 0) {
    console.error("web decode fatal! errorCodec=" + ret);
  } else {
    let rsp = {
      what: StartDecodeEndRsp
    };
    self.postMessage(rsp);
  }
};
WebFFDecoder.prototype.stopFFDecoder = function () {
  console.info("web stopFFDecoder");
  Module._stopDecode();
  let rsp = {
    what: StopDecodeRsp
  };
  self.postMessage(rsp);
};

/**
 * 关闭本次解码器
 */
WebFFDecoder.prototype.closeFFDecoder = function () {
  // console.info("web closeFFDecoder");
  Module._closeDecoder();
  if (this.cacheBuffer != null) {
    Module._free(this.cacheBuffer);
    this.cacheBuffer = null;
  }
  if (this.isDebug == 1) console.info("web closeFFDecoder");

  //如果存在这个路径就卸载它
  if (FS.analyzePath(MOUNT_DIR).exists) {
    FS.unmount(MOUNT_DIR);
    // FS.rmdir(MOUNT_DIR)
    // console.info("web closeFFDecoder unmount");
  }
};

/**
 * worker 消息处理
 * @param req
 */
WebFFDecoder.prototype.processReq = function (req) {
  switch (req.what) {
    case InitFFCodecReq: //第一步
      this.closeFFDecoder();
      this.initFFmpegDecoder(
        req.isDebug,
        req.ffthreadCount,
        req.file,
        req.fileSize,
        req.fileData,
        req.disableType,
        req.outScaleWidth,
        req.outScaleHeight,
        req.isAddBlack,
        req.outVideoFormat,
        req.outFps
      );
      break;
    case StartDecodeReq: //第二步
      this.startClip(req.startTimeMs, req.endTimeMs, req.rangeFrameCounts);
      break;
    case CloseFFDecodeReq: //结束
      this.closeFFDecoder();
      break;
    case StopDecodeReq: //发起停止解码的请求
      console.error("接收停止解码消息请求");
      this.stopFFDecoder();
      break;
    default:
      console.error("Unsupport messsage " + req.t);
  }
};

WebFFDecoder.prototype.cacheReq = function (req) {
  if (req) {
    this.tmpReqQue.push(req);
  }
};

/**
 * 调用 startClip 之后的回调
 */
WebFFDecoder.prototype.onWasmLoaded = function () {
  this.wasmLoaded = true;
  //   timestamp 代表当前 帧 显示的时间位置， 相当于当前视频的时间位置
  this.videoCallback = Module.addFunction(function (
    buff,
    scale_width,
    scale_height,
    format,
    size,
    timestamp
  ) {
    if (self.ffDecoder.isDebug == 1)
      console.info(
        " videoCallback > scale_width=" +
          scale_width +
          " scale_height=" +
          scale_height +
          " video_format=" +
          format +
          " size=" +
          size +
          " timestamp=" +
          timestamp
      );
    let imageBuffer = Module.HEAPU8.slice(buff, buff + size);
    const imageDataBuffer = new Uint8ClampedArray(
      scale_width * scale_height * 4
    );
    let j = 0;
    for (let i = 0; i < imageBuffer.length; i++) {
      if (i && i % 3 == 0) {
        imageDataBuffer[j] = 255;
        j += 1;
      }
      imageDataBuffer[j] = imageBuffer[i];
      j += 1;
    }
    let rsp = {
      what: VideoRGBFrameRsp,
      size: imageDataBuffer.length,
      width: scale_width,
      height: scale_height,
      data: imageDataBuffer,
      timestamp: timestamp
    };
    self.postMessage(rsp);
  },
  "viiiiii");

  //buff : pcm 数据
  this.audioCallback = Module.addFunction(function (
    buff,
    sampleRate,
    channels,
    size,
    timestamp
  ) {
    var outArray = Module.HEAPU8.subarray(buff, buff + size);
    var data = new Uint8Array(outArray);
    var rsp = {
      what: AudioPCMFrameRsp,
      timestamp: timestamp,
      data: data,
      sampleRate: sampleRate,
      channels: channels,
      size: size
    };
    self.postMessage(rsp);
    if (self.ffDecoder.isDebug == 1)
      console.info(
        " audioCallback > sampleRate=" +
          sampleRate +
          " channels=" +
          channels +
          " size=" +
          size +
          " timestamp=" +
          timestamp
      );
  },
  "viiiii");

  // messageCallback
  this.messageCallback = Module.addFunction(function (event) {
    // console.error(" messageCallback > " + event);
    var rsp = {
      what: OnMessageEvent,
      event: event
    };
    self.postMessage(rsp);
  }, "vi");

  //initCallback 初始化成功的回调
  this.initCallback = Module.addFunction(function (
    width,
    height,
    videoBitRate,
    videoFps,
    videoRotate,
    sampleRate,
    channels,
    totalMs
  ) {
    // console.info(" initCallback > width=" + width + " height=" + height + " videoBitRate=" + videoBitRate + " videoFps=" + videoFps + " videoRotate=" + videoRotate + " sampleRate=" + sampleRate
    //     + " channels=" + channels + " totalMs=" + totalMs);
    var rsp = {
      what: MediaInfoRsp,
      width: width,
      height: height,
      videoBitRate: videoBitRate,
      videoFps: videoFps,
      videoRotate: videoRotate,
      sampleRate: sampleRate,
      channels: channels,
      totalMs: totalMs
    };
    this.ffDecoder.rsp = rsp;
    // self.postMessage(rsp)
  },
  "viiiiiiii");

  //request 暂时不用管该回调
  this.requestCallback = Module.addFunction(function (offset, available) {
    // if (self.ffDecoder.isDebug == 1)
    //     console.info(" requestCallback > offset=" + offset + " available=" + available);
  }, "vii");

  while (this.tmpReqQue.length > 0) {
    var req = this.tmpReqQue.shift();
    this.processReq(req);
  }
};

self.ffDecoder = new WebFFDecoder();

self.onmessage = function (evt) {
  if (!self.ffDecoder) {
    console.log("[ER] Decoder not initialized!");
    return;
  }

  var req = evt.data;
  if (!self.ffDecoder.wasmLoaded) {
    self.ffDecoder.cacheReq(req);
    console.info("Temp cache req " + req.t + ".");
    return;
  }
  self.ffDecoder.processReq(req);
};

function onWasmLoaded() {
  if (self.ffDecoder) {
    self.ffDecoder.onWasmLoaded();
  } else {
    console.log("[ER] No decoder!");
  }
}
