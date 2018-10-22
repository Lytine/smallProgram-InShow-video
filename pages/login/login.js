var test = getApp().globalData.test;
var serverUrl = getApp().serverUrl;
var app = getApp();
Page({
  data: {
    userInfo: {},
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    // serverUrl: serverUrl
    userId: ""
  },

  //在这里设置重定向的拦截
  onLoad: function(params) {
    var that = this;
    // that.setData({
    //   userInfo: app.globalData.userInfo,
    //   userid: 
    // })
  },

  bindGetUserInfo: function() {
    var me = this;
    wx.login({
      success: function(res) {
        var js_code = res.code;
        wx.getUserInfo({
          success: function(res) {
            //  console.log("------------------" + res.rawData);
            app.globalData.userInfo = res.userInfo;
            console.log("yonghuxinxi:"+app.globalData.userInfo);
            var rawd = res.rawData;
            wx.request({
              url: serverUrl + '/login/login',
              data: {
                js_code: js_code,
                rawsData: rawd,
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              method: 'POST',
              success: function(res) {
                console.log("******"+JSON.stringify(res.data.data));
                console.log("********************" + JSON.stringify(rawd))
                //app.setGlobalUserInfo(rawd);
                app.globalData.userId = res.data.data.userid;
               app.globalData.userInfo = rawd;
                console.log("ajkfkk----userid-------" + res.data.data.userid)
                console.log("------------" + js_code);
                console.log("------------" + rawd);
                console.log("--------------登陆成功o(*￣▽￣*)o");
                //app.globalData.userId = res.userId;
               
                wx.switchTab({
                  url: '../index/index'
                })
              }
            })
            //do anything

          },
          fail: me.showPrePage
        });
      }
    })
  },
})