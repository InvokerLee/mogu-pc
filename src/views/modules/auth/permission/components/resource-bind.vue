<template>
  <el-dialog
    width="540px"
    title="绑定资源"
    :close-on-click-modal="false"
    :visible="visible"
    @close="cancel"
  >
    <el-row type="flex" justify="center" align="middle">
      <span>添加资源：</span>
      <el-autocomplete
        class="search-width"
        size="mini"
        placeholder="名称、url"
        clearable
        v-model="rescKeyWords"
        :trigger-on-focus="false"
        :fetch-suggestions="querySearch"
        @select="handleSelect"
      >
        <template slot-scope="scope">
          <div class="name">{{ scope.item.resc_name }}</div>
          <span class="rescUrl">{{ scope.item.url }}</span>
        </template>
      </el-autocomplete>
    </el-row>
    <el-table
      class="m-t-10"
      border
      size="mini"
      v-loading="loading"
      :data="tableData"
      max-height="400px"
    >
      <el-table-column width="55" type="index" align="center"></el-table-column>
      <el-table-column prop="resc_name" align="center" label="资源名称"></el-table-column>
      <el-table-column prop="url" align="center" label="url"></el-table-column>
      <el-table-column align="center" label="操作" width="80px">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="remove(scope.row, scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import { getBoundRescs, getUnboundRescs, bindResc, unBindResc } from '@/api/auth/permission';

export default {
  props: ['visible', 'item'],
  data() {
    return {
      loading: false,
      rescKeyWords: '',
      tableData: [],
    };
  },
  created() {
    this.getRescs();
  },
  methods: {
    getRescs() {
      if (!this.item || !this.item.id) return;
      this.loading = true;
      getBoundRescs(this.item.id).then((res) => {
        this.tableData = res.data.data;
      }).catch(() => {}).finally(() => {
        this.loading = false;
      });
    },
    querySearch(queryString, cb) {
      const params = {
        key: queryString,
      };
      getUnboundRescs(this.item.id, params)
        .then(({ data }) => {
          cb(data.data);
        });
    },
    handleSelect(item) {
      if (!this.item || !this.item.id) {
        this.$message.warning('功能ID不存在，无法绑定');
        return;
      }
      const params = {
        resc_id: item.id,
      };
      bindResc(this.item.id, params).then((res) => {
        this.$message.success('添加资源成功');
        this.tableData.unshift(item);
      }).catch(() => {});
    },
    remove(row, rowIndex) {
      this.$confirm('确定删除该资源？', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => unBindResc(this.item.id, { resc_id: row.id })).then(() => {
        this.$message.success('删除资源成功');
        const index = this.tableData.findIndex(v => v.id === row.id);
        this.tableData.splice(index, 1);
      }).catch(() => {});
    },
    cancel() {
      this.$emit('cancel');
    },
  },
};
</script>

<style lang="scss" scoped>
.search-width {
  width: 320px;
}
.name {
  text-overflow: ellipsis;
  overflow: hidden;
}
.rescUrl {
  font-size: 12px;
  color: #b4b4b4;
}
</style>
