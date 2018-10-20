Page({
  data: {
    ctx: {},
    startRecord: false,
    time: 0,
    timeLoop: "",
    type: "startRecord", //默认的是录制视频模式
    recordDuration: 0, //统计录制的时间
    camera: true,

  },
  onShow() {
    this.setData({
      ctx: wx.createCameraContext(),
      time: 0,
      timeLoop: "",
      type: "startRecord", //默认的是录制视频模式
      recordDuration: 0, //统计录制的时间
      camera: true,
    });
  },
  //页面隐藏/切入后台时触发。 小程序切入后台等。
  onHide() {
    var me = this;
    clearInterval(me.data.timeLoop); //清除定时器
    // me.onShow();
    me.setData({
      camera: false,
      startRecord: false,
      time: 0
    })
  },
  onLoad() {
    this.setData({
      ctx: wx.createCameraContext(),
      time: 0,
      timeLoop: "",
      type: "startRecord", //默认的是录制视频模式
      recordDuration: 0, //统计录制的时间
      camera: true,
    })
  },

  //本地视频上传
  uploadVideo: function() {
    var that = this;
    wx.chooseVideo({
      sourceType: ['album'],
      success: function(res) {
        var duration = res.duration;
        var tmpHeight = res.height;
        var tmpWidth = res.width;
        var tmpVideoUrl = res.tempFilePath;
        var tmpCoverUrl = res.thumbTempFilePath;
        if (duration > 31) {
          wx.showToast({
            title: '视频长度不能超过30秒...',
            icon: "none",
            duration: 2500
          })
        } else if (duration < 2) {
          wx.showToast({
            title: '视频长度太短，请上传超过2秒的视频...',
            icon: "none",
            duration: 2500
          })
        } else {
          // 打开选择bgm的页面
          wx.navigateTo({
            url: '../chooseBgm/chooseBgm?duration=' + duration +
              "&tmpHeight=" + tmpHeight +
              "&tmpWidth=" + tmpWidth +
              "&tmpVideoUrl=" + tmpVideoUrl +
              "&tmpCoverUrl=" + tmpCoverUrl,
          })
        }
      }
    })
  },

  // 切换相机前后置摄像头  
  devicePosition() {
    this.setData({
      device: !this.data.device,
    })
    console.log("当前相机摄像头为:", this.data.device ? "后置" : "前置");
  },

  //视频录制
  camera: function() {
    var me = this;
    let {
      ctx,
      type,
      startRecord
    } = this.data;

    // 30秒倒计时  
    var timeCount = 0;
    if (!startRecord) {
      console.log("开始录视频");
      this.setData({
        startRecord: true,
        recordDuration: 0,
      });

      let timeLoop = setInterval(() => {
        me.setData({
          recordDuration: me.data.recordDuration + 1,
        })
        timeCount++;
        console.log("-----打印录制时间-----" + me.data.recordDuration)
        this.setData({
          time: timeCount,
        })
        // 最长录制30秒  
        if (timeCount == 30) {
          clearInterval(timeLoop);
          this.stopRecord(ctx);
        }
      }, 1000);
      this.setData({
        timeLoop,
      })


      // 开始录制  
      ctx.startRecord({
        success: (res) => {
          console.log("开始录制---" + JSON.stringify(res))
        },
        fail: (e) => {
          console.log("失败啦啦啦---" + e)
        }
      })
    } else {
      this.stopRecord(ctx);
      //this.data.recordDuration = timeCount;//统计录制时间
      // console.log("---444---" + timeCount)
      // this.setData({
      //   recordDuration: timeCount,
      // })
      console.log("---录制---" + this.data.recordDuration)
    }

  },

  // 停止录制  
  stopRecord(ctx) {
    var me = this;
    console.log("停止录视频----" + ctx);
    clearInterval(this.data.timeLoop); //设置30s的定时器

    ctx.stopRecord({
      success: (res) => {
        console.log("-------打印停止录制的详细信息-------" + JSON.stringify(res));
        var me = this;
        console.log("关闭相机");
        clearInterval(me.data.timeLoop); //清除定时器
        // var duration = res.duration;
        // var tmpHeight = res.height;
        // var tmpWidth = res.width;
        var duration = me.data.recordDuration;
        var tmpCoverUrl = res.tempThumbPath;
        var tmpVideoUrl = res.tempVideoPath;

        console.log("-------打印录制时长信息-------" + duration)

        //结束录像，成功则返回封面与视频
        this.setData({
          tmpCoverUrl: tmpCoverUrl, //封面路径
          tmpVideoUrl: tmpVideoUrl, //视频路径
          camera: false,
          startRecord: false,
          time: 0
        });

        wx.navigateTo({
          url: '../chooseBgm/chooseBgm?duration=' + duration +
            "&tmpVideoUrl=" + tmpVideoUrl +
            "&tmpCoverUrl=" + tmpCoverUrl,
          // url: '../vedioPreview/vedioPreview?duration=' + duration +
          //   "&tmpVideoUrl=" + tmpVideoUrl +
          //   "&tmpCoverUrl=" + tmpCoverUrl,
        });
      },

      fail: (e) => {
        console.log("录制失败--------" + e);
      }

    })
  },

  //打开模拟的相机界面  
  open(e) {
    let {
      type
    } = e.target.dataset;
    console.log("开启相机准备", type == "chooseVideo" ? "本地视频上传ing" : "视频录制ing");
    this.setData({
      camera: true,
      type
    })
  },

  // 关闭模拟的相机界面  
  close() {
    var me = this;
    console.log("关闭相机");

    clearInterval(me.data.timeLoop); //清除定时器
    // me.onShow();
    me.setData({
      camera: false,
      startRecord: false,
      time: 0
    })
    console.log(me);

    // console.log(me.data.ctx)
    wx.navigateTo({
      url: '../vediotmp/vediotmp',
    })
  },


  /**
   * 生命周期函数--监听页面显示
   */


  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    var me = this;
    clearInterval(me.data.timeLoop); //清除定时器

    me.setData({
      camera: false,
      startRecord: false,
      time: 0
    })
    console.log("--------------------===========")
    console.log(me.camera);

  },







})