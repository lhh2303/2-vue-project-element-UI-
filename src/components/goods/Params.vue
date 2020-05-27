<template>
    <div>
        <!-- 面包屑 -->
        <breadcrumb :fromFather="dataPath"></breadcrumb>

        <!-- 卡片 -->
        <el-card>
            <!-- 提示框 -->
            <el-alert title="只允许第三级" type="warning" :closable="false" show-icon> </el-alert>
            <!-- 选择商品分类 -->
            <el-row class="cat_opt">
                <el-col>
                    <span>选择商品分类:</span>
                    <!-- 选择商品级联选择框 -->
                    <el-cascader v-model="selectedCateKeys" :options="cateList" :props="cascaderProps"
                        @change="handleChange" clearable></el-cascader>
                </el-col>
            </el-row>

            <!-- tab页签 -->
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <!-- 添加动态餐宿 -->
                <el-tab-pane label="动态参数" name="many">
                    <!-- 参数按钮 -->
                    <el-button type="primary" size="mini" :disabled="isBtnDisable" @click="addDialogVisible =true">添加参数
                    </el-button>
                    <!-- 动态参数表格 -->
                    <el-table :data="manyTableData" border stripe>
                        <el-table-column type="expand">
                            <template v-slot:default="scope">
                                <!-- 循环渲染 -->
                                <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" closable
                                    @close="handleClose(index,scope.row)">
                                    {{item}}
                                </el-tag>
                                <!-- 输入文本框 -->
                                <el-input class="input-new-tag" v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <!-- 按钮 -->
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+
                                    New Tag
                                </el-button>
                            </template>
                        </el-table-column>

                        <el-table-column type="index"></el-table-column>
                        <el-table-column labe="参数" prop="attr_name"></el-table-column>
                        <el-table-column labe="操作">
                            <template v-slot:default="scope">
                                <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
                                <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <!-- 谈价静态属性 -->
                <el-tab-pane label="静态属性" name="only">
                    <!-- 属性按钮 -->
                    <el-button type="primary" size="mini" :disabled="isBtnDisable" @click="addDialogVisible =true">添加属性
                    </el-button>

                    <!-- 静态属性表格 -->
                    <el-table :data="onlyTableData" border stripe>
                        <el-table-column type="index"></el-table-column>
                        <el-table-column labe="属性" prop="attr_name"></el-table-column>
                        <el-table-column labe="操作">
                            <template v-slot:default="scope">
                                <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
                                <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>

            </el-tabs>
        </el-card>
        <!-- 对话框 -->
        <el-dialog :title="this.activeName === 'many' ? '动态参数':'静态属性'" :visible.sync="addDialogVisible" width="50%"
            @close="addDialogClosed">
            <!-- 添加参数 -->
            <el-form :model="addForm" :rules="addFormules" ref="addFormRef" label-width="100px">
                <el-form-item :label="this.activeName === 'many' ? '动态参数':'静态属性'" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>

            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addParams">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>


<script>
    import breadcrumb from '../../component-ele/breadcrumb.vue'
    export default {
        data() {
            return {
                // 面包屑
                dataPath: [

                    {
                        name: '首页',
                        path: 'home'
                    },
                    {
                        name: '商品管理',
                        path: 'categories'
                    },
                    {
                        name: '参数列表 ',

                    },

                ],
                // 商品分类
                cateList: {},
                // 级联选择器对象
                cascaderProps: {
                    value: 'cat_id',
                    label: "cat_name",
                    children: 'children',
                    expandTrigger: "hover",
                    // checkStrictly: true
                },
                // 级联双向绑定
                selectedCateKeys: [],
                // 被激活名称
                activeName: 'many',
                // 动态参数
                manyTableData: {},
                // 静态属性
                onlyTableData: {},
                addDialogVisible: false,
                addForm: {
                    attr_name: ''
                },
                addFormules: {
                    attr_name: [
                        { required: true, message: '请输入参数名称', trigger: 'blur' },
                    ]
                },

            }
        },
        methods: {
            // 获取所有商品
            async getCateList() {
                const { data: res } = await this.$http.get('categories')
                if (res.meta.status !== 200) {
                    return this.$message.error("获取失败")
                }
                this.cateList = res.data
                console.log(this.cateList)
            },
            // 级联选择框选中出发
            handleChange() {
                this.getParamdata()

            },
            // tab点击事件
            handleTabClick() {
                this.getParamdata()
            },
            async getParamdata() {
                if (this.selectedCateKeys.length !== 3) {
                    this.selectedCateKeys = []
                    this.manyTableData = []
                    this.onlyTableData = []
                    return
                }
                // 根据所选id和面板获取对应数据
                const { data: res } = await this.$http.get(`categories/${this.cateId}}/attributes`, {
                    params: { sel: this.activeName }
                })
                if (res.meta.status !== 200) {
                    return this.$message.error("获取失败")
                }
                console.log(res.data)

                res.data.forEach(item => {
                    item.attr_vals = item.attr_vals ? item.attr_vals.split('') : []
                    // 控制文本框显示隐藏
                    item.inputVisible = false
                    // 输入值
                    item.inputValue = ''
                })

                if (this.activeName === 'many') {
                    this.manyTableData = res.data
                }
                else {
                    this.onlyTableData = res.data
                }
            },
            addDialogClosed() {
                this.$refs.addFormRef.resetFields()
            },
            addParams() {
                this.$refs.addFormRef.validate(async valid => {
                    if (!valid) return
                    const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
                        attr_name: this.addForm.attr_name,
                        attr_sel: this.activeName
                    })
                    this.$message.success("添加成功")
                    this.addDialogVisible = false
                    this.getParamdata()
                })
            },
            async handleInputConfirm(row) {
                if (row.inputValue.trim().length === 0) {
                    row.inputValue = ''
                    row.inputVisible = false
                    return
                }
                row.attr_vals.push(row.inputValue.trim())
                row.inputValue = ''
                row.inputVisible = false
                this.saveattr(row)



            },
            async saveattr(row) {
                const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
                    attr_name: row.attr_name,
                    attr_sel: row.attr_sel,
                    attr_vals: row.attr_vals.join(' ')
                })

                if (res.meta.status !== 200) {
                    return this.$message.error("获取失败")
                }


                this.$message.success("修改成功")
            },
            showInput(row) {
                row.inputVisible = true

                // 文本框自动获得焦点  
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            handleClose(i, row) {
                row.attr_vals.splice(i, 1)
                this.saveattr(row)
            }
        },
        created() {
            this.getCateList()
        },
        components: {
            breadcrumb,
        },
        computed: {
            isBtnDisable() {
                return this.selectedCateKeys.length !== 3
            },
            // 选中的id
            cateId() {
                if (this.selectedCateKeys.length === 3) {
                    return this.selectedCateKeys[2]
                }
                return null
            },
            // 计算标题文本文本


        },
    }
</script>



<style lang="less" ,scoped>
    .cat_opt {
        margin: 15px 0;
    }

    .el-tag {
        margin: 10px;
    }

    .el-input__inner {
        width: 120px !important;
    }
</style>