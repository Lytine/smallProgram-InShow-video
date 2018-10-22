App({
  serverUrl: "http://192.168.1.7:8081",

  setGlobalUserInfo: function(user) {
    wx.setStorageSync("userInfo", user);
  },

  getGlobalUserInfo: function() {
    return wx.getStorageSync("userInfo");
  },
  
  setGlobalUserId: function(uid) {
    wx.setStorageSync("userId", uid);
  },
  getGlobalUserId: function() {
    return wx.getStorageSync("userId");
  },

  globalData: {
    test: "test",
    publisherId: "",
    userInfo: {},
    userId: "",
    reportReasonArray: [
      "色情低俗",
      "政治敏感",
      "涉嫌诈骗",
      "辱骂谩骂",
      "广告垃圾",
      "诱导分享",
      "引人不适",
      "过于暴力",
      "违法违纪",
      "其它原因"
    ]
  }

})