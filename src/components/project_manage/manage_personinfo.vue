<template>
  <div style="margin-bottom: 30px; ">
    <el-breadcrumb style="font-size: 14px; margin-bottom: 20px;" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '' }">项目管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/manage_project' }">管理项目其他信息</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/manage_personinfo' }">管理员工信息</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-header style="color:#303133 ;font-size: 20px;margin-left: -20px">
        管理项目员工信息
      </el-header>
      <div style="width: 100%;height: 1px;background-color: #409EFF;margin-top: -20px"></div>
      <div class="boxbutton">
        <span>共{{total}}条人员信息</span>
        <el-button @click="addFormVisible=true" round style="background-color:#409EFF;width: 60px;color: white;padding: 10px;margin-left: 10px">
          导入</el-button>
        <el-dialog :visible.sync="addFormVisible" width="40%" center>
          <el-form :model="form">
            <el-row>
              <el-col :span="5">
                <el-form-item> </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="选择人员"> </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-select style="width: 180px;margin-left: 5%;" v-model="form.staffId" filterable placeholder="请选择人员">
                  <el-option v-for="item in personList" :key="item.id" :label="item.id" :value="item.id"></el-option>
                </el-select>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5">
                <el-form-item> </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="分配角色"> </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-select style="width: 180px;margin-left: 5%;" v-model="form.role" filterable placeholder="请选择角色类型">
                  <el-option label="项目经理" value="项目经理">项目经理</el-option>
                  <el-option label="项目上级" value="项目上级">项目上级</el-option>
                  <el-option label="组织配置管理员" value="组织配置管理员">组织配置管理员</el-option>
                  <el-option label="EPG leader" value="EPG leader">EPG leader</el-option>
                  <el-option label="QA manager" value="QA manager">QA manager</el-option>
                  <el-option label="EPG" value="EPG">EPG</el-option>
                  <el-option label="QA" value="QA">QA</el-option>
                  <el-option label="开发 leader" value="开发 leader">开发 leader</el-option>
                  <el-option label="开发人员" value="开发人员">开发人员</el-option>
                  <el-option label="测试人员" value="测试人员">测试人员</el-option>
                  <el-option label="测试 leader" value="测试 leader">测试 leader</el-option>
                </el-select>
              </el-col>
            </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="danger" style="width: 80px;" @click="addFormVisible = false;clear()" plain>取消</el-button>
            <el-button type="primary" style="width: 80px;" @click="addFormVisible = false;addPerson();clear()" plain>确 定</el-button>
          </div>
        </el-dialog>
        <el-input placeholder="搜索关键字" v-model="keyValue" style="width: 160px;margin-left: 500px">
        </el-input>
        <el-button round @click="search" style="background-color:#409EFF;width: 60px;color: white;padding: 10px;margin-left: 10px">
          搜索</el-button>
      </div>
      <div>
        <el-table :data="tableData" style="width: 100%;" height=500 :default-sort="{prop: ['id','name','email','department','manager','tel'], order: 'descending'}">
          <el-table-column prop="id" label="员工ID" align='center' sortable width="100">
          </el-table-column>
          <el-table-column prop="name" label="姓名" align='center' sortable width="100">
          </el-table-column>
          <el-table-column prop="email" label="邮件地址" align='center' sortable>
          </el-table-column>
          <el-table-column prop="department" label="所属部门" align='center' sortable width="100">
          </el-table-column>
          <el-table-column prop="manager" label="项目上级" align='center' sortable width="100">
          </el-table-column>
          <el-table-column prop="tel" label="电话" align='center' sortable width="100">
          </el-table-column>
          <el-table-column label="操作" align='center' width="180">
            <template slot-scope="scope">
              <el-button type="primary" style="width: 60px;font-size: 12px;padding: 0px;height: 40px;" @click="cur=scope;modifyPerson();"
                plain>修改</el-button>
              <el-button type="danger" style="width: 60px;font-size: 12px;padding: 0px;height: 40px;" @click="cur=scope;submitDialogVisible=true"
                plain>删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block" style="float: right;">
          <el-pagination  @current-change="changePage" :current-page="pageNum"
            :page-size="10"  layout="total, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
        <el-dialog title="" :visible.sync="submitDialogVisible" width="30%" style="text-align: center" center>
          <span style="text-align: center;display:block; font-size: 15px">确认删除？</span>
          <span slot="footer" class="dialog-footer">
            <el-button type="danger" style="width: 60px;font-size: 12px;padding: 0px;height: 40px;" @click="submitDialogVisible = false;"
              plain>取消</el-button>
            <el-button type="primary" style="width: 60px;font-size: 12px;padding: 0px;height: 40px;" @click="submitDialogVisible = false;deletePerson();"
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
    name: 'manage_personinfo',
    data() {
      return {
        keyValue: '',
        addFormVisible: false,
        submitDialogVisible: false,
        tableData: [],
        cur: {},
        form: {
          list: [],
          staffId: '',
          role: ''
        },
        personList: [],
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
        url: "/staff/projectStaff",
        params: {
          projectId: _this.$route.query.projectId,
          pageSize: 10
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
      axios({
        method: "get",
        url: "/staff/importStaff",
        params: {
          projectId: _this.$route.query.projectId
        }
      }).then(response => {
        if (response.data.code === 0) {
          _this.form.list = response.data.data.list
          let i = 0
          for (; i < _this.form.list.length; i++) {
            _this.personList.push({
              id: _this.form.list[i].id,
              name: _this.form.list[i].name
            })
          }
        }
      })
    },
    methods: {
      //关键字搜索
      search(){
        var _this = this
          axios({
            method: "get",
            url: "/staff/projectStaff",
            params: {
              projectId: _this.$route.query.projectId,
              pageNum: 1,
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
            url: "/staff/projectStaff",
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
        this.form.staffId = ''
        this.form.role = ''
      },
      modifyPerson() {
        var _this = this
        _this.$router.push({
          path: '/manage_personinfo_modify',
          query: {
            projectId: _this.$route.query.projectId,
            staff: _this.cur.row.id
          }
        })
      },
      addPerson() {
        var _this = this
        axios({
          method: "post",
          url: "/auth/add",
          params: {
            projectId: _this.$route.query.projectId,
            staffId: _this.form.staffId,
            role: _this.form.role
          }
        }).then(response => {
          console.log(response.data)
          if (response.data.code === 0) {
            this.$message({
              message: response.data.msg,
              type: 'success'
            })
            axios({
              method: "get",
              url: "/staff/projectStaff",
              params: {
                projectId: _this.$route.query.projectId
              }
            }).then(response => {
              if (response.data.code === 0) {
                _this.tableData = response.data.data.list
                _this.total = response.data.data.total
              }
            })
          } else {
            this.$message({
              message: response.data.msg,
              type: 'error'
            })
          }
        })
      },
      deletePerson() {
        var _this = this
        axios({
          method: "delete",
          url: "/auth/delete",
          params: {
            projectId: _this.$route.query.projectId,
            staffId: _this.cur.row.id
          }
        }).then(response => {
          console.log(response.data)
          if (response.data.code === 0) {
            this.$message({
              message: response.data.msg,
              type: 'success'
            })
            axios({
              method: "get",
              url: "/staff/projectStaff",
              params: {
                projectId: _this.$route.query.projectId
              }
            }).then(response => {
              if (response.data.code === 0) {
                _this.tableData = response.data.data.list
                _this.total = response.data.data.total
              }
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
    background-color: #F3F3F3;
    padding: 10px;
  }
</style>
