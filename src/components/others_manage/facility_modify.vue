<template>
  <el-card>
    <el-form :model="form" :rules="rules" ref="form" label-position="left" label-width="120px"
             style="padding-left: 10px; padding-right: 10px">

      <el-row>
        <el-form-item label="项目ID" prop="projectId">
          {{form.projectId}}
<!--          <el-select style="width: 100%" v-model="form.id" filterable placeholder="请选择"-->
<!--                     @change="proChange">-->
<!--            <el-option-->
<!--              v-for="item in form.list"-->
<!--              :key="item.id"-->
<!--              :label="item.name+' ('+item.id+')'"-->
<!--              :value="item.id">-->
<!--              <span style="float: left;font-size: 13px">{{ item.name }}</span>-->
<!--              <span style="float: right; color: #8492a6; font-size: 11px">{{ item.id }}</span>-->
<!--            </el-option>-->
<!--          </el-select>-->
        </el-form-item>
      </el-row>

      <el-row>
        <el-form-item label="设备" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
      </el-row>

      <el-row>
        <el-form-item label="资产管理者" prop="admin">
          <el-select style="width: 100%" v-model="form.admin" filterable placeholder="请选择">
            <el-option
              v-for="item in memberList"
              :key="item.staffId"
              :label="item.staffId+' ('+item.role+')'"
              :value="item.staffId">
              <span style="float: left;font-size: 13px">{{ item.staffId }}</span>
              <span style="float: right; color: #8492a6; font-size: 12px">{{ item.role }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-row>

      <el-row>
        <el-form-item label="设备状态" prop="status">
          <el-select style="width: 100%" v-model="form.status" filterable placeholder="请选择">
            <el-option
              v-for="item in statusList"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
      </el-row>

      <el-row>
        <el-form-item label="结束使用时间" prop="endTime">

          <el-date-picker type="date" placeholder="选择结束日期" v-model="form.endTime" style="width: 100%;"
                          value-format="yyyy-MM-ddTHH:mm:ss.SSSZ" format="yyyy-MM-dd"></el-date-picker>

        </el-form-item>
      </el-row>

      <el-form-item>
        <br>
        <el-button @click="resetForm('form')">重置</el-button>
        <el-button type="primary" style="margin-left: 10px" @click="submitForm('form')">提交</el-button>
      </el-form-item>

    </el-form>

  </el-card>
</template>

<script>
  import axios from 'axios'

  export default {

    name: "facility_modify",
    data() {
      return {
        formVisible: false,
        tableData: [],
        memberList: [],
        statusList: ['申请中', '使用中', '已归还', '逾期未还'],
        form: {

          id: "",
          name: "",
          admin: "",
          borrower: "",
          endTime: "",
          status: ""
        },
        rules: {

          name: [
            {required: true, message: '请填写', trigger: 'blur'}
          ],
          admin: [
            {required: true, message: '请选择', trigger: 'change'}
          ],
          endTime: [
            {required: true, message: '请选择时间', trigger: 'change'}
          ],
          status: [
            {required: true, message: '请选择', trigger: 'change'}
          ],


        },
      }
    },

    created: function () {
      let _this = this;
      let info = _this.$route.query.info;

    },
    mounted: function () {
      let _this = this;
      let info = _this.$route.query.info;
      _this.form = info;

    },
    methods:{
      // getProlist() {
      //   let _this = this
      //
      //   _this.formVisible = true;
      //
      //   axios({
      //     method: "get",
      //     url: "/project/list",
      //     params:
      //       {
      //         roleEnum: '项目经理'
      //       }
      //   }).then(response => {
      //     console.log('proList');
      //     console.log(response.data.data);
      //     if (response.data.code === 0) {
      //
      //       _this.form.list = response.data.data.list
      //
      //     } else {
      //       this.$message({
      //         message: 'fail to get project list ',
      //         type: 'error'
      //       })
      //     }
      //   })
      //
      // },
      // proChange(val) {
      //   let _this = this
      //   console.log('procha');
      //   console.log(val)
      //   axios({
      //     method: "get",
      //     url: "/auth/getMembers",
      //     params:
      //       {
      //         roleEnum: '项目经理',
      //         projectId: val
      //       }
      //   }).then(response => {
      //     if (response.data.code === 0) {
      //       _this.form.memberList = response.data.data.list;
      //       console.log(response.data.data.list);
      //
      //     }
      //   })
      // },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {

            let _this = this;

            console.log("modDevice");

            axios({
              method: "put",
              url: "/device/mod",
              params: {
                projectId: _this.form.projectId
              },
              data: {
                id:_this.form.id,
                admin: _this.form.admin,
                borrower: _this.form.borrower,
                endTime: _this.form.endTime,
                name: _this.form.name,
                status: _this.form.status,

              },
            }).then(response => {
              if (response.data.code === 0) {
                this.$message({
                  message: response.data.msg,
                  type: 'success'
                })
                this.$router.go(-1)

              } else {
                this.$message({
                  message: response.data.msg,
                  type: 'error'
                })
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
    }

  }
</script>

<style scoped>

</style>
