<template>
  <div style="margin-bottom: 30px; ">
    <el-breadcrumb style="font-size: 14px; margin-bottom: 20px;" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '' }">其他管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/problem' }">缺陷管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-header style="color:#303133 ;font-size: 20px;margin-left: -20px">
        缺陷管理
      </el-header>
      <div style="width: 100%;height: 1px;background-color: #409EFF;margin-top: -20px"></div>
      <div class="boxbutton">
        <span>共{{tableData.length}}条信息</span>

        <el-button @click="addProblem" round
                   style="margin-left: 650px;background-color:#409EFF;color: white;padding: 10px;margin-left: 10px">
          新增缺陷
        </el-button>
      </div>
      <div>
        <el-table :data="tableData" style="width: 100%"
                  :default-sort="{prop: ['ID','name','scheduledTime','deliveryDay','projectSuperior','mainFunction'], order: 'descending'}">
          <el-table-column prop="id" label="ID" align='center' sortable min-width="100">
          </el-table-column>
          <el-table-column prop="projectId" label="项目ID" align='center'  min-width="100" sortable>
          </el-table-column>
          <el-table-column prop="name" label="缺陷名称" align='center' min-width="100" sortable>
          </el-table-column>
          <el-table-column prop="description" label="缺陷描述" align='center' sortable min-width="100">
          </el-table-column>
          <el-table-column prop="level" label="缺陷等级" align='center' sortable min-width="100">
          </el-table-column>
          <el-table-column prop="tracker" label="缺陷跟踪人" align='center' sortable min-width="100">
          </el-table-column>

          <el-table-column prop="updateTime" label="更新时间" align='center' sortable min-width="100">
          </el-table-column>
          <el-table-column prop="status" label="状态" align='center' sortable min-width="100">
          </el-table-column>

          <el-table-column label="操作" align='center' min-width="150">
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
              <el-form-item label="项目ID" prop="projectId">
                {{form.projectId}}
              </el-form-item>
            </el-row>

            <el-row>
              <el-form-item label="缺陷名称" prop="name">
                <el-input v-model="form.name"></el-input>

              </el-form-item>
            </el-row>

            <el-row>
              <el-form-item label="缺陷描述" prop="description">
                <el-input type="textarea" v-model="form.description"></el-input>
              </el-form-item>
            </el-row>


            <el-row>
              <el-form-item label="缺陷等级" prop="level">
                <el-select style="width: 100%" v-model="form.level" filterable placeholder="请选择">
                  <el-option v-for="i in 5" :key="i" :label="i" :value="i"></el-option>
                </el-select>
              </el-form-item>
            </el-row>


            <el-row>
              <el-form-item label="缺陷跟踪人" prop="tracker">
                <el-select style="width: 100%" v-model="form.tracker" filterable placeholder="请选择">
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
              <el-form-item label="状态" prop="status">
                <el-select style="width: 100%" v-model="form.status" filterable placeholder="请选择">
                  <el-option v-for="i in form.statusList" :key="i" :label="i" :value="i"></el-option>
                </el-select>
              </el-form-item>
            </el-row>

            <el-row align="center">
              <el-form-item label="发现时间" prop="updateTime">

                <el-date-picker type="date" placeholder="选择日期" v-model="form.updateTime" style="width: 100%;"
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
    name: "problem",
    data() {
      return {
        formVisible: false,
        rules: {
          name: [
            {required: true, message: '请填写', trigger: 'blur'}
          ],
          description: [
            {required: true, message: '请填写', trigger: 'blur'}
          ],
          level: [
            {required: true, message: '请选择', trigger: 'change'}
          ],
          status: [
            {required: true, message: '请选择', trigger: 'change'}
          ],
          tracker: [
            {required: true, message: '请选择', trigger: 'change'}
          ],
          updateTime: [
            {required: true, message: '请选择时间', trigger: 'change'}
          ],

        },
        form: {
          list: [],
          statusList:['未处理','处理中','已处理'],
          memberList: [],
          projectId: '',
          name: "",
          description: '',
          level: 1,
          tracker: '',
          updateTime: '',
          status: '',
        },

        tableData: [],
      }
    },
    mounted: function () {
      this.getBugList();
      this.form.projectId = this.$route.query.projectId;

    },
    methods: {
      addProblem(){
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
      getBugList() {
        let _this = this;
        axios({
          method: "get",
          url: "/bug/getBug",
          params:
            {
              projectId: _this.$route.query.projectId
            }
        }).then(response => {

          console.log('getBug');
          console.log(response.data);
          if (response.data.code === 0) {
            _this.tableData = response.data.data.list
            _this.tableData.forEach((elem, idx) => {
              elem.updateTime = elem.updateTime.slice(0, 10)
            })
          } else {
            _this.$router.push({
              path: '/no_auth',
            })
          }
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {

            let _this = this;
            _this.formVisible = false;

            axios({
              method: "post",
              url: "/bug/add",
              params: {
                projectId: _this.form.projectId,
              },
              data: {

                name: _this.form.name,
                description: _this.form.description,
                level: _this.form.level,
                tracker: _this.form.tracker,
                updateTime: _this.form.updateTime,
                status: _this.form.status,

              },
            }).then(response => {
              if (response.data.code === 0) {
                this.$message({
                  message: response.data.msg,
                  type: 'success'
                })
                _this.getBugList()

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
        let _this = this;
        _this.$router.push({
          path: '/problem_modify',
          query: {
            info: info
          }
        })
      },
      deleteInfo(id) {
        let _this = this;
        console.log(id);
        axios({
          method: "delete",
          url: "/bug/delete",
          params: {
            projectId: _this.form.projectId,
            id: id
          },
        }).then(response => {
          if (response.data.code === 0) {
            this.$message({
              message: response.data.msg,
              type: 'success'
            })


          } else {
            this.$message({
              message: response.data.msg,
              type: 'error'
            })
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
