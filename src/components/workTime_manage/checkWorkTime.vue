<template>
  <div style="margin-bottom: 30px; ">
    <el-breadcrumb style="font-size: 14px; margin-bottom: 20px;" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '' }">工时管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/checkWorkTime' }">审核工时</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-header style="color:#303133 ;font-size: 20px;margin-left: -20px">
        审核工时
      </el-header>
      <div style="width: 100%;height: 1px;background-color: #409EFF;margin-top: -20px"></div>
      <div class="boxbutton">
        <span>共{{total}}条信息</span>


      </div>
      <div>
        <el-table :data="tableData" style="width: 100%" height=500
                  :default-sort="{prop: ['ID','name','scheduledTime','deliveryDay','projectSuperior','mainFunction'], order: 'descending'}">
          <el-table-column prop="id" label="ID" align='center' sortable min-width="80">
          </el-table-column>
          <el-table-column prop="projectId" label="项目ID" align='center' sortable>
          </el-table-column>
          <el-table-column prop="featureId" label="功能ID" align='center' sortable>
          </el-table-column>
          <el-table-column prop="activityId" label="活动ID" align='center' sortable>
          </el-table-column>
          <el-table-column prop="beginTime" label="开始时间" align='center' sortable>
          </el-table-column>
          <el-table-column prop="endTime" label="结束时间" align='center' sortable>
          </el-table-column>
          <el-table-column prop="updateTime" label="更新时间" align='center' sortable>
          </el-table-column>
          <el-table-column prop="staffId" label="申请人" align='center' sortable>
          </el-table-column>
          <el-table-column prop="status" label="状态" align='center' sortable>
          </el-table-column>

          <el-table-column label="操作" align='center' min-width="120">
            <template slot-scope="ss">
              <el-button type="success" icon="el-icon-check" @click="passTime(ss.row)" circle></el-button>
              <el-button type="danger" icon="el-icon-close" @click="refuseTime(ss.row)" circle></el-button>
            </template>
          </el-table-column>
        </el-table>
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
    name: "checkWorkTime",
    data() {
      return {
        formVisible: false,
        form: {
          list: ''
        },
        tableData: [{
          ID: '2020-0001-D-01',
          startTime: '2020-01-02',
          endTime: '2020-04-02',
          name: 'Achievelt软件开发项目平台1.0',
          featureName: '登录',
          activityName: '工程活动-设计',
          state: '0(待审)',
          staff: 'john'
        }],
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
    mounted: function () {
      let _this = this;
      axios({
        method: "get",
        url: "/taskTime/getList",
        params:
          {
            pageNum: 1,
            pageSize: 10
          }
      }).then(response => {
        console.log('get task');
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
            elem.beginTime = elem.beginTime.slice(0, 10);
            elem.endTime = elem.endTime.slice(0, 10);
            elem.updateTime = elem.updateTime.slice(0, 10)
          })
        } else {
          this.$message({
            message: response.data.msg,
            type: 'error'
          })
        }
      })
    },
    computed: {},
    methods: {
      //获取第n页的列表数据
      changePage(val) {
        let _this = this;
        axios({
          method: "get",
          url: "/taskTime/getList",
          params:
            {
            pageNum: val,
            pageSize: _this.pageSize,
            }
        }).then(response => {
          console.log('get task');
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
              elem.beginTime = elem.beginTime.slice(0, 10);
              elem.endTime = elem.endTime.slice(0, 10);
              elem.updateTime = elem.updateTime.slice(0, 10)
            })
          } else {
            this.$message({
              message: response.data.msg,
              type: 'error'
            })
          }
        })
      },
      formatter(row, column) {
        return row.address;
      },

      passTime(row) {
        //0 是申请中 1通过 -1 拒绝
        if (row.status !== 0) return;

        let _this = this;
        axios({
          method: "put",
          url: "/taskTime/review",
          params:
            {
              projectId: row.projectId,
              id: row.id,
              status: 1,
            },
          data: {}
        }).then(response => {
          if (response.data.code === 0) {
            row.status = 1;
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
      refuseTime(row) {
        //0 是申请中 1通过 -1 拒绝
        if (row.status !== 0) return;

        let _this = this;
        axios({
          method: "put",
          url: "/taskTime/review",
          params:
            {
              projectId: row.projectId,
              id: row.id,
              status: 2,
            },
          data: {

          }
        }).then(response => {
          if (response.data.code === 0) {
            row.status = 1;
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
     margin-top: 1%;
     width: 98.5%;
     background-color: #F3F3F3;
     padding: 10px;
   }
</style>
