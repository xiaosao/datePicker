;
(function (w) {
    /**
     * 1.增加文本框显示选择的日期,暴露方法供使用者获取时间
     * 2.增加多选按钮，选中后可选择多个日期
     * 3.在每次显示时间前后提供钩子函数
     * 4.提供方法禁用日期面板的弹出
     */
    class DatePicker {
        constructor(mountedEleSelector) {
            this.mountedEle = document.querySelector(mountedEleSelector);
            // 缓存数据
            this.tmp = [];
            this.initRender()
            this.init();
            this.bindEvent()
        }
        init(year, month, date) {

            this.showMonthData(year, month, date);
            var html = this.render();
            document.querySelector('.date-picker-datepanel').innerHTML = html;
        }
        initRender() {
            var html = '<div class="date-picker">' +
                            '<input type="text" class="date-picker-input">' +
                            '<div class="date-picker-showpanel">'+
                                '<div class="date-picker-controll">' +
                                    '<div>'+
                                        '<span class="date-picker-prev btn">&lt;</span>' +
                                        '<span class="date-picker-date">' + this.year + '-' + this.month + '-' + this.date + '</span>' +
                                        '<span class="date-picker-next btn">&gt;</span>' +
                                    '</div>'+
                                    '<div>'+
                                        '<label class="date-picker-label" for="selectmore">选择多个</label>'+
                                        '<input type="radio" id="selectmore" class="date-picker-selectmore" name="select" value="1">'+
                                        '<input type="radio" id="selectmore" class="date-picker-selectmore" name="select" value="0">'+
                                    '</div>'+
                                '</div>' +
                                '<div class="date-picker-datepanel"></div>'+
                            '</div>'+
                    '</div>';
            this.mountedEle.innerHTML = html;
        }
        showMonthData(year, month, date) {
            /**
             * 根据今天的日期得出当前月份
             * 计算当前月份的第一天，并得出星期几，用于计算上个月应该有多少天应显示
             * 计算当前月份的最后一天，并得出星期几，用于计算下个月应该有多少天应显示
             * 注意我们说7月，new Date时应该传6
             * new Date时星期天应传0
             */
            // if (this.tmp[month]) {
            //     return thisMonth.tmp[month]
            // }

            var date, showDate, today,
                thisMonth, thisYear, thisMonthfirstDay, thisMonthfirstDate, thisMonthLastDate,
                lastMonthLastDay, lastMonthLeftDay,
                monthData = [];
            if (!year || !month || !date) {
                // 今天的日期
                today = new Date()
            } else {
                today = new Date(year, month - 1, date)
            }

            // 当前月份
            thisMonth = today.getMonth() + 1;

            // 当前年份
            thisYear = today.getFullYear();


            this.year = thisYear;
            this.month = thisMonth;
            this.date = today.getDate();

            // 当前月份第一天
            thisMonthfirstDate = new Date(thisYear, thisMonth - 1, 1);
            // 当前月份第一天星期几
            thisMonthfirstDay = thisMonthfirstDate.getDay();
            // 修正返回0则是星期日
            if (thisMonthfirstDay === 0) thisMonthfirstDay = 7;
            // 当前月份最后一天        
            thisMonthLastDate = new Date(thisYear, thisMonth, 0).getDate()
            // 上个月应显示的天数
            lastMonthLeftDay = thisMonthfirstDay - 1
            // 上个月的最后一天
            lastMonthLastDay = new Date(thisYear, thisMonth - 1, 0).getDate()
            for (var i = 0; i < 42; i++) {
                date = i + 1 - lastMonthLeftDay;

                if (date <= 0) {
                    showDate = date + lastMonthLastDay;
                    thisMonth -= 1;
                    monthData.push({
                        prev: true,
                        date,
                        showDate,
                        thisMonth,
                        thisYear
                    })
                    continue;
                } else if (date > thisMonthLastDate) {
                    showDate = date - thisMonthLastDate;
                    thisMonth += 1;
                    monthData.push({
                        next: true,
                        date,
                        showDate,
                        thisMonth,
                        thisYear
                    })
                    continue;
                } else {
                    showDate = date;
                }

                monthData.push({
                    date,
                    showDate,
                    thisMonth,
                    thisYear
                })

            }
            this.monthData = monthData;
            this.tmp[thisMonth] = monthData;
        }
        render() {
            document.querySelector('.date-picker-date').innerHTML = this.year + '-' + this.month + '-' + this.date;

            var html = '<table><tbody>',
                monthData = this.monthData;

            for (var i = 0; i < 6; i++) {
                // if (i > 1 && !monthData[i * 7].showDate) {
                //     break;
                // }
                html += '<tr>'
                for (var j = 0; j < 7; j++) {
                    if (monthData[i * 7 + j].next || monthData[i * 7 + j].prev) {
                        html += '<td class="not-this-month"><span>' + monthData[i * 7 + j].showDate + '</span></td>'
                    } else {
                        html += '<td><span>' + monthData[i * 7 + j].showDate + '</span></td>'
                    }
                }

                html += '</tr>';

            }
            html += '</tbody>' +
                '</table>';
            return html;
        }
        bindEvent() {
            var self = this,
                mountedEle = this.mountedEle,
                util = new Util(),
                on = util.on;
            function $(selector){
                return document.querySelector(selector)
            }
            // 上一个月按钮
            on('.date-picker', 'click', 'date-picker-prev', function () {
                if (self.month - 1 <= 0) {
                    self.year -= 1;
                    self.month = 12;
                } else {
                    self.month -= 1
                }
                self.init(self.year, self.month, 1);
            });
            // 下一个月按钮
            on('.date-picker', 'click', 'date-picker-next', function () {
                if (self.month + 1 > 12) {
                    self.year += 1;
                    self.month = 0;
                } else {
                    self.month += 1
                }
                self.init(self.year, self.month, 1);
            });
            // 输入聚焦弹出
            on('.date-picker-input', 'focus', function () {
                $('.date-picker-showpanel').style.display = 'block';
            })
        }
    }
    // 工具对象
    class Util {
        each(arr, fn) {
            for (var i = 0, len = arr.length; i < len; i++) {
                if (fn(arr[i], i, arr)) {
                    break;
                }
            }
        }
        $(selector) {
            return document.querySelector(selector);
        }
        on(pSelector, type, cClass, fn) {
            function $(selector) {
                return document.querySelector(selector);
            }
            var pEle = $(pSelector);
            if (typeof cClass === 'string') {
                var cEle = pEle.querySelector('.' + cClass);
                pEle.addEventListener(type, function (e) {
                    if (e.target.classList.contains(cClass)) {
                        fn.call(cEle, e)
                    } else {
                        return;
                    }
                }, false);
            } else {
                fn = cClass;
                pEle.addEventListener(type, function (e) {
                    fn.call(pEle, e);
                })
            }
        }
    }

    w.DatePicker = DatePicker;
}(window));