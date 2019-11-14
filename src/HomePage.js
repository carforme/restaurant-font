import Button from 'antd/es/button';
import './App.css';
import { Layout } from 'antd';
import React, { useRef, useEffect, useState ,Component } from 'react'
import { withRouter,Link } from 'react-router-dom'
import api from './api'
import Axios from 'axios'
import style from './Homepage.module.css'
const { Header, Footer, Content } = Layout;

export default withRouter(function(props) {
  var nameRef = useRef()
  var passwordRef = useRef()
  var captchaRef = useRef()
  var [captcha, setCaptcha] = useState(null)
  //useEffect(() => {
  //  api.get('/captcha').then(res => {
  //    console.log(res.data)
  //    setCaptcha('data:image/svg+xml;base64,' + btoa(res.data))
  //  })
  //}, [])
  async function login(e) {
    e.preventDefault()

    var name = nameRef.current.value
    var password = passwordRef.current.value
    var captcha = captchaRef.current.value

    try {
      var res = await api.post('/login', {name, password, captcha})
      props.history.push(`/restaurant/${res.data.id}/manage/`)
    } catch(e) {
      alert(e.response.data.msg)
    }
  }

  return (
  <div className={style.divstyle}>
     <Layout className={style.Layoutstyle}>
      <Header className={style.Headstyle}><span>Welcome to your restaurant !</span></Header>
      <Content className={style.Content}>
        <div className={style.Contentdiv}>
        <h2>餐厅管理员登录</h2>
        <form onSubmit={login}>
        <input type="text" ref={nameRef} placeholder="用户名"/><br/>
        <input type="password" ref={passwordRef} placeholder="密码"/><br/>
        <input type="text" ref={captchaRef} placeholder="验证码"/><br/>
       <div className={style.divImg}><img src="/api/captcha" alt="captcha"/></div>  
        <Button type="primary" onClick={login} className={style.btn}>Login</Button>{/*button自带提交属性*/}
      </form>
         <Link className={style.link}>忘记密码</Link>
       </div>
       <div className={style.divlast}><span>您还没有注册过账户？<Link to="/register">请注册</Link></span></div>
    </Content>
      <Footer className={style.Footer}>
        <div>欢迎登录</div></Footer>
    </Layout>
  </div>)
})