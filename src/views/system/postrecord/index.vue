<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="用户id" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入用户id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="消息接收人" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入消息接收人"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="消息接收人的手机号码" prop="tel">
        <el-input
          v-model="queryParams.tel"
          placeholder="请输入消息接收人的手机号码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="消息推送时间" prop="pushTime">
        <el-date-picker clearable
          v-model="queryParams.pushTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择消息推送时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="网格员" prop="gridman">
        <el-input
          v-model="queryParams.gridman"
          placeholder="请输入网格员"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:postrecord:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:postrecord:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:postrecord:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:postrecord:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="postrecordList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键id" align="center" prop="id" />
      <el-table-column label="用户id" align="center" prop="userId" />
      <el-table-column label="消息接收人" align="center" prop="userName" />
      <el-table-column label="消息接收人的微信openid" align="center" prop="wxid" />
      <el-table-column label="消息接收人的手机号码" align="center" prop="tel" />
      <el-table-column label="推送内容" align="center" prop="pushContent" />
      <el-table-column label="消息推送时间" align="center" prop="pushTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.pushTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="推送方式" align="center" prop="pushType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.push_type" :value="scope.row.pushType ? scope.row.pushType.split(',') : []"/>
        </template>
      </el-table-column>
      <el-table-column label="网格员" align="center" prop="gridman" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:postrecord:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:postrecord:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改消息推送流水对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户id" />
        </el-form-item>
        <el-form-item label="消息接收人" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入消息接收人" />
        </el-form-item>
        <el-form-item label="消息接收人的手机号码" prop="tel">
          <el-input v-model="form.tel" placeholder="请输入消息接收人的手机号码" />
        </el-form-item>
        <el-form-item label="推送内容">
          <editor v-model="form.pushContent" :min-height="192"/>
        </el-form-item>
        <el-form-item label="消息推送时间" prop="pushTime">
          <el-date-picker clearable
            v-model="form.pushTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择消息推送时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="推送方式" prop="pushType">
          <el-checkbox-group v-model="form.pushType">
            <el-checkbox
              v-for="dict in dict.type.push_type"
              :key="dict.value"
              :label="dict.value">
              {{dict.label}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="网格员" prop="gridman">
          <el-input v-model="form.gridman" placeholder="请输入网格员" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listPostrecord, getPostrecord, delPostrecord, addPostrecord, updatePostrecord } from "@/api/system/postrecord";

export default {
  name: "Postrecord",
  dicts: ['push_type'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 消息推送流水表格数据
      postrecordList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: null,
        userName: null,
        tel: null,
        pushContent: null,
        pushTime: null,
        pushType: null,
        gridman: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询消息推送流水列表 */
    getList() {
      this.loading = true;
      listPostrecord(this.queryParams).then(response => {
        this.postrecordList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        userId: null,
        userName: null,
        wxid: null,
        tel: null,
        pushContent: null,
        pushTime: null,
        pushType: [],
        gridman: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加消息推送流水";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getPostrecord(id).then(response => {
        this.form = response.data;
        this.form.pushType = this.form.pushType.split(",");
        this.open = true;
        this.title = "修改消息推送流水";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.pushType = this.form.pushType.join(",");
          if (this.form.id != null) {
            updatePostrecord(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPostrecord(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除消息推送流水编号为"' + ids + '"的数据项？').then(function() {
        return delPostrecord(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/postrecord/export', {
        ...this.queryParams
      }, `postrecord_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
