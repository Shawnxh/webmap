var mescroll_clockInList = new MeScroll("mescroll_clockInList", { //第一个参数"mescroll"对应上面布局结构div的id (1.3.5版本支持传入dom对象)
    //如果您的下拉刷新是重置列表数据,那么down完全可以不用配置,具体用法参考第一个基础案例
    //解析: down.callback默认调用mescroll.resetUpScroll(),而resetUpScroll会将page.num=1,再触发up.callback
    down: {
        auto: false,
        callback: clockIn_downCallback //下拉刷新的回调,别写成downCallback(),多了括号就自动执行方法了
    },
    up: {
        auto: false,
        callback: clockIn_upCallback, //上拉加载的回调
        //以下是一些常用的配置,当然不写也可以的.
        page: {
            num: 1, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
            size: clockInPageSize //每页数据条数,默认10
        },
        htmlNodata: '<p class="upwarp-nodata">-- END --</p>',
        noMoreSize: 3, //如果列表已无数据,可设置列表的总数量要大于10才显示无更多数据;
        //  避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
        //  这就是为什么无更多数据有时候不显示的原因.
        empty: {
            //列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
            warpId: "mescroll_clockInList", //父布局的id (1.3.5版本支持传入dom元素)
            // icon: "../img/mescroll-empty.png", //图标,默认null,支持网络图
            // tip: "暂无相关数据~" //提示
        },
        lazyLoad: {
            use: false, // 是否开启懒加载,默认false
            attr: 'imgurl' // 标签中网络图的属性名 : <img imgurl='网络图  src='占位图''/>
        }
    }
});

var mescroll_commentsList = new MeScroll("mescroll_commentsList", { //第一个参数"mescroll"对应上面布局结构div的id (1.3.5版本支持传入dom对象)
    //如果您的下拉刷新是重置列表数据,那么down完全可以不用配置,具体用法参考第一个基础案例
    //解析: down.callback默认调用mescroll.resetUpScroll(),而resetUpScroll会将page.num=1,再触发up.callback
    down: {
        auto: false,
        callback: commentsList_downCallback //下拉刷新的回调,别写成downCallback(),多了括号就自动执行方法了
    },
    up: {
        auto: false,
        isBounce: false, //如果为true，某些ios手机会有bug
        callback: commentsList_upCallback, //上拉加载的回调
        //以下是一些常用的配置,当然不写也可以的.
        page: {
            num: 1, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
            size: commentsPageSize //每页数据条数,默认10
        },
        htmlNodata: '<p class="upwarp-nodata">-- END --</p>',
        noMoreSize: 3, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;
        //  避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
        //  这就是为什么无更多数据有时候不显示的原因.
        empty: {
            //列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
            warpId: "mescroll_commentsList", //父布局的id (1.3.5版本支持传入dom元素)
            // icon: "../img/mescroll-empty.png", //图标,默认null,支持网络图
            // tip: "暂无相关数据~" //提示
        },
        lazyLoad: {
            use: false, // 是否开启懒加载,默认false
            attr: 'imgurl' // 标签中网络图的属性名 : <img imgurl='网络图  src='占位图''/>
        }
    }
});

var mescroll_graphicList = new MeScroll("mescroll_graphicList", { //第一个参数"mescroll"对应上面布局结构div的id (1.3.5版本支持传入dom对象)
    //如果您的下拉刷新是重置列表数据,那么down完全可以不用配置,具体用法参考第一个基础案例
    //解析: down.callback默认调用mescroll.resetUpScroll(),而resetUpScroll会将page.num=1,再触发up.callback
    down: {
        auto: false,
        callback: graphicList_downCallback //下拉刷新的回调,别写成downCallback(),多了括号就自动执行方法了
    },
    up: {
        auto: false,
        isBounce: false, //如果为true，某些ios手机会有bug
        callback: graphicList_upCallback, //上拉加载的回调
        //以下是一些常用的配置,当然不写也可以的.
        page: {
            num: 1, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
            size: graphicPageSize //每页数据条数,默认10
        },
        htmlNodata: '<p class="upwarp-nodata">-- END --</p>',
        noMoreSize: 3, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;
        //  避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
        //  这就是为什么无更多数据有时候不显示的原因.
        empty: {
            //列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
            warpId: "mescroll_graphicList", //父布局的id (1.3.5版本支持传入dom元素)
            // icon: "../img/mescroll-empty.png", //图标,默认null,支持网络图
            // tip: "暂无相关数据~" //提示
        },
        lazyLoad: {
            use: false, // 是否开启懒加载,默认false
            attr: 'imgurl' // 标签中网络图的属性名 : <img imgurl='网络图  src='占位图''/>
        }
    }
});

//下拉刷新的回调
function clockIn_downCallback() {
    setTimeout(() => {
        let parent = $("#clockInLists .main .lists");
        parent.empty();
        clockInPageNum = 1;
        $.ajax({
            type: "post",
            url: baseUrl + "/api/punch.auth/list",
            contentType: "application/json",
            data: JSON.stringify({
                pageNum: clockInPageNum,
                pageSize: clockInPageSize,
                "userId": sessionStorage.getItem("id")
            }),
            async: false,
            beforeSend: function (request) {
                request.setRequestHeader("token", sessionStorage.getItem("token"));
            },
            success: function (res) {
                clockInTotalPage = res.data.pages;
                clockInCurrentPageSize = res.data.size;

                mescroll_clockInList.setPageNum(2);
                mescroll_clockInList.endByPage(clockInCurrentPageSize, clockInTotalPage);

                for (let i = 0; i < res.data.list.length; i++) {
                    let a = $(`<div class="item">
                    <div class="cover">
                        <img src=`+ res.data.list[i].imageUrl + ` alt="">
                    </div>
                    <div class="description">`+ res.data.list[i].content + `</div>
                    <div class="bottom">
                        <div class="avatar">
                            <img src=`+ res.data.list[i].avatarUrl + ` alt="">
                        </div>
                        <div class="name">`+ res.data.list[i].nickName + `</div>
                        <div class="heat">
                            <span class="img" status=`+ res.data.list[i].agreeStatus + ` id=` + res.data.list[i].id + `></span>
                            <span class="num">`+ res.data.list[i].agree + `</span>
                        </div>
                    </div>
                </div>`);
                    parent.append(a);
                }

                clockInListsThunmUpStatus();
            },
            error: function (err) {
                mescroll_clockInList.endErr();
            }
        });
    }, 1000)
}
function commentsList_downCallback() {
    setTimeout(() => {
        let parent = $("#comments .listbox");
        parent.empty();
        commentsPageNum = 1;
        $.ajax({
            type: "post",
            url: baseUrl + "/api/comment.auth/list",
            contentType: "application/json",
            data: JSON.stringify({
                pageNum: commentsPageNum,
                pageSize: commentsPageSize,
                "userId": sessionStorage.getItem("id")
            }),
            async: false,
            beforeSend: function (request) {
                request.setRequestHeader("token", sessionStorage.getItem("token"));
            },
            success: function (res) {
                commentsTotalPage = res.data.pages;
                commentsCurrentPageSize = res.data.size;
                $("#comments .head .count").text(res.data.total);

                mescroll_commentsList.setPageNum(2);
                mescroll_commentsList.endByPage(commentsCurrentPageSize, commentsTotalPage);

                for (let i = 0; i < res.data.list.length; i++) {
                    let a = $(`<div class="every">
                        <div class="avatar"><img src=`+ res.data.list[i].avatarUrl + ` alt=""></div>
                        <div class="mainbox">
                            <div class="nickname">`+ res.data.list[i].nickName + `</div>
                            <div class="content">`+ res.data.list[i].cContent + `</div>
                        </div>
                        <div class="thumbupbox">
                            <div class="finger" status=`+ res.data.list[i].agreeStatus + ` cid=` + res.data.list[i].cId + `></div>
                            <div class="thumbupnumber">`+ res.data.list[i].agreeCount + `</div>
                        </div>
                        <div class="deletebox" uid=`+ res.data.list[i].cUid + `>
                            <div class="trashcan"></div>
                            <div class="delete">删除</div>
                        </div>
                    </div>`);
                    parent.append(a);
                }
                commentsThunmUpStatus();
            },
            error: function (err) {
                mescroll_commentsList.endErr();
            }
        });
    }, 1000)
}
function graphicList_downCallback() {
    setTimeout(() => {
        let parent = $("#graphicList .list");
        parent.empty();
        graphicPageNum = 1;
        $.ajax({
            type: "post",
            url: baseUrl + "/api/article",
            contentType: "application/json",
            data: JSON.stringify({
                pageNum: graphicPageNum,
                pageSize: graphicPageSize
            }),
            async: false,
            beforeSend: function (request) {
                // request.setRequestHeader("token", sessionStorage.getItem("token"));
            },
            success: function (res) {
                graphicTotalPage = res.data.pages;
                graphicCurrentPageSize = res.data.size;

                graphic_data = res.data.list;

                mescroll_graphicList.setPageNum(2);
                mescroll_graphicList.endByPage(graphicCurrentPageSize, graphicTotalPage);

                for (let i = 0; i < res.data.list.length; i++) {
                    let a = $(`<div class="item">
                    <div class="cover" data_id=`+ res.data.list[i].id + `><img src=` + res.data.list[i].image + ` alt=""></div>
                    <div class="description">` + res.data.list[i].title + `</div>
                    <div class="time">`+ res.data.list[i].updateDate + `</div>
                </div>`);
                    parent.append(a);
                }
                entrygraphicDetail();
            },
            error: function (err) {
                mescroll_graphicList.endErr();
            }
        });
    }, 1000);
}

//上拉加载的回调 page = {num:1, size:10}; num:当前页 默认从1开始, size:每页数据条数,默认10
function clockIn_upCallback() {
    setTimeout(() => {
        let parent = $("#clockInLists .main .lists");
        clockInPageNum += 1;
        $.ajax({
            type: "post",
            url: baseUrl + "/api/punch.auth/list",
            contentType: "application/json",
            data: JSON.stringify({
                pageNum: clockInPageNum,
                pageSize: clockInPageSize,
                "userId": sessionStorage.getItem("id")
            }),
            async: false,
            beforeSend: function (request) {
                request.setRequestHeader("token", sessionStorage.getItem("token"));
            },
            success: function (res) {
                clockInTotalPage = res.data.pages;
                clockInCurrentPageSize = res.data.size;

                mescroll_clockInList.hideUpScroll(true);
                mescroll_clockInList.endByPage(clockInCurrentPageSize, clockInTotalPage);

                for (let i = 0; i < res.data.list.length; i++) {
                    let a = $(`<div class="item">
                    <div class="cover">
                        <img src=`+ res.data.list[i].imageUrl + ` alt="">
                    </div>
                    <div class="description">`+ res.data.list[i].content + `</div>
                    <div class="bottom">
                        <div class="avatar">
                            <img src=`+ res.data.list[i].avatarUrl + ` alt="">
                        </div>
                        <div class="name">`+ res.data.list[i].nickName + `</div>
                        <div class="heat">
                            <span class="img" status=`+ res.data.list[i].agreeStatus + ` id=` + res.data.list[i].id + `></span>
                            <span class="num">`+ res.data.list[i].agree + `</span>
                        </div>
                    </div>
                </div>`);
                    parent.append(a);
                }

                clockInListsThunmUpStatus();
            },
            error: function (err) {
                mescroll_clockInList.endErr();
            }
        });
    }, 1000);
}
function commentsList_upCallback() {
    setTimeout(() => {
        let parent = $("#comments .listbox");
        commentsPageNum += 1;
        $.ajax({
            type: "post",
            url: baseUrl + "/api/comment.auth/list",
            contentType: "application/json",
            data: JSON.stringify({
                pageNum: commentsPageNum,
                pageSize: commentsPageSize,
                "userId": sessionStorage.getItem("id")
            }),
            async: false,
            beforeSend: function (request) {
                request.setRequestHeader("token", sessionStorage.getItem("token"));
            },
            success: function (res) {
                commentsTotalPage = res.data.pages;
                commentsCurrentPageSize = res.data.size;
                $("#comments .head .count").text(res.data.total);

                mescroll_commentsList.hideUpScroll(true);
                mescroll_commentsList.endByPage(commentsCurrentPageSize, commentsTotalPage);

                for (let i = 0; i < res.data.list.length; i++) {
                    let a = $(`<div class="every">
                        <div class="avatar"><img src=`+ res.data.list[i].avatarUrl + ` alt=""></div>
                        <div class="mainbox">
                            <div class="nickname">`+ res.data.list[i].nickName + `</div>
                            <div class="content">`+ res.data.list[i].cContent + `</div>
                        </div>
                        <div class="thumbupbox">
                            <div class="finger" status=`+ res.data.list[i].agreeStatus + ` cid=` + res.data.list[i].cId + `></div>
                            <div class="thumbupnumber">`+ res.data.list[i].agreeCount + `</div>
                        </div>
                        <div class="deletebox" uid=`+ res.data.list[i].cUid + `>
                            <div class="trashcan"></div>
                            <div class="delete">删除</div>
                        </div>
                    </div>`);
                    parent.append(a);
                }
                commentsThunmUpStatus();
            },
            error: function (err) {
                mescroll_commentsList.endErr();
            }
        });
    }, 1000)
}
function graphicList_upCallback() {
    setTimeout(() => {
        graphicPageNum += 1;
        $.ajax({
            type: "post",
            url: baseUrl + "/api/article",
            contentType: "application/json",
            data: JSON.stringify({
                pageNum: graphicPageNum,
                pageSize: graphicPageSize
            }),
            async: false,
            beforeSend: function (request) {
                // request.setRequestHeader("token", sessionStorage.getItem("token"));
            },
            success: function (res) {
                graphicTotalPage = res.data.pages;
                graphicCurrentPageSize = res.data.size;

                graphic_data = graphic_data.concat(res.data.list);

                mescroll_graphicList.hideUpScroll(true);
                mescroll_graphicList.endByPage(graphicCurrentPageSize, graphicTotalPage);
                // mescroll_graphicList.endSuccess(graphicCurrentPageSize, res.data.hasNextPage);

                let parent = $("#graphicList .list");
                for (let i = 0; i < res.data.list.length; i++) {
                    let a = $(`<div class="item">
                    <div class="cover" data_id=`+ res.data.list[i].id + `><img src=` + res.data.list[i].image + ` alt=""></div>
                    <div class="description">` + res.data.list[i].title + `</div>
                    <div class="time">`+ res.data.list[i].updateDate + `</div>
                </div>`);
                    parent.append(a);
                }
                entrygraphicDetail();
            },
            error: function (err) {
                mescroll_graphicList.endErr();
            }
        });
    }, 1000);

}