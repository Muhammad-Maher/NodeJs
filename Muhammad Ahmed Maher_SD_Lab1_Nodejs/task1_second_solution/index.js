// REQUIRE THE lowdb PACKAGE FROM REGITERY
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

//ADD THE LIST TO THE JSON OBJECT 
db.defaults({ to_do_list: [] })
    .write()

//CREATE THE RANDOM ID
const shortid = require('shortid');
const { Command } = require('commander');
const program = new Command();

//SPECIFY COMMANDS
program
    .command('add')
    .option('-i, --id <type>', 'id number')
    .option('-s, --status <type>', 'title of the entery', 'to-do')
    .requiredOption('-t, --title <type>', 'status of the entry')
    .action((options) => {
        // ADD THE GENERATED ID TO THE OPTIONS OBJECT
        options.id = shortid.generate()
        //PUSH THE OBJECT INTO THE 'to_do_list' ARRAY
        db.get('to_do_list').push(options).write()
    })

// SPECIFY LIST COMMAND
program
    .command('list')
    .option('-i, --id <number>', 'add the target id')
    .option('-s, --status <type>', 'status of the todo')
    .option('-t, --title <type>', 'add your to-do text')
    .action((options) => {
        //TRENARY OPERATOR TO CHECK IF THE STATUS IS SPECIFIED OR NOT AND ASSIGN DATA TO BE SHOWN
        let list_entries = options.status ?
            db.get('to_do_list').chain().filter({ status: options.status }).value() : db.getState()

        console.log(list_entries)
    });

    //SPECIFY EDIT COMMAND
program
    .command('edit')
    .requiredOption('-i, --id <type>', 'add the target id')
    .option('-s, --status <type>', 'status of the todo')
    .option('-t, --title <type>', 'add your to-do text')
    .action((options) => {
        //CHECK IF THE REQUIRED EDITED STATUS IS FROM THE ALLAWABLE VALUES
        let status_check = [undefined,"to-do", "in progress", "done"].includes(options.status)

        //IF THE VALUE AREN'T ALLOWED THROW ERROR
        if (!status_check) {
            console.log('you should choose value from ["to-do","in progress","done"]');
            return
        }  
        //ASSIGN THE STATUS IF IT WAS SENT      
        options.status ? db.get('to_do_list').find({ id: options.id }).assign({ status: options.status}).write() : ''
        //ASSIGN THE TITLE IF IT WAS SENT
        options.title ? db.get('to_do_list').find({ id: options.id }).assign({ title: options.title}).write() : ''

    });

    //SPECIFY DELETE COMMAND
program
    .command('delete')
    .requiredOption('-i, --id <type>', 'add the target id')
    .option('-s, --status <type>', 'status of the todo')
    .option('-t, --title <type>', 'add your to-do text')
    .action((options) => {   
        //DELETE THE ENTRY  AT THE SPECIFIED ID
        db.get('to_do_list').remove({ id: options.id }).write()
    }
    );
program.parse(process.argv);


//THE PREVIOUSLY RUN COMMANDS
/*
npm init
npm install lowdb
npm install commander
npm install shortid
----[TRIALS]
node index.js add -t 'my first entry' -s 'done'
node index.js add -t 'my second entry'
node index.js add -t 'my third  entry' -s 'in progress'
node index.js list -s 'in progress'
node index.js list
node index.js edit --id (id) -t 'changed'
node index.js list -s 'done'
node index.js edit -i (id) -s 'done'
node index.js delete -i (id)
*/
