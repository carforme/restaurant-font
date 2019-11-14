import React, { useRef, useEffect, useState ,Component } from 'react'
import history from './history'
// import { Link } from 'react-router-dom'
import api from './api'
import Button from 'antd/es/button';
import './App.css';
import { Layout } from 'antd';
import style from './Register.module.css'

import { withRouter,Link } from 'react-router-dom'
import Axios from 'axios'
const { Header, Footer, Content } = Layout;

export default function(){
  var nameRef = useRef()
  var passwordRef = useRef()
  var emailRef= useRef ()
  var foodRef=useRef ()
  

   function givemessage(){
     var rgInfo={
      name:nameRef.current.value,
      password: passwordRef.current.value,
      email:emailRef.current.value,
      title:foodRef.current.value
     } 
     console.log(rgInfo)
   
    api.post('/register',rgInfo).then(res=>{
      if(res.data.code === 0){
        history.push('/')
      }else{
        alert('用户名已注册')
      }
     }
    )
  }
  return (
   <div className={style.divstyle}>
     <Layout className={style.Layoutstyle}>
      <Header className={style.Headstyle}><span>Welcome to your restaurant !</span></Header>
      <Content className={style.Content}>
        <div className={style.Contentdiv}>
        <h2>餐厅注册</h2>
       
     <div className={style.divinput}>  <span>用户名：</span><input type="text" name="name" ref={nameRef}/></div> 
     <div className={style.divinput}>  <span>邮&nbsp;&nbsp;&nbsp;箱：</span><input type="text" name="email" ref={emailRef}/></div> 
     <div className={style.divinput}>  <span>密&nbsp;&nbsp;&nbsp;码：</span><input type="password" name="password"ref={passwordRef}/></div> 
     <div className={style.divinput}>  <span>店&nbsp;&nbsp;&nbsp;名：</span><input type="text" name="name" ref={foodRef}/></div> 
      <div className={style.btn}>  <Button type="primary" onClick={givemessage} className={style.divbtn}>注册</Button>{/*button自带提交属性*/}</div>
       </div>
       <div  className={style.divlast}><span>已注册过账户？<Link to="/">请登录</Link></span></div>
    </Content>
      <Footer className={style.Footer}>
        <div>欢迎登录</div></Footer>
    </Layout>
  </div>
   )
}