/**
 * +----------------------------------------------------------------------
 * 有Bug请及时反馈给作者
 * +----------------------------------------------------------------------
 * 创建日期：2017年11月1日
 * +----------------------------------------------------------------------
 * https：//github.com/ALNY-AC
 * +----------------------------------------------------------------------
 * weixin：AJS0314
 * +----------------------------------------------------------------------
 * qq：1173197065
 * +----------------------------------------------------------------------
 * app数据构建类，在这里构建数据对象
 * @author 代马狮
 * 
 */

var dateBuilder = function() {

    /**
     * app模板class
     * */
    var VueAppClass = function(prop) {

        //路由，从控制器开始
        this.url = prop.ur;
        //数据请求类型
        this.type = prop.type;
        //需要当做参数的数据
        this.data = prop.data;
        //当数据正确的时候执行的函数
        this.successFun = prop.successFun;
        //当数据错误的时候执行的函数
        this.errorFun = prop.errorFun;
        //vueApp
        this.app = new Vue({
            el: prop.el,
            data: {
                //这样才可以动态的添加元素，所以必须设置body
                body: {}
            }
        });
        //fun，update获得数据后的回调函数，不可以被重写，不可以被覆盖
        this.fun = function(result) {

            if(result['result'] === 'error') {
                //数据除出错
                if(this.errorFun != null) {
                    this.errorFun(result['message']);
                }

            }

            if(result['result'] === 'success') {
                //数据正确s
                /**
                 * 
                 * 默认是将Vueapp的item替换，
                 * 如果需要自己定逻辑，
                 * 需要传入successFun，
                 * 这样就不会调用默认方法
                 * 
                 * */
                if(this.successFun != null) {
                    this.successFun(result['message']);
                } else {

                    Vue.set(this.app.body, list, result['message']);

                }

            }

        }
        //通过调用对象的update函数，来从服务器请求数据，基本上请求数据的逻辑都在这里重写
        this.update = function() {

            //调用数据构建方法，并返回数据
            dateBuilderBody.dataHandle(this);

        }

    };

    /**
     * 
     * 获得vueApp的工厂函数
     * 一次获得一个
     * 
     * */
    var vueAppFactory = function(map) {
        /*
        //路由，从控制器开始
        this.url = prop.ur;
        //数据请求类型
        this.type = prop.type;
        //需要当做参数的数据，这个可以直接定义，也可以在下次请求数据前定义，比如搜索时候需要重新定义关键字
        this.data = prop.data;
        //当数据正确的时候执行的函数
        this.successFun = prop.successFun;
        //当数据错误的时候执行的函数
        this.errorFun = prop.errorFun;
        //fun，update获得数据后的回调函数，不可以被重写，不可以被覆盖
        this.fun
        */
        var app = new dateBuilderBody.VueAppClass(map);

        return app;
    }

    var dateBuilderBody = {

        http: 'http://127.0.0.1/index.php/',
        /**
         * 
         * 初始化函数
         *  @param 传递进来app的列表，方便初始化
         * 
         * */
        init: function(dateListName, dataList) {

            if(dateListName != null && typeof(dateListName) == 'object') {
                //如果有
                for(var x in dateListName) {

                    dataList[x] = this.vueAppFactory(dateListName[x]);

                }

            } else {
                l('没传入dateListName');
            }

        },
        /**
         * 
         * vueApp模板
         * 
         * */
        'VueAppClass': VueAppClass,
        /**
         * 
         * vueAppFactory工厂
         * 
         * */
        'vueAppFactory': vueAppFactory,
        /**
         * 
         * 数据ajax处理函数
         * 
         * */
        dataHandle: function(map) {
            //url: url,路由地址，最前面不需要有反斜杠/
            //type: type,请求类别
            //data: data,请求数据
            //fun: fun回调函数
            var data = map.data == null ? {} : map.data
            var url = dateBuilderBody.http + map.url;

            if(map.type === 'get') {

                $.get(url, data, function(result) {
                    //转换result
                    result = JSON.parse(result);
                    //调用回调函数
                    map.fun(result);

                });

            }
            if(map.type === 'post') {

                $.post(url, data, function(result) {
                    //转换result
                    result = JSON.parse(result);
                    //调用回调函数
                    map.fun(result);

                });

            }

        }

    }

    return dateBuilderBody;
}();