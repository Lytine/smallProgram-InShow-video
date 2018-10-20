App({
  serverUrl: "http://192.168.1.7:8081",
  //serverUrl: "http://10.87.5.24:8081",

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
    userInfo: {
      "nickName": "-辣条兽",
      "gender": 1,
      "language": "zh_CN",
      "city": "Erie",
      "province": "Pennsylvania",
      "country": "United States",
      "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJlEyVoLxhQCYec9R5sXZfawmn1lDVCvx5blfEsaJg6lMEic8pVVnI8LpgZHfZHx2B8Rewuc0VojrQ/132"
    },
    userId: "181008CYNZ1SR6Y8",
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