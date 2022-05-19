
swal("Escribe tu nombre", {
    content: "input",
})
    .then((value) => {
    swal(`Hola ${value}!!! Te damos la bienvenida`);
});
///////////////////// VARIABLES//////////////


const carritoID = "carrito";
const confirmar = document.querySelector('.botonComprar')
const form = document.createElement("form")
const mediosDePago = document.querySelector('.list').appendChild(form)
const pagos = [
    {
    name: "Paypal",
    id: 0,
    img: "https://1000marcas.net/wp-content/uploads/2019/12/PayPal-emblema.jpg"
    },
    {
    name: "Visa",
    id: 1,
    img: "https://1000marcas.net/wp-content/uploads/2019/12/Visa-Logo-2005.jpg"
    },
    {
    name: "Master",
    id: 2,
    img: "https://www.aguirrezabala.com.ar/public/images/bancos/tarjeta_4.jpg"
    }
]

//////////// COMENTARIOS DE LA API///////////////

const lista = document.querySelector("#listado")
fetch ('https://jsonplaceholder.typicode.com/comments')
    .then (resp => resp.json())
    .then (data => {
        for(let i=0; i<=3; i++) {
            const li = document.createElement("li")
            li.classList.add("card")
            li.classList.add("col-9")
            li.classList.add("list-group-item")

            const nombre = document.createElement("h5")
            nombre.textContent = data[i].name
            

            const comentario = document.createElement("p")
            comentario.textContent = data[i].body

            const email = document.createElement("p")
            email.textContent = data[i].email

            lista.appendChild(li)
            li.appendChild(nombre)
            li.appendChild(comentario)
            li.appendChild(email)
        }
        

    })

function mostrarMediosdePago() {
    pagos.forEach(medio => {
        const divMedio = document.createElement ("label");
        divMedio.classList.add ("card", "pagosCard");
        divMedio.textContent = medio.name;

        const imgMedio = document.createElement ("img");
        imgMedio.src = medio.img;
        imgMedio.classList.add ("imagenMedio");

        const btnMedio = document.createElement ("input");
        btnMedio.className = "boton";
        btnMedio.type = "radio";
        btnMedio.name = "medioPago"
        btnMedio.id = medio.id;

        divMedio.appendChild(imgMedio);
        divMedio.appendChild(btnMedio);
        form.appendChild(divMedio)
    })
}

mostrarMediosdePago()
///////////// LOCAL STORAGE/////
const localStoragee = {
    guardarCarrito: function(objeto) {
        const stringified = JSON.stringify(objeto);
        localStorage.setItem(carritoID, stringified);
        return true;
    },
    obtenerCarrito: function() {
        return JSON.parse(localStorage.getItem(carritoID));
    },
    limpiarCarrito: function() {
        localStorage.removeItem(carritoID);
    }
};

const Adapter = {
    guardarCarrito: function (objeto) {
        const stringified = JSON.stringify(objeto);
    },
    obtenerCarrito: function () {
        return JSON.parse(data);
    },
    limpiarCarrito: function () {
    }
};

const storage = localStoragee;

const helpers = {
    getHtml: function (id) {
        return document.getElementById(id).innerHTML;
    },
    setHtml: function (id, html) {
        document.getElementById(id).innerHTML = html;
        return true;
    },
    
    itemData: function (objeto) {
        let contador = objeto.querySelector(".contador"),
        patt = new RegExp("^[1-9]([0-9]+)?$");
        contador.value = (patt.test(contador.value) === true) ? parseInt(contador.value) : 1;
        let item = {
            name: objeto.getAttribute('data-name'),
            price: objeto.getAttribute('data-price'),
            id: objeto.getAttribute('data-id'),
            contador: contador.value,
            total: parseInt(objeto.getAttribute('data-price')) * parseInt(contador.value)
        };
        return item;
    },
    
    actualizarVista: function () {
        let items = carrito.getItems(),
            template = this.getHtml('cartT'),
            compiled = _.template(template, {
                items: items
            });
        this.setHtml('carritoItems', compiled);
        this.actualizarTotal();
    },
    carritoVacio: function () {
        this.setHtml('carritoItems', '<p>El carrito aun esta vacio</p>');
        this.actualizarTotal();
    },
    
    actualizarTotal: function () {
        this.setHtml('totalPrice', carrito.total + '$');
    }
};


let carrito = {
    contador: 0,
    total: 0,
    items: [],
    
    getItems: function () {
        return this.items;
    },
    
    setItems: function (items) {
        this.items = items;
        for (let i = 0; i < this.items.length; i++) {
            let _item = this.items[i];
            this.total += _item.total;
        }
    },
    
    borrarItems: function () {
        this.items = [];
        this.total = 0;
        storage.limpiarCarrito();
        helpers.carritoVacio();
    },
    
    addItem: function (item) {
        if (this.containsItem(item.id) === false) {
            this.items.push({
                id: item.id,
                name: item.name,
                price: item.price,
                contador: item.contador,
                total: item.price * item.contador
            });
            storage.guardarCarrito(this.items);
        } else {
            this.updateItem(item);
        }
        this.total += item.price * item.contador;
        this.contador += item.contador;
        helpers.actualizarVista();
    },
    
    containsItem: function (id) {
        this.items === undefined && false
        for (let i = 0; i < this.items.length; i++) {
            let _item = this.items[i];            
            if (id == _item.id) {
                return true;
            }
        }
        return false;
    },
    
    updateItem: function (objeto) {
        for (let i = 0; i < this.items.length; i++) {
            let _item = this.items[i];
            if (objeto.id === _item.id) {
                _item.contador = parseInt(objeto.contador) + parseInt(_item.contador);
                _item.total = parseInt(objeto.total) + parseInt(_item.total);
                this.items[i] = _item;
                storage.guardarCarrito(this.items);
            }
        }
    }
    
};

const botonEliminar = document.querySelector(".botonBorrar")



/////////EVENTOS

document.addEventListener('DOMContentLoaded', function () {
    if (storage.obtenerCarrito()) {
        carrito.setItems(storage.obtenerCarrito());
        helpers.actualizarVista();
    } else {
        helpers.carritoVacio();
    }
    const products = document.querySelectorAll('.product button');
    [].forEach.call(products, function (product) {
        product.addEventListener('click', function (e) {
            const item = helpers.itemData(this.parentNode);

            carrito.addItem(item);
            swal ( item.name , " se agregó correctamente " , "success" )   ;
        });
    });

    document.querySelector('#limpiar').addEventListener('click', function (e) {
        carrito.borrarItems();
        swal ( "Ups!" , " vaciaste el carrito " , "error" )
    });
});





confirmar.onclick = () => {
    swal({
        title: "Desea confirmar su compra?",
        text: "Solo falta un paso..",
        icon: "warning",
        confirmButtonColor: 'swalBtnColor',
        buttons: true,
        dangerMode: true,
    })
    .then((willDelete) => {
        if (willDelete) {
        swal("Bien, continuemos..", {
            icon: "success",
        });
        confirmarCompra()
        } else {
        swal("Cancelaste tu compra");
        }
    });

    function confirmarCompra() {
        swal("Escribe tu direccion", {
            content: "input",
        })
        .then((value) => {
            swal({
                title: "Tu compra fue cargada con exito",
                text: "Enviaremos tu pedido a " + value,
                icon: "success",
                button: "Aceptar",
            });
            carrito.borrarItems()
        });
    }
    detectarCheck()
    
}


function detectarCheck (){
    if (document.getElementById("0").checked) {
        alert("Has seleccionado Paypal como medio de pago");
    }
    if (document.getElementById("1").checked) {
        alert("Has seleccionado Visa como medio de pago");
    }
    if (document.getElementById("2").checked) {
        alert("Has seleccionado Mastercard como medio de pago");
    }
}

