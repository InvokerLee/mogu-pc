<style lang="scss" scoped>
.bluetxt {
  color: #06f;
}
.mt20{
  margin-top: 20px;
}
</style>

<template>
  <el-dialog
    width="733px"
    title="修改地址"
    :visible.sync="dialog.show"
    :close-on-click-modal="false"
  >
    <div v-loading="dialog.loading">
      <div>
        <el-form
          ref="form"
          :model="dialog.form"
          :rules="formRules"
          size="mini"
          label-width="170px"
        >
          <el-row>
            <el-col :span="24">
              <el-form-item label="地址类型：" prop="type">
                <el-select
                  v-model="dialog.form.type"
                  filterable
                  clearable
                  @change="typeChangeFn"
                >
                  <el-option
                    v-for="(v, k) in optionList.typeList"
                    :key="k"
                    :label="v"
                    :value="k"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <template v-if="dialog.form.type">
              <el-col :span="12">
                <el-form-item label="First Name：" prop="first_name">
                  <el-input v-model.trim="dialog.form.first_name" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Last Name：" prop="last_name">
                  <el-input v-model.trim="dialog.form.last_name" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Country/Region：" prop="country_code">
                  <el-select
                    v-model="dialog.form.country_code"
                    filterable
                    clearable
                    @change="countryChangeFn"
                  >
                    <el-option
                      v-for="v in optionList.countries"
                      :key="v.code"
                      :label="v.name"
                      :value="v.code"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="State：" prop="state">
                  <el-input v-model.trim="dialog.form.state" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="City：" prop="city">
                  <el-input v-model.trim="dialog.form.city" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Postal Code：" prop="postcode">
                  <el-input v-model.trim="dialog.form.postcode" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="Apt, Suite, Building：" prop="street">
                  <el-input v-model.trim="dialog.form.street" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="Street Address：" prop="street2">
                  <el-input v-model.trim="dialog.form.street2" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="Phone：" prop="phone">
                  <el-input v-model.trim="dialog.form.phone" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="Company：" prop="company">
                  <el-input v-model.trim="dialog.form.company" />
                </el-form-item>
              </el-col>
            </template>
          </el-row>
        </el-form>
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
        确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getCountries, updateAddress } from '@/api/deliveryManagement';

export default {
  name: 'editAddressDialog',
  data() {
    return {
      // 数据暂存
      params: {},
      // 回调
      cb: null,

      // 弹窗相关
      dialog: {
        show: false,
        loading: false,

        form: {
          type: '',
          first_name: '',
          last_name: '',
          country: '',
          country_code: '',
          state: '',
          city: '',
          postcode: '',
          street: '',
          street2: '',
          phone: '',
          company: '',
        },
      },

      optionList: {
        typeList: {
          1: '收货地址',
          2: '账单地址',
        },
        // 国家列表
        countries: [],
      },

      formRules: {
        type: [
          { required: true, message: '请选择', trigger: 'change' },
        ],
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
      // 先清空验证
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      });

      this.dialog.form.type = '';

      // 获取国家列表
      if (!this.optionList.countries.length) {
        getCountries().then(({ data }) => {
          this.optionList.countries = data;
        });
      }
    },

    // 地址类型改变时
    typeChangeFn(v) {
      // 先清空验证
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      });

      // 给表单赋值
      const params = v === '1' ? 'shipping_address' : 'bill_address';
      this.dialog.form = {
        ...this.dialog.form,
        ...this.params[params],
        type: this.dialog.form.type, // type不使用传进来的值
      };
    },

    // country_code改变时 country也要对应上
    countryChangeFn(v) {
      this.dialog.form.country = this.optionList.countries.find((e) => e.code === v).name;
    },

    // 提交方法
    submitFn() {
      this.$refs.form.validate((v) => {
        if (v) {
          this.dialog.loading = true;
          updateAddress(this.params.id, this.dialog.form).then(({ data }) => {
            this.dialog.show = false;
            this.$message.success('修改地址成功！');
            this.cb && this.cb(this.dialog.form);
          }).finally(() => {
            this.dialog.loading = false;
          });
        }
      });
    },
  },
};
</script>
