import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from './api'
import style from "./FoodManage.module.css"
import Button from 'antd/es/button';
import './App.css';


function FoodItem({food, onDelete}) {
  var [foodInfo, setFoodInfo] = useState(food)
  var [isModify, setIsModify] = useState(false)
  var [foodProps, setFoodProps] = useState({
    name: food.name,
    desc: food.desc,
    price: food.price,
    category: food.category,
    status: food.status,
    img: null,
  })


  function save() {
  var fd = new FormData()

  for(var key in foodProps) {
    var val = foodProps[key]
    fd.append(key, val)
  }

    api.put('/restaurant/1/food/' + food.id, fd).then((foodInfo) => {
      setIsModify(false)
      setFoodInfo(foodInfo.data)
    })
  }

  function change(e) {
    setFoodProps({
      ...foodProps,
      [e.target.name]: e.target.value
    })
  }

  function imgChange(e) {
    setFoodProps({
      ...foodProps,
      img: e.target.files[0],
    })
  }

  function deleteFood() {
    api.delete('/restaurant/1/food/' + food.id).then(() => {
      onDelete(food.id)
    })
  }

  function setOnline() {
    api.put('/restaurant/1/food/' + food.id, {
      ...foodProps,
      status: 'on',
    }).then(res => {
      setFoodInfo(res.data)
    })
  }
  function setOffline() {
    api.put('/restaurant/1/food/' + food.id, {
      ...foodProps,
      status: 'off',
    }).then(res => {
      setFoodInfo(res.data)
    })
  }

  function getContent() {
    if (isModify) {
      return (
        <div className={style.isdiv}>
          <form>
          <span>  名称：<input type="text" onChange={change} defaultValue={foodInfo.name} name="name"/></span>
            <span> 描述：<input type="text" onChange={change} defaultValue={foodInfo.desc} name="desc"/></span>
            <span> 价格：<input type="text" onChange={change} defaultValue={foodInfo.price} name="price"/></span>
             <span>分类：<input type="text" onChange={change} defaultValue={foodInfo.category} name="category"/></span>
            <span>图片：<input type="file" onChange={imgChange} name="img" /></span> 
          </form>
        </div>
      )
    } else {
      return (
        <div className={style.foodInfoStyle}>
          <img src={'/upload/' + foodInfo.img} alt={foodInfo.name}  className={style.imgStyle} />
          <div className={style.divp}>
          <p>描述：{foodInfo.desc}</p>
          <p>价格：{foodInfo.price}</p>
          <p>分类：{foodInfo.category ? foodInfo.category : '[暂未分类]'}</p>
        </div>
        </div>
      )
    }
  }


  return (
    <div className={style.orderItemStyle}>
      <h3 className={style.ht}>{foodInfo.name}</h3>
      {getContent()}
      <div className={style.divbtn}>
        <Button onClick={() => setIsModify(true)}>修改</Button>

        <Button onClick={save}>保存</Button>

        {foodInfo.status === 'on' &&
          <Button onClick={setOffline}>下架</Button>
        }
        {foodInfo.status === 'off' &&
          <Button onClick={setOnline}>上架</Button>
        }
        <Button onClick={deleteFood}>删除</Button>
      </div>
    </div>
  )
}



 export default function FoodManage(){
  var [foods, setFoods] = useState([])

  useEffect(() => {
    api.get('/restaurant/1/food').then(res => {
      setFoods(res.data)
    })
  }, [])

  console.log(foods)
  
  function onDelete(id) {
    setFoods(foods.filter(it => it.id !== id))
  }
   return (
    <div className={style.Fdiv}>
      <div className={style.h}> 
        <Link to="/restaurant/:rid/manage/add-food">添加菜品</Link>
     </div>
        <div>
      {
        foods.map(food => {
          return <FoodItem onDelete={onDelete} key={food.id} food={food}/>
        })
      }
    </div>
  </div>
  )}