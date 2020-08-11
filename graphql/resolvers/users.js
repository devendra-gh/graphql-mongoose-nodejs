const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const { SECRETE_KEY } = require('../../config');
const { validateRegisterInput, validateLoginInput } = require('../../util/validators');
const User = require('../../models/Users');


function generateToken(user) {
    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
            username: user.username
        },
        SECRETE_KEY,
        { expiresIn: '1h' }
    );

    return token;
}

module.exports = {
    Mutation: {
        async login(parents, { username, password }) {
            // Validate user data
            const { valid, errors } = validateLoginInput(username, password);

            if (!valid) {
                throw new UserInputError('Errors', { errors })
            }

            const user = await User.findOne({ username });
            if (!user) {
                errors.general = "User not found";
                throw new UserInputError('User not found', {
                    errors
                });
            }

            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                errors.general = "Wrong Credential";
                throw new UserInputError('Wrong Credential', {
                    errors
                });
            }

            const token = generateToken(user);

            return {
                ...user._doc,
                id: user ._id,
                token,
            }
        },

        async register(parents, { registerInput: { username, email, password, confirmPassword } }, context, info) {
            // Validate user data
            const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword);
            if (!valid) {
                throw new UserInputError('Errors', { errors })
            }

            // make sure user does not exit
            const user = await User.findOne({ username });

            if (user) {
                throw new UserInputError('Username is taken', {
                    errors: {
                        username: 'This username is taken'
                    }
                });
            }

            // hash password and create an auth token

            password = await bcrypt.hash(password, 12);

            const newUser = new User({
                username,
                password,
                email,
                createAt: new Date().toISOString()
            });

            const res = await newUser.save();

            const token = generateToken(res);

            return {
                ...res._doc,
                id: res._id,
                token,
            }
        },
    },
};
