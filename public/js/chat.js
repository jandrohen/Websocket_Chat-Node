const url = ( window.location.hostname.includes('localhost'))
    ? 'http://localhost:8080/api/auth/'
    : 'https://restserver-curso-node-8.herokuapp.com/api/auth/';

let userAuth = null;
let socket = null;

// Reference HTML
const  txtUid = document.querySelector('#txtUid');
const  txtMsg = document.querySelector('#txtMsg');
const  ulUsers = document.querySelector('#ulUsers');
const  ulMsg = document.querySelector('#ulMsg');
const  btnOut = document.querySelector('#btnOut');


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

    socket = io({
        'extraHeaders':{
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () =>{
        console.log('sockets online')
    })

    socket.on('disconnect', () =>{
        console.log('sockets offline')
    })

    socket.on('receive-message', ()=>{

    });

    socket.on('active-users', mappedUsers);

    socket.on('private-message', ()=>{

    });
}

const mappedUsers = (users = []) => {
  let usersHtml = "";
  users.forEach(({ name, uid }) => {
    usersHtml += `
        <li>
            <p>
                <h5 class="text-success">${name}</h5>
                <span class="fs-6 text-muted">${uid}</span>
            </p>
        </li>
        
        `;
  });

  ulUsers.innerHTML = usersHtml;
};

const main = async () => {
    await validateJWT();
}

main();

