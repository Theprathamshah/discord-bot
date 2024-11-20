import {Options, REST, Routes} from 'discord.js'
import dotenv from 'dotenv'

dotenv.config();

const token = process.env.BOT_TOKEN;
const CLIENT_ID = process.env.USER_ID;


const commands = [
    {
        name: 'ping',
        description: 'Replies with Pong!',
    },
    {
        name: 'verify',
        description: 'This verifies user with a username from chess.com or lichess!',
        options: [
            {
                name: 'username',
                description: 'Your username to verify',
                type: 3,
                required: true,
            },
            {
                name: 'platform',
                description: 'The platform to verify (chess.com or lichess)',
                type: 3,
                required: true,
                choices: [
                    {
                        name: 'Chess.com',
                        value: 'chess.com',
                    },
                    {
                        name: 'Lichess',
                        value: 'lichess',
                    },
                ],
            },
        ],
    },
];
const rest = new REST({version:'10'}).setToken(token);

(async ()=> {
    try {
        console.log('Started refreshing application commands');
        await rest.put(Routes.applicationCommands(CLIENT_ID),{
            body: commands,
        })
        console.log('ended refreshing application commands');
    } catch (error) {
        console.log(error);
    }
})();
