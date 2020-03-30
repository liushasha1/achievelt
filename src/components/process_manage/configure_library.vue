<template>
  <div style="margin-bottom: 40px; ">
    <el-breadcrumb style="font-size: 14px; margin-bottom: 20px;" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '' }">流程管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/configure_library' }">配置库文件</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-header style="color:#303133 ;font-size: 20px;margin-left: -20px">
        配置库管理
      </el-header>
      <div style="width: 100%;height: 1px;background-color: #409EFF;margin-top: -20px"></div>
      <div class="boxbutton">
        <span>共{{total}}条项目信息</span>
        <el-input placeholder="搜索关键字" style="width: 160px;margin-left: 650px">
        </el-input>
        <el-button round style="background-color:#409EFF;width: 60px;color: white;padding: 10px;margin-left: 10px">
          搜索</el-button>
      </div>
      <div>
        <el-table :data="tableData" style="width: 100%" height=500 :default-sort="{prop: ['id','name','scheduledTime','deliveryDay','projectSuperior','mainFunction'], order: 'descending'}">
          <el-table-column prop="id" label="项目ID" align='center' sortable width="150">
          </el-table-column>
          <el-table-column prop="name" label="项目名称" align='center' sortable>
          </el-table-column>
          <el-table-column prop="beginTime" label="预定时间" align='center' sortable width="130">
          </el-table-column>
          <el-table-column prop="endTime" label="交付日" align='center' sortable width="130">
          </el-table-column>
          <el-table-column prop="status" label="项目状态" align='center' sortable width="130">
          </el-table-column>
          <el-table-column prop="gitPath" label="仓库地址" align='center' sortable width="130">
          </el-table-column>
          <el-table-column prop="filePath" label="文件服务器目录" align='center' sortable width="130">
          </el-table-column>
          <el-table-column prop="vmSpace" label="虚拟机空间" align='center' sortable width="130">
          </el-table-column>
          <el-table-column label="操作" align='center' width="200">
            <template slot-scope="scope">
              <el-button type="primary" style="width: 60px;font-size: 12px;padding: 0px;height: 40px;" @click="dialogVisible= true;cur = scope"
                plain>配置</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog title="" :visible.sync="dialogVisible" height=500 width="40%" style="text-align: center" center>
          <el-form ref="project" :rules="rules" :model="project" label-width="130px" :inline="true" class="demo-ruleForm">
            <el-row>
              <el-form-item label="Git仓库地址" prop="gitPath">
                <el-input v-model="project.gitPath" style="width: 300px"></el-input>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="文件服务器目录" prop="filePath" placeholder="公司Root目录+“\项目id”">
                <el-input v-model="project.filePath" style="width: 300px"></el-input>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="虚拟机空间" prop="vmSpace" placeholder="（d% GB）">
                <el-input v-model="project.vmSpace" style="width: 300px"></el-input>
              </el-form-item>
            </el-row>
            <el-row>
              <el-button type="danger" style="width: 60px;font-size: 12px;padding: 0px;height: 40px;margin-left: 200px;" plain  @click="dialogVisible= false;clear()">取消</el-button>
              <el-button type="primary" style="width: 60px;font-size: 12px;padding: 0px;height: 40px;" @click="onSubmit('project');dialogVisible= false;"
                plain>确定</el-button>
            </el-row>
          </el-form>
        </el-dialog>
        <div class="block" style="float: right;">
          <el-pagination @current-change="changePage" :current-page="pageNum" :page-size="10" layout="total, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
  import axios from 'axios'
  export default {
    name: 'configure_library',
    data() {
      return {
        cur: {},
        dialogVisible: false,
        tableData: [],
        project: {
          gitPath: '',
          filePath: '',
          vmSpace: ''
        },
        rules: {
          gitPath: [{
            required: true,
            message: '请输入Git仓库地址',
            trigger: 'blur'
          }],
          filePath: [{
            required: true,
            message: '请输入文件服务器目录',
            trigger: 'change'
          }],
          vmSpace: [{
            required: true,
            message: '请输入虚拟机空间',
            trigger: 'change'
          }]
        },
        total: 0,
        page: 1,
        pageNum: 0,
        pageSize: 0,
        size: 0,
        pages: 0,
        prePage: 0,
        nextPage: 0,
        isFirstPage: false,
        isLastPage: false,
        hasPreviousPage: false,
        hasNextPage: false
      }
    },
    mounted: function() {
      var _this = this
      axios({
        method: "get",
        url: "/project/list",
        params: {
          roleEnum: '组织配置管理员',
          status: '已立项',
          pageNum: 1,
          pageSize: 10
        }
      }).then(response => {
        console.log(response.data)
        if (response.data.code === 0) {
          _this.tableData = response.data.data.list
          if( _this.tableData.length === 0)
          {
            _this.$router.push({
              path: '/no_auth',
            })
          }
          _this.total = response.data.data.total
          _this.pageNum = response.data.data.pageNum
          _this.pageSize = response.data.data.pageSize
          _this.size = response.data.data.size
          _this.pages = response.data.data.pages
          _this.prePage = response.data.data.prePage
          _this.nextPage = response.data.data.nextPage
          _this.isFirstPage = response.data.data.isFirstPage
          _this.isLastPage = response.data.data.isLastPage
          _this.hasPreviousPage = response.data.data.hasPreviousPage
          _this.hasNextPage = response.data.data.hasNextPage
          _this.tableData.forEach((elem, idx) => {
            elem.beginTime = elem.beginTime.slice(0, 10)
            elem.endTime = elem.endTime.slice(0, 10)
          })
        } else {
          _this.$router.push({
            path: '/no_auth',
          })
        }
      })
    },
    methods: {
      clear() {
        this.project.gitPath = ''
        this.project.filePath = ''
        this.project.vmSpace = ''
      },
      //添加配置库
      onSubmit(formName) {
        var _this = this
        this.$refs[formName].validate((valid) => {
            if (valid) {
              axios({
                method: "put",
                url: "/project/update",
                data: {
                  id: _this.cur.row.id,
                  name: _this.cur.row.name,
                  status: _this.cur.row.status,
                  beginTime: _this.cur.row.beginTime,
                  endTime: _this.cur.row.endTime,
                  business: _this.cur.row.business,
                  customerInfo: _this.cur.row.customerInfo,
                  description: _this.cur.row.description,
                  feature: _this.cur.row.feature,
                  technology: _this.cur.row.technology,
                  gitPath: _this.project.gitPath,
                  filePath: _this.project.filePath,
                  vmSpace: _this.project.vmSpace
                },
              }).then(response => {
                console.log(response.data)
                if (response.data.code === 0) {
                  this.$message({
                    message: response.data.msg,
                    type: 'success'
                  })
                  _this.tableData[_this.cur.$index].gitPath = _this.project.gitPath
                  _this.tableData[_this.cur.$index].filePath = _this.project.filePath
                  _this.tableData[_this.cur.$index].vmSpace = _this.project.vmSpace
                  _this.clear()
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
          },
      //获取第n页的列表数据
      changePage(val) {
        var _this = this
        axios({
          method: "get",
          url: "/project/list",
          params: {
            roleEnum: '项目经理',
            pageNum: val,
            pageSize: _this.pageSize,
            status: '已立项'
          }
        }).then(response => {
          console.log(response.data)
          if (response.data.code === 0) {
            _this.tableData = response.data.data.list
            _this.total = response.data.data.total
            _this.pageNum = response.data.data.pageNum
            _this.pageSize = response.data.data.pageSize
            _this.size = response.data.data.size
            _this.pages = response.data.data.pages
            _this.prePage = response.data.data.prePage
            _this.nextPage = response.data.data.nextPage
            _this.isFirstPage = response.data.data.isFirstPage
            _this.isLastPage = response.data.data.isLastPage
            _this.hasPreviousPage = response.data.data.hasPreviousPage
            _this.hasNextPage = response.data.data.hasNextPage
          }
        })
      },
    }
  }
</script>
<style scoped>
  .main {
    width: 85%;
    height: 90%;
    margin-top: 1.5%;
    position: absolute;
    left: 15%;
    border-radius: 10px;
  }

  .boxbutton {
    margin-top: 1%;
    width: 98.5%;
    background-color: #F3F3F3;
    padding: 10px;
  }
</style>
