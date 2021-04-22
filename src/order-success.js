import React, {useState } from 'react'
import Button from 'antd/es/button';
import './App.css';
import { Layout } from 'antd';
import style from './ordersuccsrr.module.css'
import history from './history'
const { Header, Footer, Content } = Layout;

export default function OrderSuccess(props){
  var [time, setTime] = useState(5)
 
  console.log(props)
   return(
    <div className={style.divstyle}>
    <Layout className={style.Layoutstyle}>
     <Header className={style.Headstyle}><span>Welcome to your restaurant !</span></Header>
     <Content className={style.Content}>
       <div className={style.Contentdiv}>
      <div className={style.order}>下单成功</div>
      <p className={style.orderp}>总价：{props.location.state&&props.location.state.totlaPrice}元</p>
      </div>
   </Content>
     <Footer className={style.Footer}>
       <div>欢迎登录</div></Footer>
   </Layout>
 </div>
   )

}
//setTimeout(() => {
//  history.push('/r/:rid/d/:did/c/:count')
//}, 3000)