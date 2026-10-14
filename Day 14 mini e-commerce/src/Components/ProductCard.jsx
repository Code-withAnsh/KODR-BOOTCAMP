
import { myData } from "../Context/MyContext";
import  { useContext, useEffect } from "react";
const ProductCard = ({ product }) => {

  const {productData,setProductData} = useContext(myData)

  let CartHandler = () =>{
    setProductData((previous)=>{
      const isAlreadyExist = previous.find((item)=>
        item.id ===product.id
      )
      if(isAlreadyExist){
        return previous.map((item)=>
          item.id === product.id
          ?{
            ...item,quantity:item.quantity+1
          }:item
        )
      }
      return[
        ...previous,{
          product:product,
          id:product.id,
          quantity:1,
        }
      ]
    }) 
  }
const reduceQunatity = () =>{
setProductData((prev
)=>
prev.map((item)=>
item.id===product.id
?{...item,quantity:item.quantity-1}:item
)
.filter((item)=>item.quantity>0)

)

}

const CartItem = productData.find((item)=>item.id===product.id)
console.log(CartItem);

  useEffect(()=>{
    
  },[productData])
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-200/70">
      <div className="flex h-64 items-center justify-center overflow-hidden rounded-xl bg-slate-100 p-7">
        <img
          src={product.image}
          alt={product.title}
          className="h-full w-full object-contain mix-blend-multiply transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col px-1.5 pb-1 pt-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-600">
          {product.category}
        </p>

        <h3 className="mt-2 line-clamp-2 text-sm font-semibold leading-5 text-slate-800">
          {product.title}
        </h3>

        <div className="mt-auto flex items-center justify-between pt-5">
          <p className="text-lg font-bold text-slate-950">${product.price}</p>

          <span className="text-xs font-medium text-slate-500">
            <span className="text-amber-500">★</span> {product.rating?.rate}
          </span>
        </div>
        <div>
          {CartItem !== undefined ? (
            <div className="mt-4 flex h-11 w-full items-center justify-between overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <button
                type="button"
                onClick={reduceQunatity}
                className="flex h-full w-14 items-center justify-center border-r border-slate-200 text-xl font-semibold text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-700 active:bg-blue-100"
                aria-label={`Decrease quantity of ${product.title}`}
              >
                −
              </button>
              <span className="min-w-10 text-center text-sm font-bold text-slate-900">
                {CartItem.quantity}
              </span>
              <button
                type="button"
                onClick={CartHandler}
                className="flex h-full w-14 items-center justify-center border-l border-slate-200 text-xl font-semibold text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-700 active:bg-blue-100"
                aria-label={`Increase quantity of ${product.title}`}
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={CartHandler}
              className="mt-4 w-full rounded-xl bg-slate-950 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
            >
              Add to cart
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
