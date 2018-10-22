var serverUrl = getApp().serverUrl;
var userId = getApp().globalData.userId;

Page({

  data: {
    duration: "",
    tmpHeight: "",
    tmpWidth: "",
    tmpCoverUrl: "",
    tmpVideoUrl: "",
    audioId: "",
    Hidden: false,
    bgmSrc: '',
    audioCtx: {},
    serverUrl: '',
    timeCount: 0,
    bgmPlaying: true,
    bgm: true,
    time: 0,
    timeLoop: "",
    playDuration: 0, //统计bgm播放的时间


    vplayflag: 0,
    vstopflag: 0,
    vendflag: 0,
  },

  onLoad: function(options) {
    var me = this;
    me.audioCtx = wx.createAudioContext("myBgm", me)
    var userId = getApp().globalData.userId;
    me.videoCtx = wx.createVideoContext("myVideo", me)

    var duration = options.duration;
    var tmpHeight = options.tmpHeight;
    var tmpWidth = options.tmpWidth;
    var tmpCoverUrl = options.tmpCoverUrl;
    var tmpVideoUrl = options.tmpVideoUrl;
    var audioId = options.audioId;
    var bgmSrc = options.bgmSrc;

    console.log(options)
    console.log("打印传进来的歌曲路径" + bgmSrc)

    me.setData({
      serverUrl: getApp().serverUrl,
      duration: duration,
      tmpHeight: tmpHeight,
      tmpWidth: tmpWidth,
      tmpCoverUrl: tmpCoverUrl,
      tmpVideoUrl: tmpVideoUrl,
      audioId: audioId,
      userId: userId,
      bgmSrc: bgmSrc,
      audioAction: {
        method: 'play',
      }
    })
  },

  //确认好视频了
  sureVideo: function() {
    var me = this;
    var duration = me.data.duration;
    var tmpHeight = me.data.tmpHeight;
    var tmpWidth = me.data.tmpWidth;
    var tmpCoverUrl = me.data.tmpCoverUrl;
    var tmpVideoUrl = me.data.tmpVideoUrl;
    var audioId = me.data.audioId;
    wx.createVideoContext("myVideo").pause();
    wx.navigateTo({
      url: '../publish/publish?duration=' + duration +
        "&tmpHeight=" + tmpHeight +
        "&tmpWidth=" + tmpWidth +
        "&tmpVideoUrl=" + tmpVideoUrl +
        "&tmpCoverUrl=" + tmpCoverUrl +
        "&audioId=" + audioId,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })

  },
  myVplay() {
    if (this.data.vpalyflag === 0) {

      wx.createVideoContext("myVideo").seek(0)
      wx.createVideoContext("myVideo").play()
      wx.createAudioContext("myBgm").seek(0)
      wx.createAudioContext("myBgm").play()
      this.data.vpalyflag = 1
      this.data.vstopflag = 0
    } else {
      return
    }

  },
  myVpause() {
    if (this.data.vstopflag === 0) {
      wx.createVideoContext("myVideo").pause()
      wx.createAudioContext("myBgm").pause()
      this.data.vpalyflag = 0
      this.data.vstopflag = 1
    } else {
      return
    }
  },
  myVend() {
    wx.createAudioContext("myBgm").pause()
  },

})