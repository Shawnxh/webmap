"use strict";

/*
 * @Author: your name
 * @Date: 2021-04-19 12:15:35
 * @LastEditTime: 2021-07-12 15:33:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \htmlc:\Users\Admin\Desktop\map\js\clock_in.js
 */
var clockInTotalPage,
    clockInCurrentPageSize,
    clockInPageNum = 1,
    clockInPageSize = 3; // 进入打卡列表

$("#infoWindow .bottom .clockIn").on("click", function () {
  if (!sessionStorage.getItem('token') || !token) {
    window.location.href = baseUrl + '/api/user/login' + '?redirectUrl=' + encodeUrl;
  } else {
    $("#clockInLists .main .lists").empty(); // 填充打卡列表数据

    assignClockInHeader();
    clockIn_downCallback();
    $("#infoWindow").hide();
    $("#clockInLists").show();
  }
}); // 退出打卡列表

$("#clockInLists .head .close").on("click", function () {
  $("#clockInLists").hide();
  $("#infoWindow").show();
});

function clockInListsThunmUpStatus() {
  $("#clockInLists .main .lists .item .heat .img").each(function (index, ele) {
    if ($(ele).attr('status') == 0) {
      if ($(ele).hasClass('active')) {
        $(ele).removeClass('active');
      }
    } else {
      if ($(ele).hasClass('active')) {} else {
        $(ele).addClass('active');
      }
    }
  }); // 注销点赞click事件

  $("#clockInLists .main .lists .item .heat .img").unbind('click'); // 注册点赞click事件

  $("#clockInLists .main .lists .item .heat .img").on("click", function (e) {
    if ($(e.currentTarget).hasClass('active')) {
      $.ajax({
        type: "get",
        url: baseUrl + "/api/punch.auth/agree?id=" + $(e.currentTarget).attr('id') + "&uId=" + sessionStorage.getItem('id'),
        async: false,
        success: function success(res) {
          var num = Number($(e.currentTarget).next().text()) - 1;
          $(e.currentTarget).removeClass('active').next().text(num);
        },
        error: function error(err) {
          console.log(err);
        }
      });
    } else {
      $.ajax({
        type: "get",
        url: baseUrl + "/api/punch.auth/agree?id=" + $(e.currentTarget).attr('id') + "&uId=" + sessionStorage.getItem('id'),
        async: false,
        success: function success(res) {
          var num = Number($(e.currentTarget).next().text()) + 1;
          $(e.currentTarget).addClass('active').next().text(num);
        },
        error: function error(err) {
          console.log(err);
        }
      });
    }
  });
  $("#clockInLists .main .item .cover").unbind('click'); // 打卡详情

  $("#clockInLists .main .item .cover").on("click", function (e) {
    $("#clockInDetail .cover").attr("src", $(e.currentTarget).parent().find(".cover img").attr("src"));
    $("#clockInDetail .clockInLists_user img").attr("src", $(e.currentTarget).parent().find(".bottom .avatar img").attr("src"));
    $("#clockInDetail .clockInLists_user .name").text($(e.currentTarget).parent().find(".bottom .name").text());
    $("#clockInDetail .clockInLists_cmt").text($(e.currentTarget).parent().find(".description").text());
    $("#clockInDetail .heat .img").attr("id", $(e.currentTarget).parent().find(".bottom .heat .img").attr("id"));
    $("#clockInDetail .heat .num").text($(e.currentTarget).parent().find(".bottom .heat .num").text());

    if ($(e.currentTarget).parent().find(".bottom .heat .img").hasClass('active')) {
      if (!$("#clockInDetail .heat .img").hasClass('active')) {
        $("#clockInDetail .heat .img").addClass('active');
      }
    } else {
      if ($("#clockInDetail .heat .img").hasClass('active')) {
        $("#clockInDetail .heat .img").removeClass('active');
      }
    }

    $("#clockInDetail").show();
  });
} // 退出打卡详情


$("#clockInDetail .close").on("click", function () {
  $("#clockInDetail").hide(); // 退出同时清空图片缩放操作

  $("#clockInDetail .cover").css("transform", "");
});
$("#clockInDetail .cover").on('click', function () {
  $("#clockInDetail .close").click();
});
$("#clockInDetail .heat .img").on("click", function (e) {
  if ($(e.currentTarget).hasClass('active')) {
    $.ajax({
      type: "get",
      url: baseUrl + "/api/punch.auth/agree?id=" + $(e.currentTarget).attr('id') + "&uId=" + sessionStorage.getItem('id'),
      async: false,
      success: function success(res) {
        var num = Number($(e.currentTarget).next().text()) - 1;
        $(e.currentTarget).removeClass('active').next().text(num);
        $("#clockInLists .main .lists .bottom .heat .img").each(function (index, ele) {
          if ($(ele).attr("id") == $("#clockInDetail .heat .img").attr("id")) {
            if ($("#clockInDetail .heat .img").hasClass("active")) {
              if (!$("#clockInLists .main .lists .item .heat .img").hasClass("active")) {
                $("#clockInLists .main .lists .item .heat .img").addClass("active");
                $("#clockInLists .main .lists .item .heat .num").text(num);
              }
            } else {
              if ($("#clockInLists .main .lists .item .heat .img").hasClass("active")) {
                $("#clockInLists .main .lists .item .heat .img").removeClass("active");
                $("#clockInLists .main .lists .item .heat .num").text(num);
              }
            }
          }
        });
      },
      error: function error(err) {
        console.log(err);
      }
    });
  } else {
    $.ajax({
      type: "get",
      url: baseUrl + "/api/punch.auth/agree?id=" + $(e.currentTarget).attr('id') + "&uId=" + sessionStorage.getItem('id'),
      async: false,
      success: function success(res) {
        var num = Number($(e.currentTarget).next().text()) + 1;
        $(e.currentTarget).addClass('active').next().text(num);
        $("#clockInLists .main .lists .bottom .heat .img").each(function (index, ele) {
          if ($(ele).attr("id") == $("#clockInDetail .heat .img").attr("id")) {
            if ($("#clockInDetail .heat .img").hasClass("active")) {
              if (!$("#clockInLists .main .lists .item .heat .img").hasClass("active")) {
                $("#clockInLists .main .lists .item .heat .img").addClass("active");
                $("#clockInLists .main .lists .item .heat .num").text(num);
              }
            } else {
              if ($("#clockInLists .main .lists .item .heat .img").hasClass("active")) {
                $("#clockInLists .main .lists .item .heat .img").removeClass("active");
                $("#clockInLists .main .lists .item .heat .num").text(num);
              }
            }
          }
        });
      },
      error: function error(err) {
        console.log(err);
      }
    });
  }
}); // ==================================打卡信息发布页============================================
// 发布页 => 打卡列表

$("#clockInFn .bottom_original .back").on('click', function () {
  $("#clockInFn").hide();
  $("#clockInLists").css("display") == "none" ? $("#clockInLists").show() : "";
}); // 保存发布

$("#clockInFn .bottom_original .save").on('click', function () {
  // 让textarea失去焦点 => 软键盘收起
  $("#clockInFn .poster .bottom textarea").blur();
  var contentOriginal = $("#clockInFn .poster .bottom textarea").val(); // 清除空格

  var content = contentOriginal.replace(/\s/g, "");

  if (content == null || content == "") {
    $("#clockInFn .poster .bottom textarea").css("background-color", "transparent");
  }

  ;
  var image = $("#clockInFn .poster .chooseImgContainer .chooseImg").attr("src");
  $.ajax({
    type: "post",
    url: baseUrl + '/api/punch.auth',
    contentType: "application/json",
    data: JSON.stringify({
      "uId": userId,
      "content": contentOriginal,
      "imageUrl": image
    }),
    async: false,
    beforeSend: function beforeSend(request) {
      request.setRequestHeader("token", token);
    },
    success: function success(res) {
      setTimeout(function () {
        screenCapture(); // 展示下载指示页

        $("#clockInFn .downImgContainer").show();
        $("#clockInFn .poster .bottom textarea").val("");
        $("#clockInFn .poster .bottom textarea").css("background-color", "#F18669");
      }, 100);
    },
    error: function error(err) {
      console.log(err);
    }
  });
}); // 图片海报返回

$("#clockInFn .downImgContainer .backToShare").on('click', function () {
  $("#clockInFn .downImgContainer").hide(); // 生成图片置空

  $("#clockInFn .downImgContainer img").attr("src", ""); // 回到打卡列表

  $("#clockInFn .bottom_original .back").click();
}); // 填充打卡列表页面头部

function assignClockInHeader() {
  $("#clockInLists .head img").attr("src", $("#infoWindow #infoContainer .head img").attr("src"));
  $("#clockInLists .head .right .name").text($("#infoWindow #infoContainer .head .right .name").text());
  $("#clockInLists .head .right .bottom").text($("#infoWindow #infoContainer .head .right .center").text());
} // 打卡海报生成图片保存


function screenCapture() {
  html2canvas($('#clockInFn .poster')[0], {
    useCORS: true
  }).then(function (canvas) {
    // document.body.appendChild(canvas);
    var img = convertCanvasToImage(canvas);
    generateImage(img.src);
  });
} // Converts image to canvas; returns new canvas element


function convertImageToCanvas(image) {
  var canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  canvas.getContext("2d").drawImage(image, 0, 0);
  return canvas;
} // Converts canvas to an image


function convertCanvasToImage(canvas) {
  var image = new Image();
  image.src = canvas.toDataURL();
  return image;
}

function generateImage(url) {
  // 生成图片
  $("#clockInFn .downImgContainer img").attr("src", url);
} // ===========================================================================================
// 弃用


var colCount = 2; //定义列数
//当窗口大小重置之后，重新执行
// $(window).on('resize', function () {
//     waterfall();
// })
//定义reset函数

function waterfall() {
  var imgWidth = $('#clockInLists .main .item').outerWidth(true); //单个item的宽度

  var colHeightArry = []; //定义列高度数组

  for (var i = 0; i < colCount; i++) {
    colHeightArry[i] = 0;
  }

  $('#clockInLists .main .item').each(function () {
    var minValue = colHeightArry[0];
    var minIndex = 0;

    for (var i = 0; i < colCount; i++) {
      if (colHeightArry[i] < minValue) {
        minValue = colHeightArry[i];
        minIndex = i;
      }
    }

    $(this).css({
      left: minIndex * imgWidth,
      top: minValue
    });
    colHeightArry[minIndex] += $(this).outerHeight(true);
  });
} // ===========================================================================================