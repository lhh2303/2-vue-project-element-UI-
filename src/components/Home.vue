<template>
    <el-container class="home-container">
        <!-- 头部 -->
        <el-header>
            <div>
                <img src="" alt="">
                <span>电商后台管理系统</span>
            </div>
            <el-button type="info" @click="logout">推出</el-button>
        </el-header>
        <!-- 主体 -->
        <el-container>
            <!-- 侧边栏 -->
            <el-aside :width="isCollaspse? '64px':'200px'">
                <!-- 折叠按钮 -->
                <div class="toggle-button" @click="toggleCollapse">
                    |||
                </div>
                <!-- 一级菜单 -->
                <el-menu background-color="#333744" text-color="#fff" active-text-color="#409bff" unique-opened  :collapse="isCollaspse"
                :collapse-transition="false" router :default-active="activePath">
                    <el-submenu :index="item.id + ''" v-for="(item, index) in menulist" :key="item.id">
                        <!-- 模板 -->
                        <template slot="title">
                            <i :class="iconsObj[item.id]"></i>
                            <span>{{item.authName}}</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item :index="'/' + subitem.path" v-for="(subitem, index) in item.children" :key="subitem.id" 
                        @click="saveNameState('/' + subitem.path)">
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{subitem.authName}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 右侧内容 -->
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        data() {
            return {
                // 左侧菜单
                menulist: [],
                iconsObj: {
                    '125' : 'el-icon-picture-outline el-icon',
                    '103' : 'el-icon-camera el-icon',
                    '101' : 'el-icon-s-order el-icon',
                    '102' : 'el-icon-s-marketing el-icon',
                    '145' : 'el-icon-s-fold el-icon',
                },
                isCollaspse:"false",
                // 被激活链接地址
                activePath:''
            }
        },
        methods: {
            // 退出登录
            logout() {
                window.sessionStorage.clear()
                this.$router.push("/login")
            },
            // 获取左侧菜单
            async getMenulist(){
                const {data: res } = await this.$http.get('menus')
                if(res.meta.status !==200) return this.$message.error(res.meta.msg)
                this.menulist = res.data
                console.log(res)
            },
            // 菜单折叠展开
            toggleCollapse(){
                this.isCollaspse =!this.isCollaspse
            },
            // 保存链接激活状态
            saveNameState(activepath){
                window.sessionStorage.setItem("activePath", activepath)
                this.activePath =activepath

            }
        },
        created() {
            // 加载左侧菜单
            this.getMenulist(),
            this.activePath =window.sessionStorage.getItem("activePath")
        },
    }
</script>



<style lang="less" scoped>
    .home-container {
        height: 100%;
    }

    .el-header {
        background-color: #373d41;
        display: flex;
        justify-content: space-between;
        padding-left: 0;
        align-items: center;
        color: #fff;
        font-size: 20px;

        >div {
            display: flex;
            align-items: center;
        }
    }

    .el-aside {
        background-color: #333744;
        .el-icon{
            margin-right: 10px;
        }
        .el-menu{
            border-right: none;
        }
    }

    .el-main {
        background-color: #eaedf1;
    }
    .toggle-button{
        background-color: #4a5064;
        font-size: 10px;
        line-height: 24px;
        color: #fff;
        text-align: center;
        letter-spacing: 0.2em;
        cursor: pointer;
    }
</style>