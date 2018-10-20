const app = getApp()
var serverUrl = app.serverUrl;
var userId = app.globalData.userId;


Page({
  data: {
    reasonType: "请选择原因",
    reportReasonArray: app.globalData.reportReasonArray,
    publisherId: "",
    videoId: ""
  },

  onLoad: function(params) {
    var that = this;
    console.log("params.videoId------------" + params.videoId)

    var videoId = params.videoId;
    var publisherId = params.publisherId;

    that.setData({
      publisherId: publisherId,
      videoId: videoId
    });

    console.log("快来打印下videoId嗷嗷嗷===" + videoId)
  },

  //举报理由的选择
  changeMe: function(e) {
    var that = this;

    var index = e.detail.value;
    var resonType = app.globalData.reportReasonArray[index];

    that.setData({
      reasonType: resonType
    })
  },

  //提交表单事件
  submitReport: function(e) {
    var that = this;

    var reasonIndex = e.detail.value.reasonIndex;
    var reasonContent = e.detail.value.reasonContent;

    //如果没有选择好举报理由就提交的话，弹出小窗口继续
    if (reasonIndex == null || reasonIndex == '' || reasonIndex == undefined) {
      wx.showToast({
        title: '选择举报理由',
        icon: "none"
      })
      return;
    }

    wx.request({
      url: serverUrl + '/report/userReportvideos',
      method: 'POST',
      data: {
        content: reasonContent,
        dealUserId: that.data.publisherId,
        dealVideoId: that.data.videoId,
        type: app.globalData.reportReasonArray[reasonIndex],
        userid: userId
      },
      header: {
        'content-type': 'application/json', // 默认值
      },
      success: function(res) {
        wx.showToast({
          title: '举报成功！~~',
          duration: 4000,
          icon: 'success',
          success: function() {
            wx.navigateBack();
          }
        })
      }
    })

  },





})