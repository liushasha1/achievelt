<template>
  <div style="margin-bottom: 30px; ">
    <el-breadcrumb style="font-size: 14px; margin-bottom: 20px;" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '' }">流程管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/approve_manage' }">审批立项</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-header style="color:#303133 ;font-size: 20px;margin-left: -20px">
        管理项目审批立项
      </el-header>
      <div style="width: 100%;height: 1px;background-color: #409EFF;margin-top: -20px"></div>
      <div class="boxbutton">
        <span>共{{total}}条项目信息</span>
        <el-input  placeholder="搜索关键字" v-model="keyWord" style="width: 160px;margin-left: 650px">
        </el-input>
        <el-button  round @click="search" style="background-color:#409EFF;width: 60px;color: white;padding: 10px;margin-left: 10px">
          搜索</el-button>
      </div>
      <div>
        <el-table :data="tableData" style="width: 100%" height=500 :default-sort="{prop: ['id','name','scheduledTime','deliveryDay','projectSuperior','mainFunction'], order: 'descending'}">
          <el-table-column prop="id" label="项目ID" align='center' sortable width="150">
          </el-table-column>
          <el-table-column prop="name" label="项目名称" align='center' sortable >
          </el-table-column>
          <el-table-column prop="beginTime" label="预定时间" align='center' sortable width="130">
          </el-table-column>
          <el-table-column prop="endTime" label="交付日" align='center' sortable width="130">
          </el-table-column>
          <el-table-column prop="status" label="项目状态" align='center' sortable width="130">
          </el-table-column>
          <el-table-column label="操作" align='center' width="300">
            <template slot-scope="scope">
              <el-button type="primary" style="width: 60px;font-size: 12px;padding: 0px;height: 40px;" @click="projectDetail(scope.row.id)" plain>详情</el-button>
              <el-button type="success" style="width: 60px;font-size: 12px;padding: 0px;height: 40px;" @click="passDialogVisible=true;cur=scope;"
                plain>通过</el-button>
              <el-button type="danger" style="width: 60px;font-size: 12px;padding: 0px;height: 40px;" @click="rejectDialogVisible=true;cur=scope;"
                plain>驳回</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog title="" :visible.sync="passDialogVisible" width="30%" style="text-align: center" center>
          <span style="text-align: center;display:block; font-size: 15px">确认审核通过？</span>
          <span slot="footer" class="dialog-footer">
            <el-button type="danger" style="width: 60px;font-size: 12px;padding: 0px;height: 40px;" @click="passDialogVisible = false;"
              plain>取消</el-button>
            <el-button type="primary" style="width: 60px;font-size: 12px;padding: 0px;height: 40px;" @click="passDialogVisible = false;passAudit();"
              plain>确定</el-button>
          </span>
        </el-dialog>
        <el-dialog title="" :visible.sync="rejectDialogVisible" width="30%" style="text-align: center" center>
          <span style="text-align: center;display:block; font-size: 15px">确认驳回？</span>
          <span slot="footer" class="dialog-footer">
            <el-button type="danger" style="width: 60px;font-size: 12px;padding: 0px;height: 40px;" @click="rejectDialogVisible = false;"
              plain>取消</el-button>
            <el-button type="primary" style="width: 60px;font-size: 12px;padding: 0px;height: 40px;" @click="rejectDialogVisible = false;rejectAudit();"
              plain>确定</el-button>
          </span>
        </el-dialog>
        <div class="block" style="float: right;">
          <el-pagination  @current-change="changePage" :current-page="pageNum"
            :page-size="10"  layout="total, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
  import axios from 'axios'
  export default {
    name: 'approve_manage',
    data() {
      return {
        cur: {},
        rejectDialogVisible: false,
        passDialogVisible: false,
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
      axios({
        method: "get",
        url: "/project/list",
        params:
        {
          roleEnum : '项目上级',
          status: '申请立项',
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
            elem.beginTime = elem.beginTime.slice(0,10)
            elem.endTime = elem.endTime.slice(0,10)
          })
        }else{
          _this.$router.push({
          path: '/no_auth',
        })
        }
      })
    },
    methods: {
      formatter(row, column) {
        return row.address;
      },
      //关键词搜索
      search(){
        var _this = this
          axios({
            method: "get",
            url: "/project/list",
            params: {
              roleEnum : '项目上级',
              pageNum: 1,
              pageSize: 10,
              status: '申请立项',
              keyWord: _this.keyWord
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
      //获取第n页的列表数据
      changePage(val) {
        var _this = this
          axios({
            method: "get",
            url: "/project/list",
            params: {
              roleEnum : '项目上级',
              pageNum: val,
              pageSize: _this.pageSize,
              status: '申请立项',
              keyWord: _this.keyWord
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
      projectDetail(id){
        this.$router.push({
          path: '/project_detail',
          query:{
            projectId : id
          }
        })
      },
      rejectAudit() {
        var _this = this
        axios({
          method: "put",
          url: "/project/review",
          params: {
            projectId: _this.cur.row.id,
            status: -1
          }
        }).then(Response => {
          console.log(Response.data)
          if (Response.data.code === 0) {
            this.$message({
              message: Response.data.msg,
              type: 'success'
            })
            _this.tableData.splice(_this.cur.$index,1)
          } else {
            this.$message({
              message: Response.data.msg,
              type: 'error'
            })
          }
        })
      },
      passAudit() {
        var _this = this
        axios({
          method: "put",
          url: "/project/review",
          params: {
            projectId: _this.cur.row.id,
            status: 1
          }
        }).then(Response => {
          console.log(Response.data)
          if (Response.data.code === 0) {
            this.$message({
              message: Response.data.msg,
              type: 'success'
            })
            _this.tableData.splice(_this.cur.$index,1)
          } else {
            this.$message({
              message: Response.data.msg,
              type: 'error'
            })
          }
        })
      }
    },
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
