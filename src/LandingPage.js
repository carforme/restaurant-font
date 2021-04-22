import React, { Suspense, useState } from 'react'
import { Switch, Link, Route, withRouter, useHistory } from 'react-router-dom'
import createFetcher from './create-fetcher'
import api from './api'
import  style from'./LandingPage.module.css'
import Button from 'antd/es/button';
import './App.css';
//import { Layout } from 'antd';
import { Layout } from 'antd';
const { Header, Footer, Content } = Layout;

var fetcher = createFetcher((did) => {
  return api.get('/deskinfo?did=' + did)
})

function DeskInfo({did}) {
  var info = fetcher.read(did).data

  return (
    <div className={style.divhead}>
     
      <span>{info.title}</span>
      -
      <span>{info.name}</span>
    </div>
  )
}


export default withRouter(function(props) {
  var [custom, setCustom] = useState(0)


  var rid = props.match.params.rid
  var did = props.match.params.did

   function startOrder() {
     props.history.push(`/r/${rid}/d/${did}/c/${custom}`)
   }
   

  return (
    <div className={style.divstyle}>
    <Layout className={style.Layoutstyle}>
    <Header className={style.Headstyle}><span>Welcome to your restaurant !</span></Header>
       <Content className={style.Content}>
         <div className={style.Contentdiv}>
         <Suspense fallback={<div>正在加载桌面信息...</div>}>
          <DeskInfo did={did} />
        </Suspense>
      <h2 className={style.hland}>请选择人数</h2>
      <ul className={style.customcount}>
          <li className={custom === 1 ? style.active : null} onClick={() => setCustom(1)}>1</li>
          <li className={custom === 2 ? style.active : null} onClick={() => setCustom(2)}>2</li>
          <li className={custom === 3 ? style.active : null} onClick={() => setCustom(3)}>3</li>
          <li className={custom === 4 ? style.active : null} onClick={() => setCustom(4)}>4</li>
        </ul>
        <Button type="danger" style={{ width:"200px",
            height:'50px',
            fontSize:" 25px",
            marginTop:"23px"}} className={style.btnL}  onClick={startOrder}>开始点餐</Button>
        </div>
       
     </Content>
       <Footer className={style.Footer}>
         <div>欢迎登录</div></Footer>
   </Layout>
 </div>
   )
})


