var Turnfile = require('../../utils/station_name.js')
//获取应用实例
const app = getApp()
var serverUrl = app.serverUrl;
//var userId = app.globalData.userId;
var myVideoListrows; //翻页用的
var likeVideoListows;

Page({
  data: {
    serverUrl: serverUrl,
    isMe: true,
    videoSelClass: "video-info",
    isSelectedWork: "video-info-selected",
    isSelectedLike: "",

    myVideoList: [],
    myVideoPage: 1,
    myVideoTotal: 1,

    likeVideoList: [],
    likeVideoPage: 1,
    likeVideoTotal: 1,

    myWorkFalg: false,
    myLikesFalg: true,

    //个人信息
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
    receiveLikeCounts: 0,

    isFollow: true, //默认未关注，快去关注我
    videoInfo: null,
    userId: ""
  },

  onLoad: function (params) {

    console.log("********登陆者ID：" + app.globalData.userId);
    console.log("********登陆者ID1：" + this.data.userId);
    var that = this;
    var userId = app.globalData.userId;
    var publisherId = params.publisherId;
    //var isFollow=params.isFollow
    //console.log("***************111********************" + params.isFollow);
    that.setData({
      videoInfo: params.videoInfo,
      isFollow: params.isFollow,
      userId: userId
    })
    console.log("****ID:" + userId);
    //console.log("***********************************" + that.data.isFollow);
    if (publisherId != null && publisherId != '' && publisherId != undefined) {
      // userId = publisherId;
      that.setData({
        isMe: false,
        publisherId: publisherId,
      })
    }
    wx.showLoading({
      title: '请等待...'
    })

    //请求个人简介
    wx.request({
      url: serverUrl + '/user/query?userId=' + params.publisherId + "&loginId=" + userId,
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res) {
        console.log("就是来打印" + JSON.stringify(res.data.data));
        wx.hideLoading();
        var userInfo = res.data.data;
        that.setData({
          isFollow: userInfo.fansPickuser,
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
          receiveLikeCounts: userInfo.receiveLikeCounts, //我收到的收藏数量----赞美就算了
        });
        // console.log("2632366366_____"+that.data.isFollow)
      },
    })
    that.getMyVideoList(1);
  },

  //关注与取消关注的按钮
  followMe: function (e) {
    var that = this;
    var publisherId = that.data.publisherId;
    var followType = e.currentTarget.dataset.followtype;
    var url = ''; 
    //
    if (that.data.isFollow === false) {
      url = '/user/fanspick?followId=' + publisherId + '&userId=' + that.data.userId;
    } else {
      url = '/user/fansUnpick?userId=' + that.data.userId + '&followId=' + publisherId;
    }

    wx.showLoading();
    wx.request({
      url: serverUrl + url,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        wx.hideLoading();
        console.log("**************" + JSON.stringify(res));
        //1:关注 
        //0:取消关注
        if (followType == '1') {
          that.setData({
            fansCounts: that.data.fansCounts + 1,
            isFollow: true,
          })
        } else {
          that.setData({
            fansCounts: that.data.fansCounts - 1,
            isFollow: false,
          })
        }
      }

    })
  },


  //作品
  doSelectWork: function () {
    this.setData({
      isSelectedWork: "video-info-selected",
      isSelectedLike: "",
      isSelectedFollow: "",

      myWorkFalg: false,
      myLikesFalg: true,
      myFollowFalg: true,

      myVideoList: [],
      myVideoPage: 1,
      myVideoTotal: 1,

      likeVideoList: [],
      likeVideoPage: 1,
      likeVideoTotal: 1,

      followVideoList: [],
      followVideoPage: 1,
      followVideoTotal: 1
    });

    this.getMyVideoList(1);
  },
  //获取视频列表信息------作品
  getMyVideoList: function (page) {
    var that = this;
    var publisherId = that.data.publisherId;
    // 查询视频信息
    wx.showLoading();
    // 调用后端
    wx.request({
      url: serverUrl + '/video/myVideo/?page=' + page + '&userId=' + publisherId,
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log("-----------------打印获取的作品data------------" + JSON.stringify(res.data.data.rows));
        var myVideoList = res.data.data.rows;
        myVideoListrows = res.data.data.rows; //翻页用的
        wx.hideLoading();

        var newVideoList = that.data.myVideoList;
        that.setData({
          myVideoPage: page,
          myVideoList: newVideoList.concat(myVideoList),
          myVideoTotal: res.data.data.total,
          serverUrl: app.serverUrl
        });
      }
    })
  },
  //收藏
  doSelectLike: function () {
    this.setData({
      isSelectedWork: "",
      isSelectedLike: "video-info-selected",
      isSelectedFollow: "",

      myWorkFalg: true,
      myLikesFalg: false,
      myFollowFalg: true,

      myVideoList: [],
      myVideoPage: 1,
      myVideoTotal: 1,

      likeVideoList: [],
      likeVideoPage: 1,
      likeVideoTotal: 1,

      followVideoList: [],
      followVideoPage: 1,
      followVideoTotal: 1
    });

    this.getMyLikesList(1);
  },
  //获取收藏列表信息------收藏
  getMyLikesList: function (page) {
    var that = this;
    var publisherId = that.data.publisherId;
    console.log("即将打印居居的id-=-=-" + publisherId)
    // 查询视频信息
    wx.showLoading();
    // 调用后端
    wx.request({
      url: serverUrl + '/video/showMylike?page=' + page + '&userId=' + publisherId,
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log("-----快来打印收藏嗷嗷嗷嗷-------" + res.data);
        var likeVideoList = res.data.data.rows;
        wx.hideLoading();

        var newVideoList = that.data.likeVideoList;
        that.setData({
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
    // console.log(this.data);
    // console.log( myVideoListrows);
    if (!myWorkFalg) {
      var currentPage = this.data.myVideoPage;
      var totalPage = this.data.myVideoTotal;
      // 获取总页数进行判断，如果当前页数和总页数相等，则不分页
      if (myVideoListrows.length == 0) {

        wx.showToast({
          title: '已经没有视频啦...',
          icon: "none"
        });
        return;
      }
      var page = currentPage + 1;
      this.getMyVideoList(page);
    } else if (!myLikesFalg) {
      var currentPage = this.data.likeVideoPage;
      console.log("emmm打印收藏的分页-----" + currentPage)
      var totalPage = this.data.myLikesTotal;
      // 获取总页数进行判断，如果当前页数和总页数相等，则不分页
      if (currentPage == totalPage) {
        wx.showToast({
          title: '已经没有视频啦...',
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
      // var videoList = me.data.myVideoList;
      var videoInfo = JSON.stringify(videoList[arrindex]);
    } else if (!myLikesFalg) {
      var videoList = this.data.likeVideoList;
      // var videoList = me.data.likeVideoList;
      var videoInfo = JSON.stringify(videoList[arrindex]);
    }
    // var videoList = me.data.myVideoList;

    // var videoInfo = JSON.stringify(videoList[arrindex]);
    console.log("视频信息叻" + videoInfo)
    wx.redirectTo({
      url: '../vedioInfo/vedioInfo?videoInfo=' + videoInfo

    })
  }


})