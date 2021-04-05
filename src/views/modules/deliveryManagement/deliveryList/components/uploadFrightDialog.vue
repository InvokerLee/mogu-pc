<style lang="scss" scoped>
.uploadwrap{
  display: flex;
  .rightinput{
    flex: auto;
    padding-left: 10px;
  }
}
.mt30{
  margin-top: 30px;
}
.bottxtwrap{
  line-height: 22px;
}
</style>

<template>
  <el-dialog
    width="636px"
    title="上传运费账单"
    :visible.sync="dialog.show"
    :close-on-click-modal="false"
  >
    <div v-loading="dialog.loading">
      <div class="uploadwrap">
        <div>
          <el-upload
            ref="upload"
            :headers="dialog.headers"
            :action="dialog.uploadApi"
            :file-list="dialog.fileList"
            :show-file-list="false"
            :auto-upload="false"
            :before-upload="beforeUploadFn"
            :on-success="uploadSuccessFn"
            :on-change="handleChangeFn"
          >
            <el-button slot="trigger" size="mini" type="primary">选择文件</el-button>
          </el-upload>
        </div>
        <div class="rightinput">
          <el-input
            placeholder="请上传.csv文件"
            v-model="dialog.fileName"
            readonly
            size="mini"
          >
          </el-input>
        </div>
      </div>
      <div class="mt30 bottxtwrap">
        <div>
          只能处理格式为.csv文件
        </div>
        <div>
          顺丰的账单文件名需要带：SF或者sf
        </div>
        <div>
          顺丰账单格式：A列：运单号，B列：重量，C列：应收金额，D列：折扣金额，E列：实收金额
        </div>
        <div>
          除顺丰以外其他账单格式：A列：运单号，B列：重量，C列：收费金额
        </div>
      </div>
    </div>
    <div slot="footer">
      <el-button size="mini" @click="dialog.show = false">
        取消
      </el-button>
      <el-button
        type="primary"
        size="mini"
        :loading="dialog.loading"
        @click="submitFn()"
      >
        开始上传
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import request from '@/utils/request/index.js';
import { getToken } from '@/utils/cookie';

export default {
  name: 'uploadFrightDialog',
  data() {
    const AUTH_KEY = 'Bearer';
    return {
      // 数据暂存
      params: {},
      // 回调
      cb: null,

      // 弹窗相关
      dialog: {
        show: false,
        loading: false,

        // 上传相关
        headers: { Authorization: AUTH_KEY + getToken() },
        uploadApi: request.defaults.baseURL + '/order/batches/uploadFreightBill',
        fileList: [],
        fileName: '',
      },
    };
  },
  methods: {
    // 初始化方法
    show(params, cb) {
      this.params = params;
      this.cb = cb;

      this.dialog.show = true;

      // 以下写此弹窗初始化方法
      this.dialog.fileList = [];
      this.dialog.fileName = '';
    },

    // 提交方法
    submitFn() {
      if (!this.dialog.fileList.length) {
        this.$message.error('请上传.csv格式文件！');
        return;
      }
      this.$refs.upload.submit();
    },

    // 文件上传之前
    beforeUploadFn(file) {
      this.dialog.loading = true;
    },
    // 文件上传成功
    uploadSuccessFn(response, file, fileList) {
      this.dialog.loading = false;
      if (response.code !== 200) {
        this.$message.error(response.message || '文件数据错误！');
        return;
      }
      this.dialog.show = false;
      this.cb && this.cb();
    },
    // 文件改变时
    handleChangeFn(file, fileList) {
      this.dialog.fileList = fileList.slice(-1);
      this.dialog.fileName = file.name;
      const hz = file.name.split('.').pop();
      if (hz.toLowerCase() !== 'csv') {
        this.$message.error('请上传.csv格式文件！');
        this.dialog.fileList = [];
        this.dialog.fileName = '';
      }
    },
  },
};
</script>
