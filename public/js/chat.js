const url = ( window.location.hostname.includes('localhost'))
    ? 'http://localhost:8080/api/auth/'
    : 'https://restserver-curso-node-8.herokuapp.com/api/auth/';

let userAuth = null;
let socket = null;

const validateJWT = async() =>{
    const token = localStorage.getItem('token') || '';

    if (token.length <= 10) {
        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    }

    const resp = await fetch( url, {
        headers: { 'x-token': token}
    } );

    const { userAuth: userDB, token: tokenDB } = await resp.json();
    localStorage.setItem('token', tokenDB)
    userAuth = userDB;
    document.title = userAuth.name;

    await connectSocket();
}

const connectSocket = async() =>{
    const socket = io({
        'extraHeaders':{
            'x-token': localStorage.getItem('token')
        }
    });
}
const main = async () => {
    await validateJWT();
}

main();

