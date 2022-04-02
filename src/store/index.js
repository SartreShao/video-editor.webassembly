import { provide, ref, computed, reactive, watchEffect, watch } from "vue";
import Mapping from "@/map";
import { ReadFrame } from "@/viewmodels";
import WASM from "@/wasm";

/**
 * This file define global states in project
 */

// 帧宽度
const frameWidth = Symbol();

// 格子宽度
const gridWidth = Symbol();

// 格子内帧数
const gridFrame = Symbol();

// 组格子内帧数
const groupGridFrame = Symbol();

// 时间轴容器宽度
const timeLineContainer_width = Symbol();

// 时间轴宽度
const timeLine_width = Symbol();

// 时间轴刻度尺宽度
const timescale_width = Symbol();

// 时间轴偏移量
const timeLineOffsetLeft = Symbol();

// 时间轴左偏移占位宽度
const timescale_placeholder_width = Symbol();

// 时间轴素材最大帧数
const maxFrameOfMaterial = Symbol();

// 最大帧宽度
const maxFrameWidth = Symbol();

// 最小帧宽度
const minFrameWidth = Symbol();

// 合适帧宽度
const fitFrameWidth = Symbol();

// 当前播放的视频 URL
const currentVideoUrl = Symbol();

// 项目核心数据
const coreData = Symbol();

// 当前段落焦点，初始值为 1
const currentSectionIndex = Symbol();

// 读帧用的 Worker
const readFrameWorker = Symbol();

// 视频帧图的宽度
const VIDEO_FRAME_WIDTH = 92.44;

// 视频帧图的高度
const VIDEO_FRAME_HEIGHT = 52;

// WASM ReadFrame 读帧的状态
const isReadFrameBusy = Symbol();

// 帧图的内存缓存区
const videoFrameBuffer = Symbol();

// 读帧任务栈
const readFrameTaskStack = Symbol();

// 扁平帧图列表：决定了当前屏幕上应该显示的帧图+ 前后该缓存的帧图
const flatFrameList = Symbol();

// 帧图列表
const framesMap = Symbol();

// 当前 ReadFrame 函数在读的视频的 VideoIndex
const currentReadFrameVideoIndex = Symbol();

// 临时存储视频帧数（只保存第一个视频的帧数）
const videoFrameList = Symbol();

const currentFile = Symbol();

const rightCount = Symbol();

const errorCount = Symbol();

function useProvider() {
  // init data
  const $timeLineContainer_width = ref(0);
  const $frameWidth = ref(0.003);
  const $timeLineOffsetLeft = ref(0);
  const $currentVideoUrl = ref("");
  const $coreData = reactive({
    // 系统参数
    systemParam: {
      // 产品代号
      appType: 0,
      // 版本号，注意：这里是视频结构化数据格式版本，当前版本 2
      versionCode: 0,
      // 平台：ios/android/pc
      platform: "pc"
    },
    // 视频元数据
    videoMetaData: {
      // 标题
      title: "",
      // 合成视频宽
      videoWidth: 0,
      // 合成视频高
      videoHeight: 0,
      // 封面
      coverUrl: "",
      // 合成视频总时长，单位：微秒
      duration: 0,
      // 素材总大小，单位：byte，服务端返回结构化数据时，会计算该参数的值
      materialTotalSize: 0,
      // 是否添加片尾（1：是，0：否）
      appendTailStatus: 0,
      // 画布类型（1：原始，2：9比16，3：1比1，4：16比9）
      canvasType: 0
    },
    // 全局设置
    globalSetting: {
      // 画布类型（1：原始，2：9比16，3：1比1，4：16比9）
      canvasType: 1,
      // 是否添加片尾（1：是，0：否）
      appendTailStatus: 0,
      // 是否添加自动特效（1：是，0：否）
      addAutoEffect: 0,
      // 视频音量增益，保留一位小数，取值范围 0.0 - 10.0，大于1，表示音量增强。小于1，表示音量减小。0.0 表示静音
      videoVolumeGain: 0.0,
      // 字幕位置布局：(bottom/center/top)
      subtitleLayoutType: "",
      // 字幕字体
      subtiitleFontSize: 0,
      // 字幕字体颜色
      subtitleFontColor: "",
      // 字幕背景色
      subtitleBgColor: ""
    },
    // 段落列表
    sections: [
      {
        // 段落类型（普通段：normal/全局段：global）
        sectionType: "normal",
        // 段落序号，从1开始
        sectionIndex: 1,
        // 段落文字
        sectionText: "",
        // 段落相对于项目时间线的入点，单位：微秒
        projecttimelineIn: 0,
        // 段落相对于项目时间线的出点，单位：微秒
        projecttimelineOut: 0,
        // 段落时长，单位：微秒
        duration: 0,
        // 段落时间线
        sectionTimeline: {
          // 视觉轨
          visionTrack: {
            // 素材数量
            count: 0,
            // 视觉轨道时长，单位：微秒
            duration: 0,
            // 视觉轨素材列表
            visionTrackMaterials: [
              // {
              //   // 素材id（素材类型为subtitle时ID可以为空）
              //   id: 0,
              //   // 素材类型（image, video, gif, subtitle）
              //   type: "",
              //   // 素材宽
              //   width: 0,
              //   // 素材高
              //   height: 0,
              //   // 素材时长，单位：微秒
              //   duration: 0,
              //   // 素材旋转角度
              //   rotate: 0,
              //   // 素材相对于时间线的入点，单位：微秒
              //   timelineIn: 0,
              //   // 素材相对于时间线的出点，单位：微秒
              //   timelineOut: 0,
              //   // 素材片段相对于素材的入点，单位：微秒
              //   in: 0,
              //   // 素材片段相对于素材的出点，单位：微秒
              //   out: 0,
              //   // 音量增益，保留一位小数，取值范围 0.00 - 10.00，大于1，表示音量增强。小于1，表示音量减小。0.0 表示静音，1 表示原始音量
              //   volumeGain: 0.0,
              //   // 画布填充方式（full:充满画布，complete:完整显示）
              //   canvasFillType: "",
              //   // 字幕信息，当素材类型为subtitle时需要传值
              //   subtitleInfo: {
              //     // 位置布局
              //     layoutType: "",
              //     // 字幕内容
              //     text: "",
              //     // 字体
              //     font: "",
              //     // 字号
              //     fontSize: 0,
              //     // 字体颜色
              //     fontColor: "",
              //     // 背景色
              //     bgColor: "",
              //     // 字幕内容对应的 tts url
              //     ttsMediaUrl: ""
              //   },
              //   // 素材时长适配方式
              //   materialDurationFit: {
              //     // 适配方式（multiple:倍数, loop:循环，staticFrame:定帧）
              //     fitType: "",
              //     // 倍数值，0.1 - 10  大于1表示快速，小于1表示慢速
              //     multipleValue: 0.0,
              //     // 循环次数
              //     loopValue: 0
              //   },
              //   // 素材尺寸裁剪
              //   materialSizeClip: {
              //     // 相对于 TopLeft 的偏移坐标 x
              //     x: 0,
              //     // 相对于 TopLeft 的偏移坐标 y
              //     y: 0,
              //     // 剪裁后的宽
              //     width: 0,
              //     // 剪裁后的高
              //     height: 0,
              //     // 缩放比例
              //     scale: 0,
              //     // 旋转角度
              //     rotate: 0
              //   },
              //   // 素材位置
              //   materialPosition: {
              //     // 相对于 TopLeft 的偏移坐标 x
              //     x: 0,
              //     // 相对于 TopLeft 的偏移坐标 y
              //     y: 0,
              //     // 在画布中的宽
              //     width: 0,
              //     // 在画布中的高
              //     height: 0
              //   },
              //   // 素材图层
              //   materialLayer: {
              //     // 图层
              //     layer: 0
              //   },
              //   // 素材特效
              //   materialEffect: {
              //     // 特效类型
              //     type: "",
              //     // 特效参数
              //     params: ""
              //   },
              //   // 素材url，前端不需要传值，服务端返回sdata数据时，会根据素材ID赋值
              //   materialUrl: "",
              //   // 素材文件内容 md5 值
              //   contentMd5: ""
              // }
            ]
          },
          // 音频轨
          audioTrack: {
            // 素材数量
            count: 0,
            // 音频轨道时长
            duration: 0,
            // 音频轨素材列表
            audioTrackMaterials: [
              // {
              //   // 素材 id
              //   id: 0,
              //   // 素材类型
              //   type: "",
              //   // 音频类型
              //   voiceType: "",
              //   // 素材时长
              //   duration: 0,
              //   // 素材相对于时间线的入点
              //   timelineIn: 0,
              //   // 素材相对于时间线的出点
              //   timelineOut: 0,
              //   // 素材片段相对于素材的入点
              //   in: 0,
              //   // 素材片段相对于素材的出点
              //   out: 0,
              //   // 音量增益
              //   volumeGain: 0.0,
              //   // 素材时长适配方式
              //   materialDurationFit: {
              //     // 适配方式（multiple:倍数, loop:循环，staticFrame:定帧）
              //     fitType: "",
              //     // 倍数值，0.1 - 10  大于1表示快速，小于1表示慢速
              //     multipleValue: 0.0,
              //     // 循环次数
              //     loopValue: 0
              //   },
              //   // 合成语音配置信息
              //   produceVoiceConfig: {
              //     // 渠道（aliyun/deepsound/azure/cmww）
              //     channel: "",
              //     // 发音人
              //     voice: "",
              //     // aliyun 音量
              //     volume: 0,
              //     // aliyun 语速
              //     speechRate: 0,
              //     // aliyun 语调
              //     pitchRate: 0,
              //     // deepsound 音量
              //     deepsoundVolume: "",
              //     // deepsound语速（取值为lower/low/normal/high/higher，默认normal表示选择中等语速）
              //     deepsoundSpeechRate: "",
              //     // deepsound语调（取值为lower/low//high/higher，默认normal表示选择中等音调）
              //     deepsoundPitchRate: "",
              //     // azure音量（0.0 到 150.0（从最安静到最大声）， 默认值为 100）
              //     azureVolume: "",
              //     // azure语速，取值为0.00-2.00，默认为1.0，如果值为 1，则速率不会变化。 如果值为 0.5，则速率会减慢一半。 如果值为 2，则速率为2倍
              //     azureSpeechRate: "",
              //     // azure语调，取值为-50%-50%，默认为0%
              //     azurePitchRate: "",
              //     // azure语音风格，默认为 general
              //     azureStyle: "",
              //     // azure句末停顿时间，默认0ms
              //     azureEndBreakTime: "",
              //     // cmww 音量
              //     cmwwVolume: 0.0,
              //     // cmww 语速
              //     cmwwSpeechRate: 0.0,
              //     // cmww语调（-10 - 10，默认值 0）
              //     cmwwPitchRate: 0.0,
              //     // cmww语气，默认无
              //     cmwwStyle: ""
              //   },
              //   // 背景音乐信息
              //   bgmInfo: {
              //     // 音乐 ID
              //     musicId: "",
              //     // 分类 ID
              //     cateId: 0,
              //     // 音乐来源
              //     originType: 0,
              //     // 选择的声音类型，1：原声 ，2：背景声
              //     selectVoiceType: 0,
              //     // 卡点音乐节奏速度（1：快节奏，2：适中，3：慢节奏）
              //     rhythmMusicSpeed: 0
              //   },
              //   // 素材 url
              //   materialUrl: "",
              //   // 素材文件内容 md5
              //   contentMd5: ""
              // }
            ]
          }
        },
        // 是否添加自动特效（1：是，0：否）
        addAutoEffect: 0,
        // 扩展字段，json string
        sectionExtData: ""
      }
    ]
  });
  const $currentSectionIndex = ref(1);
  const $readFrameWorker = ref(
    new Worker(process.env.BASE_URL + "readFrame-lib/readFrameWorker.js")
  );
  const $videoFrameList = ref([]);
  const $currentFile = ref();
  const $isReadFrameBusy = ref(false);
  const $videoFrameBuffer = ref(new Map());
  const $flatFrameList = ref([]);
  const $currentReadFrameVideoIndex = ref(0);

  // watchEffect data
  const $gridWidth = ref(0);
  const $gridFrame = ref(0);
  const $groupGridFrame = ref(0);
  const $timeLine_width = ref(0);
  const $timescale_width = ref(0);
  const $timescale_placeholder_width = ref(0);
  const $maxFrameWidth = ref(Mapping.getMaxFrameWidth());
  const $minFrameWidth = ref(0);
  const $fitFrameWidth = ref(0);
  const $maxFrameOfMaterial = ref(0);
  const $readFrameTaskStack = ref([]);

  const $rightCount = ref(0);
  const $errorCount = ref(0);

  watchEffect(() => {
    $maxFrameOfMaterial.value = getMaxFrameOfMaterial(
      $coreData,
      $currentSectionIndex.value
    );
  });

  watchEffect(() => {
    $gridWidth.value = getGridWidth($frameWidth.value);
  });
  watchEffect(() => {
    $gridFrame.value = getGridFrame($frameWidth.value);
  });
  watchEffect(() => {
    $groupGridFrame.value = getGroupGridFrame($frameWidth.value);
  });
  watchEffect(() => {
    $timeLine_width.value = getTimeLineWidth($timeLineContainer_width.value);
  });
  watchEffect(() => {
    $timescale_width.value = getTimeScaleWidth(
      $frameWidth.value,
      $timeLine_width.value,
      $maxFrameOfMaterial.value
    );
  });
  watchEffect(() => {
    $timescale_placeholder_width.value = getTimeScalePlaceHolderWidth(
      $timeLineOffsetLeft.value,
      $gridWidth.value
    );
  });
  watchEffect(() => {
    $minFrameWidth.value = getMinFrameWidth(
      $maxFrameOfMaterial.value,
      $timeLine_width.value
    );
  });
  watchEffect(() => {
    $fitFrameWidth.value = getFitFrameWidth(
      $maxFrameOfMaterial.value,
      $timeLine_width.value
    );
  });

  watchEffect(() => {
    $flatFrameList.value = Mapping.getflatFrameList(
      VIDEO_FRAME_WIDTH,
      $coreData,
      $frameWidth.value,
      $currentSectionIndex.value,
      $timeLineOffsetLeft.value,
      $timeLine_width.value
    );
  });

  const $framesMap = computed(() =>
    Mapping.constructFramesMap(
      $flatFrameList.value,
      $videoFrameBuffer.value,
      $readFrameTaskStack.value
    )
  );

  watchEffect(() => {
    ReadFrame.excuteReadFrameTask(
      $readFrameTaskStack,
      $isReadFrameBusy,
      $currentReadFrameVideoIndex,
      $readFrameWorker,
      VIDEO_FRAME_WIDTH,
      VIDEO_FRAME_HEIGHT,
      $videoFrameBuffer,
      $rightCount,
      $errorCount
    );
  });

  watchEffect(() => {
    console.log("rightCount: " + $rightCount.value);
  });

  watchEffect(() => {
    console.log("errorCount: " + $errorCount.value);
  });

  // watchEffect(() => {
  //   // 计算视频帧列表
  //   // 1. 视频有多长
  //   if (
  //     $coreData.sections[$currentSectionIndex.value - 1].sectionTimeline
  //       .visionTrack.visionTrackMaterials.length !== 0
  //   ) {
  //     const visionTrackMaterial =
  //       $coreData.sections[$currentSectionIndex.value - 1].sectionTimeline
  //         .visionTrack.visionTrackMaterials[0];

  //     const videoWidth = Mapping.getMaterialWidth(
  //       visionTrackMaterial.timelineIn,
  //       visionTrackMaterial.timelineOut,
  //       $frameWidth.value
  //     );

  //     // 2. 一帧有多长
  //     const videoFrameWidth = 49;

  //     // 3. 一共需要渲染多少帧
  //     const frameNumber = Math.ceil(videoWidth / videoFrameWidth);

  //     console.log("frameNumber", frameNumber);

  //     // 4. 每一帧的开头是多少毫秒
  //     const tempList = [];

  //     for (let i = 0; i < frameNumber; i++) {
  //       let frameMs = 0;
  //       if (i === 0) {
  //         frameMs = 0;
  //       } else {
  //         frameMs = Mapping.frame2ms(
  //           i * (videoFrameWidth / $frameWidth.value),
  //           30
  //         );
  //       }
  //       tempList.push(frameMs);
  //     }

  //     // 开始读帧
  //     const readFrameList = tempList.join(",");
  //     console.log("全部参数")
  //     console.log("readFrameList origin", readFrameList);

  //     console.log(
  //       "readFrameList",
  //       tempList.map(item => Mapping.second2hms(item / 1000))
  //     );

  //     WASM.readFrame(
  //       $readFrameWorker.value,
  //       $currentFile.value,
  //       49,
  //       52,
  //       readFrameList,
  //       url => {
  //         console.log("url", url);
  //         // console.log("$videoFrameList.value", $videoFrameList.value);
  //         $videoFrameList.value.push({ url: url });
  //       }
  //     );
  //   }
  // });

  // provide
  provide(timeLineContainer_width, $timeLineContainer_width);
  provide(timeLine_width, $timeLine_width);
  provide(timescale_width, $timescale_width);
  provide(frameWidth, $frameWidth);
  provide(timeLineOffsetLeft, $timeLineOffsetLeft);
  provide(gridWidth, $gridWidth);
  provide(gridFrame, $gridFrame);
  provide(groupGridFrame, $groupGridFrame);
  provide(maxFrameOfMaterial, $maxFrameOfMaterial);
  provide(timescale_placeholder_width, $timescale_placeholder_width);
  provide(currentVideoUrl, $currentVideoUrl);
  provide(readFrameWorker, $readFrameWorker);
  provide(maxFrameWidth, $maxFrameWidth);
  provide(minFrameWidth, $minFrameWidth);
  provide(fitFrameWidth, $fitFrameWidth);
  provide(coreData, $coreData);
  provide(currentSectionIndex, $currentSectionIndex);
  provide(videoFrameList, $videoFrameList);
  provide(currentFile, $currentFile);
  provide(isReadFrameBusy, $isReadFrameBusy);
  provide(videoFrameBuffer, $videoFrameBuffer);
  provide(readFrameTaskStack, $readFrameTaskStack);
  provide(flatFrameList, $flatFrameList);
  provide(framesMap, $framesMap);
  provide(currentReadFrameVideoIndex, $currentReadFrameVideoIndex);
  provide(rightCount, $rightCount);
  provide(errorCount, $errorCount);
}

// GETTER METHOD
const getGridWidth = frameWidth => {
  return Mapping.frameWidth2Grid(frameWidth).gridWidth;
};

const getGridFrame = framWidth => Mapping.frameWidth2Grid(framWidth).gridFrame;

const getGroupGridFrame = frameWidth =>
  Mapping.frameWidth2Grid(frameWidth).groupGridFrame;

const getTimeLineWidth = timeLineContainer_width =>
  timeLineContainer_width - 37;

const getTimeScaleWidth = (frameWidth, timeLine_width, maxFrameOfMaterial) =>
  Mapping.getTimeScaleWidth(frameWidth, timeLine_width, maxFrameOfMaterial);

const getTimeScalePlaceHolderWidth = (timeLineOffsetLeft, gridWidth) =>
  Mapping.getTimeScalePlaceHolderWidth(timeLineOffsetLeft, gridWidth);

const getMinFrameWidth = (maxFrameOfMaterial, timeLine_width) =>
  Mapping.getMinFrameWidth(maxFrameOfMaterial, timeLine_width);

const getFitFrameWidth = (maxFrameOfMaterial, timeLine_width) =>
  Mapping.getFitFrameWidth(maxFrameOfMaterial, timeLine_width);

const getMaxFrameOfMaterial = (coreData, currentSectionIndex) =>
  Mapping.getMaxFrameOfMaterial(coreData, currentSectionIndex);

export default {
  useProvider,
  timeLineContainer_width,
  timeLine_width,
  timescale_width,
  frameWidth,
  timeLineOffsetLeft,
  gridWidth,
  gridFrame,
  groupGridFrame,
  maxFrameOfMaterial,
  timescale_placeholder_width,
  currentVideoUrl,
  maxFrameWidth,
  minFrameWidth,
  fitFrameWidth,
  coreData,
  currentSectionIndex,
  readFrameWorker,
  videoFrameList,
  currentFile,
  isReadFrameBusy,
  videoFrameBuffer,
  readFrameTaskStack,
  flatFrameList,
  framesMap,
  currentReadFrameVideoIndex,
  VIDEO_FRAME_HEIGHT,
  rightCount,
  errorCount
};
