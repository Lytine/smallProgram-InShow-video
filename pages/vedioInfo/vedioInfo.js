//var videoUtil = require('../../utils/vedioUtil.js')
var serverUrl = getApp().serverUrl;
var userId = getApp().globalData.userId;
var app = getApp()
Page({
  data: {
    //contain包含，保持原有长宽比例。保证视频尺寸一定可以在容器里面放得下。因此，可能会有部分空白
    //conver覆盖，保持原有长宽比例。保证视频尺寸一定大于容器尺寸，宽度和高度至少有一个和容器一致。因此，视频有部分会看不见
    cover: "cover",
    videoId: "",
    src: "",
    videoInfo: {},
    sercerUrl: serverUrl,
    userClickvideo: false, //点赞
    userLikevideo: false, //收藏
    isPlaying: true, //视频初始化为——————  一直播放状态
    cilckStop: false, //视频的暂停按钮没有按住
  },
  videoCtx: {},

  //----------------------------------------------
  // onReady() {
  //   this.videoCtx = wx.createVideoContext('myVideo');
  // },
  // setPlayStatus() {
  //   this.isPlaying = true;
  // },
  // setPauseStatus() {
  //   this.isPlaying = false;
  // },
  // clickVideo() {
  //   this.isPlaying ? this.videoCtx.pause() : this.videoCtx.play()
  // },

  // vedioPlay() {
  //   var me = this;
  //   var isPlaying = me.data.isPlaying;
  //   console.log("打印播放开关------" + isPlaying)
  //   if (isPlaying) {
  //     wx.createVideoContext('myVideo').play()
  //   }
  //   me.setData({
  //     isPlaying: false,
  //   })
  // },

  // videoPause() {
  //   var me = this;
  //   console.log("打印关闭开关------" + isPlaying)
  //   var isPlaying = me.data.isPlaying;
  //   if (!isPlaying) {
  //     wx.createVideoContext('myVideo').pause()
  //   }
  //   me.setData({
  //     isPlaying: true,
  //   })
  // },


  //控制视频播放的按钮
  vedioControl() {
    var me = this;
    var isPlaying = me.data.isPlaying;
    var cilckStop = me.data.cilckStop;
    isPlaying ? wx.createVideoContext('myVideo').pause() : wx.createVideoContext('myVideo').play()
    me.setData({
      isPlaying: !isPlaying,
      cilckStop: !cilckStop,
    })
  },

  //----------------------------------------------

  onLoad: function(params) {
    // 点击视频列表进入视频详情
    var that = this;
    that.videoCtx = wx.createVideoContext("myVideo", that)
    //获取上一个页面传入的参数
    var videoInfo = JSON.parse(params.videoInfo);
    console.log(videoInfo)
    console.log("~~~~~~~~~~~~打印视频信息~~~~~~~~~~~")

    var Height = videoInfo.videoHeight;
    var Width = videoInfo.videoWidth;

    console.log("-----高度------" + Height)
    console.log("-----宽度------" + Width)

    var cover = "cover"; //默认的cover
    //如果宽度大于等于高度，就不让他拉伸，置空
    if (Width >= Height) {
      cover = "";
      console.log("这个视频的长度是宽度比高度大的")
    }

    that.setData({
      videoId: videoInfo.id,
      src: serverUrl + videoInfo.videoPath,
      videoInfo: videoInfo,
      cover: cover
    });

    var loginUserId = "";
    loginUserId = app.globalData.userId;
    console.log(serverUrl + '/user/qureyPublisher?loginuserId=' + loginUserId + '&videoId=' + videoInfo.id + '&publisherId=' + videoInfo.userId)
    //退出到视频展示页，依旧能显示点赞的信息
    wx.request({
      url: serverUrl + '/user/qureyPublisher?loginuserId=' + loginUserId + '&videoId=' + videoInfo.id + '&publisherId=' + videoInfo.userId,
      method: 'POST',
      success: function(res) {
        console.log("ajkjkj8997787878----" + JSON.stringify(res.data.data))
        var publisher = res.data.data.publisher;
        var userClickvideo = res.data.data.userClickvideo;
        var userLikevideo = res.data.data.userLikevideo;
        console.log("进来点赞了吗=--==---=-=" + userClickvideo)
        console.log("进来收藏了吗=--==---=-=" + userLikevideo)
        that.setData({
          serverUrl: serverUrl,
          publisher: publisher,
          userClickvideo: userClickvideo,
          userLikevideo: userLikevideo,
        });
      }
    })
  },

  vedioShare: function() {
    console.log("进来分享了")
    var me = this;
    wx.showActionSheet({
      itemList: ["下载到本地", "分享到朋友圈", "分享到QQ空间", "分享到微博"],
      success: function(res) {
        if (res.tapIndex == 0) {
          wx.showLoading({
            title: '正在下载....',
          })
          wx.downloadFile({
            url: serverUrl + me.data.videoInfo.videoPath,
            success: function(res) {
              if (res.statusCode == 200) {
                wx.saveVideoToPhotosAlbum({
                  filePath: res.tempFilePath,
                  success: function(res) {
                    wx.hideLoading();
                  }
                })
              } else {
                wx.showToast({
                  title: '此服务未开放',
                })
              }
            }
          })
        }
      }
    })
  },
  //拍摄按钮
  upload: function() {
    //videoUtil.uploadVideo();
    wx.switchTab({
      url: '../vedio/vedio',
    })
  },

  //主页按钮
  showIndex: function() {
    console.log("我真的进来了的"),
      wx.switchTab({
        url: '../index/index',
      })
  },
  showMine(){
    console.log("我真的进来了的"),
      wx.switchTab({
        url: '../mine/mine',
      })
  },

  onShow: function() {
    var that = this;
    that.videoCtx.play();
  },
  onHide: function() {
    var that = this;
    that.videoCtx.pause();
  },

  //点赞按钮
  ClickVideoOrNot: function() {
    var that = this;
    var userId = app.globalData.userId;
    var videoInfo = that.data.videoInfo;
    var userClickvideo = that.data.userClickvideo
    console.log("点击点赞事件的时候。。。这里的useClickvideo的值就是--" + userClickvideo)
    var url = '/video/userClickvideo?userId=' + userId + '&videoId=' + videoInfo.id;
    //如果userClickvideo已经是点了赞的状态了，就取消赞
    if (userClickvideo) {
      var url = '/video/userUnclickVideo?userId=' + userId + '&videoId=' + videoInfo.id + '&publisherId=' + videoInfo.userId;
    }
    wx.showLoading({
      title: '...',
    })
    wx.request({
      //url: serverUrl + '/video/userClickvideo',
      url: serverUrl + url,
      method: 'POST',
      // data: {
      //   userId: userId,
      //   videoId: videoInfo.id
      // },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function(res) {
        wx.hideLoading();

        that.setData({
          userClickvideo: !userClickvideo
        });
      }


    })
  },

  //用户详情页的,点击头像跳转
  showPublisher: function() {
    var that = this;
    var videoInfo = that.data.videoInfo;
    var fansPickuser = that.data.fansPickuser;
    // console.log("*-*-*-*-videoInfo*--*-*--" + JSON.stringify(videoInfo));
    console.log("打印发布者的id---" + videoInfo.userId)
    console.log("关注标记：" + fansPickuser)
    //getApp().globalData.publisherId = videoInfo.userId;
    wx.navigateTo({
      //url: '../mine/mine?publisherId=' + videoInfo.userId,
      url: '../userInfo/userInfo?publisherId=' + videoInfo.userId + "&isFollow=" + fansPickuser + '&videoInfo=' + videoInfo,

    })
  },


  //收藏作品
  LikeVideoOrNot: function() {
    var that = this;
    var userId = app.globalData.userId;
    console.log("----++++----" + userId)
    var videoInfo = that.data.videoInfo;
    var userLikevideo = that.data.userLikevideo;

    console.log("收藏不-------------" + userLikevideo);
    //用户id--视频id--发布者id
    var url = '/video/userLikevideo?userId=' + userId + '&videoId=' + videoInfo.id + '&publisherId=' + videoInfo.userId;
    //如果Likevideo是已经收藏的状态，就取消收藏
    if (userLikevideo) {
      url = '/video/userunLikeVideo?userId=' + userId + '&videoId=' + videoInfo.id + '&publisherId=' + videoInfo.userId;
    }
    wx.showLoading({
      title: '...',
    })
    console.log("---------------f--++++++++++++++++++-------------" + url);
    wx.request({
      url: serverUrl + url,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function(res) {
        wx.hideLoading();
        that.setData({
          userLikevideo: !userLikevideo,
        });
        console.log("取反之后：" + userLikevideo)
      }
    })
  },
  //点击举报按钮后跳转
  report: function() {
    var that = this;
    var videoInfo = JSON.stringify(that.data.videoInfo)
    var videoId = that.data.videoInfo.id;

    var publisherId = that.data.videoInfo.userId;
    //console.log("恩过来打印打印999999999999--" + videoInfo)
    wx.navigateTo({
      url: '../report/report?videoId=' + videoId + '&publisherId=' + publisherId,
    })
  },
  leaveComment: function() {

  }


})