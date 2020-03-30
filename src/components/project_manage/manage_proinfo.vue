 <template>
  <div style="margin-bottom: 20px; ">
    <el-breadcrumb style="font-size: 14px; margin-bottom: 20px;" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '' }">项目管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/manage_proinfo' }">管理项目信息</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-header style="color:#303133 ;font-size: 20px;margin-left: -20px">
        管理项目基本信息
      </el-header>
      <div style="width: 100%;height: 1px;background-color: #409EFF;margin-top: -20px"></div>
      <div class="boxbutton">
        <span>共{{total}}条项目信息</span>
        <el-input placeholder="搜索关键字" v-model="keyWord" style="width: 160px;margin-left: 650px">
        </el-input>
        <el-button round @click="search()" style="background-color:#409EFF;width: 60px;color: white;padding: 10px;margin-left: 10px">
          搜索</el-button>
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
          <el-table-column label="操作" align='center' width="400">
            <template slot-scope="scope">
              <el-button type="primary" style="width: 60px;font-size: 12px;padding: 0px;height: 40px;" :disabled="modify[scope.$index]"
              @click="modifyProject(scope.row.id);" plain>修改</el-button>
              <el-button type="info" style="width: 60px;font-size: 12px;padding: 0px;height: 40px;" :disabled="begin[scope.$index]"
                @click="beginDialogVisible = true; cur=scope;" plain>启动</el-button>
              <el-button type="success" style="width: 60px;font-size: 12px;padding: 0px;height: 40px;" :disabled="submit[scope.$index]"
                @click="submitDialogVisible = true; cur=scope;" plain>交付</el-button>
              <el-button type="warning" style="width: 60px;font-size: 12px;padding: 0px;height: 40px;" :disabled="end[scope.$index]"
                @click="endDialogVisible = true; cur=scope;" plain>结束</el-button>
              <el-button type="danger" style="width: 60px;font-size: 12px;padding: 0px;height: 40px;" :disabled="Delete[scope.$index]"
                @click="deleteDialogVisible = true; cur=scope;" plain>删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog title="" :visible.sync="beginDialogVisible" width="30%" style="text-align: center" center>
          <span style="text-align: center;display:block; font-size: 15px">确认开启该项目？</span>
          <span slot="footer" class="dialog-footer">
            <el-button type="danger" style="width: 60px;font-size: 12px;padding: 0px;height: 40px;" @click="beginDialogVisible = false;"
              plain>取消</el-button>
            <el-button type="primary" style="width: 60px;font-size: 12px;padding: 0px;height: 40px;" @click="beginDialogVisible = false;beginProject();"
              plain>确定</el-button>
          </span>
        </el-dialog>
        <el-dialog title="" :visible.sync="submitDialogVisible" width="30%" style="text-align: center" center>
          <span style="text-align: center;display:block; font-size: 15px">确认交付该项目？</span>
          <span slot="footer" class="dialog-footer">
            <el-button type="danger" style="width: 60px;font-size: 12px;padding: 0px;height: 40px;" @click="submitDialogVisible = false;"
              plain>取消</el-button>
            <el-button type="primary" style="width: 60px;font-size: 12px;padding: 0px;height: 40px;" @click="submitDialogVisible = false;submitProject();"
              plain>确定</el-button>
          </span>
        </el-dialog>
        <el-dialog title="" :visible.sync="endDialogVisible" width="30%" style="text-align: center" center>
          <span style="text-align: center;display:block; font-size: 15px">确认结束该项目？</span>
          <span slot="footer" class="dialog-footer">
            <el-button type="danger" style="width: 60px;font-size: 12px;padding: 0px;height: 40px;" @click="endDialogVisible = false;"
              plain>取消</el-button>
            <el-button type="primary" style="width: 60px;font-size: 12px;padding: 0px;height: 40px;" @click="endDialogVisible = false;endProject();"
              plain>确定</el-button>
          </span>
        </el-dialog>
        <el-dialog title="" :visible.sync="deleteDialogVisible" width="30%" style="text-align: center" center>
          <span style="text-align: center;display:block; font-size: 15px">确认删除该项目？</span>
          <span slot="footer" class="dialog-footer">
            <el-button type="danger" style="width: 60px;font-size: 12px;padding: 0px;height: 40px;" @click="deleteDialogVisible = false;"
              plain>取消</el-button>
            <el-button type="primary" style="width: 60px;font-size: 12px;padding: 0px;height: 40px;" @click="deleteDialogVisible = false;deleteProject();"
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
    name: 'manage_proinfo',
    data() {
      return {
        id: '',
        keyWord: '',
        submitDialogVisible: false,
        endDialogVisible: false,
        deleteDialogVisible: false,
        beginDialogVisible: false,
        cur: {},
        modify: [],
        submit: [],
        end: [],
        Delete: [],
        begin: [],
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
      var _this = this
      axios({
        method: "get",
        url: "/project/list",
        params:
        {
          roleEnum: '项目经理',
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
            if(elem.status === '已立项')
            {
              _this.begin[idx] = false
            }else{
              _this.begin[idx] = true
            }
            if(elem.status === '进行中')
            {
              _this.submit[idx] = false
            }else{
              _this.submit[idx] = true
            }
            if(elem.status === '已交付')
            {
              _this.end[idx] = false
            }
            else{
              _this.end[idx] = true
            }
            if (elem.status === '已完结' || elem.status === '已归档' || elem.status === '申请立项') {
              _this.modify[idx] = true
              _this.Delete[idx] = true
            } else {
              _this.modify[idx] = false
              _this.Delete[idx] = false
            }
          })
        }else{
          _this.$router.push({
          path: '/no_auth',
        })
        }
      })
    },
    methods: {
      //关键词搜索
      search(){
        var _this = this
          axios({
            method: "get",
            url: "/project/list",
            params: {
              roleEnum: '项目经理',
              pageNum: 1,
              pageSize: 10,
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
              _this.tableData.forEach((elem, idx) => {
                elem.beginTime = elem.beginTime.slice(0,10)
                elem.endTime = elem.endTime.slice(0,10)
                if(elem.status === '已立项')
                {
                  _this.begin[idx] = false
                }else{
                  _this.begin[idx] = true
                }
                if(elem.status === '进行中')
                {
                  _this.submit[idx] = false
                }else{
                  _this.submit[idx] = true
                }
                if(elem.status === '已交付')
                {
                  _this.end[idx] = false
                }
                else{
                  _this.end[idx] = true
                }
                if (elem.status === '已完结' || elem.status === '已归档' || elem.status === '申请立项') {
                  _this.modify[idx] = true
                  _this.Delete[idx] = true
                } else {
                  _this.modify[idx] = false
                  _this.Delete[idx] = false
                }
              })
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
              roleEnum: '项目经理',
              pageNum: val,
              pageSize: _this.pageSize,
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
              _this.tableData.forEach((elem, idx) => {
                elem.beginTime = elem.beginTime.slice(0,10)
                elem.endTime = elem.endTime.slice(0,10)
                if(elem.status === '已立项')
                {
                  _this.begin[idx] = false
                }else{
                  _this.begin[idx] = true
                }
                if(elem.status === '进行中')
                {
                  _this.submit[idx] = false
                }else{
                  _this.submit[idx] = true
                }
                if(elem.status === '已交付')
                {
                  _this.end[idx] = false
                }
                else{
                  _this.end[idx] = true
                }
                if (elem.status === '已完结' || elem.status === '已归档' || elem.status === '申请立项') {
                  _this.modify[idx] = true
                  _this.Delete[idx] = true
                } else {
                  _this.modify[idx] = false
                  _this.Delete[idx] = false
                }
              })
            }
          })
      },
      //修改项目基本信息
      modifyProject(id) {
         var _this = this
        _this.$router.push({
          path: '/manage_proinfo_modify',
          query:{
            projectId: id
          }
        })
      },
      //将项目改为进行中
      beginProject(){
        var _this = this
        axios({
          method: "put",
          url: "/project/onGoing",
          params: {
            projectId: _this.cur.row.id
          }
        }).then(Response => {
          console.log(Response.data)
          if (Response.data.code === 0) {
            _this.$set(_this.submit, _this.cur.$index, !_this.submit[_this.cur.$index])
            _this.$set(_this.begin, _this.cur.$index, !_this.begin[_this.cur.$index])
            _this.tableData[_this.cur.$index].status = '进行中'
            this.$message({
              message: Response.data.msg,
              type: 'success'
            })
          } else {
            this.$message({
              message: Response.data.msg,
              type: 'error'
            })
          }
        })
      },
      //交付项目
      submitProject(){
        var _this = this
        axios({
          method: "put",
          url: "/project/deliver",
          params: {
            projectId: _this.cur.row.id
          }
        }).then(Response => {
          console.log(Response.data)
          if (Response.data.code === 0) {
            _this.$set(_this.submit, _this.cur.$index, !_this.submit[_this.cur.$index])
            _this.$set(_this.end, _this.cur.$index, !_this.end[_this.cur.$index])
            _this.tableData[_this.cur.$index].status = '已交付'
            this.$message({
              message: Response.data.msg,
              type: 'success'
            })
          } else {
            this.$message({
              message: Response.data.msg,
              type: 'error'
            })
          }
        })
      },
      //结束项目
      endProject() {
        var _this = this
        axios({
          method: "put",
          url: "/project/close",
          params: {
            projectId: _this.cur.row.id
          }
        }).then(Response => {
          console.log(Response.data)
          if (Response.data.code === 0) {
            _this.$set(_this.end, _this.cur.$index, !_this.end[_this.cur.$index])
            _this.tableData[_this.cur.$index].status = '已完结'
            this.$message({
              message: Response.data.msg,
              type: 'success'
            })
          } else {
            this.$message({
              message: Response.data.msg,
              type: 'error'
            })
          }
        })
      },
      deleteProject(){ //删除项目
        var _this = this
        axios({
          method: "delete",
          url: "/project/delete",
          params: {
            projectId: _this.cur.row.id
          }
        }).then(Response => {
          console.log(Response.data)
          if (Response.data.code === 0) {
            _this.$set(_this.Delete, _this.cur.$index, !_this.Delete[_this.cur.$index])
            _this.tableData.splice(_this.cur.$index,1)
            this.$message({
              message: Response.data.msg,
              type: 'success'
            })
          } else {
            this.$message({
              message: Response.data.msg,
              type: 'error'
            })
          }
        })
      },
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

  .prego {
    font-size: 15px;
    color: #333333;
    margin-left: 3px;
    cursor: pointer
  }

  .prego:hover {
    color: #00adb5;
  }
</style>
