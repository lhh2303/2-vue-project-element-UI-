<!-- 封装头部面包屑组件 -->
<template>
    <div class="bread">
        <el-breadcrumb separator="/">

            <el-breadcrumb-item v-for="(item, index) in fromFather" :key=index :to="{ path: '/' + item.path }">{{item.name}}</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>

<script>
export default {
    name :'bread',
    data() {
        return {
            
        }
    },
    methods: {
        
    },
    props:['fromFather']

}
</script>
<style  lang="less" scoped>


</style>