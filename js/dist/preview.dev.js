"use strict";

// 图文弹窗单击轮播图 => 大图预览
!function imgPreview() {
  $('#sketchcontainer .imgcontainer img').on('click', function () {
    var src = $(this).attr("src");
    $('#preview img').attr("src", src);
    $('#preview').fadeIn();
  });
  $('#infoWindow .head img').on('click', function () {
    var src = $(this).attr("src");
    $('#preview img').attr("src", src);
    $('#preview').fadeIn();
  }); // 阻止关闭事件的冒泡传递

  $('#preview img').on('click', function (e) {
    e.stopPropagation();
  });
  $('#preview').on('click', function () {
    $('#preview').fadeOut();
    $('#preview img').attr("src", "");
  });
  var pageX,
      pageY,
      isTouch = false,
      imgLeft,
      finger,
      finger_two,
      now,
      scaling;
  var start = [];
  $("#preview").on("touchstart", function (e) {
    // alert("touchstart")
    //手指按下时的手指所在的X，Y坐标  
    pageX = e.originalEvent.touches[0].pageX; // pageY = e.originalEvent.touches[0].pageY;

    imgLeft = parseInt($("#preview img").css("left"));
    now = ""; // 放大之后的 滑动处理控制器

    scaling > 1 ? true : scaling = 1; //记录初始 一组数据 作为缩放使用

    if (e.originalEvent.touches.length >= 2) {
      //判断是否有两个点在屏幕上
      start = e.originalEvent.touches; //得到第一组两个点
    }

    ; //表示手指已按下  

    isTouch = true;
  });
  $("#preview").on("touchmove", function (e) {
    e.preventDefault(); // 一根 手指 执行 目标元素移动 操作

    if (e.originalEvent.touches.length == 1 && isTouch) {
      finger_two = false;
      finger = true;
      var x_distance = e.originalEvent.touches[0].pageX - pageX;
      $("#preview img").css("left", imgLeft + x_distance);
    }

    ; // 2 根 手指执行 目标元素放大操作

    if (e.originalEvent.touches.length >= 2 && isTouch) {
      finger_two = true;
      finger = false; //得到第二组两个点

      now = e.originalEvent.touches; // 缩放比例

      scaling = getDistance(now[0], now[1]) / getDistance(start[0], start[1]); // Math.abs(e.originalEvent.touches[0].pageX - e.originalEvent.touches[1].pageX)

      if (scaling > 1) {
        $("#preview img").css("transform", 'scale(' + scaling + ')');
      } else {
        $("#preview img").css("transform", 'scale(' + scaling + ')');
        scaling = 1;
      }
    }

    ;
  });
  $("#preview").on("touchend", function (e) {
    imgLeft = parseInt($("#preview img").css("left"));
    var imgWidth = $("#preview img").outerWidth(); //将 isTouch 修改为false  表示 手指已经离开屏幕

    if (isTouch) {
      if (finger_two && scaling == 1) {
        $("#preview img").css("left", "0");
        $("#preview img").css("transform", "");
        isTouch = false;
      } else if (finger_two && scaling > 1) {
        isTouch = false;
      } else if (finger && scaling == 1) {
        $("#preview img").css("left", "0");
        isTouch = false;
      } else if (finger && scaling > 1) {
        // alert(imgWidth + "//" + imgLeft);
        if (imgLeft > imgWidth * scaling / 2 - imgWidth / 2) {
          $("#preview img").css("left", "0");
        } else if (imgLeft < -(imgWidth * scaling / 2 - imgWidth / 2)) {
          $("#preview img").css("left", "0");
        }

        isTouch = false;
      }
    }
  }); //缩放 勾股定理方法-求两点之间的距离

  function getDistance(p1, p2) {
    var x = p2.pageX - p1.pageX,
        y = p2.pageY - p1.pageY;
    return Math.sqrt(x * x + y * y);
  }

  ;
}();