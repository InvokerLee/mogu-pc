<style lang="scss" scoped>
.receiptDetail{
  width: 1050px;
  height: 100%;
  overflow: auto;
  padding: 20px;
  font-size: 14px;
  .receiptDetailbox{
    padding: 10px 0 0;
    .title{
      font-size: 16px;
      border-bottom: 1px solid #bcbcbc;
      padding: 8px 0;
      margin-bottom: 15px;
    }
    .delbtn{
      margin-left: 30px;
      text-decoration: underline;
      color: #3a88ff;
      cursor: pointer;
    }
  }
}
.bluelink{
  color: #06f;
  cursor: pointer;
}
</style>

<template>
  <div v-loading="loading" class="receiptDetail">
    <el-row type="flex" justify="space-between">
      <el-button
        type="info"
        size="mini"
        icon="el-icon-back"
        @click="goBack()"
      >
        返回
      </el-button>
      <template v-if="[1, 2].includes(form.status)">
        <span v-if="!isEditing">
          <el-button
            type="primary"
            size="mini"
            @click="startEditFn()"
          >
            修改
          </el-button>
          <el-button
            type="primary"
            size="mini"
            v-if="form.status === 1"
            @click="changeStatus2Fn()"
          >
            确认已汇款
          </el-button>
          <el-button
            type="primary"
            size="mini"
            v-if="form.status === 2"
            @click="changeStatus3Fn()"
          >
            确认已到账
          </el-button>
        </span>
        <span v-else>
          <el-button
            type="primary"
            size="mini"
            @click="ednEditFn()"
          >
            保存
          </el-button>
        </span>
      </template>
    </el-row>

    <div class="receiptDetailbox">
      <el-form
        ref="form"
        :model="form"
        :rules="formRules"
        size="mini"
        label-width="114px"
      >
        <div class="title">客户信息</div>
        <el-row>
          <el-col :span="8">
            <el-form-item label="客户编号：">
              <div>{{ form.customer_code }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="4">
            <el-form-item label="客户名称：">
              <div>{{ form.customer_username }}</div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="汇款人名称：" prop="remitter_name">
              <el-input v-model.trim="form.remitter_name" :disabled="!isEditing" />
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="4">
            <el-form-item label="汇款账号：" prop="remitter_account">
              <el-input v-model.trim="form.remitter_account" :disabled="!isEditing" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="汇款银行：" prop="remitter_bank">
              <el-input v-model.trim="form.remitter_bank" :disabled="!isEditing" />
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="4">
            <el-form-item label="Swift Code：" prop="swift_code">
              <el-input v-model.trim="form.swift_code" :disabled="!isEditing" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24" v-loading="fileLoading['remitter_certificate']">
            <el-form-item label="汇款凭证：">
              <div style="margin-bottom: 10px;">
                <span @click="openPreviewFn(form.remitter_certificate)" class="bluelink">{{ form.remitter_certificate }}</span>
              </div>
              <el-upload
                ref="upload"
                name="bank_receipt_file"
                :headers="headers"
                :action="uploadApi"
                :file-list="fileList"
                :show-file-list="false"
                :before-upload="file => beforeUploadFn(file, 'remitter_certificate')"
                :on-success="(response, file, fileList) => uploadSuccessFn(response, file, fileList, 'remitter_certificate')"
              >
                <el-button slot="trigger" size="mini" type="primary">重新上传</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>

        <div class="title">到账信息</div>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="汇款金额：" prop="money_remitter">
              <el-input v-model.trim="form.money_remitter" :disabled="!isEditing" />
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label-width="0" prop="currency">
              <el-input v-model.trim="form.currency" :disabled="!isEditing" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="手续费：">
              <el-input v-model.trim="form.money_fee" :disabled="!isEditing" />
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="4">
            <el-form-item label="实际到账金额：">
              <el-input v-model.trim="form.money_receive" disabled />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="到账日期：">
              <el-input v-model.trim="form.transfer_at" :disabled="!isEditing" />
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="4">
            <el-form-item label="流水号：">
              <el-input v-model.trim="form.transaction_no" :disabled="!isEditing" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="收款人名称：">
              <el-input v-model.trim="form.payee_name" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="4">
            <el-form-item label="收款银行账号：">
              <el-input v-model.trim="form.bank_account" disabled />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24" v-loading="fileLoading['bank_receipt']">
            <el-form-item label="银行回单：">
              <div style="margin-bottom: 10px;">
                <span @click="openPreviewFn(form.bank_receipt)" class="bluelink">{{ form.bank_receipt }}</span>
              </div>
              <el-upload
                ref="upload"
                name="bank_receipt_file"
                :headers="headers"
                :action="uploadApi"
                :file-list="fileList"
                :show-file-list="false"
                :before-upload="file => beforeUploadFn(file, 'bank_receipt')"
                :on-success="(response, file, fileList) => uploadSuccessFn(response, file, fileList, 'bank_receipt')"
              >
                <el-button slot="trigger" size="mini" type="primary">重新上传</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>

        <div class="title">关联订单</div>

        <el-row v-for="(item, idx) in form.order_infos" :key="idx + '' + item.id">
          <el-col :span="8">
            <el-form-item label="订单号：">
              <el-input @change="orderNoChangeFn($event, item)" v-model.trim="item.order_no" :disabled="idx === 0 || !isEditing" />
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <div style="padding-top: 12px;">
              <span v-if="[1, 2].includes(form.status)">
                （待付金额：{{ item.unpay_money }}）
              </span>
              <span v-else>
                （收款金额：{{ item.transfer_paid_total }}）    手续费：    长短款：）
              </span>
              <span @click="delOrderFn(idx)" v-if="isEditing && idx !== 0" class="delbtn">
                删除
              </span>
            </div>
          </el-col>
        </el-row>
        <div>
          <span @click="addOrderFn()" v-if="isEditing" class="delbtn">+新增关联订单</span>
        </div>

        <div class="title"></div>

        <el-col :span="12">
          <el-form-item label="内部备注：">
            <el-input type="textarea" v-model="form.remark" :rows="3" :disabled="!isEditing"></el-input>
          </el-form-item>
        </el-col>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getReceiptDetail, changeReceiptDetail, updateReceiptDetail, addOrderTransfer } from '@/api/paymentManagement';
import request from '@/utils/request/index.js';
import { getToken } from '@/utils/cookie';

export default {
  name: 'receiptDetail',
  data() {
    const AUTH_KEY = 'Bearer';
    return {
      loading: false,
      id: this.$route.query.id,

      form: {
        status: '',
        customer_code: '',
        customer_username: '',
        remitter_name: '',
        remitter_account: '',
        remitter_bank: '',
        swift_code: '',
        remitter_certificate: '',
        money_remitter: '',
        currency: '',
        money_fee: '',
        transfer_at: '',
        transaction_no: '',
        payee_name: '',
        bank_account: '',
        bank_receipt: '',
        order_infos: [],
        remark: '',
      },

      formRules: {
        remitter_name: [
          { required: true, message: '请输入', trigger: 'blur' },
        ],
        remitter_account: [
          { required: true, message: '请输入', trigger: 'blur' },
        ],
        remitter_bank: [
          { required: true, message: '请输入', trigger: 'blur' },
        ],
        swift_code: [
          { required: true, message: '请输入', trigger: 'blur' },
        ],
        money_remitter: [
          { required: true, message: '请输入', trigger: 'blur' },
        ],
        currency: [
          { required: true, message: '请输入', trigger: 'blur' },
        ],
      },

      optionList: {

      },

      // 编辑相关
      isEditing: false, // 是否正在编辑

      // 上传相关
      fileLoading: {
        remitter_certificate: false,
        bank_receipt: false,
      },
      headers: { Authorization: AUTH_KEY + getToken() },
      uploadApi: request.defaults.baseURL + '/wallet/uploadBankReceiptFile',
      fileList: [],
    };
  },
  created() {
    this.getData();
  },
  methods: {
    // 返回
    goBack() {
      this.$router.go(-1);
    },

    getData() {
      this.loading = true;
      getReceiptDetail(this.id).then(({ data }) => {
        // const data = {
        //   'id': 27,
        //   'code': 'RC20200927000026',
        //   'status': 2,
        //   'statusName': '已到账',
        //   'customer_code': '11111111',
        //   'customer_username': '222222222',
        //   'remitter_name': 'tetet',
        //   'remitter_account': 'fdafdaf',
        //   'remitter_bank': '123123123',
        //   'swift_code': '123',
        //   'remitter_certificate': 'admin-api.app/attachments/20201010/5c057b4db45f4298a1f8fa6a64cf9d04.jpg',
        //   'money_remitter': 1000,
        //   'money_fee': 10,
        //   'money_receive': 990,
        //   'currency': 'USD',
        //   'created_at': '2020-09-27 14:54:52',
        //   'transfer_at': '2020-09-29 00:00:00',
        //   'transaction_no': '13123123',
        //   'payee_name': '香港立创',
        //   'bank_account': '819845926838',
        //   'bank_receipt': 'admin-api.app/attachments/20201010/69a3cb4d5a72422c8e0e476d647751c5.jpg',
        //   'order_infos': [
        //     {
        //       'id': 159,
        //       'order_no': '20200911X4IC',
        //       'customer_code': '2789452A',
        //       'total': 112.97,
        //       'paid_total': 1050.53,
        //       'unpay_money': -937.56,
        //       'username': 'phpvincent',
        //       'transfer_paid_total': 1276.47,
        //     },
        //     {
        //       'id': 160,
        //       'order_no': '20200911X4IC',
        //       'customer_code': '2789452A',
        //       'total': 112.97,
        //       'paid_total': 1050.53,
        //       'unpay_money': -937.56,
        //       'username': 'phpvincent',
        //       'transfer_paid_total': 1276.47,
        //     },
        //     {
        //       'id': 161,
        //       'order_no': '20200911X4IC',
        //       'customer_code': '2789452A',
        //       'total': 112.97,
        //       'paid_total': 1050.53,
        //       'unpay_money': -937.56,
        //       'username': 'phpvincent',
        //       'transfer_paid_total': 1276.47,
        //     },
        //   ],
        // };
        this.form = { ...this.form, ...data };
      }).finally(() => {
        this.loading = false;
      });
    },

    // 开始修改
    startEditFn() {
      this.isEditing = true;
    },
    // 保存
    ednEditFn() {
      this.$refs.form.validate((v) => {
        if (v) {
          this.isEditing = false;
          updateReceiptDetail(this.id, this.form).then(data => {
            this.$message.success('保存成功！');
            this.getData();
          });
        }
      });
    },

    // 删除关联订单
    delOrderFn(idx) {
      this.form.order_infos.splice(idx, 1);
    },
    // 新增关联订单
    addOrderFn(idx) {
      this.form.order_infos.push({
        id: '',
        order_no: '',
        customer_code: '',
        total: '',
        paid_total: '',
        unpay_money: '0',
        transfer_paid_total: '',
      });
    },
    // 获取关联订单信息
    orderNoChangeFn(v, e) {
      // 初始化数据方法
      const initfn = ({ id = '', order_no = '', customer_code = '', total = '', paid_total = '', unpay_money = '0', transfer_paid_total = '' } = {}) => {
        e.id = id;
        // e.order_no = order_no;       // 订单号使用输入的
        e.customer_code = customer_code;
        e.total = total;
        e.paid_total = paid_total;
        e.unpay_money = unpay_money;
        e.transfer_paid_total = transfer_paid_total;
      };

      if (v) {
        addOrderTransfer({
          orderCode: this.form.order_infos[0].order_no,
          addOrderCode: e.order_no,
        }).then(({ data }) => {
          initfn(data);
        }).catch(() => {
          initfn();
        });
      } else {
        initfn();
      }
    },

    // 确认已汇款
    changeStatus2Fn() {
      this.$refs.form.validate((v) => {
        if (v) {
          this.$alert('请核实客户是否已汇出款项。', '确认已汇款', {
            confirmButtonText: '确认',
          }).then(() => {
            changeReceiptDetail(this.id, { status }).then(data => {
              this.$message.success('确认已汇款操作成功！');
              this.getData();
            });
          });
        } else {
          this.$alert('确认汇款失败！标红字段未填写。', '确认已汇款', {
            confirmButtonText: '继续填写',
          }).then(() => {
            this.startEditFn();
          });
        }
      });
    },

    // 确认已到账
    changeStatus3Fn() {
      this.$refs.form.validate((v) => {
        if (v) {
          // 手续费 到账日期 流水号也要填写
          if (this.form.money_fee && this.form.transfer_at && this.form.transaction_no) {
            this.$alert('请检查所有信息填写无误，确认到账后无法修改。', '确认已到账', {
              confirmButtonText: '确认',
            }).then(() => {
              changeReceiptDetail(this.id, { status }).then(data => {
                this.$message.success('确认已到账操作成功！');
                this.getData();
              });
            });
          } else {
            let str = '<div>确认到账失败！以下信息仍需填写：';
            if (!this.form.money_fee) {
              str += '<div>*手续费*</div>';
            }
            if (!this.form.transfer_at) {
              str += '<div>*到账日期*</div>';
            }
            if (!this.form.transaction_no) {
              str += '<div>*流水号*</div>';
            }
            str += '</div>';
            this.$alert(str, '确认已到账', {
              confirmButtonText: '继续填写',
              dangerouslyUseHTMLString: true,
            }).then(() => {
              this.startEditFn();
            });
          }
        } else {
          this.$alert('确认到账失败！标红字段未填写。', '确认已到账', {
            confirmButtonText: '继续填写',
          }).then(() => {
            this.startEditFn();
          });
        }
      });
    },

    // 文件上传之前
    beforeUploadFn(file, str) {
      this.fileLoading[str] = true;
    },
    // 文件上传成功
    uploadSuccessFn(response, file, fileList, str) {
      this.fileLoading[str] = false;
      if (response.code !== 200) {
        this.$message.error(response.message || '文件数据错误！');
        return;
      }
      this.fileList = fileList.slice(-1);
      this.form[str] = response.data.url;
    },
    // 预览
    openPreviewFn(url) {
      window.open(url);
    },
  },
};
</script>
