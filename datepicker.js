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
            var util = this.util = new Util();
            this.mountedEle = util.$(mountedEleSelector);
            this.showDateData = [];
            this.init();
            this.bindEvent();

        }
        init(year, month, date) {
            this.initRender();
            this.renderShowDatePanel();
        }
        // 渲染主体面板
        initRender() {
            var html = '<div class="date-picker">' +
                '<input type="text" class="date-picker-input">' +
                '<div class="date-picker-showpanel">' +
                '<div class="date-picker-controll">' +
                '<div>' +
                '<span class="date-picker-prev btn">&lt;</span>' +
                '<span class="date-picker-now">' + this.year + '-' + this.month + '-' + this.date + '</span>' +
                '<span class="date-picker-next btn">&gt;</span>' +
                '</div>' +
                '<div class="date-picker-selectmore-row">' +
                '<label class="date-picker-label" for="selectmore">选择多个</label>' +
                '<span class="selectmore-text">是</span><input type="radio" id="selectmore" class="date-picker-selectmore" name="select" value="1">' +
                '<span class="selectmore-text">否</span><input type="radio" id="selectmore" class="date-picker-selectmore" name="select" value="0">' +
                '</div>' +
                '</div>' +
                '<div class="date-picker-datepanel"></div>' +
                '</div>' +
                '</div>';
            this.mountedEle.innerHTML = html;
        }
        // 计算日期数据
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
            // month均为修正后的月份
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
        }
        // 渲染日期展示面板
        renderShowDatePanel(year, month, date) {
            this.showMonthData(year, month, date);
            this.util.$('.date-picker-now').innerHTML = this.year + '-' + this.month + '-' + this.date;

            var html = '<table><tbody>',
                monthData = this.monthData;

            for (var i = 0; i < 6; i++) {
                html += '<tr>'
                for (var j = 0; j < 7; j++) {
                    if (monthData[i * 7 + j].next || monthData[i * 7 + j].prev) {
                        html += '<td class="not-this-month date-picker-date"><span class="date-picker-date">' + monthData[i * 7 + j].showDate + '</span></td>'
                    } else {
                        html += '<td class="date-picker-date"><span class="date-picker-date">' + monthData[i * 7 + j].showDate + '</span></td>'
                    }
                }
                html += '</tr>';
            }
            html += '</tbody>' +
                '</table>';
            this.util.$('.date-picker-datepanel').innerHTML = html;
        }
        // 绑定事件
        bindEvent() {
            var self = this,
                mountedEle = this.mountedEle,
                on = this.util.on,
                selectmoreTxt = '',
                $ = this.util.$,
                showDateData = self.showDateData;
            // 上一个月按钮
            on('.date-picker', 'click', 'date-picker-prev', function () {
                // 显示上一年
                if (self.month - 1 <= 0) {
                    self.year -= 1;
                    self.month = 12;
                } else {
                    self.month -= 1
                }
                self.renderShowDatePanel(self.year, self.month, 1);
            });
            // 下一个月按钮
            on('.date-picker', 'click', 'date-picker-next', function () {
                // 显示下一年
                if (self.month + 1 > 12) {
                    self.year += 1;
                    self.month = 1;
                } else {
                    self.month += 1
                }
                self.renderShowDatePanel(self.year, self.month, 1);
            });

            // 输入聚焦弹出
            on('.date-picker-input', 'focus', function () {
                $('.date-picker-showpanel').style.display = 'block';
            });

            // 面板选择日期
            on('.date-picker', 'click', 'date-picker-date', function () {
                var year = self.year,
                    month = self.month,
                    date = this.innerText ? this.innerText : this.firstChild.innerText;
                // this.selectedDate = {
                //     year,
                //     month,
                //     date
                // };
                var seletedTxt = year + '-' + month + '-' + date + '  ';
                if (self.selectmore) {
                    self.showDateData.push({
                        year,
                        month,
                        date
                    });
                    selectmoreTxt += seletedTxt;
                } else {
                    self.showDateData = [{
                        year,
                        month,
                        date
                    }];
                    selectmoreTxt = seletedTxt;
                }
                $('.date-picker-input').value = selectmoreTxt;
            });

            // 点击除了date-picker区域外的关闭日期面板
            on('.date-picker', 'click', function (e) {
                e.stopPropagation();
            })
            on(document, 'click', function (e) {
                $('.date-picker-showpanel').style.display = 'none';
            });

            // 单选框绑定事件
            on('.date-picker', 'change', 'date-picker-selectmore', function () {
                if (+this.value === 1) {
                    self.selectmore = true;
                } else {
                    self.selectmore = false;

                }
            })
        }
        showSelectedDate() {
            return this.showDateData;
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
        };
        $(selector) {
            return document.querySelector(selector);
        };
        // 用于绑定事件，可以进行事件委托
        on(pSelector, type, cClass, fn) {
            function $(selector) {
                return document.querySelector(selector);
            }
            var pEle = typeof pSelector === 'string' ? $(pSelector) : pSelector;
            if (typeof cClass === 'string') {
                var cEle = pEle.querySelector('.' + cClass);
                pEle.addEventListener(type, function (e) {
                    if (e.target.classList.contains(cClass)) {
                        fn.call(e.target, e)
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