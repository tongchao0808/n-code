<template>
  <div class="min-h-[calc(100vh-55px)] flex flex-col p-4 bg-[#EEF6FD]">
    <div
      class="bg-white rounded-lg p-4 flex flex-1 overflow-hidden shadow-[0_9px_28px_8px_rgba(108,118,155,0.05),0_5px_7px_0_rgba(65,114,209,0.08)]"
    >
      <div
        class="w-[30%] flex flex-col shrink-0 border-r border-gray-100 pr-5 mr-5"
      >
        <div class="flex gap-6 mb-6">
          <button
            @click="openDialog('SCHEDULE')"
            class="flex-1 bg-gradient-to-r from-[#FF9B44] to-[#F25113] h-[36px] rounded flex items-center justify-center text-white text-sm cursor-pointer border-none transition-transform active:scale-95"
          >
            <i class="mr-1 el-icon-document-add"></i> 创建日程
          </button>

          <button
            @click="openDialog('REMINDER')"
            class="flex-1 h-[36px] bg-gradient-to-r from-[#6a88f5] to-[#204def] rounded flex items-center justify-center text-white text-sm cursor-pointer border-none hover:bg-blue-600 transition-transform active:scale-95"
          >
            <i class="mr-1 el-icon-document-add"></i> 创建待办事项
          </button>
        </div>

        <div class="mb-8 select-none">
          <div
            class="flex items-center justify-between py-3 mb-4 text-sm font-bold border-t border-b border-gray-100"
          >
            <div class="flex gap-4 text-gray-400">
              <i
                class="el-icon-d-arrow-left cursor-pointer hover:text-[#3662FF] transition-colors"
                @click="changeYear(-1)"
              ></i>
              <i
                class="el-icon-arrow-left cursor-pointer hover:text-[#3662FF] transition-colors"
                @click="changeMonth(-1)"
              ></i>
            </div>
            <span class="text-gray-800">{{ miniYearMonth }}</span>
            <div class="flex gap-4 text-gray-400">
              <i
                class="el-icon-arrow-right cursor-pointer hover:text-[#3662FF] transition-colors"
                @click="changeMonth(1)"
              ></i>
              <i
                class="el-icon-d-arrow-right cursor-pointer hover:text-[#3662FF] transition-colors"
                @click="changeYear(1)"
              ></i>
            </div>
          </div>

          <div
            class="grid grid-cols-7 mb-3 text-sm font-bold text-center text-gray-800"
          >
            <div>日</div>
            <div>一</div>
            <div>二</div>
            <div>三</div>
            <div>四</div>
            <div>五</div>
            <div>六</div>
          </div>

          <div class="grid grid-cols-7 text-sm justify-items-center gap-y-4">
            <div
              v-for="(day, idx) in miniCalendarDays"
              :key="idx"
              @click="selectDate(day.date)"
              class="w-[32px] h-[32px] rounded-[4px] flex items-center justify-center cursor-pointer transition-all duration-200"
              :class="[
                day.isSelected
                  ? 'bg-[#3662FF] text-white font-bold shadow-md'
                  : 'hover:bg-blue-50',
                !day.isSelected && !day.isCurrentMonth ? 'text-gray-300' : '',
                !day.isSelected && day.isCurrentMonth
                  ? 'text-gray-700 font-medium'
                  : '',
              ]"
            >
              {{ day.displayText }}
            </div>
          </div>
        </div>

        <div
          class="flex flex-col gap-4 mt-auto mb-4 text-sm font-medium text-gray-600"
        >
          <div class="flex items-center gap-2">
            <span
              class="w-3 h-3 rounded-full border-[2px] border-[#FF9E00]"
            ></span
            >我的日程
          </div>
          <div class="flex items-center gap-2">
            <span
              class="w-3 h-3 rounded-full border-[2px] border-[#73D839] bg-green-50"
            ></span
            >系统待办事项
          </div>
          <div class="flex items-center gap-2">
            <span
              class="w-3 h-3 rounded-full border-[2px] border-[#3B7BFF] bg-blue-50"
            ></span
            >自建待办事项
          </div>
        </div>
      </div>

      <div
        class="relative flex flex-col flex-1 h-full overflow-hidden custom-calendar"
        v-loading="loading"
      >
        <div class="flex items-center justify-center gap-4 mb-4">
          <div
            @click="changeMonth(-1)"
            class="flex items-center justify-center w-8 h-8 text-gray-400 transition-colors border border-gray-200 rounded-full cursor-pointer hover:bg-gray-50"
          >
            <i class="el-icon-arrow-left"></i>
          </div>
          <div
            class="text-[18px] text-gray-800 font-medium w-[160px] text-center"
          >
            {{ formattedCurrentDate }}
          </div>
          <div
            @click="goToToday"
            class="px-3 py-1 bg-[#EEF2FF] text-[#3B7BFF] rounded text-sm cursor-pointer hover:bg-blue-100 transition-colors font-medium"
          >
            今日
          </div>
          <div
            @click="changeMonth(1)"
            class="flex items-center justify-center w-8 h-8 text-gray-400 transition-colors border border-gray-200 rounded-full cursor-pointer hover:bg-gray-50"
          >
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>

        <el-calendar v-model="currentDate">
          <template slot="dateCell" slot-scope="{ date, data }">
            <div
              class="absolute inset-0 flex flex-col p-2 overflow-hidden group"
              @click="syncMiniDate(data.day)"
            >
              <div class="flex items-center justify-between mb-1 shrink-0">
                <span
                  :class="
                    data.isSelected
                      ? 'text-[#3B7BFF] font-bold text-[15px]'
                      : 'text-[15px] font-medium'
                  "
                >
                  {{ data.day.split("-").slice(2).join("-") }}
                </span>
                <span class="text-xs text-gray-400">{{
                  getLunarDay(data.day)
                }}</span>
              </div>

              <div
                class="flex-1 min-h-0 overflow-y-auto space-y-1.5 custom-scrollbar pb-1 mt-1"
              >
                <div
                  v-for="(event, idx) in getEventsByDate(data.day)"
                  :key="idx"
                  @click.stop="openDetail(event)"
                  class="text-[12px] px-1.5 py-1 rounded-[3px] truncate flex items-center gap-1.5 cursor-pointer transition-colors duration-200"
                  :class="getEventContainerClass(event)"
                >
                  <div
                    v-if="
                      event.itemType === 'REMINDER' ||
                      event.sourceType === 'TASK'
                    "
                    @click.stop="toggleComplete(event)"
                    class="flex-shrink-0 cursor-pointer"
                  >
                    <span
                      v-if="!event.completed"
                      class="w-2.5 h-2.5 rounded-full border-[1.5px] flex block"
                      :class="getEventBorderClass(event)"
                    ></span>
                    <div
                      v-else
                      class="w-2.5 h-2.5 rounded-full border border-gray-200 flex items-center justify-center bg-white"
                    >
                      <span
                        class="w-1.5 h-1.5 rounded-full"
                        :class="getEventBgClass(event)"
                      ></span>
                    </div>
                  </div>
                  <span
                    v-else
                    class="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    :class="getEventBgClass(event)"
                  ></span>

                  <span
                    class="flex-1 truncate"
                    :class="{ 'line-through opacity-70': event.completed }"
                    >{{ event.title }}</span
                  >

                  <svg-icon
                    v-if="event.isMine"
                    icon-class="icon-mine"
                    style="width: 20px; height: 20px"
                  ></svg-icon>
                </div>
              </div>
            </div>
          </template>
        </el-calendar>
      </div>
    </div>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="600px"
      custom-class="rounded-lg"
      @close="resetForm"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-position="top"
        class="max-h-[60vh] overflow-y-auto px-4 overflow-x-hidden custom-scrollbar"
      >
        <el-form-item
          :label="form.itemType === 'SCHEDULE' ? '日程标题' : '待办事项'"
          prop="title"
        >
          <el-input
            v-model="form.title"
            placeholder="请输入名称"
            :disabled="form.readOnly"
          />
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="form.allDay ? 24 : 12">
            <el-form-item label="开始日期" prop="startDate">
              <el-date-picker
                v-model="form.startDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                class="!w-full"
                :disabled="form.readOnly"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="!form.allDay">
            <el-form-item label="开始时间" prop="startTime">
              <el-time-picker
                v-model="form.startTime"
                value-format="HH:mm:ss"
                placeholder="选择时间"
                class="!w-full"
                :disabled="form.readOnly"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20" v-if="form.itemType === 'SCHEDULE'">
          <el-col :span="form.allDay ? 24 : 12">
            <el-form-item label="结束日期" prop="endDate">
              <el-date-picker
                v-model="form.endDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                class="!w-full"
                :disabled="form.readOnly"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="!form.allDay">
            <el-form-item label="结束时间" prop="endTime">
              <el-time-picker
                v-model="form.endTime"
                value-format="HH:mm:ss"
                placeholder="选择时间"
                class="!w-full"
                :disabled="form.readOnly"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item v-if="form.itemType === 'SCHEDULE'">
          <el-checkbox v-model="form.allDay" :disabled="form.readOnly"
            >全天日程</el-checkbox
          >
        </el-form-item>

        <el-form-item label="参与人" prop="relatedUserIds">
          <el-select
            v-model="form.relatedUserIds"
            multiple
            filterable
            placeholder="请选择参与人"
            class="!w-full"
            :disabled="form.readOnly"
          >
            <el-option
              v-for="user in userOptions"
              :key="user.userId"
              :label="user.nickName || user.userName"
              :value="user.userId"
            />
          </el-select>
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="重复类型" prop="repeatType">
              <el-select
                v-model="form.repeatType"
                placeholder="请选择"
                class="!w-full"
                :disabled="form.readOnly"
              >
                <el-option
                  v-for="opt in repeatOptions"
                  :key="opt.value"
                  :label="opt.label"
                  :value="opt.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="提醒设置" prop="remindType">
              <el-select
                v-model="form.remindType"
                placeholder="请选择"
                class="!w-full"
                :disabled="form.readOnly"
              >
                <el-option
                  v-for="opt in remindOptions"
                  :key="opt.value"
                  :label="opt.label"
                  :value="opt.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item
          label="地点"
          prop="location"
          v-if="form.itemType === 'SCHEDULE'"
        >
          <el-input
            v-model="form.location"
            placeholder="请输入地点"
            :disabled="form.readOnly"
          />
        </el-form-item>

        <el-form-item label="描述备注" prop="description">
          <el-input
            type="textarea"
            :rows="3"
            v-model="form.description"
            placeholder="请输入描述"
            :disabled="form.readOnly"
          />
        </el-form-item>

        <el-form-item label="附件" prop="fileList">
          <FileUpload
            v-model="form.fileList"
            class="custom-file-upload"
            :class="{ 'hide-upload-trigger': form.readOnly }"
            :is-show-tip="false"
            :disabled="form.readOnly"
            :is-del-confirm="!form.readOnly"
            :limit="5"
            :file-size="50"
            url="/work/task/upload"
            @success="handleFileSuccess"
          >
            <div
              class="w-full py-[12px] rounded-lg bg-[#E8EFFF] border border-[#C9CDD4] flex flex-col justify-center items-center gap-[6px] cursor-pointer hover:bg-[#D4E5FF] transition-colors mix-blend-normal"
            >
              <svg-icon
                icon-class="upload-icon"
                style="width: 32px; height: 32px"
              />
              <div class="text-[12px] text-[#1D2129]">
                将文件拖拽至此区域或<span class="text-[#3662FF]"
                  >选择文件上传</span
                >
              </div>
              <div class="text-[12px] text-[#C9CDD4]">
                支持文件格式：jpg、png、docx、excel、pdf
              </div>
            </div>
          </FileUpload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="flex items-center justify-between">
        <div>
          <el-button
            type="danger"
            plain
            v-if="form.id && !form.readOnly"
            @click="handleDelete"
            >删除</el-button
          >
        </div>
        <div>
          <el-button @click="dialogVisible = false">{{
            form.readOnly ? "关闭" : "取消"
          }}</el-button>
          <el-button
            type="primary"
            :loading="submitLoading"
            v-if="!form.readOnly"
            @click="handleSubmit"
            >确定</el-button
          >
        </div>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex"; // 【新增】引入 vuex getters
import {
  workCalendarRange,
  workCalendarCreate,
  workCalendarUpdate,
  workCalendarDelete,
  workCalendarReminderComplete,
  workCalendarReminderUncomplete,
  workCalendarDetail,
  workTaskDetail,
  workCalendarOptions,
} from "@/api/custom/work";
import { listUser } from "@/api/system/user";

export default {
  name: "WorkCalendar",
  data() {
    return {
      loading: false,
      submitLoading: false,
      currentDate: new Date(),
      miniDate: new Date(),

      currentMonthKey: "",
      eventsList: [],

      dialogVisible: false,
      form: this.getInitialForm(),
      rules: {
        title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
        startDate: [
          { required: true, message: "请选择日期", trigger: "change" },
        ],
      },

      userOptions: [],
      repeatOptions: [],
      remindOptions: [],
    };
  },
  computed: {
    ...mapGetters(["userId"]), // 【新增】获取当前登录用户ID
    dialogTitle() {
      if (this.form.readOnly) return "查看详情";
      const prefix = this.form.id ? "编辑" : "创建";
      return prefix + (this.form.itemType === "SCHEDULE" ? "日程" : "待办事项");
    },
    formattedCurrentDate() {
      const d = this.currentDate;
      return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
    },
    miniYearMonth() {
      const d = this.miniDate;
      return `${d.getFullYear()}年 ${d.getMonth() + 1}月`;
    },
    miniCalendarDays() {
      const year = this.miniDate.getFullYear();
      const month = this.miniDate.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);

      const startDayOfWeek = firstDay.getDay();
      const daysInMonth = lastDay.getDate();
      const prevMonthLastDay = new Date(year, month, 0).getDate();

      const days = [];
      const today = new Date();

      for (let i = startDayOfWeek - 1; i >= 0; i--) {
        days.push({
          date: new Date(year, month - 1, prevMonthLastDay - i),
          text: prevMonthLastDay - i,
          isCurrentMonth: false,
        });
      }
      for (let i = 1; i <= daysInMonth; i++) {
        days.push({
          date: new Date(year, month, i),
          text: i,
          isCurrentMonth: true,
        });
      }
      const remaining = 42 - days.length;
      for (let i = 1; i <= remaining; i++) {
        days.push({
          date: new Date(year, month + 1, i),
          text: i,
          isCurrentMonth: false,
        });
      }

      days.forEach((day) => {
        day.isToday = this.isSameDay(day.date, today);
        day.isSelected = this.isSameDay(day.date, this.currentDate);
        day.displayText = day.isToday ? "今" : day.text;
      });

      return days;
    },
  },
  watch: {
    currentDate: {
      handler(newVal) {
        this.miniDate = new Date(newVal.getFullYear(), newVal.getMonth(), 1);
        this.checkAndFetchData();
      },
      immediate: true,
    },
  },
  created() {
    this.initData();
  },
  methods: {
    async initData() {
      this.loadUsers();
      this.loadOptions();
    },

    async checkAndFetchData() {
      const year = this.currentDate.getFullYear();
      const month = this.currentDate.getMonth();
      const firstDayOfMonth = new Date(year, month, 1);

      const startDayOfWeek = firstDayOfMonth.getDay();
      const startDate = new Date(year, month, 1 - startDayOfWeek);
      const endDate = new Date(startDate.getTime() + 41 * 24 * 60 * 60 * 1000);

      const monthKey = `${startDate.toISOString().split("T")[0]}_${
        endDate.toISOString().split("T")[0]
      }`;

      if (this.currentMonthKey !== monthKey) {
        this.currentMonthKey = monthKey;
        this.fetchCalendarData(
          startDate.toISOString().split("T")[0],
          endDate.toISOString().split("T")[0]
        );
      }
    },

    async fetchCalendarData(startDate, endDate) {
      this.loading = true;
      try {
        const res = await workCalendarRange({
          startDate,
          endDate,
          includeTasks: true,
        });
        if (res.code === 200) {
          this.eventsList = (res.data || []).map((item) => {
            // 【修改】动态判断是否为我的：创建人相同，或参与人中包含我
            // const isCreator = item.creatorId === this.userId;
            const isRelated =
              item.relatedUsers &&
              item.relatedUsers.some((u) => u.userId === this.userId);
            const isMine = isRelated;

            return { ...item, isMine };
          });
        }
      } catch (e) {
        console.error("加载日历数据失败", e);
      } finally {
        this.loading = false;
      }
    },

    async loadUsers() {
      try {
        const res = await listUser({ pageNum: 1, pageSize: 500 });
        if (res.code === 200) {
          this.userOptions = res.rows;
        }
      } catch (e) {
        console.error(e);
      }
    },

    async loadOptions() {
      try {
        const res = await workCalendarOptions();
        if (res.code === 200 && res.data) {
          this.repeatOptions = res.data.repeatTypes || [];
          this.remindOptions = res.data.remindTypes || [];
        }
      } catch (e) {
        console.error(e);
      }
    },

    changeMonth(offset) {
      const d = new Date(this.currentDate);
      d.setMonth(d.getMonth() + offset);
      this.currentDate = d;
    },
    changeYear(offset) {
      const d = new Date(this.currentDate);
      d.setFullYear(d.getFullYear() + offset);
      this.currentDate = d;
    },
    goToToday() {
      this.currentDate = new Date();
    },
    selectDate(date) {
      this.currentDate = new Date(date);
    },
    syncMiniDate(dateStr) {
      this.currentDate = new Date(dateStr);
    },
    isSameDay(d1, d2) {
      return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
      );
    },

    getEventsByDate(dateStr) {
      return this.eventsList.filter((e) => {
        if (e.endDate && e.startDate !== e.endDate) {
          return dateStr >= e.startDate && dateStr <= e.endDate;
        }
        return e.startDate === dateStr;
      });
    },

    getEventClassType(event) {
      if (event.sourceType === "TASK") return "system-todo";
      if (event.itemType === "SCHEDULE") return "schedule";
      if (event.itemType === "REMINDER") return "custom-todo";
      return "default";
    },
    getEventContainerClass(event) {
      if (event.completed) return "bg-[#F2F3F5] text-[#C9CDD4]";
      const type = this.getEventClassType(event);
      switch (type) {
        case "schedule":
          return "bg-[#FFF7E8] text-[#FF9E00]";
        case "system-todo":
          return "bg-[#F0F9EB] text-[#73D839]";
        case "custom-todo":
          return "bg-[#ECF5FF] text-[#3B7BFF]";
        default:
          return "bg-gray-50 text-gray-500";
      }
    },
    getEventBorderClass(event) {
      const type = this.getEventClassType(event);
      switch (type) {
        case "schedule":
          return "border-[#FF9E00]";
        case "system-todo":
          return "border-[#73D839]";
        case "custom-todo":
          return "border-[#3B7BFF]";
        default:
          return "border-gray-500";
      }
    },
    getEventBgClass(event) {
      const type = this.getEventClassType(event);
      switch (type) {
        case "schedule":
          return "bg-[#FF9E00]";
        case "system-todo":
          return "bg-[#73D839]";
        case "custom-todo":
          return "bg-[#3B7BFF]";
        default:
          return "bg-gray-500";
      }
    },

    async toggleComplete(event) {
      if (event.readOnly) {
        this.$message.warning("只读模式，无法修改状态");
        return;
      }
      try {
        const reqData = { id: event.id };
        if (event.completed) {
          await workCalendarReminderUncomplete(reqData);
          event.completed = false;
        } else {
          await workCalendarReminderComplete(reqData);
          event.completed = true;
        }
        this.$message.success("状态已更新");
      } catch (e) {
        console.error(e);
        this.$message.error("状态更新失败");
      }
    },

    getInitialForm() {
      return {
        id: undefined,
        itemType: "SCHEDULE",
        title: "",
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
        allDay: false,
        location: "",
        description: "",
        repeatType: "NONE",
        repeatEndDate: "",
        remindType: "NONE",
        completed: false,
        relatedUserIds: [],
        attachmentIds: [],
        fileList: [],
        occurrenceStart: null,
        readOnly: false,
      };
    },
    resetForm() {
      this.form = this.getInitialForm();
      if (this.$refs.form) this.$refs.form.clearValidate();
    },
    openDialog(type) {
      this.resetForm();
      this.form.itemType = type;
      const d = this.currentDate;
      const yyyyMMdd = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(d.getDate()).padStart(2, "0")}`;
      this.form.startDate = yyyyMMdd;
      if (type === "SCHEDULE") this.form.endDate = yyyyMMdd;
      this.dialogVisible = true;
    },

    async openDetail(event) {
      try {
        let res;
        if (event.sourceType === "TASK") {
          res = await workTaskDetail({ id: event.id });
        } else {
          res = await workCalendarDetail({ id: event.id });
        }
        if (res.code === 200 && res.data) {
          const data = res.data;

          this.form = {
            ...data,
            readOnly: event.readOnly || false, // 【修改】确保赋值到只读字段限制表单编辑
            relatedUserIds: (data.relatedUsers || []).map((u) => u.userId),
            fileList: (data.attachments || []).map((a) => ({
              name: a.name,
              url: a.publicUrl,
              attachmentId: a.attachmentId,
              uid: a.attachmentId || Date.now(),
            })),
          };
          this.dialogVisible = true;
        }
      } catch (e) {
        console.error(e);
        this.$message.error("获取详情失败");
      }
    },

    handleFileSuccess(fileList) {
      this.form.fileList = fileList;
    },

    async handleSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return;
        this.submitLoading = true;
        try {
          const attachmentIds = this.form.fileList
            .map((item) => {
              if (item.attachmentId) return item.attachmentId;
              if (item.response && item.response.data)
                return item.response.data.attachmentId;
              return null;
            })
            .filter(Boolean);

          const payload = {
            ...this.form,
            attachmentIds,
            editScope: "ALL",
          };
          if (payload.itemType === "REMINDER") {
            delete payload.endDate;
            delete payload.endTime;
            payload.allDay = false;
          }
          let res;
          if (this.form.id) {
            res = await workCalendarUpdate(payload);
          } else {
            res = await workCalendarCreate(payload);
          }

          if (res.code === 200) {
            this.$message.success(this.form.id ? "更新成功" : "创建成功");
            this.dialogVisible = false;
            this.currentMonthKey = "";
            this.checkAndFetchData();
          }
        } catch (e) {
          console.error(e);
        } finally {
          this.submitLoading = false;
        }
      });
    },

    async handleDelete() {
      this.$confirm("确定要删除该事项吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          try {
            const res = await workCalendarDelete({
              id: this.form.id,
              deleteScope: "ALL",
              occurrenceStart: this.form.occurrenceStart,
            });
            if (res.code === 200) {
              this.$message.success("删除成功");
              this.dialogVisible = false;
              this.currentMonthKey = "";
              this.checkAndFetchData();
            }
          } catch (error) {
            console.error("删除失败", error);
          }
        })
        .catch(() => {});
    },

    getLunarDay(dateStr) {
      try {
        const date = new Date(dateStr);
        const formatter = new Intl.DateTimeFormat("zh-CN-u-ca-chinese", {
          day: "numeric",
        });
        let lunarStr = formatter.format(date);
        const numMatch = lunarStr.match(/\d+/);
        if (numMatch) {
          const num = parseInt(numMatch[0]);
          const numMap = [
            "十",
            "一",
            "二",
            "三",
            "四",
            "五",
            "六",
            "七",
            "八",
            "九",
          ];
          if (num === 10) return "初十";
          if (num === 20) return "二十";
          if (num === 30) return "三十";
          if (num < 10) return "初" + numMap[num];
          if (num < 20) return "十" + numMap[num % 10];
          if (num < 30) return "廿" + numMap[num % 10];
        }
        return lunarStr.replace("日", "");
      } catch (e) {
        return "";
      }
    },
  },
};
</script>

<style scoped>
/* ===================== 文件上传额外控制 ===================== */
/* 当为查看详情时，隐藏上传触发区域和删除按钮 */
.hide-upload-trigger ::v-deep .el-upload {
  display: none !important;
}
.hide-upload-trigger ::v-deep .el-upload-list__item .el-icon-close {
  display: none !important;
}
.custom-file-upload ::v-deep .el-upload {
  display: block;
}
/* ===================== 深度修改 Element UI 日历组件 ===================== */
::v-deep .el-calendar {
  background-color: transparent;
  height: 100%;
  display: flex;
  flex-direction: column;
}

::v-deep .el-calendar__header {
  display: none;
}

::v-deep .el-calendar__body {
  padding: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

::v-deep .el-calendar-table {
  height: 100%;
  width: 100%;
  table-layout: fixed;
}
::v-deep .el-calendar-table tbody {
  height: calc(100vh - 230px);
}
::v-deep .el-calendar-table thead th {
  padding: 12px 0;
  background-color: #f5f7fa;
  color: #606266;
  font-weight: bold;
  text-align: center;
  border-bottom: 1px solid rgba(242, 243, 245, 1);
}

::v-deep .el-calendar-table td {
  border-bottom: 1px solid rgba(242, 243, 245, 1);
  border-right: none;
  vertical-align: top;
}

/* 强制每行日历占满剩余空间的 1/6 (解决高度不一致的问题) */
::v-deep .el-calendar-table tr {
  height: 16.666% !important;
}

::v-deep .el-calendar-table td:last-child {
  border-right: none;
}
::v-deep .el-calendar-table tr td:first-child {
  border-left: none;
}
::v-deep .el-calendar-table .el-calendar-day {
  height: 100%;
  min-height: 0;
  padding: 8px;
  box-sizing: border-box;
}

/* 自定义滚动条 */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 4px;
}
.group:hover .custom-scrollbar::-webkit-scrollbar-thumb,
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background: #cbd5e1;
}
::v-deep .el-calendar-table .el-calendar-day {
  height: 100%;
  min-height: 0;

  padding: 0 !important;
  box-sizing: border-box;

  position: relative;
}
</style>
