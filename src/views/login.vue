<template>
  <div class="login">
    <div class="log_po">
    </div>

    <div class="introduction">
      <h2>宿迁电信管理系统</h2>
      <hr />
      <p>
        宿迁是西楚霸王项羽的故乡，有着5000多年的文明史和2700多年的建城史，曾是钟吾国都城，历史悠久，人文荟萃，素有“华夏文明之脉、江苏文明之根、楚汉文化之魂”之称。宿迁是酒文化的发源地之一，有中国白酒之都称号，洋河、双沟两大名酒出产于此。宿迁坐拥骆马湖洪泽湖两大淡水湖，大运河、古黄河、淮沐新河等众多河流穿境而过乾隆皇帝六下江南五次驻晔于此，赞叹宿迁为“第一江山春好处”
      </p>
    </div>
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
    >
      <h3 class="title">用户登录</h3>
      <p>账号</p>
      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          type="text"
          auto-complete="off"
          placeholder="账号"
        >
          <svg-icon
            slot="prefix"
            icon-class="user"
            class="el-input__icon input-icon"
          />
        </el-input>
      </el-form-item>
      <p>密码</p>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon
            slot="prefix"
            icon-class="password"
            class="el-input__icon input-icon"
          />
        </el-input>
      </el-form-item>
      <p>验证码</p>
      <el-form-item prop="code" v-if="captchaEnabled">
        <el-input
          v-model="loginForm.code"
          auto-complete="off"
          placeholder="验证码"
          style="width: 63%"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon
            slot="prefix"
            icon-class="validCode"
            class="el-input__icon input-icon"
          />
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode" class="login-code-img" />
        </div>
      </el-form-item>
      <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
      <el-form-item style="width: 100%">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width: 100%"
          @click.native.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
        <div style="float: right" v-if="register">
          <router-link class="link-type" :to="'/register'">立即注册</router-link>
        </div>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <div class="el-login-footer">
      <!-- <span>Copyright © 2018-2022 宿迁电信 All Rights Reserved.</span> -->

      <!--
      <div class="footinfo pore">
        <div class="p-t">主办单位：宿迁市文化广电和旅游局<span></span></div>
        <div class="p-t">政府网站标识码：3213000025&nbsp;&nbsp;<a href="http://beian.miit.gov.cn/" target="_blank">苏ICP备08010541号-1</a></div>
        <div class="p-t"><a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=32130202080018"><img style="height: 15px; line-height: 15px" src="../assets/images/batb.png">&nbsp;苏公网安备 32130202080018号</a></div>
        <div class="piclink">
          <div class="p1">
            <a href="https://bszs.conac.cn/sitename?method=show&id=C2D2CE348F05C630E05310291AAC136A" target="_blank"><img src="../assets/images/red.png" /></a>
          </div>
          <div class="p2">
            <span><a href="https://zfwzgl.www.gov.cn/exposure/jiucuo.html?site_code=3213000018&url=http%3A%2F%2Fwgl.suqian.gov.cn%2Fswhgd%2Findex.shtml" target="_blank"><img onclick="Link('3213000025')" style="margin:0;border:0;cursor: pointer;" src="../assets/images/jiucuo.png"></a></span>
          </div>
        </div>
      </div>
      -->
    </div>
  </div>
</template>

<script>
  import { getCodeImg } from '@/api/login';
  import Cookies from 'js-cookie';
  import { encrypt, decrypt } from '@/utils/jsencrypt';

  export default {
    name: 'Login',
    data() {
      return {
        codeUrl: '',
        loginForm: {
          username: '',
          password: '',
          rememberMe: false,
          code: '',
          uuid: '',
        },
        loginRules: {
          username: [
            { required: true, trigger: 'blur', message: '请输入您的账号' },
          ],
          password: [
            { required: true, trigger: 'blur', message: '请输入您的密码' },
          ],
          code: [{ required: true, trigger: 'change', message: '请输入验证码' }],
        },
        loading: false,
        // 验证码开关
        captchaEnabled: true,
        // 注册开关
        register: false,
        redirect: undefined,
      };
    },
    watch: {
      $route: {
        handler: function (route) {
          this.redirect = route.query && route.query.redirect;
        },
        immediate: true,
      },
    },
    created() {
      this.getCode();
      this.getCookie();
    },
    methods: {
      getCode() {
        getCodeImg().then((res) => {
          this.captchaEnabled =
            res.captchaEnabled === undefined ? true : res.captchaEnabled;
          if (this.captchaEnabled) {
            this.codeUrl = 'data:image/gif;base64,' + res.img;
            this.loginForm.uuid = res.uuid;
          }
        });
      },
      getCookie() {
        const username = Cookies.get('username');
        const password = Cookies.get('password');
        const rememberMe = Cookies.get('rememberMe');
        this.loginForm = {
          username: username === undefined ? this.loginForm.username : username,
          password:
            password === undefined ? this.loginForm.password : decrypt(password),
          rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
        };
      },
      handleLogin() {
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            this.loading = true;
            if (this.loginForm.rememberMe) {
              Cookies.set('username', this.loginForm.username, { expires: 30 });
              Cookies.set('password', encrypt(this.loginForm.password), {
                expires: 30,
              });
              Cookies.set('rememberMe', this.loginForm.rememberMe, {
                expires: 30,
              });
            } else {
              Cookies.remove('username');
              Cookies.remove('password');
              Cookies.remove('rememberMe');
            }
            this.$store
              .dispatch('Login', this.loginForm)
              .then(() => {
                this.$router.push({ path: this.redirect || '/' }).catch(() => {});
              })
              .catch(() => {
                this.loading = false;
                if (this.captchaEnabled) {
                  this.getCode();
                }
              });
          }
        });
      },
    },
  };
</script>

<style rel="stylesheet/scss" lang="scss">
  .login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-image: url('../assets/images/login-background.png');
    background-size: cover;

    .log_po{
      position: absolute;
      left: 10%;
      top: 50px; width: 240px; height: 66px;
      background:url('../assets/images/logo-top.png') no-repeat ;
      background-size: 100% 100%;
    }

  }
  .title {
    margin: 0px auto 30px auto;
    text-align: center;
    color: #707070;
  }

  .login-form {
    margin-left: 55%;
    border-radius: 6px;
    background: #ffffff;
    width: 400px;
    padding: 25px 25px 5px 25px;
    .el-input {
      height: 38px;
      input {
        height: 38px;
      }
    }
    .input-icon {
      height: 39px;
      width: 14px;
      margin-left: 2px;
    }
  }
  .login-tip {
    font-size: 13px;
    text-align: center;
    color: #bfbfbf;
  }
  .login-code {
    width: 33%;
    height: 38px;
    float: right;
    img {
      cursor: pointer;
      vertical-align: middle;
    }
  }
  .el-login-footer {
    height: 40px;
    line-height: 40px;
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
    color: #fff;
    font-family: Arial;
    font-size: 12px;
    letter-spacing: 1px;
  }
  .login-code-img {
    height: 38px;
  }
  .introduction {
    color: #fff;
    position: absolute;
    left: 15%;
    top: 24%;
    width: 510px;
  }
  h2 {
    font-size: 46px;

    font-weight: bold;
  }

  p {
    font-size: 16px;

    line-height: 2.5;
  }

  .footinfo{
    width: 1200px; margin:  0 auto;
    text-align: center;
    position: relative;

    p{padding: 0 10px;}
    .p-t{
      line-height: 30px !important; font-size: 12px;
    }
  }
  .pore{
    position: relative;
  }

  .el-login-footer{
    height:100px !important;
  }
  .piclink .p1 {
    position: absolute;
    left: 25%;
    top: 50%;
    transform: translateY(-50%);
  }
  .piclink .p2 {
    position: absolute;
    right: 23%;
    top: 50%;
    transform: translateY(-50%);
  }
</style>
