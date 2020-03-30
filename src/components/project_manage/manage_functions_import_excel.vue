<template>
  <div style="margin-bottom: 40px; ">
    <el-breadcrumb style="font-size: 14px; margin-bottom: 20px;" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '' }">项目管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/manage_project' }">管理项目其他信息</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/manage_functions' }">管理功能列表</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/manage_functions_import_excel' }">导入excel表格</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card style="height: 500px;">
      <el-header style="color:#303133 ;font-size: 20px;margin-left: -20px">
        导入excel表格
        <el-button type="primary" plain style="margin-left: 20px;width:80px;float:right" @click="$router.back(-1)">返回</el-button>
      </el-header>

      <div>
        <el-steps :active="active" finish-status="success">
          <el-step title="下载模版"></el-step>
          <el-step title="上传文件"></el-step>
          <el-step title="审核数据"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>
        <template v-if="active === 0">
          <div class="block">
            <i class="el-icon-document" style="font-size: 60px;margin-top: 60px;"></i>
            <div>
              <el-button type="text" style="color: #00ADB5;" @click="downloadExcel()">下载模版</el-button>
            </div>
          </div>
        </template>
        <template v-else-if="active === 1">
          <div class="block">
       <input type="file"  class="loadExcel" @change="importf(this)" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
         </div>
        </template>
        <template v-else-if="active === 2">
          <div class="block">
            <el-table :data="master_user.data" style="width: 100%;" height="250" border>
              </el-table-column>
              <el-table-column :key="item.id" v-for="(item,index) in master_user.columns" :label="item.label" :prop="item.prop"
                :width="item.width">
                <template slot-scope="scope">
                  <span v-if="scope.row.isSet">
                    <el-input size="mini" placeholder="请输入内容" v-model="master_user.sel[item.prop]">
                    </el-input>
                  </span>
                  <span v-else>{{scope.row[item.prop]}}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="">
                <template slot-scope="scope">
                  <span class="el-tag el-tag--success el-tag--mini" style="cursor: pointer;" @click.stop="saveRow(scope.row,scope.$index)">
                    确定
                  </span>
                  <span class="el-tag el-tag--primary el-tag--mini" style="cursor: pointer;" @click="editRow(scope.row)">
                    编辑
                  </span>
                  <span class="el-tag el-tag--danger el-tag--mini" style="cursor: pointer;" @click="deleteRow(scope.$index,master_user.data)">
                    删除
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
        <template v-else>
          <div class="block">
            已完成
          </div>
        </template>
        <div style="margin-left: 540px;margin-top: 5px;">
          <el-button type="primary" @click="next" :disabled="isComplete">下一步</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
  import axios from 'axios'
  export default {
    name: 'manage_functions_import_excel',
    data() {
      return {
        active: 0,
        isComplete: false,
        featureList:[],
        featureFile: [],
        master_user: {
          sel: null, //选中行
          columns: [
            {
              prop: "feature",
              label: "功能",
              width: 150
            },
            {
              prop: "subFeature",
              label: "子功能",
              width: 220
            },
            {
              prop: "description",
              label: "描述",
              width: 220
            }
          ],
          data: [],
        },
      }

    },
    mounted: function() {

    },
    methods: {
      importf(obj) { //加载excel文件
        let _this = this;
        let inputDOM = this.$refs.inputer; // 通过DOM取文件数据
        this.file = event.currentTarget.files[0];
        var rABS = false; //是否将文件读取为二进制字符串
        var f = this.file;
        var reader = new FileReader();
        //if (!FileReader.prototype.readAsBinaryString) {
        FileReader.prototype.readAsBinaryString = function(f) {
          var binary = "";
          var rABS = false; //是否将文件读取为二进制字符串
          var pt = this;
          var wb; //读取完成的数据
          var outdata;
          var reader = new FileReader();
          reader.onload = function(e) {
            var bytes = new Uint8Array(reader.result);
            var length = bytes.byteLength;
            for (var i = 0; i < length; i++) {
              binary += String.fromCharCode(bytes[i]);
            }
            var XLSX = require('xlsx');
            if (rABS) {
              wb = XLSX.read(btoa(fixdata(binary)), { //手动转化
                type: 'base64'
              });
            } else {
              wb = XLSX.read(binary, {
                type: 'binary'
              });
            }
            // outdata就是你想要的东西 excel导入的数据
            _this.master_user.data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
            console.log(_this.master_user.data)
            // excel 数据再处理
            let arr = []
            _this.master_user.data.map(v => {
              let obj = {}
              obj.feature = v.__EMPTY
              obj.subFeature = v.__EMPTY_1
              obj.description = v.__EMPTY_2
              arr.push(obj)
            })
            _this.featureFile = [...arr];
            console.log(_this.featureFile)
            var i=1
            _this.master_user.data = []
            for(;i<_this.featureFile.length;i++){
              _this.master_user.data.push({
               // id: _this.featureFile[i].id,
                feature: _this.featureFile[i].feature,
                subFeature: _this.featureFile[i].subFeature,
                description: _this.featureFile[i].description,
                isSet: false
              })
              _this.featureList.push({
                projectId: _this.$route.query.projectId,
                feature: _this.featureFile[i].feature,
                subFeature: _this.featureFile[i].subFeature,
                description: _this.featureFile[i].description
              })
            }
          }
          reader.readAsArrayBuffer(f);
        }
        if (rABS) {
          reader.readAsArrayBuffer(f);
        } else {
          reader.readAsBinaryString(f);
        }
      },
      downloadExcel(){
        var _this = this
        axios({
          method: "get",
          url: "/feature/template"
        }).then(response => {
          if (response.data.code === 0) {
            console.log(response.data)
            window.location.href = 'http://47.100.30.181:8100' + response.data.data
          }
        })
      },
      next() {
        this.active++
        if(this.active === 3) //若进行完成步骤，将审核数据（功能列表）加入项目
        {
          var _this = this
          axios({
            method: "post",
            url: "/feature/build",
            data: _this.featureList
          }).then(response => {
            console.log(response.data)
            if (response.data.code === 0) {
              _this.active ++
              _this.isComplete = true
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
        }
      },
      saveRow(row, index) { //保存
        let data = JSON.parse(JSON.stringify(this.master_user.sel));
        for (let k in data) {
          row[k] = data[k] //将sel里面的value赋值给这一行。ps(for....in..)的妙用，细心的同学发现这里我并没有循环对象row
        }
        row.isSet = false;
      },
      editRow(row) { //编辑
        for (let i of this.master_user.data) {
          if (i.isSet) return this.$message.warning("请先保存当前编辑11项");
        }
        this.master_user.sel = row
        row.isSet = true
      },
      deleteRow(index, rows) { //删除
        rows.splice(index, 1)
      }
    },
  }
</script>
<style scoped>
  .block {
    margin: 0 auto;
    width: 900px;
    height: 250px;
    margin-top: 30px;
    text-align: center
  }
  .loadExcel{
    width: 300px;
    height: 220px;
    border: 1px dashed;
    font-size: 15px;
    border-radius: 10px;
  }
</style>
