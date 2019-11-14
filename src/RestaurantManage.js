import React, { Suspense, useEffect, useState, Component } from 'react'
import { Switch, Link, Route, withRouter, useHistory } from 'react-router-dom'
//import OrderManage from './OrderManage'
//import FoodManage from './FoodManage'
//import DeskManage from './DeskManage'
//import AddFood from './AddFood'
import api from './api'
import createFetcher from './create-fetcher'
import history from './history'


import { Layout, Menu, Icon } from 'antd';
import style from './RestaurantManage.module.css';

const { Header, Sider, Content } = Layout;


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





export default class FoodCart extends Component {
  state = {
    collapsed: false,
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  render() {
    return (
      <Layout>
        <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
          <div className="logo" />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="1">
              <Icon type="user" />
              <span>nav 1</span>
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="video-camera" />
              <span>nav 2</span>
            </Menu.Item>
            <Menu.Item key="3">
              <Icon type="upload" />
              <span>nav 3</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            <Icon
              className="trigger"
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
          </Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              background: '#fff',
              minHeight: 280,
            }}
          >
            Content
          </Content>
        </Layout>
      </Layout>
    );
  }
}

