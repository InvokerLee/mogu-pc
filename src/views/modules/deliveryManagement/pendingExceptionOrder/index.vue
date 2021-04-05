<style lang="scss" scoped>
.pendingExceptionOrder {
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
.bluelink{
  color: #06f;
  cursor: pointer;
}
</style>

<template>
  <div class="pendingExceptionOrder">
    <!-- 头部搜索 -->
    <el-form
      ref="searchForm"
      size="mini"
      :inline="true"
      :model="params"
    >
      <el-form-item label="处理状态" prop="status">
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
      <el-form-item label="异常类型" prop="type">
        <el-select
          v-model="params.type"
          filterable
          clearable
        >
          <el-option label="全部" value="" />
          <el-option
            v-for="(v, k) in optionList.type"
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
          prop="order_status"
          label="订单状态"
          align="center"
        />
        <el-table-column
          prop="type"
          label="异常类型"
          align="center"
        />
        <el-table-column
          prop="quantity"
          label="异常商品数"
          align="center"
        >
          <template slot-scope="scope">
            <div class="bluelink" @click="lookErrorGoodsFn(scope.row)">
              {{ scope.row.quantity }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="way"
          label="处理方式"
          align="center"
        />
        <el-table-column
          prop="remark"
          label="原因"
          align="center"
        />
        <el-table-column
          prop="status"
          label="处理状态"
          align="center"
        >
          <template slot-scope="scope">
            <div :class="{redtxt: scope.row.status == '待处理'}">
              {{ scope.row.status }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="operator"
          label="操作人"
          align="center"
        />
        <el-table-column
          prop="operation_time"
          label="操作时间"
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

    <!-- 标记已处理 -->
    <tagProcessDialog ref="tagProcessDialog" />
    <!-- 查看异常商品 -->
    <lookErrorGoodsDialog ref="lookErrorGoodsDialog" />
  </div>
</template>

<script>
import { getAbnormalList } from '@/api/deliveryManagement';
import tagProcessDialog from '@/views/modules/deliveryManagement/pendingExceptionOrder/components/tagProcessDialog.vue';
import lookErrorGoodsDialog from '@/views/modules/deliveryManagement/pendingExceptionOrder/components/lookErrorGoodsDialog.vue';

export default {
  name: 'pendingExceptionOrder',
  components: {
    tagProcessDialog,
    lookErrorGoodsDialog,
  },
  data() {
    return {
      // 加载动画
      loading: false,

      // 查询表单
      params: {
        status: '',
        type: '',
        order_no: '',
        szlcsc_no: '',
        page: 1,
        limit: 20,
      },

      // 查询下拉选项
      optionList: {
        status: {},
        type: {},
      },

      // 操作按钮
      btnList: [
        { id: 1, name: '标记已处理', fn: this.tagProcessFn },
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
      getAbnormalList(params).then(({ data }) => {
        this.tableData = data.list.data;
        this.total = data.list.total;

        // 搜索下拉选项
        this.optionList.status = data.status;
        this.optionList.type = data.type;
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

    // 标记已处理
    tagProcessFn() {
      if (this.selectItems.length !== 1) {
        this.$message.warning('请选择一条数据！');
        return;
      }

      if (this.selectItems.some((e) => e.status !== '待处理')) {
        this.$message.error('请选择待处理的数据！');
        return;
      }

      this.$refs.tagProcessDialog.show(this.selectItems[0], () => {
        this.getList();
      });
    },

    // 查看异常商品
    lookErrorGoodsFn(row) {
      this.$refs.lookErrorGoodsDialog.show(row);
    },

    // 进入订单详情
    toDetail(row) {
      this.$router.push({ name: 'orderDetail', query: { orderId: row.order_no }});
    },
  },
};
</script>
