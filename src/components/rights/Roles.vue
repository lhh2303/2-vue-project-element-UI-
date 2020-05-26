<template>
    <div>
        <!-- 头部面包屑 -->
        <breadcrumb :fromFather="dataPath"></breadcrumb>

        <el-card>
            <!-- 添加角色按钮 -->
            <el-row>
                <el-col>
                    <el-button type="primary">添加角色</el-button>
                </el-col>
            </el-row>


            <!-- 角色列表区域 -->
            <el-table :data="rolelist" border stripe>
                <!-- 展开列 -->
                <el-table-column type="expand">
                    <template v-slot:default="scope">
                        <el-row :class="['bdbottom',index1 === 0  ? 'bdtop' : '','vcenter']"
                            v-for="(item1, index1) in scope.row.children" :key="item1.id">
                            <!-- 一级权限 -->
                            <el-col :span="5">
                                <el-tag closable @close="removeRightById(scope.row,item1.id)"> {{item1.authName}}
                                </el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 二级 三级权限 -->
                            <el-col :span="19">
                                <!-- 二级 权限 -->
                                <el-row :class="[index2 ===0 ? '' : 'bdtop','vcenter']"
                                    v-for="(item2, index2) in item1.children" :key="item2.id">
                                    <el-col :span="6">
                                        <el-tag closable type="success" @close="removeRightById(scope.row,item2.id)">
                                            {{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <!-- 三级 -->
                                    <el-col :span="18">
                                        <el-tag type="warning" v-for="(item3, index3) in item2.children" :key="item3.id"
                                            closable @close="removeRightById(scope.row,item3.id)">
                                            {{item3.authName}}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                        <!-- <pre>{{scope.row}}</pre> -->
                    </template>
                </el-table-column>
                <!-- 索引列 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" width="300px">
                    <template v-slot:default="scope">
                        <el-button type='primary' icon="el-icon-search" size="mini">编辑</el-button>
                        <el-button type='danger' icon="el-icon-delete" size="mini">删除</el-button>
                        <el-button type='warning' icon="el-icon-setting" size="mini"
                            @click="showSetRightDialog(scope.row)">分配权限
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>


        <!-- 分配权限对话框 -->
        <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClosed">
            <!-- 树形空间 -->
            <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all
                :default-checked-keys="defKeys" ref="treeRef"></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="allotRights">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>


<script>
    import breadcrumb from '../../component-ele/breadcrumb.vue'
    export default {
        data() {
            return {
                // 面包屑数据
                dataPath: [
                    {
                        name: '首页',
                        path: 'home'
                    },
                    {
                        name: '权限管理',
                        path: 'rights'
                    },
                    {
                        name: '角色列表 ',

                    },

                ],
                rolelist: [],
                // 权限对黄可囊
                setRightDialogVisible: false,
                // 权限数据
                rightsList: [],
                // 树形控件数据 绑定对象
                treeProps: {
                    label: 'authName',
                    children: 'children'
                },
                // 选中树的id值
                defKeys: [],
                roleId: '',
            }

        },
        methods: {
            // 获取所有角色列表
            async getRolesList() {
                const { data: res } = await this.$http.get('roles')
                if (res.meta.status !== 200)
                    return this.$message.error("获取角色列表失败")
                this.rolelist = res.data
                // console.log(this.rolelist)
            },

            // 删除权限 （根据id）
            async removeRightById(role, rightId) {
                // 弹框
                const confirmRes = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err)
                if (confirmRes !== "confirm") {
                    return this.$message.info("取消删除")
                }
                // 确认删除
                const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
                if (res.meta.status !== 200) {
                    return this.$message.error('删除失败')
                }
                // this.getRolesList()  这个方法会重新渲染页面 
                role.children = res.data
            },
            // 权限对话框
            async showSetRightDialog(role) {
                this.roleId = role.id
                // 获取权限数据
                const { data: res } = await this.$http.get('rights/tree')
                if (res.meta.status !== 200) {
                    return this.$http.error('获取权限失败')

                }
                this.rightsList = res.data
                // console.log(this.rightsList)
                this.getLeafKeys(role, this.defKeys)
                this.setRightDialogVisible = true

            },
            // 获取角色下所有三级权限id 并保存到defKeys中
            getLeafKeys(node, arr) {
                if (!node.children) {
                    return arr.push(node.id)
                }
                node.children.forEach(item =>
                    this.getLeafKeys(item, arr))
            },
            // 清空每次打开对话框  
            setRightDialogClosed() {
                this.defKeys = []
            },
            // 分配权限
            async allotRights() {
                const keys = [
                    ...this.$refs.treeRef.getCheckedKeys(),
                    ...this.$refs.treeRef.getHalfCheckedKeys()
                ]
                // console.log(keys)
                const idStr = keys.join(',')
                const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
                if (res.meta.status !== 200) {
                    return this.$message.error("分配失败")
                }

                this.$message.success("分配成功")
                this.getRolesList()
                this.setRightDialogVisible = false
            }
        },

        created() {
            this.getRolesList()
        },
        components: {
            breadcrumb,
        }
    }
</script>

<style lang="less" scoped>
    .el-tag {
        margin: 7px;
    }

    .bdtop {
        border-top: 1px solid #eee;
    }

    .bdbottom {
        border-bottom: 1px solid #eee;
    }

    .vcenter {
        display: flex;
        align-items: center;
    }
</style>