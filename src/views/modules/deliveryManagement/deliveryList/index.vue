<style lang="scss" scoped>
.deliveryList {
  width: 100%;
  padding: 20px;
  .input-width {
    width: 150px;
  }
  .pagination {
    text-align: center;
    margin: 20px 0;
  }
}
.redtxt{
  color: #f00;
}
.singleLine{
  text-overflow: ellipsis;
  white-space: nowrap;
}
.bluelink{
  color: #06f;
  cursor: pointer;
}
</style>

<template>
  <div class="deliveryList">
    <!-- 头部搜索 -->
    <el-form
      ref="searchForm"
      size="mini"
      :inline="true"
      :model="params"
    >
      <el-form-item label="发货状态" prop="status">
        <el-select
          v-model="params.status"
          filterable
          clearable
        >
          <el-option label="全部" value="" />
          <el-option
            v-for="(v, k) in optionList.status"
            :key="k"
            :label="v"
            :value="k"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="物流渠道" prop="express_forwarder_type">
        <el-select
          v-model="params.express_forwarder_type"
          filterable
          clearable
        >
          <el-option label="全部" value="" />
          <el-option
            v-for="(v, k) in optionList.express"
            :key="k"
            :label="v"
            :value="k"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="批次号" prop="batch_no">
        <el-input v-model.trim="params.batch_no" class="input-width" />
      </el-form-item>
      <el-form-item label="客户编号" prop="customer_code">
        <el-input v-model.trim="params.customer_code" class="input-width" />
      </el-form-item>
      <el-form-item label="订单号" prop="order_no">
        <el-input v-model.trim="params.order_no" class="input-width" />
      </el-form-item>
      <el-form-item label="国内单号" prop="szlcsc_no">
        <el-input v-model.trim="params.szlcsc_no" class="input-width" />
      </el-form-item>
      <el-form-item label="物流单号" prop="tracking_number">
        <el-input v-model.trim="params.tracking_number" class="input-width" />
      </el-form-item>
      <el-form-item label="发货时间" prop="created_at">
        <el-date-picker
          v-model="params.created_at"
          type="daterange"
          unlink-panels
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          :editable="false"
          :default-time="['00:00:00', '23:59:59']"
        />
      </el-form-item>
      <el-form-item label="国家" prop="country">
        <el-input v-model.trim="params.country" class="input-width" />
      </el-form-item>
      <el-form-item label="运费类型" prop="freight_type">
        <el-select
          v-model="params.freight_type"
          filterable
          clearable
        >
          <el-option label="全部" value="" />
          <el-option
            v-for="(v, k) in optionList.freight"
            :key="k"
            :label="v"
            :value="k"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否含Reel服务" prop="is_has_reel">
        <el-select
          v-model="params.is_has_reel"
          filterable
          clearable
        >
          <el-option label="全部" value="" />
          <el-option
            v-for="(v, k) in optionList.isHasReelList"
            :key="k"
            :label="v"
            :value="k"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否有发货备注" prop="has_delivery_remark">
        <el-select
          v-model="params.has_delivery_remark"
          filterable
          clearable
        >
          <el-option label="全部" value="" />
          <el-option
            v-for="(v, k) in optionList.hasDeliveryRemarkList"
            :key="k"
            :label="v"
            :value="k"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="批次总金额" prop="batch_total_amount">
        <el-select
          v-model="params.batch_total_amount"
          filterable
          clearable
        >
          <el-option label="全部" value="" />
          <el-option
            v-for="(v, k) in optionList.batchTotalAmountList"
            :key="k"
            :label="v"
            :value="k"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search()">
          查询
        </el-button>
        <el-button type="info" @click="reset()">
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 操作按钮 -->
    <div>
      <el-button
        v-for="item in btnList"
        :key="item.id"
        type="primary"
        size="mini"
        @click="item.fn()"
      >
        {{ item.name }}
      </el-button>
    </div>

    <!-- 表格 -->
    <div class="p-t-10">
      <el-table
        v-adaptive-height="{bottomOffset: 100}"
        v-loading="loading"
        border
        size="mini"
        height="120px"
        :data="tableData"
        @selection-change="(val) => { selectItems = val }"
      >
        <el-table-column
          width="55"
          type="selection"
          align="center"
        />
        <el-table-column
          prop="batch_no"
          label="批次号"
          align="center"
          width="120"
        >
          <template slot-scope="scope">
            <div class="bluelink" @click="gotoDeliveryDetail(scope.row)">
              {{ scope.row.batch_no }}
            </div>
            <div v-if="scope.row.is_block == 1" class="redtxt">
              (拦截中)
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="szlcsc_no"
          label="国内单号"
          align="center"
          width="140"
        >
          <template slot-scope="scope">
            <div
              v-for="item in scope.row.szlcsc_no"
              :key="item"
              class="redtxt"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="customer_code"
          label="客户编码"
          align="center"
          width="80"
        />
        <el-table-column
          prop="product_num"
          label="商品种类"
          align="center"
          width="90"
        >
          <template slot-scope="scope">
            <div>{{ scope.row.product_num }}</div>
            <div v-if="scope.row.is_has_reel == 1" class="redtxt">
              (含Reel服务)
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="package_count"
          label="件数"
          align="center"
          width="50"
        />
        <el-table-column
          prop="batch_total_amount"
          label="批次总金额"
          align="center"
          width="90"
        />
        <el-table-column
          prop="declare_amount"
          label="申报金额"
          align="center"
          width="90"
        />
        <el-table-column
          prop="freight_type"
          label="运费类型/物流渠道"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <div>{{ scope.row.freight_type_text }}</div>
            <div>{{ scope.row.express_forwarder_text }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="country"
          label="国家"
          align="center"
        />
        <el-table-column
          prop="status_text"
          label="发货状态"
          align="center"
          width="90"
        />
        <el-table-column
          prop="tracking_number"
          label="物流单号"
          align="center"
          width="120"
        >
          <template slot-scope="scope">
            <a
              :href="scope.row.express_url"
              target="_blank"
              class="bluelink"
            >{{ scope.row.tracking_number }}</a>
          </template>
        </el-table-column>
        <el-table-column
          prop="original_weight"
          label="原重量/实际称重重量（kg）"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.original_weight }}</span> / <span>{{ scope.row.real_weight }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="original_freight"
          label="原运费/实际称重运费"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <div :class="{redtxt: Math.abs(calculator.minus(scope.row.original_freight || 0, scope.row.real_freight || 0).done()) >= 10}">
              <span>{{ scope.row.original_freight }}</span> / <span>{{ scope.row.real_freight }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="send_at"
          label="发货时间"
          align="center"
          width="84"
        />
        <el-table-column
          prop="cabinet"
          label="货柜号"
          align="center"
          width="90"
        />
        <el-table-column
          prop="delivery_remarks"
          label="发货备注"
          align="center"
          width="160"
        >
          <template slot-scope="scope">
            <el-popover
              placement="left"
              width="400"
              trigger="click"
            >
              <div>
                <div v-for="(item, idx) in scope.row.delivery_remarks" :key="idx">
                  {{ item }}
                </div>
              </div>
              <span
                slot="reference"
                class="bluelink singleLine"
                :title="Array.isArray(scope.row.delivery_remarks) ? scope.row.delivery_remarks[0] : ''"
              >{{ Array.isArray(scope.row.delivery_remarks) ? scope.row.delivery_remarks[0] : '' }}</span>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页数据 -->
      <el-pagination
        v-if="tableData.length"
        layout="total, sizes, prev, pager, next, jumper"
        class="pagination"
        :current-page.sync="params.page"
        :page-size.sync="params.limit"
        :total="total"
        :page-sizes="[10, 20, 30]"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 以下写自定义弹窗 -->

    <!-- 撤销预报 -->
    <noForecastDialog ref="noForecastDialog" />
    <!-- 修改申报金额 -->
    <editDeclaredAmountDialog ref="editDeclaredAmountDialog" />
    <!-- 修改件数称重 -->
    <editNumWeightDialog ref="editNumWeightDialog" />
    <!-- 修改物流渠道 -->
    <editLogisticsDialog ref="editLogisticsDialog" />
    <!-- 修改物流单号 -->
    <editLogisticsNumDialog ref="editLogisticsNumDialog" />
    <!-- 修改预报单号 -->
    <forecastNumDialog ref="forecastNumDialog" />
    <!-- 购买保险 -->
    <buyInsuranceDialog ref="buyInsuranceDialog" />
    <!-- 上传运费账单 -->
    <uploadFrightDialog ref="uploadFrightDialog" />
  </div>
</template>

<script>
import { getDeliveryList, shipmentAlert, createDeclaration } from '@/api/deliveryManagement';
import noForecastDialog from '@/views/modules/deliveryManagement/deliveryList/components/noForecastDialog.vue';
import editDeclaredAmountDialog from '@/views/modules/deliveryManagement/deliveryList/components/editDeclaredAmountDialog.vue';
import editNumWeightDialog from '@/views/modules/deliveryManagement/deliveryList/components/editNumWeightDialog.vue';
import editLogisticsDialog from '@/views/modules/deliveryManagement/deliveryList/components/editLogisticsDialog.vue';
import editLogisticsNumDialog from '@/views/modules/deliveryManagement/deliveryList/components/editLogisticsNumDialog.vue';
import forecastNumDialog from '@/views/modules/deliveryManagement/deliveryList/components/forecastNumDialog.vue';
import buyInsuranceDialog from '@/views/modules/deliveryManagement/deliveryList/components/buyInsuranceDialog.vue';
import uploadFrightDialog from '@/views/modules/deliveryManagement/deliveryList/components/uploadFrightDialog.vue';
import calculator from '@/utils/calculator';

export default {
  name: 'deliveryList',
  components: {
    noForecastDialog,
    editDeclaredAmountDialog,
    editNumWeightDialog,
    editLogisticsDialog,
    editLogisticsNumDialog,
    forecastNumDialog,
    buyInsuranceDialog,
    uploadFrightDialog,
  },
  data() {
    return {
      // 加载动画
      loading: false,

      // 查询表单
      params: {
        status: '30',
        express_forwarder_type: '',
        batch_no: '',
        customer_code: '',
        order_no: '',
        szlcsc_no: '',
        tracking_number: '',
        country: '',
        freight_type: '',
        is_has_reel: '',
        has_delivery_remark: '',
        batch_total_amount: '',
        page: 1,
        limit: 20,
      },

      // 查询下拉选项
      optionList: {
        status: {},
        express: {},
        freight: {
          1: '寄付',
          2: '到付',
        },
        isHasReelList: {
          1: '是',
          2: '否',
        },
        hasDeliveryRemarkList: {
          1: '是',
          2: '否',
        },
        batchTotalAmountList: {
          700: '>=700',
        },
      },

      // 操作按钮
      btnList: [
        { id: 1, name: '预报', fn: this.forecastFn },
        { id: 2, name: '撤销预报', fn: this.noForecastFn },
        { id: 3, name: '购买保险', fn: this.buyInsuranceFn },
        { id: 4, name: '快递单', fn: this.courierFn },
        { id: 5, name: '随货发票', fn: this.invoiceGoodsFn },
        { id: 6, name: '装箱单', fn: this.packingListFn },
        { id: 7, name: '修改申报金额', fn: this.editDeclaredAmountFn },
        { id: 8, name: '修改件数称重', fn: this.editNumWeightFn },
        { id: 9, name: '修改物流渠道', fn: this.editLogisticsFn },
        { id: 10, name: '修改物流单号', fn: this.editLogisticsNumFn },
        { id: 11, name: '修改预报单号', fn: this.forecastNumFn },
        { id: 12, name: '生成报关单据', fn: this.generateCustomsFn },
        { id: 13, name: '上传运费账单', fn: this.uploadFrightFn },
      ],

      // 表格数据
      tableData: [],

      // 数据总数
      total: 0,

      // 表格选中项
      selectItems: [],

      // 计算插件
      calculator,

      // 已预报状态码
      afterForecastStatus: 40,
      // 待揽件状态码  ===已发货
      pendingPackageStatus: 50,
    };
  },
  created() {
    if (Object.keys(this.$route.params).length) {
      Object.assign(this.params, this.$route.params);
    }
    this.getList();
  },
  methods: {
    // 获取列表数据
    getList() {
      const params = {};
      Object.keys(this.params).forEach((key) => {
        if (this.params[key] !== '') {
          params[key] = this.params[key];
        }
      });

      this.loading = true;
      getDeliveryList(params).then(({ data }) => {
        this.tableData = data.list.data;
        this.total = data.list.total;

        // 搜索下拉选项
        this.optionList.status = data.status;
        this.optionList.express = data.express;
      }).finally(() => {
        this.loading = false;
      });
    },
    // 查询
    search() {
      this.params.page = 1;
      this.getList();
    },
    // 重置
    reset(params) {
      this.$refs.searchForm.resetFields();
      // 如果有筛选条件，重置后添加新的条件进行搜索
      if (params) {
        Object.assign(this.params, params);
      }
      this.search();
    },

    // 页数改变时
    handleCurrentChange() {
      this.getList();
    },
    // 每页个数改变时
    handleSizeChange() {
      this.getList();
    },

    // 以下写自定义方法

    // 预报
    forecastFn() {
      if (!this.selectItems.length) {
        this.$message.warning('请选择数据！');
        return;
      }

      if (!this.beforeForecastStatusFn()) {
        return;
      }

      this.loading = true;
      shipmentAlert({ batches: this.selectItems.map(e => e.batch_no) }).then(({ data }) => {
        let str = '';
        data.alert_success.forEach(e => {
          str += `<div style="color: #62c42e">批次 ${e} 预报成功！</div>`;
        });
        data.alert_fail.forEach(e => {
          str += `<div style="color: #f00">批次 ${e.batch_no} 预报失败！原因：${e.message}</div>`;
        });
        this.$alert(str, '预报结果', {
          dangerouslyUseHTMLString: true,
        }).finally(() => {
          this.getList();
        });
      }).finally(() => {
        this.loading = false;
      });
    },

    // 快递单
    courierFn() {
      if (this.selectItems.length !== 1) {
        this.$message.warning('请选择一条数据！');
        return;
      }

      if (this.selectItems[0].label_url) {
        window.open(this.selectItems[0].label_url);
      } else {
        this.$message.error('该条数据没有快递单链接！');
      }
    },

    // 随货发票
    invoiceGoodsFn() {
      if (this.selectItems.length !== 1) {
        this.$message.warning('请选择一条数据！');
        return;
      }

      if (!this.afterForecastStatusFn()) {
        return;
      }

      const item = this.selectItems[0];
      this.$router.push({ name: 'commercialInvoice', query: {
        id: item.id,
        freight_type: item.freight_type,
        express_forwarder_type: item.express_forwarder_type,
      }});
    },

    // 装箱单
    packingListFn() {
      if (this.selectItems.length !== 1) {
        this.$message.warning('请选择一条数据！');
        return;
      }

      if (!this.afterForecastStatusFn()) {
        return;
      }

      this.$router.push({ name: 'packingListDetail', query: { id: this.selectItems[0].id }});
    },

    // 撤销预报
    noForecastFn() {
      if (this.selectItems.length !== 1) {
        this.$message.warning('请选择一条数据！');
        return;
      }

      if (!this.pendingPackageStatusFn()) {
        return;
      }

      this.$refs.noForecastDialog.show(this.selectItems[0], () => {
        this.getList();
      });
    },

    // 修改申报金额
    editDeclaredAmountFn() {
      if (this.selectItems.length !== 1) {
        this.$message.warning('请选择一条数据！');
        return;
      }

      if (!this.beforeForecastStatusFn()) {
        return;
      }

      this.$refs.editDeclaredAmountDialog.show(this.selectItems[0], () => {
        this.getList();
      });
    },

    // 修改件数称重
    editNumWeightFn() {
      if (this.selectItems.length !== 1) {
        this.$message.warning('请选择一条数据！');
        return;
      }

      if (!this.beforeForecastStatusFn()) {
        return;
      }

      this.$refs.editNumWeightDialog.show(this.selectItems[0], () => {
        this.getList();
      });
    },

    // 修改物流渠道
    editLogisticsFn() {
      if (this.selectItems.length !== 1) {
        this.$message.warning('请选择一条数据！');
        return;
      }

      if (!this.beforeForecastStatusFn()) {
        return;
      }

      this.$refs.editLogisticsDialog.show(this.selectItems[0], () => {
        this.getList();
      });
    },

    // 修改物流单号
    editLogisticsNumFn() {
      if (this.selectItems.length !== 1) {
        this.$message.warning('请选择一条数据！');
        return;
      }

      if (!this.beforeForecastStatusFn()) {
        return;
      }

      this.$refs.editLogisticsNumDialog.show(this.selectItems[0], () => {
        this.getList();
      });
    },

    // 修改预报单号
    forecastNumFn() {
      if (this.selectItems.length !== 1) {
        this.$message.warning('请选择一条数据！');
        return;
      }

      if (!this.beforeForecastStatusFn()) {
        return;
      }

      this.$refs.forecastNumDialog.show(this.selectItems[0], () => {
        this.getList();
      });
    },

    // 购买保险
    buyInsuranceFn() {
      if (this.selectItems.length !== 1) {
        this.$message.warning('请选择一条数据！');
        return;
      }

      if (!this.beforeForecastStatusFn()) {
        return;
      }

      this.$refs.buyInsuranceDialog.show(this.selectItems[0], () => {
        this.getList();
      });
    },

    // 生成报关单据
    generateCustomsFn() {
      if (this.selectItems.length !== 1) {
        this.$message.warning('请选择一条数据！');
        return;
      }

      if (!this.afterForecastStatusFn()) {
        return;
      }

      this.loading = true;
      createDeclaration({ batch_no: this.selectItems[0].batch_no }).then(({ data }) => {
        this.$message.success('生成报关单据成功！');
      }).finally(() => {
        this.loading = false;
      });
    },

    // 上传运费账单
    uploadFrightFn() {
      this.$refs.uploadFrightDialog.show({}, () => {
        this.getList();
      });
    },

    // 判断选择的数据是否都是未预报状态
    beforeForecastStatusFn() {
      if (this.selectItems.some((e) => e.status >= this.afterForecastStatus)) {
        this.$message.error('请选择未预报的数据！');
        return false;
      } else {
        return true;
      }
    },

    // 判断选择的数据是否都是已预报状态
    afterForecastStatusFn() {
      if (this.selectItems.some((e) => e.status < this.afterForecastStatus)) {
        this.$message.error('请选择已预报的数据！');
        return false;
      } else {
        return true;
      }
    },

    // 判断选择的数据是否都是未发货状态
    pendingPackageStatusFn() {
      if (this.selectItems.some((e) => e.status >= this.pendingPackageStatus)) {
        this.$message.error('请选择未发货的数据！');
        return false;
      } else {
        return true;
      }
    },

    // 进入发货详情
    gotoDeliveryDetail(row) {
      this.$router.push({ name: 'deliveryDetail', query: { id: row.id }});
    },
  },
};
</script>
