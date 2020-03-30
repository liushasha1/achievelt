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
      <el-form-item label="缺陷名称" prop="type">
        <el-input v-model="form.name"></el-input>

      </el-form-item>
    </el-row>

    <el-row>
      <el-form-item label="缺陷描述" prop="description">
        <el-input type="textarea" v-model="form.description"></el-input>
      </el-form-item>
    </el-row>


    <el-row>
      <el-form-item label="缺陷等级" prop="level">
        <el-select style="width: 100%" v-model="form.level" filterable placeholder="请选择">
          <el-option v-for="i in 5" :key="i" :label="i" :value="i"></el-option>
        </el-select>
      </el-form-item>
    </el-row>


    <el-row>
      <el-form-item label="缺陷跟踪人" prop="tracker">
        <el-select style="width: 100%" v-model="form.tracker" filterable placeholder="请选择">
          <el-option
            v-for="item in form.memberList"
            :key="item.staffId"
            :label="item.staffId+' ('+item.role+')'"
            :value="item.staffId">
            <span style="float: left;font-size: 13px">{{ item.staffId }}</span>
            <span style="float: right; color: #8492a6; font-size: 12px">{{ item.role }}</span>
          </el-option>
        </el-select>
      </el-form-item>
    </el-row>


    <el-row>
      <el-form-item label="状态" prop="status">
        <el-select style="width: 100%" v-model="form.status" filterable placeholder="请选择">
          <el-option v-for="i in statusList" :key="i" :label="i" :value="i"></el-option>
        </el-select>
      </el-form-item>
    </el-row>


    <el-row align="center">
      <el-form-item label="发现时间" prop="updateTime">

        <el-date-picker type="date" placeholder="选择日期" v-model="form.updateTime" style="width: 100%;"
                        value-format="yyyy-MM-ddTHH:mm:ss.SSSZ" format="yyyy-MM-dd"></el-date-picker>

      </el-form-item>
    </el-row>


    <el-form-item>
      <br>
      <el-button @click="resetForm('form')">重置</el-button>
      <el-button type="primary" style="margin-left: 10px" @click="submitForm('form')">提交</el-button>
    </el-form-item>


  </el-form>
</el-card>
</template>

<script>
  import axios from 'axios'

  export default {
    name: "problem_modify",
    data() {
      return {
        rules: {
          name: [
            {required: true, message: '请填写', trigger: 'blur'}
          ],
          description: [
            {required: true, message: '请填写', trigger: 'blur'}
          ],
          level: [
            {required: true, message: '请选择', trigger: 'change'}
          ],
          tracker: [
            {required: true, message: '请选择', trigger: 'change'}
          ],
          updateTime: [
            {required: true, message: '请选择时间', trigger: 'change'}
          ],

        },
        memberList: [],
        statusList:['未处理','处理中','已处理'],
        form: {
          id:'',
          projectId: '',
          name: "",
          description: '',
          level: 1,
          tracker: '',
          updateTime: '',
          status: '',
        },
      }
    },

    created: function () {
      let _this = this;
      let info = _this.$route.query.info;

    },
    mounted: function () {
      let _this = this;
      let info = _this.$route.query.info;
      _this.form = info;

    },
    methods:{
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {

            let _this = this;
            _this.formVisible = false;

            axios({
              method: "put",
              url: "/bug/mod",
              params: {
                projectId: _this.form.projectId,
              },
              data: {
                id:_this.form.id,
                name: _this.form.name,
                description: _this.form.description,
                level: _this.form.level,
                tracker: _this.form.tracker,
                updateTime: _this.form.updateTime,
                status: _this.form.status,

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
