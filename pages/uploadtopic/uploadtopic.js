const app = getApp()
var tempFilePaths="";

Page({ 
  data: { 
    topicName:"",
    username: app.globalData.userInfo.nickName,
    partticipationCounts:0,
    topicDesc:"",
    topicId:"",
    coverPath:""
  },
  onLoad: function(params) {
  },
  formSubmit: function (e) {
    // detail
    var that = this;
    var topicname = e.detail.value.topicname;
    that.data.topicName = topicname;
    var topicdesc = e.detail.value.topicdesc;
    that.data.topicDesc = topicdesc;
    console.log("++++++++++++" + topicdesc);
    var topicphoto ;
    if (topicname.length == 0 || topicdesc.length == 0) {
      wx.showToast({
        title: '主题或描述不能为空',
        icon: 'none',
        duration: 3000
      })
    } else if (tempFilePaths.length==0){
      wx.showToast({
        title: '请选择封面',
        icon: 'none',
        duration: 3000
      })
    }else {
      var serverUrl = app.serverUrl;
      wx.showLoading({
        title: '请等待...',
      });
    }
    var userId = app.globalData.userId;
    var serverUrl = app.serverUrl; 

    wx.uploadFile({
      url: serverUrl + '/topic/uploadtopic',
      filePath: tempFilePaths,
      name: 'file',
      formData: {
        userId: userId,
        topicName: topicname,
        topicDesc: topicdesc,
      },
      success:function (res) {
        console.log(res);
        that.data.topicId = res.data.data;
        wx.hideLoading();
        wx.showToast({
          title: '上传成功!~~',
          icon: "success"
        });
        wx.redirectTo({
          url: '../topicdetail/topicdetail?topicName=' + that.data.topicName
            + '&username=' + that.data.username 
            + '&participationCounts=' + that.data.participationCounts 
            + '&topicDesc=' + that.data.topicDesc 
            + '&coverPath=' + that.data.coverPath 
            + '&topicId=' + that.data.topicId,
        })
      }
    })
  },

  uploadPhoto:function() {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log(res.tempFilePaths);
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
         tempFilePaths = res.tempFilePaths[0];
        // upload(that, tempFilePaths);
        that.data.coverPath = res.tempFilePaths[0];
        wx.showToast({
          title: '选择封面成功!~~',
          icon: "success"
        });
      },
      
    })
  },
})

