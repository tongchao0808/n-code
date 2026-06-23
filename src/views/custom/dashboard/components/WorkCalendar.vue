<template>
  <div
    class="bg-white rounded-lg p-4 flex flex-col overflow-hidden min-h-0 shadow-[0_9px_28px_8px_rgba(108,118,155,0.05),0_5px_7px_0_rgba(65,114,209,0.08)]"
  >
    <div
      class="flex justify-between items-center p-[16px] -mx-4 -mt-4 border-b border-[#E5E6EB] shrink-0"
    >
      <span class="text-[24px] text-[#333333] font-bold">工作日历</span>
      <button
        @click="goToCalendar('create')"
        class="bg-[#3B7BFF] text-white px-4 py-1.5 rounded-[4px] text-sm flex items-center hover:bg-blue-600 transition-colors"
      >
        <i class="mr-1 el-icon-plus"></i> 新建日程
      </button>
    </div>

    <div
      class="flex flex-1 min-h-0 gap-6 pt-4 overflow-hidden"
      v-loading="calendarLoading"
    >
      <div
        class="w-[55%] flex flex-col h-full bg-gradient-to-b from-[#e1e9fd] to-[#fcfbfe] rounded-lg p-4 select-none shrink-0"
      >
        <div
          class="flex justify-between items-center mb-4 text-[15px] font-bold px-2 shrink-0"
        >
          <div class="flex gap-4 text-gray-400">
            <i
              @click="changeMonth(-12)"
              class="el-icon-d-arrow-left cursor-pointer hover:text-[#3B7BFF]"
            ></i>
            <i
              @click="changeMonth(-1)"
              class="el-icon-arrow-left cursor-pointer hover:text-[#3B7BFF]"
            ></i>
          </div>
          <span class="text-gray-800"
            >{{ currentYear }}年 {{ currentMonth }}月</span
          >
          <div class="flex gap-4 text-gray-400">
            <i
              @click="changeMonth(1)"
              class="el-icon-arrow-right cursor-pointer hover:text-[#3B7BFF]"
            ></i>
            <i
              @click="changeMonth(12)"
              class="el-icon-d-arrow-right cursor-pointer hover:text-[#3B7BFF]"
            ></i>
          </div>
        </div>

        <div
          class="grid grid-cols-7 text-center text-[15px] text-[#333333] font-bold mb-3 shrink-0"
        >
          <div>日</div>
          <div>一</div>
          <div>二</div>
          <div>三</div>
          <div>四</div>
          <div>五</div>
          <div>六</div>
        </div>

        <div
          class="grid content-start flex-1 grid-cols-7 justify-items-center gap-y-3"
        >
          <div
            v-for="(day, idx) in calendarDays"
            :key="idx"
            @click="selectDate(day)"
            class="relative w-[32px] h-[32px] rounded flex items-center justify-center text-[14px] font-bold cursor-pointer transition-colors"
            :class="[
              day.isSelected
                ? 'bg-[#3B7BFF] text-white shadow-sm'
                : 'hover:bg-gray-200',
              !day.isCurrentMonth ? 'opacity-30' : '',
            ]"
          >
            <span :class="{ 'calendar-gradient': !day.isSelected }">
              {{ day.text }}
            </span>
            <span
              v-if="day.hasEvent && !day.isSelected"
              class="absolute bottom-0.5 w-1 h-1 rounded-full bg-[#3B7BFF]"
            ></span>
          </div>
        </div>
      </div>

      <div class="w-[45%] flex flex-col overflow-hidden">
        <div class="text-[16px] font-bold text-[#333333] mb-4 shrink-0">
          {{ selectedDateStr }}
        </div>

        <div class="flex-1 h-0 pb-2 pr-2 overflow-y-auto custom-scrollbar">
          <div
            v-if="selectedDayEvents.length === 0"
            class="text-gray-400 text-[13px] pt-4 text-center"
          >
            今日暂无日程安排
          </div>

          <div
            v-for="(event, idx) in selectedDayEvents"
            :key="idx"
            @click="goToCalendar('view', event)"
            class="relative pl-[18px] border-l-[2px] border-gray-100 pb-5 ml-[5px] cursor-pointer group"
          >
            <span
              class="absolute left-[-5px] top-1 w-[8px] h-[8px] rounded-full transition-colors"
              :class="event.completed ? 'bg-gray-300' : 'bg-[#3B7BFF]'"
            ></span>

            <div class="text-[12px] text-gray-400 mb-1 leading-none pt-[2px]">
              {{
                event.allDay
                  ? "全天"
                  : event.startTime && event.endTime
                  ? `${event.startTime.slice(0, 5)} ~ ${event.endTime.slice(
                      0,
                      5
                    )}`
                  : "未设置时间"
              }}
            </div>

            <div
              class="rounded p-2.5 text-[13px] transition-colors"
              :class="[
                event.completed
                  ? 'bg-[#F7F8FA] text-gray-400 line-through'
                  : 'bg-[#EEF2FF] text-[#333333] group-hover:bg-[#E1E8FF]',
              ]"
            >
              {{ event.title }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { workCalendarRange } from "@/api/custom/work";

export default {
  name: "WorkCalendar",
  data() {
    return {
      calendarLoading: false,
      baseDate: new Date(),
      selectedDate: new Date(),
      monthEvents: [],
    };
  },
  computed: {
    currentYear() {
      return this.baseDate.getFullYear();
    },
    currentMonth() {
      return this.baseDate.getMonth() + 1;
    },
    selectedDateStr() {
      const y = this.selectedDate.getFullYear();
      const m = this.selectedDate.getMonth() + 1;
      const d = this.selectedDate.getDate();
      return `${y}年 ${m}月${d}日`;
    },
    calendarDays() {
      const year = this.baseDate.getFullYear();
      const month = this.baseDate.getMonth();
      const firstDayOfMonth = new Date(year, month, 1);
      const lastDayOfMonth = new Date(year, month + 1, 0);

      const startDayOfWeek = firstDayOfMonth.getDay();
      const daysInMonth = lastDayOfMonth.getDate();
      const prevMonthLastDay = new Date(year, month, 0).getDate();

      const days = [];

      // 上个月补全
      for (let i = startDayOfWeek - 1; i >= 0; i--) {
        const d = new Date(year, month - 1, prevMonthLastDay - i);
        days.push(this.createDayObject(d, false));
      }
      // 本月
      for (let i = 1; i <= daysInMonth; i++) {
        const d = new Date(year, month, i);
        days.push(this.createDayObject(d, true));
      }
      // 下个月补全，凑满 42 格
      const remaining = 42 - days.length;
      for (let i = 1; i <= remaining; i++) {
        const d = new Date(year, month + 1, i);
        days.push(this.createDayObject(d, false));
      }

      return days;
    },
    selectedDayEvents() {
      const targetDateStr = this.formatDateStr(this.selectedDate);
      return this.monthEvents
        .filter((e) => {
          return (
            targetDateStr >= e.startDate &&
            targetDateStr <= (e.endDate || e.startDate)
          );
        })
        .sort((a, b) => {
          if (a.allDay) return -1;
          if (b.allDay) return 1;
          return (a.startTime || "00:00:00").localeCompare(
            b.startTime || "00:00:00"
          );
        });
    },
  },
  created() {
    this.fetchCalendarData();
  },
  methods: {
    createDayObject(date, isCurrentMonth) {
      const dateStr = this.formatDateStr(date);
      const hasEvent = this.monthEvents.some((e) => {
        return dateStr >= e.startDate && dateStr <= (e.endDate || e.startDate);
      });

      return {
        date,
        text: String(date.getDate()).padStart(2, "0"),
        isCurrentMonth,
        isSelected: this.isSameDay(date, this.selectedDate),
        hasEvent,
      };
    },
    formatDateStr(date) {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      return `${y}-${m}-${d}`;
    },
    isSameDay(d1, d2) {
      return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
      );
    },
    changeMonth(offset) {
      const newDate = new Date(this.baseDate);
      newDate.setMonth(newDate.getMonth() + offset);
      this.baseDate = newDate;
      this.fetchCalendarData();
    },
    selectDate(dayObj) {
      this.selectedDate = dayObj.date;
      if (!dayObj.isCurrentMonth) {
        this.baseDate = new Date(
          dayObj.date.getFullYear(),
          dayObj.date.getMonth(),
          1
        );
        this.fetchCalendarData();
      }
    },
    async fetchCalendarData() {
      this.calendarLoading = true;
      try {
        const year = this.baseDate.getFullYear();
        const month = this.baseDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        // 扩展查询范围以覆盖前置和后置灰色日期
        const startDate = new Date(firstDay.getTime() - 7 * 24 * 3600 * 1000);
        const endDate = new Date(lastDay.getTime() + 7 * 24 * 3600 * 1000);

        const res = await workCalendarRange({
          startDate: this.formatDateStr(startDate),
          endDate: this.formatDateStr(endDate),
          includeTasks: true,
        });

        if (res.code === 200) {
          this.monthEvents = res.data || [];
        }
      } catch (error) {
        console.error("获取工作日历数据失败", error);
      } finally {
        this.calendarLoading = false;
      }
    },
    goToCalendar(action, event = null) {
      const query = { action };
      if (event && event.id) query.id = event.id;
      query.date = this.formatDateStr(this.selectedDate);

      this.$router.push({ path: "/sysManagement/sysCalendar", query });
    },
  },
};
</script>

<style scoped>
.calendar-gradient {
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 1) 0%,
    rgba(140, 140, 140, 1) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 4px;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background: #cbd5e1;
}
</style>
