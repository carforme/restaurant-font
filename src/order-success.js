import React from 'react'

export default function OrderSuccess(props){
  console.log(props)
   return(
  <div>
     <div>下单成功</div>
     <p>总价：{props.location.state&&props.location.state.totlaPrice}</p>
     </div>
   )

}