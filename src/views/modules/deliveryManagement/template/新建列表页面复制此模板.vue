<style lang="scss" scoped>
.templatePage {
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
</style>

<template>
  <div class="templatePage">
    <!-- 头部搜索 -->
    <el-form
      ref="searchForm"
      size="mini"
      :inline="true"
      :model="params"
    >
      <el-form-item label="批次号" prop="order_no">
        <el-input v-model.trim="params.order_no" class="input-width" />
      </el-form-item>
      <el-form-item label="发货状态" prop="country_code">
        <el-select
          v-model="params.country_code"
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
      <el-form-item prop="intercept_status">
        <el-checkbox
          v-model="params.intercept_status"
          true-label="1"
          false-label=""
        >
          含Reel服务
        </el-checkbox>
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
        :type="item.type || 'primary'"
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
          prop="expected_delivery"
          label="订货预计交期"
          align="center"
        />
        <el-table-column label="应付金额" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.total }}</div>
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

  </div>
</template>

<script>
import { orderIndex } from '@/api/order';

export default {
  name: 'templatePage',
  components: {

  },
  data() {
    return {
      // 加载动画
      loading: false,

      // 查询表单
      params: {
        order_no: '',
        country_code: '',
        intercept_status: '',
        created_at: [],
        page: 1,
        limit: 20,
      },

      // 查询下拉选项
      optionList: {
        a: [],
      },

      // 操作按钮
      btnList: [
        { id: 1, name: '预报', fn: '' },
        { id: 2, name: '快递单', fn: '', type: 'warning' },
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
      orderIndex(params).then(({ data }) => {
        this.tableData = data.list.data;
        this.total = data.list.total;
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

  },
};
</script>
