//THROW AN ERROR WHEN NOT INCLUDED IN THIS FILE
const shortid = require('shortid');
module.exports = function (app, io) {
    // i see now your logic of passing the app to your routes function
    // although this will work, it's somehow feels like anti-pattern 
    // express offers routers, which is a way to combine routes toghether
    //look for it in the express documnetation.
    
    //THROW AN ERROR WHEN NOT INCLUDED IN THIS FILE
    const fs = require('fs');

    //GET THE START TIME OF ALL THE REQUESTS

    app.use((req, res, next) => {
        req.Start_time = new Date();
        next();
    })


    //FORM REGISTERATION PAGE THAT HAS SEND REGISTERATION DATA TO THE SERVER AND REDIRECT AACCOURDING TO RESPONSE
    app.get('/index', (req, res, next) => {
        
        res.sendFile(__dirname + '/pages/form_page/index.html', (err) => { if (err) next(err) });
        next();
    })

    //STYLE SHEET OF REGISTERATION FORM PAGE
    app.get('/style1.css', (req, res, next) => {
        res.sendFile(__dirname + '/pages/form_page/style1.css', (err) => { if (err) next(err) });
        next();
    })

    //SCRIPT OF THE REGISTERATION FORM PAGE
    app.get('/script1.js', (req, res, next) => {
        res.sendFile(__dirname + '/pages/form_page/script1.js', (err) => { if (err) next(err) });
        next();
    })





    //REGISTERATION VALIDATION  **// express validateor can be used
    app.post('/register', function (req, res, next) {
        //VALIDATE ACCORDING TO REGEX    
        // awesome use of regex 
        //but, you can make an object, like regexMap = {"englighLetters":/^[a-zA-Z\-]+$/}, then use your regex map in functions, since not all people can understand regex 
        // and you will make it easier to read the meaning behind the code
        /// USE CONST 
        let user_name_check = (/^[a-zA-Z\-]+$/).test(req.body.user_name)
        let password_check = (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/).test(req.body.password)
        let first_name_check = (/^[a-zA-Z\-]+$/).test(req.body.first_name)

        //IF THE VALIDATION IS TRUE APPAND THE NEW DATA AND RETURN RESPONSE
        
        // do early returns 
        if (user_name_check && password_check && first_name_check) {

            const user_db = fs.readFileSync('./usefrs.json', (err) => { if (err) next(err) });
            const user_db_array = JSON.parse(user_db)
            user_db_array.push(
                { "user_name": req.body.user_name, "password": req.body.password, "id": shortid.generate(), "first_name": req.body.first_name }
            )
            fs.writeFileSync('./users.json', JSON.stringify(user_db_array), (err) => { if (err) next(err) });
            res.send({ message: 'user was registered successfully' })

        }
        //IF THE VALIDATION WAS FALSE RETURN ERROR CODE AND MESSAGE
        else {

            res.status(422).send({ errors: 'errors in data validation' })
        }
        next();
    })


    //---------------------------------------------------------------------------


    //LOGIN PAGE
    app.get('/loginPage', (req, res, next) => {
        res.sendFile(__dirname + '/pages/login_page/login.html', (err) => { if (err) next(err) });
        next();
    })



    //STYLE SHEET OF LOGIN IN PAGE
    app.get('/style2.css', (req, res, next) => {
        res.sendFile(__dirname + '/pages/login_page/style2.css', (err) => { if (err) next(err) });
        next();
    })

    //SCRIPT OF THE LOGIN IN PAGE
    app.get('/script2.js', (req, res, next) => {
        res.sendFile(__dirname + '/pages/login_page/script2.js', (err) => { if (err) next(err) });
        next();
    })


    //LOGIN ROUTE TO CHECK FOR THE USER NAME AND PASSWORD AND IT MATCHED CREATE COOKIE AND SEND SUCCESS
    app.post('/login', (req, res, next) => {

        const user_db = fs.readFileSync('./users.json', (err) => { if (err) next(err) });
        const user_db_array = JSON.parse(user_db)
        let user_exist = 0

        for (i = 0; i < user_db_array.length && user_exist === 0; i++) {
            let user_object = user_db_array[i]
            // use filter or find 
            if (user_object.user_name == req.body.user_name && user_object.password == req.body.password) {
                user_exist = 1;
                var expiration_date = new Date(Date.now());
                expiration_date.setDate(expiration_date.getDate() + 1);
                res.cookie('user_name', req.body.user_name, { expires: expiration_date })
                return res.send({ message: "logged in successfully" })
            }
        }

        res.status(422).send({ error: 'invalid credentials' })

        next();
    })


    //---------------------------------------------------------------------------

    //TODOS ROUTE TO RETURN ALL TODO_LIST
    app.get('/todos', async (req, res, next) => {
        res.sendFile(__dirname + '/toDoList.json', (err) => { if (err) next(err) });
    })





    //RETURN TO DO FOR SPECIFIC NAME 
    app.get('/todos/:username', (req, res, next) => {
        const to_do_list = fs.readFileSync('./toDoList.json', (err) => { if (err) next(err) });
        let list = JSON.parse(to_do_list);
        res.send(list.filter(obj => { return obj.user_name === req.params.username }))
        next();
    })



    //POST A TODO ENTRY INTO THE JASON FILE AND CHECK FOR LOGGING BY COOKIE 
    app.post('/todos', (req, res, next) => {
        if (req.cookies.user_name !== '' || typeof req.cookies.user_name == 'undefined') {
            const to_do_list = fs.readFileSync('./toDoList.json', (err) => { if (err) next(err) });
            let list = JSON.parse(to_do_list);
            console.log(shortid.generate())
            // don't mutate, use functions like map, concat, reduce
            list.push(
                { "tilte": req.body.title, "status": "to-do", "id": shortid.generate(), "user_name": req.body.user_name }
            )
            fs.writeFileSync('./toDoList.json', JSON.stringify(list), (err) => { if (err) next(err) });
            res.send("todo created successfully")
        }
        else {
            res.statusCode(500).send({ message: 'sorry you aren\'t logged in  ' })
        }
        next();
    })



// DELETE AN ENTRY BY ID AND CHECK FOR LOGGING BY COOKIE AND FOR OWNERSHIP BY CONDITION IN 
//FIND INDEX
    app.delete('/todos/:id', (req, res, next) => {

        if (req.cookies.user_name !== '' || typeof req.cookies.user_name == 'undefined') {
            const to_do_list = fs.readFileSync('./toDoList.json', (err) => { if (err) next(err) });
            let list = JSON.parse(to_do_list);
            const index_delete_object = list.findIndex(obj => {

                return obj.id == req.params.id && obj.user_name == req.cookies.user_name

            })
            console.log(index_delete_object)        

                list.splice(index_delete_object, 1)  

            fs.writeFileSync('./toDoList.json', JSON.stringify(list), (err) => { if (err) next(err) });
        }
        next()
    })



//EDITING AN ENTY BY ID AND CHECKING FOR LOGGING USING COOKIE AND OWNERSHIIP BY CONDITIONIN
//FIND INDEX
    app.patch('/todos/:id', (req, res, next) => {

        if (req.cookies.user_name !== '' || typeof req.cookies.user_name == 'undefined') {
            const to_do_list = fs.readFileSync('./toDoList.json', (err) => { if (err) next(err) });
            let list = JSON.parse(to_do_list);
            const Index_of_edited_todo = list.findIndex(obj => {
                return obj.id == req.params.id && obj.user_name == req.cookies.user_name
            })
            if (Index_of_edited_todo !== -1) {
                list[Index_of_edited_todo].tilte = req.body.title
                list[Index_of_edited_todo].status = req.body.status
            }

            fs.writeFileSync('./toDoList.json', JSON.stringify(list), (err) => { if (err) next(err) })
        }
    })




// STORING INFORMATION ABOUT EACH REQUEST
    app.use((req, res) => {
        req.end_time = new Date();
        const log_file = fs.readFileSync('./log.json', (err) => {
            if (err) {
                next(err)
            }
        });
        let log_file_data = JSON.parse(log_file);
        log_file_data.push({
            request_method: req.method,
            url: req.originalUrl,
            Start_time: req.Start_time,
            end_time: req.end_time,
            "duration (in milliseconds)": req.end_time - req.Start_time
        })
        fs.writeFileSync('./log.json', JSON.stringify(log_file_data), (err) => { if (err) next(err) });

    })

    // HANDLING ERROR RETURNED FROM READFILE AND WRITE FILE COMMANDS
    app.use(function (err, req, res, next) {

        const error_log = fs.readFileSync('./error_log.json');
        const error_log_array = JSON.parse(error_log)
        err['request_start_time'] = req.Start_time;
        err['request_error_time'] = new Date();
        error_log_array.push(err);
        fs.writeFileSync('./error_log.json', JSON.stringify(error_log_array))
        res.status(500).send('there is an internal error!');

    })


};
