const getVideoDuration = videoFile =>
  new Promise((resolve, reject) => {
    try {
      const url = URL.createObjectURL(videoFile);
      const tempAudio = new Audio(url);
      tempAudio.addEventListener("loadedmetadata", () => {
        console.log("getVideoDuration success", tempAudio.duration);
        resolve(tempAudio.duration);
      });
    } catch (error) {
      console.log("getVideoDuration error", error);
      throw error;
    }
  });

export default {
  getVideoDuration
};
