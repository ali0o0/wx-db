// pages/mymovie/mymovie.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    moviename: "",
    content: "",
    images: [],
    fileIdS: []
  },
  submit() {
    wx.showLoading({
      title: '数据正在提交',
    })
    var rows = [];
    for (var i = 0; i < this.data.images.length; i++) {
      rows.push(new Promise((resolve, reject) => {
        var item = this.data.images[i];
        var suffix = /\.\w+$/.exec(item)[0];
        var newFile = new Date().getTime() + Math.floor(Math.random() * 9999) + suffix;
        wx.cloud.uploadFile({
          cloudPath: newFile,
          filePath: item,
          success: (res) => {
            var fid = res.fileID;
            this.data.fileIdS.push(fid);
            resolve();
            wx.hideLoading();
          }
        })
      }))
    };
    Promise.all(rows).then(res => {
      var msg = this.data.content;
      var name = this.data.moviename;
      var fileid = this.data.fileIdS;
      db.collection("mymovie").add({
        data: {
          msg,
          name,
          fileid
        }
      }).then(res => {
        wx.hideLoading();
        wx.showToast({
          title: '提交成功',
        })
      })
    })
  },
  jumpDetail() {
    wx.navigateTo({
      url: '/pages/movieDetail/movieDetail',
    })
  },
  upload() {
    wx.showLoading({
      title: '图片上传中',
    });
    wx.chooseImage({
      count: 9,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success: (res) => {
        var list = res.tempFilePaths;
        this.setData({
          images: list
        });
        wx.hideLoading();
      },
    })
  },
  onChangeContent(event) {
    this.setData({
      content: event.detail
    })
  },
  onChangeMname(event) {
    this.setData({
      moviename: event.detail
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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