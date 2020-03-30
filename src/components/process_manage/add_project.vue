<template>
  <div style="margin-bottom: 40px; ">
    <el-breadcrumb style="font-size: 14px; margin-bottom: 20px;" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '' }">流程管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/apply_project' }">申请立项</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/add_project' }">新增立项</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-header style="color:#303133 ;font-size: 20px;margin-left: -20px">
        填写项目基本信息
        <el-button type="primary" round style="width:80px;float: right;margin-left: 10px;margin-top: -5px;"
            @click="$router.back(-1)">返回</el-button>
      </el-header>
      <div style="width: 100%;height: 1px;background-color: #606266;margin-top: -20px"></div>
      <div style="margin-top: 20px;margin-left: 10px;">
        <el-form ref="project" :rules="rules" :model="project" label-width="130px" :inline="true" label-position="left"
          class="demo-ruleForm">
          <el-row>
            <el-form-item label="项目ID" prop="id">
              <el-input v-model="project.id" style="width: 300px"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="项目名称" prop="name">
              <el-input v-model="project.name" style="width: 300px"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="客户信息">
              <el-input v-model="project.customerInfo" style="width: 300px"></el-input>
            </el-form-item>
          </el-row>
          <!-- <el-row>
          <el-form-item label="客户ID" style="width: 500px">
            <el-input v-model="form.customName" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="接口人" style="width: 500px">
            <el-input v-model="form.customName" style="width: 300px"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="客户等级" style="width: 500px">
            <el-input v-model="form.customName" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="公司名称" style="width: 500px">
            <el-input v-model="form.customName" style="width: 300px"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="电子邮件" style="width: 500px">
            <el-input v-model="form.customName" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="电话" style="width: 500px">
            <el-input v-model="form.customName" style="width: 300px"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="地址" style="width: 500px">
            <el-input v-model="form.customName" style="width: 300px"></el-input>
          </el-form-item>
          <br><br>
        </el-row> -->
          <el-row>
            <el-form-item label="预定时间" prop="beginTime">
              <el-date-picker type="date" placeholder="选择日期" v-model="project.beginTime" style="width: 100%;"
                value-format="yyyy-MM-ddTHH:mm:ss.SSSZ" format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="交付日" prop="endTime">
              <el-date-picker type="date" placeholder="选择日期" v-model="project.endTime" style="width: 100%;"
                value-format="yyyy-MM-ddTHH:mm:ss.SSSZ" format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="项目上级" prop="superiorId" >
             <!-- <el-input v-model="superiorId" style="width: 300px"></el-input> -->
              <el-select style="width: 180px;margin-left: 5%;"  v-model="project.superiorId" filterable placeholder="请选择项目上级">
                <el-option v-for="item in personList" :key="item.id" :label="item.id" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="QA manager" prop="qaManagerId" >
              <el-select style="width: 180px;margin-left: 5%;"  v-model="project.qaManagerId" filterable placeholder="请选择QA manager">
                <el-option v-for="item in personList" :key="item.id" :label="item.id" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="配置管理员" prop="configManagerId" >
              <el-select style="width: 180px;margin-left: 5%;"  v-model="project.configManagerId" filterable placeholder="请选择配置管理员">
                <el-option v-for="item in personList" :key="item.id" :label="item.id" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="EPG Leader" prop="epgLeaderId" >
              <el-select style="width: 180px;margin-left: 5%;"  v-model="project.epgLeaderId" filterable placeholder="请选择EPG Leader">
                <el-option v-for="item in personList" :key="item.id" :label="item.id" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="主要里程碑">
              <el-input v-model="project.description" style="width: 600px"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="采用技术">
              <el-input type="textarea" v-model="project.technology" style="width: 600px;"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="业务领域">
              <el-input v-model="project.business" style="width: 600px"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="主要功能">
              <el-input type="textarea" v-model="project.feature" style="width: 600px;"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item>
              <el-button type="primary" @click="dialogVisible=true" style="margin-left: 350px;width:100px;margin-top: 10px;">立即创建</el-button>
              <el-dialog title="" :visible.sync="dialogVisible" width="30%" style="text-align: center" center>
                <span style="text-align: center;display:block; font-size: 15px">确认立项？</span>
                <span slot="footer" class="dialog-footer">
                  <el-button type="danger" style="width: 60px;font-size: 12px;padding: 0px;height: 40px;" @click="dialogVisible = false;"
                    plain>取消</el-button>
                  <el-button type="primary" style="width: 60px;font-size: 12px;padding: 0px;height: 40px;" @click="dialogVisible = false;onSubmit('project');"
                    plain>确定</el-button>
                </span>
              </el-dialog>
              <el-button type="primary" plain style="margin-left: 20px;width:100px;margin-top: 10px; " @click="reset()">重置</el-button>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    name: 'add_project',
    data() {
      return {
        dialogVisible: false,
        personList:[],
        project: {
          id: '',
          name: '',
          beginTime: '',
          endTime: '',
          business: '',
          customerInfo: '',
          description: '',
          feature: '',
          superiorId: '',
          technology: '',
          configManagerId: '',
          epgLeaderId: '',
          qaManagerId: ''
        },
        rules: {
          id: [{
              required: true,
              message: '请输入项目ID',
              trigger: 'blur'
            },
            {
              min: 11,
              max: 11,
              message: '长度为 11 个字符',
              trigger: 'blur'
            }
          ],
          name: [{
            required: true,
            message: '请选择活动名称',
            trigger: 'change'
          }],
          superiorId: [{
            required: true,
            message: '请选择项目上级',
            trigger: 'change'
          }],
          configManagerId: [{
            required: true,
            message: '请选择配置管理员',
            trigger: 'change'
          }],
          epgLeaderId: [{
            required: true,
            message: '请选择EPG Leader',
            trigger: 'change'
          }],
          qaManagerId: [{
            required: true,
            message: '请选择QA manager',
            trigger: 'change'
          }],
          beginTime: [{
            required: true,
            message: '请选择日期',
            trigger: 'change'
          }],
          endTime: [{
            required: true,
            message: '请选择时间',
            trigger: 'change'
          }]
        }
      }
    },
    mounted:function(){
      var _this = this
      axios({
        method: "get",
        url: "/staff/importStaff"
      }).then(response => {
        if (response.data.code === 0) {
          let i = 0
          for (; i < response.data.data.list.length; i++) {
            _this.personList.push({
              id: response.data.data.list[i].id,
              name: response.data.data.list[i].name
            })
          }
        }
      })
    },
    methods: {
      reset() {
        var _this = this
        _this.project.id = ''
        _this.project.name = ''
        _this.project.beginTime = ''
        _this.project.endTime = ''
        _this.project.business = ''
        _this.project.customerInfo = ''
        _this.project.description = ''
        _this.project.feature = ''
        _this.project.technology = ''
        _this.project.superiorId = ''
        _this.project.configManagerId = ''
        _this.project.epgLeaderId = ''
        _this.project.qaManagerId = ''
      },
      onSubmit(formName) {
        var _this = this
        this.$refs[formName].validate((valid) => {
            if (valid) {
              axios({
                method: "post",
                url: "/project/build",
                params: {
                  superiorId: _this.project.superiorId,
                  configManagerId: _this.project.configManagerId,
                  epgLeaderId: _this.project.epgLeaderId,
                  qaManagerId: _this.project.qaManagerId
                },
                data: {
                  id: _this.project.id,
                  name: _this.project.name,
                  beginTime: _this.project.beginTime,
                  endTime: _this.project.endTime,
                  business: _this.project.business,
                  customerInfo: _this.project.customerInfo,
                  description: _this.project.description,
                  feature: _this.project.feature,
                  technology: _this.project.technology
                },
              }).then(response => {
                console.log(response.data)
                if (response.data.code === 0) {
                  this.$message({
                    message: response.data.msg,
                    type: 'success'
                  })
                  _this.reset()
                } else {
                  this.$message({
                    message: response.data.msg,
                    type: 'error'
                  })
                }
              })
            } else {
             this.$message({
               message: '请填写正确信息',
               type: 'error'
             })
              return false;
            } });
          }
        }
      }
</script>

<style>
  .boxbutton {
    margin-top: 1%;
    width: 98.5%;
    background-color: #F3F3F3;
    padding: 10px;
  }
</style>
