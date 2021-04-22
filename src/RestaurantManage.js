import React, { Suspense, useEffect, useState, Component } from 'react'
import { Switch, Link, Route, withRouter, useHistory,Redirect } from 'react-router-dom'
import OrderManage from './OrderManage'
import FoodManage from './FoodManage'
import DeskManage from './DeskManage'
import AddFood from './AddFood'
import api from './api'
import createFetcher from './create-fetcher'
import history from './history'


import { Layout, Menu, Icon } from 'antd';
import style from './RestaurantManage.module.css';
import { router } from 'sw-toolbox'

const { Header, Sider, Content ,Footer } = Layout;


const userInfoFetcher = createFetcher(async () => {
  return api.get('/userinfo').catch(() => {
    // window.history.hash = '/'
    history.push('/')
  })
})
function RestaurantInfo() {
  var info = userInfoFetcher.read().data
  
  return (
    <div>
      {info &&
        info.title+"!"
      }
    </div>
  )
}





export default withRouter(function(props) {
  async function logout() {
    await api.get('/logout')
    userInfoFetcher.clearCache()
    props.history.push('/')
  }

  return(
    <div style={{height:"100%",background:"white"}}>
    <Layout  style={{width:"100%",height:"100%",background:"white"}} >
    <Sider className={style.Slider}
      breakpoint="lg"
      collapsedWidth="0"
      onBreakpoint={broken => {
        console.log(broken);
      }}
      onCollapse={(collapsed, type) => {
        console.log(collapsed, type);
      }}
    >
       <div style={{textAlign:"center",fontSize:"24px",color:"blue",padding:"20px 10px"}}> <span style={{fontSize:"28px",color:"black",fontWeight:"bold"}}>欢迎来到:</span>
        <Suspense fallback={<div>loading...</div>}>
        <RestaurantInfo  />
       </Suspense>
        </div>
      <div className="logo" />
      <Menu className={style.Menu} theme="light" mode="inline" defaultSelectedKeys={['4']}>
       
        <Menu.Item key="1" style={{paddingLeft:"32px"}} >
          <Icon type="user" />
          <span className="nav-text"> <Link   className={style.Item} to="order" > 订单管理</Link></span>
        </Menu.Item>
        <Menu.Item key="2">
          <Icon type="video-camera" />
          <span className="nav-text"> <Link className={style.Item} to="food">菜品管理</Link></span>
        </Menu.Item>
        <Menu.Item key="3">
          <Icon type="upload" />
          <span className="nav-text"><Link className={style.Item} to="desk">桌面管理</Link></span>
        </Menu.Item>
        <Menu.Item key="4">
          <Icon type="user" />
          <span className="nav-text" className={style.Item} onClick={logout}>&nbsp;退&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;出</span>
        </Menu.Item>
      </Menu>
    </Sider>
    <Layout  className={style.mained} style={{marginBottom:"50px"}}>
      <Header className={style.Headstyle} >
      <span className={style.Headspan}>Welcome to your restaurant!</span>
      </Header>
      <Content  style={{ margin: '0',height:"100%",padding:'30 20', }}>
        <div style={{ padding: 24,paddingBottom:"40px", height:"100%" }}>
      <main>
      <Switch>
          <Route path="/restaurant/:rid/manage/order" exact  component={OrderManage}/>
          <Route path="/restaurant/:rid/manage/food" component={FoodManage}/>
          <Route path="/restaurant/:rid/manage/desk" component={DeskManage}/>
          <Route path="/restaurant/:rid/manage/add-food" component={AddFood}/>
       </Switch>
      </main> 
        </div>
      </Content>
      </Layout>
      <Footer style={{ textAlign: 'center',position:"fixed",bottom:'0px',width:"100%",padding:"10px 25px"}}>Ant Design ©2018 Created by Ant UED</Footer>
  
  </Layout>

      
    </div>
  )

})
///restaurant/:rid/manage/order