<style lang="scss" scoped>
.toReturnDomesticRecords {
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
.bluelink{
  color: #06f;
  cursor: pointer;
}
</style>

<template>
  <div class="toReturnDomesticRecords">
    <!-- 头部搜索 -->
    <el-form
      ref="searchForm"
      size="mini"
      :inline="true"
      :model="params"
    >
      <el-form-item label="退回状态" prop="status">
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
      <el-form-item label="订单号" prop="order_no">
        <el-input v-model.trim="params.order_no" class="input-width" />
      </el-form-item>
      <el-form-item label="国内单号" prop="szlcsc_no">
        <el-input v-model.trim="params.szlcsc_no" class="input-width" />
      </el-form-item>
      <el-form-item label="客户编码" prop="customer_code">
        <el-input v-model.trim="params.customer_code" class="input-width" />
      </el-form-item>
      <el-form-item label="国内入库状态" prop="warehouse_status">
        <el-select
          v-model="params.warehouse_status"
          filterable
          clearable
        >
          <el-option label="全部" value="" />
          <el-option
            v-for="(v, k) in optionList.warehouse_status"
            :key="k"
            :label="v"
            :value="k"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">
          查询
        </el-button>
        <el-button type="info" @click="reset">
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
          prop="order_no"
          label="订单号"
          align="center"
        >
          <template slot-scope="scope">
            <div class="bluelink" @click="toDetail(scope.row)">
              {{ scope.row.order_no }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="szlcsc_no"
          label="国内单号"
          align="center"
        />
        <el-table-column
          prop="customer_code"
          label="客户编码"
          align="center"
        />
        <el-table-column
          prop="quantity"
          label="需退回商品数"
          align="center"
        >
          <template slot-scope="scope">
            <div class="bluelink" @click="lookReturnGoodsFn(scope.row)">
              {{ scope.row.quantity }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="退回状态"
          align="center"
        />
        <el-table-column
          prop="handler"
          label="处理人"
          align="center"
        />
        <el-table-column
          prop="handling_time"
          label="处理时间"
          align="center"
        />
        <el-table-column
          prop="warehouse_status"
          label="国内入库状态"
          align="center"
        />
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

    <!-- 标记已退回 -->
    <tagReturnDialog ref="tagReturnDialog" />
    <!-- 查看退回商品 -->
    <lookReturnGoodsDialog ref="lookReturnGoodsDialog" />
  </div>
</template>

<script>
import { getReturnRecordsList } from '@/api/deliveryManagement';
import tagReturnDialog from '@/views/modules/deliveryManagement/toReturnDomesticRecords/components/tagReturnDialog.vue';
import lookReturnGoodsDialog from '@/views/modules/deliveryManagement/toReturnDomesticRecords/components/lookReturnGoodsDialog.vue';

export default {
  name: 'toReturnDomesticRecords',
  components: {
    tagReturnDialog,
    lookReturnGoodsDialog,
  },
  data() {
    return {
      // 加载动画
      loading: false,

      // 查询表单
      params: {
        status: '',
        order_no: '',
        szlcsc_no: '',
        customer_code: '',
        warehouse_status: '',
        page: 1,
        limit: 20,
      },

      // 查询下拉选项
      optionList: {
        status: {},
        warehouse_status: {},
      },

      // 操作按钮
      btnList: [
        { id: 1, name: '标记已退回', fn: this.tagReturnFn },
      ],

      // 表格数据
      tableData: [],

      // 数据总数
      total: 0,

      // 表格选中项
      selectItems: [],
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
      getReturnRecordsList(params).then(({ data }) => {
        this.tableData = data.list.data;
        this.total = data.list.total;

        // 搜索下拉选项
        this.optionList.status = data.status;
        this.optionList.warehouse_status = data.warehouse_status;
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

    // 标记已退回
    tagReturnFn() {
      if (this.selectItems.length !== 1) {
        this.$message.warning('请选择一条数据！');
        return;
      }

      if (this.selectItems.some((e) => e.status !== '待退回')) {
        this.$message.error('请选择待退回的数据！');
        return;
      }

      this.$refs.tagReturnDialog.show(this.selectItems[0], () => {
        this.getList();
      });
    },

    // 查看退回商品
    lookReturnGoodsFn(row) {
      this.$refs.lookReturnGoodsDialog.show(row);
    },

    // 进入订单详情
    toDetail(row) {
      this.$router.push({ name: 'orderDetail', query: { orderId: row.order_no }});
    },
  },
};
</script>
