import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Cart(){
    const [items, setItems] = useState([]);
    return (
        <div>
            <h1> This is the cart</h1>
        </div>
    );
}
export default Cart;