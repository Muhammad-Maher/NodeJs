const fs = require('fs-extra');
const { Command } = require('commander');

const program = new Command();
const file_path = './file.json'

//THE FIRST TIME THE JS FILE IS RUN IT CHECKS FOR THE EXISTENCE OF JSON FILE AND IF NOT IT CREATE IT
if (!fs.existsSync(file_path)) {
    fs.writeJsonSync(file_path, []);
}



program
    .option('-i, --id <number>', 'id number')
    .option('-t, --title <type>', 'title of the entery')
    // I DIDN'T INCLUDE THE DEFALUT PART HERE TO HANDLE SOME CASES IN BONUS I INCLUDE IT IN ADD FUNCTION 
    .option('-s, --status <type>', 'status of the entry');
program.parse(process.argv);
const options = program.opts();
const command = program.args[0];



// ADD FUNCTION THAT ADD THE NEW ENTRY TO THE FILE IN AN ARRAY OF OBJECTS --NUMBER 1

let add = (options) => {
    //CHECK IF THE TITLE IS INSERTED OR NOT AND THROW ERROR AND STOP EXCUTION IF NOT 
    if (options.title === undefined) {
        console.log('title is required');
        return
    }
    //MAKE A DEFAULT VALUE TO STATUS IF IN WAS UNDEFINED  --BONUS  1
    if (options.status === undefined) {
        options.status = 'to-do'
    }

    //GET THE DATA FROM THE FILE USING MADE FUNCTION fetchData()
    let data_fetch = fetchData();
    //AUTO INCREAMENT THE ID BY  ADD 1 TO THE LAST ID IF EXISTED
    if (data_fetch.length > 0) {

        options.id = data_fetch[ data_fetch.length-1].id + 1
    } else {
        options.id = 1
    }
    //PUSHING THE NEW ENTRY IN THE ARRAY 
    data_fetch.push(options);
    //REWRITE THE FILE AS A WHOLE BY THE NEW ARRAY OF (OLD DATA + PUSHED DATA)
    fs.writeJsonSync(file_path, data_fetch);
}

let fetchData = () => {
    //GET THE DATA FROM THE JSON FILE CREATED
    whole_data = fs.readJsonSync(file_path);
    //RETURN THE DATA TO THE CALLER
    return whole_data;
}

//LIST FUNCTION TO LIST THE EXISTED ENTRIES AS A WHOLE OR BY SPECIFIC STATUS  --NUMBER 2
let list = () => {
    //IF SPECIFC STATUS IS ENTERED THEN FILTER THE DATA ACCORDING TO THE ENTERED STATUS --BONUS 3
    if (options.status !== undefined) {
        let data_fetch_for_status = fetchData();
        let data_of_one_status = data_fetch_for_status.filter(function (element) { return element.status == options.status; })
        console.log(data_of_one_status)
    }
    // DISPLAY THE WHOLE DATA IF THE STATUS ISN'T SPECIFIED
    else {

        const packageObj = fs.readJsonSync(file_path)
        console.log(packageObj)
    }

}

// EDIT FUNCTION TO EDIT EXISTING ENTRY
let edit = (options) => {
    //CHECK FOR THE ID EXISTENEC 
    if (options.id === undefined) {
        console.log('id is required');
        return
    }
    //CHECK THAT ONE OF THE PROPERTIES OF THE ENTRY IS INSERTED TO MAKE AN EDIT OR IT WILL BE REDUNDENT PROCESS --BONUS  2
    if (options.title === undefined && options.status === undefined) {
        console.log('you should enter title or status to edit');
        return
    }
    else if (options.status !== undefined) {
        if (options.status !== 'to-do' && options.status !== 'in progress' && options.status !== 'done') {
            console.log('you should choose value from ["to-do","in progress","done"]');
            return
        }
    }

    // RECIEVE THE DATA FROM fetchData() FUNC
    let data_fetch = fetchData();
    // FIND THE INDEX OF THE REQUIRED ENTRY FOR EDIT THAT WILL ADAPT WITH THE DELETION CASES BECAUSE IT USES THE ID EVERY TIME NOT SUBTRACTING ONE FROM IT TO GET THE INDEX   'INDEX BEFORE DELETION=(ID-1)'
    let index_of_object = data_fetch.findIndex(element => element.id == options.id);
    //CHECK IF THERE IS CHANGE IN STATUS OF TITLE AND UPDATE IT IF EXISTED
    options.status !== undefined ? (data_fetch[index_of_object].status = options.status) : '';
    options.title !== undefined ? (data_fetch[index_of_object].title = options.title) : '';
    //REWRITE THE FILE AGAIN AFTER EDITING THE DESIRED ENTRIES
    fs.writeJsonSync(file_path, data_fetch);
};


//DELETE FUNCTION THAT DELETE ENTRY BY ID --NUMBER 4
let delete_fn = (options) => {
    //CHECK FOR ID ENTERING
    if (options.id === undefined) {
        console.log('id is required');
        return
    }

    //FETCH THE DATA IN FILE
    let data_fetch = fetchData();
    //FILTER THE DATA AND EREASE THE REQUIRED ENTRY BY RETURNING ALL THE ENTRIES THE DON'T EQUAL IT
    let data_after_deleting = data_fetch.filter(function (element) { return element.id != options.id; });
    //REWRITE THE JSON FILE BE THE DATA AFTER DELETION
    fs.writeJsonSync(file_path, data_after_deleting);
}





// SWITH CASE THAT CHECK THE ENTERED FIRST ARGUMENT USING 'program.args[0]' TO APPLY THE REQUIRED OPERATION BY CALLING THE RELEVANT FUNCTION 
switch (command) {
    case "add":
        add(options);
        break;
    case "list":
        list();
        break;
    case "edit":
        edit(options);
        break;
    case "delete":
        delete_fn(options);
        break;
}


//THE PREVIOUSLY RUN COMMANDS
/*
npm init
npm install commander
npm install fs-extra
----[TRIALS]
node index.js add -t 'my first entry' -s 'done'
node index.js add -t 'my second entry'
node index.js add -t 'my third  entry' -s 'in progress'
node index.js edit --id 3 -t 'changed'
node index.js edit --id 3           (ERROR)
node index.js list
node index.js list -s 'done'
node index.js list -s 'in progress'
node index.js edit --id 3 -t 'changed'
node index.js edit -i 2 -s 'done'
node index.js edit -i 2        (ERROR)
node index.js delete -i 2
*/