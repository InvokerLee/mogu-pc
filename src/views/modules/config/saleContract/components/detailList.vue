<template>
  <div v-if="rowId">
    <el-card shadow="never" class="detail-list">
      <div slot="header">
        <el-form ref="searchForm" hide-details size="mini" inline :model="params">
          <el-form-item label="">
            <el-tag type="info">合同产品</el-tag>
          </el-form-item>
          <el-form-item label="输入搜索">
            <el-input v-model.trim="params.productName" placeholder="品名/规格/条码" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="info" @click="reset">重置</el-button>
            <span style="margin: 0 20px;">
              <el-divider direction="vertical"></el-divider>
            </span>
            <el-button type="success" size="mini" @click="add">新增</el-button>
            <!-- <el-button type="primary" size="mini">导入</el-button> -->
            <el-upload
              ref="uploader"
              class="uploader"
              action=""
              :limit="1"
              :show-file-list="false"
              :http-request="uploadRequest"
            >
              <el-button slot="trigger" size="mini" type="primary">导入</el-button>
            </el-upload>
            <el-button type="primary" size="mini" @click="download">导出</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        v-loading="loading"
        border
        size="mini"
        :max-height="600"
        :data="tableData"
      >
        <el-table-column :width="60" label="操作" type="action" align="center">
          <template slot-scope="scope">
            <el-row type="flex" justify="space-around" class="font-16">
              <a class="font-blue el-icon-edit" @click="edit(scope.row)"></a>
              <a class="font-red el-icon-delete" @click="del(scope.row)"></a>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column prop="productName" label="品名规格" align="center" />
        <el-table-column prop="goodsNum" label="货号" align="center" />
        <el-table-column :width="100" prop="productCode" label="条码" align="center" />
        <el-table-column :width="60" prop="productUnit" label="单位" align="center" />
        <el-table-column :min-width="100" prop="taxPrice" label="供货价(含税)" align="center" />
        <el-table-column :min-width="100" prop="noTaxPrice" label="供货价(未税)" align="center" />
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
      <item-form
        v-if="dialog.show"
        :visible="dialog.show"
        :item="dialog.item"
        :salesContractId="rowId"
        @success="actionSuccess"
        @cancel="closeDialog"
      />
    </el-card>
  </div>
</template>

<script>
import { salescontractDetailList, delSalescontractDetail, uploadSCD } from '@/api/config';

import itemForm from './item-form';
export default {
  components: {
    itemForm
  },
  props: ['rowId'],
  data() {
    return {
      loading: false,
      params: {
        productName: '',
        curentPage: 1,
        pageSize: 10
      },
      total: 0,
      tableData: [],
      dialog: {
        show: false,
        item: {}
      }
    };
  },
  watch: {
    rowId(val) {
      if (!val) {
        Object.assign(this.params, this.$options.data.call(this).params);
        return;
      }
      this.getList();
    }
  },
  methods: {
    getList() {
      const params = {
        salesContractId: this.rowId
      };
      Object.keys(this.params).forEach((key) => {
        if (this.params[key] !== '') {
          params[key] = this.params[key];
        }
      });
      this.loading = true;
      salescontractDetailList(params).then(({ result }) => {
        this.tableData = result.dataList;
        this.total = result.totalCount;
      }).finally(() => {
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
    add() {
      this.dialog.item = {};
      this.dialog.show = true;
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
    handleSizeChange(val) {
      this.params.pageSize = val;
      this.getList();
    },
    handleCurrentChange() {
      this.getList();
    },
    del(item) {
      this.$confirm('确认要删除吗?', '删除提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => delSalescontractDetail(item.id)).then(() => {
        this.$message.success('删除成功');
        this.getList();
      }).catch(() => {});
    },
    download() {
      this.$download('/salescontractdetail/export', { ...this.params, salesContractId: this.rowId });
    },
    uploadRequest(params) {
      const formData = new FormData();
      formData.append('file', params.file);
      formData.append('salesContractId', this.rowId);
      uploadSCD(formData).then(() => {
        this.$message.success('上传成功');
        this.getList();
      }).catch(() => {}).finally(() => {
        this.$refs.uploader.clearFiles();
      });
    },
    test() {
      uploadSCD();
    }
  }
};
</script>

<style lang="scss" scoped>
.detail-list {
  width: 100%;
  margin-top: 3px;
  .pagination {
    text-align: center;
  }
  .uploader {
    display: inline-block;
    margin: 0 10px;
  }
  ::v-deep {
    .el-card__header, .el-card__body  {
        padding: 3px 3px 0;
    }
  }
}
</style>
