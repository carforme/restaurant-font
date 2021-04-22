import React, { Component, useState, Suspense, useEffect } from 'react'
import { withRouter, useHistory, useParams } from 'react-router-dom'
import createFetcher from './create-fetcher'
import PropTypes from 'prop-types'
import api from './api'
import { produce } from 'immer'
import history from './history'
import io from 'socket.io-client'
import { thisExpression } from '@babel/types'
import style from "./Foodcart.module.css"
import Button from 'antd/es/button';
import './App.css';
import { Layout, Menu, Breadcrumb } from 'antd';


const { Header, Content, Footer } = Layout;


function MenuItem({food, onUpdate, amount}) {
  // var [count, setCount] = useState(amount)

  function dec() {
    if (amount === 0) {
      return
    }
    // setCount(count - 1)
    onUpdate(food, amount - 1)
  }

  function inc() {
    // setCount(count + 1)
    onUpdate(food, amount + 1)
  }

  return (
    <div className={style.menuItemStyle}>
      <h3 className={style.hthree}>{food.name}</h3>
      <div className={style.divp}>
        <img className={style.imgStyle} src={'http://localhost:5002/upload/' + food.img} alt={food.name}/>
        <p>描述：<span>{food.desc}</span></p>
        <p>价格：{food.price}</p>
        <div className={style.divbtn}>
        
         数量：<span>{amount}</span>
         <button onClick={dec}>-</button>
         <button onClick={inc}>+</button>
      </div>
      </div>
      
    </div>
  )
}

MenuItem.propTypes = {
  food: PropTypes.object.isRequired,
  onUpdate: PropTypes.func,
}

MenuItem.defaultProps = {
  onUpdate: () => {},
}


function calcTotalPrice(cartAry) {
  return cartAry.reduce((total, item) => {
    return total + item.amount * item.food.price
  }, 0)
}

/**
 * foods：购物车信息
 * onUpdate事件：用户修改菜品数量时触发
 * onPlaceOrder事件：用户点击下单时触发
 */
function CartStatus(props) {
 // console.log(props)
  var [expand, setExpand] = useState(false)

  var totalPrice = calcTotalPrice(props.foods)

  return (
    <div style={{
    
      position: 'fixed',
      height: '50px',
      borderRadius:"10px",
      bottom: '45px',
      textAlign:"center",
      left: '260px',
      right: '260px',
      minWidth:"500px",
      backgroundColor: 'rgba(0,0,0,0.15)',
    }}>
      {expand ?
        <Button type="primary" className={style.divbtntwo} onClick={() => setExpand(false)}>收起</Button> :
        <Button type="danger"  className={style.divbtntwo} onClick={()=>setExpand(true)}>展开</Button>
      }
    {
      expand ?  <div className={style.itemname}>{ props.foods.map(it=>{
        console.log('props',props,'it',it.food.name,it.amount)
      return  <div className={style.divitem}>{it.food.name}&nbsp;&nbsp;&nbsp;{it.amount}</div>
      })}</div>:''
     }
      
      <strong className={style.divbtnthree}>总价：{totalPrice}</strong>

      <Button type="danger" className={style.divbtntwo}  onClick={() => props.onPlaceOrder()}>下单</Button>
    </div>
  )
}

// export default () => {
//   return (
//     <Suspense fallback={<div>loading...</div>}>
//       <FoodCart/>
//     </Suspense>
//   )
// }


export default class FoodCart extends Component {
  constructor(props) {
    super(props)

    this.state = {
      cart: [],
      foodMenu: [],
      deskInfo: {},
    }
  }

  componentDidMount() {
    var params = this.props.match.params

    api.get('/deskinfo?did=' + params.did).then(val => {
      this.setState({
        deskInfo: val.data,
      })
    })

    api.get('/menu/restaurant/1').then(res => {
      this.setState({
        foodMenu: res.data,
      })
    })


    this.socket = io({
      path: '/desk',
      query: {
        desk: 'desk:' + params.did
      }
    })

    this.socket.on('connect', () => {
      console.log('connect on')
      this.socket.emit('join desk', 'desk:' + params.did)
    })



    // 后端发回此桌面已点菜单
    this.socket.on('cart food', info => {
      console.log('cart init', info)
      this.setState(produce(state => {
        state.cart.push(...info)
      }))
    })

    // 来自同桌其它用户新增的菜单
    this.socket.on('new food', info => {

      console.log(info)
      this.foodChange(info.food, info.amount)
    })

    this.socket.on('placeorder success', order => {
      history.push({
        pathname: `/r/${params.rid}/d/${params.did}/order-success`,
        state: order,
      })
    })
  }

  componentWillUnmount() {
    this.socket.close()
  }

  cartChange = (food, amount) => {
    var params = this.props.match.params
    this.socket.emit('new food', {desk: 'desk:' + params.did, food, amount})
  }

  foodChange = (food, amount) => {
    var updated = produce(this.state.cart, cart => {
      var idx = cart.findIndex(it => it.food.id === food.id)

      if (idx >= 0) {
        if (amount === 0) {
          cart.splice(idx, 1)
        } else {
          cart[idx].amount = amount
        }
      } else {
        cart.push({
          food,
          amount,
        })
      }
    })
    this.setState({cart: updated})
  }

  placeOrder = () => {
    console.log('下单')
    var params = this.props.match.params
    // {
    //   deskName:
    //   customCount:
    //   totalPrice:
    //   foods: [{id, amount}, {}, {}]
    // }
    console.log(params)
    api.post(`/restaurant/${params.rid}/desk/${params.did}/order`, {
      deskName: this.state.deskInfo.name,
      customCount: params.count,
      totalPrice: calcTotalPrice(this.state.cart),
      foods: this.state.cart,
    }).then(res => {
      history.push({
        pathname: `/r/${params.rid}/d/${params.did}/order-success`,
        state: res.data,
      })
    })
  }

  render() {
    return (
      <Layout style={{height:"100%"}}>
    <Header style={{ position: 'fixed', zIndex: 1, width: '100%',background:"rgba(0,0,0,0.6)" }}>
      <div className="logo" />
      <Menu
        theme="light"
        mode="horizontal"
        defaultSelectedKeys={['2']}
        style={{ lineHeight: '64px' }}
      >
      
      </Menu>
      <h1 style={{color:"rgb(27,133,220)",fontWeight:"bold", fontSize:"35px",paddingLeft:"50px"}}>欢迎点餐,祝您用餐愉快！</h1>
    </Header>
    <Content style={{ padding: '0 100px', marginTop: 64 }}>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item></Breadcrumb.Item>
        <Breadcrumb.Item></Breadcrumb.Item>
        <Breadcrumb.Item></Breadcrumb.Item>
      </Breadcrumb>
      <div style={{ background: '#fff',height:"100%", padding: 30,paddingTop:20,marginTop:40, minHeight: 380,minWidth:1000 }}>
      <div>
        <div className={style.divBody}>
          {
            this.state.foodMenu.map(food => {

              var currentAmount = 0
              var currFoodCartItem = this.state.cart.find(cartItem => cartItem.food.id === food.id)
              if (currFoodCartItem) {
                currentAmount = currFoodCartItem.amount
              }

              return <MenuItem key={food.id} food={food} amount={currentAmount} onUpdate={this.cartChange}/>
            })
          }
        </div>
        <CartStatus foods={this.state.cart} onUpdate={this.cartChange} onPlaceOrder={this.placeOrder}/>
      </div>
      </div>
    </Content>
    <Footer style={{ textAlign: 'center',position:"fixed",bottom:'0px',width:"100%",padding:"10px 25px"}}>Ant Design ©2018 Created by Ant UED</Footer>
  </Layout>
     
    )
  }
}

/*function FoodCart(props) {
  var [deskInfo,setDeskInfo]=useState([])
  var params = useParams()
  var foods = menuFetcher.read().data
  var [cart, setCart] = useState([])
  
  useEffect(()=>{
    api.get('/deskInfo?did='+params.did).then(val=>{
      setDeskInfo(val.data)
    })
  },[params.did])
  console.log(cart)
  function foodChange(food, amount) {
    var updated = produce(cart, cart => {
      
      var idx = cart.findIndex(it => it.food.id === food.id)

      if (idx >= 0) {
        if (amount === 0) {
          cart.splice(idx, 1)
        } else {
          cart[idx].amount = amount
        }
      } else {
        cart.push({
          food,
          amount,
        })
      }
    })
    setCart(updated)
  }
  function placeOrder(){
    // console.log(params)
     // {
       //   deskName:
       //   customCount:
       //   totalPrice:
       //   foods: [{id, amount}, {}, {}]
       // }
       api.post(`/restaurant/${params.rid}/desk/${params.did}/order`, {
         deskName: deskInfo.name,
         customCount: params.count,
         totalPrice:calaTotalPrice(cart),
         foods: cart,
       }).then(res=>{
         history.push({
           pathname:`/r/${params.rid}/d/${params.did}/order-success`,
           state:res.data
         })
       })
   
   }
  return(
    <div>
    <div>{
      foods.map(food=>{
        return <MenuItem  key={food.id} food={food} onUpdate={foodChange}  />
      })
    }</div>
     <CartStatus foods={cart} onUpdate={foodChange} onPlaceOrder={placeOrder}/>
   
    </div>
  )
}


function calaTotalPrice(cartAry){
  return cartAry.reduce((total,item)=>{
    return total+item.amount*item.food.price
  },0)
}
function CartStatus(props) {
 
  var [expand, setExpand] = useState(false)
  var totalPrice =calaTotalPrice(props.foods)


  return (
    <div style={{
      position: 'fixed',
      height: '50px',
      bottom: '5px',
      border: '2px solid',
      left: '5px',
      right: '5px',
      backgroundColor: 'pink',
    }}>
       {expand ?
        <button onClick={() => setExpand(false)}>收起</button> :
        <button onClick={() => setExpand(true)}>展开</button>
      }
      <strong>总价：{totalPrice}</strong>

      <button onClick={() => props.onPlaceOrder()}>下单</button>
    </div>
  )
}
*/
// export default function(){
//   return(
//    <Suspense fallback={<div>loading...</div>}>
//      <FoodCart/>
//    </Suspense>
//   )
// }