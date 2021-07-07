"use strict";

/*
 * @Author: your name
 * @Date: 2021-04-09 09:36:51
 * @LastEditTime: 2021-07-07 10:11:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \htmlc:\Users\Admin\Desktop\map\js\wechat_authorization.js
 */
var $appid, $timestamp, $noncestr, $signature;
var protocol_domain_port = 'http://39.102.65.183:8080/open';
var url = encodeURIComponent(window.location.href);
$.ajax({
  type: "get",
  url: "https://webmapserver.cdflytu.com/weChartToken/wechatconfig/jssdk" + "?url=" + url,
  async: false,
  success: function success(res) {
    // console.log(res.data);
    $appid = res.data.appId; // appid

    $timestamp = res.data.timestamp; // timestamp

    $noncestr = res.data.nonceStr; // noncestr

    $signature = res.data.signature; // signature
    //**配置微信信息**

    wx.config({
      debug: false,
      appId: $appid,
      timestamp: $timestamp,
      nonceStr: $noncestr,
      signature: $signature,
      jsApiList: [// 所有要调用的 API 都要加到这个列表中
      'openLocation', 'getLocation', 'chooseImage']
    });
  },
  error: function error(msg) {
    console.log('err!');
  }
});
wx.ready(function () {
  // 导航拉起
  $("#infoWindow #infoExit a span").on("click", function () {
    wx.openLocation({
      latitude: selfTargetLat,
      // 纬度，浮点数，范围为90 ~ -90
      longitude: selfTargetLng,
      // 经度，浮点数，范围为180 ~ -180。
      name: selfTargetName,
      // 位置名
      address: selfTargetAddress,
      // 地址详情说明
      scale: 15,
      // 地图缩放级别,整型值,范围从1~28。默认为最大
      infoUrl: 'www.baidu.com' // 在查看位置界面底部显示的超链接,可点击跳转

    });
  }); // 选取图片 拉起

  $("#clockInLists .clockIn_button").on('click', function () {
    // 显示打卡按钮遮挡物  =>  防止用户连续click多次拉起相册  =>  这里设置间隔2s;
    $("#clockInLists .clockIn_button_shelter").show();
    setTimeout(function () {
      $("#clockInLists .clockIn_button_shelter").hide();
    }, 2000); // 拉起相册提示

    $("#clockInLists .pullUp_album").show();
    wx.getLocation({
      type: 'gcj02',
      // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
      success: function success(res) {
        // selfCurrentLat = res.latitude; // 纬度，浮点数，范围为90 ~ -90
        // selfCurrentLng = res.longitude; // 经度，浮点数，范围为180 ~ -180。
        var a = getFlatternDistance(Number(res.latitude), Number(res.longitude), selfTargetLat, selfTargetLng); // let a = getFlatternDistance(Number(res.latitude), Number(res.longitude), 30.54152, 104.063886);

        if (a < 1000) {
          $("#clockInLists .pullUp_album").hide();
          wx.chooseImage({
            count: 1,
            // 默认9
            sizeType: ['original', 'compressed'],
            // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'],
            // 可以指定来源是相册还是相机，默认二者都有
            success: function success(res) {
              var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片

              wx.getLocalImgData({
                // 获取本地图片
                localId: localIds[0],
                success: function success(res) {
                  var localData = res.localData;
                  var imageBase64 = '';

                  if (localData.indexOf('data:image') == 0) {
                    //苹果的直接赋值，默认生成'data:image/jpeg;base64,'的头部拼接
                    imageBase64 = localData;
                  } else {
                    //此处是安卓中的唯一得坑！在拼接前需要对localData进行换行符的全局替换
                    //此时一个正常的base64图片路径就完美生成赋值到img的src中了
                    imageBase64 = 'data:image/jpeg;base64,' + localData.replace(/\n/g, '');
                  }

                  $("#clockInFn .poster .chooseImgContainer .chooseImg").attr("src", imageBase64);
                  $("#clockInFn").show();
                }
              });
            }
          });
        } else if (a >= 1000) {
          $("#clockInLists .pullUp_album").hide();
          $("#clockInLists .clockIn_scope_notice").fadeIn();
          setTimeout(function () {
            $("#clockInLists .clockIn_scope_notice").fadeOut();
          }, 3000);
        } else {
          alert("微信获取定位失败,请刷新后再次尝试!");
        }
      }
    });
  });
});
wx.error(function (res) {
  console.log(res.errMsg);
});