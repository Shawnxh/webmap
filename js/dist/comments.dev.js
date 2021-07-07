"use strict";

/*
 * @Author: your name
 * @Date: 2021-06-24 15:44:57
 * @LastEditTime: 2021-07-07 09:59:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \htmlc:\Users\Admin\Desktop\map\js\comments.js
 */
var commentsTotalPage,
    commentsCurrentPageSize,
    commentsPageNum = 1,
    commentsPageSize = 3; // 打开评论页面

$("#moreUnfold .button .cmt_icon").on("click", function () {
  if (!sessionStorage.getItem('token') || !token) {
    window.location.href = baseUrl + '/api/user/login' + '?redirectUrl=' + encodeUrl;
  } else {
    $("#comments .listbox").empty();
    commentsList_downCallback();
    $("#moreUnfold").hide();
    $("#comments").fadeIn();
  }
}); // 关闭评论页面

$("#comments .head .close").on("click", function () {
  $("#comments").hide();
  $("#moreUnfold").fadeIn();
});

function commentsThunmUpStatus() {
  $("#comments .body .listbox .every .thumbupbox .finger").each(function (index, ele) {
    if ($(ele).attr('status') == 0) {
      if ($(ele).hasClass('active')) {
        $(ele).removeClass('active');
      }
    } else {
      if ($(ele).hasClass('active')) {} else {
        $(ele).addClass('active');
      }
    }
  });
  $("#comments .body .listbox .every .deletebox").each(function (index, ele) {
    if ($(ele).attr('uid') == userId) {
      $(ele).show();
      $(ele).unbind('click');
      $(ele).on("click", function (e) {
        if (confirm("确认删除?")) {
          $.ajax({
            type: "get",
            url: baseUrl + "/api/comment.auth/remove?id=" + $(e.currentTarget).prev().find('.finger').attr('cid'),
            async: false,
            success: function success(res) {
              $(e.currentTarget).parent().remove();
              $("#comments .operation_feedback").text("删除成功!");
              $("#comments .operation_feedback").show();
              setTimeout(function () {
                $("#comments .operation_feedback").fadeOut();
              }, 2000);
            },
            error: function error(err) {
              console.log(err);
            }
          });
        }
      });
    }
  }); // 注销点赞click事件

  $("#comments .body .listbox .every .thumbupbox .finger").unbind('click'); // 注册点赞click事件

  $("#comments .body .listbox .every .thumbupbox .finger").on("click", function (e) {
    if ($(e.currentTarget).hasClass('active')) {
      $.ajax({
        type: "get",
        url: baseUrl + "/api/comment.auth/agree?id=" + $(e.currentTarget).attr('cid') + "&uId=" + sessionStorage.getItem('id'),
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
        url: baseUrl + "/api/comment.auth/agree?id=" + $(e.currentTarget).attr('cid') + "&uId=" + sessionStorage.getItem('id'),
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
}

$("#comments .footer .release").on("click", function () {
  var contentOriginal = $("#comments .footer textarea").val(); // 清除空格

  var content = $("#comments .footer textarea").val().replace(/\s/g, "");

  if (content == null || content == "") {
    alert("请填写内容后再发布!");
  } else {
    // 发布行为 => 添加评论api
    $.ajax({
      type: "post",
      url: baseUrl + '/api/comment.auth',
      contentType: "application/json",
      data: JSON.stringify({
        "cUid": sessionStorage.getItem('id'),
        "cContent": contentOriginal
      }),
      async: false,
      success: function success(res) {
        // 无需审核
        if (res.data) {
          commentsList_downCallback();
          $("#comments .footer textarea").val("");
          $("#comments .operation_feedback").text("发布成功!");
          $("#comments .operation_feedback").show();
          setTimeout(function () {
            $("#comments .operation_feedback").fadeOut();
          }, 3000);
        } else {
          $("#comments .footer textarea").val("");
          $("#comments .operation_feedback").text("发布成功，待后台审核...");
          $("#comments .operation_feedback").show();
          setTimeout(function () {
            $("#comments .operation_feedback").fadeOut();
          }, 3000);
        }
      },
      error: function error(err) {
        console.log(err);
      }
    });
  }
});