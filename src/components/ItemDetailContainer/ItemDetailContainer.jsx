import React, { useContext } from 'react';
import './styles.css';
import { useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import listadoProductos from "../../Mock";
import ItemCount from '../ItemCount/ItemCount';
import cartContext from '../../context/cartContext'
import Loader from '../Loader/Loader';

// Configuración Firebase -----------------------------------------------------------

import { collection, getDocs, query, where } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbBr5QGDOhK7GovGCrOY3mRLJOlqSPj2c",
  authDomain: "reactproyectofinalmorrallajuan.firebaseapp.com",
  projectId: "reactproyectofinalmorrallajuan",
  storageBucket: "reactproyectofinalmorrallajuan.appspot.com",
  messagingSenderId: "620829723264",
  appId: "1:620829723264:web:c82a918562d93a33c93465"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

// Configuración Firebase -----------------------------------------------------------


async function getSingleItemFromDatabase(idItem) {
    // referencia de la colección y del documento
    const productsColectionRef = collection(db, "products");
    const docRef = doc(productsColectionRef, idItem);
  
    // getDoc -> datos
    const docSnapshot = await getDoc(docRef);
  
    // extra
    if (docSnapshot.exists() === false) 
      throw new Error("No existe el documento") 
  
    return { ...docSnapshot.data(), id: docSnapshot.id };
}




export default function ItemDetailContainer() {

const [item, setItem] = useState([])

const params = useParams()
const idProduct = params.idProducto;

const {addItem} = useContext (cartContext);

function onAddToCart(count) {
  alert(`Agregaste ${count} ítems al carrito.`)
  addItem(item, count);
}


function promesaItem() {
    
}

useEffect (()=>{
    const promesaItem = new Promise((resolve, reject)=>{
        setTimeout(()=>{
            let encontrado = listadoProductos.find((item) => item.id === parseInt(idProduct)); 
            if(encontrado !== undefined) resolve(encontrado);
            else reject("No se encontró el producto.");
        }, 2000)
    });

    promesaItem.then((respuesta)=>setItem(respuesta));
    promesaItem.catch((error) => alert ("Error."))


}, []);

const precioOferta = ((100-item.oferta)*item.precio/100)


if (item.nombre === undefined) return <Loader />;

  return (
    <div className="container">
        <div className="card">
            <div className='container-card'>
                <div>
                    <h4>{item.nombre}</h4>
                </div>
                    <div>
                        {item.oferta && (
                        <div className="oferta">¡En oferta!</div>
                        )}
                    </div>
            </div>
            <div>
                <img className="imagen-detail" src={item.img} />
            </div>
            <div>
                <h5>Marca: {item.marca}</h5>
            </div>
            <div>
                <h5>Origen: {item.origen}</h5>
            </div>
            <div>
                {item.oferta? (
                        <div> <h5 className='precio-tachado'>${item.precio}</h5>
                        <h3 className='precio-oferta'>${precioOferta}</h3>
                        </div>
                        ) : <h5>${item.precio}</h5>}
                
            </div>
            <ItemCount onAddToCart={onAddToCart} inicial={1} stock={item.stock} />
            

        </div>
    </div>
  )
}


