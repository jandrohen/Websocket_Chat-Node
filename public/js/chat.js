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

    socket.on('receive-message',mappedMessages);

    socket.on('active-users', mappedUsers);

    socket.on('private-message', ( payload )=>{
        console.log('Private: ', payload )
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

const mappedMessages = (messages = []) => {
    let messagesHtml = "";
    messages.forEach(({ name, message }) => {
        messagesHtml += `
        <li>
            <p>
                <span class="text-primary">${name}</span>
                <span>${message}</span>
            </p>
        </li>
        
        `;
    });

    ulMsg.innerHTML = messagesHtml;
};

txtMsg.addEventListener('keyup', ({ keyCode })=>{
    const message = txtMsg.value;
    const uid = txtUid.value;

    if ( keyCode !==13) { return; }
    if (message.length === 0){ return; }
    socket.emit("send-message", { uid, message });

    txtMsg.value = '';

})

const main = async () => {
    await validateJWT();
}

main();

