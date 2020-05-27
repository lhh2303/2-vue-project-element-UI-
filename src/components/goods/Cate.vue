<template>
    <div>
        <!-- 面包屑 -->
        <breadcrumb :fromFather="dataPath"></breadcrumb>

        <!-- 卡片试图 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
                </el-col>
            </el-row>

            <!-- 表格 -->
            <tree class="zk-table" :data="catelist" :columns="columns" :selection-type="false" :expand-type="false"
                show-index index-text="#" border>
                <!-- 是佛有效 -->
                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted  === false" style="color: lightgreen;"></i>
                    <i class="el-icon-error" v-else></i>
                </template>
                <!-- 排序 -->
                <template slot="order" slot-scope="scope">
                    <el-tag size="mini" v-if="scope.row.cat_level ===0">一级</el-tag>
                    <el-tag size="mini" type="success" v-else-if="scope.row.cat_level ===1">二级</el-tag>
                    <el-tag size="mini" type="warning" v-else>三级</el-tag>
                </template>
                <!-- 操作 -->
                <template slot="opt" slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini">
                        编辑
                    </el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini">
                        删除
                    </el-button>
                </template>
            </tree>
            <!-- 分页 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[3,5,10,15]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>


        <!-- 添加分类对话框 -->
        <el-dialog title="添加分类" :visible.sync="addCateDialogVisivle" width="50%" @close="addCateDialogClose">
            <!-- 添加分类表单 -->
            <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类">
                    <el-cascader v-model="selectedKeys" :options="parentCateList" :props="cascaderProps"
                        @change="parentCateChange" clearable></el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisivle = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
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
                        name: '商品分类 ',

                    },

                ],
                catelist: [],
                // 查询条件
                queryInfo: {
                    type: 3,
                    pagenum: 1,
                    pagesize: 5
                },
                // 总数据条数
                total: 0,
                // 树数据
                columns: [
                    {
                        label: '分类名称',
                        prop: 'cat_name',
                    },
                    {
                        label: "是否有效",
                        // 列定义为模板
                        type: 'template',
                        // 模板 名称
                        template: 'isok'
                    },
                    {
                        label: "排序",
                        // 列定义为模板
                        type: 'template',
                        // 模板 名称
                        template: 'order'
                    },
                    {
                        label: "操作",
                        // 列定义为模板
                        type: 'template',
                        // 模板 名称
                        template: 'opt'
                    }

                ],
                addCateDialogVisivle: false,
                // 表单数据
                addCateForm: {
                    cat_name: '',
                    // 父级id
                    cat_pid: 0,
                    cat_level: 0
                },
                // 表单验证规则
                addCateFormRules: {
                    cat_name: [
                        { required: true, message: '请输入分类名称', trigger: 'blur' },
                    ]
                },
                // 父级列表
                parentCateList: [],
                // 级联选择器
                cascaderProps: {
                    value: 'cat_id',
                    label: "cat_name",
                    children: 'children',
                    expandTrigger: "hover",
                    checkStrictly: true
                },
                selectedKeys: []

            }
        },
        methods: {
            // 获取商品数据
            async getCateList() {
                const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
                if (res.meta.status !== 200) {
                    return this.$message.erro("获取商品列表失败")
                }
                this.catelist = res.data.result
                this.total = res.data.total
                console.log(this.catelist)
            },
            // 监听pagesize
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize
                this.getCateList()
            },
            // 监听pagenum
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage
                this.getCateList()
            },
            // 添加分类对话框显示
            showAddCateDialog() {
                // 获取父级分类列表
                this.getParentCateList()

                // 展示对话框
                this.addCateDialogVisivle = true

            },
            // 获取父级分类节点
            async getParentCateList() {
                const { data: res } = await this.$http.get('categories', {
                    params: {
                        type: 2
                    }
                })
                if (res.meta.status !== 200) {
                    return this.$message.error("获取失败")
                }
                this.parentCateList = res.data
            },
            // 选择项发生变化
            parentCateChange() {
                if (this.selectedKeys.length > 0) {
                    this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
                    this.addCateForm.cat_level = this.selectedKeys.length
                    return
                }
                else {
                    this.addCateForm.cat_pid = 0
                    this.addCateForm.cat_level = 0
                }

            },
            // 添加分类
            addCate() {
                this.$refs.addCateFormRef.validate(async valid => {
                    if (!valid) return
                    const { data: res } = await this.$http.post('categories', this.addCateForm)

                    if (res.meta.status !== 201) {
                        return
                    }

                    this.$message.success("添加成功")
                    this.getCateList()
                    this.addCateDialogVisivle = false
                })

            },
            // 对话框关闭
            addCateDialogClose() {
                this.$refs.addCateFormRef.resetFields()
                this.selectedKeys = []
                this.addCateForm.cat_level = 0
                this.addCateForm.cat_pid = 0
            }
        },
        created() {
            this.getCateList()

        },
        components: {
            breadcrumb,
        }
    }
</script>


<style lang="less" ,scoped>
    .zk-table {
        margin-top: 15px;
    }

    .el-cascader {
        width: 100%;
    }
</style>