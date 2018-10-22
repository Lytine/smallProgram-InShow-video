var serverUrl = getApp().serverUrl;
// var userId = getApp().globalData.userId;

Page({

  data: {
    title: "请为视频题个标题吧...",
    flag: 0,
    topicList: [],
    serverUrl: "",
    desc: "这个是描述", //视频描述
    allParams: {}, //视频和bgm所有的参数集合
    topicId: "", //这是单选框的可选话题
    tmpCoverUrl: '../resource/images/like.png', //默认视频封面图
    showBtn: false, //初始化状态的可选按钮不可见
    randDisplayPage: 1, //随机显示可选话题
    ramdomList: [],
    totalPage: 1, //总页数
    page: 1, //当前页
    hasMoreData: true, //加载主题的时候，判断往下是否还有数据


  },

  onLoad: function (params) {
    var that = this;
    var userId = getApp().globalData.userId;
    console.log("------------带进来的视频时长--------------" + params.duration)
    console.log("------------视频高度--------------" + params.tmpHeight)
    console.log("------------视频宽度--------------" + params.tmpWidth)
    console.log("------------视频路径--------------" + params.tmpVideoUrl)
    console.log("------------视频封面--------------" + params.tmpCoverUrl)
    console.log("------------视频bgmId--------------" + params.audioId)

    that.setData({
      allParams: params,
      tmpCoverUrl: params.tmpCoverUrl,
      userId:userId,
    })

    wx.showLoading({
      title: '请等待...',
    });

    //请求后端
    wx.request({
      url: serverUrl + '/topic/getAll?page=1',
      method: "GET",

      header: {
        'content-type': 'application/json', // 默认值
      },

      success: function (res) {
        // console.log("----打印具体的主题信息----" + JSON.stringify(res.data))
        wx.hideLoading();

        if (res.data.status == 200) {
          var topicList = res.data.data;
          
          that.setData({
            topicList: topicList,
          });


        } else if (res.data.status == 502) {
          wx.showToast({
            title: res.data.msg,
            duration: 2000,
            icon: "none",
            success: function () {
              wx.redirectTo({
                url: '../index/index',
              })
            }
          });
        }
      }
    })

  },

  //随机显示按钮
  // randShowTopic: function(e) {
  //   var that = this;
  //   that.checked = that.data.flag;
  //   console.log("123123123123123")
  //   console.log(e.target.checked)
  //   flag = !flag;
  // },

  //单选按钮事件
  radioChange: function (e) {
    var me = this;
    var topicId = e.detail.value;
    for (var i in me.data.topicList){
      console.log(i)
      if (e.detail.value === me.data.topicList[i].topic.id)
        me.setData({
          title: me.data.topicList[i].topic.topicName,
        })
    }
    console.log(e)
    console.log(e.target)
    me.setData({
      topicId: topicId,
    })
  },
  radioChoose2: function(){
    this.setData({
      title: "选一个小可爱玩玩吧",
    })
  },
  //点击radio事件
  radioChoose: function (e) {
    // var me = this;
    // var items = me.data.topicList;
    // console.log(items)
    // console.log("---------你的大可爱过来打印了--------")
    // console.log(items[0].topic.id)
    // console.log(e.currentTarget.id)
  },

  // 描述的详情
  bindinput: function (e) {
    var me = this;
    var desc = e.detail.value;
    me.setData({
      desc: desc,
    })
  },

  //确认发布-------
  confirm2publish: function () {
    var me = this;
    // 上传短视频
    wx.showLoading({
      title: '上传中...',
    });

    //console.log("--------******************---------" + me.data.allParams.tmpVideoUrl);
    // console.log("---------+++++++++-----------" + JSON.stringify(me.data))
    wx.uploadFile({
      url: serverUrl + '/video/uploadVideos',
      method: 'POST',
      formData: {
        userId: me.data.userId,
        audioId: me.data.allParams.audioId,
        desc: me.data.desc,
        topicId: me.data.topicId,
        videoSecond: me.data.allParams.duration,
        videoHeight: me.data.allParams.tmpHeight,
        videoWidth: me.data.allParams.tmpWidth,
        bgmPosition: 0
      },
      name: 'file',
      filePath: me.data.allParams.tmpVideoUrl,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },

      success: function (res) {
        var data = JSON.parse(res.data);
        wx.hideLoading();
        if (data.status == 200) {
          wx.showToast({
            title: '上传成功!~~',
            duration: 3000,
            icon: "success"
          });
          wx.switchTab({
            url: '../index/index',
          })
        } else if (res.data.status == 502) {
          wx.showToast({
            title: res.data.msg,
            duration: 2000,
            icon: "none"
          });
          wx.redirectTo({
            url: '../index/index',
          })
        } else {
          wx.showToast({
            title: '上传失败!!!',
            duration: 2000,
            icon: "loading"
          });
        }
      }
    })
  },

  //下拉刷新
  // onReachBottom: function() {
  //   console.log("----------------")
  //   var me = this;
  //   console.log("----------------" + me.data.topicList.length)
  //   console.log("----------------" + (me.data.topicList.length) % 10)
  //   if ((me.data.topicList.length) % 10 != 0) {
  //     console.log("-----你的小可爱return啦------")
  //   } else {
  //     var page = me.data.page + 1; //把下一页 数据刷新下
  //     me.setData({
  //       page: me.data.page + 1
  //     })
  //     me.getAllTopicList(page); //再传入需要分页的页数
  //   }

  // },
  aaa: function () {
    console.log("----------------")
    var me = this;
    console.log("----------------" + me.data.topicList.length)
    console.log("----------------" + (me.data.topicList.length) % 10)
    if ((me.data.topicList.length) % 7 != 0 ) {
      me.data.page=1
    } else {
      var page = me.data.page + 1; //把下一页 数据刷新下
      me.setData({
        page: me.data.page + 1
      })
      
    }
    me.getAllTopicList(me.data.page); //再传入需要分页的页数

  },

  //获取所有主题的列表
  getAllTopicList: function (page) {
    var me = this;

    wx.showLoading({
      title: '请等待，加载中...',
    });

    wx.request({
      url: serverUrl + '/topic/getAll?page=' + page,
      method: "GET",
      success: function (res) {
        wx.hideLoading();
        wx.hideNavigationBarLoading(); //下拉刷新后隐藏掉动态旋转的小圈圈
        wx.stopPullDownRefresh();

        console.log("分页的具体信息" + res.data);

        // 判断当前页page是否是第一页，如果是第一页，那么设置topicList为空
        if (page === 1) {
          me.setData({
            topicList: []
          });
        }

        var topicList = res.data.data;
        var newtopicList = me.data.topicList;
        me.setData({
          topicList: topicList,
          //topicList: topicList,
          page: me.data.page,
          serverUrl: serverUrl
        });
        
      }
    })
  },

})