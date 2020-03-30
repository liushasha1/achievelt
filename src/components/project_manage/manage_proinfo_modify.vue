<template>
  <div style="margin-bottom: 40px; ">
    <el-breadcrumb style="font-size: 14px; margin-bottom: 20px;" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '' }">项目管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/manage_proinfo' }">管理项目信息</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/manage_proinfo_modify' }">修改项目信息</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
    <el-header style="color:#303133 ;font-size: 20px;margin-left: -20px">
      修改项目基本信息
      <el-button type="primary" round style="width:80px;float: right;margin-left: 10px;margin-top: -5px;"
          @click="$router.back(-1)">返回</el-button>

    </el-header>
    <div style="width: 100%;height: 1px;background-color: #606266;margin-top: -20px"></div>
    <div class="boxbutton">
      <span style="font-size: 17px;color: #333333">项目ID：{{form.id}}</span>
    </div>
    <div style="margin-top: 20px;margin-left: 10px;">
      <el-form ref="form" :model="form" label-width="130px" :inline="true" label-position="left">
        <el-row>
          <el-form-item label="项目名称">
            <el-input v-model="form.name" style="width: 300px"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="客户信息:">
            <el-input v-model="form.customerInfo" style="width: 300px"></el-input>
          </el-form-item>
        </el-row>
        <!-- <el-row>
          <el-form-item label="客户ID" style="width: 500px">
            <el-input v-model="form.customID" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="接口人" style="width: 500px">
            <el-input v-model="form.customName" style="width: 300px"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="客户等级" style="width: 500px">
            <el-input v-model="form.customDegree" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="公司名称" style="width: 500px">
            <el-input v-model="form.firmName" style="width: 300px"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="电子邮件" style="width: 500px">
            <el-input v-model="form.email" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="电话" style="width: 500px">
            <el-input v-model="form.telephone" style="width: 300px"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="地址" style="width: 500px">
            <el-input v-model="form.address" style="width: 300px"></el-input>
          </el-form-item>
          <br><br>
        </el-row> -->
        <el-row>
          <el-form-item label="预定时间">
            <el-date-picker type="date" placeholder="选择日期" v-model="form.beginTime" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="交付日">
            <el-date-picker type="date" placeholder="选择日期" v-model="form.endTime" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="主要里程碑">
            <el-input v-model="form.discription" style="width: 600px"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="采用技术">
            <el-input type="textarea" v-model="form.technology" style="width: 600px;"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="业务领域">
            <el-input type="textarea" v-model="form.business" style="width: 600px;"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="git仓库地址">
            <el-input v-model="form.gitPath" :disabled="true" style="width: 600px"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="文件服务器目录">
           <el-input v-model="form.filePath" :disabled="true" style="width: 600px"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="虚拟机空间">
            <el-input v-model="form.vmSpace" :disabled="true" style="width: 600px"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="项目状态">
            <el-select v-model="form.status" :disabled="true">
              <el-option label="申请立项" value="申请立项"></el-option>
              <el-option label="已立项" value="已立项"></el-option>
              <el-option label="已驳回" value="已驳回"></el-option>
              <el-option label="进行中" value="进行中"></el-option>
              <el-option label="已交付" value="已交付"></el-option>
              <el-option label="已完结" value="已完结" :disabled="true"></el-option>
              <el-option label="已归档" value="已归档" :disabled="true"></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="主要功能">
            <el-input type="textarea" v-model="form.feature" style="width: 600px;"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item>
            <el-button type="primary" @click="dialogVisible = true" style="margin-left: 350px;width:100px;margin-top: 10px;">修改</el-button>
            <el-dialog title="" :visible.sync="dialogVisible" width="30%" style="text-align: center" center>
              <span style="text-align: center;display:block; font-size: 15px">确认修改？</span>
              <span slot="footer" class="dialog-footer">
                <el-button type="danger" style="width: 60px;font-size: 12px;padding: 0px;height: 40px;" @click="dialogVisible = false;"
                  plain>取消</el-button>
                <el-button type="primary" style="width: 60px;font-size: 12px;padding: 0px;height: 40px;" @click="dialogVisible = false;onSubmit();"
                  plain>确定</el-button>
              </span>
            </el-dialog>
            <el-button type="primary" plain style="margin-left: 20px;width:100px;margin-top: 10px;" @click="$router.back(-1)">返回</el-button>
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
    name: 'manage_proinfo_modify',
    data() {
      return {
        dialogVisible: false,
        form: {
          id: '',
          name: '',
          description: '',
          customerInfo: '',
          beginTime: '',
          endTime: '',
          technology: '',
          business: '',
          feature: '',
          status: '',
          vmSpace: '',
          gitPath: '',
          filePath: ''
        }
      }
    },
    mounted: function() {
      var _this = this
      axios({
        method: "get",
        url: "/project/info",
        params:{
          projectId : _this.$route.query.projectId
        }
      }).then(response => {
        console.log(response.data)
        if (response.data.code === 0) {
          _this.form = response.data.data
        }
      })
    },
    methods: {
      onSubmit() {
        var _this = this
        if(_this.form.status === '已驳回')
        {
          _this.form.status = '待立项'
        }
        axios({
          method: "put",
          url: "/project/update",
          data:{
            id: _this.form.id,
            name: _this.form.name,
            beginTime: _this.form.beginTime,
            endTime: _this.form.endTime,
            business: _this.form.business,
            customerInfo: _this.form.customerInfo,
            description: _this.form.description,
            feature: _this.form.feature,
            technology: _this.form.technology,
            status: _this.form.status
          }
        }).then(response => {
          console.log(response.data)
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
