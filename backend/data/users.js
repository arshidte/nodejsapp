import bcrypt from 'bcryptjs';

const users = [
    {
        name: 'user1',
        email: 'user1@gmail.com',
        password: bcrypt.hashSync('user1', 10)
    },
    {
        name: 'user2',
        email: 'user2@gmail.com',
        password: bcrypt.hashSync('user2', 10)
    },
]

export default users;