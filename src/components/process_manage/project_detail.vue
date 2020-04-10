<template>
  <div style="margin-bottom: 40px; ">
    <el-breadcrumb style="font-size: 14px; margin-bottom: 20px;" separator-class="el-icon-arrow-right">

    </el-breadcrumb>
    <el-card>
      <el-header style="color:#303133 ;font-size: 20px;margin-left: -20px">
        项目基本信息
          <el-button type="primary" round style="width:80px;float: right;margin-left: 10px;margin-top: -5px;"
              @click="$router.back(-1)"> 返回</el-button>
      </el-header>
      <div style="width: 100%;height: 1px;background-color: #606266;margin-top: -20px"></div>
      <div class="boxbutton">
        <span style="font-size: 17px;color: #333333">项目ID：{{form.id}}</span>
      </div>
      <div style="margin-top: 20px">
        <el-form ref="form" :model="form" label-width="130px" :inline="true" label-position="left">
          <el-row>
            <el-form-item label="项目名称">
              <el-form-item>{{form.name}}
              </el-form-item>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="客户信息:">
              <el-form-item>{{form.customerInfo}}
              </el-form-item>
            </el-form-item>
          </el-row>

          <el-row>
            <el-form-item label="预定时间">
              <el-form-item>{{form.beginTime}}
              </el-form-item>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="交付日">
              <el-form-item>{{form.endTime}}
              </el-form-item>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="项目上级" style="width: 500px">
              <el-form-item>{{form.projectSuperiors}}
              </el-form-item>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="项目状态">
              <el-select v-model="form.status" :disabled="true">
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="主要里程碑">
              <el-form-item>{{form.discription}}
              </el-form-item>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="采用技术">
              <el-form-item>{{form.technology}}
              </el-form-item>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="业务领域">
              <el-form-item>{{form.business}}
              </el-form-item>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="主要功能">
              <el-form-item>{{form.feature}}
              </el-form-item>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="git仓库地址">
              <el-form-item>{{form.gitPath}}
              </el-form-item>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="文件服务器目录">
              <el-form-item>{{form.filePath}}
              </el-form-item>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="虚拟机空间">
              <el-form-item>{{form.vmSpace}}
              </el-form-item>
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
    name: 'project_detail',
    data() {
      return {
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
          gitPath: '',
          filePath: '',
          vmSpace: ''
        }
      }
    },
    mounted: function() {
      var _this = this
      axios({
        method: "get",
        url: "/project/info",
        params: {
          projectId: _this.$route.query.projectId
        }
      }).then(response => {
        console.log(response.data)
        if (response.data.code === 0) {
          _this.form = response.data.data
          _this.form.beginTime = _this.form.beginTime.slice(0, 10)
          _this.form.endTime = _this.form.endTime.slice(0, 10)
        }
      })
    },
    methods: {
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
