<template><div class="login-div">
    <div class="login-container">
		<el-form ref="loginForm" :model="loginForm" :rules="rules" class="login-form" auto-complete="on" label-position="left">
			<div class="title-container">
				<h3 class="title">个人通讯录管理系统</h3>
			</div>

			<el-form-item prop="username">
				<span class="svg-container">
					<svg-icon icon-class="user" />
				</span>
				<el-input v-model="loginForm.username" ref="username" placeholder="请输入用户名" tabindex="1" auto-complete="on"/>
			</el-form-item>

			<el-form-item prop="password">
				<span class="svg-container">
					<svg-icon icon-class="password" />
				</span>
				<el-input v-model="loginForm.password" ref="password" :type="passwordType" placeholder="请输入密码" tabindex="2" auto-complete="on" @keyup.enter.native="handleLogin"/>
				<span class="show-pwd" @click="showPwd">
					<svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
				</span>
			</el-form-item>

            <el-form-item >
                <el-button type="primary" :loading="loginButton.loading" style="width:100%;" @click.native.prevent="handleLogin">{{loginButton.text}}</el-button>
            </el-form-item>

            <div class="space-between" v-if="false">
                <div><el-link type="primary">还没有账号？立即注册</el-link></div>
                <div><el-link type="primary">忘记密码</el-link></div>
            </div>
		</el-form>
	</div>
    <div class="landscape"></div>
    <div class="filter"></div>
    <canvas id="canvas" width="100vw" height="100vh"></canvas>
</div></template>

<script>
import {starry_init} from '../../vendor/login_animates/index'

export default {
    name: 'Login',
    data() {
        return {
            loginButton: {
                loading: false,
                text: "登录"
            },
            loginForm: {
                username: 'admin',
                password: '123456'
            },
            rules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ]
            },
            passwordType: 'password',
            redirect: undefined
        }
    },
    watch: {
        $route: {
            handler: function(route) {
                this.redirect = route.query && route.query.redirect
            },
            immediate: true
        }
    },
    created() {

    },
    mounted() {
        starry_init(); // 星空动画
    },
    methods: {
        showPwd() {
            if (this.passwordType === 'password') {
                this.passwordType = ''
            } else {
                this.passwordType = 'password'
            }
            this.$nextTick(() => {
                this.$refs.password.focus()
            })
        },
        loginLoading(flag) {
            if (flag) {
                this.loginButton.text = "登录中";
                this.loginButton.loading = true;
            } else {
                this.loginButton.text = "登录";
                this.loginButton.loading = false;
            }
        },
        handleLogin() {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    this.loginLoading(true);

                    this.$store.dispatch('user/login', this.loginForm).then((userInfo) => {
                        this.$message({
                            message: '尊敬的' + userInfo.nickname + '，恭喜你登录成功',
                            type: 'success'
                        });
                        this.$router.push({ path: this.redirect || '/' });
                    }).catch(() => {}).finally(() => {
                        this.loginLoading(false);
                    });
                } else {
                    return false
                }
            })
        }
    }
}
</script>

<style lang="scss">
$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  cursor: auto;
  position: absolute;
  z-index: 999;
  min-height: 100%;
  width: 100%;
  background-color: transparent;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 360px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .space-between {
    display: flex;
    justify-content: space-between;
  }
}
</style>

<style lang="scss" scoped>
    .login-div {
        margin:0;
        overflow:hidden;
        width:100vw;
        height:100vh;
        cursor:none;
        background:black;
        background:linear-gradient(to bottom,#000000 0%,#5788fe 100%);
    }
    .filter {
        width:100%;
        height:100%;
        position:absolute;
        top:0;
        left:0;
        background:#fe5757;
        animation:colorChange 30s ease-in-out infinite;
        animation-fill-mode:both;
        mix-blend-mode:overlay;
    }
    @keyframes colorChange {
        0%,100% {
            opacity:0;
        }
        50% {
            opacity:.9;
        }
    }
    .landscape {
         position:absolute;
         bottom:0px;
         left:0;
         width:100%;
         height:100%;
         background-image:url('../../assets/login_images/starry.png');
         background-size:1000px 250px;
         background-repeat:repeat-x;
         background-position:center bottom;
     }
</style>
