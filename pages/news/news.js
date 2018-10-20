// pages/news/news.js
var Turnfile = require('../../utils/station_name.js')
const app = getApp()

var myFansListrows;
var myFollowsListrows;
Page({

  /**
   * 页面的初始数据
   */
  
  data: {
    SelClass: "video-info",
    isSelectedFans: "video-info-selected",
    isSelectedFollows: "",

    myFansFalg: false,
    myFollowsFalg: true,

    myFansList: [],
    myFansPage: 0,

    myFollowsList: [],
    myFollowsPage: 0,

    myFansSearchList:[],

    myFollowsSearchList:[],

    //个人信息
     key:'',
     key1:'',
    id:'',
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



  onLoad: function(){
    var me = this;
    
    me.getmyFansList(0);    
  },

  cancelFollows: function (e){
    var that = this;
    
    var followId = e.currentTarget.dataset.id;
    var userId = app.globalData.userId;
    console.log("FFFFFFFFF" + followId);
    console.log("UUUUUUUUU" + e.currentTarget.dataset.index);
    console.log("UUUUUUUUU" + userId);
    
    wx.showModal({
      title: '提示',
      content: '确定要取消关注该用户吗？',
      success: function (res) {
        if (res.confirm) {//这里是点击了确定以后
          console.log('用户点击确定')
          wx.showLoading();
          // console.log("++++++++++" + userId);
          wx.request({
            url: 'http://192.168.1.7:8081/user/fansUnpick?followId=' + followId + '&userId=' + userId,
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function (res) {
              // console.log("++++++++++" + userId);
              wx.hideLoading();
              wx.showToast({
                title: '取消关注成功',
                icon: 'success',
              })
              if (e.currentTarget.dataset.index!=that.data.myFollowsList.length-1){
                for (var i = e.currentTarget.dataset.index; i < that.data.myFollowsList.length; i++) {

                  that.data.myFollowsList[i] = that.data.myFollowsList[i + 1];
                }
                that.data.myFollowsList.length -= 1;
              }else{
                console.log("1111111111");
                that.data.myFollowsList.length -= 1;
                console.log(that.data.myFollowsList);
              }
              
               var aaalist = that.data.myFollowsList;
              that.setData({
                 myFollowsList: aaalist,
               })
            //   aaalist[e.currentTarget.dataset.index].isFans = !aaalist[e.currentTarget.dataset.index].isFans;
            //   console.log(that.data.myFansList[e.currentTarget.dataset.index].isFans);
            //   that.setData({
            //     myFansList: aaalist,
            //   })
            //   console.log(that.data.myFansList[e.currentTarget.dataset.index].isFans);
             }


          })

        } else {//这里是点击了取消以后
          console.log('用户点击取消')
        }

      }

    })
  },

  addFollows:function(e){
      var that=this;
    console.log(e.currentTarget.dataset.index);
    var followId = e.currentTarget.dataset.id;
    var userId = app.globalData.userId;
    
    wx.showModal({
      title: '提示',
      content: '确定要添加该用户关注吗？',
      success: function (res) {
        if (res.confirm) {//这里是点击了确定以后
          console.log('用户点击确定')
          wx.showLoading();
          // console.log("++++++++++" + userId);
          wx.request({
            url: 'http://192.168.1.7:8081/user/fanspick?followId=' + followId + '&userId='+userId,
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function (res){
              // console.log("++++++++++" + userId);
              wx.hideLoading();
              wx.showToast({
                title: '添加成功',
                icon: 'success',
              })
              var aaalist = that.data.myFansList;
              aaalist[e.currentTarget.dataset.index].isFans = !aaalist[e.currentTarget.dataset.index].isFans;
              console.log(that.data.myFansList[e.currentTarget.dataset.index].isFans);
              that.setData({
                myFansList: aaalist,
              })
              // that.data.myFansList[e.currentTarget.dataset.index].isFans = !that.data.myFansList[e.currentTarget.dataset.index].isFans;
              console.log(that.data.myFansList[e.currentTarget.dataset.index].isFans);
            }
           

          })
          
        } else {//这里是点击了取消以后
          console.log('用户点击取消')
        }

      }

    })
  },

 Submit:function(e){
    var that = this;
   that.data.myFansList=[];
    // var searchValue = e.detail.value.searchValue;
    // Console.log("+++++++++++++++++" + searchValue);
    // that.data.key=searchdesc;
    //that.doSelectFans();
      that.getmyFansList(0);
  } ,
  Submit1: function (e) {
    var that = this;
    that.data.myFollowsList = [];
    // var searchValue = e.detail.value.searchValue;
    // Console.log("+++++++++++++++++" + searchValue);
    // that.data.key=searchdesc;
    //that.doSelectFans();
    that.getmyFollowsList(0);
  },
  mobileInput:function(e){
    
    var val = e.detail.value;
    this.setData({
      key: val
    });
  },
  mobileInput1: function (e) {

    var val = e.detail.value;
    this.setData({
      key1: val
    });
  },

  //触底事件
  onReachBottom: function () {
    var myFansFalg = this.data.myFansFalg;
    var myFollowsFalg = this.data.myFollowsFalg;
    // console.log(this.data);
    // console.log( myVideoListrows);
    if (!myFansFalg) {
      var currentPage = this.data.myFansPage;
      //  var totalPage = this.data.myVideoTotal;
      // 获取总页数进行判断，如果当前页数和总页数相等，则不分页
      if (myFansListrows.length == 0) {

        wx.showToast({
          title: '已经没有粉丝啦~~',
          icon: "none"
        });
        return;
      }
      var page = currentPage + 1;
      this.getmyFansList(page);
    }
    else if (!myFollowsFalg) {
      var currentPage = this.data.myFollowsPage;
      // var totalPage = this.data.myLikesTotal;
      // 获取总页数进行判断，如果当前页数和总页数相等，则不分页
      if (myFollowsListrows.length == 0) {
        wx.showToast({
          title: '已经没有关注的人啦~~',
          icon: "none"
        });
        return;
      }
      var page = currentPage + 1;
      this.getmyFollowsList(page);
    }
   } ,
  //获取粉丝列表
  getmyFansList: function(page){
    var me = this;
    console.log(me.data.key);
    wx.showLoading();
    // var user = app.getGlobalUserInfo();
    var userId = app.globalData.userId;
    var serverUrl = app.serverUrl;
    // console.log("++++++++++" + serverUrl);
    wx.request({

      url: serverUrl + '/search/getFansByKey?userid=' + userId + '&page=' + page
        +'&key=' +  me.data.key,

      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'GET',
      success(res) {
        console.log(res.data);
        wx.hideLoading();

        if (res.data.status == 200) {
        
        var myFansList = res.data.data;
          //  console.log(res.data.data[0].user);
          // console.log("myFansList:" + JSON.stringify(myFansList));
            myFansListrows = res.data.data;
          for (var i = 0; i < myFansList.length;i++){
            myFansList[i].user.province = Turnfile.getname(myFansList[i].user.province);
            myFansList[i].user.city = Turnfile.getname(myFansList[i].user.city);
          }

          // console.log("+++++++++++++++" + JSON.stringify(myFansListrows));
        var newFansList = me.data.myFansList;
        me.setData({

           myFansPage: page,
          myFansList: newFansList.concat(myFansList),
          // myFansTotal: res.data.data.total,
          serverUrl: app.serverUrl,
        });
        // console.log(myFansList);
        }
        else if (res.data.status == 500){
          wx.showToast({
            title: '没有粉丝啦~~',
            icon: "none"
          });
        }
      },
    })
  },
  //获取关注列表
  getmyFollowsList: function (page) {
    var me = this;
    wx.showLoading();
    // var user = app.getGlobalUserInfo();
    var userId = app.globalData.userId;
    var serverUrl = app.serverUrl;
    // console.log("++++++++++" + serverUrl);
    wx.request({

      url: serverUrl + '/search/getFollowByKey?userid=' + userId + '&page=' + page
        + '&key=' + me.data.key1,

      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'GET',
      success(res) {
        console.log(res.data);
        wx.hideLoading();
        if (res.data.status == 200) {

          var myFollowsList = res.data.data;
              myFollowsListrows = res.data.data;
          for (var i = 0; i < myFollowsList.length; i++) {
            myFollowsList[i].province = Turnfile.getname(myFollowsList[i].province);
            myFollowsList[i].city = Turnfile.getname(myFollowsList[i].city);
          }

          var newFollowsList = me.data.myFollowsList;
          me.setData({

            myFollowsPage: page,
            myFollowsList: newFollowsList.concat(myFollowsList),
            // myFollowsTotal: res.data.data.total,
            serverUrl: app.serverUrl,
          });
          // console.log(myFollowsList);
        }
        else if (res.data.status == 500) {
          wx.showToast({
            title: '没有关注啦~~',
            icon: "none"
          });
        }
      },
    })
  },
  
  //跳转到用户信息页面
  showUser: function (e) {
    var that = this;
    // console.log("2222222222222222222333333" + JSON.stringify( e.currentTarget));
    var userId = e.currentTarget.dataset.userid;
    // console.log("2222222222222222222" + userId);
    wx.navigateTo({
      url: '../userInfo/userInfo?publisherId=' + userId,
    })
  },

  
  doSelectFans: function () {
    this.setData({
      isSelectedFans: "video-info-selected",
      isSelectedFollows: "",
      
      

      myFansFalg: false,
      myFollowsFalg: true,

      myFansList: [],
      myFollowsPage: 0,


      myFollowsList: [],
      myFollowsPage: 0,

      key: ''

    });
    this.getmyFansList(0);

  },

  doSelectFollows: function () {
    this.setData({
      isSelectedFans: "",
      isSelectedFollows: "video-info-selected",
      

      myFansFalg: true,
      myFollowsFalg: false,
     
      myFansList: [],
      myFollowsPage: 0,


      myFollowsList: [],
      myFollowsPage: 0,
      
      key1: ''
    });

    this.getmyFollowsList(0);
  },
  
})

