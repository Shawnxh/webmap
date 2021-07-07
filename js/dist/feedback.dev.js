"use strict";

/*
 * @Author: your name
 * @Date: 2021-06-29 10:10:03
 * @LastEditTime: 2021-07-07 10:00:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \htmlc:\Users\Admin\Desktop\map\js\feedback.js
 */
// 打开反馈页面
$("#moreUnfold .button .feedback_icon").on("click", function () {
  if (!sessionStorage.getItem('token') || !token) {
    window.location.href = baseUrl + '/api/user/login' + '?redirectUrl=' + encodeUrl;
  } else {
    $("#moreUnfold").hide();
    $("#feedback").fadeIn();
  }
}); // 提交反馈

$("#feedback .submit").on("click", function () {
  if (!sessionStorage.getItem('token') || !token) {
    window.location.href = baseUrl + '/api/user/login' + '?redirectUrl=' + encodeUrl;
  } else {
    var contentOriginal = $("#feedback .main textarea").val(); // 清除空格

    var content = $("#feedback .main textarea").val().replace(/\s/g, "");

    if (content == null || content == "") {
      alert("请填写内容后再提交!");
    } else {
      $.ajax({
        type: "post",
        url: baseUrl + '/api/opinion.auth',
        contentType: "application/json",
        data: JSON.stringify({
          "uId": sessionStorage.getItem('id'),
          "content": contentOriginal
        }),
        async: false,
        success: function success(res) {
          $("#feedback .main textarea").val("");
          $("#feedback .main").hide();
          $("#feedback .success").show();
          setTimeout(function () {
            $("#feedback .success").hide();
            $("#feedback .main").show();
          }, 3000);
        },
        error: function error(err) {
          console.log(err);
        }
      });
    }
  }
}); // 关闭反馈页面

$("#feedback .head .close").on("click", function () {
  $("#feedback").hide();
  $("#moreUnfold").fadeIn();
});