import request from 'supertest';
import User from '../../../source/models/user.model';

let server:any;
let token:string;
let payload: any;


describe('User path', () => {
    beforeEach(async () => {
        server = await require('../../../source/index');
        payload = {
            name: "Test",
            email: "xyz@xyz.com",
            password: "12345",
            phone: "12345678910",
            gender: "male",
            repeat_password: "12345"

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

    it('should return an 400 error if repeat_password dont match',async () => {
      payload.repeat_password = "1234";
        const res = await request(server).post("/api/users/routes/register").send(payload);
        expect(res.statusCode).toBe(401);
        expect(res.text).toBe('"repeat_password" must be [ref:password]');
    })
    
});
