//https://metmuseum.github.io/

//Retorna un array con los ID disponibles de los objectos
const validID = function (){
    let response = fetch("https://collectionapi.metmuseum.org/public/collection/v1/objects")
    .then(response => response.json())
    .then(data => {
        //Retorna un object 
        return data.objectIDs;
    }) 
    .catch(err => console.error(err))
    return response
}

//Retorna un registro para un objeto pasandose como parametro el ID
//Crea la ruta para obtener el registro.
function getObjectByID(objectID){
    let pathObject = "https://collectionapi.metmuseum.org/public/collection/v1/objects/" + objectID
    //console.log(pathObject);

    fetch(pathObject)
    .then(response => response.json())
    .then(data => {
        //Se creara el objeto con los campos necesarios
        let artworkDetails = 
        {
            objectID: data.objectID,
            title: data.title,
            primaryImageSmall: data.primaryImageSmall,
            country: data.country,
            accesionYear: data.accesionYear,
            repository: data.repository,
            isHighlight: data.isHighlight,
            isPublicDomain: data.isPublicDomain,
            department: data.department,
            culture: data.culture,
            artistDisplayName: data.artistDisplayName,
            artistDisplayBio: data.artistDisplayBio,
            artistBeginDate: data.artistBeginDate,
            artistEndDate: data.artistEndDate,
            objectBeginDate: data.objectBeginDate,
            objectEndDate: data.objectEndDate,
            classification: data.classification

        }
        return artworkDetails;
    })
    .catch(err => console.error(err))
}

let saveObjects = function (){
   console.log(validID().keys())
}


function getAllObjectsByBeginDate(paramBeginDate){
    let counter = 0;
    fetch("https://collectionapi.metmuseum.org/public/collection/v1/objects")
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if(data.artistBeginDate == paramBeginDate ){
            counter++;
        }
    })
    .catch(err => console.error(err))
    console.log(counter)
}

validID()
saveObjects()
