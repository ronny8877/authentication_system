import request from 'supertest';
import User from '../../../source/models/user.model';

let server: any;
let token: string;
let payload: any;


describe('User register path', () => {
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
        token = await new User(payload).generateJwtToken()

    });

    afterEach(async () => {
        await User.remove({});
        await server.close();
    })

    it("should create a new user", async () => {
        const res = await request(server).post("/api/users/routes/register").send(payload);
        expect(res.status).toBe(201);

    })


    it('should return an 401 error if an unauthorized parameter is added', async () => {
        payload.malicious = true;
        const res = await request(server).post("/api/users/routes/register").send(payload);
        expect(res.statusCode).toBe(401);
        expect(res.text).toBe('"malicious" is not allowed');
    })

    it('should return an 400 error if a required parameter is missing', async () => {
        delete payload.email;
        const res = await request(server).post("/api/users/routes/register").send(payload);
        expect(res.statusCode).toBe(401);
        expect(res.text).toBe('"email" is required');
    })



    it('should return an 400 error as user already exist', async () => {
        const res1 = await request(server).post("/api/users/routes/register").send(payload);
        const res = await request(server).post("/api/users/routes/register").send(payload);
        expect(res.statusCode).toBe(400);
        expect(res.text).toBe('User already exists');
    })

    it('should return an 400 error if repeat_password dont match', async () => {
        payload.repeat_password = "1234";
        const res = await request(server).post("/api/users/routes/register").send(payload);
        expect(res.statusCode).toBe(401);
        expect(res.text).toBe('"repeat_password" must be [ref:password]');
    })


    it('should return an 400 error if password is less than 6 characters', async () => {
        payload.password = "1234";
        const res = await request(server).post("/api/users/routes/register").send(payload);
        expect(res.statusCode).toBe(401);
        expect(res.text).toBe('"password" length must be at least 6 characters long');
    })

    it('should return an 400 error if password is more than 30 characters', async () => {
        payload.password = "123456789012345678901123456789012345678901";
        const res = await request(server).post("/api/users/routes/register").send(payload);
        expect(res.statusCode).toBe(401);
        expect(res.text).toBe('"password" length must be less than or equal to 30 characters long');
    })

    it('should return an 400 error if phone is less than 10 characters', async () => {
        payload.phone = "123456789";
        const res = await request(server).post("/api/users/routes/register").send(payload);
        expect(res.statusCode).toBe(401);
        expect(res.text).toBe('"phone" length must be at least 10 characters long');
    })


    it('should return an 400 error if phone is more than 18 characters', async () => {
        payload.phone = "123456789012345678901123456789";
        const res = await request(server).post("/api/users/routes/register").send(payload);
        expect(res.statusCode).toBe(401);
        expect(res.text).toBe('"phone" length must be less than or equal to 18 characters long');
    })


});




describe('User Login path', () => {
    beforeEach(async () => {
        server = await require('../../../source/index');
        payload = {
            email: "xyz@xyz.com",
            password: "123456",

        }
        token = await new User(payload).generateJwtToken()

    });

    afterEach(async () => {
        await User.remove({});
        await server.close();
    })
    async function registerUser() {
        return await request(server).post("/api/users/routes/register").send({
            name: "Test",
            email: "xyz@xyz.com",
            password: "123456",
            phone: "1234567891",
            gender: "male",
            repeat_password: "123456"

        });

    }

    it('should return an 200 response and a token at x-auth-token', async () => {
        await registerUser();
        const res = await request(server).post("/api/users/routes/login").send(payload);
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe('Login Successful');
        //checking if jwt is returned at x-auth-token header
        expect(res.header['x-auth-token']).toBeTruthy();
    })

    it('should return an 401 error if user is not found', async () => {

        const res = await request(server).post("/api/users/routes/login").send(payload);
        expect(res.statusCode).toBe(400);
        expect(res.text).toBe('User with Given credentials not found');
    })

    it('should return an 401 error if password is incorrect', async () => {
        payload.password = "123456789";
        await registerUser();
        const res = await request(server).post("/api/users/routes/login").send(payload);
        expect(res.statusCode).toBe(401);
        expect(res.text).toBe('Email or Password is incorrect');
    })

    it('should return an 400 error if email is incorrect', async () => {
        payload.email = "y@e.com";
        await registerUser();
        const res = await request(server).post("/api/users/routes/login").send(payload);
        expect(res.statusCode).toBe(400);
        expect(res.text).toBe('User with Given credentials not found');
    })

    it('should return an 401 error if email is not provided', async () => {
        delete payload.email;
        const res = await request(server).post("/api/users/routes/login").send(payload);
        expect(res.statusCode).toBe(401);
        expect(res.text).toBe('"email" is required');
    })

    it('should return an 401 error if password is not provided', async () => {
        delete payload.password;
        const res = await request(server).post("/api/users/routes/login").send(payload);
        expect(res.statusCode).toBe(401);
        expect(res.text).toBe('"password" is required');
    })

    it('should return an 400 error if email is not valid', async () => {
        payload.email = "xyz@xyz";
        const res = await request(server).post("/api/users/routes/login").send(payload);
        expect(res.statusCode).toBe(401);
        expect(res.text).toBe('"email" must be a valid email');
    })
    it('should return an 400 error if password is less than 6 characters', async () => {
        payload.password = "12345";
        const res = await request(server).post("/api/users/routes/login").send(payload);
        expect(res.statusCode).toBe(401);
        expect(res.text).toBe('"password" length must be at least 6 characters long');
    })

});