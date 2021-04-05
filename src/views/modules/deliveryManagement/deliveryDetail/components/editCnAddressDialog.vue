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
    width="540px"
    title="填写中文地址"
    :visible.sync="dialog.show"
    :close-on-click-modal="false"
  >
    <div v-loading="dialog.loading">
      <div v-if="params.shipping_address">
        <div>First Name：{{ params.shipping_address.first_name }}</div>
        <div>Last Name：{{ params.shipping_address.last_name }}</div>
        <div>Phone：{{ params.shipping_address.phone }}</div>
        <div>Country：{{ params.shipping_address.country }}</div>
        <div>State：{{ params.shipping_address.state }}</div>
        <div>City：{{ params.shipping_address.city }}</div>
        <div>Apt, Suite, Building：{{ params.shipping_address.street }}</div>
        <div>Street Address：{{ params.shipping_address.street2 }}</div>
        <div>Postal Code：{{ params.shipping_address.postcode }}</div>
        <div>Company：{{ params.shipping_address.company }}</div>
      </div>
      <div class="mt20">
        <el-form
          ref="form"
          :model="dialog.form"
          :rules="formRules"
          size="mini"
          label-width="98px"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="国家/地区：" prop="country_cn">
                <el-select
                  v-model="dialog.form.country_cn"
                  filterable
                  clearable
                >
                  <el-option
                    v-for="(v, k) in optionList.countryList"
                    :key="k"
                    :label="v"
                    :value="v"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="收件人：" prop="addressee_cn">
                <el-input v-model.trim="dialog.form.addressee_cn" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="公司：" prop="company_cn">
                <el-input v-model.trim="dialog.form.company_cn" />
              </el-form-item>
            </el-col>
            <el-col v-if="dialog.form.country_cn == '中国'" :span="12">
              <el-form-item label="省份：" prop="province_cn">
                <el-select
                  v-model="dialog.form.province_cn"
                  filterable
                  clearable
                  @change="provinceChangeFn"
                >
                  <el-option
                    v-for="(v, k) in optionList.provinceList"
                    :key="k"
                    :label="v"
                    :value="v"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-if="dialog.form.country_cn == '中国'" :span="12">
              <el-form-item label="城市：" prop="city_cn">
                <el-select
                  v-model="dialog.form.city_cn"
                  filterable
                  clearable
                >
                  <el-option
                    v-for="(v, k) in optionList.cityList"
                    :key="k"
                    :label="v"
                    :value="v"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="详细地址：" prop="street_cn">
                <el-input v-model.trim="dialog.form.street_cn" />
              </el-form-item>
            </el-col>
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
import { cnAddress } from '@/api/deliveryManagement';
import chinaArea from '@/assets/json/chinaArea.json';

export default {
  name: 'editCnAddressDialog',
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
          country_cn: '',
          addressee_cn: '',
          company_cn: '',
          province_cn: '',
          city_cn: '',
          street_cn: '',
        },
      },

      optionList: {
        countryList: ['中国', '香港', '澳门', '台湾'],
        originProvinceList: [], // json原始省份数据
        provinceList: [], // 渲染的省份列表
        originCityList: [], // json原始市级数据
        cityList: [], // 渲染的市级列表
      },

      formRules: {
        country_cn: [
          { required: true, message: '请选择', trigger: 'change' },
        ],
        addressee_cn: [
          { required: true, message: '请输入', trigger: 'blur' },
        ],
        company_cn: [
          { required: true, message: '请输入', trigger: 'blur' },
        ],
        province_cn: [
          { required: true, message: '请选择', trigger: 'change' },
        ],
        city_cn: [
          { required: true, message: '请选择', trigger: 'change' },
        ],
        street_cn: [
          { required: true, message: '请输入', trigger: 'blur' },
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

      // 赋值数据
      this.dialog.form = {
        ...params.cn_address,
        country_cn: params.cn_address.country_cn || '中国',
      };

      // 省市数据
      this.optionList.originProvinceList = chinaArea['86'];
      this.optionList.provinceList = Object.values(this.optionList.originProvinceList);
      this.optionList.originCityList = [];
      this.optionList.cityList = [];

      // 如果省份有值则初始化市级下拉
      if (this.dialog.form.province_cn) {
        this.provinceChangeFn(this.dialog.form.province_cn, true);
      }
    },

    // 省份改变时获取市级
    provinceChangeFn(v, noClearCity) {
      const key = this.findObjKey(this.optionList.originProvinceList, v);
      this.optionList.originCityList = chinaArea[key];
      this.optionList.cityList = Object.values(this.optionList.originCityList);
      if (!noClearCity) {
        this.dialog.form.city_cn = ''; // 清空已选的市级
      }
    },

    // 找到对象指定value的key
    findObjKey(obj, value) {
      return Object.keys(obj).find((k) => obj[k] === value);
    },

    // 提交方法
    submitFn() {
      this.$refs.form.validate((v) => {
        if (v) {
          if (this.dialog.form.country_cn !== '中国') {
            this.dialog.form.province_cn = '';
            this.dialog.form.city_cn = '';
          }

          this.dialog.loading = true;
          cnAddress(this.params.id, this.dialog.form).then(({ data }) => {
            this.dialog.show = false;
            this.$message.success('填写中文地址成功！');
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
