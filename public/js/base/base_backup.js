/**
 *Charsert : utf-8
 *FileName: base.js
 *Desc:  公用函数
 *Version: 0.0.1
 *LastChange: none
 *History: none
 */
var fancy={
    version:'1.0',
    encoding:'utf-8',
    author:'guofan'
};
fancy.namespace=function(ns){
    if(!ns||!ns.length){
        return null;
    }
    var _pr=ns.split('.');
    var _nx=fancy;
    for(var i=0;i!=_pr.length;i++){
        _nx[_pr[i]]=_nx[_pr[i]]||{};
        _nx=_nx[_pr[i]];
    }
};
/*常用静态变量设置*/
fancy.namespace('G_ENV_VAR');
fancy.G_ENV_VAR = {
    BASEURL : './../',
    STATIC : './../public/',
    HOST : ['http://10.2.13.137/'],
    DIR : ['dir/dir/'],
    AJAXSUFFIX : '?_t=ajax',
    TIMEOUT : 0,//不设置超时
    ERRORMSG : {
        BUSYNETWORK:'服务器繁忙，请重试！' ,
        NODATA : '没有找到相关数据!'
    }
};
/*常用UI*/
fancy.namespace('ui');
fancy.ui = {
    //判断数组中是否存在某个元素
    inArray : function(arr, n) {
        for(var i=0; i < arr.length; i++) {
            if(arr[i]==n) return true
        }
        return false;
    },
    //fancy.ui.some(resultNumberArray,function(element, index) {return /\D/g.test(element);})
    /* 只有一个符合时放回true */
    some : function(array, callback, thisObject){
        if(array.some){
            return array.some(callback, thisObject);
        }else {
            for(var i = 0, len = array.length; i < len; i++){
                if(callback.call(thisObject, array[i], i, array))  return true;
            }
            return false;
        }
    },
    /* 全部符合时返回true */
    every : function(array, callback, thisObject){
        if(array.every){
            return array.every(callback, thisObject);
        }else {
            for(var i = 0, len = array.length; i < len; i++){
                if(!callback.call(thisObject, array[i], i, array))  return false;
            }
            return true;
        }
    },
    /* 选项卡切换 */
    tabClick : function(obj) {
        /* obj = {
         ul : Zepto('ul'),
         list : Zepto('.same_panle'),
         className : 'cur',
         once : true,//函数只执行一次
         callBack : [,],//回调函数
         defaultLi : 0//默认tab
         defaultCallBack : [,]
         }; */
        //初始化
        if(obj.once) {
            obj.ul.find('li').attr({
                'once' : 'on'
            });
        }else {
            obj.ul.find('li').attr({
                'once' : 'off'
            });
        }
        obj.ul.find('li').eq(obj.defaultLi).addClass(obj.className);
        obj.ul.find('li').eq(obj.defaultLi).siblings().removeClass(obj.className);
        obj.list.eq(obj.defaultLi).show().siblings().hide();
        obj.callBack[obj.defaultLi]();
        if(obj.ul.find('li').eq(obj.defaultLi).attr('once') == 'on') {
            obj.ul.find('li').eq(obj.defaultLi).attr({
                'once' : 'off'
            });
        }

        //绑定事件
        obj.ul.find('li').on('tap',function() {
            var liIndex = Zepto(this).index();
            obj.defaultCallBack[liIndex]();
            if(!obj.once) {
                obj.callBack[liIndex]();
            }else {
                if(Zepto(this).attr('once') == 'on') {
                    obj.callBack[liIndex]();
                    Zepto(this).attr('once','off')
                }
            }

            Zepto(this).addClass(obj.className);
            Zepto(this).siblings().removeClass(obj.className);
            obj.list.eq(liIndex).show().siblings().hide();
        });
    },
    unique: function(elems) {
        for (var i = 0; i < elems.length; ++i) {
            for (var j = i + 1; j < elems.length; ++j) {
                if (elems[i] === elems[j]) {
                    elems.splice(i--, 1);
                    break;
                }
            }
        }
        return elems;
    },
    //获取queryString
    getQueryString : function(url, name) { //获取url中"?"符后的字串
        var urlString = url;
        if(urlString != null) {
            var typeQu = name+"=";
            var urlEnd = urlString.indexOf(typeQu);
            if(urlEnd != -1) {
                var paramsUrl = urlString.substring(urlEnd+typeQu.length);
                var isEnd =  paramsUrl.indexOf('&');
                if(isEnd != -1) {
                    return paramsUrl.substring(0, isEnd);
                }else{
                    return paramsUrl;
                }
            }else {
                return null;
            }
        } else{
            return null;
        }
    },
    /* 对象转url */
    objToString : function(obj) {
        var keyAndValueArray = [];
        Zepto.each(obj, function(i,v) {
            keyAndValueArray.push(i + '=' + v);
        });
        return keyAndValueArray.join('&');
    },
    formAutoSubmit : function(obj) {
        /* obj = {
         dataList : {},
         action : '',
         target : '',
         method : ''
         }; */
        var form = document.createElement("form");
        if(obj.dataList) {
            for(var i in obj.dataList) {
                var element;
                element =  document.createElement("input");
                element.name = i;
                element.type = 'hidden';
                element.value = obj.dataList[i];
                form.appendChild(element);
            }
        }

        form.target = obj.target || '_self',
            form.method = obj.method || 'post',
            form.action = obj.action;
        form.submit();
    },
    /**
     * 时间戳格式化函数
     * @param  {int}    timestamp 要格式化的时间戳
     * @param  {string} format    格式
     * @return {string}           格式化的时间字符串
     */
    timestampToDate : function(timestamp, format) {
        var _date, _year, _month, _day, _hour, _minute, _second;
        _date = new Date(timestamp);
        _year = _date.getFullYear();
        _month = (_date.getMonth() + 1 < 10) ? ('0' + (_date.getMonth() + 1)) : (_date.getMonth() + 1);
        _day = (_date.getDate() < 10) ? ('0' + _date.getDate()) : (_date.getDate());
        _hour = (_date.getHours() < 10) ? ('0' + _date.getHours()) : (_date.getHours());
        _minute = (_date.getMinutes() < 10) ? ('0' + _date.getMinutes()) : (_date.getMinutes());
        _second = (_date.getSeconds() < 10) ? ('0' + _date.getSeconds()) : (_date.getSeconds());
        if (format == 'Y-m-d h:m:s') {
            return (_year + '-' + _month + '-' + _day + ' ' + _hour + ':' + _minute + ':' + _second);
        } else if (format == 'Y-m-d') {
            return (_year + '-' + _month + '-' + _day);
        } else if (format == 'm-d') {
            return (_month + '-' + _day);
        } else if (format == 'm-d h:m:s') {
            return (_month + '-' + _day + ' ' + _hour + ':' + _minute + ':' + _second);
        } else if (format == 'm-d h:m') {
            return (_month + '-' + _day + ' ' + _hour + ':' + _minute);
        } else if(format == 'h:m:s'){
            return ( _hour + ':' + _minute + ':' + _second);
        } else if(format == 'Y-m-d h:m'){
            return (_year + '-' + _month + '-' + _day + ' ' + _hour + ':' + _minute);
        }
        else {
            return 0;
        }
    },
    /*比较时间大小*/
    compareDate : function(startDate,endDate){
        var date1 = Number(startDate.replace(/[\-:\s]/g, ""));
        var date2 = Number(endDate.replace(/[\-:\s]/g, ""));
        return date2-date1;
    },
    /*金额格式化*/
    /**
     * @param  {string} s 要格式化的金额
     * @param  {number} n    保留小数位
     * @return {string}    格式化的金额
     */
    moneyFormat : function(s, n) {
        n = n > 0 && n <= 20 ? n : 2;
        s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
        var l = s.split(".")[0].split("").reverse(),
            r = s.split(".")[1];
        t = "";
        for(i = 0; i < l.length; i ++ ){
            t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
        }
        return t.split("").reverse().join("") + "." + r;
    }
};
/*常用验证*/
fancy.namespace('valid');
fancy.valid={
    comonReg : {
        email : /^([a-zA-Z0-9]+[_|\_|\.|-]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,
        number : /^\d+$/,
        phone : /^0{0,1}(13[^4]|15[^4]|14[57]|17[0-9]|18[0-9])[0-9]{8}$|134[0-8][0-9]{7}$/,
        code :  /^[0-9]{4}$/,
        pass :/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/,
        verify : /^[0-9]{6}$/,
        name : /^[\u4E00-\u9FA5]{2,5}$/,
        identify : /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/,
        bankCard : /^[0-9]{16,21}$/,
        question : /^[A-Za-z0-9\u4e00-\u9fa5]{1,16}$/,
        cvvCode : /^[0-9]{3,4}$/,
        validTime : /^[1-9]\d{3}((0\d)|(1[0-2]))$/,
        safe : /[~#$￥ˇ<>（）\s\?\*\&\\\|\/\[\]\{\}\\^%]/,
    },
    check : function(val, reg) {
        return this.comonReg[reg].test(val);
    }
};
/*loading和mask效果*/
fancy.namespace('load');
fancy.load={
    buildHtml : function(obj) {
       /* obj = {
            opacity : 0.5,
            isLoad : true,
            maskColor : '#fff'
        };*/
        var temp = [];
        temp.push('<div class="mask-layer" style="z-index:'+obj.zIndex+'">');
        temp.push('<div class="mask-op" style="background:'+ obj.maskColor + ';opacity:' + obj.opacity + '"></div>');
        if(obj.isLoad) {
            temp.push('<div class="load">');
            temp.push('<img  width="24" height="24" src="'+fancy.G_ENV_VAR.STATIC+'images/load.gif" />');
            temp.push('</div>');
        }
        temp.push('</div>');
        temp = temp.join('');
        return temp;
    },
    createLoad  : function(obj) {
        var that = this;
        var opt = {
            opacity : 0.5,
            isLoad : true,
            maskColor : '#fff',
            zIndex : '999'
        };
        opt = Zepto.extend(true, opt, obj || {});
        Zepto('body').append(that.buildHtml(opt));
    },
    closeLoad : function() {
        Zepto('.mask-layer').remove();
    }
};
/*下单公用方法*/
fancy.namespace('AJAX');
fancy.AJAX = function(obj) {
    //非跨域请求
    /* obj = {
     urlType : 0,//url种类
     type : 'POST'
     url : '',
     data : '',
     dataType : 'json',
     beforeFn : function() {},
     successFn : function() {},
     ssuccessEx : function() {},
     errorFn : function() {},
     isLoad : false,
     }; */
    //跨域请求jsonp，设置type : "get",dataType:"jsonp",
    Zepto.ajax({
        url : fancy.G_ENV_VAR.HOST[obj.urlType] + fancy.G_ENV_VAR.DIR[obj.urlType] + obj.url,
        type : 'POST',
        timeout : fancy.G_ENV_VAR.TIMEOUT,
        async : true,
        dataType : obj.dataType || 'json',
        data : obj.data,
        beforeSend : function() {
            if(obj.isLoad) {
                fancy.load.createLoad();
            }
            obj.beforeFn && obj.beforeFn();
        },
        success : function(data) {
            if(data.code == 0) {
                //成功回调函数
                obj.successFn && obj.successFn(data);
            }else {
                //其他成功状态
                if(obj.isLoad) {
                    fancy.load.closeLoad();
                }
                fancy.Box.showMsg(data.msg);
                obj.ssuccessEx && obj.ssuccessEx();
            }
        },
        error : function() {
            if(obj.isLoad) {
                fancy.load.closeLoad();
            }
            fancy.Box.showMsg(fancy.G_ENV_VAR.ERRORMSG.BUSYNETWORK);
            obj.errorEx && obj.errorEx()
        }
    });
};
//弹出层
fancy.namespace('Box');
fancy.Box = {
    buildHtml : function(opt) {
        var html = [];
        html.push('<div class="g-box" id='+opt.id+'>');
        html.push('<div class="g-box-inner">');
        html.push('<div class="g-box-main">');
        html.push('<div class="g-box-h clearfix">');
        html.push('<p class="f-l">'+opt.title+'</p>');
        html.push('<a href="javascript:;" class="f-r J-close">X</a>');
        html.push('</div>');

        html.push('<div class="g-box-content">');
        html.push(opt.content);
        html.push('</div>');

        if(opt.isSure || opt.isCancle) {
            html.push('<div class="g-box-btn">');
            html.push('<p class="g-box-btn-control p-b10 ta-c">');
            if(opt.isSure) {
                html.push('<input type="button" value="确定" class="btn-small btn-deep-blue c-wt J-sure"/>');
            }
            html.push('&nbsp;&nbsp;');
            if(opt.isCancle) {
                html.push('<input type="button" value="取消" class="btn-small btn-navy J-cancle"/>');
            }
            html.push('</p>');
            html.push('</div>');
        }

        html.push('</div>');
        html.push('</div>');
        html.push('</div>');
        return html.join('');
    },
    setCenter : function(sle) {
        var obj = Zepto(sle)[0],ocw = obj.offsetWidth,och = obj.offsetHeight,bsl = document.documentElement.scrollLeft || document.body.scrollLeft,bst = document.documentElement.scrollTop || document.body.scrollTop,bcw = document.documentElement.clientWidth || document.body.clientWidth,bch = document.documentElement.clientHeight || document.body.clientHeight;
        obj.style.position = 'fixed';
        obj.style.left = (bcw - ocw) < 0 ? '0px' : Math.floor((bcw - ocw) / 2) + 'px';
        obj.style.top = (bch - och) < 0 ? '0px' : Math.floor(( bch - och) / 2) + 'px';
        window.onresize = window.onscroll = function() {
            fancy.Box.setCenter(obj);
        };
    },
    showBox : function(opt) {
        var defaultOpt = {
            title : '标题',
            content : '<p>内容区域</p>',
            sureBtnTxt : '确定',
            cancleBtnTxt : '取消',
            transitionType : 'none',
            zIndex : '9999',
            id : 'layerBox',
            isSure : true,
            isCancle : true,
            isSureCloseBox : true,//点确定是否关闭弹出层
            autoClose : true,//是否有自动关闭功能
            autoCount : 3,//倒计时时间
            sureFn : function() {
            },
            cancleFn : function() {
            },
            shutFn : function() {
            },
            autoCloseFn : function() {

            }
        };
        opt = Zepto.extend(true, defaultOpt, opt || {});
        Zepto('body').append(fancy.Box.buildHtml(opt));
        fancy.load.createLoad({
            isLoad : false
        });
        fancy.Box.setCenter('.g-box');
        var target = Zepto('#' + opt.id);
        target.css('zIndex',opt.zIndex);
        //设置动画效果
        if(opt.transitionType != 'none') {
            target.css('visibility','hidden');
            target.addClass('animated ' + opt.transitionType);
        }
        target.find('.J-close').on('click', function() {
            opt.shutFn && opt.shutFn();
            target.remove();
            fancy.load.closeLoad();
            if(timer) {
                clearInterval(timer);
            }
        })
        if(target.find('.J-sure').size() > 0) {
            target.find('.J-sure').on('click', function() {
                opt.sureFn && opt.sureFn();
                if(opt.isSureCloseBox) {
                    target.remove();
                    fancy.load.closeLoad();
                    if(timer) {
                        clearInterval(timer);
                    }
                }
            })
        }
        if(target.find('.J-cancle').size() > 0) {
            target.find('.J-cancle').on('click', function() {
                opt.cancleFn && opt.cancleFn();
                target.remove();
                fancy.load.closeLoad();
                if(timer) {
                    clearInterval(timer);
                }
            })
        }
        //自动关闭功能
        if(opt.autoClose) {
            var timer = window.setInterval(function() {
                opt.autoCount--;
                if(opt.autoCount == 1) {
                    clearInterval(timer);
                    target.remove();
                    fancy.load.closeLoad();
                    opt.autoCloseFn && opt.autoCloseFn();
                }
            },1000);
        }
    },
    showMsg : function(str, time) {
        fancy.Box.showBox({
            title : '提示',
            isSure : false,
            isCancle : false,
            autoCount : time || 3,
            transitionType : 'zoomInDown',
            content : '<p class="p-a10">'+ str +'</p>'
        })
    },
    alert : function(msg, sureFn) {
        fancy.Box.showBox({
            title : '提示',
            content : '<p class="msg">'+msg+'</p>',
            sureBtnTxt : '确定',
            transitionType : 'zoomInDown',
            autoClose : false,//是否有自动关闭功能
            isCancle : false,
            sureFn : function() {
                sureFn && sureFn();
            }
        });
    },
    confirm : function(msg,sureFn,cancleFn) {
        fancy.Box.showBox({
            title : '提示',
            content : '<p class="msg">'+msg+'</p>',
            sureBtnTxt : '确定',
            cancleBtnTxt : '取消',
            isSure : true,
            isCancle : true,
            transitionType : 'zoomInDown',
            autoClose : false,//是否有自动关闭功能
            sureFn : function() {
                sureFn && sureFn();
            },
            cancleFn : function() {
                cancleFn && cancleFn();
            }
        });
    }
};
/*Scroller*/
/**
 * @usage
 * fancy.Select.init({
        target : Zepto('#fancy'),
        data : cityData,
        level : 3//下拉层级，分为3个等级1-2-3，与上面的data对应
    });
 */
fancy.namespace('Scroller');
fancy.Scroller = {
    setWidth : function(ulTarget) {
        var liArray = ulTarget.find('li');
        var li_len = liArray.length;
        var ul_width = 0;
        Zepto.each(liArray, function(index, item) {
            ul_width += Zepto(this).width();
        });

        ulTarget.width(ul_width);
    },
    setHeight : function(ulTarget) {
        var liArray = ulTarget.find('li');
        var li_len = liArray.length;
        var ul_Height = 0;
        Zepto.each(liArray, function(index, item) {
            console.log(Zepto(this).height());
            ul_Height += Zepto(this).height();
        });

        ulTarget.height(ul_Height);
    },
    init : function(opt) {
        var defaultOpt = {
            target: '#wrapper',
            pram: {
                momentum: true,
                snap: false,
                hScrollbar: false,
                vScrollbar: false,
                scrollX: true,//水平滚动
                scrollY: false,//上下滚动
                mouseWheel: true//支持鼠标滚动
            }
        };
        opt = Zepto.extend(true, defaultOpt, opt || {});
        if(opt.pram.scrollX) {
            fancy.Scroller.setWidth(Zepto(opt.target).find('ul'));
        }
        if(opt.pram.scrollY) {
            fancy.Scroller.setHeight(Zepto(opt.target).find('ul'));
        }
        var myScroll = new IScroll(opt.target, opt.pram);
    }
};
/*select*/
/**
 * @usage
 * fancy.Select.init({
        target : Zepto('#fancy'),
        data : cityData,
        level : 3//下拉层级，分为3个等级1-2-3，与上面的data对应
    });
 */
fancy.namespace('Select');
fancy.Select = {
    //变量定义
    extraLen : 30,
    level1_index : 0,
    level2_index : 0,
    empty : [{ "n": '...'}],
    mySrollArr : [],//存放iscroll实例对象
    symbol : '-',//连接符
    buildPanel : function(data, level, isWraper, extraLen) {
        var tpl = [];
        var extraLen = extraLen || 0;
        for(var i = 0; i < level; i++) {
            if(isWraper) {
                tpl.push('<div class="select-content sub-level-'+ i +'">');
                tpl.push('<ul>');
            }
            tpl.push('<li></li><li></li>');
            switch(i) {
                case 0:
                    Zepto.each(data, function(index, item) {
                        if(index == 0) {
                            tpl.push('<li class="selected" data-v="' + item.n +'">'+ item.n +'</li>');
                        }else {
                            tpl.push('<li data-v="' + item.n +'">'+ item.n +'</li>');
                        }

                    });
                    break;
                case 1:
                    Zepto.each(data[0].s, function(index, item) {
                        if(index == 0) {
                            tpl.push('<li class="selected" data-v="' + item.n +'">'+ item.n +'</li>');
                        }else {
                            tpl.push('<li data-v="' + item.n +'">'+ item.n +'</li>');
                        }
                    });
                    for(var j = 0; j < extraLen; j++) {
                        tpl.push('<li></li>');
                    }
                    break;
                case 2:
                    Zepto.each(data[0].s, function(index, item) {
                        if(item.s) {
                            Zepto.each(item.s, function(k, t) {
                                if(k == 0) {
                                    tpl.push('<li  class="selected" data-v="' + t.n +'">'+ t.n +'</li>');
                                }else {
                                    tpl.push('<li data-v="' + t.n +'">'+ t.n +'</li>');
                                }

                            });
                        }else {
                            if(index == 0) {
                                tpl.push('<li class="selected" data-v="">...</li>');
                            }
                        }
                    });
                    for(var j = 0; j < extraLen; j++) {
                        tpl.push('<li></li>');
                    }
                    break;
            }

            tpl.push('<li></li><li></li>');
            if(isWraper) {
                tpl.push('</ul>');
                tpl.push('</div>');
            }

        }
        return tpl.join('');
    },
    renderHtml : function(data, level, extraLen) {
        var prefix = 'select-level-';
        var className = prefix + level;
        var tpl = [];
        tpl.push('<div class="u-full-width select-box">');
            tpl.push('<div class="select-panel">');
                tpl.push('<h5 class="select-title">请选择</h5>');
                tpl.push('<div class="select-body '+ className+ '">');
                //TODO buildPanel
                    tpl.push(fancy.Select.buildPanel(data, level, true, extraLen));
                    tpl.push('<div class="select-line"></div>');
                 tpl.push('</div>');
                 tpl.push('<div class="select-confirm">');
                    tpl.push('<a class="select-sure" href="javascript:;">确定</a>');
                    tpl.push('<a class="select-cancle" href="javascript:;">取消</a>');
                 tpl.push('</div>');
             tpl.push('</div>');
        tpl.push('</div>');
        Zepto('body').append(tpl.join(''));
    },
    scrollHandle : {
        updateSelected : function(container, iscroll){
            var current = container.find('li').eq(fancy.Select.scrollHandle.getCurrentSelect(container, iscroll));
            current.addClass('selected').siblings().removeClass('selected');
        },
        getCurrentSelect : function(container, iscroll) {
            var itemHeight = container.find('li').height();
            var index = (-iscroll.y) / itemHeight + 2;
           return index;
        },
        hidePanel : function() {
            Zepto('.select-box').remove();
            fancy.load.closeLoad();
        },
        showPanel : function() {
            fancy.load.createLoad({
                isLoad : false,
                opacity : 0.2,
                maskColor : '#000'
            });
            Zepto('.select-box').addClass('show');
        },
        sureChoose : function(target) {
            Zepto('.select-sure').on('click', function() {
                var selectTarget = Zepto('.select-body').find('.selected');
                if(selectTarget.size() > 0) {
                    var val = [];
                    Zepto.each(selectTarget, function(index, item) {
                        var curVal = Zepto(this).data('v');
                        if(curVal !== '...') {
                            console.log(curVal);
                            val.push(curVal);
                        }
                    });
                    target.val(val.join(fancy.Select.symbol));
                }
                fancy.Select.scrollHandle.hidePanel();
            });
        },
        cancleChoose : function() {
            Zepto('.select-cancle').on('click', function() {
                fancy.Select.scrollHandle.hidePanel();
            });
        },
        //联动切换
        switchArea : function(scrollObj, data) {
            var panelTarget = scrollObj.wrapper;
            console.log(panelTarget);
            if(Zepto(panelTarget).hasClass('sub-level-0')) {
                if(Zepto('.sub-level-1').size() > 0) {
                    fancy.Select.level1_index = fancy.Select.scrollHandle.getCurrentSelect(Zepto(scrollObj.wrapper),scrollObj) - 2;
                    Zepto('.sub-level-1 ul').html(fancy.Select.buildPanel(data[fancy.Select.level1_index].s, 1, false));
                    fancy.Select.mySrollArr[1].scrollToElement(Zepto(scrollObj.wrapper).find('li').get(0));
                }

                if(Zepto('.sub-level-2').size() > 0) {
                    Zepto('.sub-level-2 ul').html(fancy.Select.buildPanel(fancy.Select.empty, 1, false));
                    fancy.Select.mySrollArr[2].scrollToElement(Zepto('.sub-level-2').find('li').get(0));
                }

            }else if(Zepto(panelTarget).hasClass('sub-level-1')) {
                if(Zepto('.sub-level-2').size() > 0) {
                    fancy.Select.level2_index = fancy.Select.scrollHandle.getCurrentSelect(Zepto(scrollObj.wrapper),scrollObj) - 2;
                }
                if(data[fancy.Select.level1_index].s[fancy.Select.level2_index] && data[fancy.Select.level1_index].s[fancy.Select.level2_index].s) {
                    Zepto('.sub-level-2 ul').html(fancy.Select.buildPanel(data[fancy.Select.level1_index].s[fancy.Select.level2_index].s, 1, false));
                }else {
                    Zepto('.sub-level-2 ul').html(fancy.Select.buildPanel(fancy.Select.empty, 1, false));
                }
                if(Zepto('.sub-level-2').size() > 0) {
                    fancy.Select.mySrollArr[2].scrollToElement(Zepto(scrollObj.wrapper).find('li').get(0));
                }
            }
        },
        trigger : function(target, level, data) {
            for(var i = 0; i < level; i++) {
                //闭包
                (function(i) {
                    fancy.Select.mySrollArr[i] = new IScroll('.sub-level-' + i ,{
                        snap : 'li',
                        probeType : 2,
                        tap : true
                    });
                    fancy.Select.mySrollArr[i].on('scroll', function(){
                        fancy.Select.scrollHandle.updateSelected(Zepto(this.wrapper),this);
                        fancy.Select.scrollHandle.switchArea(this, data);
                    });
                    fancy.Select.mySrollArr[i].on('scrollEnd', function(){
                        fancy.Select.scrollHandle.updateSelected(Zepto(this.wrapper),this);
                        fancy.Select.scrollHandle.switchArea(this, data);
                    });
                })(i)
            }
            fancy.Select.scrollHandle.showPanel();
            fancy.Select.scrollHandle.sureChoose(target);
            fancy.Select.scrollHandle.cancleChoose();
        }
    },
    init : function(obj) {
        obj.target.on('click', function() {
            fancy.Select.renderHtml(obj.data, obj.level, obj.extraLen);
            fancy.Select.scrollHandle.trigger(obj.target, obj.level, obj.data);
        });
    }
};
