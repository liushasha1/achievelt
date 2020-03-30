<template>
  <el-card>
    <el-form :model="form" :rules="rules" ref="form" label-position="left" label-width="120px"
             style="padding-left: 10px">
      <el-row>

        <el-form-item label="项目名称" prop="projectId">
          <el-input style="width: 80%" v-model="form.projectId" disabled="">

          </el-input>
        </el-form-item>
      </el-row>

      <el-row>
        <el-form-item label="风险类型" prop="type">
          <el-input style="width: 80%" v-model="form.type"></el-input>

        </el-form-item>
      </el-row>

      <el-row>
        <el-form-item label="风险描述" prop="description">
          <el-input style="width: 80%" type="textarea" v-model="form.description"></el-input>
        </el-form-item>
      </el-row>

      <el-row>
        <el-form-item label="风险等级" prop="level">
          <el-select style="width: 80%" v-model="form.level" filterable placeholder="请选择">
            <el-option v-for="i in 5" :key="i" :label="i" :value="i"></el-option>
          </el-select>
        </el-form-item>
      </el-row>

      <el-row>
        <el-form-item label="风险影响度" prop="influence">
          <el-select style="width: 80%" v-model="form.influence" filterable placeholder="请选择">
            <el-option v-for="i in infList" :key="i" :label="i" :value="i"></el-option>
          </el-select>
        </el-form-item>
      </el-row>

      <el-row>
        <el-form-item label="应对策略描述" prop="strategy">
          <el-input style="width: 80%" type="textarea" v-model="form.strategy"></el-input>
        </el-form-item>
      </el-row>

      <el-row>
        <el-form-item label="状态" prop="status">
          <el-input style="width: 80%" v-model="form.status"></el-input>
        </el-form-item>
      </el-row>

      <el-row>
        <el-form-item label="责任人" prop="responsible">
          <el-select style="width: 80%" v-model="form.responsible" filterable placeholder="请选择">
            <el-option
              v-for="item in memberList"
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
        <el-form-item label="跟踪频度" prop="frequency">
          <el-select style="width: 80%" v-model="form.frequency" filterable placeholder="请选择">
            <el-option v-for="i in freList" :key="i" :label="i" :value="i"></el-option>
          </el-select>
        </el-form-item>
      </el-row>

      <el-row>
        <el-form-item label="风险相关者" prop="related">
          <el-select style="width: 80%" multiple v-model="form.related" filterable placeholder="请选择">
            <el-option
              v-for="item in memberList"
              :key="item.staffId"
              :label="item.staffId+' ('+item.role+')'"
              :value="item.staffId">
              <span style="float: left;font-size: 13px">{{ item.staffId }}</span>
              <span style="float: right; color: #8492a6; font-size: 12px">{{ item.role }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-row>

      <el-row align="center">
        <el-form-item label="风险提交时间" prop="creatTime">

          <el-date-picker type="date" placeholder="选择日期" v-model="form.creatTime" style="width: 80%;"
                          :default-value="form.endTime" value-format="yyyy-MM-ddTHH:mm:ss.SSSZ"
                          format="yyyy-MM-dd"></el-date-picker>

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
    name: "risk_modify",
    data() {
      return {

        formVisible: false,

        rules: {

          projectId: [
            {required: true, message: '请选择', trigger: 'change'}
          ],
          type: [
            {required: true, message: '请填写', trigger: 'blur'}
          ],
          description: [
            {required: true, message: '请填写', trigger: 'blur'}
          ],
          level: [
            {required: true, message: '请选择', trigger: 'change'}
          ],
          influence: [
            {required: true, message: '请选择', trigger: 'change'}
          ],
          strategy: [
            {required: true, message: '请填写', trigger: 'blur'}
          ],
          status: [
            {required: true, message: '请填写', trigger: 'blur'}
          ],
          responsible: [
            {required: true, message: '请选择', trigger: 'change'}
          ],
          frequency: [
            {required: true, message: '请选择', trigger: 'change'}
          ],
          related: [
            {required: true, message: '请选择', trigger: 'change'}
          ],
          creatTime: [
            {required: true, message: '请选择时间', trigger: 'change'}
          ],


        },

        list: [],
        memberList: [],
        infList: ['高', '一般', '低'],
        freList: ['高', '一般', '低'],

        form: {
          id: '',
          projectId: '',
          type: "",
          description: '',
          level: 1,
          influence: '',
          strategy: '',
          status: '未解决',
          responsible: '',
          frequency: '',
          related: '',
          creatTime: '',
        },

        tableData: [],
      }
    },
    created: function () {
      let _this = this;
      let info = _this.$route.query.info;
      this.proChange(info.projectId);
      let s = info.related.substring(1, info.related.length - 1);

      let arr = s.split('|');
      console.log("arr")
      console.log(arr);

      _this.$route.query.info.related = arr;

    },
    mounted: function () {
      let _this = this;
      let info = _this.$route.query.info;
      _this.form = info;

    },
    methods: {

      proChange(val) {
        let _this = this
        console.log('procha');
        console.log(val)
        axios({
          method: "get",
          url: "/auth/getRoles",
          params:
            {
              projectId: val
            }
        }).then(response => {
          if (response.data.code === 0) {
            _this.memberList = response.data.data.list;
            console.log(response.data.data.list);
          }
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {

            let _this = this;

            console.log("modRisk");
            console.log(_this.form.related);

            let relatedString = "|";
            _this.form.related.forEach((elem, idx) => {
              relatedString += elem + '|';
            });

            console.log(relatedString);
            axios({
              method: "put",
              url: "/risk/mod",
              params: {
                projectId: _this.form.projectId
              },
              data: {
                id:_this.form.id,
                createTime: _this.form.creatTime,
                description: _this.form.description,
                frequency: _this.form.frequency,
                influence: _this.form.influence,
                level: _this.form.level,
                related: relatedString,
                responsible: _this.form.responsible,
                status: _this.form.status,
                strategy: _this.form.strategy,
                type: _this.form.type,

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
