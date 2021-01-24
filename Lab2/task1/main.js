//INCLUDING THE REQUIRED MODULES
const { Console } = require('console');
const fs = require('fs');
const http = require('http');
const url = require('url');

//WRITING THE HTML FOR TABLE OF THE TO-DO-LIST BY READING THE JSON FILE AND PARSING THE DATA TO JS OBJECT
//THEN LOOPING AND ADDING EACH OBJECT {TITLE, STATUS} PROPERTIES TO THE TABLE TEMPLATE STRING
let toDo_table = `<table id='table'> <th>title</th> <th>status</th>` ;
let rawdata = fs.readFileSync('./task1_second_solution/db.json');
let student = JSON.parse(rawdata);
student.to_do_list.forEach((value, index) => {
    toDo_table += `<tr><td>${value.title}</td><td>${value.status}</td></tr>`  ;
})

//CLOSING THE TABLE TAG
toDo_table += `</table>`;


//READIND DIREECTORY NATURE AND LOOPING ON ITS IMAGES AND ADD THEM TO TEMPLATE STRING VALRIABLE TO CONCATE
//THEM TO THE HTML CODE
const Images_Exist = fs.readdirSync('./Nature');
let All_images_Tags=``;
for (image  of Images_Exist) {
    All_images_Tags+=`<img src='./Nature/${image}'>`  ;  
}

//READIND DIREECTORY QUOTES AND LOOPING ON ITS IMAGES AND ADD THEM TO TEMPLATE STRING VALRIABLE TO CONCATE
//THEM TO THE HTML CODE
const Images_quotes_Exist = fs.readdirSync('./Quotes');
let All_images_quaots_Tags=``;
for (quote  of Images_quotes_Exist) {
    All_images_quaots_Tags+=`<img src='./Quotes/${quote}'>`   ; 
}


// INCLUDING BOOTSTRAP CDN CSS AND JS BUNDLE FOR breadcrumb
let bootStrap_css=`<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1" crossorigin="anonymous"></link>`;
let bootStrap_cdn= `<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js" integrity="sha384-ygbV9kiqUc6oa4msXn9868pTtWMgiQaeYH7/t7LECLbyPA2x65Kgf80OJFdroafW" crossorigin="anonymous"></script>`;


//CREATING THE SERVER ON PORT 8000
const server = http.createServer((req, res) => {
    res.statusCode = 200;
    //CONVERTING THE REQUESTED URL TO STRING AND GET THA PATH AFTER THE SERVER ADDRESS (AFTER / )
    //WE CAN USE THE req.url AS IT RETURNS THE PATH DIRECTLY
    let pathname =req.url;
    
    //-----------
    //url.parse IS url.parse
            // let pathname=url.parse(req.url).pathname
    //ALTERNATIVE IS 
            //let pathname =(req.url).toString();
    //-----------

    //IF CONDITION TO HUNDLE IF AN IMAGE WAS SENT DINAMICALLY BY IT EXTENTION
    if (req.url.includes(".jpg")) {
        //READ THE IMAGE FILE
        let img = fs.readFileSync(`.${decodeURI(req.url)}`);
        //SET THE ENCODING TYPE
        res.setHeader('content-type', 'image/jpg');
        //SEND THE RESPONSE AS A BUFFERED IMAGE WITH ENCODING TYPE IMAGE
        res.write(img);
        res.end();
    }
    //CHECK IF THE REQUEST IS FOR THE SECOND PAGE
    else if (pathname == '/second_page') {
        res.setHeader('content-type', 'text/html');
        //THE CSS FILE IS SENT ALONE AFTER THE MAIN PAGE SENDING REQUEST FOR THEM --BONUS
        res.write(
            `<html>
                <head>
                        <style>                        
                        </style>                
                        <link rel="stylesheet" type="text/css" href="./second_page.css" />
                        ${bootStrap_css}
                    </head>
                    <body>  

                            <nav style="--bs-breadcrumb-divider: '>';" aria-label="breadcrumb">
                                <ol class="breadcrumb">
                                    <li class="breadcrumb-item"><a href="http://localhost:8000">Home</a></li>
                                    <li class="breadcrumb-item active" aria-current="page">second_page</li>
                                </ol>
                            </nav>

                            <div id='images_div'>
                               ${All_images_Tags}
                            </div>
                            <div id=''>
                                
                            </div>
                            ${bootStrap_cdn}
                    </body>
                </html>`
        );
        res.end();
    }
    // CHECK FOR THE REQUEST IF IT IS CSS FILE THEN READ IT AND RETURN IT TO THE  MAIN PAGE DYNAMICALLY
    else if(req.url.includes(".css")){        
        let css_File = fs.readFileSync(`.${req.url}`);
        res.setHeader('content-type', 'text/css');
        res.write(css_File);
        res.end();
    }
    // CHECK IF THE REQUEST FOR THE THIRD PAGE
    else if (pathname == '/third_page') {
        res.setHeader('content-type', 'text/html');
        res.write(
            `<html>
            <head>
                    
                    <link rel="stylesheet" type="text/css" href="./third_page.css" />
                    ${bootStrap_css}
                </head>
                <body>

                        <nav style="--bs-breadcrumb-divider: '>';" aria-label="breadcrumb">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><a href="http://localhost:8000">Home</a></li>
                                <li class="breadcrumb-item active" aria-current="page">third_page</li>
                            </ol>
                        </nav>
                                            
                        <div id='images_div'>
                           ${All_images_quaots_Tags}
                        </div>
                        <div id=''>
                            
                        </div>
                        ${bootStrap_cdn}
                </body>
            </html>`

        );
        res.end();
    } 
    // ANY OTHER REQUEST BESIDES THE MINTIONED ABOVE WILL BE TREATED AS REQUEST FOR THE HOME PAGE
    else {
        res.setHeader('content-type', 'text/html');
        res.write(
            `<html>
                    <head>
                        <style>
                        </style>
                        <link rel="stylesheet" type="text/css" href="./home.css" />
                        ${bootStrap_css}
                    </head>
                    <body>

                            <nav style="--bs-breadcrumb-divider: '>';" aria-label="breadcrumb">
                                <ol class="breadcrumb">                                    
                                    <li class="breadcrumb-item active" aria-current="page">Home</li>
                                </ol>
                            </nav>
                           
                            <div id='anchorDiv'>
                            <a href='second_page'>second_page</a>
                            <a href='third_page'>third_page</a>
                            </div>
                            <div id='tableDiv'>
                                ${toDo_table}
                            </div>
                            ${bootStrap_cdn}
                    </body>
                </html>`
        );
        res.end();
        }
    
}).listen(8000);

//