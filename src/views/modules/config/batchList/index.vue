
<template>
  <base-wrapper>
    <div class="batch-list">
      <el-form ref="searchForm" hide-details size="mini" inline :model="params">
        <el-form-item label="供应商">
          <el-input v-model.trim="params.providerName" placeholder="请输入供应商" />
        </el-form-item>
        <el-form-item label="产品">
          <el-input v-model.trim="params.productName" placeholder="产品名称/规格/条码" />
        </el-form-item>
        <el-form-item label="批号">
          <el-input v-model.trim="params.batchNum" class="w90px" placeholder="批号" />
        </el-form-item>
        <el-form-item label="生产日期">
          <el-date-picker
            v-model="dateRange"
            style="width: 250px;"
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
        <el-form-item label="状态">
          <el-select v-model="params.state" placeholder="请选择" class="w90px">
            <el-option label="全部" value="" />
            <el-option label="有效" :value="1" />
            <el-option label="停用" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="info" @click="reset">重置</el-button>
          <span style="margin: 0 20px;">
            <el-divider direction="vertical"></el-divider>
          </span>
          <el-button type="primary" size="mini">批量设置无效</el-button>
        </el-form-item>
      </el-form>
      <div>
        <el-table
          v-adaptive-height="{bottomOffset: 40}"
          v-loading="loading"
          border
          size="mini"
          height="120px"
          :data="tableData"
          @selection-change="(val) => { selectItems = val }"
        >
          <el-table-column :width="55" type="selection" align="center" />
          <!-- <el-table-column :width="60" label="操作" type="action" align="center">
            <template slot-scope="scope">
              <el-row type="flex" justify="space-around" class="font-16">
                <a class="font-blue el-icon-edit" @click="edit(scope.row)"></a>
                <a class="font-red el-icon-delete" @click="del(scope.row)"></a>
              </el-row>
            </template>
          </el-table-column> -->
          <el-table-column prop="providerName" label="供应商名称" align="center" />
          <el-table-column prop="productName" label="产品" align="center" />
          <el-table-column :width="80" prop="batchNum" label="批号" align="center" />
          <el-table-column :width="90" prop="productDate" label="生产日期" align="center" />
          <el-table-column :width="60" prop="shortTime" label="保质期" align="center" />
          <el-table-column :width="90" prop="productValidityDate" label="有效期至" align="center" />
          <el-table-column :width="90" prop="createDate" label="建档日期" align="center" />
          <el-table-column prop="text" label="备注" align="center" />
          <el-table-column :width="60" label="状态" align="center">
            <template slot-scope="scope">
              <span>
                {{ ['停用', '有效'][scope.row.state] }}
              </span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-if="tableData.length"
          layout="total, sizes, prev, pager, next, jumper"
          class="pagination py-3"
          :current-page.sync="params.curentPage"
          :page-size="params.pageSize"
          :total="total"
          :page-sizes="[10,20,30]"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <form-dialog
      v-if="dialog.show"
      :visible="dialog.show"
      :item="dialog.item"
      @success="actionSuccess"
      @cancel="closeDialog"
    />
  </base-wrapper>
</template>

<script>
import { batchInfoList, delBatch } from '@/api/config';

export default {
  name: 'batchList',
  components: {
  },
  data() {
    return {
      loading: false,
      params: {
        providerName: '',
        productName: '',
        batchNum: '',
        state: '',
        curentPage: 1,
        pageSize: 10
      },
      dateRange: [],
      total: 0,
      tableData: [],
      selectItems: {},
      dialog: {
        show: false,
        name: '',
        item: {}
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      const params = {};
      Object.keys(this.params).forEach((key) => {
        if (this.params[key] !== '') {
          params[key] = this.params[key];
        }
      });
      Object.assign(params, this.formatDate(this.dateRange));
      this.loading = true;
      batchInfoList(params).then(({ result }) => {
        this.tableData = result.dataList;
        this.total = result.totalCount;
      }).catch(() => {}).finally(() => {
        this.loading = false;
      });
    },
    search() {
      this.params.curentPage = 1;
      this.getList();
    },
    reset() {
      Object.assign(this.params, this.$options.data.call(this).params);
      this.getList();
    },
    handleSizeChange(val) {
      this.params.pageSize = val;
      this.getList();
    },
    handleCurrentChange() {
      this.getList();
    },
    edit(item) {
      this.dialog.item = item;
      this.dialog.show = true;
    },
    closeDialog() {
      this.dialog.name = '';
      this.dialog.show = false;
    },
    actionSuccess() {
      this.getList();
      this.closeDialog();
    },
    del(item) {
      this.$confirm('确认要删除吗?', '删除提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => delBatch(item.id)).then(() => {
        this.$message.success('删除成功');
        this.getList();
      }).catch(() => {});
    }
  }
};
</script>

<style lang="scss" scoped>
.batch-list {
  width: 100%;
  .tar {
    width: auto;
    flex: 0 0 auto;
  }
  .pagination {
    text-align: center;
  }
}
</style>
