"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/*
 * @Author: Shawn
 * @Date: 2021-04-09 09:36:51
 * @LastEditTime: 2021-07-08 14:39:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \htmlc:\Users\Admin\Desktop\map\js\initialization.js
 */
// 接口地址
var baseUrl = "https://health.sdhuanqiugou.com/vr",
    // 打卡页面二维码地址  =>  https://cdhistorytovr.cdflytu.com/webmap/map/index.html
domain = "https://webmapdemo.cdflytu.com/webmap/index.html",
    // 登陆接口param
encodeUrl = encodeURIComponent(domain),
    // 瓦片地址
tilesPath = "https://webmapdemo.cdflytu.com/webmap"; // 从url处获取token与id并将其存入session;

var token = getQueryVariable('token');
var userId = getQueryVariable('id');
sessionStorage.setItem("token", token);
sessionStorage.setItem("id", userId); // if (!sessionStorage.getItem('token') || !token) {
//     window.location.href = baseUrl + '/api/user/login' + '?redirectUrl=' + encodeUrl;
// }
// wechat自定义字体调整禁用

!function resetFontSize() {
  if ((typeof WeixinJSBridge === "undefined" ? "undefined" : _typeof(WeixinJSBridge)) == "object" && typeof WeixinJSBridge.invoke == "function") {
    handleFontSize();
  } else {
    if (document.addEventListener) {
      document.addEventListener("WeixinJSBridgeReady", handleFontSize, false);
    } else if (document.attachEvent) {
      document.attachEvent("WeixinJSBridgeReady", handleFontSize);
      document.attachEvent("onWeixinJSBridgeReady", handleFontSize);
    }
  }

  function handleFontSize() {
    // 设置网页字体为默认大小
    WeixinJSBridge.invoke('setFontSizeCallback', {
      'fontSize': 0
    }); // 重写设置网页字体大小的事件

    WeixinJSBridge.on('menu:setfont', function () {
      WeixinJSBridge.invoke('setFontSizeCallback', {
        'fontSize': 0
      });
    });
  }
}(); // 根元素重置

!function initFontSize() {
  document.querySelector('html').style.fontSize = Math.round(document.documentElement.clientWidth / 750 * 20) + 'px';
}(); // 开屏页消失倒计时

(function openingPageDissapear() {
  setTimeout(function () {
    $("#openingPage").fadeOut();
  }, 3000);
})(); // 打卡分享页面二维码填充


!function qrcode() {
  var url = domain; // scanPage

  var qrcode1 = new QRCode(document.getElementById("qr1"), {
    width: 60,
    height: 60
  });
  qrcode1.makeCode(url.replace("invitation", "main"));
}(); // 获取用户信息

!function getUserInfo() {
  if (token && userId) {
    $.ajax({
      type: "get",
      url: baseUrl + '/api/user/userInfo' + '?uId=' + userId,
      async: false,
      beforeSend: function beforeSend(request) {
        request.setRequestHeader("token", token);
      },
      success: function success(res) {
        $("#clockInFn .poster .bottom .user img").attr("src", res.data.uAvatarUrl);
        $("#clockInFn .poster .bottom .user .name").text(res.data.unickname);
      },
      error: function error(err) {
        console.log(err);
      }
    });
  }
}(); // 禁止textarea换行操作

!function disabledNewlineCharacter() {
  $("#comments .footer textarea").keypress(function (event) {
    if (event.which == '13') {
      return false;
    }
  });
  $("#clockInFn .poster textarea").keypress(function (event) {
    if (event.which == '13') {
      return false;
    }
  });
}();