import React, {useState} from 'react'
import api from './api'
import history from './history'
import style from './Addfood.module.css'
import Button from 'antd/es/button';
import './App.css';

function AddFood(props) {
  var [foodInfo, setFoodInfo] = useState({
    name: '',
    desc: '',
    price: 0,
    category: '',
    status: 'on',
    img: null,
  })

  function change(e) {
    setFoodInfo({
      ...foodInfo,
      [e.target.name]: e.target.value
    })
  }

  function imgChange(e) {
    setFoodInfo({
      ...foodInfo,
      img: e.target.files[0],
    })
  }

  function submit(e) {
    e.preventDefault()

    var fd = new FormData()
    
    for(var key in foodInfo) {
      var val = foodInfo[key]
      fd.append(key, val)
    }

    api.post('/restaurant/1/food', fd).then(res => {
      history.goBack()
    })
  }

  return (
    <div className={style.divF}>
      <h2 className={style.h}>添加菜品</h2>
      <div className={style.divL}>
      <form onSubmit={submit}>
      <span>  名称：<input type="text" onChange={change} defaultValue={foodInfo.name} name="name"/></span>
      <span> 描述：<input type="text" onChange={change} defaultValue={foodInfo.desc} name="desc"/>       </span>
      <span> 价格：<input type="text" onChange={change} defaultValue={foodInfo.price} name="price"/></span>
      <span> 分类：<input type="text" onChange={change} defaultValue={foodInfo.category} name="category"/></span>
      <span> 图片：<input type="file" onChange={imgChange} name="img" /></span>
      <Button type="primary" onClick={submit} className={style.btnss}><p style={{height:"45px",margin:"0", fontSize:"22px",paddingTop:"3px"}}>提交</p></Button>

      </form>
      </div>
    </div>
  )
}

export default AddFood