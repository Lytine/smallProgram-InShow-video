const app = getApp()
var user = app.globalData.userInfo;

Page({
  data: {
    totalPage: 1,
    page: 1,
    videoList: [],
    screenWidth: 350,
    serverUrl: "",
  },
  onShow: function(){
    var me=this;
    me.setData({
      totalPage: 1,
      page: 1,
      videoList: [],
      screenWidth:wx.getSystemInfoSync().screenWidth
    })
  

    // 获取当前的分页数
    var page = me.data.page;
    me.getAllVideoList(page);
  },
  onLoad: function(params) {
    var me = this;
    //设置屏幕尺寸适应边框问题
    var screenWidth = wx.getSystemInfoSync().screenWidth;

    me.setData({
      screenWidth: screenWidth,
      
    });


    // 获取当前的分页数
    var page = me.data.page;
    me.getAllVideoList(page);
  },

  getAllVideoList: function(page) {
    var me = this;
    var serverUrl = app.serverUrl;
    wx.showLoading({
      title: '请等待，加载中...',
    });

    wx.request({
      url: serverUrl + '/video/getByPage?page=' + page,
      method: "POST",
      success: function(res) {
        wx.hideLoading(); //
        wx.hideNavigationBarLoading(); //下拉刷新后隐藏掉动态旋转的小圈圈
        wx.stopPullDownRefresh();

        // 判断当前页page是否是第一页，如果是第一页，那么设置videoList为空
        if (page === 1) {
          me.setData({
            videoList: []
          });
        }

        var videoList = res.data.data.rows;
        var newVideoList = me.data.videoList;
        me.setData({
          videoList: newVideoList.concat(videoList),
          page: page,
          totalPage: res.data.data.total,
          serverUrl: serverUrl
        });
      }
    })
  },

  onPullDownRefresh: function() {
    wx.showNavigationBarLoading();
    this.getAllVideoList(1, 0);
  },

  //下拉刷新
  onReachBottom: function() {
    var me = this;
    var currentPage = me.data.page; //获取当前页数
    var totalPage = me.data.totalPage; //查询出来的总页数
    // 判断当前页数和总页数是否相等，如果相等则无需查询
    if (currentPage === totalPage) {
      wx.showToast({
        title: '已经没有视频啦~~',
        icon: "none"
      })
      return; //并需要往下查询，回去
    }

    var page = currentPage + 1; //把下一页 数据刷新下
    me.getAllVideoList(page, 0); //再传入需要分页的页数
  },

  //点击视频列表跳转到对应的视频播放页
  showVideoInfo: function(e) {
    var me = this;
    var videoList = me.data.videoList;
    var arrindex = e.target.dataset.arrindex;
    var videoInfo = JSON.stringify(videoList[arrindex]);
    console.log("视频信息叻" + videoInfo)
    wx.redirectTo({
      url: '../vedioInfo/vedioInfo?videoInfo=' + videoInfo
    })
  }
})