<template>
  <div style="margin-bottom: 30px; ">
    <el-breadcrumb style="font-size: 14px; margin-bottom: 20px;" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '' }">流程管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/apply_project' }">申请立项</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-header style="color:#303133 ;font-size: 20px;margin-left: -20px">
        管理项目申请立项
      </el-header>
      <div style="width: 100%;height: 1px;background-color: #409EFF;margin-top: -20px"></div>
      <div class="boxbutton">
        <el-button type="primary" icon="el-icon-plus" @click="add()" circle></el-button>
        <span>共{{total}}条项目信息</span>
        <el-input placeholder="搜索关键字" v-model="keyWord" style="width: 160px;margin-left: 650px">
        </el-input>
        <el-button round @click="search" style="background-color:#409EFF;width: 60px;color: white;padding: 10px;margin-left: 10px">
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
          <el-table-column label="操作" align='center' width="200">
            <template slot-scope="scope">
              <el-button type="success" style="width: 60px;font-size: 12px;padding: 0px;height: 40px;" :disabled="apply[scope.$index]"
                @click="dialogVisible=true;cur=scope;" plain>申请立项</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog title="" :visible.sync="dialogVisible" width="30%" style="text-align: center" center>
          <span style="text-align: center;display:block; font-size: 15px">确认申请立项？</span>
          <span slot="footer" class="dialog-footer">
            <el-button type="danger" style="width: 60px;font-size: 12px;padding: 0px;height: 40px;" @click="dialogVisible = false;"
              plain>取消</el-button>
            <el-button type="primary" style="width: 60px;font-size: 12px;padding: 0px;height: 40px;" @click="dialogVisible = false;applyProject();"
              plain>确定</el-button>
          </span>
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
    name: 'apply_project',
    data() {
      return {
        cur: {},
        dialogVisible: false,
        apply: [],
        tableData: [],
        keyWord: '',
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
      axios.get('/project/list?status='+'申请立项&' + 'status='+'待立项', {
        params: {
          roleEnum: '项目经理',
          pageNum: 1,
          pageSize: 10
        }}).then(response => {
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
          _this.tableData.forEach((elem, idx) => {
            elem.beginTime = elem.beginTime.slice(0, 10)
            elem.endTime = elem.endTime.slice(0, 10)
            if (elem.status === '申请立项') {
              _this.apply[idx] = true
            } else {
              _this.apply[idx] = false
            }
          })
        } else {
          _this.$router.push({
            path: '/no_auth',
          })
        }
      })
    },
    methods: {
      //新增立项
      add() {
        this.$router.push({
          path: '/add_project'
        })
      },
      //关键词搜索
      search() {
        var _this = this
        axios.get('/project/list?status='+'申请立项&' + 'status='+'待立项', {
          params: {
            roleEnum: '项目经理',
            pageNum: 1,
            pageSize: 10,
            keyWord: _this.keyWord
          }}).then(response => {
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
            _this.tableData.forEach((elem, idx) => {
              elem.beginTime = elem.beginTime.slice(0, 10)
              elem.endTime = elem.endTime.slice(0, 10)
              if (elem.status === '申请立项') {
                _this.apply[idx] = true
              } else {
                _this.apply[idx] = false
              }
            })
          }
        })
      },
      //获取第n页的列表数据
      changePage(val) {
        var _this = this
        axios.get('/project/list?status='+'申请立项&' + 'status='+'待立项', {
          params: {
            roleEnum: '项目经理',
            pageNum: val,
            pageSize: _this.pageSize,
            keyWord: _this.keyWord
          }}).then(response => {
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
            _this.tableData.forEach((elem, idx) => {
              elem.beginTime = elem.beginTime.slice(0, 10)
              elem.endTime = elem.endTime.slice(0, 10)
              if (elem.status === '申请立项') {
                _this.apply[idx] = true
              } else {
                _this.apply[idx] = false
              }
            })
          }
        })
      },
      //申请立项
      applyProject() {
        var _this = this
        axios({
          method: "put",
          url: "/project/applyBuild",
          params: {
            projectId: _this.cur.row.id
          }
        }).then(response => {
            console.log(response.data)
            if (response.data.code === 0) {
              _this.$set(_this.apply, _this.cur.$index, !_this.apply[_this.cur.$index])
              _this.tableData[_this.cur.$index].status = '申请立项'
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
        },
      }}
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
