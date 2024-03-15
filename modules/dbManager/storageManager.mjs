import pg from "pg"
import SuperLogger from "../SuperLogger.mjs";

// We are using an enviorment variable to get the db credentials 
if (process.env.DB_CONNECTIONSTRING == undefined) {
    throw ("You forgot the db connection string");
}
let connectionString = process.env.DB_CONNECTIONSTRING_LOCAL;
if (process.env.ENVIORMENT != "local") {
    connectionString = process.env.DB_CONNECTIONSTRING_PROD;
}

/// TODO: is the structure / design of the DBManager as good as it could be?

class DBManager {

    #credentials = {};

    constructor(connectionString) {
        this.#credentials = {
            connectionString,
            ssl: (process.env.DB_SSL === "true") ? true : false
        };

    }

    async updateUser(user) {

        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('Update "public"."Users" set "name" = $1, "email" = $2, "password" = $3 where id = $4;', [user.name, user.email, user.pswHash, user.id]);

            // Client.Query returns an object of type pg.Result (https://node-postgres.com/apis/result)
            // Of special intrest is the rows and rowCount properties of this object.

            //TODO Did we update the user?

        } catch (error) {
            //TODO : Error handling?? Remember that this is a module seperate from your server 
        } finally {
            client.end(); // Always disconnect from the database.
        }

        return user;

    }

    async deleteUser(user) {

        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('Delete from "public"."Users"  where id = $1;', [user.id]);

            // Client.Query returns an object of type pg.Result (https://node-postgres.com/apis/result)
            // Of special intrest is the rows and rowCount properties of this object.

            //TODO: Did the user get deleted?

        } catch (error) {
            //TODO : Error handling?? Remember that this is a module seperate from your server 
        } finally {
            client.end(); // Always disconnect from the database.
        }

        return user;
    }

    async createUser(user) {

        const client = new pg.Client(this.#credentials);
        
        try {
            await client.connect();
            const output = await client.query('INSERT INTO "public"."Users"("id","name", "email", "password") VALUES(DEFAULT,$1::Text, $2::Text, $3::Text) RETURNING id;', [user.name, user.email, user.pswHash]);
            .

            if (output.rows.length == 1) {
                // We stored the user in the DB.
                user.id = output.rows[0].id;
            }

        } catch (error) {
            console.error(error);
            //TODO : Error handling?? Remember that this is a module seperate from your server 
        } finally {
            client.end(); // Always disconnect from the database.
        }

        return user;

    }
    async getUser(username) {
        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('SELECT * from "public"."Users" where email=$1', [username]);

            // Client.Query returns an object of type pg.Result (https://node-postgres.com/apis/result)
            // Of special intrest is the rows and rowCount properties of this object.

            return output.rows;

        } catch (error) {
            console.error(error);
            return null;
            //TODO : Error handling?? Remember that this is a module seperate from your server 
        } finally {
            client.end(); // Always disconnect from the database.
        }



    }
    async addmessage(userid, msg, motaker) {
        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('INSERT INTO "public"."messenger"("id","date", "userid", "text","motaker") VALUES(DEFAULT,$1, $2, $3::Text,$4) RETURNING id;', ["NOW()", userid, msg, motaker]);





        } catch (error) {
            console.error(error);
            //TODO : Error handling?? Remember that this is a module seperate from your server 
        } finally {
            client.end(); // Always disconnect from the database.
        }

        return userid;


    }
    async getmessages(userid) {
        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('SELECT * from "public"."messenger" where userid=$1 or motaker=$2', [userid,userid]);



            return output.rows;

        } catch (error) {
            console.error(error);
            return null;

        } finally {
            client.end(); // Always disconnect from the database.
        }



    }
    async deletemessage(id) {

        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('Delete from "public"."messenger"  where id = $1;', [id]);
            


        } catch (error) {

        } finally {
            client.end(); // Always disconnect from the database.
        }

        return id;
    }
    async updatemessage(id,msg) {

        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('Update "public"."messenger" set "text" = $1  where id = $2;', [msg,id]);

        

        } catch (error) {
            console.error(error);
        } finally {
            client.end(); 
        }

        return id;

    }
    async getansattmessages() {
        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('SELECT * from "public"."messenger" where motaker=0 or userid=0');



            return output.rows;

        } catch (error) {
            console.error(error);
            return null;

        } finally {
            client.end(); // Always disconnect from the database.
        }



    }
}

//connectionString = process.env["DB_CONNECTIONSTRING_" + process.env.ENVIORMENT.toUpperCase()];






export default new DBManager(connectionString);

//