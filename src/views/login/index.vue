<template><div class="login-div">
    <div class="login-container">
		<el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
			<div class="title-container">
				<h3 class="title">个人通讯录管理系统</h3>
			</div>

			<el-form-item prop="username">
				<span class="svg-container">
					<svg-icon icon-class="user" />
				</span>
				<el-input ref="username" v-model="loginForm.username" placeholder="Username" name="username" type="text" tabindex="1" auto-complete="on"/>
			</el-form-item>

			<el-form-item prop="password">
				<span class="svg-container">
					<svg-icon icon-class="password" />
				</span>
				<el-input :key="passwordType" ref="password" v-model="loginForm.password" :type="passwordType" placeholder="Password" name="password" tabindex="2" auto-complete="on" @keyup.enter.native="handleLogin"/>
				<span class="show-pwd" @click="showPwd">
					<svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
				</span>
			</el-form-item>

			<el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>
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
            loginForm: {
                username: 'admin',
                password: '111111'
            },
            loginRules: {

            },
            loading: false,
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
        starry_init();
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
        handleLogin() {
            this.$refs.loginForm.validate(valid => {
                if (valid) {
                    this.loading = true
                    this.$store.dispatch('user/login', this.loginForm).then(() => {
                        this.$router.push({ path: this.redirect || '/' })
                        this.loading = false
                    }).catch(() => {
                        this.loading = false
                    })
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
