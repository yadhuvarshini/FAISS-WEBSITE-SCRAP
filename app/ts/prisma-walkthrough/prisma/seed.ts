import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    let users = await prisma.user.upsert({
       where:{email:"alice@gmail.com"},
        update:{},
        create: {
            name: "Alice",
            email: "alice@gmail.com",
            posts:{
                create:[
                    {
                        title: "My first post",
                        content: "This is the content of my first post.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                        comments:{
                            create: [
                                {
                                    text: "Great post!"
                                },
                                {
                                    text: "Thanks for sharing!"
                                },
                            ],
                        },
                    },
                    {
                        title: "My second post",
                        content: "This is the content of my second post.",
                        comments:{
                            create: [
                                {
                                    text: "Very informative."
                                },
                                {
                                    text: "I learned a lot."
                                },
                            ],
                        },
                    },
                ],
            },
        },
    });

    const bob = await prisma.user.upsert({
        where:{email:"bob@gmail.com"},
            update:{},
            create:
            {
                name: "Bob",
                email: "bob@gmail.com",
                posts:{
                    create:[
                        {
                            title: "Bob's first post",
                            content: "This is the content of Bob's first post.",
                            comments:{
                                create:[
                                    {
                                        text: "Interesting perspective."
                                    },
                                ],
                            },
                        },
                    ],
                },
            },
        });
    console.log({users, bob});
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });

