<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item><a href="/">权限管理</a></el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 权限列表 -->
        <el-card>
            <el-table :data="rightlist" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column lable="权限封装"  prop="authName"></el-table-column>
                <el-table-column lable="路径"  prop="path"></el-table-column>
                <el-table-column lable="权限等级"  prop="level">
                    <template v-slot:default="scope">
                        <el-tag v-if="scope.row.level ==='0'">一级</el-tag>
                        <el-tag v-if="scope.row.level ==='1' "type="success" >二级</el-tag>
                        <el-tag v-if="scope.row.level ==='2' "type="warning">三级</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                rightlist: [],
            }
        },
        methods: {
            // 获取商品列表
            async getRightList() {
                const { data: res } = await this.$http.get('rights/list')
                if (res.meta.status !== 200) {
                    return this.$message.error("获取权限列表失败")
                }
                this.rightlist = res.data
                // console.log(this.rightlist)
            }
        },
        created() {
            // 立即获取商品列表
            this.getRightList()
        },
    }
</script>


<style lang="less" ,scoped>

</style>