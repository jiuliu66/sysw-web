<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="日期" prop="yearMonth2">
        <el-input
          v-model="queryParams.yearMonth2"
          placeholder="请输入日期"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户id" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入用户id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="类别号" prop="bookId">
        <el-input
          v-model="queryParams.bookId"
          placeholder="请输入类别号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="银行卡号" prop="cardId">
        <el-input
          v-model="queryParams.cardId"
          placeholder="请输入银行卡号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户名" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入用户名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用水类型编号" prop="waterTypeId">
        <el-input
          v-model="queryParams.waterTypeId"
          placeholder="请输入用水类型编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用水类型" prop="waterTypeName">
        <el-input
          v-model="queryParams.waterTypeName"
          placeholder="请输入用水类型"
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
          v-hasPermi="['system:postuser:add']"
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
          v-hasPermi="['system:postuser:edit']"
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
          v-hasPermi="['system:postuser:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:postuser:export']"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-push"
          size="mini"
          :disabled="multiple"
          @click="handlePush"
          v-hasPermi="['system:arrearsUser:push']"
        >推送</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="postuserList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="日期" align="center" prop="yearMonth2" />
      <el-table-column label="用户id" align="center" prop="userId" />
      <el-table-column label="类别号" align="center" prop="bookId" />
      <el-table-column label="银行卡号" align="center" prop="cardId" />
      <el-table-column label="用户名" align="center" prop="userName" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:postuser:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:postuser:remove']"
          >删除</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-push"
            @click="handlePush(scope.row)"
            v-hasPermi="['system:postuser:push']"
          >推送</el-button>
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
        <el-form-item label="日期" prop="yearMonth2">
          <el-input v-model="form.yearMonth2" placeholder="请输入日期" />
        </el-form-item>
        <el-form-item label="用户id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户id" />
        </el-form-item>
        <el-form-item label="类别号" prop="bookId">
          <el-input v-model="form.bookId" placeholder="请输入类别号" />
        </el-form-item>
        <el-form-item label="银行卡号" prop="cardId">
          <el-input v-model="form.cardId" placeholder="请输入银行卡号" />
        </el-form-item>
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="用水类型编号" prop="waterTypeId">
          <el-input v-model="form.waterTypeId" placeholder="请输入用水类型编号" />
        </el-form-item>
        <el-form-item label="用水类型" prop="waterTypeName">
          <el-input v-model="form.waterTypeName" placeholder="请输入用水类型" />
        </el-form-item>
        <el-form-item label="水费标志" prop="derateLateFeeFlag">
          <el-input v-model="form.derateLateFeeFlag" placeholder="请输入水费标志" />
        </el-form-item>
        <el-form-item label="水位标志" prop="derateWaterFlag">
          <el-input v-model="form.derateWaterFlag" placeholder="请输入水位标志" />
        </el-form-item>
        <el-form-item label="ckm编号" prop="ckmUsrId">
          <el-input v-model="form.ckmUsrId" placeholder="请输入ckm编号" />
        </el-form-item>
        <el-form-item label="ckm姓名" prop="ckmUsrName">
          <el-input v-model="form.ckmUsrName" placeholder="请输入ckm姓名" />
        </el-form-item>
        <el-form-item label="water_price_id" prop="waterPriceId">
          <el-input v-model="form.waterPriceId" placeholder="请输入water_price_id" />
        </el-form-item>
        <el-form-item label="sh_dhsj" prop="shDhsj">
          <el-input v-model="form.shDhsj" placeholder="请输入sh_dhsj" />
        </el-form-item>
        <el-form-item label="sh_dhsj" prop="gsDhsj">
          <el-input v-model="form.gsDhsj" placeholder="请输入sh_dhsj" />
        </el-form-item>
        <el-form-item label="sh_dhsj" prop="tzDhsj">
          <el-input v-model="form.tzDhsj" placeholder="请输入sh_dhsj" />
        </el-form-item>
        <el-form-item label="per_price" prop="perPrice">
          <el-input v-model="form.perPrice" placeholder="请输入per_price" />
        </el-form-item>
        <el-form-item label="per_price" prop="shRate">
          <el-input v-model="form.shRate" placeholder="请输入per_price" />
        </el-form-item>
        <el-form-item label="gs_rate" prop="gsRate">
          <el-input v-model="form.gsRate" placeholder="请输入gs_rate" />
        </el-form-item>
        <el-form-item label="gs_rate" prop="tzRate">
          <el-input v-model="form.tzRate" placeholder="请输入gs_rate" />
        </el-form-item>
        <el-form-item label="ckm_status_id" prop="ckmStatusId">
          <el-input v-model="form.ckmStatusId" placeholder="请输入ckm_status_id" />
        </el-form-item>
        <el-form-item label="ckm_status_name" prop="ckmStatusName">
          <el-input v-model="form.ckmStatusName" placeholder="请输入ckm_status_name" />
        </el-form-item>
        <el-form-item label="abnormal_water" prop="abnormalWater">
          <el-input v-model="form.abnormalWater" placeholder="请输入abnormal_water" />
        </el-form-item>
        <el-form-item label="is_renew" prop="isRenew">
          <el-input v-model="form.isRenew" placeholder="请输入is_renew" />
        </el-form-item>
        <el-form-item label="old_begin_num" prop="oldBeginNum">
          <el-input v-model="form.oldBeginNum" placeholder="请输入old_begin_num" />
        </el-form-item>
        <el-form-item label="old_end_num" prop="oldEndNum">
          <el-input v-model="form.oldEndNum" placeholder="请输入old_end_num" />
        </el-form-item>
        <el-form-item label="renew_water" prop="renewWater">
          <el-input v-model="form.renewWater" placeholder="请输入renew_water" />
        </el-form-item>
        <el-form-item label="begin_num" prop="beginNum">
          <el-input v-model="form.beginNum" placeholder="请输入begin_num" />
        </el-form-item>
        <el-form-item label="end_num" prop="endNum">
          <el-input v-model="form.endNum" placeholder="请输入end_num" />
        </el-form-item>
        <el-form-item label="ckm_water" prop="ckmWater">
          <el-input v-model="form.ckmWater" placeholder="请输入ckm_water" />
        </el-form-item>
        <el-form-item label="derate_water" prop="derateWater">
          <el-input v-model="form.derateWater" placeholder="请输入derate_water" />
        </el-form-item>
        <el-form-item label="receivable_water" prop="receivableWater">
          <el-input v-model="form.receivableWater" placeholder="请输入receivable_water" />
        </el-form-item>
        <el-form-item label="sh_sl" prop="shSl">
          <el-input v-model="form.shSl" placeholder="请输入sh_sl" />
        </el-form-item>
        <el-form-item label="gs_sl" prop="gsSl">
          <el-input v-model="form.gsSl" placeholder="请输入gs_sl" />
        </el-form-item>
        <el-form-item label="tz_sl" prop="tzSl">
          <el-input v-model="form.tzSl" placeholder="请输入tz_sl" />
        </el-form-item>
        <el-form-item label="fee_receivable" prop="feeReceivable">
          <el-input v-model="form.feeReceivable" placeholder="请输入fee_receivable" />
        </el-form-item>
        <el-form-item label="late_fee_receivable" prop="lateFeeReceivable">
          <el-input v-model="form.lateFeeReceivable" placeholder="请输入late_fee_receivable" />
        </el-form-item>
        <el-form-item label="late_fee" prop="lateFee">
          <el-input v-model="form.lateFee" placeholder="请输入late_fee" />
        </el-form-item>
        <el-form-item label="late_fee_date" prop="lateFeeDate">
          <el-date-picker clearable
            v-model="form.lateFeeDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择late_fee_date">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="late_fee_days" prop="lateFeeDays">
          <el-input v-model="form.lateFeeDays" placeholder="请输入late_fee_days" />
        </el-form-item>
        <el-form-item label="late_fee_cpt_date" prop="lateFeeCptDate">
          <el-date-picker clearable
            v-model="form.lateFeeCptDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择late_fee_cpt_date">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="fee_hj" prop="feeHj">
          <el-input v-model="form.feeHj" placeholder="请输入fee_hj" />
        </el-form-item>
        <el-form-item label="fee_actual" prop="feeActual">
          <el-input v-model="form.feeActual" placeholder="请输入fee_actual" />
        </el-form-item>
        <el-form-item label="up_balance" prop="upBalance">
          <el-input v-model="form.upBalance" placeholder="请输入up_balance" />
        </el-form-item>
        <el-form-item label="this_balance" prop="thisBalance">
          <el-input v-model="form.thisBalance" placeholder="请输入this_balance" />
        </el-form-item>
        <el-form-item label="post用户id" prop="postUsrId">
          <el-input v-model="form.postUsrId" placeholder="请输入post用户id" />
        </el-form-item>
        <el-form-item label="post用户名" prop="postUsrName">
          <el-input v-model="form.postUsrName" placeholder="请输入post用户名" />
        </el-form-item>
        <el-form-item label="post日期" prop="postDate">
          <el-date-picker clearable
            v-model="form.postDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择post日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="post时间" prop="postTime">
          <el-date-picker clearable
            v-model="form.postTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择post时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="audit标志" prop="auditFlag">
          <el-input v-model="form.auditFlag" placeholder="请输入audit标志" />
        </el-form-item>
        <el-form-item label="audit用户id" prop="auditUsrId">
          <el-input v-model="form.auditUsrId" placeholder="请输入audit用户id" />
        </el-form-item>
        <el-form-item label="audit用户名" prop="auditUsrName">
          <el-input v-model="form.auditUsrName" placeholder="请输入audit用户名" />
        </el-form-item>
        <el-form-item label="audit日期" prop="auditDate">
          <el-date-picker clearable
            v-model="form.auditDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择audit日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="audit时间" prop="auditTime">
          <el-date-picker clearable
            v-model="form.auditTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择audit时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="fee用户id" prop="feeUsrId">
          <el-input v-model="form.feeUsrId" placeholder="请输入fee用户id" />
        </el-form-item>
        <el-form-item label="fee用户名" prop="feeUsrName">
          <el-input v-model="form.feeUsrName" placeholder="请输入fee用户名" />
        </el-form-item>
        <el-form-item label="fee日期" prop="feeDate">
          <el-date-picker clearable
            v-model="form.feeDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择fee日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="fee时间" prop="feeTime">
          <el-date-picker clearable
            v-model="form.feeTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择fee时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="fee_method_id" prop="feeMethodId">
          <el-input v-model="form.feeMethodId" placeholder="请输入fee_method_id" />
        </el-form-item>
        <el-form-item label="fee_method_name" prop="feeMethodName">
          <el-input v-model="form.feeMethodName" placeholder="请输入fee_method_name" />
        </el-form-item>
        <el-form-item label="fee_id" prop="feeId">
          <el-input v-model="form.feeId" placeholder="请输入fee_id" />
        </el-form-item>
        <el-form-item label="fee_flag" prop="feeFlag">
          <el-input v-model="form.feeFlag" placeholder="请输入fee_flag" />
        </el-form-item>
        <el-form-item label="fee_flag" prop="feeYm">
          <el-input v-model="form.feeYm" placeholder="请输入fee_flag" />
        </el-form-item>
        <el-form-item label="xz用户id" prop="xzUsrId">
          <el-input v-model="form.xzUsrId" placeholder="请输入xz用户id" />
        </el-form-item>
        <el-form-item label="xz用户名" prop="xzUsrName">
          <el-input v-model="form.xzUsrName" placeholder="请输入xz用户名" />
        </el-form-item>
        <el-form-item label="ivc_prt_flag" prop="ivcPrtFlag">
          <el-input v-model="form.ivcPrtFlag" placeholder="请输入ivc_prt_flag" />
        </el-form-item>
        <el-form-item label="ivcid" prop="ivcId">
          <el-input v-model="form.ivcId" placeholder="请输入ivcid" />
        </el-form-item>
        <el-form-item label="ivc_no" prop="ivcNo">
          <el-input v-model="form.ivcNo" placeholder="请输入ivc_no" />
        </el-form-item>
        <el-form-item label="ivc用户id" prop="ivcUsrId">
          <el-input v-model="form.ivcUsrId" placeholder="请输入ivc用户id" />
        </el-form-item>
        <el-form-item label="ivc用户名" prop="ivcUsrName">
          <el-input v-model="form.ivcUsrName" placeholder="请输入ivc用户名" />
        </el-form-item>
        <el-form-item label="ivc日期" prop="ivcDate">
          <el-date-picker clearable
            v-model="form.ivcDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择ivc日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="ivc时间" prop="ivcTime">
          <el-date-picker clearable
            v-model="form.ivcTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择ivc时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="ivc_ym" prop="ivcYm">
          <el-input v-model="form.ivcYm" placeholder="请输入ivc_ym" />
        </el-form-item>
        <el-form-item label="rpt_ym" prop="rptYm">
          <el-input v-model="form.rptYm" placeholder="请输入rpt_ym" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="opid" prop="opId">
          <el-input v-model="form.opId" placeholder="请输入opid" />
        </el-form-item>
        <el-form-item label="op名称" prop="opName">
          <el-input v-model="form.opName" placeholder="请输入op名称" />
        </el-form-item>
        <el-form-item label="op时间" prop="opTime">
          <el-date-picker clearable
            v-model="form.opTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择op时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="lost_water_flag" prop="lostWaterFlag">
          <el-input v-model="form.lostWaterFlag" placeholder="请输入lost_water_flag" />
        </el-form-item>
        <el-form-item label="jt_flag" prop="jtFlag">
          <el-input v-model="form.jtFlag" placeholder="请输入jt_flag" />
        </el-form-item>
        <el-form-item label="sh_dhsj2" prop="shDhsj2">
          <el-input v-model="form.shDhsj2" placeholder="请输入sh_dhsj2" />
        </el-form-item>
        <el-form-item label="sh_dhsj3" prop="shDhsj3">
          <el-input v-model="form.shDhsj3" placeholder="请输入sh_dhsj3" />
        </el-form-item>
        <el-form-item label="sh_sl2" prop="shSl2">
          <el-input v-model="form.shSl2" placeholder="请输入sh_sl2" />
        </el-form-item>
        <el-form-item label="sh_sl3" prop="shSl3">
          <el-input v-model="form.shSl3" placeholder="请输入sh_sl3" />
        </el-form-item>
        <el-form-item label="sl_year" prop="slYear">
          <el-input v-model="form.slYear" placeholder="请输入sl_year" />
        </el-form-item>
        <el-form-item label="persons" prop="persons">
          <el-input v-model="form.persons" placeholder="请输入persons" />
        </el-form-item>
        <el-form-item label="hz_flag" prop="hzFlag">
          <el-input v-model="form.hzFlag" placeholder="请输入hz_flag" />
        </el-form-item>
        <el-form-item label="base_ton_je" prop="baseTonJe">
          <el-input v-model="form.baseTonJe" placeholder="请输入base_ton_je" />
        </el-form-item>
        <el-form-item label="isdd_flag" prop="isddFlag">
          <el-input v-model="form.isddFlag" placeholder="请输入isdd_flag" />
        </el-form-item>
        <el-form-item label="版本" prop="version">
          <el-input v-model="form.version" placeholder="请输入版本" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 推送方式对话框 -->
    <el-dialog :title="push.title"  :visible.sync="push.open" width="500px" append-to-body>
      <el-form ref="pushForm" :model="push.form" :rules="push.rules" size="medium" label-width="100px">
        <el-form-item label="推送方式" prop="pushType">
          <el-checkbox-group v-model="push.form.pushType">
            <el-checkbox
              v-for="dict in dict.type.push_type"
              :key="dict.value"
              :label="dict.value">
              {{dict.label}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="pushSubmitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listPostuser, getPostuser, delPostuser, addPostuser, updatePostuser,pushArrearsInfo } from "@/api/system/postuser";

export default {
  name: "Postuser",
  dicts: ['push_type'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      userIds: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 欠费用户表格数据
      postuserList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        yearMonth2: null,
        userId: null,
        bookId: null,
        cardId: null,
        userName: null,
        waterTypeId: null,
        waterTypeName: null,
        derateLateFeeFlag: null,
        derateWaterFlag: null,
        ckmUsrId: null,
        ckmUsrName: null,
        waterPriceId: null,
        shDhsj: null,
        gsDhsj: null,
        tzDhsj: null,
        perPrice: null,
        shRate: null,
        gsRate: null,
        tzRate: null,
        ckmStatusId: null,
        ckmStatusName: null,
        abnormalWater: null,
        isRenew: null,
        oldBeginNum: null,
        oldEndNum: null,
        renewWater: null,
        beginNum: null,
        endNum: null,
        ckmWater: null,
        derateWater: null,
        receivableWater: null,
        shSl: null,
        gsSl: null,
        tzSl: null,
        feeReceivable: null,
        lateFeeReceivable: null,
        lateFee: null,
        lateFeeDate: null,
        lateFeeDays: null,
        lateFeeCptDate: null,
        feeHj: null,
        feeActual: null,
        upBalance: null,
        thisBalance: null,
        postUsrId: null,
        postUsrName: null,
        postDate: null,
        postTime: null,
        auditFlag: null,
        auditUsrId: null,
        auditUsrName: null,
        auditDate: null,
        auditTime: null,
        feeUsrId: null,
        feeUsrName: null,
        feeDate: null,
        feeTime: null,
        feeMethodId: null,
        feeMethodName: null,
        feeId: null,
        feeFlag: null,
        feeYm: null,
        feeType: null,
        xzUsrId: null,
        xzUsrName: null,
        ivcPrtFlag: null,
        ivcId: null,
        ivcNo: null,
        ivcUsrId: null,
        ivcUsrName: null,
        ivcDate: null,
        ivcTime: null,
        ivcYm: null,
        rptYm: null,
        opId: null,
        opName: null,
        opTime: null,
        lostWaterFlag: null,
        jtFlag: null,
        shDhsj2: null,
        shDhsj3: null,
        shSl2: null,
        shSl3: null,
        slYear: null,
        persons: null,
        hzFlag: null,
        baseTonJe: null,
        isddFlag: null,
        version: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        opTime: [
          { required: true, message: "op时间不能为空", trigger: "blur" }
        ],
      },
      push: {
        open: false,
        title:"推送方式",
        form: {
          pushType:[],
        },
        rules: {
          pushType: [{
            required: true,
            message: '请至少选择一种推送方式',
            trigger: 'change'
          }],
        },
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询欠费用户列表 */
    getList() {
      this.loading = true;
      listPostuser(this.queryParams).then(response => {
        this.postuserList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.push.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        yearMonth2: null,
        userId: null,
        bookId: null,
        cardId: null,
        userName: null,
        waterTypeId: null,
        waterTypeName: null,
        derateLateFeeFlag: null,
        derateWaterFlag: null,
        ckmUsrId: null,
        ckmUsrName: null,
        waterPriceId: null,
        shDhsj: null,
        gsDhsj: null,
        tzDhsj: null,
        perPrice: null,
        shRate: null,
        gsRate: null,
        tzRate: null,
        ckmStatusId: null,
        ckmStatusName: null,
        abnormalWater: null,
        isRenew: null,
        oldBeginNum: null,
        oldEndNum: null,
        renewWater: null,
        beginNum: null,
        endNum: null,
        ckmWater: null,
        derateWater: null,
        receivableWater: null,
        shSl: null,
        gsSl: null,
        tzSl: null,
        feeReceivable: null,
        lateFeeReceivable: null,
        lateFee: null,
        lateFeeDate: null,
        lateFeeDays: null,
        lateFeeCptDate: null,
        feeHj: null,
        feeActual: null,
        upBalance: null,
        thisBalance: null,
        postUsrId: null,
        postUsrName: null,
        postDate: null,
        postTime: null,
        auditFlag: null,
        auditUsrId: null,
        auditUsrName: null,
        auditDate: null,
        auditTime: null,
        feeUsrId: null,
        feeUsrName: null,
        feeDate: null,
        feeTime: null,
        feeMethodId: null,
        feeMethodName: null,
        feeId: null,
        feeFlag: null,
        feeYm: null,
        feeType: null,
        xzUsrId: null,
        xzUsrName: null,
        ivcPrtFlag: null,
        ivcId: null,
        ivcNo: null,
        ivcUsrId: null,
        ivcUsrName: null,
        ivcDate: null,
        ivcTime: null,
        ivcYm: null,
        rptYm: null,
        remark: null,
        opId: null,
        opName: null,
        opTime: null,
        lostWaterFlag: null,
        jtFlag: null,
        shDhsj2: null,
        shDhsj3: null,
        shSl2: null,
        shSl3: null,
        slYear: null,
        persons: null,
        hzFlag: null,
        baseTonJe: null,
        isddFlag: null,
        version: null
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
      this.userIds = selection.map(item => item.userId)
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
      getPostuser(id).then(response => {
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
            updatePostuser(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPostuser(this.form).then(response => {
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
        return delPostuser(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/postuser/export', {
        ...this.queryParams
      }, `postuser_${new Date().getTime()}.xlsx`)
    },
    /** 推送按钮操作 */
    handlePush() {
      this.reset();
      this.push.open = true;
      this.push.title = "选择推送方式";
    },
    /**推送提交按钮*/
    pushSubmitForm() {
      this.$refs["pushForm"].validate(valid => {
        console.log(this.userIds)
        console.log(this.push.form.pushType)
        if (valid) {
          pushArrearsInfo(this.userIds.toString(),this.push.form.pushType.toString()).then(response => {
            this.$modal.msgSuccess("推送成功");
            this.push.open = false;
          });
        }
      });
    }
  }
};
</script>
