// pages/topic/topic.js
// var Alist =[];
// var Blist =[];
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: false,
    hart: true,
    Tpage:　1,
    Hpage: 1,
    ATopicList: [],
    HTopicList: [],
    tabActive1: "null" ,
    tabActive2: "null",
    serverUrl: app.serverUrl
  },
  // onLoad: function(){
  //   this.getTopic()
  // },

  onShow: function(){
    this.data.Tpage=1;
    this.data.Hpage = 1;
    this.data.ATopicList= [];
    this.data.HTopicList = [];
    this.getTopic()
  },
  btn1: function(){
    this.setData({
      list: false,
      hart: true,
      Tpage: 1,
      ATopicList: [],
      tabActive: ""
    })
    this.getTopic();
  },
  btn2: function () {
    
    this.setData({
      list: true,
      hart: false,
      Hpage: 1,
      HTopicList: [],
      tabActive: ""
    })
    this.getTopicHart()
  },
  getTopic: function(){
    console.log("-----11----")
    var that = this;
    // console.log("+++++++++++++++++++++TTTTTT "+that.data.Tpage)
    var serverurl = app.serverUrl;
    // console.log("------")
    var TabActive1 = that.data.tabActive1;
    var TabActive2 = that.data.tabActive2;
    console.log("123424-----------"+TabActive1);
    wx.request({
      url: serverurl+'/topic/getAll?page='+that.data.Tpage,
      success: function(res){
        //console.log("------" + JSON.stringify(res.data.data))
        if(res.statusCode==200){
          // var length = that.data.ATopicList.length;
          that.setData({
            Tpage: that.data.Tpage + 1,
            ATopicList: that.data.ATopicList.concat(res.data.data),
            TabActive1: "tab-active",
            TabActive2: " "
          })
          // that.Alist = res.data.data;
        }
        else {
          wx.showToast({
            title: '已经没有主题啦~~',
            icon: "none"
          });
        }
        
        // console.log("------" + JSON.stringify(that.data.ATopicList))
      }
    })
    // console.log("------" + that.data.Tpage);
  },
  getTopicHart: function () {
    var that = this;
    var serverurl = app.serverUrl;
    // console.log("------")
    var TabActive1=that.data.tabActive1;
    var TabActive2 = that.data.tabActive2;
    wx.request({
      url: serverurl + '/topic/getHart?page=' + that.data.Hpage,
      success: function (res) {
        if (res.statusCode == 200) {
          that.setData({
            Hpage: that.data.Hpage + 1,
            HTopicList: that.data.HTopicList.concat(res.data.data),           
            TabActive1: "",
            TabActive2: "tab-active"
          })
          // that.Blist= res.data.data;
        }
        else{
          wx.showToast({
            title: '已经没有主题啦~~',
            icon: "none"
          });
        }
        
        // console.log("------" + JSON.stringify(that.data.HTopicList))
      }
    })
    // console.log("------" + that.data.Tpage);
  },
  showTopic: function(e){
    var topicName = e.currentTarget.dataset.itemnum1;
    console.log("------------" + topicName);
    var username = e.currentTarget.dataset.username;
    console.log("------------" + username);
    var participationCounts = e.currentTarget.dataset.itemnum2;
    console.log("------------" + participationCounts);
    var topicDesc = e.currentTarget.dataset.itemnum3;
    console.log("------------" + topicDesc);
    var coverPath = e.currentTarget.dataset.itemnum4;
    console.log("------------" + coverPath);
    var topicId = e.currentTarget.dataset.itemnum5;
    console.log("------------" + topicId);
    wx.navigateTo({
      url: '../topicdetail/topicdetail?topicName='+ topicName 
        + '&username=' + username + '&participationCounts=' + participationCounts + '&topicDesc=' + topicDesc + '&coverPath=' + coverPath + '&topicId=' + topicId,
      
    })
  },
  goupload: function () {
        wx.navigateTo({
          url: '../uploadtopic/uploadtopic',
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
  },
  onReachBottom: function (){
    if(this.data.list===false){
      this.getTopic();
      // if(this.Alist.length==0)
      // {
      //   wx.showToast({
      //     title: '已经没有主题啦...',
      //     icon: "none"
      //   });
      // }
    }else{
      this.getTopicHart();
    //   if (this.Blist.length == 0) {
    //     wx.showToast({
    //       title: '已经没有主题啦...',
    //       icon: "none"
    //     });
    //   }
     }
  }
 
})