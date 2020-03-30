<template>
  <div style="margin-bottom: 30px; ">
    <el-breadcrumb style="font-size: 14px; margin-bottom: 20px;" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '' }">其他管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/manage_risk' }">风险管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/risk' }">详情</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-header style="color:#303133 ;font-size: 20px;margin-left: -20px">
        风险管理
      </el-header>
      <div style="width: 100%;height: 1px;background-color: #409EFF;margin-top: -20px"></div>

      <div class="boxbutton">
        <span>共{{tableData.length}}条信息</span>

        <el-button @click="addRisk" round
                   style="margin-left: 650px;background-color:#409EFF;color: white;padding: 10px;margin-left: 10px">
          新增风险
        </el-button>
      </div>
      <div>
        <el-table :data="tableData" style="width: 100%"
                  :default-sort="{prop: ['projectId','name','scheduledTime','deliveryDay','projectSuperior','mainFunction'], order: 'descending'}">

          <el-table-column prop="projectId" label="项目ID" align='center'>
          </el-table-column>
          <el-table-column prop="type" label="风险类型" align='center'>
          </el-table-column>
          <el-table-column prop="description" label="风险描述" align='center'>
          </el-table-column>
          <el-table-column prop="level" label="风险级别" align='center'>
          </el-table-column>
          <el-table-column prop="influence" label="风险影响度" align='center'>
          </el-table-column>
          <el-table-column prop="strategy" label="应对策略描述" align='center'>
          </el-table-column>
          <el-table-column prop="status" label="状态" align='center'>
          </el-table-column>
          <el-table-column prop="responsible" label="责任人" align='center'>
          </el-table-column>
          <el-table-column prop="frequency" label="跟踪频率" align='center'>
          </el-table-column>
          <el-table-column prop="related" label="风险相关者" align='center'>
          </el-table-column>

          <el-table-column prop="createTime" label="提交时间" align='center'>
          </el-table-column>

          <el-table-column label="操作" align='center'  width="200px">
            <template slot-scope="ss">
              <el-button type="primary"  style="width: 60px;font-size: 12px;padding: 0px;height: 40px;"
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
                   style="padding-left: 10px">
            <el-row>

              <el-form-item label="项目ID" prop="projectId">
                {{form.projectId}}
              </el-form-item>
            </el-row>

            <el-row>
              <el-form-item label="风险类型" prop="type">
                <el-input v-model="form.type"></el-input>

              </el-form-item>
            </el-row>

            <el-row>
              <el-form-item label="风险描述" prop="description">
                <el-input type="textarea" v-model="form.description"></el-input>
              </el-form-item>
            </el-row>

            <el-row>
              <el-form-item label="风险等级" prop="level">
                <el-select style="width: 100%" v-model="form.level" filterable placeholder="请选择">
                  <el-option v-for="i in 5" :key="i" :label="i" :value="i"></el-option>
                </el-select>
              </el-form-item>
            </el-row>

            <el-row>
              <el-form-item label="风险影响度" prop="influence">
                <el-select style="width: 100%" v-model="form.influence" filterable placeholder="请选择">
                  <el-option v-for="i in form.infList" :key="i" :label="i" :value="i"></el-option>
                </el-select>
              </el-form-item>
            </el-row>

            <el-row>
              <el-form-item label="应对策略描述" prop="strategy">
                <el-input type="textarea" v-model="form.strategy"></el-input>
              </el-form-item>
            </el-row>

            <el-row>
              <el-form-item label="状态" prop="status">
                <el-input v-model="form.status"></el-input>
              </el-form-item>
            </el-row>

            <el-row>
              <el-form-item label="责任人" prop="responsible">
                <el-select style="width: 100%" v-model="form.responsible" filterable placeholder="请选择">
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
              <el-form-item label="跟踪频度" prop="frequency">
                <el-select style="width: 100%" v-model="form.frequency" filterable placeholder="请选择">
                  <el-option v-for="i in form.freList" :key="i" :label="i" :value="i"></el-option>
                </el-select>
              </el-form-item>
            </el-row>

            <el-row>
              <el-form-item label="风险相关者" prop="related">
                <el-select style="width: 100%" multiple v-model="form.related" filterable placeholder="请选择">
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

            <el-row align="center">
              <el-form-item label="风险提交时间" prop="creatTime">

                <el-date-picker type="date" placeholder="选择日期" v-model="form.creatTime" style="width: 100%;"
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
    name: "risk",
    data() {
      return {

        formVisible: false,

        rules: {

          type: [
            {required: true, message: '请填写', trigger: 'blur'}
          ],
          description: [
            {required: true, message: '请填写', trigger: 'blur'}
          ],
          level: [
            {required: true, message: '请选择', trigger: 'change'}
          ],
          influence: [
            {required: true, message: '请选择', trigger: 'change'}
          ],
          strategy: [
            {required: true, message: '请填写', trigger: 'blur'}
          ],
          status: [
            {required: true, message: '请填写', trigger: 'blur'}
          ],
          responsible: [
            {required: true, message: '请选择', trigger: 'change'}
          ],
          frequency: [
            {required: true, message: '请选择', trigger: 'change'}
          ],
          related: [
            {required: true, message: '请选择', trigger: 'change'}
          ],
          creatTime: [
            {required: true, message: '请选择时间', trigger: 'change'}
          ],


        },
        form: {
          list: [],
          memberList: [],
          infList: ['高', '一般', '低'],
          freList: ['高', '一般', '低'],
          id: 0,
          projectId: '',
          type: "",
          description: '',
          level: 1,
          influence: '',
          strategy: '',
          status: '未解决',
          responsible: '',
          frequency: '',
          related: '',
          creatTime: '',
        },

        tableData: [],
      }
    },
    created: function () {
      console.log(this.$route.query.projectId)
      this.form.projectId = this.$route.query.projectId;
      this.getRiskList();


    },
    methods: {
      getRiskList(){
        let _this = this;
        axios({
          method: "get",
          url: "/risk/getRisk",
          params:
            {
              projectId:  _this.form.projectId
            }
        }).then(response => {
          console.log('getRisk')
          console.log(response.data.data.list)
          if (response.data.code === 0) {
            _this.tableData = response.data.data.list
            _this.tableData.forEach((elem, idx) => {
              elem.createTime = elem.createTime.slice(0, 10)
            })
          } else {
            _this.$router.push({
              path: '/no_auth',
            })
          }
        })
      },
      addRisk() {
        let _this = this

        _this.formVisible = true;
        _this.getMembers(this.$route.query.projectId);
      },
      proChange(val) {
        let _this = this
        console.log('procha');
        console.log(val);
        axios({
          method: "get",
          url: "/auth/getRoles",
          params:
            {
              projectId: val
            }
        }).then(response => {
          if (response.data.code === 0) {
            _this.form.memberList = response.data.data.list;
            console.log(response.data.data.list);

          }
        })
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
            console.log("addRisk");
            console.log(_this.form.related);
            let relatedString="|";
            _this.form.related.forEach((elem, idx) => {
              relatedString += elem+'|';
            })

            console.log(relatedString);
            axios({
              method: "post",
              url: "/risk/add",
              params: {
                projectId: _this.form.projectId,

              },
              data: {
                createTime: _this.form.creatTime,
                description: _this.form.description,
                frequency: _this.form.frequency,
                influence: _this.form.influence,
                level: _this.form.level,
                related: relatedString,
                responsible: _this.form.responsible,
                status: _this.form.status,
                strategy: _this.form.strategy,
                type: _this.form.type,

              },
            }).then(response => {
              if (response.data.code === 0) {
                this.$message({
                  message: response.data.msg,
                  type: 'success'
                })
                _this.getRiskList()

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
            path: '/risk_modify',
            query:{
              info: info
            }
          })
      },
      deleteInfo(id){
        let _this = this;
        console.log(id);
        axios({
          method: "delete",
          url: "/risk/delete",
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
            _this.getRiskList();

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
