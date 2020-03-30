<template>
  <div style="margin-bottom: 30px; ">
    <el-breadcrumb style="font-size: 14px; margin-bottom: 20px;" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '' }">其他管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/facility' }">设备管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-header style="color:#303133 ;font-size: 20px;margin-left: -20px">
        设备管理
      </el-header>
      <div style="width: 100%;height: 1px;background-color: #409EFF;margin-top: -20px"></div>
      <div class="boxbutton">
        <span>共{{tableData.length}}条信息</span>

        <el-button @click="addDevice" round
                   style="margin-left: 650px;background-color:#409EFF;color: white;padding: 10px;margin-left: 10px">
          新增设备申请
        </el-button>
      </div>
      <div>
        <el-table :data="tableData" style="width: 100%"
                  :default-sort="{prop: ['ID','name','scheduledTime','deliveryDay','projectSuperior','mainFunction'], order: 'descending'}">
          <el-table-column prop="id" label="设备ID" align='center' sortable min-width="100">
          </el-table-column>
          <el-table-column prop="name" label="设备名" align='center' sortable>
          </el-table-column>
          <el-table-column prop="admin" label="设备管理者" align='center' sortable min-width="100">
          </el-table-column>
          <el-table-column prop="borrower" label="租借设备者" align='center' sortable min-width="100">
          </el-table-column>

          <el-table-column prop="endTime" label="归还日期" align='center' sortable min-width="100">
          </el-table-column>
          <el-table-column prop="status" label="状态" align='center' sortable min-width="100">
          </el-table-column>

          <el-table-column label="操作" align='center' width="200">
            <template slot-scope="ss">
              <el-button type="primary" style="width: 60px;font-size: 12px;padding: 0px;height: 40px;"
                         @click="modifyInfo(ss.row)" plain>更新
              </el-button>
              <el-button type="primary" style="width: 60px;font-size: 12px;padding: 0px;height: 40px;"
                         @click="deleteInfo(ss.row.id)" plain>删除
              </el-button>

            </template>
          </el-table-column>
        </el-table>

        <el-dialog :visible.sync="formVisible" width="40%" center>
          <el-form :model="form" :rules="rules" ref="form" label-position="left" label-width="120px"
                   style="padding-left: 10px; padding-right: 10px">

            <el-row>
              <el-form-item label="项目ID" prop="id">
                {{form.id}}
              </el-form-item>
            </el-row>

            <el-row>
              <el-form-item label="设备名称" prop="name">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
            </el-row>

            <el-row>
              <el-form-item label="租借者" prop="borrower">
                <el-select style="width: 100%" v-model="form.borrower" filterable placeholder="请选择">
                  <el-option
                    v-for="item in form.memberList"
                    :key="item.id"
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
                    v-for="item in form.statusList"
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

        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: "facility",
    data() {
      return {
        formVisible: false,
        tableData: [],

        form: {
          list: [],
          memberList: [{staffId:'test',role:'项目经理'},{staffId:'test1',role:'组织配置管理员'},],
          statusList: ['申请中', '使用中', '已归还', '逾期未还'],

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
          borrower: [
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
    mounted: function () {
      this.getDeviceList();
      this.form.id = this.$route.query.projectId;

    },
    methods: {
      getDeviceList() {
        let _this = this;
        axios({
          method: "get",
          url: "/device/getDevice",
          params:
            {
              projectId: _this.$route.query.projectId
            }
        }).then(response => {
          console.log(_this.$route.query.projectId);

          console.log('getDevice');
          console.log(response.data);
          if (response.data.code === 0) {
            _this.tableData = response.data.data.list
            _this.tableData.forEach((elem, idx) => {
              elem.endTime = elem.endTime.slice(0, 10)
            })
          } else {
            _this.$router.push({
              path: '/no_auth',
            })
          }
        })
      },

      deleteInfo(id) {
        let _this = this;

        axios({
          method: "delete",
          url: "/device/delete",
          params:
            {
              id: id
            }
        }).then(response => {
          if (response.data.code === 0) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            _this.getDeviceList();
          } else {
            this.$message({
              message: '删除失败',
              type: 'error'
            })
          }
        })

      },

      addDevice() {
        let _this = this;
        _this.formVisible = true;
        _this.getMembers(this.$route.query.projectId);
      },
      
      getMembers(val) {
        let _this = this;
        console.log("getMembers");
        axios({
          method: "get",
          url: "/auth/getRoles",
          params:
            {
              projectId: val,
            }
        }).then(response => {
          console.log(response.data);

          if (response.data.code === 0) {
            _this.form.memberList = response.data.data.list;
          }

        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {

            let _this = this;
            _this.formVisible = false;
            console.log("submitForm");
            console.log(_this.form);
            console.log(sessionStorage.getItem('id'));
            axios({
              method: "post",
              url: "/device/add",
              params: {
                projectId: _this.$route.query.projectId

              },
              data: {
                name: _this.form.name,
                admin: window.sessionStorage.getItem('id'),
                borrower: _this.form.borrower,
                endTime: _this.form.endTime,
                status: _this.form.status,

              },
            }).then(response => {
              if (response.data.code === 0) {
                this.$message({
                  message: response.data.msg,
                  type: 'success'
                })
                _this.getDeviceList();
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
      formatter(row, column) {
        return row.address;
      },
      modifyInfo(info) {
        //修改信息
        console.log(info);
        let _this = this;
        _this.$router.push({
          path: '/facility_modify',
          query: {
            info: info
          }
        })

      }
    },
  }
</script>

<style scoped>
  .boxbutton {
    margin-top: 10px;
    display: flex;
    vertical-align: center;
    align-items: center;
    justify-content: space-between;
  }
</style>
