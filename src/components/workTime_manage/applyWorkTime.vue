<template>
  <div style="margin-bottom: 30px; ">
    <el-breadcrumb style="font-size: 14px; margin-bottom: 20px;" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '' }">工时管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/file_project' }">提交工时</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-header style="color:#303133 ;font-size: 20px;margin-left: -20px">
        提交工时
      </el-header>
      <div style="width: 100%;height: 1px;background-color: #409EFF;margin-top: -20px"></div>
      <div class="boxbutton">
        <span>共{{total}}条信息</span>

        <el-button @click="preAddWorkTime" round style="margin-left: 700px;background-color:#409EFF;color: white;padding: 10px;">
          新增工时
        </el-button>
      </div>
      <div>
        <el-table :data="tableData" style="width: 100%" height=500 :default-sort="{prop: ['status','beginTime','id','name','feature','activityName',], order: 'descending'}">
          <el-table-column prop="id" label="ID" align='center' sortable min-width="80">
          </el-table-column>
          <el-table-column prop="featureId" label="featureId" align='center' sortable width="100">
          </el-table-column>
          <el-table-column prop="activityId" label="活动ID" align='center' sortable width="100">
          </el-table-column>
          <el-table-column prop="beginTime" label="开始时间" align='center' sortable width="100">
          </el-table-column>
          <el-table-column prop="endTime" label="结束时间" align='center' sortable width="100">
          </el-table-column>
          <el-table-column prop="status" label="状态" align='center' sortable width="100">
          </el-table-column>
          <el-table-column prop="updateTime" label="更新时间" align='center' sortable width="100">
          </el-table-column>
          <el-table-column prop="staffId" label="员工" align='center' sortable width="100">
          </el-table-column>
          <el-table-column prop="status" label="状态" align='center' sortable width="100">
          </el-table-column>
          <el-table-column label="操作" align='center' min-width="100">
            <template slot-scope="ss">
              <el-button type="primary" style="width: 60px;font-size: 12px;padding: 0px;height: 40px;" @click="modifyInfo(ss.row)"
                plain>修改
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-dialog :visible.sync="formVisible" width="40%" center>
          <el-form :model="form" :rules="rules" ref="form" label-position="left" label-width="120px" style="padding-left: 10px; padding-right: 10px">

            <el-row>
              <el-form-item label="项目ID" prop="projectId">

                <el-select style="width: 100%" @change="proChange" v-model="form.projectId" filterable placeholder="请选择">
                  <el-option v-for="item in form.list" :key="item.id" :label="item.id+' ('+item.name+')'" :value="item.id">
                    <span style="float: left;font-size: 13px">{{ item.id }}</span>
                    <span style="float: right; color: #8492a6; font-size: 12px">{{ item.name }}</span>
                  </el-option>
                </el-select>

              </el-form-item>
            </el-row>

            <el-row>
              <el-form-item label="功能名称" prop="featureId">
                <el-select v-model="form.featureId" filterable placeholder="请选择">
                  <el-option v-for="item in form.featureList" :key="item.id" :label="item.id+' ('+item.feature + '-'+item.subFeature+')'"
                    :value="item.id">
                    <span style="float: left;font-size: 13px">{{ item.id }}</span>
                    <span style="float: right; color: #8492a6; font-size: 12px">{{ item.feature+' - '+item.subFeature }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-row>

            <el-row>
              <el-form-item label="活动名称" prop="activityId">
                <el-cascader clearable v-model="form.activityId" :options="options" @change="handleChange">
                </el-cascader>
              </el-form-item>
            </el-row>

            <el-row align="center">
              <el-form-item label="开始时间" prop="beginTime">
                <el-date-picker type="datetime" placeholder="选择开始时间" v-model="form.beginTime" value-format="yyyy-MM-ddTHH:mm:ss.SSSZ"
                  format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
            </el-row>

            <el-row align="center">
              <el-form-item label="结束时间" prop="endTime">
                <el-date-picker v-model="form.endTime" type="datetime" placeholder="选择结束时间">
                </el-date-picker>
              </el-form-item>
            </el-row>

            <el-row align="center">
              <el-form-item label="更新时间" prop="endTime">
                <el-date-picker v-model="form.updateTime" type="datetime" placeholder="选择结束时间">
                </el-date-picker>
              </el-form-item>
            </el-row>

            <el-row align="center">
              <el-form-item>
                <el-button @click="resetForm('form')">重置</el-button>
                <el-button type="primary" style="margin-left: 10px" @click="submitForm('form')">提交</el-button>
              </el-form-item>
            </el-row>

          </el-form>

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
  import moment from 'moment'

  export default {
    name: "applyWorkTime",
    data() {
      return {

        formVisible: false,
        rules: {

          description: [{
            required: true,
            message: '请填写',
            trigger: 'blur'
          }],
          activityId: [{
            required: true,
            message: '请选择',
            trigger: 'change'
          }],
          featureId: [{
            required: true,
            message: '请选择',
            trigger: 'change'
          }],
          status: [{
            required: true,
            message: '请选择',
            trigger: 'change'
          }],

          beginTime: [{
            required: true,
            message: '请选择时间',
            trigger: 'change'
          }],
          endTime: [{
            required: true,
            message: '请选择时间',
            trigger: 'change'
          }],

        },

        options: [{
            value: 'gongcheng',
            label: '工程活动',
            children: [{
              value: 1,
              label: '需求开发'
            }, {
              value: 2,
              label: '设计'
            }, {
              value: 3,
              label: '编码'
            }, {
              value: 4,
              label: '单体测试'
            }, {
              value: 5,
              label: '集成测试'
            }, {
              value: 6,
              label: '系统测试'
            }, {
              value: 7,
              label: '交付'
            }, {
              value: 8,
              label: '维护'
            }]
          },
          {
            value: 'guanli',
            label: '管理活动',
            children: [{
              value: 9,
              label: '范围管理'
            }, {
              value: 10,
              label: '计划与调整'
            }, {
              value: 11,
              label: '监控与分析'
            }, {
              value: 12,
              label: '联络与沟通'
            }, ]
          },
          {
            value: 'waibao',
            label: '外包活动',
            children: [{
              value: 13,
              label: '外包管理'
            }, {
              value: 14,
              label: '外包验收'
            }, {
              value: 15,
              label: '外包支持'
            }]
          },
          {
            value: 'zhichi',
            label: '支持活动',
            children: [{
              value: 16,
              label: '配置管理'
            }, {
              value: 17,
              label: 'QA 审计'
            }, {
              value: 18,
              label: '会议报告总结'
            }, {
              value: 19,
              label: '培训'
            }, {
              value: 20,
              label: '其他'
            }, ]
          },
          {
            value: 'qita',
            label: '其他',
            children: [{
              value: 21,
              label: '其他'
            }, ]
          },
        ],
        form: {
          list: [],
          featureList: [],
          id: '',
          activityId: '',
          featureId: '',
          beginTime: '',
          description: '',
          endTime: '',
          staffId: '',
          status: '',
          updateTime: ''

        },
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
        url: "/taskTime/getList",
        params: {
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
          params: {
            pageNum: val,
            pageSize: _this.pageSize
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
      proChange(id) {
        let _this = this;
        console.log('featureList');

        axios({
          method: "get",
          url: "/feature/list",
          params: {
            projectId: id
          }
        }).then(response => {
          if (response.data.code === 0) {
            _this.form.featureList = response.data.data.list;
            console.log(response.data.data.list);

          }
        })
      },
      preAddWorkTime() {
        let _this = this;
        _this.formVisible = true;
        axios({
          method: "get",
          url: "/project/list",

        }).then(response => {
          console.log('proList')

          if (response.data.code === 0) {
            console.log(response.data)
            _this.form.list = response.data.data.list
          } else {
            this.$message({
              message: response.data.msg,
              type: 'error'
            })
          }
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {

            let _this = this;
            _this.formVisible = false;
            //_this.form.updateTime = moment().format("yyyy-MM-ddTHH:mm:ss"),
            console.log("addTaskTime");
            console.log(_this.form)
            axios({
              method: "post",
              url: "/taskTime/add",
              params: {
                projectId: _this.form.projectId,
              },
              data: {
                projectId: _this.form.projectId,
                activityId: _this.form.activityId[1],
                featureId: _this.form.featureId,
                beginTime: _this.form.beginTime,
                description: _this.form.description,
                endTime: _this.form.endTime,
                staffId: window.sessionStorage.getItem('id'),
                status: _this.form.status,
                updateTime: _this.form.updateTime,

              },

            }).then(response => {
              if (response.data.code === 0) {
                this.$message({
                  message: response.data.msg,
                  type: 'success'
                })
                _this.getTimeList()

              } else {
                this.$message({
                  message: response.data.msg,
                  type: 'error'
                })
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      modifyInfo(info) {
        //修改信息
        console.log(info);
        let _this = this;
        _this.$router.push({
          path: '/modifyWorkTime',
          query: {
            info: info
          }
        })

      },
      formatter(row, column) {
        return row.address;
      },
      handleChange() {

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
