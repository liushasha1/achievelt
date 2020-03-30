<template>
  <div style="margin-bottom: 40px; ">
    <el-breadcrumb style="font-size: 14px; margin-bottom: 20px;" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '' }">项目管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/manage_project' }">管理项目其他信息</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/manage_authority' }">管理权限</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-header style="color:#303133 ;font-size: 20px;margin-left: -20px">
        管理项目人员权限
      </el-header>
      <div style="width: 100%;height: 1px;background-color: #409EFF;margin-top: -20px"></div>
      <div class="boxbutton">
        <span>共{{total}}条记录</span>
        <el-input placeholder="搜索关键字" v-model="keyValue" style="width: 160px;margin-left: 650px">
        </el-input>
        <el-button round @click="search" style="background-color:#409EFF;width: 60px;color: white;padding: 10px;margin-left: 10px">
          搜索</el-button>
      </div>
      <div>
        <el-table :data="tableData" style="width: 100%" height= 500
          :default-sort="{prop: ['staffId','projectId','role','gitAuth','fileAuth','taskTimeAuth'], order: 'descending'}">
          <el-table-column prop="staffId" label="员工ID" align='center' sortable width="150">
          </el-table-column>
          <el-table-column prop="projectId" label="项目ID" align='center' sortable width="150">
          </el-table-column>
          <el-table-column prop="role" label="角色名称" align='center' sortable width="100">
          </el-table-column>
          <el-table-column prop="gitAuth" label="git权限" align='center' sortable width="100">
          </el-table-column>
          <el-table-column prop="fileAuth" label="文件服务器权限" align='center' sortable width="150">
          </el-table-column>
          <el-table-column prop="taskTimeAuth" label="登记工时权限" align='center' sortable>
          </el-table-column>
          <el-table-column label="操作" align='center' width="200">
             <template slot-scope="scope">
            <el-button type="success" style="width: 80px;font-size: 13px;padding: 0px;height: 40px;" @click="editAuthVisible = true;cur=scope;clear();"
              plain>编辑权限</el-button>
               </template>
          </el-table-column>
        </el-table>
        <el-dialog :visible.sync="editAuthVisible" width="40%" style="text-align: center" center>
          <el-form :model="form">
            <el-row>
              <el-col :span="5">
                <el-form-item> </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="git权限"> </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-select v-model="form.gitAuth" placeholder="请选择git权限类型">
                  <el-option label="无权限" value=0></el-option>
                  <el-option label="读" value=1></el-option>
                  <el-option label="读写" value=2></el-option>
                </el-select>
                </el-select>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5">
                <el-form-item> </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="文件服务器权限"> </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-select v-model="form.fileAuth" placeholder="请选择文件服务器权限类型">
                  <el-option label="无权限" value= 0></el-option>
                  <el-option label="读" value= 1></el-option>
                  <el-option label="读写" value= 2></el-option>
                </el-select>
                </el-select>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5">
                <el-form-item> </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="登记工时权限"> </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-select v-model="form.taskTimeAuth" placeholder="请选择登记工时权限类型">
                  <el-option label="无权限" value=0></el-option>
                  <el-option label="可登记" value=1></el-option>
                </el-select>
                </el-select>
              </el-col>
            </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="danger" style="width: 80px;" @click="editAuthVisible = false;clear()" plain>取消</el-button>
            <el-button type="primary" style="width: 80px;" @click="editAuthVisible = false;editAuth()" plain>确 定</el-button>
          </div>
        </el-dialog>
      </div>
      <div class="block" style="float: right;">
        <el-pagination  @current-change="changePage" :current-page="pageNum"
          :page-size="10"  layout="total, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>
<script>
  import axios from 'axios'
  export default {
    name: 'manage_authority',
    data() {
      return {
        keyValue: '',
        cur : {},
        sampleCompleteView: false,
        editAuthVisible: false,
        form: {
          gitAuth: '',
          fileAuth: '',
          taskTimeAuth: ''
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
       hasNextPage: false,
        tableData: [],
        git: {
          0: '无权限',
          1: '读',
          2: '读写'
        },
        file: {
          0: '无权限',
          1: '读',
          2: '读写'
        },
        taskTime: {
          0: '无权限',
          1: '可登记'
        }
      }
    },
    created: function() {
      this.id = sessionStorage.getItem('id')
    },
    mounted: function() {
      var _this = this
      axios({
        method: "get",
        url: "/auth/getMembers",
        params: {
          projectId: _this.$route.query.projectId,
          pageSize: 10
        }
      }).then(response => {
        if (response.data.code === 0) {
          console.log(response.data)
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
            elem.gitAuth = _this.git[elem.gitAuth]
            elem.fileAuth = _this.file[elem.fileAuth]
            elem.taskTimeAuth = _this.taskTime[elem.taskTimeAuth]
          })
        }
      })
    },
    methods: {
      //关键字搜索
      search(){
        var _this = this
        axios({
          method: "get",
          url: "/auth/getMembers",
          params: {
            projectId: _this.$route.query.projectId,
            pageSize: _this.pageSize,
            keyword: _this.keyValue
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
           url: "/auth/getMembers",
           params: {
             projectId: _this.$route.query.projectId,
             pageNum: val,
             pageSize: _this.pageSize
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
      clear(){
        this.form.gitAuth = '',
        this.form.fileAuth = '',
        this.form.taskTimeAuth = ''
      },
      editAuth(){
        var _this = this
        console.log(_this.cur)
        axios({
          method: "put",
          url: "/auth/update",
          params:{
            projectId: _this.$route.query.projectId,
            role: _this.cur.row.role,
            staffId: _this.cur.row.staffId,
            gitAuth: _this.form.gitAuth,
            fileAuth: _this.form.fileAuth,
            taskTimeAuth: _this.form.taskTimeAuth
          }
        }).then(Response => {
          console.log(Response.data)
          if (Response.data.code === 0) {
            this.$message({
              message: Response.data.msg,
              type: 'success'
            })
            _this.tableData[_this.cur.$index].gitAuth = _this.git[_this.form.gitAuth]
            _this.tableData[_this.cur.$index].fileAuth = _this.file[_this.form.fileAuth]
            _this.tableData[_this.cur.$index].taskTimeAuth = _this.taskTime[_this.form.taskTimeAuth]
          } else {
            this.$message({
              message: Response.data.msg,
              type: 'error'
            })
          }
         _this.clear()
      })
      },
      formatter(row, column) {
        return row.address;
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
