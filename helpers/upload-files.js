const path = require('path');
const { v4: uuidv4 } = require('uuid');


const uploadFiles = ( files, validateFormat = ['png','jpg','jpeg','gif'], dir = '' ) =>{

    return new Promise((resolve, reject) =>{

        const { archivo } = files;
        const modifyName = archivo.name.split('.');
        const format = modifyName[ modifyName.length - 1 ];

        // Validate the format
        if (!validateFormat.includes(format.toLowerCase())) {
           return reject(`La extension ${ format } no es permitida - ${ validateFormat }`)
        }

        const finalName = uuidv4() + '.' + format;
        const uploadPath = path.join( __dirname , '../uploads/' , dir ,finalName );

        archivo.mv(uploadPath, (err) => {
            if (err) {
                reject(err);
            }

            resolve(finalName);
        });
    })

}

module.exports = {
    uploadFiles
}
