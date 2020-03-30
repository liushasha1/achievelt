<template>
  <div style="margin-bottom: 40px; ">
    <el-breadcrumb style="font-size: 14px; margin-bottom: 20px;" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '' }">项目管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/manage_project' }">管理项目其他信息</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/manage_personinfo' }">管理员工信息</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/modify_person' }">修改员工信息</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-header style="color:#303133 ;font-size: 20px;margin-left: -20px">
        修改员工基本信息
      </el-header>
      <div style="width: 100%;height: 1px;background-color: #606266;margin-top: -20px"></div>
      <div class="boxbutton">
        <span style="font-size: 17px;color: #333333">员工ID：{{form.id}}</span>
      </div>
      <div style="margin-top: 20px;margin-left: 10px;">
        <el-form ref="form" :model="form" label-width="130px" :inline="true" label-position="left">
          <el-row>
            <el-form-item label="姓名">
              <el-input v-model="form.name" style="width: 300px"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="邮件地址" style="width: 500px">
              <el-input v-model="form.email" style="width: 300px"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="所属部门">
              <el-input v-model="form.department" style="width: 300px"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="项目上级" style="width: 500px">
              <el-input v-model="form.manager" style="width: 300px"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="电话" style="width: 500px">
              <el-input v-model="form.tel" style="width: 300px"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item>
              <el-button type="primary" @click="submitDialogVisible=true" style="margin-left: 350px;width:100px;margin-top: 10px;">修改</el-button>
              <el-button type="primary" plain style="margin-left: 20px;width:100px;margin-top: 10px;" @click="$router.back(-1)">取消</el-button>
            </el-form-item>
          </el-row>
        </el-form>
        <el-dialog title="" :visible.sync="submitDialogVisible" width="30%" style="text-align: center" center>
          <span style="text-align: center;display:block; font-size: 15px">确认修改？</span>
          <span slot="footer" class="dialog-footer">
            <el-button type="danger" style="width: 60px;font-size: 12px;padding: 0px;height: 40px;" @click="submitDialogVisible = false;"
              plain>取消</el-button>
            <el-button type="primary" style="width: 60px;font-size: 12px;padding: 0px;height: 40px;" @click="submitDialogVisible = false;onSubmit();"
              plain>确定</el-button>
          </span>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    name: 'modify_person',
    data() {
      return {
        submitDialogVisible: false,
        form: {
          name: '',
          email: '',
          department: '',
          tel: '',
          manager: '',
          id: ''
        }
      }
    },
    mounted: function() {
      var _this = this
      axios({
        method: "get",
        url: "/staff/projectStaff",
        params: {
          projectId: _this.$route.query.projectId,
          keyword: _this.$route.query.staff
        }
      }).then(response => {
        console.log(response.data)
        if (response.data.code === 0) {
          _this.form = response.data.data.list[0]
        }
      })
    },
    methods: {
      //修改员工信息
      onSubmit() {
        var _this = this
        axios({
          method: "put",
          url: "/staff/modStaffInfo",
          params: {
            projectId: _this.$route.query.projectId
          },
          data: {
            department : _this.form.department,
            email: _this.form.email,
            id: _this.form.id,
            manager: _this.form.manager,
            name: _this.form.name,
            tel: _this.form.tel
          }
        }).then(response => {
          console.log(response.data)
          if (response.data.code === 0) {
            this.$message({
              message: response.data.msg,
              type: 'success'
            })
          }else{
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
