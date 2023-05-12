import {getDatabase,ref,get,set,update,remove,child} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";
const db=getDatabase();

var nameV,emailV,msgV;


var nameBox=document.getElementById('nameBox');
var emailBox=document.getElementById('emailBox');
var msgBox=document.getElementById('msgBox');

function insertData(event){
    event.preventDefault();
    readFormData();
    set(ref(db,"data/"+emailV),{
        name:nameV,
        email:emailV,
        msg:msgV,
    }).then(()=>{
        alert("Done");
    }).catch((error)=>{
        alert("Unsuccessful "+error);
    }); 
    clearform();
}

function readFormData(){
    nameV=nameBox.value;
    emailV=emailBox.value;
    msgV=msgBox.value;
}

function clearform(){
    nameBox.value="";
    emailBox.value="";
    msgBox.value="";
}

document.getElementById("contactbtn").onclick=insertData;
