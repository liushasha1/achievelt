<template>
  <div style="margin-bottom: 20px; ">
    <el-breadcrumb style="font-size: 14px; margin-bottom: 20px;" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '' }">其他管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/manage_risk' }">风险管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-header style="color:#303133 ;font-size: 20px;margin-left: -20px">
        管理其他
      </el-header>
      <div style="width: 100%;height: 1px;background-color: #409EFF;margin-top: -20px"></div>
      <div class="boxbutton">
        <span>共{{total}}条项目信息</span>
      </div>
      <div>
        <el-table :data="tableData" style="width: 100%" height=500 :default-sort="{prop: ['id','name','beginTime','endTime','status'], order: 'descending'}">
          <el-table-column prop="id" label="项目ID" align='center' sortable width="150">
          </el-table-column>
          <el-table-column prop="name" label="项目名称" align='center' sortable>
          </el-table-column>
          <el-table-column prop="beginTime" label="预定时间" align='center' sortable width="150">
          </el-table-column>
          <el-table-column prop="endTime" label="交付日" align='center' sortable width="150">
          </el-table-column>
          <el-table-column prop="status" label="项目状态" align='center' sortable width="100">
          </el-table-column>
          <el-table-column label="操作" align='center' width="100">
            <template slot-scope="ss">
              <el-button type="primary" style="width: 60px;font-size: 12px;padding: 0px;height: 40px;" @click="facilityManage(ss.row.id);"
                plain>风险管理
              </el-button>
            </template>
          </el-table-column>

        </el-table>


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
    name: "manage_risk",
    data() {
      return {
        id: '',

        cur: {},
        tableData: [],
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
      let _this = this;
      axios({
        method: "get",
        url: "/project/list",
        params: {
          pageNum: 1,
          pageSize: 10
          //roleEnum : '组织配置管理员'
        }
      }).then(response => {
        console.log('``````````````');
        console.log(response.data);
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
          })
        } else {
          _this.$router.push({
            path: '/no_auth',
          })
        }
      })
    },
    methods: {
      //修改项目基本信息
      facilityManage(id) {
        let _this = this
        _this.$router.push({
          path: '/risk',
          query: {
            projectId: id
          }
        })
      },
      //获取第n页的列表数据
      changePage(val) {
        let _this = this
        axios({
          method: "get",
          url: "/project/list",
          params: {
            pageNum: val,
            pageSize: _this.pageSize
          }
        }).then(response => {
          console.log(response.data)
          if (response.data.code === 0) {
            _this.tableData = response.data.data.list
            _this.totalNum = response.data.data.total
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
          }
        })
      },
    }
  }
</script>

<style scoped>
  .boxbutton {
    margin-top: 1%;
    width: 98.5%;
    background-color: #F3F3F3;
    padding: 10px;
  }
</style>
