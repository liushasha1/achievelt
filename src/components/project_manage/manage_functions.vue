<template>
  <div style="margin-bottom: 40px; ">
    <el-breadcrumb style="font-size: 14px; margin-bottom: 20px;" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '' }">项目管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/manage_project' }">管理项目其他信息</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/manage_functions' }">管理功能列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-header style="color:#303133 ;font-size: 20px;margin-left: -20px">
        管理项目功能列表
        <el-button round type="info" style="float: right;margin-left: 10px;height: 39px;margin-top: -5px" @click="importExcel()">
          导入</el-button>
        <el-button round type="warning" style="float: right;margin-left: 10px;height: 39px;margin-top: -5px" @click="exportExcel()">
          下载</el-button>
      </el-header>
      <div style="width: 100%;height: 1px;background-color: #409EFF;margin-top: -20px"></div>
      <div class="boxbutton">
        <el-button type="primary" icon="el-icon-plus" @click="addFormVisible=true" circle></el-button>
        <el-dialog :visible.sync="addFormVisible" width="40%" center>
          <el-form :model="form">
            <el-row>
              <el-col :span="5">
                <el-form-item> </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="功能名称"> </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-input v-model="form.feature"></el-input>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5">
                <el-form-item> </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="子功能名称"> </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-input v-model="form.subFeature"></el-input>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5">
                <el-form-item> </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="描述"></el-form-item>
              </el-col>
              <el-col :span="8">
                <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="form.description"></el-input>
              </el-col>
            </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="danger" style="width: 80px;" @click="addFormVisible = false;clear()" plain>取消</el-button>
            <el-button type="primary" style="width: 80px;" @click="addFormVisible = false;addFeature();clear()" plain>确
              定</el-button>
          </div>
        </el-dialog>
        <span style="margin-left: 20px">共{{total}}条记录</span>
      </div>
      <div>
        <el-table :data="functions.data" style="width: 100%" height=500 border>
          <el-table-column prop="id" label="功能ID" align='center' sortable width="150">
          </el-table-column>
          <el-table-column :key="item.id" v-for="(item,index) in functions.columns" :label="item.label" :prop="item.prop"
            :width="item.width" align='center'>
            <template slot-scope="scope">
              <span v-if="scope.row.isSet">
                <el-input size="mini" placeholder="请输入内容" v-model="functions.sel[item.prop]">
                </el-input>
              </span>
              <span v-else>{{scope.row[item.prop]}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align='center' width="300">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-check" circle @click.stop="saveRow(scope.row,scope.$index)"></el-button>
              <el-button type="success" icon="el-icon-edit" circle @click="editRow(scope.row)"></el-button>
              <el-button type="danger" icon="el-icon-delete" circle @click="deleteRow(scope.row,scope.$index,functions.data)"></el-button>
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
  import axios from 'axios';
  import fileDownload from 'js-file-download';
  export default {
    name: 'manage_functions',
    data() {
      return {
        file: '',
        addFormVisible: false,
        form: {
          feature: '',
          subFeature: '',
          description: ''
        },
        featureList: [],
        functions: {
          sel: null, //选中行
          columns: [{
              prop: "feature",
              label: "功能",
              width: 120
            },
            {
              prop: "subFeature",
              label: "子功能",
              width: 150
            },
            {
              prop: "description",
              label: "功能描述"
            }
          ],
          data: [],
        },
        num: 0,
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
        url: "/feature/list",
        params: {
          projectId: _this.$route.query.projectId,
          pageNum: 1,
          pageSize: 10,
        }
      }).then(response => {
        console.log(response.data)
        if (response.data.code === 0) {
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
          var i = 0
          for (; i < response.data.data.list.length; i++) {
            _this.functions.data.push({
              id: response.data.data.list[i].id,
              feature: response.data.data.list[i].feature,
              subFeature: response.data.data.list[i].subFeature,
              description: response.data.data.list[i].description,
              isSet: false
            })
            _this.featureList.push({
              id: response.data.data.list[i].id,
              projectId: response.data.data.list[i].projectId,
              feature: response.data.data.list[i].feature,
              subFeature: response.data.data.list[i].subFeature,
              description: response.data.data.list[i].description
            })
          }
        }
      })
    },
    methods: {
      //获取第n页的列表数据
      changePage(val) {
        var _this = this
        axios({
          method: "get",
          url: "/feature/list",
          params: {
            projectId: _this.$route.query.projectId,
            pageNum: val,
            pageSize: _this.pageSize,
            keyWord: _this.keyWord
          }
        }).then(response => {
            if (response.data.code === 0) {
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
              var i = 0
              _this.functions.data = []
              _this.featureList = []
              for (; i < response.data.data.list.length; i++) {
                _this.functions.data.push({
                  id: response.data.data.list[i].id,
                  feature: response.data.data.list[i].feature,
                  subFeature: response.data.data.list[i].subFeature,
                  description: response.data.data.list[i].description,
                  isSet: false
                })
                _this.featureList.push({
                  id: response.data.data.list[i].id,
                  projectId: response.data.data.list[i].projectId,
                  feature: response.data.data.list[i].feature,
                  subFeature: response.data.data.list[i].subFeature,
                  description: response.data.data.list[i].description
                })
              }
            }
        })
      },
      clear() {
        this.form.feature = ''
        this.form.subFeature = ''
        this.form.description = ''
      },
      importExcel() {
        this.$router.push({
          path: '/manage_functions_import_excel',
          query: {
            projectId: this.$route.query.projectId
          }
        })
      },
      exportExcel() {
        var _this = this
        axios({
          method: "get",
          url: "/feature/getExcel",
          data: _this.featureList,
          params: {
            projectId: _this.$route.query.projectId
          }
        }).then(response => {
          if (response.data.code === 0) {
            console.log(response.data)
            window.location.href = 'http://47.100.30.181:8100' + response.data.data
          }
        })
      },
      addFeature() { //增加功能
        var _this = this
        axios({
          method: "post",
          url: "/feature/build",
          data: [{
            projectId: _this.$route.query.projectId,
            feature: _this.form.feature,
            subFeature: _this.form.subFeature,
            description: _this.form.description
          }]
        }).then(response => {
          console.log(response.data)
          if (response.data.code === 0) {
            _this.functions.data = []
            axios({
              method: "get",
              url: "/feature/list",
              params: {
                projectId: _this.$route.query.projectId
              }
            }).then(response => {
              console.log(response.data)
              if (response.data.code === 0) {
                var i = 0
                for (; i < response.data.data.list.length; i++) {
                  _this.functions.data.push({
                    id: response.data.data.list[i].id,
                    feature: response.data.data.list[i].feature,
                    subFeature: response.data.data.list[i].subFeature,
                    description: response.data.data.list[i].description,
                    isSet: false
                  })
                }
                _this.total = _this.total+1
              }
            })
            _this.$message({
              message: response.data.msg,
              type: 'success'
            })
          } else {
            _this.$message({
              message: response.data.msg,
              type: 'error'
            })
          }
        })
      },
      saveRow(row, index) { //保存更改
        let data = JSON.parse(JSON.stringify(this.functions.sel));
        for (let k in data) {
          row[k] = data[k] //将sel里面的value赋值给这一行。ps(for....in..)的妙用，细心的同学发现这里我并没有循环对象row
        }
        var _this = this
        axios({
          method: "put",
          url: "/feature/update",
          data: [{
            projectId: _this.$route.query.projectId,
            id: row.id,
            feature: row.feature,
            subFeature: row.subFeature,
            description: row.description
          }]
        }).then(response => {
          console.log(response.data)
          if (response.data.code === 0) {
            _this.$message({
              message: response.data.msg,
              type: 'success'
            })
          } else {
            _this.$message({
              message: response.data.msg,
              type: 'error'
            })
          }
        })
        row.isSet = false;
      },
      editRow(row) { //编辑
        for (let i of this.functions.data) {
          if (i.isSet)
            return this.$message.warning("请先保存当前编辑项");
        }
        this.functions.sel = row
        row.isSet = true
      },
      deleteRow(row, index, rows) { //删除
        var _this = this
        axios({
          method: "delete",
          url: "/feature/delete",
          data: [row.id]
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
            console.log(response.data.msg)
          }
        })
        _this.total = _this.total -1
        rows.splice(index, 1)
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
