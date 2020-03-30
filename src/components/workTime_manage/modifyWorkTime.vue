<template>
    <el-card>
        <el-form :model="form" :rules="rules" ref="form" label-position="left" label-width="120px"
                 style="padding-left: 10px; padding-right: 10px">

          <el-row>
            <el-form-item label="项目ID" prop="projectId">
              {{form.projectId}}
            </el-form-item>
          </el-row>

          <el-row>
            <el-form-item label="功能名称" prop="featureId">
              <el-select v-model="form.featureId" filterable placeholder="请选择">
                <el-option

                  v-for="item in featureList"
                  :key="item.id"
                  :label="item.id+' ('+item.feature + '-'+item.subFeature+')'"
                  :value="item.id">
                  <span style="float: left;font-size: 13px">{{ item.id }}</span>
                  <span
                    style="float: right; color: #8492a6; font-size: 12px">{{ item.feature+' - '+item.subFeature }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>

          <el-row>
            <el-form-item label="活动名称" prop="activityId">
              <el-cascader clearable
                           v-model="form.activityId"
                           :options="options"
                           @change="handleChange">
              </el-cascader>
            </el-form-item>
          </el-row>

          <el-row align="center">
            <el-form-item label="开始时间" prop="beginTime">
              <el-date-picker type="datetime" placeholder="选择开始时间" v-model="form.beginTime"
                              value-format="yyyy-MM-ddTHH:mm:ss.SSSZ" format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
          </el-row>

          <el-row align="center">
            <el-form-item label="结束时间" prop="endTime">
              <el-date-picker
                v-model="form.endTime"
                type="datetime"
                placeholder="选择结束时间">
              </el-date-picker>
            </el-form-item>
          </el-row>

          <el-row align="center">
            <el-form-item label="更新时间" prop="endTime">
              <el-date-picker
                v-model="form.updateTime"
                type="datetime"
                placeholder="选择结束时间">
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

    </el-card>
</template>

<script>
  import axios from 'axios'

  export default {
        name: "modifyWorkTime",
      data() {
        return {

          rules: {

            description: [
              {required: true, message: '请填写', trigger: 'blur'}
            ],
            activityId: [
              {required: true, message: '请选择', trigger: 'change'}
            ],
            featureId: [
              {required: true, message: '请选择', trigger: 'change'}
            ],
            status: [
              {required: true, message: '请选择', trigger: 'change'}
            ],

            beginTime: [
              {required: true, message: '请选择时间', trigger: 'change'}
            ],
            endTime: [
              {required: true, message: '请选择时间', trigger: 'change'}
            ],

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
              },]
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
              },]
            },
            {
              value: 'qita',
              label: '其他',
              children: [{
                value: 21,
                label: '其他'
              },]
            },
          ],
          list: [],
          featureList: [],
          form: {

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
          tableData: []
        }
      },
      created: function () {
        let _this = this;
        let info = _this.$route.query.info;
        _this.form = info;
        _this.proChange(_this.form.projectId)
      },
      mounted: function () {
        let _this = this;
        let info = _this.$route.query.info;

      },
      methods:{
        proChange(id) {
          let _this = this;
          console.log('featureList');

          axios({
            method: "get",
            url: "/feature/list",
            params:
              {
                projectId: id
              }
          }).then(response => {
            if (response.data.code === 0) {
              _this.featureList = response.data.data.list;
              console.log(response.data.data.list);
            }
          })
        },
        submitForm(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {

              let _this = this;

              console.log("mod taskTime");

              axios({
                method: "put",
                url: "/taskTime/mod",
                params: {
                  projectId: _this.form.projectId,
                },
                data: {
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
                  this.$router.go(-1)

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
      }
    }
</script>

<style scoped>

</style>
