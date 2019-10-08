// pages/comment/comment.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value1: "",
    value2: 0,
    movieid: 25779217,
    detail: {},
    images: [],
    fileIds: []
  },
  comment() {
    if (this.data.images.length == 0) {
      wx.showToast({
        title: '请选择图片',
      })
      return;
    }
    wx.showLoading({
      title: '等着，wdnmd',
    });
    var rows = [];
    for (var i = 0; i < this.data.images.length; i++) {
      rows.push(new Promise((resolve, reject) => {
        var item = this.data.images[i];
        var suffix = /\.\w+$/.exec(item)[0];
        var newFile = new Date().getTime() + Math.floor(Math.random() * 9999) + suffix;
        wx.cloud.uploadFile({
          cloudPath: newFile,
          filePath: item,
          success: (res => {
            var fid = res.fileID;
            this.data.fileIds.push(fid);
            resolve();
          })
        })
      }))
    }
    Promise.all(rows).then(res=>{
      var content=this.data.value1;
      var score=this.data.value2;
      var id=this.data.movieid;
      var list=this.data.fileIds;
      db.collection("comment").add({
        data:{
          content,
          score:score,
          movieid:id,
          filesIds:list
        }
      }).then(res=>{
        wx.hideLoading();
        wx.showToast({
          title: '成功',
        })
      }).catch(err=>{console.log(err)})
    })
  },
  uploadFile() {
    wx.chooseImage({
      count: 9,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success: (res) => {
        var list = res.tempFilePaths;
        this.setData({
          images: list
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  onContentChange: function() {

  },
  onChangeScore(event) {
    this.setData({
      value2: event.detail
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      movieid: options.id
    });
    this.loadMore();
  },
  loadMore: function() {
    var id = this.data.movieid;
    wx.showLoading({
      title: '正在加载中...',
    })
    wx.cloud.callFunction({
      name: "findDetail",
      data: {
        id
      }
    }).then(res => {
      var obj = JSON.parse(res.result);
      this.setData({
        detail: obj
      })
      wx.hideLoading();
    }).catch(err => {
      console.log(err)
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})