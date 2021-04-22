import React, { Component, useState, useEffect, useCallback } from 'react'
import io from 'socket.io-client'
import api from './api'
import { produce } from 'immer'
import style from "./OrderManage.module.css"
import Button from 'antd/es/button';
import './App.css';


function OrderItem({order, onDelete}) {
  

  var [orderInfo, setOrder] = useState(order)
  var [bgcstyle,setBgcstyle]=useState({})

  function setConfirm() {
    api.put(`/restaurant/1/order/${order.id}/status`, {
      status: 'confirmed'
    }).then(() => {
      setOrder({
        ...orderInfo,
        status: 'confirmed'
      })
    })
  }

  function setComplete() {
    api.put(`/restaurant/1/order/${order.id}/status`, {
      status: 'completed'
    }).then(() => {
      setOrder({
        ...orderInfo,
        status: 'completed'
      })
    })
  }

  function deleteOrder() {
    api.delete(`/restaurant/1/order/${order.id}`).then(() => {
      onDelete(order)
    })
  }

  return (
    <div className={style.orderItemStyle} style={bgcstyle}>
      <h2 className={style.ht}><span style={{color:"black",fontSize:"40px"}}>桌号</span><br/>{orderInfo.deskName}</h2>
    <div className={style.diva}>
     <div className={style.divh}>
        <h3 className={style.hs}>总价格：{orderInfo.totlaPrice}</h3>
        <h3 className={style.hs}>人数：{orderInfo.customCount}</h3>
      <h3 className={style.hs}>订单状态：{orderInfo.status}</h3>
      </div>
      <div className={style.divs}>
      
        <Button type="primary" className={style.btn}>打印</Button>
        <Button type="primary" className={style.btn} onClick={setConfirm}>确认</Button>
        <Button type="primary" className={style.btn} onClick={setComplete}>完成</Button>
        <Button type="primary" className={style.btn} onClick={(event)=>{
           deleteOrder();setBgcstyle({background:"red"});}
           }>删除</Button>
      </div>
      </div>
    </div>
  )
}

export default class OrderManage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      orders: []
    }
  }

  componentDidMount() {
    var params = this.props.match.params

    this.socket = io({
      path: '/restaurant',
      query: {
        restaurant: 'restaurant:' + params.rid
      }
    })

    this.socket.on('connect', () => {
      this.socket.emit('join restaurant', 'restaurant:' + params.rid)
    })

    this.socket.on('new order', order => {
      this.setState(produce(state => {
        state.orders.unshift(order)
      }))
    })

    api.get('/restaurant/1/order').then(res => {
      this.setState(produce(state => {
        state.orders = res.data
      }))
    })
  }

  componentWillUnmount() {
    this.socket.close()
  }

  onDelete = (order) => {
    var idx = this.state.orders.findIndex(it => it.id === order.id)

    this.setState(produce(state => {
      state.orders.splice(idx, 1)
    }))
  }

  render() {
    return (
      <div className={style.Fdiv}>
        <h2 className={style.h}>订单管理</h2>
        <div>
          {this.state.orders.length > 0 ?
            this.state.orders.map(order => {
              return <OrderItem onDelete={this.onDelete} key={order.id} order={order} />
            })
            :
            <div>loading...</div>
          }
        </div>
      </div>
    )
  }
}
