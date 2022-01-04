import { functionsIn } from 'lodash';
import request from 'supertest';
import User from '../../../source/models/user.model';

let server: any;
let token: string;
let payload: any;


describe('Token generations', () => {
    beforeEach(async () => {
        server = await require('../../../source/index');
        payload = {
            name: "Test",
            email: "xyz@xyz.com",
            password: "123456",
            phone: "1234567891",
            gender: "male",
            repeat_password: "123456"

        }
        //creating a new user for tests 

        async function register() {
            return await request(server).post("/api/users/routes/register").send(payload);

        }



    })



});