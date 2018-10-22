var Turnfile = require('../../utils/station_name.js')
//获取应用实例
const app = getApp()

var myVideoListrows;
var likeVideoListrows;

Page({
  data: {

    videoSelClass: "video-info",
    isSelectedWork: "video-info-selected",
    isSelectedLike: "",

    myVideoList: [],
    myVideoPage: 1,


    likeVideoList: [],
    likeVideoPage: 1,


    myWorkFalg: false,
    myLikesFalg: true,

    //个人信息
    id: '',
    avatarurl: '',
    city: '',
    country: '',
    gender: 1,
    nickname: '',
    openid: '',
    province: '',
    reportCounts: '',
    username: '',
    fansCounts: 0,
    followCounts: 0,
    receiveLikeCounts: 0
  },
  // onShow: function(){
  //   this.setData({
  //     myVideoList: [],
  //     myVideoPage: 1,


  //     likeVideoList: [],
  //     likeVideoPage: 1,
  //   })
  //   this.onLoad();
  // },
  onShow: function (params) {
    var me = this;
    wx.showLoading();
    var user = app.globalData.userInfo;
    me.setData({
      myVideoList: [],
      myVideoPage: 1,
      likeVideoList: [],
      likeVideoPage: 1,
    })

    var userId = app.globalData.userId;

    console.log("+++++++++++++++++++++++++++++++++++++++++++++++++" + userId + "---");
    var serverUrl = app.serverUrl;

    wx.request({
      url: serverUrl + '/user/query?userId=' + userId,
      method: "POST",

      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res) {
        console.log(res.data);
        wx.hideLoading();
        var userInfo = res.data.data;
        me.setData({
          avatarurl: userInfo.avatarurl,
          city: Turnfile.getname(userInfo.city),

          country: Turnfile.getname(userInfo.country),
          gender: userInfo.gender,
          id: userInfo.id,
          nickname: userInfo.nickname,
          openid: userInfo.openid,
          province: Turnfile.getname(userInfo.province),
          reportCounts: userInfo.reportCounts,
          username: userInfo.username,
          fansCounts: userInfo.fansCounts,
          followCounts: userInfo.followCounts,
          receiveLikeCounts: userInfo.receiveLikeCounts,
        });
      },
    })
    me.getMyVideoList(1);



  },

  doSelectWork: function () {
    this.setData({
      isSelectedWork: "video-info-selected",
      isSelectedLike: "",


      myWorkFalg: false,
      myLikesFalg: true,


      myVideoList: [],
      myVideoPage: 1,


      likeVideoList: [],
      likeVideoPage: 1,



    });

    this.getMyVideoList(1);
  },

  doSelectLike: function () {
    this.setData({
      isSelectedWork: "",
      isSelectedLike: "video-info-selected",


      myWorkFalg: true,
      myLikesFalg: false,


      myVideoList: [],
      myVideoPage: 1,


      likeVideoList: [],
      likeVideoPage: 1,


    });

    this.getMyLikesList(1);
  },

  //作品
  getMyVideoList: function (page) {
    var me = this;

    var user = app.globalData.userInfo;


    var userId = app.globalData.userId;

    var serverUrl = app.serverUrl;

    wx.showLoading();
    // 调用后端
    wx.request({

      url: serverUrl + '/video/myVideo/?page=' + page + '&userId=' + userId,
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        var myVideoList = res.data.data.rows;
        myVideoListrows = res.data.data.rows;
        wx.hideLoading();

        var newVideoList = me.data.myVideoList;
        me.setData({
          myVideoPage: page,
          myVideoList: newVideoList.concat(myVideoList),
          myVideoTotal: res.data.data.total,
          serverUrl: app.serverUrl
        });
      }
    })
  },

  //收藏
  getMyLikesList: function (page) {
    var me = this;
    var user = app.globalData.userInfo;

    var userId = app.globalData.userId;
    var serverUrl = app.serverUrl;

    wx.showLoading();

    wx.request({
      url: serverUrl + '/video/showMylike/?userId=' + userId + '&page=' + page + '&pageSize=6',

      method: "POST",

      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        var likeVideoList = res.data.data.rows;
        likeVideoListrows = res.data.data.rows;
        wx.hideLoading();

        var newVideoList = me.data.likeVideoList;
        me.setData({
          likeVideoPage: page,
          likeVideoList: newVideoList.concat(likeVideoList),
          likeVideoTotal: res.data.data.total,
          serverUrl: app.serverUrl
        });
      }
    })
  },

  // 到底部后触发加载
  onReachBottom: function () {
    var myWorkFalg = this.data.myWorkFalg;
    var myLikesFalg = this.data.myLikesFalg;

    if (!myWorkFalg) {
      var currentPage = this.data.myVideoPage;

      // 获取总页数进行判断，如果当前页数和总页数相等，则不分页
      if (myVideoListrows.length == 0) {

        wx.showToast({
          title: '已经没有视频啦~~',
          icon: "none"
        });
        return;
      }
      var page = currentPage + 1;
      this.getMyVideoList(page);
    } else if (!myLikesFalg) {
      var currentPage = this.data.likeVideoPage;

      // 获取总页数进行判断，如果当前页数和总页数相等，则不分页
      if (likeVideoListrows.length == 0) {
        wx.showToast({
          title: '已经没有视频啦~~',
          icon: "none"
        });
        return;
      }
      var page = currentPage + 1;
      this.getMyLikesList(page);
    }

  },
  //点击视频列表跳转到对应的视频播放页
  showVideoInfo: function (e) {
    var me = this;
    var myWorkFalg = this.data.myWorkFalg;
    var myLikesFalg = this.data.myLikesFalg;
    var arrindex = e.target.dataset.arrindex;

    if (!myWorkFalg) {
      var videoList = this.data.myVideoList;

      var videoInfo = JSON.stringify(videoList[arrindex]);
    } else if (!myLikesFalg) {
      var videoList = this.data.likeVideoList;

      var videoInfo = JSON.stringify(videoList[arrindex]);
    }



    console.log("视频信息叻" + videoInfo)
    wx.redirectTo({
      url: '../vedioInfo/vedioInfo?videoInfo=' + videoInfo

    })
  }

})