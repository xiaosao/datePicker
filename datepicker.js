;
(function (w) {

    class DatePicker {
        constructor(mountedEleSelector) {
            this.mountedEle = document.querySelector(mountedEleSelector);
            this.tmp = [];
            this.init();
            this.bindEvent()
        }
        each(arr, fn) {
            for (var i = 0, len = arr.length; i < len; i++) {
                if (fn(arr[i], i, arr)) {
                    break;
                }
            }
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
            console.log(thisMonth);

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
                    monthData.push({})
                    continue;
                } else if (date > thisMonthLastDate) {
                    showDate = date - thisMonthLastDate;
                    thisMonth += 1;
                    monthData.push({})
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
            var html = '<table>' +
                '<caption><span class="prev btn">&lt;</span>' + this.year + '-' + this.month + '-' + this.date + '<span class="next btn">&gt;</span></caption>' +
                '<tbody>',
                monthData = this.monthData;

            for (var i = 0; i < 6; i++) {
                if (i > 1 && !monthData[i * 7].showDate) {
                    break;
                }
                html += '<tr>'
                for (var j = 0; j < 7; j++) {
                    if (monthData[i * 7 + j].showDate) {
                        html += '<td>' + monthData[i * 7 + j].showDate + '</td>'
                    } else {
                        html += '<td>' + '</td>'
                    }
                }

                html += '</tr>';

            }
            html += '</tbody>' +
                '</table>';
            return html;
        }
        init(year, month, date) {

            this.showMonthData(year, month, date);
            var html = this.render();
            this.mountedEle.innerHTML = html;
        }
        bindEvent() {
            var self = this;
            this.mountedEle.addEventListener('click', function (e) {
                if (e.target.classList.contains('prev')) {
                    if (self.month - 1 <= 0) {
                        self.year -= 1;
                        self.month = 12;
                    } else {
                        self.month -= 1
                    }
                    self.init(self.year, self.month, 1);
                } else {
                    return;
                }
            }, false)
            this.mountedEle.addEventListener('click', function (e) {
                if (e.target.classList.contains('next')) {
                    if (self.month + 1 > 12) {
                        self.year += 1;
                        self.month = 0;
                    } else {
                        self.month += 1
                    }
                    self.init(self.year, self.month, 1);
                } else {
                    return;
                }
            }, false)
        }
    }


    w.DatePicker = DatePicker;
}(window))