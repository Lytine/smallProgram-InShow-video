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


  },

  onLoad: function(options) {
    var me = this;
    me.videoCtx = wx.createVideoContext("myVideo", me)

    var duration = options.duration; //视频时长
    var tmpHeight = options.tmpHeight; //视频时长
    var tmpWidth = options.tmpWidth; //视频时长
    var tmpCoverUrl = options.tmpCoverUrl; //视频时长
    var tmpVideoUrl = options.tmpVideoUrl; //视频时长
    var audioId = options.audioId; //视频时长

    me.setData({
      duration: duration,
      tmpHeight: tmpHeight,
      tmpWidth: tmpWidth,
      tmpCoverUrl: tmpCoverUrl,
      tmpVideoUrl: tmpVideoUrl,
      audioId: audioId,
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


    wx.navigateTo({
      // url: '../chooseBgm/chooseBgm?duration=' + duration +
      //   "&tmpVideoUrl=" + tmpVideoUrl +
      //   "&tmpCoverUrl=" + tmpCoverUrl,
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

  }



})