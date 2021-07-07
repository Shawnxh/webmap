/*
 * @Author: Shawn
 * @Date: 2021-04-09 09:36:51
 * @LastEditTime: 2021-07-07 10:51:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \htmlc:\Users\Admin\Desktop\map\js\index.js
 */
var key = "2CHBZ-PO3KF-2JTJH-JQM4K-KWSRS-RFFGQ";
var map = null, polygon = null, marker = null, marker_current = null, imageTileLayer = null;
// 存储用户打开信息窗口的方式
var from;
var marker_data;

var geolocation = new qq.maps.Geolocation(key, "panomap");
var options = { timeout: 9000 };

var navi_data, selfCurrentLat, selfCurrentLng, selfTargetLat, selfTargetLng, selfTargetName, selfTargetAddress;
var polylineLayer;

window.onload = function () {
    // 页面打开时定位当前位置
    geolocation.getLocation(getPosition, failSelfPosition, options);
    // 获取地图数据
    getData();
    // 地址载入
    initMap();
    // 绑定项目内功能点事件
    bindEvent();
    // $(document).on('mousewheel', () => {
    //     console.log(map.getZoom());
    // })
}

function initMap() {
    var drawContainer = document.getElementById('mapContainer');
    // 项目中心点
    var center = new TMap.LatLng(30.46267, 103.930809);
    //初始化地图
    map = new TMap.Map(drawContainer, {
        center: center,
        zoom: 11,
        // zoom: 11,
        doubleClickZoom: false, //关闭双击放大
        minZoom: 9,
        maxZoom: 16
    });
    //初始化imageTileLayer
    imageTileLayer = new TMap.ImageTileLayer({
        getTileUrl: function (x, y, z) {
            // console.log(x + "======" + y);
            // console.log(z);
            //拼接瓦片URL
            var url = tilesPath + '/images/image_tiles_layers/' + z + '/' + x + '_' + y + '.png';
            return url;
        },
        tileSize: 256,	//瓦片像素尺寸
        minZoom: 11,	//显示自定义瓦片的最小级别
        maxZoom: 14,	//显示自定义瓦片的最大级别
        visible: true,	//是否可见
        zIndex: 5000,	//层级高度（z轴）
        opacity: 0.95,	//图层透明度：1不透明，0为全透明
        map: map,		//设置图层显示到哪个地图实例中
    });

    createMarker();
    removeControl();
}

// 创建点实例
function createMarker() {
    marker = new TMap.MultiMarker({
        id: 'marker-layer',
        map: map,
        styles: {
            "red_culture": new TMap.MarkerStyle({
                "width": 40,
                "height": 40,
                "anchor": { x: 16, y: 32 },
                "src": './images/red_culture_marker.png'
            })
        },
        geometries: marker_data,
    });

    marker_current = new TMap.MultiMarker({
        id: 'marker-layer-current',
        map: map,
        styles: {
        },
        geometries: [],
    });

    //监听标注点击事件
    marker.on("click", function (evt) {
        // console.log(evt);
        marker_current.setGeometries([evt.geometry]);
        marker.setVisible(false);

        assignInfoWindow("marker", evt);

        selfTargetLat = evt.geometry.position.lat;
        selfTargetLng = evt.geometry.position.lng;
        selfTargetName = evt.geometry.title;
        selfTargetAddress = evt.geometry.address;

        // 移动地图中心
        map.panTo(new TMap.LatLng(selfTargetLat, selfTargetLng));

        $("#infoWindow").fadeIn();
        from = "marker";

        $("#comments").hide().css("display") == "block" ? $("#comments").hide() : "";
        $("#moreUnfold").hide().css("display") == "block" ? $("#moreUnfold").hide() : "";
        $("#tour_directory").hide();
        $("#buttonContainer .center .button button").removeClass("active");
    })
}

// 移除控件
function removeControl() {
    // 缩放
    if (map.getControl(TMap.constants.DEFAULT_CONTROL_ID.ZOOM)) {
        map.removeControl(TMap.constants.DEFAULT_CONTROL_ID.ZOOM);
    }
    // 比例尺
    if (map.getControl(TMap.constants.DEFAULT_CONTROL_ID.SCALE)) {
        map.removeControl(TMap.constants.DEFAULT_CONTROL_ID.SCALE);
    }
    // 旋转
    if (map.getControl(TMap.constants.DEFAULT_CONTROL_ID.ROTATION)) {
        map.removeControl(TMap.constants.DEFAULT_CONTROL_ID.ROTATION);
    }

}

function getData() {
    // 获取底部分类种类
    $.ajax({
        type: "get",
        url: baseUrl + '/api/data/classification',
        async: false,
        success: function (res) {
            // 有分类  => 显示底部
            res.data.length > 0 ? $("#buttonContainer").css("visibility", "visible") : "";

            let parent = $("#buttonContainer .center");
            parent.empty();

            for (let i = 0; i < res.data.length; i++) {
                let a = $(`<div class="button">
                <button icon=`+ res.data[i].icon + ` iconButton=` + res.data[i].iconButton + ` data_id=` + res.data[i].id + `></button>
                <div class="name">`+ res.data[i].name + `</div>
            </div>`);
                parent.append(a);
            }

            $("#buttonContainer .button button").each((index, ele) => {
                let icon = $(ele).attr("icon");
                let iconButton = $(ele).attr("iconButton");
                // 为底部生成默认默认背景图片的样式
                $(ele).css({ "background-image": "url(" + icon + ")" });
                // 为底部添加acitve状态下的样式(不是直接为这个dom节点设置样式),下面回利用active权重高一级的特性 切换状态
                // css({ "background-image": "url(" + iconButton + ")" });

            })
        },
        error: function (err) {
            console.log(err)
        }
    });

    // 首页默认显示底部第一个分类数据
    if ($("#buttonContainer .button button").length > 0) {
        $.ajax({
            type: "get",
            url: baseUrl + '/api/data/point' + '?cId=' + $("#buttonContainer .button button").first().attr("data_id"),
            async: false,
            success: function (res) {
                marker_data = res.data.map((item) => {
                    let temporary_object = new Object();
                    temporary_object.position = new TMap.LatLng(item.latitude.split(",")[0], item.latitude.split(",")[1]);
                    temporary_object.title = item.name;
                    temporary_object.byid = item.id;
                    temporary_object.imgurl = item.imageUrl;
                    temporary_object.address = item.address;
                    temporary_object.vr = item.panoramaAddress;
                    temporary_object.text = item.addressContent;
                    temporary_object.questions = item.questions;
                    temporary_object.styleId = "red_culture";
                    return temporary_object;
                });
            },
            error: function (err) {
                console.log(err);
            }
        });
    }

}

function bindEvent() {
    // 关闭信息窗口
    $("#infoWindow .head .close").on("click", () => {
        $("#infoWindow").hide();
        if (from == "view") {
            $("#tour_directory").show();
        }
        marker_current.setGeometries([]);
        marker.setVisible(true);
    });
    // 打开园区介绍
    $("#introduce").on("click", () => {
        $("#sketchcontainer").show();
    });
    // 关闭园区介绍
    $("#sketchcontainer .close").on("click", () => {
        $("#sketchcontainer").hide();
    });
    // 点击当前定位
    $("#location").on("click", () => {
        geolocation.getLocation(showPosition, showErr, options);
    });

    // ===================================================底部导览 Beginning=======================================================
    // 非正常操作行为
    $("#buttonContainer .button button").on("click", () => {
        if (!$("#voice .voice_content .audioBox audio").get(0).paused) {
            $("#voice .voice_content audio").get(0).pause();
        }
        $("#comments").css("display") == "block" ? $("#comments").hide() : "";
        $("#moreUnfold").css("display") == "block" ? $("#moreUnfold").hide() : "";
        $("#infoWindow").css("display") == "block" ? $("#infoWindow").hide() : "";
        if (!marker.getVisible()) {
            marker.setVisible(true);
            marker_current.setGeometries([]);
        }
        $("#voice").css("display") == "block" ? $("#voice").hide() : "";
    })
    // 显示/隐藏 导览目录页面
    let drag; // 节流阀存贮当前显示的内容索引
    $("#buttonContainer .button button").each((index, ele) => {
        $(ele).on("click", (e) => {
            $.ajax({
                type: "get",
                url: baseUrl + '/api/data/point' + '?cId=' + $(e.currentTarget).attr("data_id"),
                async: false,
                success: function (res) {
                    marker_data = res.data.map((item) => {
                        let temporary_object = new Object();
                        temporary_object.position = new TMap.LatLng(item.latitude.split(",")[0], item.latitude.split(",")[1]);
                        temporary_object.title = item.name;
                        temporary_object.byid = item.id;
                        temporary_object.imgurl = item.imageUrl;
                        temporary_object.address = item.address;
                        temporary_object.vr = item.panoramaAddress;
                        temporary_object.text = item.addressContent;
                        temporary_object.questions = item.questions;
                        temporary_object.styleId = "red_culture";
                        return temporary_object;
                    });
                    marker.setGeometries(marker_data);

                    // 形成  自定义目录列表所需要的 name(目录名字) 与 id(做查看事件需要id查询)
                    let directory = new Array();
                    for (let i = 0; i < res.data.length; i++) {
                        let temp = new Object();
                        temp.title = res.data[i].name;
                        temp.byid = res.data[i].id;
                        directory.push(temp);
                    }
                    // 创建目录
                    assignTourDirectory(directory);
                    // 为所有创建的目录注册 查看点击事件
                    $("#tour_directory .nav li span:last-child").on("click", (e) => {
                        viewDetails(e);
                        from = "view";
                    });

                },
                error: function (err) {
                    console.log(err);
                }
            });

            if ($("#tour_directory").css("display") == "none") {
                $("#buttonContainer .center .button button").eq(index).css({ "background-image": "url(" + $(e.currentTarget).attr('iconButton') + ")" }).parent().siblings().children("button").each((index, ele) => {
                    $(ele).css({ "background-image": "url(" + $(ele).attr('icon') + ")" });
                });
                $("#tour_directory").show();
                drag = index;
            } else if ($("#tour_directory").css("display") == "block" && drag == index) {
                $("#buttonContainer .center .button button").eq(index).css({ "background-image": "url(" + $(e.currentTarget).attr('icon') + ")" });
                $("#tour_directory").hide();
            } else if ($("#tour_directory").css("display") == "block" && drag != index) {
                $("#buttonContainer .center .button button").eq(index).css({ "background-image": "url(" + $(e.currentTarget).attr('iconButton') + ")" }).parent().siblings().children("button").each((index, ele) => {
                    $(ele).css({ "background-image": "url(" + $(ele).attr('icon') + ")" });
                });
                drag = index;
            }
        });
    });
    // =================================================底部导览 Ending=========================================================

    // 点击更多页面
    $("#more").on("click", () => {
        $("#moreUnfold").fadeIn();

        $("#infoWindow").hide();
        $("#tour_directory").hide();
        $("#buttonContainer .center .button button").removeClass("active");
    });
    // 关闭更多页面
    $("#moreUnfold .button .close_icon").on("click", () => {
        $("#moreUnfold").fadeOut();
    });

    // 打开分享页面
    $("#moreUnfold .button .share_icon").on("click", () => {
        $("#moreUnfold").hide();
        $("#shareInstructionPage").fadeIn();
    });
    // 关闭分享页面
    $("#shareInstructionPage .okay").on("click", () => {
        $("#shareInstructionPage").hide();
        $("#moreUnfold").fadeIn();
    });

    // 路线规划
    $("#infoWindow .head .right .pathPlanning").on("click", (e) => {
        //WebServiceAPI请求URL（驾车路线规划默认会参考实时路况进行计算）
        var url = "https://apis.map.qq.com/ws/direction/v1/driving/"; //请求路径
        url += "?from=" + selfCurrentLat + "," + selfCurrentLng;  //起点坐标
        url += "&to=" + selfTargetLat + "," + selfTargetLng;  //终点坐标
        url += "&output=jsonp&callback=cb";  //指定JSONP回调函数名，本例为cb
        url += "&key=" + key; //开发key，可在控制台自助创建

        //发起JSONP请求，获取路线规划结果
        jsonp_request(url);
    });

    // 退出路线规划
    $("#infoWindow #infoExit >span").on("click", () => {
        // 删除路线规划
        polylineLayer.remove("pl_1");
        // 还原缩放
        map.zoomTo(15);
        // 还原起始位置 => map中心设置到起点
        map.panTo(new TMap.LatLng(selfTargetLat, selfTargetLng));
        $("#infoWindow #infoExit").hide();
        $("#infoWindow #infoContainer").fadeIn();
    });
}

// =======================================导览目录/信息弹窗 Beginning=====================================================
/**
 * @description: 填充信息弹窗
 * @param {String} param 信息弹窗的触发方式
 * @param {Object} array 弹窗对应的数据
 * @return {*}
 */
function assignInfoWindow(param, array) {
    if (param == "marker") {
        $("#infoWindow #infoContainer .head img").attr("src", array.geometry.imgurl);
        $("#infoWindow #infoContainer .head .right .name").text(array.geometry.title);
        $("#infoWindow #infoContainer .head .right .center").text(array.geometry.address);
        $("#infoWindow #infoContainer .bottom .voiceAssistant").attr("byid", array.geometry.byid);
        $("#infoWindow #infoContainer .bottom .vr a").attr("href", array.geometry.vr);
        $("#infoWindow #infoContainer .content").html(array.geometry.text);
        $("#infoWindow #infoExit .name").text(array.geometry.title);
    } else if (param == "directory") {
        $("#infoWindow #infoContainer .head img").attr("src", array.imgurl);
        $("#infoWindow #infoContainer .head .right .name").text(array.title);
        $("#infoWindow #infoContainer .head .right .center").text(array.address);
        $("#infoWindow #infoContainer .bottom .voiceAssistant").attr("byid", array.byid);
        $("#infoWindow #infoContainer .bottom .vr a").attr("href", array.vr);
        $("#infoWindow #infoContainer .content").html(array.text);
        $("#infoWindow #infoExit .name").text(array.title);
    } else {
        console("信息填充api参数填写错误!");
    }

}

/**
 * @description: 填充导览目录
 * @param {Array} array 存储的目录数据数组
 * @return {*}
 */
function assignTourDirectory(array) {
    let parent = $("#tour_directory .nav");
    parent.empty();
    for (let i = 0; i < array.length; i++) {
        let a = $("<li class='primary_title' byid=" + array[i].byid + "><span class='title'>" + array[i].title + "</span><span class='detail'>查看</span></li>");
        parent.append(a);
    }
}
// 展示弹窗+填充弹窗
function viewDetails(e) {
    // 关闭导览目录页面
    $("#tour_directory").hide();
    // 通过父节点上的byid匹配当前标记点集合中该标记点数据
    navi_data = selectNavi(e.target.parentNode.getAttribute('byid'));
    // 设置目标位置的经纬度
    selfTargetLat = navi_data.position.lat;
    selfTargetLng = navi_data.position.lng;
    selfTargetName = navi_data.title;
    selfTargetAddress = navi_data.address;
    assignInfoWindow("directory", navi_data);
    // 移动地图中心
    map.panTo(new TMap.LatLng(selfTargetLat, selfTargetLng));
    marker_current.setGeometries([navi_data]);
    marker.setVisible(false);

    $("#infoWindow").fadeIn();
}
// 通过导览目录进入弹窗 赋值
function selectNavi(param) {
    for (let i = 0; i < marker_data.length; i++) {
        if (param == marker_data[i].byid) {
            return marker_data[i];
        }
    }
}
// ========================================导览目录/信息弹窗 Ending============================================


// ======================================定位回调 Beginning===================================================
function showPosition(position) {
    new TMap.MultiMarker({
        geometries: [{
            position: new TMap.LatLng(position.lat, position.lng)
        }],
        map: map
    });
    // 更新地图中心点经纬度信息
    map.panTo(new TMap.LatLng(position.lat, position.lng));
};
function getPosition(param) {
    selfCurrentLat = param.lat;
    selfCurrentLng = param.lng;
}
function showErr() {
    alert("当前IP地址定位获取失败,请点击再次尝试!")
    $("#locate_failure").show();
    setTimeout(() => {
        $("#locate_failure").fadeOut();
    }, 3000);
};
function failSelfPosition() {
    console.log("路线规划起点地址定位获取失败,请刷新重试!")
    $("#locate_failure").show();
    setTimeout(() => {
        $("#locate_failure").fadeOut();
    }, 3000);
}
// ======================================定位回调 Ending=========================================================


// ======================================路线规划 Beginning=======================================================
//浏览器调用WebServiceAPI需要通过Jsonp的方式，此处定义了发送JOSNP请求的函数
function jsonp_request(url) {
    var script = document.createElement('script');
    script.src = url;
    document.body.appendChild(script);
}
//定义请求回调函数
function cb(ret) {
    //从结果中取出路线坐标串
    var coors = ret.result.routes[0].polyline, pl = [];
    //坐标解压（返回的点串坐标，通过前向差分进行压缩，因此需要解压）
    var kr = 1000000;
    for (var i = 2; i < coors.length; i++) {
        coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
    }
    //将解压后的坐标生成LatLng数组
    for (var i = 0; i < coors.length; i += 2) {
        pl.push(new TMap.LatLng(coors[i], coors[i + 1]));
    }
    display_polyline(pl)//显示路线
}
function display_polyline(pl) {
    //创建 MultiPolyline显示折线
    if (polylineLayer == "" || polylineLayer == null) {
        polylineLayer = new TMap.MultiPolyline({
            id: 'polyline-layer', //图层唯一标识
            map: map,//绘制到目标地图
            //折线样式定义
            styles: {
                'style_blue': new TMap.PolylineStyle({
                    'color': '#3777FF', //线填充色
                    'width': 6, //折线宽度
                    'borderWidth': 5, //边线宽度
                    'borderColor': '#FFF', //边线颜色
                    'lineCap': 'round', //线端头方式
                    'showArrow': true, //行进方向
                })
            },
            //折线数据定义
            geometries: [
                {
                    'id': 'pl_1',//折线唯一标识，删除时使用
                    'styleId': 'style_blue',//绑定样式名
                    'paths': pl
                }
            ]
        });
    } else {
        polylineLayer.updateGeometries([
            {
                'id': 'pl_1',//折线唯一标识，删除时使用
                'styleId': 'style_blue',//绑定样式名
                'paths': pl
            }
        ]);
    }

    // 更新缩放
    map.zoomTo(13);
    // map中心设置到起点
    map.panTo(new TMap.LatLng(selfCurrentLat, selfCurrentLng));
    // 路线显示完 => 显示 退出 导航
    $("#infoWindow #infoContainer").hide();
    $("#infoWindow #infoExit").fadeIn();
}
// ======================================路线规划 Ending=========================================================
