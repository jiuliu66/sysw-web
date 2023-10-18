<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="用户号" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入用户号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="欠费金额" prop="amountOwed">
        <el-input
          v-model="queryParams.amountOwed"
          placeholder="请输入欠费金额"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="催缴次数" prop="numberCall">
        <el-input
          v-model="queryParams.numberCall"
          placeholder="请输入催缴次数"
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
          v-hasPermi="['system:arrearsUser:add']"
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
          v-hasPermi="['system:arrearsUser:edit']"
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
          v-hasPermi="['system:arrearsUser:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:arrearsUser:export']"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-push"
          size="mini"
          @click="handlePush"
          v-hasPermi="['system:arrearsUser:push']"
        >推送</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="arrearsUserList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="用户号" align="center" prop="userId" />
      <el-table-column label="欠费金额" align="center" prop="amountOwed" />
      <el-table-column label="催缴次数" align="center" prop="numberCall" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:arrearsUser:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:arrearsUser:remove']"
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

    <!-- 添加或修改欠费用户对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户号" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户号" />
        </el-form-item>
        <el-form-item label="欠费金额" prop="amountOwed">
          <el-input v-model="form.amountOwed" placeholder="请输入欠费金额" />
        </el-form-item>
        <el-form-item label="催缴次数" prop="numberCall">
          <el-input v-model="form.numberCall" placeholder="请输入催缴次数" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 添加推送方式对话框 -->
    <el-dialog :title="title" :visible.sync="open1" width="500px" append-to-body>
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-form-item label="用户号" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户号" />
        </el-form-item>
        <el-form-item label="欠费金额" prop="amountOwed">
          <el-input v-model="form.amountOwed" placeholder="请输入欠费金额" />
        </el-form-item>
        <el-form-item label="催缴次数" prop="numberCall">
          <el-input v-model="form.numberCall" placeholder="请输入催缴次数" />
        </el-form-item>
        <el-form-item label="方式" prop="field101">
          <el-checkbox-group v-model="formData.field101" size="medium">
            <el-checkbox v-for="(item, index) in field101Options" :key="index" :label="item.value"
                         :disabled="item.disabled">{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm1">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listArrearsUser,
  getArrearsUser,
  delArrearsUser,
  addArrearsUser,
  updateArrearsUser,
  pushArrearsInfo
} from "@/api/system/arrearsUser";

export default {
  name: "ArrearsUser",
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
      // 欠费用户表格数据
      arrearsUserList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      open1: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: null,
        amountOwed: null,
        numberCall: null
      },
      //推送查询参数
      pushParams: {
        userId: null,
        pushType: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      formData: {
        field101: [],
      },
      rules: {
        field101: [{
          required: true,
          type: 'array',
          message: '请至少选择一个field101',
          trigger: 'change'
        }],
      },
        field101Options: [{
          "label": "短信推送",
          "value": 1
        }, {
          "label": "微信公众号推送",
          "value": 2
        }],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询欠费用户列表 */
    getList() {
      this.loading = true;
      listArrearsUser(this.queryParams).then(response => {
        this.arrearsUserList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.open1 = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        userId: null,
        amountOwed: null,
        numberCall: null
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
      this.title = "添加欠费用户";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getArrearsUser(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改欠费用户";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateArrearsUser(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addArrearsUser(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除欠费用户编号为"' + ids + '"的数据项？').then(function() {
        return delArrearsUser(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },

    /** 推送按钮操作 */
    handlePush(row) {
      this.reset();
      const id = row.id || this.ids
      getArrearsUser(id).then(response => {
          this.form = response.data;
          this.open1 = true;
          this.title = "选择推送方式";
      });
    },
    /**推送提交按钮*/
    submitForm1() {
      this.$refs["elForm"].validate(valid => {
        if (valid) {
          console.log(this.formData.field101.toString())
          this.pushParams.userId = this.form.userId
          this.pushParams.pushType = this.formData.toString()
          pushArrearsInfo(this.pushParams).then(response => {
            this.$modal.msgSuccess("推送成功");
            this.open1 = false;
            this.getList();
            console.log("测试")
          });
        }
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/arrearsUser/export', {
        ...this.queryParams
      }, `arrearsUser_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
