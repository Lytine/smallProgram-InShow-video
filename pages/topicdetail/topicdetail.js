var test = getApp().globalData.test;
var serverUrl = getApp().serverUrl;
var app = getApp();
var userId = app.globalData.userId;
var A;
Page({
  data: {
      topicName:'',
      username: '',
      participationCounts: 5,
      topicDesc: '',
      coverPath: '',
      topicId:'',
      List:[],
      Vpage:1,
      screenWidth: 350, 
  },

  
  onLoad: function(params) {
    var me = this;
    //设置屏幕尺寸适应边框问题
    var screenWidth = wx.getSystemInfoSync().screenWidth;
    me.setData({
      screenWidth: screenWidth,
    });
    // console.log("++++" + params.topicName );
    // console.log("++++" + params.username);
    // console.log("++++" + params.participationCounts);
    // console.log("++++" + params.topicDesc);
    // console.log("++++" + params.coverPath); 
    // console.log("++++" + params.topicId);
    var topicName = params.topicName;
    var username = params.username;
    var participationCounts = params.participationCounts;
    var topicDesc = params.topicDesc;
    var topicId = params.topicId;
    var coverPath = params.coverPath;
    me.setData({
      topicName: topicName,
      username: username,
      participationCounts: participationCounts,
      topicDesc: topicDesc,
      coverPath: coverPath,
      topicId: topicId,
    });
    this.getvedio();
  },

  getvedio: function(){
    var that = this;
    wx.request({
      // url: serverUrl +'/video/getByPage?page='+that.data.Vpage,
      url: serverUrl + '/topic/getAllVideoInTopic?page=' + that.data.Vpage + '&topicId=' + that.data.topicId,
      method: "GET",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          Vpage: that.data.Vpage + 1,
          List :that.data.List.concat(res.data.data),
        })
        that.A = res.data.data; 
      }
    }) 
  },
  //点击视频列表跳转到对应的视频播放页
  showVideoInfo: function (e) {
    var me = this;
    var videoList = me.data.List;
    var arrindex = e.target.dataset.arrindex;
    var videoInfo = JSON.stringify(videoList[arrindex]);
    console.log(videoInfo)
    wx.redirectTo({
      url: '../vedioInfo/vedioInfo?videoInfo=' + videoInfo

    })
  },

  kaipai: function(){
    // console.log(this.data.topicId);
    wx.switchTab({

        // url: '../vedio/vedio?topicId=' + this.data.topicId,
        url: '../vedio/vedio',
      })
      console.log("++++++++++++++++++++++++++++")
  },

  
  onReachBottom: function () {
        this.getvedio();
         if(this.A.length==0)
      {
        wx.showToast({
          title: '已经没有视频啦~~',
          icon: "none"
        });
      }
  }
})
